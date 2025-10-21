# react-realtime-preview 📄✨

[![npm version](https://img.shields.io/npm/v/react-realtime-preview.svg?style=flat-square)](https://www.npmjs.com/package/react-realtime-preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A React component designed to render live, streaming text content (like AI-generated responses) in a continuously updating, simulated paged view.

## The Problem

Traditional document preview components (like PDF viewers) are designed for static, finished files. They don't handle dynamic content that arrives in chunks over time, such as text streamed from an AI model (like OpenAI's API) or via WebSockets.

This component was originally developed for an AI-powered policy generation tool where users needed a live preview of the document as it was being created chapter by chapter, similar to watching a chatbot type, but formatted like document pages.

## Features

* **Real-time Updates:** Seamlessly appends incoming text chunks to the preview.
* **Simulated Pagination:** Automatically calculates approximate page breaks based on character count to mimic a document layout.
* **Simple Integration:** Easy to drop into any React application.
* **Customizable:** Accepts class names for custom styling of the container and individual pages.

## Installation

```bash
npm install react-realtime-preview
# or
yarn add react-realtime-preview