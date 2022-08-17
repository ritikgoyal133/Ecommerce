window.home = function () {
  var op = {};
  op.validate = function () {
    $(".new_user").validate({
      rules: {
        "user[username]": {
          required: true,
          minlength: 5
        },
        "user[address]": {
          required: true,
          minlength: 5
        },
        "user[email]": {
          required: true,
          email: true
        },
        "user[password]": {
          required: true,
          minlength: 5
        },
        "user[password_confirmation]": {
          required: true,
          minlength: 5,
          equalTo: "#user_password"
        }
      },
      messages: {
        "user[username]": {
          required: "Please enter your username"
        },

        "user[address]": {
          required: "Please enter your address"
        },

        "user[password]": {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long"
        },
        "user[email]": {
          required: "Please enter email",
          minlength: "Please enter valid email"
        },
        "user[password]": {
          required: " Please enter a password",
          minlength: " Your password must be consist of at least 5 characters"
        },
        "user[password_confirmation]": {
          required: " Please enter a password",
          minlength: " Your password must be consist of at least 5 characters",
          equalTo: " Please enter the same password as above"
        }

      },
      submitHandler: function (f) {
        // form.submit();
        if (
          username == true &&
          address == true &&
          email == true &&
          password == true &&
          confirmPassword == true) {
          return f.submit();
        } else {
          return false;
        }

      }
    });

  }
  return op;
};