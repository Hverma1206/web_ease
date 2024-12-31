document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.querySelector('#font-toggle');
    const select = document.querySelector('#font-select');
    const fontSizeInput = document.querySelector('#font-size-input');
    const fontSizeDisplay = document.querySelector('#font-size-display');

    function sendMessageToActiveTab(message) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (!tabs[0]?.id || !tabs[0]?.url?.match(/^(http|https|file):\/\//)) {
                return;
            }

            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                }).catch(() => {});

                chrome.tabs.sendMessage(tabs[0].id, message);
            } catch (error) {}
        });
    }

    if (chrome?.storage?.sync) {
        chrome.storage.sync.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {
            checkbox.checked = data.fontEnabled || false;
            select.value = data.selectedFont || 'OpenDyslexic-Regular';
            select.disabled = !checkbox.checked;
            fontSizeInput.value = data.fontSize || '16';
            fontSizeDisplay.textContent = `${fontSizeInput.value}px`;

            sendMessageToActiveTab({
                fontEnabled: checkbox.checked,
                selectedFont: checkbox.checked ? select.value : null,
                fontSize: fontSizeInput.value
            });
        });

        checkbox.addEventListener('change', function () {
            chrome.storage.sync.set({ fontEnabled: checkbox.checked }, () => {
                sendMessageToActiveTab({
                    fontEnabled: checkbox.checked,
                    selectedFont: checkbox.checked ? select.value : null,
                });
            });
            select.disabled = !checkbox.checked;
        });

        select.addEventListener('change', function () {
            chrome.storage.sync.set({ selectedFont: select.value }, () => {
                sendMessageToActiveTab({ selectedFont: select.value });
            });
        });

        fontSizeInput.addEventListener('input', function () {
            fontSizeDisplay.textContent = `${fontSizeInput.value}px`;
            chrome.storage.sync.set({ fontSize: fontSizeInput.value }, () => {
                sendMessageToActiveTab({ fontSize: fontSizeInput.value });
            });
        });
    }
});
