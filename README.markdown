# react-realtime-preview 📄✨

[![npm version](https://img.shields.io/npm/v/react-realtime-preview.svg?style=flat-square)](https://www.npmjs.com/package/react-realtime-preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A React component designed to render live, streaming text content (such as AI-generated responses) in a continuously updating, simulated paged view. Updated on October 22, 2025.

## The Problem

Traditional document preview components (like PDF viewers) are built for static, completed files. They struggle with dynamic content that arrives incrementally, such as text streamed from an AI model (e.g., OpenAI's API) or via WebSockets.

This component was originally crafted for an AI-powered policy generation tool, enabling users to view a live preview of a document as it is generated section by section, resembling a chatbot typing experience formatted as document pages.

## Features

- **Real-time Updates:** Seamlessly integrates incoming text chunks into the preview.
- **Simulated Pagination:** Dynamically calculates approximate page breaks based on content to emulate a document layout.
- **Simple Integration:** Easily embeddable into any React application.
- **Customizable:** Supports custom class names for styling the container and individual pages.
- **Smooth Scrolling:** Option to enable smooth scrolling animations for a better user experience.
- **Turn-Based Mode:** Allows viewing pages one at a time with navigation controls.

## Installation

```bash
npm install react-realtime-preview
# or
yarn add react-realtime-preview
```

## Usage

```tsx
import React from 'react';
import { RealtimePreview } from 'react-realtime-preview';

function App() {
  const [text, setText] = React.useState('');

  // Example: Simulate streaming text
  React.useEffect(() => {
    const sampleText = 'This is a live preview of streaming text...';
    let index = 0;
    const interval = setInterval(() => {
      setText(sampleText.substring(0, index));
      index++;
      if (index > sampleText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <RealtimePreview
      text={text}
      title="Live Document Preview"
      mode="Turn"
      containerClassName="custom-container"
      pageClassName="custom-page"
      smoothScroll={true}
      onPageChange={(page, total) => console.log(`Page ${page + 1} of ${total}`)}
    />
  );
}

export default App;
```

## Props

| Prop              | Type             | Default       | Description                                      |
|-------------------|------------------|---------------|--------------------------------------------------|
| `text`            | `string`         | `''`          | The text content to render, updated in real-time.|
| `title`           | `string`         | `'previewer'` | Optional title for the preview container.        |
| `mode`            | `'scroll' | 'Turn'` | `'scroll'`    | Viewing mode: continuous scroll or page-by-page. |
| `containerClassName` | `string`     | `''`          | CSS class for the main container.                |
| `pageClassName`   | `string`         | `''`          | CSS class for individual page content.           |
| `onPageChange`    | `(page: number, total: number) => void` | -         | Callback for page changes in 'Turn' mode.        |
| `smoothScroll`    | `boolean`        | `false`       | Enables smooth scrolling animations.             |

## Styling

The component includes default styles in `RealtimePreview.css`. Customize it by overriding these styles with your own CSS or by passing `containerClassName` and `pageClassName` props.

## Development

To contribute or run locally:

1. Clone the repository.
2. Run `npm install` or `yarn install`.
3. Start the development server with `npm run dev`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for bugs, features, or improvements.