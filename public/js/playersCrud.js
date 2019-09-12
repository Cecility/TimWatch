/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*global jerseyToDelete*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

/*
 Handles the functionality to add players to the team roster
 */
function handleAddPlayer() {
  // Get the first name, last name, email, jersey number, position, and captain check from input fields.
  var fName = document.getElementById("addPlayerFName").value.trim();
  var lName = document.getElementById("addPlayerLName").value.trim();
  var email = document.getElementById("addPlayerEmail").value.trim();
  var dob = document.getElementById("addPlayerDOB").value;
  var jersey = document.getElementById("addPlayerJersey").value.trim();  
  var e = document.getElementById("addPlayerPosition");
  var position = e.options[e.selectedIndex].text;
  var captainCheck = document.getElementById("captainCheck").checked;

  // Get the image from the input file   
  var fullPath = document.getElementById('imgInp').value;
  if (fullPath) {
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
      filename = filename.substring(1);
    }
    fullPath = filename;
  }

  // Save player details to firebase
  firebase.database().ref('/Players/' + "JerseyNumber" + jersey).set({
    fName: fName,
    lName: lName,
    email: email,
    dob: dob,
    jersey:jersey,
    position:position,
    captainCheck: captainCheck,
    profilePic: fullPath,
    fouls: 0,
    redCards:0,
    yellowCards:0,
    shotsOnGoal:0,
    goals:0,
    cornerKicks:0,
    goalKicks:0,
    penaltyKicks:0,
    throwIns:0,
    careerGoals:0,
    careerAppearances:0

  // Upload image to Firestore
  }).then(function onSuccess(res) {
    var fullPath = document.getElementById('imgInp').value;
    var actualFile = null;
    var fileButton = document.getElementById('imgInp');
    actualFile = fileButton.files[0];  

    if(actualFile == null){
      window.location = "/teamstats.html";
    }
    if(fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }
      fullPath = filename;
    } 

    var storageRef = firebase.storage().ref('profile-pictures/' + actualFile.name);
    storageRef.put(actualFile).then(function(snapshot){
       window.location = "/teamstats.html";
    });
  });
}

/* 
 Function to capitalize the first letter of word 
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* 
 Display team stats elements based on user permissions.
 */
function handleAccessTeamStats() {
  var userId = localStorage.getItem("user");
  if(userId != null){
    var query = firebase.database().ref('Users/' + userId);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();

      if(coach == true || manager == true){
        var editButton = document.getElementById('edit-team-stats-button');
        var addButton = document.getElementById('add-player-button');
        editButton.style.display = 'block';
        addButton.style.display = 'block';
        document.getElementById('nav-add-player').className = "desktop-hidden";
        document.getElementById('team-stats-record-id').className = "nav-item"; 
      }
    });
  }
}

/* 
 Display player stats elements based on user permissions.
 */
function handleAccessViewPlayer() {
  var userId = localStorage.getItem("user");
  if(userId != null) {
    var query = firebase.database().ref('Users/' + userId);
    query.once("value").then(function(snapshot) {
      var coach = snapshot.child("coach").val();
      var manager = snapshot.child("manager").val();

      if(coach == true || manager == true){
        var editButton = document.getElementById('edit-player-button');
        editButton.style.display = 'block';
        document.getElementById('view-player-record-id').className = "nav-item";
        document.getElementById('nav-edit-player').className = "desktop-hidden";
      }
    });
  }
}

/*
 Handles the population of roster template
 */
function handleRead() {
  var dob = 0;
  var fName = 0; 
  var jersey = 0;
  var lName = 0;    
  var position = 0;
  handleAccessTeamStats();

  window.addEventListener('DOMContentLoaded', function () {
    var query = firebase.database().ref('Players');
    query.once("value").then(function(snapshot) {
      // Iterate over every player entry
      snapshot.forEach(function(childSnapshot) {
        dob = childSnapshot.child("dob").val();
        fName = childSnapshot.child("fName").val();  
        jersey = "Jersey #" + childSnapshot.child("jersey").val();
        lName = childSnapshot.child("lName").val();    
        position = childSnapshot.child("position").val(); 
        var careerGoals = childSnapshot.child("careerGoals").val();     
        var careerAppearances = childSnapshot.child("careerAppearances").val();     
        var profilePic = childSnapshot.child("profilePic").val();    
        var tmpl = document.getElementById('rosterTemplate').content.cloneNode(true);
        fName = capitalizeFirstLetter(fName);
        lName = capitalizeFirstLetter(lName);
        tmpl.querySelector('.playerName').innerText = fName + " " + lName ;
        tmpl.querySelector('.playerPosition').innerText = position;
        tmpl.querySelector('.playerJersey').innerText = jersey;
        tmpl.querySelector('.playerDOB').innerHTML = dob;
        tmpl.querySelector('#viewPlayerButton').value = jersey; 
        tmpl.querySelector('#careerGoals').innerHTML = careerGoals;
        tmpl.querySelector('#careerAppearances').innerHTML = careerAppearances;      
        // Add it to the view
        var folderRef = firebase.storage().ref().child( "profile-pictures/" );
        var contentRef = folderRef.child(profilePic);

        if (profilePic) {
          // Dynamically set the content
          contentRef.getDownloadURL().then(function( url ) {
            tmpl.querySelector('#playerPic').src = url;
            document.querySelector('#view').appendChild(tmpl);
          });
        } else {
          document.querySelector('#view').appendChild(tmpl);
        }
      });
    });
  });
}

