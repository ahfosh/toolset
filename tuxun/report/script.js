const inputLinks = document.getElementById("input-links");
const outputLinks = document.getElementById("output-links");
const processBtn = document.getElementById("process-btn");
const copyBtn = document.getElementById("copy-btn");
const saveBtn = document.getElementById("save-btn");
const pendingList = document.getElementById("pending-list");
const saveModal = document.getElementById("save-modal");
const retrieveModal = document.getElementById("retrieve-modal");
const modalLinks = document.getElementById("modal-links");
const userNameInput = document.getElementById("user-name");
const userIdInput = document.getElementById("user-id");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const retrieveLinks = document.getElementById("retrieve-links");
const retrieveUserNameInput = document.getElementById("retrieve-user-name");
const retrieveUserIdInput = document.getElementById("retrieve-user-id");
const retrieveBtn = document.getElementById("retrieve-btn");
const deleteBtn = document.getElementById("delete-btn");
const closeSaveModal = document.getElementById("close-save-modal");
const closeRetrieveModal = document.getElementById("close-retrieve-modal");

// 处理按钮点击事件
processBtn.addEventListener("click", () => {
  const lines = inputLinks.value.split("\n");
  const processedLinks = [];
  let userId;
  let allSameUserId = true;

  lines.forEach((line) => {
    // 尝试从一行中提取多个链接，假设链接以常见分隔符分隔
    const possibleLinks = line
      .split(/[ ,;\t]+/)
      .filter((link) => link.trim() !== "");
    possibleLinks.forEach((link) => {
      try {
        const url = new URL(link);
        if (url.pathname.includes("replay-pano")) {
          processedLinks.push(link);
        } else if (
          url.pathname.includes("replay") ||
          url.pathname.includes("replayplayer")
        ) {
          const gameId = url.searchParams.get("gameId");
          const round =
            url.searchParams.get("chooseRound") ||
            url.searchParams.get("round");
          const currentUserId =
            url.searchParams.get("chooseUser") ||
            url.searchParams.get("userId");

          if (!userId) {
            userId = currentUserId;
          } else if (userId !== currentUserId) {
            allSameUserId = false;
          }

          const newLink = `https://tuxun.fun/replay-pano?gameId=${gameId}&round=${round}`;
          processedLinks.push(newLink);
        }
      } catch (error) {
        // 忽略有问题的链接
        console.log(`忽略有问题的链接: ${link}`);
      }
    });
  });

  const uniqueLinks = [...new Set(processedLinks)];
  outputLinks.value = uniqueLinks.join("\n");

  if (allSameUserId && userId) {
    userIdInput.value = userId;
  } else {
    userIdInput.value = "";
  }
});

// 复制按钮点击事件
copyBtn.addEventListener("click", () => {
  const textToCopy = outputLinks.value;
  if (textToCopy) {
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = textToCopy;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  }
});

// 暂存按钮点击事件
saveBtn.addEventListener("click", () => {
  modalLinks.value = outputLinks.value;
  saveModal.style.display = "block";
});

// 保存按钮点击事件
modalSaveBtn.addEventListener("click", () => {
  const userName = userNameInput.value;
  const userId = userIdInput.value;
  const links = modalLinks.value;
  const data = `${userName} uid:${userId}\n${links}`;
  const key = `pending_${Date.now()}`;
  localStorage.setItem(key, data);

  const row = document.createElement("tr");
  const indexCell = document.createElement("td");
  const infoCell = document.createElement("td");
  const actionCell = document.createElement("td");

  indexCell.textContent = pendingList.children.length + 1;
  infoCell.textContent = `${userName} uid:${userId}`;
  infoCell.style.cursor = "pointer";
  infoCell.dataset.key = key;

  const copyIcon = document.createElement("span");
  copyIcon.classList.add("copy-icon");
  copyIcon.innerHTML = "&#128203;"; // 复制图标
  copyIcon.addEventListener("click", () => {
    const storedData = localStorage.getItem(key);
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = storedData;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  });

  infoCell.addEventListener("click", () => {
    const storedData = localStorage.getItem(infoCell.dataset.key).split("\n");
    const storedUserName = storedData[0].split(" ")[0];
    const storedUserId = storedData[0].split(" ")[1].split(":")[1];
    const storedLinks = storedData.slice(1).join("\n");

    retrieveUserNameInput.value = storedUserName;
    retrieveUserIdInput.value = storedUserId;
    retrieveLinks.value = storedLinks;
    retrieveModal.style.display = "block";
    retrieveModal.dataset.key = infoCell.dataset.key;
  });

  actionCell.appendChild(copyIcon);

  row.appendChild(indexCell);
  row.appendChild(infoCell);
  row.appendChild(actionCell);
  pendingList.appendChild(row);

  saveModal.style.display = "none";
});

// 调取按钮点击事件
retrieveBtn.addEventListener("click", () => {
  inputLinks.value = retrieveLinks.value;
  retrieveModal.style.display = "none";
});

// 删除按钮点击事件
deleteBtn.addEventListener("click", () => {
  const key = retrieveModal.dataset.key;
  if (key) {
    localStorage.removeItem(key);
    retrieveModal.style.display = "none";
    const rows = Array.from(pendingList.children);
    const index = rows.findIndex((r) => r.children[1].dataset.key === key);
    if (index !== -1) {
      pendingList.removeChild(rows[index]);
    }
  }
});

// 取消按钮点击事件
modalCancelBtn.addEventListener("click", () => {
  saveModal.style.display = "none";
});

// 关闭模态框
closeSaveModal.addEventListener("click", () => {
  saveModal.style.display = "none";
});
closeRetrieveModal.addEventListener("click", () => {
  retrieveModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === saveModal) {
    saveModal.style.display = "none";
  }
  if (event.target === retrieveModal) {
    retrieveModal.style.display = "none";
  }
});

window.addEventListener("load", () => {
  // 遍历localStorage中的数据
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("pending_")) {
      const data = localStorage.getItem(key);
      const storedData = data.split("\n");
      const storedUserName = storedData[0].split(" ")[0];
      const storedUserId = storedData[0].split(" ")[1].split(":")[1];
      const storedLinks = storedData.slice(1).join("\n");

      // 创建表格行并添加到pendingList中
      const row = document.createElement("tr");
      const indexCell = document.createElement("td");
      const infoCell = document.createElement("td");
      const actionCell = document.createElement("td");

      indexCell.textContent = pendingList.children.length + 1;
      infoCell.textContent = `${storedUserName} uid:${storedUserId}`;
      infoCell.style.cursor = "pointer";
      infoCell.dataset.key = key;

      const copyIcon = document.createElement("span");
      copyIcon.classList.add("copy-icon");
      copyIcon.innerHTML = "&#128203;"; // 复制图标
      copyIcon.addEventListener("click", () => {
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = data;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);
      });

      infoCell.addEventListener("click", () => {
        retrieveUserNameInput.value = storedUserName;
        retrieveUserIdInput.value = storedUserId;
        retrieveLinks.value = storedLinks;
        retrieveModal.style.display = "block";
        retrieveModal.dataset.key = infoCell.dataset.key;
      });

      actionCell.appendChild(copyIcon);

      row.appendChild(indexCell);
      row.appendChild(infoCell);
      row.appendChild(actionCell);
      pendingList.appendChild(row);
    }
  }
});
