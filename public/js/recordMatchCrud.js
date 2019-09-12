/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

var id;
var teamName;


/*
   Updates inputted match stats into the corresponding game
*/
function handleUpdate() {
  "use strict";

  var inputs = document.querySelectorAll('.form-control');
  var datetime = localStorage.getItem("datetime");
  
  // if the local storage value was correctly passed in
  if (datetime != null) {
    // find the corresponding game and insert match data into it
    firebase.database().ref('/Games/' + datetime).update({
      stats: {
        us: {
          "0-foul": inputs[1].value,
          "1-red-card": inputs[3].value,
          "2-yellow-card": inputs[5].value,
          "3-shot-on-goal": inputs[7].value,
          "4-goal": inputs[9].value,
          "5-corner-kick": inputs[11].value,
          "6-goal-kick": inputs[13].value,
          "7-p-time": inputs[15].value
        },
        them: {
          "0-foul": inputs[2].value,
          "1-red-card": inputs[4].value,
          "2-yellow-card": inputs[6].value,
          "3-shot-on-goal": inputs[8].value,
          "4-goal": inputs[10].value,
          "5-corner-kick": inputs[12].value,
          "6-goal-kick": inputs[14].value,
          "7-p-time": inputs[16].value
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
  validates that the person who is trying to access Record Match is either a 
  manager or a coach
*/
function handleAccessRecordMatch(){
  var userId = localStorage.getItem("user");
  if(userId != null){
    var query = firebase.database().ref('Users/' + userId);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();

      if(coach == true || manager == true){
        document.getElementById('record-match-id').className = "nav-item active";
      }

    })
  }
}

/*
  Sets the page upon load and responds appropriately.
  Updates global variables, dynamically changes team names, etc.
*/
document.addEventListener("DOMContentLoaded", function (event) {
  "use strict";
  firebase.database().ref('/Globals').once('value').then(function (snapshot) {
    teamName = snapshot.child('TeamName');
    id = snapshot.child('GameCounter').val();
    document.getElementById('us').innerHTML = teamName.val();
    firebase.database().ref('/Globals/GameCounter').set(parseInt(id, 10) + 1);
  });
})

/*
  Populates the drop down with a list of all date + times 
  of existing games to choose from 
*/
function handleChooseDate(){
  var dropdown = document.getElementById("datetimeDropdown");
  var query = firebase.database().ref("Games").orderByKey();

  // manually add in a first option of notifying the user to select a date and time
  var option2 = document.createElement("option");
  option2.text = "Select a date & time";
  dropdown.add(option2);
  
  // parse through the database, push all date and time as options
  query.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){ // looping
      var datetime = childSnapshot.child("datetime").val();
      var option = document.createElement("option");
      option.text = datetime;
      dropdown.add(option);
    })
  })
}

/*
  Update display information (opponent and location) every time a user selects
  an option from the dropdown with the corresponding metadata
*/
function changeField(){
  var dropdownText = 0;
  var dropdown = document.getElementById("datetimeDropdown");
  
  for(var i = 0, len = dropdown.options.length; i < len; i++){
    var opt = dropdown.options[i];
    if (opt.selected === true){
      dropdownText = opt.text
    }
  }
  
  // change innerHTML
  var opponentName = firebase.database().ref("Games/" + dropdownText);
  opponentName.once("value").then(function(snapshot){
    var opponentNameVal = snapshot.child("them").val();
    var locationNameVal = snapshot.child("location").val();
    document.getElementById("opponentName").innerHTML = opponentNameVal;  
    document.getElementById("locationName").innerHTML = locationNameVal;
  })
  
}