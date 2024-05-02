$(document).ready(function () {
    var copyText = ""
    $("#copyBtn").click(async function () {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(copyText)
                .then(() => {
                    var notification = document.getElementById('hint');
                    notification.classList.add('show');
                    setTimeout(function () {
                        notification.classList.remove('show');
                    }, 1500);
                })
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = copyText;
            textArea.style.position = "absolute";
            textArea.style.opacity = 0;
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    })
    function proc(e) {
        var ret = []
        e.each(function () {
            var answerParam = $("#answerParam").val()
            var id = $(this).attr('id');
            var title = $(this).attr('title') || $(this).attr('name')
            if (!title && /[\u4e00-\u9fa5]/.test(id)) {
                title = id; // 如果没有标题且包含中文，则使用ID代替
            }
            if (answerParam) {
                title = ""
                let that = this
                answerParam.split("/").forEach(function (e) {
                    title += $(that).attr(e) + "/"
                })
                title = title.slice(0, -1)
            }
            ret.push({ "type": $(this).prop("tagName"), "id": id, "name": title })
        })
        return ret
    }
    $("#extractBtn").click(function () {
        var file = $("#svgFile")[0].files[0];
        var selectedTag = $("#pathType").val();
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                copyText = ""
                var svgText = e.target.result;
                var svg = $(svgText);
                var elements = svg.find(selectedTag);
                var totalIds = 0;
                var parsedElements = proc(elements)
                var displayType = $("#displayType").val();
                var pathList = $("#pathList");
                var pathTable = $("#pathTable");
                pathList.empty();
                pathTable.find("tr:gt(0)").remove();
                var pathDis = displayType == "text" ? pathList : pathTable
                var nonPathDis = displayType == "table" ? pathList : pathTable
                var dic = {
                    "text": "<li>TYPE,ID,TITLE</li>",
                    "table": "<tr><td>TYPE</td><td>ID</td><td>TITLE</td></tr>"
                }
                parsedElements.forEach(function (e) {
                    pathDis.append(dic[displayType].replace('TYPE', e.type).replace('ID', e.id).replace('TITLE', e.name));
                    copyText += `${e.type},${e.id},${e.name}\n`
                    totalIds++
                });
                $("#tableDisplay").hide();
                $("#textDisplay").hide();
                $(`#${displayType}Display`).show();
                $(`#totalIdsText`).text(totalIds);
                $(`#totalIdsTable`).text(totalIds);
            }
            reader.readAsText(file);
        }
        else {
            alert("请选择一个SVG文件以提取路径。");
        }
    });
});