/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*global jerseyToDelete*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

/*Populates the team stats table in teamstats.html*/
function handleTeamStatsRead(){
  var query = firebase.database().ref('TeamStats');
  query.once("value").then(function(snapshot) {
    var wins = snapshot.child("wins").val();
    var losses = snapshot.child("losses").val();  
    var ties = snapshot.child("ties").val();
    var goalsFor = snapshot.child("goalsFor").val();
    var goalsAgainst = snapshot.child("goalsAgainst").val();  
    document.getElementById('team-wins').innerHTML = wins;
    document.getElementById('team-losses').innerHTML = losses;
    document.getElementById('team-ties').innerHTML = ties;
    document.getElementById('team-goals-for').innerHTML = goalsFor;
    document.getElementById('team-goals-against').innerHTML = goalsAgainst;
  });
}

/*Populates the input fields of edit entries in edit-team-stats.html*/
function handleTeamStatsEdit(){
  var query = firebase.database().ref('TeamStats');
  query.once("value").then(function(snapshot) {
    var wins = snapshot.child("wins").val();
    var losses = snapshot.child("losses").val();  
    var ties = snapshot.child("ties").val();
    var goalsFor = snapshot.child("goalsFor").val();
    var goalsAgainst = snapshot.child("goalsAgainst").val();  
    document.getElementById('edit-team-wins').value = wins;
    document.getElementById('edit-team-loses').value = losses;
    document.getElementById('edit-team-ties').value = ties;
    document.getElementById('edit-team-goals-for').value = goalsFor;
    document.getElementById('edit-team-goals-against').value = goalsAgainst;
  });
}   

/*This function saves team stat changes to firebase*/
function handleTeamStatsSave(){
  var wins = document.getElementById('edit-team-wins').value;
  var losses = document.getElementById('edit-team-loses').value;  
  var ties = document.getElementById('edit-team-ties').value;
  var goalsFor = document.getElementById('edit-team-goals-for').value;
  var goalsAgainst = document.getElementById('edit-team-goals-against').value;
    
  firebase.database().ref('TeamStats').set({
    wins: wins,
    losses: losses,
    ties: ties,
    goalsFor: goalsFor,
    goalsAgainst:goalsAgainst           
  }).then(function onSuccess(res) {
   window.location = "/teamstats.html";
  })
}

/*Redirect to cancel changes*/
function handleTeamStatsCancel(){
     window.location = "/teamstats.html";
}

