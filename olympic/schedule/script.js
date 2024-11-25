document.addEventListener("DOMContentLoaded", function () {
  // 加载 JSON 数据
  fetch("schedule.json")
    .then((response) => response.json())
    .then((data) => {
      renderSchedule(data.weeks);
    })
    .catch((error) => console.error("Error fetching schedule data:", error));
});

// 渲染赛程表
function renderSchedule(weeks) {
  const tbody = document.querySelector("#scheduleTable tbody");
  let lastWeek = "";
  let lastDate = "";
  let lastDay = "";
  let weekSpan = 0;
  let dateSpan = 0;
  let daySpan = 0;

  weeks.forEach((week, weekIndex) => {
    week.days.forEach((day, dayIndex) => {
      const row = document.createElement("tr");

      if (week.week === lastWeek) {
        weekSpan = 0;
      } else {
        weekSpan = week.days.length;
        lastWeek = week.week;
      }

      if (day.date === lastDate) {
        dateSpan = 0;
      } else {
        dateSpan = 1;
        lastDate = day.date;
      }

      if (day.day === lastDay) {
        daySpan = 0;
      } else {
        daySpan = 1;
        lastDay = day.day;
      }

      row.innerHTML = `
       ${weekSpan > 0 ? `<td rowspan="${weekSpan}">${week.week}</td>` : ""}
        <td ${dateSpan > 0 ? `rowspan="${dateSpan}"` : ""}>${day.date}</td>
        <td ${daySpan > 0 ? `rowspan="${daySpan}"` : ""}>${day.day}</td>
        <td>${day.events.quiz || ""}</td>
        <td>${day.events.logic || ""}</td>
        <td>${day.events.analysis || ""}</td>
        <td>${day.events.vision || ""}</td>
        <td>${day.events.memory || ""}</td>
        <td>${day.events.duel || ""}</td>
        <td>${day.events.chat || ""}</td>
        <td>${day.events.gold || ""}</td>
      `;
      tbody.appendChild(row);
    });
  });

  // 处理最后一行合并
  const finalRow = document.createElement("tr");
  finalRow.innerHTML = `
    <td colspan="12" style="text-align:center;">闭幕式 & 颁奖典礼</td>
  `;
  tbody.appendChild(finalRow);
}
