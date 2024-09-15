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

  // 为每一个可排序的列添加点击事件
  const headers = document.querySelectorAll("th[data-sort]");
  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const sortKey = this.getAttribute("data-sort");
      sortTable(sortKey);
    });
  });
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
            <td>${entry.real_name || "-"}</td>
            <td>${entry.gold}</td>
            <td>${entry.silver}</td>
            <td>${entry.bronze}</td>
            <td>${entry.gold + entry.silver + entry.bronze}</td>
        `;
    tbody.appendChild(row);
  });
}

// 排序表格数据
function sortTable(sortKey) {
  if (currentSortColumn === sortKey) {
    ascendingOrder = !ascendingOrder; // 切换升序/降序
  } else {
    currentSortColumn = sortKey;
    ascendingOrder = true; // 默认升序
  }

  const sortedData = [...medalData].sort((a, b) => {
    if (ascendingOrder) {
      return a[sortKey] - b[sortKey];
    } else {
      return b[sortKey] - a[sortKey];
    }
  });

  renderTable(sortedData);
}
