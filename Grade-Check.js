// ==UserScript==
// @name        grade-check
// @namespace   nak
// @description checks for new grades
// @include     https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1
// @version     0.1
// @grant       none
// ==/UserScript==


function comparing() {
   var oldTableContent = localStorage.getItem("oldTable");
   var compareTable = document.getElementsByClassName("table");
   var compareTableContent = compareTable[0].textContent;
   if (compareTableContent != oldTableContent) {
       alert('neue noten');
       var oldTable = document.getElementsByClassName("table");
       oldTableContent = oldTable[0].textContent;
       localStorage.setItem("oldTable", oldTableContent);
   };
   location.reload();
};

setTimeout(comparing,60000);
