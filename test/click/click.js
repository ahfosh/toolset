var svgObject = document.getElementById('svg-object');
var messageBox = document.getElementById('message');
var csvFilePath = 'click-prefecture.csv';
var timerDisplay = document.getElementById('timer');
var totalSeconds = 0;
var allPathsClicked = false;

fetch(csvFilePath)
  .then(response => response.text())
  .then(csvData => loadSVG(csvData))
  .catch(error => console.error('loading failed, ', error));

function loadSVG(csvData) {
  svgObject.addEventListener('load', function () {
    var svgDocument = svgObject.contentDocument;
    var svg = svgDocument.getElementsByTagName('svg')[0];
    svg.setAttribute('style', 'fill:white;stroke:black;stroke-width:0.5;');
    var displayGroup = svg.getElementById('prefecture');
    var paths = displayGroup.getElementsByTagName('path');
    var pathData = parseCSV(csvData);

    function parseCSV(csv) {
      var lines = csv.split('\n');
      var result = [];
      var headers = lines[0].split(',');
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(',');
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
      }
      return result;
    }

    function getTitleById(id) {
      for (var i = 0; i < pathData.length; i++) {
        if (pathData[i].id === id) {
          return pathData[i].title;
        }
      }
      return null;
    }

    var pathIds = [];
    for (var i = 0; i < paths.length; i++) {
      pathIds.push(paths[i].id);
    }

    var currentPathId = null;

    function showRandomPath() {
      var randomIndex = Math.floor(Math.random() * pathIds.length);
      currentPathId = pathIds[randomIndex];
      showMessage('请点击' + getTitleById(currentPathId));
    }

    function showMessage(message) {
      messageBox.innerText = message;
      messageBox.style.display = 'block';
    }

    function hideMessage() {
      messageBox.style.display = 'none';
    }

    svg.addEventListener('click', function (event) {
      var clickedPath = event.target;
      var clickedPathId = clickedPath.id;
      if (clickedPathId === currentPathId) {
        showMessage('正确');
        clickedPath.setAttribute('style', 'fill:green;fill-opacity:1;');
        var index = pathIds.indexOf(clickedPathId);
        if (index !== -1) {
          pathIds.splice(index, 1);
        }
        allPathsClicked = checkAllPathsClicked();
        if (allPathsClicked) {
          clearInterval(interval);
        }
        setTimeout(function () {
          hideMessage();
          showRandomPath();
        }, 500);
      } else {
        showMessage('错误 请点击' + getTitleById(currentPathId));
      }
    });

    showRandomPath();
    svg.style.display = 'block';

    var interval = setInterval(setTime, 1000);

    function setTime() {
      if (!allPathsClicked) {
        ++totalSeconds;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        timerDisplay.innerHTML = pad(minutes) + ':' + pad(seconds);
      }
    }

    function pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }

    function checkAllPathsClicked() {
      for (var i = 0; i < paths.length; i++) {
        if (!paths[i].classList.contains('clicked')) {
          return false;
        }
      }
      return true;
    }
  });
}