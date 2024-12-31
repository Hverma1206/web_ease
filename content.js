if (!window.hasRunOpenDyslexicScript) {
    window.hasRunOpenDyslexicScript = true;

    const fontFaceStyle = document.createElement('style');
    fontFaceStyle.textContent = `
    @font-face {
        font-family: 'OpenDyslexic-Regular';
        src: url(${chrome.runtime.getURL('fonts/OpenDyslexic-Regular.otf')}) format('opentype');
    }
    @font-face {
        font-family: 'OpenDyslexic-Bold';
        src: url(${chrome.runtime.getURL('fonts/OpenDyslexic-Bold.otf')}) format('opentype');
    }
    @font-face {
        font-family: 'OpenDyslexic-Italic';
        src: url(${chrome.runtime.getURL('fonts/OpenDyslexic-Italic.otf')}) format('opentype');
    }`;
    document.documentElement.appendChild(fontFaceStyle);

    function applyFont(fontFamily, fontSize) {
        const css = `* { font-family: '${fontFamily}' !important; font-size: ${fontSize}px !important; }`;
        let fontStyleElement = document.getElementById('openDyslexicStyle');
        if (!fontStyleElement) {
            fontStyleElement = document.createElement('style');
            fontStyleElement.id = 'openDyslexicStyle';
            document.documentElement.appendChild(fontStyleElement);
        }
        fontStyleElement.textContent = css;
    }

    function removeFont() {
        const fontStyleElement = document.getElementById('openDyslexicStyle');
        if (fontStyleElement) {
            fontStyleElement.remove();
        }
    }

    function initializeFontSettings() {
        chrome.storage.sync.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {
            if (data.fontEnabled) {
                applyFont(data.selectedFont || 'OpenDyslexic-Regular', data.fontSize || '16');
            }
        });
    }

    initializeFontSettings();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
            if (message.fontEnabled !== undefined) {
                if (message.fontEnabled) {
                    applyFont(message.selectedFont || 'OpenDyslexic-Regular', message.fontSize || '16');
                } else {
                    removeFont();
                }
                chrome.storage.sync.set({ fontEnabled: message.fontEnabled, selectedFont: message.selectedFont, fontSize: message.fontSize });
            } else if (message.selectedFont || message.fontSize) {
                applyFont(message.selectedFont, message.fontSize);
                chrome.storage.sync.set({ selectedFont: message.selectedFont, fontSize: message.fontSize });
            }
            sendResponse({ status: "Font updated successfully" });
        } catch (error) {
            sendResponse({ status: "Error updating font" });
        }
        return true;
    });

    const observer = new MutationObserver((mutations) => {
        chrome.storage.sync.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {
            if (data.fontEnabled) {
                applyFont(data.selectedFont || 'OpenDyslexic-Regular', data.fontSize || '16');
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}
