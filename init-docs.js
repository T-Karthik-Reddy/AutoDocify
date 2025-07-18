const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// =================================================================
// 1. FIREBASE & DOCS CONFIGURATION
// =================================================================

// Initialize Firebase Admin SDK
// NOTE: For a real project, use environment variables, not a committed key.
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
console.log('Successfully connected to Firebase.');

// --- Define the content for our documentation files ---
const documents = [
  {
    filename: 'SETUP_GUIDE.md',
    content: `
# Project Setup Guide

## Prerequisites

- Node.js (v18 or later)
- npm

## Installation

1. Clone the repository: \`git clone <repository-url>\`
2. Install dependencies: \`npm install\`

## Running the Project

- To start the development server, run: \`npm start\`
`
  },
  {
    filename: 'CODING_STANDARDS.md',
    content: `
# Coding Standards

## JavaScript

- Use camelCase for variables and functions.
- End all statements with a semicolon.
- Use single quotes for strings.

## Markdown

- Use a single top-level heading (#).
- Use subheadings (##, ###) to structure content.
`
  }
];

// =================================================================
// 2. CORE LOGIC
// =================================================================

/**
 * Generates local .md files from the documents configuration.
 */
function generateLocalDocs() {
  console.log('Generating local markdown files...');
  try {
    documents.forEach(doc => {
      // We trim the content to remove any leading/trailing whitespace.
      fs.writeFileSync(doc.filename, doc.content.trim() + '\n');
      console.log(`- Created ${doc.filename}`);
    });
    console.log('Local documents generated successfully!');
    return true;
  } catch (error) {
    console.error('Error generating local files:', error);
    return false;
  }
}

/**
 * Uploads the content of a single file to Firestore.
 * @param {string} filePath - The path to the file to upload.
 */
async function uploadDocToFirestore(filePath) {
  const fileName = path.basename(filePath, '.md');
  const collectionName = 'onboarding-docs';

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const docRef = db.collection(collectionName).doc(fileName);
    
    await docRef.set({
      content: fileContent,
      lastUpdated: new Date()
    });

    console.log(`- Uploaded '${fileName}' to Firestore.`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
  }
}

// =================================================================
// 3. MAIN EXECUTION
// =================================================================

/**
 * Main function to run the entire process.
 */
async function initializeProjectDocs() {
  console.log('--- Starting Developer Docs Initialization ---');

  // Step 1: Generate the local .md files
  const success = generateLocalDocs();

  // Step 2: If generation was successful, upload to Firebase
  if (success) {
    console.log('\nUploading documents to Firestore...');
    const uploadPromises = documents.map(doc => uploadDocToFirestore(doc.filename));
    await Promise.all(uploadPromises);
    console.log('All documents processed.');
  }
  
  console.log('\n--- Initialization Complete! ---');
}

// Run the main function
initializeProjectDocs();