/*
 Saves player jersey number to local storage
 */
function saveJerseyNum(objButton) {
  var fired_button = objButton.value;
  fired_button = fired_button.split('#').pop();        
  localStorage.setItem("jerseyNumber", fired_button);
}

/*
 Saves player jersey number to local storage
 */
function getJerseyNum(){
  var num = document.querySelector('.viewplayerJersey').innerHTML;
  num = num.split('#').pop();
  localStorage.setItem("jerseyNumber", num);
}

/*
 Populates the template for viewing the stats of one player
 */
function handleReadForViewPlayer(){
  handleAccessViewPlayer();
  var jNum = localStorage.getItem("jerseyNumber");
  window.addEventListener('DOMContentLoaded', function () {
    var query = firebase.database().ref('Players/JerseyNumber' +jNum);
    // Iterate over every player entry
    query.once("value").then(function(snapshot) {
      var dob = snapshot.child("dob").val();
      var fName = snapshot.child("fName").val();  
      var jersey = "Jersey #" + snapshot.child("jersey").val();
      var lName = snapshot.child("lName").val();
      var position = snapshot.child("position").val();
      var profilePic = snapshot.child("profilePic").val();  

      var foul  = snapshot.child("fouls").val();
      var redCard = snapshot.child("redCards").val();
      var yellowCard = snapshot.child("yellowCards").val();
      var shotOnGoal = snapshot.child("shotsOnGoal").val(); 
      var goal = snapshot.child("goals").val();
      var cornerKick = snapshot.child("cornerKicks").val();
      var goalKick = snapshot.child("goalKicks").val();
      var penaltyKick = snapshot.child("penaltyKicks").val();
      var throwIn = snapshot.child("throwIns").val();
      var careerGoals = snapshot.child("careerGoals").val();
      var careerAppearances = snapshot.child("careerAppearances").val();

      document.getElementById('player-fouls').innerHTML = foul;
      document.getElementById('player-red-cards').innerHTML = redCard;
      document.getElementById('player-yellow-cards').innerHTML = yellowCard;
      document.getElementById('player-shot-on-goal').innerHTML = shotOnGoal;
      document.getElementById('player-goals').innerHTML = goal;
      document.getElementById('player-corner-kicks').innerHTML = cornerKick;
      document.getElementById('player-goal-kicks').innerHTML = goalKick;
      document.getElementById('player-penalty-kicks').innerHTML = penaltyKick;
      document.getElementById('player-throw-ins').innerHTML = throwIn;

      fName = capitalizeFirstLetter(fName);
      lName = capitalizeFirstLetter(lName);
      var tmpl = document.getElementById('viewPlayerTemplate').content.cloneNode(true);
      tmpl.querySelector('.viewplayerName').innerText = fName + " " + lName ;
      tmpl.querySelector('.viewplayerPosition').innerText = position;
      tmpl.querySelector('.viewplayerJersey').innerText = jersey;
      tmpl.querySelector('.viewplayerDOB').innerHTML = dob;
      tmpl.querySelector('#viewPlayerCareerGoals').innerHTML = careerGoals;
      tmpl.querySelector('#viewCareerAppearances').innerHTML = careerAppearances;

      if(profilePic) {
        var folderRef = firebase.storage().ref().child( "profile-pictures/" );
        var contentRef = folderRef.child(profilePic);
        //Dynamically set the content
        contentRef.getDownloadURL().then(function( url ) {
          tmpl.querySelector('#playerPicture').src = url;
          document.querySelector('#viewPlayerView').appendChild(tmpl);
        });
      } else {
        document.querySelector('#viewPlayerView').appendChild(tmpl);
      }
    });
  });
}

/*
 Reveals edit button for managers.
 */
function handleCoachAccess(){
  var userId = localStorage.getItem("user");
  if(userId != null) {
    var query = firebase.database().ref('Users/' + userId);
    query.once("value").then(function(snapshot) {
      var manager = snapshot.child("manager").val();

      if(manager == true){
        document.getElementById('edit-delete-player').className = "btn btn-danger";
      }
    });
  }
}

/*
 Handles the functionality to edit player stats
 */
