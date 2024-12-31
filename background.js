chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.hasOwnProperty('fontEnabled') || request.hasOwnProperty('selectedFont')) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
                    if (!chrome.runtime.lastError) sendResponse(response);
                });
            }
        });
        return true;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.match(/^(http|https|file):\/\//)) {
        chrome.storage.local.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {
            if (data.fontEnabled) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).then(() => {
                    chrome.tabs.sendMessage(tabId, {
                        fontEnabled: data.fontEnabled,
                        selectedFont: data.selectedFont || 'OpenDyslexic-Regular',
                        fontSize: data.fontSize || '16'
                    });
                }).catch(() => {});
            }
        });
    }
});
