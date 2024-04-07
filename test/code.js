fetch('code.csv', {
    headers: {
        'Content-Type': 'text/csv; charset=utf-8'
    }
})
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').map(row => row.split(','));
        const areas = rows.slice(0);

        // 获取随机区号
        function getRandomArea() {
            const randomIndex = Math.floor(Math.random() * areas.length);
            return areas[randomIndex];
        }

        let currentArea = getRandomArea();
        let displayBox = document.getElementById('display-box');
        let inputBox = document.getElementById('input-box');
        let submitBtn = document.getElementById('submit-btn');
        let refreshBtn = document.getElementById('refresh-btn');
        let hintBtn = document.getElementById('hint-btn');
        let hintText = document.getElementById('hint-text');

        // 刷新按钮点击事件
        refreshBtn.addEventListener('click', () => {
            currentArea = getRandomArea();
            displayBox.textContent = currentArea[0];
            hintText.textContent = currentArea[2]; // 更新提示信息
            hintText.style.display = 'none';
            hintBtn.style.display = 'none';
        });

        // 提交按钮点击事件
        submitBtn.addEventListener('click', () => {
            checkInput();
        });

        // 输入框输入事件监听
        inputBox.addEventListener('input', () => {
            checkInput();
        });

        // 检查用户输入是否正确
        function checkInput() {
            const userInput = inputBox.value.trim();
            const requiredInput = currentArea[1]; // 第二列的值
            const aliases = requiredInput.split('|'); // 多个可能的输入以 | 分隔

            // 如果用户输入不为空且匹配到了别名
            if (userInput !== '' && aliases.includes(userInput)) {
                currentArea = getRandomArea();
                displayBox.textContent = currentArea[0];
                inputBox.value = '';
                hintText.textContent = currentArea[2]; // 更新提示信息
                hintText.style.display = 'none';
                hintBtn.style.display = 'none';
            }
        }

        // 初始化显示框
        displayBox.textContent = currentArea[0];
        hintText.textContent = currentArea[2]; // 初始化提示信息
    });