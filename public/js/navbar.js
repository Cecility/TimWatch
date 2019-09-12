/*jslint devel: true*/
/*eslint-env browser*/

/*global firebase:true*/
/*eslint no-undef: "error"*/
/*eslint no-unused-vars: ["error", { "vars": "local", "args": "none" }]*/

/*
 Toggle visibility of collapsed navbar (on mobile).
 */
function toggleNav() {
  "use strict";
  var nav = document.getElementById('navbarCollapse');
  nav.classList.toggle('collapse');
}

/*
 Toggle visibility of navbar dropdown menu.
 */
function toggleDropdown() {
  "use strict";
  var dropdown = document.getElementById('navbarDropdownMenu');
  dropdown.classList.toggle('show');
}

/*
 Hide navbar dropdown menu when user clicks outside of navbar.
 */
window.onclick = function (e) {
  "use strict";
  if (!e.target.matches('.dropdown-toggle')) {
    var dropdown = document.getElementById('navbarDropdownMenu');
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
};

/*ESLint Problems: None */