const MarkdownIt = require('markdown-it');
const fs = require('fs');

const md = new MarkdownIt();

// --- 1. Setup Guide Content ---
const setupGuideContent = `
# Project Setup Guide

## Prerequisites
- Node.js (v18 or later)
- npm

## Installation
1. Clone the repository: \`git clone <repository-url>\`
2. Install dependencies: \`npm install\`

## Running the Project
- To start the development server, run: \`npm start\`
`;

// --- 2. Coding Standards Content ---
const codingStandardsContent = `
# Coding Standards

## JavaScript
- Use camelCase for variables and functions.
- End all statements with a semicolon.
- Use single quotes for strings.

## Markdown
- Use a single top-level heading (#).
- Use subheadings (##, ###) to structure content.
`;

// --- 3. Generate and Save Files ---
const setupGuideMarkdown = md.render(setupGuideContent);
const codingStandardsMarkdown = md.render(codingStandardsContent);

fs.writeFileSync('SETUP_GUIDE.md', setupGuideContent);
fs.writeFileSync('CODING_STANDARDS.md', codingStandardsContent);

console.log('Onboarding documents generated successfully!');