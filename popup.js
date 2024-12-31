document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.querySelector('#font-toggle');
    const select = document.querySelector('#font-select');
    const fontSizeSlider = document.querySelector('#font-size-slider');
    const sizeValue = document.querySelector('#size-value');

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

    if (chrome?.storage?.local) {  // Changed from sync to local
        chrome.storage.local.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {
            checkbox.checked = data.fontEnabled || false;
            select.value = data.selectedFont || 'OpenDyslexic-Regular';
            select.disabled = !checkbox.checked;
            fontSizeSlider.value = data.fontSize || '16';
            fontSizeSlider.disabled = !checkbox.checked;
            sizeValue.textContent = `${fontSizeSlider.value}px`;

            sendMessageToActiveTab({
                fontEnabled: checkbox.checked,
                selectedFont: checkbox.checked ? select.value : null,
                fontSize: fontSizeSlider.value
            });
        });

        checkbox.addEventListener('change', function () {
            chrome.storage.local.set({ fontEnabled: checkbox.checked }, () => {  // Changed from sync to local
                sendMessageToActiveTab({
                    fontEnabled: checkbox.checked,
                    selectedFont: checkbox.checked ? select.value : null,
                    fontSize: fontSizeSlider.value
                });
            });
            select.disabled = !checkbox.checked;
            fontSizeSlider.disabled = !checkbox.checked;
        });

        select.addEventListener('change', function () {
            chrome.storage.local.set({ selectedFont: select.value }, () => {  // Changed from sync to local
                sendMessageToActiveTab({ selectedFont: select.value });
            });
        });

        fontSizeSlider.addEventListener('input', function() {
            sizeValue.textContent = `${this.value}px`;
            chrome.storage.local.set({ fontSize: this.value }, () => {  // Changed from sync to local
                sendMessageToActiveTab({
                    fontSize: this.value,
                    fontEnabled: checkbox.checked,
                    selectedFont: select.value
                });
            });
        });
    }
});
