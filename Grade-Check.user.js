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
    var oldTableArray = JSON.parse(localStorage.getItem("oldTableArray"));
    var compareTable = document.getElementsByClassName("table");
    var compareTableContent = compareTable[0].textContent;
    var array = [],item;
    //console.log(oldTableArray);
    if (compareTableContent != oldTableContent) {
      var subjects;
      if(oldTableArray == null){
        oldTableArray = new Array();
      }
      for (var i = 1, row; row = compareTable[0].rows[i]; i++) {
        if(oldTableArray.length > i ){
            //console.log(oldTableArray[i][1] +" CELL: "+row.cells[4].innerText);
            //console.log("compare " + (oldTableArray[i][1] === row.cells[4].innerText).toString());
            if(!(oldTableArray[i][1] === row.cells[4].innerText) && row.cells[4].innerText.length > 0){
            //Grade has changed
            array.push([row.cells[1].innerHTML, row.cells[4].innerHTML]);
          }
        }
        oldTableArray[i] = [row.cells[1].innerHTML, row.cells[4].innerHTML];
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
      localStorage.setItem("oldTableArray", JSON.stringify(oldTableArray));
    };
    location.reload();
};

setTimeout(comparing,60000);
