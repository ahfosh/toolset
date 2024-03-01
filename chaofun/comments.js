async function fetchComments() {
    const postId = document.getElementById('postIdInput').value;
    const response = await fetch(`https://choa.fun/api/v0/list_comments?postId=${postId}&pageNum=0&pageSize=100&order=hot`);
    const data = await response.json();
    const searchText = document.getElementById('searchText').value; // 获取要搜索的文本

    const commentsTable = document.getElementById('comments');
    commentsTable.innerHTML = ''; // 清空之前的评论

    let index = 1; // 初始化序号

    data.data.forEach(async comment => {
        const text = comment.text;
        const userId = comment.userInfo.userId;
        const userName = comment.userInfo.userName;

        if (text === searchText) { // 检测评论内容是否包含搜索的文本
            const userProfileResponse = await fetch(`https://choa.fun/api/v0/tuxun/getProfile?userId=${userId}`);
            const userProfileData = await userProfileResponse.json();
            const { rating, chinaRating } = userProfileData.data.userAO;

            const banCheckResponse = await fetch(`https://tuxun.fun/api/v0/tuxun/user/checkBan?userId=${userId}`);
            const banCheckData = await banCheckResponse.json();
            const isBanned = banCheckData.data;

            const row = commentsTable.insertRow();
            const cellIndex = row.insertCell(0);
            const cellUserId = row.insertCell(1);
            const cellUserName = row.insertCell(2);
            const cellRating = row.insertCell(3);
            const cellChinaRating = row.insertCell(4);
            const cellIsBanned = row.insertCell(5);

            cellIndex.textContent = index; // 设置序号
            cellUserId.textContent = userId;
            cellUserName.textContent = userName;
            cellRating.textContent = rating;
            cellChinaRating.textContent = chinaRating;
            cellIsBanned.textContent = isBanned ? 'true' : 'false';
            index++; // 更新序号
        }
    });
}
