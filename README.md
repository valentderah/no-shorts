# No Shorts

Browser extension (Manifest V3) to block short video content (Shorts/Reels/Clips) on YouTube, TikTok, VK, and Instagram. Designed to improve digital productivity.

## Features

- **Page Blocking**: Blocks access to short video sections with a custom blocker page
- **Navigation Cleanup**: Hides navigation elements that lead to short videos
- **Feed Sanitization**: Removes short video recommendations from main feeds
- **Platform Support**: YouTube, TikTok, VK, Instagram
- **Customizable**: Enable/disable blocking for each platform individually

## Installation

### Manual Installation

1. Clone this repository
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
6. Click "Load unpacked" and select the `dist` folder

### Development

```bash
# Development mode with watch
npm run dev

# Production build
npm run build

# Clean build directory
npm run clean
```

## Supported Platforms

- **YouTube**: Blocks `/shorts/*` pages, hides Shorts navigation and feed sections
- **TikTok**: Blocks entire domain
- **VK**: Blocks `/clips` pages, hides Clips navigation and feed sections
- **Instagram**: Blocks `/reels/*` pages, hides Reels navigation and feed sections

## Architecture

- **TypeScript** + **Webpack** for building
- **Manifest V3** for Chrome/Edge compatibility
- **Content Scripts** for each platform
- **Background Service Worker** for settings management
- **Popup** for quick access
- **Options Page** for detailed settings

## Project Structure

```
no-shorts/
├── public/              # Static files (HTML, icons)
├── src/
│   ├── background/      # Service worker
│   ├── content/         # Content scripts per platform
│   ├── popup/           # Popup logic
│   ├── options/         # Options page logic
│   ├── storage/         # Settings management
│   └── types/           # TypeScript types
├── manifest.json        # Extension manifest
└── webpack.config.js    # Build configuration
```

## License

MIT

