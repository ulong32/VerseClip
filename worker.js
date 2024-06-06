let lastExecutionTime = 0;


chrome.runtime.onInstalled.addListener(() => {
    //初回インストール時、アクションを無効に
    chrome.action.disable();

    //該当ページにアクセス時のみ拡張機能を有効に
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        const pageMatchRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: "aipri.jp",
                        pathEquals: "/mypage/myphoto/"
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()]
        };
        chrome.declarativeContent.onPageChanged.addRules([pageMatchRule])
    })
})

//アイコンがクリックされたとき
chrome.action.onClicked.addListener((tab) => {
    //前回の実行から5秒経過した場合のみ処理を実行
    if (new Date().getTime() - lastExecutionTime > 5000) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["onClicked.js"],
        });
        lastExecutionTime = new Date().getTime();
    }
});

chrome.runtime.onMessage.addListener((request, sender) => {
    chrome.action.setBadgeText({ text: "DL", tabId: sender.tab.id });
})