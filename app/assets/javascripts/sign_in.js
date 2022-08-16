$(function() {
    $(".new_user").validate({
      rules: {
        "user[email]": { 
          required: true, 
          email:true 
        },
        "user[password]": {
          required: true,
          minlength: 5
        },
      },
      messages: {
         "user[email]": {
          required: "Please enter email",
          minlength: "Please enter valid email"
        },
        "user[password]":{
          required: " Please enter a password",
          minlength: " Your password must be consist of at least 5 characters"
        }
     },
      submitHandler: function(form) {
        // form.submit();
        if (
          email == true &&
          password == true ) {
          return f.submit();
        } else {
          return false;
        }

        }
    });
  });