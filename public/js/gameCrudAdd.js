/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

var id;   //Used for storing date and time of game
var teamName; //Used to store the team name


/*
 Handles functionality to add a game schedule entry
 */
function handleAddGame(){
  var gameType = document.getElementById("gameType").value.trim();
  var them = document.getElementById("addOpponentTeam").value.trim();
  var location = document.getElementById("addLocation").value.trim();
  var datetime = document.getElementById("addDateTime").value;
  var status = document.getElementById("status").value.trim();

  firebase.database().ref('/Games/' + datetime).set({
      gameType: gameType,
      them: them,
      location: location,
      datetime: datetime,
      status: status,      
  }).then(function onSuccess(res) {
      window.location = "/view-game-schedule.html";
  }).catch(function onError(err) {
      // Handle Error 
  });
}

/*
 Updates firesbase with game schedule entry data
 */
function handleUpdate() {
  "use strict";

  var inputs = document.querySelectorAll('.form-control');
  var datetime = localStorage.getItem('datetime');

  if (datetime!= null) {
    firebase.database().ref('/Games/GameId:' + id).update({
      them: inputs[0].value,
      location: inputs[1].value,
      datetime: inputs[2].value
    }).then(function (res) {
      window.location = "/view-game-schedule.html";
    });
  } else {
    alert('invalid id');
  }
}

/*
 Populates the page with all game schedule entries
 */
function handleReadGame(){
  var query = firebase.database().ref("Games").orderByKey();
  query.once("value").then(function(snapshot) {
    // Iterate over every game schedule entry
    snapshot.forEach(function(childSnapshot) {

      var gameType = childSnapshot.child("gameType").val();
      var them = childSnapshot.child("them").val();
      var location = childSnapshot.child("location").val();
      var datetime = childSnapshot.child("datetime").val();
      var status = childSnapshot.child("status").val();
      var tmpl = document.getElementById('previousGame').content.cloneNode(true);
      tmpl.querySelector('.datetime').innerText = datetime;
      tmpl.querySelector('.gLocation').innerText = location;
      tmpl.querySelector('.matchUp').innerText = "My Team vs " + them;
      tmpl.querySelector('.gameType').innerHTML = status + " : " + gameType;
      tmpl.querySelector('.viewMatchStatsButton').value = datetime;
      tmpl.querySelector('.editScheduleButton').value = datetime;
      document.querySelector('#viewPrevious').appendChild(tmpl);
    });      
  });
}

/*
 Save the date and time of a game schedule entry onto local storage for later use
 */
function saveGame(objButton){
  var fired_button = objButton.value();
  localStorage.setItem("datetime", fired_button);
}

/*
 Increment the amount of games the team is going to be playing
 */
document.addEventListener("DOMContentLoaded", function (event) {
  "use strict";
  firebase.database().ref('/Globals').once('value').then(function (snapshot) {
    teamName = snapshot.child('TeamName');
    id = snapshot.child('GameCounter').val();
    firebase.database().ref('/Globals/GameCounter').set(parseInt(id, 10) + 1);
  });
});

/* ESLint Problems: None */