function handleEditPlayer(){
  handleCoachAccess();
  var jNum = localStorage.getItem("jerseyNumber");
  var query = firebase.database().ref('Players/JerseyNumber' +jNum);
  query.once("value").then(function(snapshot) {
    var dob = snapshot.child("dob").val();
    var fName = snapshot.child("fName").val();  
    var jersey = snapshot.child("jersey").val();
    var lName = snapshot.child("lName").val();
    var position = snapshot.child("position").val();
    var email = snapshot.child("email").val();
    var checkBox = snapshot.child("captainCheck").val();

    var foul  = snapshot.child("fouls").val();
    var redCard = snapshot.child("redCards").val();
    var yellowCard = snapshot.child("yellowCards").val();
    var shotOnGoal = snapshot.child("shotsOnGoal").val(); 
    var goal = snapshot.child("goals").val();
    var cornerKick = snapshot.child("cornerKicks").val();
    var goalKick = snapshot.child("goalKicks").val();
    var penaltyKick = snapshot.child("penaltyKicks").val();
    var throwIn = snapshot.child("throwIns").val();
    var careerAppearance = snapshot.child("careerAppearances").val();  
    var profilePic = snapshot.child("profilePic").val();
    localStorage.setItem("profilePic", profilePic);   

    document.getElementById('p-fouls').value = foul;
    document.getElementById('p-red-cards').value = redCard;
    document.getElementById('p-yellow-cards').value = yellowCard;
    document.getElementById('p-shots-on-goal').value = shotOnGoal;
    document.getElementById('p-goals').value = goal;
    document.getElementById('p-corner-kicks').value = cornerKick;
    document.getElementById('p-goal-kicks').value = goalKick;
    document.getElementById('p-penalty-kicks').value = penaltyKick;
    document.getElementById('p-throw-ins').value = throwIn;
    document.getElementById('editPlayerCareerAppearances').value = careerAppearance;    

    document.getElementById("editPlayerFName").value = fName;
    document.getElementById("editPlayerLName").value = lName;
    document.getElementById("editPlayerPosition").value = position;
    document.getElementById("editPlayerJersey").value = jersey;
    document.getElementById("editPlayerDOB").value = dob;
    document.getElementById("editPlayerEmail").value = email;

    if(checkBox == true) {
        document.getElementById("editCaptainCheck").checked = true;
    } else {
        document.getElementById("editCaptainCheck").checked = false;
    }
  });
}

/*
 Handles the functionality of saving changes to player stats to firebase
 */
function handleSaveEdit() {
  var fName = document.getElementById("editPlayerFName").value.trim();
  var lName = document.getElementById("editPlayerLName").value.trim();
  var email = document.getElementById("editPlayerEmail").value.trim();
  var dob = document.getElementById("editPlayerDOB").value;
  var jersey = document.getElementById("editPlayerJersey").value.trim();  
  var e = document.getElementById("editPlayerPosition");
  var position = e.options[e.selectedIndex].text;
  var captainCheck = document.getElementById("editCaptainCheck").checked;
  var fullPath = document.getElementById('imgInp').value;
    
  var fouls = document.getElementById('p-fouls').value;
  var redCards = document.getElementById('p-red-cards').value;
  var yellowCards= document.getElementById('p-yellow-cards').value; 
  var shotsOnGoal = document.getElementById('p-shots-on-goal').value;
  var goals = document.getElementById('p-goals').value;
  var cornerKicks = document.getElementById('p-corner-kicks').value;
  var goalKicks = document.getElementById('p-goal-kicks').value;
  var penaltyKicks = document.getElementById('p-penalty-kicks').value;
  var throwIns = document.getElementById('p-throw-ins').value;
  var careerAppearances = document.getElementById('editPlayerCareerAppearances').value;     
  var profilePicture = localStorage.getItem("profilePic");  

  if(profilePicture && !fullPath) {
    fullPath = profilePicture;
  } else {
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }
      fullPath = filename;
    } 
  }    

  firebase.database().ref('/Players/' + "JerseyNumber" + jersey).set({
    fName: fName,
    lName: lName,
    email: email,
    dob: dob,
    jersey:jersey,
    position:position,
    captainCheck: captainCheck,
    profilePic: fullPath,
    fouls: fouls,
    redCards: redCards,
    yellowCards: yellowCards,
    shotsOnGoal: shotsOnGoal,
    goals: goals,
    cornerKicks: cornerKicks,
    goalKicks: goalKicks,
    penaltyKicks: penaltyKicks,
    throwIns: throwIns,
    careerGoals:goals,
    careerAppearances:careerAppearances
      
  }).then(function onSuccess(res) {
    var fullPath = document.getElementById('imgInp').value;
    var actualFile = null;
    var fileButton = document.getElementById('imgInp');
    actualFile = fileButton.files[0];

    if(fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }
      fullPath = filename;
    } 

    if(actualFile == null){
      window.location = "/view-player.html";
    } else {
      var storageRef = firebase.storage().ref('profile-pictures/' + actualFile.name);
      storageRef.put(actualFile).then(function(snapshot) { 
        window.location = "/view-player.html";
      }).then(function(error){
        window.location = "/view-player.html";
      });
    }
  });
}

/* 
 Calls handleSaveEdit() 
 */
function handleSave() {
  handleSaveEdit();    
}

/*
 Deletes a player from the roster
 */
function handleDeletePlayer(){
    var jNum = localStorage.getItem("jerseyNumber");
    firebase.database().ref('Players/JerseyNumber' +jNum).remove();
    window.location = "/teamstats.html";
}

/*ESLint Problems: None */