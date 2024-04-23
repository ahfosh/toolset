var svgObject = document.getElementById('svg-object');
var messageBox = document.getElementById('message');
var csvFilePath = 'click-prefecture.csv';
var timerDisplay = document.getElementById('timer');
var totalSeconds = 0;
var allPathsClicked = false;

fetch(csvFilePath)
  .then(response => response.text())
  .then(csvData => loadSVG(csvData))
  .catch(error => console.error('加载失败，', error));

function loadSVG(csvData) {
  svgObject.addEventListener('load', function () {
    var svgDocument = svgObject.contentDocument;
    if (!svgDocument) {
      console.error('无法获取SVG文档');
      return;
    }
    var svg = svgDocument.getElementsByTagName('svg')[0];
    if (!svg) {
      console.error('未找到SVG元素');
      return;
    }
    var displayGroup = svg.getElementById('prefecture');
    if (!displayGroup) {
      console.error('未找到显示组');
      return;
    }
    var paths = displayGroup.getElementsByTagName('path');
    if (!paths || paths.length === 0) {
      console.error('未找到路径');
      return;
    }
    var pathData = parseCSV(csvData);

    function parseCSV(csv) {
      var lines = csv.split('\n');
      var result = [];
      var headers = lines[0].split(',');
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(',');
        if (currentline.length !== headers.length) {
          console.error('CSV文件格式错误，行 ' + (i + 1) + ' 的列数与标题不匹配');
          continue;
        }
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
      console.error('未找到ID为 ' + id + ' 的路径标题');
      return null;
    }

    var pathIds = [];
    for (var i = 0; i < paths.length; i++) {
      pathIds.push(paths[i].id);
    }

    var currentPathId = null;

    function showRandomPath() {
      if (pathIds.length === 0) {
        console.error('所有路径已点击完成');
        return;
      }
      var randomIndex = Math.floor(Math.random() * pathIds.length);
      currentPathId = pathIds[randomIndex];
      showMessage('请点击' + getTitleById(currentPathId));
    }

    function showMessage(message) {
      if (!messageBox) {
        console.error('未找到消息框');
        return;
      }
      messageBox.innerText = message;
      messageBox.style.display = 'block';
    }

    function hideMessage() {
      if (!messageBox) {
        console.error('未找到消息框');
        return;
      }
      messageBox.style.display = 'none';
    }

    svg.addEventListener('click', function (event) {
      var clickedPathId = event.currentTarget.id;
      var clickedPath = svgDocument.getElementById(clickedPathId);
      if (!clickedPath) {
        console.error('未找到点击的路径');
        return;
      }
      if (clickedPathId === currentPathId) {
        showMessage('正确');
        clickedPath.setAttribute('style', 'fill:green;fill-opacity:1;');
        clickedPath.classList.add('clicked');
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
    if (!svg) {
      console.error('未找到SVG元素');
      return;
    }
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
