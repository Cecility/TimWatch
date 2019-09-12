/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

var id; // Used to store date and time of game schedule entry
var teamName; // Used to store the opponent team's name

/*
 Adds a game schedule entry to schedule. Game schedule entry is identified by 
 its datetime value.
 */
function handleAddGame() {
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
 Hides elements upon loading the page based on user permissions.
 */
function handleAccessGameSchedule() {
  var userId = localStorage.getItem("user");
  if (userId != null) {
    var query = firebase.database().ref('Users/' + userId);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();

      if(coach == true || manager == true){
        document.getElementById('nav-edit-schedule').className = "desktop-hidden";
        document.getElementById('game-schedule-record-id').className = "nav-item";
        document.getElementById('add-new-game').style.display = "inline-block";   
      }
    });
  }
}

/*
 Updates game schedule entry with updated event information.
 */
function handleUpdate() {
  "use strict";

  var datetime = localStorage.getItem('datetime');
  var inputs = document.querySelectorAll('.form-control');

  if (datetime != null) {
    firebase.database().ref('/Games/' + datetime).update({
      // document.getElementById(status);
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
 Handles the population of the game schedule page.
 */
function handleReadGame() {
  var id = localStorage.getItem("user");
  if(id != null) {
    var query = firebase.database().ref('Users/' + id);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();
      
        if(coach == true || manager == true){
          handleReadAllowEdits();  
        }
        else{
          handleReadNoEdits();
        }
    });
  }          
}


/*
 Handle the population of entries of the upcoming games schedule page.
 */
function handleReadUpcomingGame(date) {       
  var id = localStorage.getItem("user");
  if(id != null) {
    var query = firebase.database().ref('Users/' + id);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();

        if(coach == true || manager == true){
          handleReadUpcomingAllowEdits(date);  
        }
        else{
          handleReadUpcomingNoEdits(date);
        }
    });
  }
}

/*
 Displays game schedule with edit functionality
 */
function handleReadAllowEdits() {
  var query = firebase.database().ref("Games").orderByKey();
  query.once("value").then(function(snapshot) {
    // Iterate over every game schedule entry
    snapshot.forEach(function(childSnapshot) {
      var gameType = childSnapshot.child("gameType").val();
      var them = childSnapshot.child("them").val();
      var location = childSnapshot.child("location").val();
      var datetime = childSnapshot.child("datetime").val();
      var status = childSnapshot.child("status").val();

      // Populate cloned game schedule entry template and append to view
      var tmpl = document.getElementById('previousGame').content.cloneNode(true);
      tmpl.querySelector('.datetime').innerText = datetime;
      tmpl.querySelector('.gLocation').innerText = location;
      tmpl.querySelector('.matchUp').innerText = "My Team vs " + them;
      tmpl.querySelector('.gameType').innerHTML = status + " : " + gameType;
      tmpl.querySelector('#viewMatchStatsButton').value = datetime;
      tmpl.querySelector('#editScheduleButton').value = datetime;
      document.querySelector('#viewPrevious').appendChild(tmpl); 
    });      
  });
}

/*
 Displays game schedule without edit functionality
 */
function handleReadNoEdits() {
  var query = firebase.database().ref("Games").orderByKey();
  query.once("value").then(function(snapshot) {
    // Iterate over every game schedule entry
    snapshot.forEach(function(childSnapshot) {
      var gameType = childSnapshot.child("gameType").val();
      var them = childSnapshot.child("them").val();
      var location = childSnapshot.child("location").val();
      var datetime = childSnapshot.child("datetime").val();
      var status = childSnapshot.child("status").val();
      
      // Populate cloned game schedule entry template and append to view
      var tmpl = document.getElementById('previousGame').content.cloneNode(true);
      tmpl.querySelector('.datetime').innerText = datetime;
      tmpl.querySelector('.gLocation').innerText = location;
      tmpl.querySelector('.matchUp').innerText = "My Team vs " + them;
      tmpl.querySelector('.gameType').innerHTML = status + " : " + gameType;
      tmpl.querySelector('#viewMatchStatsButton').value = datetime;
      tmpl.querySelector('#editScheduleButton').style.display = 'none';
      document.querySelector('#viewPrevious').appendChild(tmpl); 
    });      
  });
}

/*
 Displays upcoming games with edit functionality
 */
