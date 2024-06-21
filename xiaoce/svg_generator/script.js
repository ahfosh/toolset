function processFiles() {
    const csvFileName = 'regions.csv';
    const svgFileName = 'svg.svg';
    const placeNamesInput = document.getElementById('placeNames').value;

    // 支持逗号、换行、斜杠、空格、顿号作为分隔符，并去除重复项
    const placeNames = [...new Set(placeNamesInput.split(/,|\n|\/|\s|、/).map(name => name.trim()))];

    if (placeNames.length === 0) {
        alert('请输入至少一个地名。');
        return;
    }

    readCSV(csvFileName).then(csvData => {
        const pathIds = getPathIdsFromCSV(csvData, placeNames);
        readSVG(svgFileName).then(svgData => {
            const resultSVG = filterSVG(svgData, pathIds);
            createDownloadLink(resultSVG);
        });
    }).catch(error => {
        console.error('处理文件时出错：', error);
        alert('处理文件时出错，请检查控制台获取更多信息。');
    });
}

function readCSV(fileName) {
    return new Promise((resolve, reject) => {
        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${fileName}`);
                }
                return response.text();
            })
            .then(text => {
                const csvData = parseCSV(text);
                resolve(csvData);
            })
            .catch(error => reject(error));
    });
}

function parseCSV(text) {
    const rows = text.split('\n');
    const data = {};
    rows.forEach(row => {
        const [id, fullName, shortName] = row.split(',');
        if (id && fullName && shortName) {
            data[fullName.trim()] = id.trim(); // 使用全名作为键
            data[shortName.trim()] = id.trim(); // 使用简称作为键
        }
    });
    return data;
}

function getPathIdsFromCSV(csvData, placeNames) {
    return placeNames.map(name => csvData[name]).filter(id => id);
}

function readSVG(fileName) {
    return fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${fileName}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error('Failed to read SVG file:', error);
            alert('读取SVG文件时出错，请检查控制台获取更多信息。');
        });
}

function filterSVG(svgData, pathIds) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svgData, "image/svg+xml");
    const svgElement = xmlDoc.getElementsByTagName('svg')[0];

    const newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSVG.setAttribute("viewBox", svgElement.getAttribute("viewBox"));
    newSVG.setAttribute("width", svgElement.getAttribute("width"));
    newSVG.setAttribute("height", svgElement.getAttribute("height"));

    pathIds.forEach(id => {
        const pathElement = xmlDoc.getElementById(id);
        if (pathElement) {
            newSVG.appendChild(pathElement.cloneNode(true));
        }
    });

    return newXMLString(newSVG);
}

function newXMLString(element) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(element);
}

function displayPreview(svgData) {
    const previewSVG = document.getElementById('previewSVG');
    previewSVG.innerHTML = svgData;
}

function createDownloadLink(svgData) {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = 'result.svg';
    link.style.display = 'block';
    link.innerText = '下载结果SVG';
}