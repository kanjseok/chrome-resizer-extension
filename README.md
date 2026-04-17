# Chrome Resizer Extension

> A Chrome extension that instantly resizes your current Chrome window to any desired resolution.

## Why Chrome Resizer Extension?

- **Problem**: Changing browser window sizes to specific resolutions quickly and accurately during web development, testing, or general use can be tedious.
- **Solution**: Provides one-click or shortcut-driven resizing of browser windows to precise resolutions based on customizable presets.
- **Scope**: Includes managing various device resolution presets, adding custom resolutions, shortcut support, screen-center alignment, and theme settings.

## Quick Start

### Prerequisites
- Desktop operating system (Windows, macOS, Linux, ChromeOS)
- Google Chrome Browser (supporting Manifest V3) or Chromium-based desktop browser (e.g., Microsoft Edge, Brave, Whale)
  - *Note: Mobile browsers (Android, iOS) do not support extensions and are not compatible.*

### Installation
1. Go to `chrome://extensions` in your Chrome address bar.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select this folder (`Chrome Resizer Extension`).
5. Click the Resizer icon added to your browser toolbar to get started.

### Basic Usage

#### From the Popup
- Click a preset item to instantly apply that size.
- You can delete any preset using the `×` button on its right side.
- In the **Custom Size** section, input the width and height, then click **Apply** to resize immediately, or **Save to Presets** to add it to your preset list.
- When the **Center window on screen** option is enabled, the window will move to the center of your primary display upon resizing.
- Clicking **Restore Default Presets** will clear your custom items and reset your list to the default presets.

#### Using Shortcuts
- `Alt+Shift+1` → Apply Preset #1
- `Alt+Shift+2` → Apply Preset #2
- `Alt+Shift+3` → Apply Preset #3

You can customize your shortcuts at `chrome://extensions/shortcuts`.

## Documentation

### Core Features
- **Preset Resizing** — Comes with default presets (1280×720, 1440×900, 1920×1080, 375×667, 768×1024).
- **Custom Resolutions** — Input your desired width and height to apply directly or save as a new preset.
- **Settings Synchronization** — Syncs presets and options across accounts using `chrome.storage.sync`.
- **Dark Mode** — Automatically switches between light and dark popup themes based on your system settings.

### File Structure
```text
Chrome Resizer Extension/
├── manifest.json        # Extension manifest (MV3)
├── background.js        # Service worker — handles shortcuts, initializes default presets
├── popup.html           # Toolbar popup UI
├── popup.css            # Popup styling (light/dark themes)
├── popup.js             # Popup logic — presets, custom sizes, saving
├── icons/               # Extension icons (16/32/48/128)
└── scripts/make-icons.js # Icon regeneration script (no dependencies)
```

### Issue Tracker
For other inquiries, bug reports, or feature suggestions, please use [GitHub Issues](https://github.com/kanjseok/chrome-resizer-extension/issues).

## Contributing

For detailed contribution guidelines, please refer to the [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Author

**KANJSEOK**
- **Email**: [kanjseok@gmail.com](mailto:kanjseok@gmail.com)
- **Repository**: [https://github.com/kanjseok/chrome-resizer-extension.git](https://github.com/kanjseok/chrome-resizer-extension.git)
