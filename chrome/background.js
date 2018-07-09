// chrome.webRequest.onBeforeRequest.addListener(refreshCoursePage, {
//     urls: ["https://schedulebuilder.umn.edu/"]
// })

chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
        if (changeInfo.url) {
            refreshCoursePage()
        }
    }
);

function refreshCoursePage() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            refreshCoursePage: true
        })
    })
}