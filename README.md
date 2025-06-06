# Color Palette Generator

A web application that helps you create accessible color palettes for white-label sites. The tool ensures that your chosen colors meet WCAG 2.1 AA contrast requirements and provides real-time previews of how the colors will look in different contexts.

## Features

- Color picker for primary and CTA colors
- Real-time contrast ratio calculations
- Automatic color adjustments to meet WCAG 2.1 AA requirements
- Live preview of colors in different contexts
- One-click JSON export of the color palette
- Responsive design that works on all screen sizes
- Keyboard navigable and screen-reader friendly

## Technical Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Chroma.js for color manipulation
- Headless UI for accessible components

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dmo-color-picker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

1. Use the color pickers to select your desired primary and CTA colors
2. The tool will automatically adjust the colors to meet WCAG 2.1 AA contrast requirements
3. View the live preview to see how the colors look in different contexts
4. Click "Copy JSON" to get the color palette in JSON format

## Accessibility

The application follows WCAG 2.1 AA guidelines:
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text and UI components
- Full keyboard navigation support
- Screen reader friendly markup

## Deployment

The application can be deployed to any static hosting service like Vercel or Netlify. The build output is optimized and gzipped to ensure fast loading times.

## License

MIT
