let lastExecutionTime = 0;



chrome.deClarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.deClarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.deClarativeContent.PageStateMatcher({
                pageUrl: {
                    hostEquals: "aipri.jp",
                    pathEquals: "/mypage/myphoto/"
                }
            })
        ],
        actions: [
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["onClicked.js"]
            })
        ]
    }])
})