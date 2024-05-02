// svg_generator.js

var startCell = null;
var endCell = null;

function createSVG() {
    var rows = parseInt(document.getElementById('rows').value);
    var columns = parseInt(document.getElementById('columns').value);
    var svg = '<svg width="' + (columns * 50) + '" height="' + (rows * 50) + '" xmlns="http://www.w3.org/2000/svg">';
    
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            svg += '<rect id="cell_' + i + '_' + j + '" x="' + (j * 50) + '" y="' + (i * 50) + '" width="50" height="50" fill="#ffffff" stroke="#000000"/>';
        }
    }
    
    svg += '</svg>';
    document.getElementById('svg-container').innerHTML = svg;
}

function exportSVG() {
    var svgContent = document.getElementById('svg-container').innerHTML;
    var blob = new Blob([svgContent], {type: "image/svg+xml"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "crossword.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// svg_generator.js

function selectCells() {
    var cells = document.querySelectorAll('rect');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            if (startCell === null) {
                startCell = this.id;
                this.style.fill = '#ffff00'; // Yellow color to indicate start cell
                console.log('Start Cell:', startCell);
            } else if (endCell === null) {
                var cellIdParts = this.id.split('_');
                var startCellIdParts = startCell.split('_');
                if (cellIdParts[0] === startCellIdParts[0] || cellIdParts[1] === startCellIdParts[1]) {
                    endCell = this.id;
                    this.style.fill = '#ffff00'; // Yellow color to indicate end cell
                    console.log('End Cell:', endCell);
                    var numRows = Math.abs(parseInt(cellIdParts[0]) - parseInt(startCellIdParts[0])) + 1;
                    var numCols = Math.abs(parseInt(cellIdParts[1]) - parseInt(startCellIdParts[1])) + 1;
                    console.log('Selected Cells:', numRows * numCols + 1); // Add 1 to account for the starting cell
                    document.getElementById('insertText').style.display = 'inline';
                    document.querySelector('#inputText button:last-of-type').style.display = 'inline';
                } else {
                    alert('End cell must be in the same row or column as start cell.');
                }
            }
        });
    });
}

function addCharacters() {
    var insertText = document.getElementById('insertText').value;
    console.log('Insert Text:', insertText);
    console.log('Insert Text Length:', insertText.length);
    var startCellIdParts = startCell.split('_');
    var endCellIdParts = endCell.split('_');
    var numRows = Math.abs(parseInt(endCellIdParts[0]) - parseInt(startCellIdParts[0])) + 1;
    var numCols = Math.abs(parseInt(endCellIdParts[1]) - parseInt(startCellIdParts[1])) + 1;

    if (insertText.length !== numRows * numCols) {
        alert('Number of characters must match the number of selected cells.');
        return;
    }

    var textIndex = 0;
    for (var i = Math.min(parseInt(startCellIdParts[0]), parseInt(endCellIdParts[0])); i < Math.max(parseInt(startCellIdParts[0]), parseInt(endCellIdParts[0])) + 1; i++) {
        for (var j = Math.min(parseInt(startCellIdParts[1]), parseInt(endCellIdParts[1])); j < Math.max(parseInt(startCellIdParts[1]), parseInt(endCellIdParts[1])) + 1; j++) {
            var cell = document.getElementById('cell_' + i + '_' + j);
            cell.textContent = insertText[textIndex];
            textIndex++;
        }
    }

    // Reset the start and end cells
    startCell = null;
    endCell = null;
    document.getElementById('insertText').value = '';
    document.getElementById('insertText').style.display = 'none';
    document.querySelector('#inputText button:last-of-type').style.display = 'none';
    resetCellColors();
}

function resetCellColors() {
    var cells = document.querySelectorAll('rect');
    cells.forEach(function(cell) {
        cell.style.fill = '#ffffff'; // Reset cell color to white
    });
}

/*
inputText，用于向若干个单元格内填充文本。
有两个按钮和一个输入框：selectCells按钮，按下后开始启动选择器。
第一个点击的单元格被视为开始框，第二个点击的单元格被视为结束框。
注意，结束框必须与开始框在同一列或行，否则就要求重新选择结束框。
计算开始框到结束框之间有多少个单元格。
完成上述操作后，才会显示insertText输入框和addCharacters按钮。
用户可以在输入框里键入若干字符（其数量等于选定单元格的数量）
点击addCharacters按钮后，将输入的字符分切成单个字符，依次插入选定的单元格。
*/