let medalData = [];
let currentSortColumn = null;
let ascendingOrder = true;

document.addEventListener("DOMContentLoaded", function () {
  // 加载数据
  fetch("medal_table.json")
    .then((response) => response.json())
    .then((data) => {
      medalData = data;
      renderTable(medalData);
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// 渲染表格
function renderTable(data) {
  const tbody = document.querySelector("#medalTable tbody");
  tbody.innerHTML = ""; // 清空表格
  data.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.nickname}</td>
            <td><a href="${entry.link}" target="_blank">${entry.name}</a></td>
            <td>${entry.gold}</td>
            <td>${entry.silver}</td>
            <td>${entry.bronze}</td>
            <td>${entry.gold + entry.silver + entry.bronze}</td>
        `;
    tbody.appendChild(row);
  });
}
