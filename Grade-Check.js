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
    var oldTableArray = localStorage.getItem("oldTableArray");
    var compareTable = document.getElementsByClassName("table");
    var compareTableContent = compareTable[0].textContent;
    var array = [];
    if (compareTableContent != oldTableContent) {
      var subjects;
      if(oldTableArray == null){
        oldTableArray = new Array();
      }
      for (var i = 0, row; row = compareTable[0].rows[i]; i++) {
        if(oldTableArray.length > i ){
          if(oldTableArray[i][1] != row.cell[5].innerHTML){
            //Grade has changed
            array.push([row.cells[1].innerHTML, row.cells[5].innerHTML]);
          }
        }
        oldTableArray[i] = [row.cells[1].innerHTML, row.cells[5].innerHTML];
      }
      for(var j = 0, len = array.length; j < len; j++){
        subjects = subjects + array[j][0];
        if(j != len -1){
          subjects = subjects + ", ";
        }
      }
      if(array.length > 1){
        alert('Es gibt neue Noten in den Fächern: ' +subjects);
      }else if (array.length = 1 && subjects != null){
        alert('Es gibt eine neue Note in dem Fach ' + subjects);
      }
      var oldTable = document.getElementsByClassName("table");
      oldTableContent = oldTable[0].textContent;    
      localStorage.setItem("oldTable", oldTableContent);
      localStorage.setItem("oldTableArray",oldTableArray);
    };
    location.reload();
};

setTimeout(comparing,60000);