function handleReadUpcomingAllowEdits(date){
  var query = firebase.database().ref("Games").orderByKey();
  query.once("value").then(function(snapshot) {
    // Iterate over every game schedule entry
     snapshot.forEach(function(childSnapshot) {
      var gameType = childSnapshot.child("gameType").val();
      var them = childSnapshot.child("them").val();
      var location = childSnapshot.child("location").val();
      var datetime = childSnapshot.child("datetime").val();
      var status = childSnapshot.child("status").val();
      var display = false;

      // Compare entry date to current date
      for(var i = 0; i < 16; i++) {
        // current date is earlier than entry date
        if(date.charCodeAt(i) < datetime.charCodeAt(i)){
          // It's a date in the future, display it.
          display = true;
          break;
        }

        // current date is later than entry date
        if(date.charCodeAt(i) > datetime.charCodeAt(i)){
          // It's a date in the past, don't display it.
          break;
        }
      }

      if(display == true) {
        var tmpl = document.getElementById('previousGame').content.cloneNode(true);
        tmpl.querySelector('.datetime').innerText = datetime;
        tmpl.querySelector('.gLocation').innerText = location;
        tmpl.querySelector('.matchUp').innerText = "My Team vs " + them;
        tmpl.querySelector('.gameType').innerHTML = status + " : " + gameType;
        tmpl.querySelector('#viewMatchStatsButton').value = datetime;
        tmpl.querySelector('#editScheduleButton').value = datetime;
        document.querySelector('#viewPrevious').appendChild(tmpl); 
       }
    });      
  });
}

/*
 Displays upcoming games with no edit functionality
 */
function handleReadUpcomingNoEdits(date){
 var query = firebase.database().ref("Games").orderByKey();
  query.once("value").then(function(snapshot) {
    // Iterate over every game schedule entry
    snapshot.forEach(function(childSnapshot) {
      var gameType = childSnapshot.child("gameType").val();
      var them = childSnapshot.child("them").val();
      var location = childSnapshot.child("location").val();
      var datetime = childSnapshot.child("datetime").val();
      var status = childSnapshot.child("status").val();
      var display = false;
       
      // Compare entry date to current date
      for(var i = 0; i < 16; i++) {
        // current date is earlier than entry date
        if(date.charCodeAt(i) < datetime.charCodeAt(i)){
          // It's a date in the future, display it.
          display = true;
          break;
        }

        // current date is later than entry date
        if(date.charCodeAt(i) > datetime.charCodeAt(i)){
          // It's a date in the past, don't display it.
          break;
        }
      }

      if(display == true){
        var tmpl = document.getElementById('previousGame').content.cloneNode(true);
        tmpl.querySelector('.datetime').innerText = datetime;
        tmpl.querySelector('.gLocation').innerText = location;
        tmpl.querySelector('.matchUp').innerText = "My Team vs " + them;
        tmpl.querySelector('.gameType').innerHTML = status + " : " + gameType;
        tmpl.querySelector('#viewMatchStatsButton').value = datetime;
        tmpl.querySelector('#editScheduleButton').style.display = 'none';
        document.querySelector('#viewPrevious').appendChild(tmpl); 
      }
    });      
  });
}

/*
 Deletes a game schedule entry.
 */
function handleDelete() {
  "use strict";
  var datetime = localStorage.getItem("datetime");
  if (confirm("Are you sure you want to delete this event?")) {
    if (datetime != null) {
      firebase.database().ref('/Games/' + datetime).set(null).then(function (res) {
        window.location = "/view-game-schedule.html";
      });
    } else {
      alert('invalid id');
    }
  }
}


/*
 Save date and time of game in local storage.
 */
function saveGame(objButton){
  var fired_button = objButton.value;
  localStorage.setItem("datetime", fired_button);
}

/*
 Handles incrementing game counter for game schedule
 */
function handleViewGameSchedule() {
  document.addEventListener("DOMContentLoaded", function (event) {
    "use strict";
    firebase.database().ref('/Globals').once('value').then(function (snapshot) {
      teamName = snapshot.child('TeamName');
      id = snapshot.child('GameCounter').val();
      firebase.database().ref('/Globals/GameCounter').set(parseInt(id, 10) + 1);
      handleReadGame();
    });
  });
}


/*
 Handles incrementing game counter for add game page
 */
function handleAddGamePage() {
  document.addEventListener("DOMContentLoaded", function (event) {
    "use strict";
    firebase.database().ref('/Globals').once('value').then(function (snapshot) {
      teamName = snapshot.child('TeamName');
      id = snapshot.child('GameCounter').val();
      firebase.database().ref('/Globals/GameCounter').set(parseInt(id, 10) + 1);
      handleReadGame();
    });
  });
}

/*
 Handles incrementing game counter for upcoming games
 */
function handleUpcoming(date) {
  document.addEventListener("DOMContentLoaded", function (event) {
    "use strict";
    firebase.database().ref('/Globals').once('value').then(function (snapshot) {
      teamName = snapshot.child('TeamName');
      id = snapshot.child('GameCounter').val();
      firebase.database().ref('/Globals/GameCounter').set(parseInt(id, 10) + 1);
      handleReadUpcomingGame(date);
    });
  });
}

