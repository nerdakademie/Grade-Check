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

var colorTable= {
  '1,0' : '#33FF33',
  '1,3' : '#33FF33',
  '1,7' : '#CAFF70',
  '2,0' : '#CAFF70',
  '2,3' : '#CAFF70',
  '2,7' : '#FFFF66',
  '3,0' : '#FFFF66',
  '3,3' : '#FFFF66',
  '3,7' : '#FFCC33',
  '4,0' : '#FFCC33',
  '5,0' : '#FF6666'
};

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

for(var i = 1; i <= 31; i++){
  var elem = getElementByXpath('//*[@id="curricular"]/table/tbody/tr[' + i + ']/td[5]');
  if (elem !== null){
    if(colorTable[elem.innerText] !== undefined){
      elem.setAttribute('bgcolor', colorTable[elem.innerText]);
      elem.style.backgroundColor = colorTable[elem.innerText];
    }
  }
}

var elem = getElementByXpath('//*[@id="curricular"]/table/tbody/tr[31]/th[5]');
elem.setAttribute('bgcolor', colorTable[elem.innerText.replace('.',',')]);
elem.style.backgroundColor = colorTable[elem.innerText.replace('.',',')];