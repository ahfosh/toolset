function fetchUserData() {
	const uid = document.getElementById('uidInput').value;
	fetch(`https://tuxun.fun/api/v0/tuxun/getProfile?userId=${uid}`)
		.then(response => response.json())
		.then(data => {
			const profileData = data.data;
			const profileTable = `
				<h2>用户资料</h2>
				<table>
					<tr>
					<th>用户ID</th>
					<td>${profileData.userAO.userId}</td>
					</tr>
					<tr>
					<th>用户名</th>
					<td>${profileData.userAO.userName}</td>
					</tr>
					<tr>
					<th>省份</th>
					<td>${profileData.userAO.province}</td>
					</tr>
					<tr>
					<th>全球积分</th>
					<td>${profileData.userAO.rating}</td>
					</tr>
					<tr>
					<th>中国积分</th>
					<td>${profileData.userAO.chinaRating}</td>
					</tr>
				</table>
			`;
			const rankTable = `
				<h2>积分数据</h2>
				<table>
					<tr>
					<th></th>
					<th>中国</th>
					<th>世界</th>
					</tr>
					<tr>
					<th>积分</th>
					<td>${profileData.chinaRank.rating}</td>
					<td>${profileData.worldRank.rating}</td>
					</tr>
					<tr>
					<th>排名</th>
					<td>${profileData.chinaRank.rank}</td>
					<td>${profileData.worldRank.rank}</td>
					</tr>
					<tr>
					<th>最高积分</th>
					<td>${profileData.chinaRank.maxRating}</td>
					<td>${profileData.worldRank.maxRating}</td>
					</tr>
					<tr>
					<th>游戏次数</th>
					<td>${profileData.chinaRank.gameTimes}</td>
					<td>${profileData.worldRank.gameTimes}</td>
					</tr>
					<tr>
					<th>连胜次数</th>
					<td>${profileData.chinaRank.winningStreak}</td>
					<td>${profileData.worldRank.winningStreak}</td>
					</tr>
					<tr>
					<th>连败次数</th>
					<td>${profileData.chinaRank.loseStreak}</td>
					<td>${profileData.worldRank.loseStreak}</td>
					</tr>
					<tr>
					<th>最长连胜</th>
					<td>${profileData.chinaRank.longestWinningStreak}</td>
					<td>${profileData.worldRank.longestWinningStreak}</td>
					</tr>
					<tr>
					<th>最长连败</th>
					<td>${profileData.chinaRank.longestLoseStreak}</td>
					<td>${profileData.worldRank.longestLoseStreak}</td>
					</tr>
					<tr>
					<th>匹配次数</th>
					<td>${profileData.chinaRank.soloTimes}</td>
					<td>${profileData.worldRank.soloTimes}</td>
					</tr>
					<tr>
					<th>匹配胜场</th>
					<td>${profileData.chinaRank.soloWin}</td>
					<td>${profileData.worldRank.soloWin}</td>
					</tr>
					<tr>
					<th>匹配败场</th>
					<td>${profileData.chinaRank.soloLose}</td>
					<td>${profileData.worldRank.soloLose}</td>
					</tr>
					<tr>
					<th>上次排名</th>
					<td>${profileData.chinaRank.lastRanking}</td>
					<td>${profileData.worldRank.lastRanking}</td>
					</tr>
				</table>
			`;
			document.getElementById('profileData').innerHTML = profileTable + rankTable;
		})
		.catch(error => {
			document.getElementById('profileData').innerHTML = '获取用户数据时出错';
			console.error('错误：', error);
		});
}