// 读取车牌数据
fetch('carplate.csv')
	.then(response => response.text())
	.then(data => {
	const rows = data.split('\n').map(row => row.split(','));
	const counties = rows.slice(0);

// 获取随机车牌
function getRandomCarPlate() {
	const randomIndex = Math.floor(Math.random() * counties.length);
	return counties[randomIndex];
}

let currentCarPlate = getRandomCarPlate();
let displayBox = document.getElementById('display-box');
let inputBox = document.getElementById('input-box');
let submitBtn = document.getElementById('submit-btn');
let refreshBtn = document.getElementById('refresh-btn');
let hintBtn = document.getElementById('hint-btn');
let hintText = document.getElementById('hint-text');

// 刷新按钮点击事件
refreshBtn.addEventListener('click', () => {
	currentCarPlate = getRandomCarPlate();
	displayBox.textContent = currentCarPlate[0];
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
	const aliases = currentCarPlate[1]; // 第二列的值

	// 如果用户输入不为空且匹配到了别名
	if (userInput !== '' && aliases.includes(userInput)) {
		currentCarPlate = getRandomCarPlate();
		displayBox.textContent = currentCarPlate[0];
		inputBox.value = '';
		hintText.style.display = 'none';
		hintBtn.style.display = 'none';
	}
}

// 初始化显示框
displayBox.textContent = currentCarPlate[0];
});