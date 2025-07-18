const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- 1. Initialize Firebase Admin SDK ---
// (This part remains the same)
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database service
const db = admin.firestore();
console.log('Successfully connected to Firebase.');

// --- 2. Function to Upload Document Content to Firestore ---
async function uploadDocContent(filePath) {
  const fileName = path.basename(filePath, '.md'); // Gets the filename without '.md'
  const collectionName = 'onboarding-docs';

  try {
    // Read the content of the markdown file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a document in the 'onboarding-docs' collection.
    // The document ID will be the filename (e.g., 'SETUP_GUIDE').
    // The content will be stored in a field called 'markdown'.
    const docRef = db.collection(collectionName).doc(fileName);
    await docRef.set({
      content: fileContent,
      lastUpdated: new Date()
    });

    console.log(`'${fileName}' content uploaded successfully to Firestore.`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
  }
}

// --- 3. Upload Your Document Content ---
console.log('Starting upload to Firestore...');
uploadDocContent('SETUP_GUIDE.md');
uploadDocContent('CODING_STANDARDS.md');