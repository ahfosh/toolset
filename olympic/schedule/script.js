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

  let currentWeek = "";
  let weekRowSpan = 1;

  weeks.forEach((week, weekIndex) => {
    week.days.forEach((day, dayIndex) => {
      const row = document.createElement("tr");
      if (weekIndex === weeks.length - 1 && dayIndex === week.days.length - 1) {
        // 处理闭幕式
        row.innerHTML = `
          <td colspan="11">闭幕式&颁奖典礼</td>
        `;
      } else {
        // 处理周的合并
        if (currentWeek === week.week) {
          row.innerHTML = `
          <td>${day.date}</td>
          <td>${day.day}</td>
          <td>${day.events.quiz || ""}</td>
          <td>${day.events.logic || ""}</td>
          <td>${day.events.analysis || ""}</td>
          <td>${day.events.vision || ""}</td>
          <td>${day.events.memory || ""}</td>
          <td>${day.events.duel || ""}</td>
          <td>${day.events.chat || ""}</td>
          <td>${day.events.creation || ""}</td>
          <td>${day.events.gold || ""}</td>
        `;
        } else {
          // 新的一周，设置合并
          row.innerHTML = `
          <td rowspan="${week.days.length}">${week.week}</td>
          <td>${day.date}</td>
          <td>${day.day}</td>
          <td>${day.events.quiz || ""}</td>
          <td>${day.events.logic || ""}</td>
          <td>${day.events.analysis || ""}</td>
          <td>${day.events.vision || ""}</td>
          <td>${day.events.memory || ""}</td>
          <td>${day.events.duel || ""}</td>
          <td>${day.events.chat || ""}</td>
          <td>${day.events.creation || ""}</td>
          <td>${day.events.gold || ""}</td>
        `;
          currentWeek = week.week;
        }
      }
      tbody.appendChild(row);
    });
  });
}
