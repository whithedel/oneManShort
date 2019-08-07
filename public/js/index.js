// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $registerBtn = $("#register")
var $exampleList = $("#example-list");
var $email = $("#email");
var $username = $("#staticUserName");
var $password = $("#inputPassword1");
var $passwordMatch = $("#inputPassword2");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example),
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// the userReq object for each kind of request we'll make.
var userReq = {
  saveUser: function (user) {
    return $.ajax({
      type: "POST",
      url: "/register",
      data: user
    })
  },
};

// handleFormRegister is call whenever we submit a new user then saves if in the database.
var handleFormRegister = function(){
  event.preventDefault();
  console.log("in the handleformregister");
  var user = {
    email: $email.val().trim(),
    password: $password.val().trim(),
    passwordMatch : $passwordMatch.val().trim()
  };

  // if (!(user.email && user.password)) {
  //   alert("You must enter an email and password!");
  //   return;
  // };

  userReq.saveUser(user).then(function(){
    //window.location.replace("http://localhost:3000/");
  })
}

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    console.log(data)
    console.log(`123456678788`)
    var $examples = data.map(function(example) {
      console.log(example)
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);
        console.log(JSON.stringify($li))
      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// takes in the email form the email input then splits it to take 
//the first index and sets it as the value attr to the username section
var emailInputChange = function(){
  console.log("IM in here")
  var username = $email.val().trim().split(`@`)[0]
  $username.attr(`value`,username)
}

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

// Add event listener to the email input on the registration form. 
$email.change(emailInputChange);
// Add event listener to the register button.
$registerBtn.on("click", handleFormRegister);

