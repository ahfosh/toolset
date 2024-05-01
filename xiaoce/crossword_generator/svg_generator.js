// svg_generator.js

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
    var blob = new Blob([svgContent], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "crossword.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
