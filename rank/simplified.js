function fetchRankings(rankType) {
  fetch(`https://tuxun.fun/api/v0/tuxun/getRank?type=${rankType}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const rankings = data.data;
        const table = document.getElementById("rankingsTable");
        table.innerHTML =
          "<caption>Top 200</caption><tr><th>排名</th><th>头像</th><th>用户名</th><th>省份</th><th>积分</th></tr>"; // Clear the table

        rankings.forEach((user, index) => {
          const row = table.insertRow(-1);
          const cells = [
            row.insertCell(0), // rankCell
            row.insertCell(1), // avatarCell
            row.insertCell(2), // userNameCell
            row.insertCell(3), // provinceCell
            row.insertCell(4), // ratingCell
          ];

          cells[0].textContent = index + 1; // Generate rank based on index
          const avatar = document.createElement("img");
          const avatarUrl = `https://i.chao-fan.com/${user.userAO.icon}?x-oss-process=image/resize,h_120/quality,q_75`;
          avatar.src = avatarUrl;
          cells[1].appendChild(avatar);
          cells[2].innerHTML = `<a href="https://tuxun.fun/user/${user.userAO.userId}" target="_blank" class="profile-link">${user.userAO.userName}</a>`;
          cells[3].textContent = user.userAO.province;
          cells[4].textContent = user.rating;

          if (index < 3) {
            row.classList.add(["gold", "silver", "bronze"][index]); // Add medal class based on index
          }
        });
      } else {
        console.error("Failed to fetch user rankings");
      }
    })
    .catch((error) => {
      console.error("Error fetching user rankings:", error);
    });
}

// Fetch the default rankings on page load
fetchRankings("world");
