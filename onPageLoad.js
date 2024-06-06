//フォトが1枚以上ある場合のみバッジ表示
const mutationObserver = new MutationObserver(function () {
    if (document.querySelectorAll("a.photo_Anchor").length > 0) {
        chrome.runtime.sendMessage("DL");
    }
})
mutationObserver.observe(document.querySelector("ul.photo_list"), { childList: true });

setTimeout(() => {
    if (document.querySelectorAll("a.photo_Anchor").length > 0) {
        chrome.runtime.sendMessage("DL");
    }
}, 400);