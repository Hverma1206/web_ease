# Web-Ease (An OpenDyslexic Font Switcher)

A Chrome extension that allows users to switch any website's font to OpenDyslexic, making text more readable for users with dyslexia.

## Features

- One-click font switching with a toggle button
- Three font style options:
  - OpenDyslexic Regular
  - OpenDyslexic Bold
  - OpenDyslexic Italic
- Persistent settings across page refreshes and browser sessions
- Works on all websites
- Clean, modern user interface

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle the switch to enable/disable the OpenDyslexic font
3. Select your preferred font style from the dropdown menu

## File Structure

```
extensions/
├── fonts/
│   ├── OpenDyslexic-Regular.otf
│   ├── OpenDyslexic-Bold.otf
│   └── OpenDyslexic-Italic.otf
├── popup.html
├── popup.css
├── popup.js
├── content.js
├── background.js
└── manifest.json
```

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Implements MutationObserver for handling dynamic content
- Uses chrome.storage.sync for persistent settings
- Material Design icons for UI elements