/*
 Populates edit game page from Firebase when DOM is loaded.
 */
function handleEditGamePage() {
  document.addEventListener("DOMContentLoaded", function (event) {
  "use strict";

    firebase.database().ref('/Globals').once('value').then(function (snapshot) {
      teamName = snapshot.child('TeamName');
    });

    var datetime = localStorage.getItem("datetime");

    if (datetime != null) {
      firebase.database().ref('/Games/' + datetime).once('value').then(function (snapshot) {
        if (!snapshot.exists()) {
          alert('Not a recorded game');
          window.location = "/view-game-schedule.html";
        }

        var datetime = snapshot.child('datetime'),
        location = snapshot.child('location'),
        them = snapshot.child('them'),
        inputs = document.querySelectorAll('.form-control');

        inputs[0].value = them.val();
        inputs[1].value = location.val();
        inputs[2].value = datetime.val();
      });
    } else {
      alert('Not a valid game');
      window.location = "/view-game-schedule.html";
    }
  });
}

/*
 Populate match stats from Firebase.
 */
function handleReadMatchstats() {
  var id = localStorage.getItem("datetime");
  var themQuery = firebase.database().ref('/Games/' + id + '/stats/them');
  var usQuery = firebase.database().ref('/Games/' + id + '/stats/us');

  usQuery.once("value").then(function(snapshot){
    var foulFor = snapshot.child("0-foul").val();
    var redFor = snapshot.child("1-red-card").val();
    var yellowFor = snapshot.child("2-yellow-card").val();
    var shotFor = snapshot.child("3-shot-on-goal").val();
    var goalFor = snapshot.child("4-goal").val();
    var cornerFor = snapshot.child("5-corner-kick").val();
    var goalKickFor = snapshot.child("6-goal-kick").val();
    var timeFor = snapshot.child("7-p-time").val();  
    document.getElementById('foulFor').innerHTML = foulFor;
    document.getElementById('redFor').innerHTML = redFor;
    document.getElementById('yellowCardFor').innerHTML = yellowFor;
    document.getElementById('shotOnGoalFor').innerHTML = shotFor;
    document.getElementById('goalFor').innerHTML = goalFor;  
    document.getElementById('cornerKicksFor').innerHTML = cornerFor;
    document.getElementById('goalKicksFor').innerHTML = goalKickFor;
    document.getElementById('possessionTimeFor').innerHTML = timeFor;
  });

  var query = firebase.database().ref('/Games/' + id);    
  query.once("value").then(function(snapshot){
  
    var opponent = snapshot.child('them').val();
    var datetime = snapshot.child("datetime").val();
    var location = snapshot.child("location").val();
    var gameType = snapshot.child("gameType").val();
  
    document.getElementById('my-team-vs-opponent').innerHTML = "My Team vs " + opponent; 
    document.getElementById('datetimeLabel').innerHTML = datetime;
    document.getElementById('locationLabel').innerHTML = location;
    document.getElementById('gameTypeLabel').innerHTML = gameType;
  });    

  themQuery.once("value").then(function(snapshot){
    var foulAgainst = snapshot.child("0-foul").val();
    var redAgainst = snapshot.child("1-red-card").val();
    var yellowAgainst = snapshot.child("2-yellow-card").val();
    var shotAgainst = snapshot.child("3-shot-on-goal").val();
    var goalAgainst = snapshot.child("4-goal").val();
    var cornerAgainst = snapshot.child("5-corner-kick").val();
    var goalKickAgainst = snapshot.child("6-goal-kick").val();
    var timeAgainst = snapshot.child("7-p-time").val();
    document.getElementById('foulAgainst').innerHTML = foulAgainst;
    document.getElementById('redAgainst').innerHTML = redAgainst;
    document.getElementById('yellowCardAgainst').innerHTML = yellowAgainst;
    document.getElementById('shotOnGoalAgainst').innerHTML = shotAgainst;
    document.getElementById('goalAgainst').innerHTML = goalAgainst; 
    document.getElementById('cornerKicksAgainst').innerHTML = cornerAgainst;
    document.getElementById('goalKicksAgainst').innerHTML = goalKickAgainst;
    document.getElementById('possessionTimeAgainst').innerHTML = timeAgainst;
  });
}

/*
 Calculates current date and calls handleUpcoming() to populate upcoming matches
 page with future game schedule entries.
 */
function handleUpcomingMatch() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+  ("0" + today.getDate()).slice(-2)+'T'+today.getHours()+":"+today.getMinutes();
  handleUpcoming(date);
}

/* ESLint Problems: None */