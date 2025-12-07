<div>
  English | <a href="README.ru.md">Русский</a>
</div>

# No Shorts

Browser extension to block short video content (Shorts/Reels/Clips) on YouTube, TikTok, VK, and Instagram.

## Features

- **Page Blocking**: Blocks access to short video sections with a custom placeholder
- **Navigation Cleanup**: Hides navigation elements leading to short videos
- **Feed Cleanup**: Removes short video recommendations from main feeds
- **Platform Support**: YouTube, TikTok, VK, Instagram
- **Settings**: Enable/disable blocking for each platform separately

## Installation

### Manual Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome/Edge extensions page (`chrome://extensions`)
5. Enable "Developer mode"
6. Click "Load unpacked extension" and select the `dist` folder
