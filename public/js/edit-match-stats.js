/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

var id;
var teamName;

/* 
 Updates the firebase database with the stats of a match from a game schedule 
 entry. Game schedule entry is identified by its datetime value.
 */
function handleUpdate() {
  "use strict";

  var id = localStorage.getItem("datetime");    
  var inputs = document.querySelectorAll('.form-control');

  if (id != null) {
    firebase.database().ref('/Games/' + id).update({
      datetime: inputs[0].value,
      location: inputs[1].value,
      gameType: inputs[2].value,
      status: inputs[3].value,
      them: inputs[4].value,
      stats: {
        us: {
          "0-foul": parseInt(inputs[5].value, 10),
          "1-red-card": parseInt(inputs[7].value, 10),
          "2-yellow-card": parseInt(inputs[9].value, 10),
          "3-shot-on-goal": parseInt(inputs[11].value, 10),
          "4-goal": parseInt(inputs[13].value, 10),
          "5-corner-kick": parseInt(inputs[15].value, 10),
          "6-goal-kick": parseInt(inputs[17].value, 10),
          "7-p-time": inputs[19].value
        },
        them: {
          "0-foul": parseInt(inputs[6].value, 10),
          "1-red-card": parseInt(inputs[8].value, 10),
          "2-yellow-card": parseInt(inputs[10].value, 10),
          "3-shot-on-goal": parseInt(inputs[12].value, 10),
          "4-goal": parseInt(inputs[14].value, 10),
          "5-corner-kick": parseInt(inputs[16].value, 10),
          "6-goal-kick": parseInt(inputs[18].value, 10),
          "7-p-time": inputs[20].value
        }
      }
    }).then(function (res) {
      window.location = "/teamstats.html";
    });
  } else {
    alert('invalid id');
  }
}

/*
 Deletes all recorded stats for a game schedule entry.
 */
function handleDelete() {
  "use strict";
  id = localStorage.getItem("datetime");     
  if (confirm("Are you sure you want to delete these match stats?")) {
    if (id != null) {
      firebase.database().ref('/Games/' + id).set(null).then(function (res) {
        window.location = "/teamstats.html";
      });
    } else {
      alert('invalid id');
    }
  }
}

/* 
 Populate edit match stats table when the page is loaded.
 */
document.addEventListener("DOMContentLoaded", function (event) {
  "use strict";
  firebase.database().ref('/Globals').once('value').then(function (snapshot) {
    teamName = snapshot.child('TeamName');
  });
  
  // Get match stats ID from local storage
  var id = localStorage.getItem("datetime");

  if (id != null) {
    firebase.database().ref('/Games/' + id).once('value').then(function (snapshot) {
      if (!snapshot.exists()) {
        alert('Not a recorded game');
        window.location = "/view-game-schedule.html";
      }

      var datetime = snapshot.child('datetime'),
          status = snapshot.child('status'),
          location = snapshot.child('location'),
          type = snapshot.child('gameType'),
          themName = snapshot.child('them'),
          us = snapshot.child('stats').child('us'),
          them = snapshot.child('stats').child('them'),
          usCtr = 5,
          themCtr = 6,
          inputs = document.querySelectorAll('.form-control');

      inputs[0].value = datetime.val();
      inputs[1].value = location.val();
      inputs[2].value = type.val();
      inputs[3].value = status.val();
      inputs[4].value = themName.val();

      us.forEach(function (childSnapshot) {
        inputs[usCtr].value = childSnapshot.val();
        usCtr += 2;
      });

      them.forEach(function (childSnapshot) {
        inputs[themCtr].value = childSnapshot.val();
        themCtr += 2;
      });

      document.getElementById('them').innerHTML = themName.val();
      document.getElementById('us').innerHTML = teamName.val();
    });
  }   
});

/*ESLint Problems: None */