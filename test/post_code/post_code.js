document.addEventListener('DOMContentLoaded', () => {
    let displayBox = document.getElementById('display-box');
    let inputBox = document.getElementById('input-box');
    let submitBtn = document.getElementById('submit-btn');
    let refreshBtn = document.getElementById('refresh-btn');
    let hintBtn = document.getElementById('hint-btn');
    let hintText = document.getElementById('hint-text');
    let levelBtns = document.querySelectorAll('.level-btn');

    function fetchCSV(level) {
        let csvFile;
        if (level === 'county') {
            csvFile = 'post_code_county.csv';
        } else if (level === 'prefecture') {
            csvFile = 'post_code_prefecture.csv';
        }

        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                let regions = rows.slice(0);

                function getRandomRegion() {
                    const randomIndex = Math.floor(Math.random() * regions.length);
                    return regions[randomIndex];
                }

                let currentRegion = getRandomRegion();
                displayBox.textContent = currentRegion[0];
                displayBox.style.display = 'block';

                refreshBtn.addEventListener('click', () => {
                    currentRegion = getRandomRegion();
                    displayBox.textContent = currentRegion[0];
                    hintText.style.display = 'none';
                    hintBtn.style.display = 'none';
                });

                submitBtn.addEventListener('click', () => {
                    checkInput();
                });

                inputBox.addEventListener('input', () => {
                    checkInput();
                });

                hintBtn.addEventListener('click', () => {
                    let randomIndex = Math.floor(Math.random() * currentRegion[2].length);
                    hintText.textContent = `提示：第 ${randomIndex + 1} 个字是 ${currentRegion[2][randomIndex]}`;
                    hintText.style.display = 'block';
                    hintBtn.style.display = 'none';
                });

                function checkInput() {
                    const userInput = inputBox.value.trim();
                    const aliases = [currentRegion[1], currentRegion[2]];

                    if (userInput !== '' && aliases.includes(userInput)) {
                        currentRegion = getRandomRegion();
                        displayBox.textContent = currentRegion[0];
                        inputBox.value = '';
                        hintText.style.display = 'none';
                        hintBtn.style.display = 'none';
                    } else {
                        hintBtn.style.display = hintText.style.display === 'none' ? 'inline-block' : 'none';
                    }
                }
            });
    }

    levelBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const selectedLevel = event.target.value;
            if (selectedLevel === 'county' || selectedLevel === 'prefecture') {
                fetchCSV(selectedLevel);
                displayBox.style.display = 'block';
                inputBox.style.display = 'inline-block';
                refreshBtn.style.display = 'inline-block';
                submitBtn.style.display = 'inline-block';
                hintBtn.style.display = 'none';
                hintText.style.display = 'none';
            }
        });
    });
});