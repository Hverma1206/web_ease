chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.hasOwnProperty('fontEnabled') || request.hasOwnProperty('selectedFont')) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
                    if (!chrome.runtime.lastError) {
                        sendResponse(response);
                    }
                });
            }
        });
        return true;
    }
});
