// chrome.webRequest.onBeforeRequest.addListener(refreshCoursePage, {
//     urls: ["https://schedulebuilder.umn.edu/"]
// })

browser.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            refreshCoursePage()
        }
    }
);

function refreshCoursePage() {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            refreshCoursePage: true
        })
    })
}