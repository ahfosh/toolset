document.addEventListener("DOMContentLoaded", function () {
  fetch("medal_table.json")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#medalTable tbody");
      data.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.nickname}</td>
                    <td>${entry.real_name || "-"}</td>
                    <td>${entry.gold}</td>
                    <td>${entry.silver}</td>
                    <td>${entry.bronze}</td>
                    <td>${entry.total}</td>
                `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});
