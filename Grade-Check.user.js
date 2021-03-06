// ==UserScript==
// @name        grade-check
// @namespace   nak
// @description checks for new grades
// @include     https://cis.nordakademie.de/studium/pruefungen/pruefungsergebnisse/
// @include     https://cis.nordakademie.de/mein-profil/mein-postfach/leistungsuebersicht/
// @version     0.4.15
// @grant       none
// @downloadURL https://github.com/nerdakademie/Grade-Check/raw/master/Grade-Check.user.js
// @updateURL   https://github.com/nerdakademie/Grade-Check/raw/master/Grade-Check.meta.js
// ==/UserScript==

function reloadPage(){
    location.reload();
}

function isNumeric(num){
    return !isNaN(num);
}

function average(arr){
  if(arr.length > 1){
    var gradesum=0,credsum=0;
	//minus 1 for the calculated serverside sum
    for(var k=1; k<arr.length; k++){
      var grade = arr[k][1];
      var credpoint = arr[k][2];
      if(arr[k][0] == "Bachelorthesis"){
        credpoint *= 3;
       }
      if(isNumeric(grade.replace(',','.')) && parseFloat(grade.replace(',','.')) > 0 && grade.indexOf("Versuch") == -1){
        gradesum = gradesum + (parseFloat(grade.replace(',','.')) * parseFloat(credpoint));
        credsum = credsum + parseFloat(credpoint);
      }
    }
    if(gradesum !==0 && credsum !==0){
      return (Math.round(gradesum/credsum*1000)/1000);
    }
  }
  return "";
}


var oldTableContent = localStorage.getItem("oldTable");
var oldTableArray = JSON.parse(localStorage.getItem("oldTableArray"));
var compareTable = document.getElementsByClassName("table");
var compareTableContent = compareTable[0].textContent;
var rowCount = compareTable[0].rows.length;


function comparing() {
    if (compareTableContent != oldTableContent) {
      var subjects = "",array = new Array();
      if(oldTableArray === null){
        oldTableArray = new Array();
      }
      for (var i = 1, row; row = compareTable[0].rows[i]; i++) {
        if(i < compareTable[0].rows.length-1){ //Ignore last row
          if(oldTableArray.length > i ){
              if(oldTableArray[i][1] !== row.cells[4].textContent.trim() && row.cells[4].textContent.trim().length > 0){
              //Grade has changed
              array.push([row.cells[1].textContent.trim() , row.cells[4].textContent.trim() , row.cells[5].textContent.trim()]);
            }
          }
          oldTableArray[i] = [row.cells[1].textContent.trim() , row.cells[4].textContent.trim() , row.cells[5].textContent.trim()];
        }
      }
      for(var j = 0, len = array.length; j < len; j++){
        subjects = subjects + array[j][0];
        if(j != len -1){
          subjects = subjects + ", ";
        }
      }
      if(array.length > 1){
        alert('Es gibt neue Noten in den Fächern: ' +subjects);
      }else if (array.length === 1){
        alert('Es gibt eine neue Note in dem Fach ' + subjects);
      }
      var oldTable = document.getElementsByClassName("table");
      oldTableContent = oldTable[0].textContent;
      localStorage.setItem("oldTable", oldTableContent);
      localStorage.setItem("oldTableArray", JSON.stringify(oldTableArray));
    }
    compareTable[0].rows[rowCount-1].cells[4].textContent = average(oldTableArray);
    setTimeout(reloadPage,60000);
}

comparing();


function getGradeColor(aNum) {
    var gradeNum = parseFloat(aNum.replace(',','.'));
    var neg = (gradeNum >= 3);
    gradeNum = Math.abs(gradeNum-3);
    gradeNum = gradeNum / 2;
    gradeNum = gradeNum * 255;
    var gradeInt = Math.floor(gradeNum);

    if(neg){
      var green = (255-gradeInt).toString(16);
      if((255-gradeInt)<16){
        return '#FF0'+green+'60';
      }else{
        return '#FF'+green+'60';
      }
    }else {
      var red = (255-gradeInt).toString(16);
      if((255-gradeInt)<16){
        return '#0'+red+'FF60';
      }else{
        return '#'+red+'FF60';
      }
    }
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

for(var i = 1; i <= rowCount-1; i++){
  var elem = getElementByXpath('//*[@id="curricular"]/table/tbody/tr[' + i + ']/td[5]');
  if (elem !== null){
    if(elem.innerText.trim().substring(0,3) !== ""){
      elem.setAttribute('bgcolor', getGradeColor(elem.innerText.trim().substring(0,3)));
      elem.style.backgroundColor = getGradeColor(elem.innerText.trim().substring(0,3));
    }
  }
}

//Average coloration
var elem = getElementByXpath('//*[@id="curricular"]/table/tbody/tr['+ (rowCount-1) +']/th[5]');
elem.setAttribute('bgcolor', getGradeColor(elem.innerText.replace('.',',')));
elem.style.backgroundColor = getGradeColor(elem.innerText.replace('.',','));
