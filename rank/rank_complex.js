function fetchComplexRankings(rankType) {
	fetch(`https://tuxun.fun/api/v0/tuxun/getRank?type=${rankType}`)
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				const rankings = data.data;
				const table = document.getElementById('rankingsTable');
				table.innerHTML = '<caption>Top 200</caption><tr><th>排名</th><th>头像</th><th>用户名</th><th>省份</th><th>积分</th><th>高分</th><th>轮次</th><th>匹配</th><th>胜场</th><th>败场</th><th>胜率</th><th>连胜</th><th>连败</th><th>长胜</th><th>长败</th></tr>'; // Clear the table

				rankings.forEach((user, index) => {
					const row = table.insertRow(-1);
					const cells = [
						row.insertCell(0), // rankCell
						row.insertCell(1), // avatarCell
						row.insertCell(2), // userNameCell
						row.insertCell(3), // provinceCell
						row.insertCell(4), // ratingCell
						row.insertCell(5), // maxRatingCell
						row.insertCell(6), // gameTimesCell
						row.insertCell(7), // soloTimesCell
						row.insertCell(8), // soloWinCell
						row.insertCell(9), // soloLoseCell
						row.insertCell(10),// winRateCell
						row.insertCell(11),// winningStreakCell
						row.insertCell(12),// loseStreakCell
						row.insertCell(13),// longestWinningStreakCell
						row.insertCell(14) // longestLoseStreakCell
					];

					cells[0].textContent = index + 1; // Generate rank based on index
					const avatar = document.createElement('img');
					const avatarUrl = `https://i.chao-fan.com/${user.userAO.icon}?x-oss-process=image/resize,h_120/quality,q_75`;
					avatar.src = avatarUrl;
					cells[1].appendChild(avatar);
					cells[2].innerHTML = `<a href="https://tuxun.fun/user/${user.userAO.userId}" target="_blank" class="profile-link">${user.userAO.userName}</a>`;
					cells[3].textContent = user.userAO.province;
					cells[4].textContent = user.rating;

					if (index < 3) {
						row.classList.add(['gold', 'silver', 'bronze'][index]); // Add medal class based on index
					}

					fetchUserProfileData(rankType, user.userAO.userId, cells[5], cells[6], cells[7], cells[8], cells[9], cells[10], cells[11], cells[12], cells[13], cells[14]);
				});
			} else {
				console.error('Failed to fetch user rankings');
			}
		})
		.catch(error => {
			console.error('Error fetching user rankings:', error);
		});
}

function fetchUserProfileData(rankType, userId, maxRatingCell, gameTimesCell, soloTimesCell, soloWinCell, soloLoseCell, winRateCell, winningStreakCell, loseStreakCell, longestWinningStreakCell, longestLoseStreakCell) {
	fetch(`https://tuxun.fun/api/v0/tuxun/getProfile?userId=${userId}`)
		.then(response => response.json())
		.then(data => {
			const rankField = rankType === 'world' ? 'worldRank' : 'chinaRank';
			maxRatingCell.textContent = data.data[rankField].maxRating;
			gameTimesCell.textContent = data.data[rankField].gameTimes;
			soloTimesCell.textContent = data.data[rankField].soloTimes;
			soloWinCell.textContent = data.data[rankField].soloWin;
			soloLoseCell.textContent = data.data[rankField].soloLose;

			const winRate = (data.data[rankField].soloWin / (data.data[rankField].soloWin + data.data[rankField].soloLose)) * 100;
			winRateCell.textContent = `${winRate.toFixed(2)}%`;

			winningStreakCell.textContent = data.data[rankField].winningStreak;
			loseStreakCell.textContent = data.data[rankField].loseStreak;
			longestWinningStreakCell.textContent = data.data[rankField].longestWinningStreak;
			longestLoseStreakCell.textContent = data.data[rankField].longestLoseStreak;
		})
		.catch(error => {
			console.error('Error fetching user data:', error);
		});
}
fetchComplexRankings('world');