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
        const css = `
            * { 
                font-family: '${fontFamily}' !important;
                font-size: ${fontSize}px !important;
                line-height: 1.5 !important;
            }
            h1 { font-size: ${fontSize * 2}px !important; }
            h2 { font-size: ${fontSize * 1.5}px !important; }
            h3 { font-size: ${fontSize * 1.17}px !important; }
            h4 { font-size: ${fontSize * 1.12}px !important; }
            h5 { font-size: ${fontSize * 0.83}px !important; }
            h6 { font-size: ${fontSize * 0.75}px !important; }
            small { font-size: ${fontSize * 0.83}px !important; }
        `;
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
        chrome.storage.local.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {  // Changed from sync to local
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
                chrome.storage.local.set({ fontEnabled: message.fontEnabled, selectedFont: message.selectedFont, fontSize: message.fontSize });  // Changed from sync to local
            } else if (message.selectedFont || message.fontSize) {
                applyFont(message.selectedFont, message.fontSize);
                chrome.storage.local.set({ selectedFont: message.selectedFont, fontSize: message.fontSize });  // Changed from sync to local
            }
            sendResponse({ status: "Font updated successfully" });
        } catch (error) {
            sendResponse({ status: "Error updating font" });
        }
        return true;
    });

    const observer = new MutationObserver((mutations) => {
        chrome.storage.local.get(['fontEnabled', 'selectedFont', 'fontSize'], (data) => {  // Changed from sync to local
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
