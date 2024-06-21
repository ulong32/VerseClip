const date = new Date();
params = new URLSearchParams(location.search);
fetch("https://aipri.jp/mypage/api/myphoto-list", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": document.cookie
    },
    body: `target_ym=${params.get("setDate") !== null ? params.get("setDate") : String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2, "0")}&data_count=999`
})
    .then((r) => r.json())
    .then((obj) => {
        if (obj.data.photo_list.length > 0) chrome.runtime.sendMessage("DL");
    })