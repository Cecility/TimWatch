/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

/*
 Authenticates user with email and password.
 */
function handleLogin() {
  "use strict";
  var email = document.getElementById("inputEmail").value.trim(),
    password = document.getElementById("inputPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
  });
}

/*
 Store user id in local storage and redirect to main page upon
 successful authentication.
 */
firebase.auth().onAuthStateChanged(function (user) {
  "use strict";
  if (user) {
    localStorage.setItem("user",user.uid);  
    window.location = "/view-game-schedule.html";
  }
});

/* ESLint Problems: None */