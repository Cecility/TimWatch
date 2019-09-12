/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

function handleSignUp() {
  "use strict";
  var fName = document.getElementById("inputFName").value.trim(),
      lName = document.getElementById("inputLName").value.trim(),
      email = document.getElementById("inputEmail").value.trim(),
      password = document.getElementById("inputPassword").value,
      tos = document.getElementById("tosAgree").checked;

  var coach = document.getElementById("sign-up-coach").checked;
  var manager = document.getElementById("sign-up-manager").checked;
  var other = document.getElementById("sign-up-other").checked;
  
  // make sure the user agrees to the terms of service
  if (!tos) {
    alert("Please accept the tos");
    return;
  }

  // password error handling
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      
      // fetch userID
      firebase.database().ref('/Users/' + user.uid).set({
        fName: fName,
        lName: lName,
        email: email,
        tos: tos,
        coach: coach,
        manager: manager,
        other: other
      }).then(function onSuccess(res) {
        localStorage.setItem("user",user.uid);   
        window.location = "/view-game-schedule.html";
      }).catch(function onError(err) {
        // Handle Error
      });
    } 
  });
}


/*ESLint Problems: None */
