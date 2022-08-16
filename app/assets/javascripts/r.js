window.home = function() {
    var op = {};
  
    op.initialize = function($input, $container, data, variantData, personalizedData, newShelvesData, trendingShelfData, promotionalPopoverData) {
      if (variantData && variantData.length) {
        for (var j = 0; j < variantData.length; j++) {
          var eventProperties = {"version": variantData[j].version, "page": 'home', "path": window.location.href};
          var user = as.getCurrentUser();
          var isLoggedIn = user != null && user.id != null;
          if (variantData[j].eventName == 'ViewHomePage') {
            eventProperties['loggedin'] = isLoggedIn;
          }
          window.tracker.trackEvent({
            trackAH: false,
            trackGA: false,
            trackHerolytics: false,
            haProps: {eventName: variantData[j].eventName, eventProps: eventProperties}
          });
          if (variantData[j].eventName == 'ViewLoggedInHomePage-2019-6-12' && variantData[j].version == '2019-6-12-more-sections') {
            modifyTitle = true;
          }
        }
      }
  
      commonUtils.bindHomeCityFormEvents();
  
      var $activityType = $('#activity-type-options');
  
      $activityType.on('change', function() {
        var elem = $(this).data('target');
        var activityName = $(this).find('option:selected').text();
        $(elem).text(activityName);
      });
  
      $('.primary-button-v2').on('click', function() {
        var basePath = '/search?';
        var activityType = $activityType.val() == 'class' ? 'activity_types=class&' : 'activity_types=camp&';
        window.location.href = basePath + activityType + 'source=home';
      });
  
      $('.show-all-categories-link').on('click', function() {
        var link = $(".active-category").data('redirect') || '/activities';
        window.location.href = link;
      });
  
      var isSmallDevice = $(window).width() < window.ah.BREAKPOINTS.XS_MAX;
  
      newCategoriesData = newShelvesData;
      if (newCategoriesData) {
        homeShelves.setLoadingIndicatorHeight();
        $('[data-toggle="tooltip"]').tooltip();
        homeShelves.initialize(newCategoriesData, false, modifyTitle, false);
        homeShelves.eventHandlers();
        if (isSmallDevice) {
          $('.blog-posts').addClass('horizontal-scrollable');
        }
      }
  
      var $trendingContainer = $('#trending-activities-container');
  
      if (trendingShelfData) {
        var $shelfTemplate = HoganTemplates['activity/shelf'];
        var trendingCells = '';
        for (var index = 0; index < trendingShelfData.length; index++) {
          window.ah.searchUtils.transformResult(trendingShelfData[index]['activity_schedule'], null, null, null, null, null);
          trendingShelfData[index]['activity_schedule']['hideActivityInfo'] = true;
          trendingShelfData[index]['activity_schedule']['isSwipeable'] = commonUtils.isSmallDevice();
          trendingCells += providerUtils.getRenderedCell(trendingShelfData[index]['activity_schedule']);
        }
        if (commonUtils.isSmallDevice()) {
          $trendingContainer.addClass('horizontal-scrollable');
        }
        $trendingContainer.html($shelfTemplate.render({
          shelfType: 'trending-activities',
          name: "<strong>Top 10</strong> Trending This Week",
          content: trendingCells,
          trendingActivities: true
        }));
        if (commonUtils.isSmallDevice()) {
          commonUtils.lazyLoadImages($trendingContainer.find('.owl-lazy'), $trendingContainer.find('.owl-carousel'));
          commonUtils.replaceBrokenImages();
        } else {
          var STR = {
            0: { items: 1, nav: true },
            640: { items: 2, nav: true },
            768: { items: 3, nav: true },
            1200: { items: 3, nav: true },
            1600: { items: 4, nav: true },
            1920: { items: 5, nav: true }
          };
          // init owl carousel
          $('#trending-activities-shelf-content').owlCarousel({
            responsive: STR,
            nav: true,
            navText: ['', ''],
            dots: false,
            loop: false,
            lazyLoad: true,
            rewind: false,
            slideBy: 'page'
          });
        }
      }
  
      if (personalizedData) {
        // binding click event on see schedule btn
        window.ahSearchMeta = { userFavorites: personalizedData.user_favorites };
        // shelf.initialize({ container: $('#personalized-recently-viewed'), title: 'Recently Viewed Activities'});
        // shelf.loadRecentlyViewedCompleteTile(isSmallDevice, 'home');
        if (isSmallDevice) {
          $('.themes').addClass('horizontal-scrollable');
        }
        if (personalizedData.themeData) {
          var theme = personalizedData.themeData;
          if (modifyTitle) {
            var shelves = theme.data.shelves;
            for (var k = 0; k < shelves.length; k++) {
              shelves[k].name = shelves[k].name.indexOf('Popular') == -1 ? 'Popular ' + shelves[k].name : shelves[k].name;
            }
          }
          /* eslint-disable new-cap */
          var themeUtils = new window.themeUtils();
          /* eslint-enable new-cap */
          themeUtils.load({
            theme: theme.data,
            container: $('#camps-classes-sugesstions'),
            linkToThemeSlug: true,
            personalizedHomePage: true,
            isSwipeable: isSmallDevice,
            page: 'home'
          });
        }
  
        var shelvesArr = [];
        if (personalizedData.children_data) {
          var ages = Object.keys(personalizedData.children_data.ages);
          if (!ages.length) { return; }
          var childParams = [];
          var queryParams = [];
  
          queryParams.push('activity_types=online');
          for (var i = 0; i < ages.length; i++) {
            childParams.push(prepareLinkForChildAge(ages[i]));
            if (ages[i] != 0) {
              queryParams.push('ages=' + ages[i]);
            }
          }
          childParams.push('source=home');
          if (ages.length && ages[0] == 0) {
            ages[0] = "under 1";
          }
          var shelfTitle;
          // if we change shelfTitle make sure make changes in theme-utils.js too
          // coz we are randomizing tile order for children age shelf & to do that
          // we check conditions i.e. query & shelf["name"].indexOf("Best Activities") != -1
          // so if we don't do that the random sorting will not work.
          if (personalizedData.show_recommendation_shelf) {
            if (personalizedData.children_data.interests) {
              childParams.push('categories=' + personalizedData.children_data.interests);
              queryParams.push('categories=' + personalizedData.children_data.interests);
            }
            shelfTitle = 'Recommended For You';
          } else if (ages.length > 1) {
            shelfTitle = 'Best Activities for ' + ages.slice(0, -1).join(', ') + ' and ' + ages.slice(-1) + ' year olds';
          } else if (ages.length) {
            shelfTitle = 'Best Activities for ' + ages[0] + ' year old';
          }
          var ageSeeAllLink = '/recommendations';
          shelvesArr.push(prepareShelfObj(shelfTitle, queryParams.join('&'), ageSeeAllLink));
        }
  
        if (shelvesArr.length) {
          var obj = {'shelves': shelvesArr};
          /* eslint-disable new-cap */
          var tUtils = new window.themeUtils();
          /* eslint-enable new-cap */
          tUtils.load({
            theme: obj,
            container: $('#suggestions-for-children'),
            linkToThemeSlug: false,
            personalizedHomePage: true,
            isSwipeable: isSmallDevice,
            page: 'home'
          });
        }
        commonUtils.trackActivityTilesEvent('home');
      }
  
      if (promotionalPopoverData) {
        $('body').append($promoModalTemplate.render({
          heading: promotionalPopoverData.heading,
          description: promotionalPopoverData.description,
          imageUrl: promotionalPopoverData.image_url,
          shoppingBtnUrl: promotionalPopoverData.cta_link,
          shoppingBtnText: promotionalPopoverData.cta,
          promocode: promotionalPopoverData.promocode
        }));
        var $promotionModal = $('#promotional-modal');
        $promotionModal.modal('show').on('hide.bs.modal', function() {
          $($promotionModal, 'body').remove();
        });
  
        $promotionModal.on('shown.bs.modal', function() {
          $('.start-shopping').on('click', function() {
            window.tracker.trackEvent({
              trackAH: false,
              trackGA: false,
              trackHerolytics: false,
              haProps: {eventName: 'ClickOnHomePagePopover', eventProps: { 'page': 'home' }}
            });
            var redirectUrl = $(this).data('redirectUrl');
            if (redirectUrl) {
              window.location.href = redirectUrl;
            }
          });
  
          $('.copy-btn').on('click', function() {
            var txt = document.createElement('textarea');
            document.body.appendChild(txt);
            txt.value = txt.textContent = $('.promo-text').text().trim();
            var sel = getSelection();
            var range = document.createRange();
            range.selectNode(txt);
            sel.removeAllRanges();
            sel.addRange(range);
            if (document.execCommand('copy')) {
              $(this).text('copied');
            }
            document.body.removeChild(txt);
          });
        });
      }
  
      $helpText = $input.parent().find('.help-text');
      allCities = data;
      $input.autocomplete({
        minChars: 1,
        autoSelectFirst: true,
        preserveInput: true,
        appendTo: $container,
        maxHeight: 500,
        lookup: transformResult(),
        formatResult: function(suggestion) {
          var $cityAutoCompleteListItem = HoganTemplates['search/city-auto-complete-list-item'];
          var itemInfo = {heading: suggestion.value};
          return $cityAutoCompleteListItem.render(itemInfo);
        },
        beforeRender: function(container) {
          var dataIndex = container.find('.suggestion-row').length;
          container.append('<div class="autocomplete-suggestion" data-index="' + dataIndex + '"><div class="suggestion-row"><div id="see-all">See all cities <i class="fa fa-angle-right"></i></div></div></div>');
        },
        onSelect: function(suggestion) {
          $helpText.css('visibility', 'hidden');
          $('.get-started-btn').prop('disabled', false);
          $input.val(suggestion.value).attr('data-location', suggestion.data['url']);
        }
      });
  
      $input.on('keyup', function(e) {
        var code = e.keyCode || e.which;
        if (code == ENTER_KEY_CODE) {
          return;
        }
        $helpText.css('visibility', 'visible');
        $input.attr('data-location', '');
        $('.get-started-btn').prop('disabled', true);
      });
  
      $('#city-search-form').submit(function(e) {
        e.preventDefault();
  
        if (!$input.val() || !$input.attr('data-location')) {
          return;
        }
        var allKeys = Object.keys(allCities);
        var val = $input.val().toLowerCase().replace(/ /g, '-').replace(/\./g, '').replace(',', '');
        if (allKeys.indexOf(val) <= -1) {
          $helpText.css('visibility', 'visible');
          return;
        }
        $helpText.css('visibility', 'hidden');
        window.location.href = $input.attr('data-location');
      });
  
      $(document).on('click', '#see-all', function(e) {
        e.preventDefault();
        window.location.href = '/cities';
      });
  
      $(document).on(ah.CUSTOM_EVENTS.SEARCH_LOADED, function() {
        $('.popular-category-loading').addClass('hidden');
      });
    };
  
    return op;
  };