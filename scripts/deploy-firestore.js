#!/usr/bin/env node

/**
 * Firestore Deployment Script
 * This script helps deploy Firestore rules and indexes to Firebase
 * 
 * Usage: node scripts/deploy-firestore.js
 * Or: npm run deploy:firestore
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔥 Firestore Deployment Script\n');

// Check if firebase-tools is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Firebase CLI is not installed!');
  console.log('\n📦 Installing firebase-tools globally...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully!\n');
  } catch (installError) {
    console.error('❌ Failed to install firebase-tools');
    console.log('\nPlease install manually: npm install -g firebase-tools');
    process.exit(1);
  }
}

// Check if user is logged in
try {
  execSync('firebase projects:list', { stdio: 'ignore' });
} catch (error) {
  console.log('🔐 You need to login to Firebase first...');
  console.log('Running: firebase login\n');
  try {
    execSync('firebase login', { stdio: 'inherit' });
  } catch (loginError) {
    console.error('❌ Login failed');
    process.exit(1);
  }
}

// Check if firestore.rules exists
const rulesPath = path.join(__dirname, '..', 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules file not found!');
  console.error(`   Looking for: ${rulesPath}`);
  process.exit(1);
}

// Check if firestore.indexes.json exists
const indexesPath = path.join(__dirname, '..', 'firestore.indexes.json');
if (!fs.existsSync(indexesPath)) {
  console.error('❌ firestore.indexes.json file not found!');
  console.error(`   Looking for: ${indexesPath}`);
  process.exit(1);
}

console.log('📋 Files found:');
console.log('  ✓ firestore.rules');
console.log('  ✓ firestore.indexes.json\n');

// Deploy rules
console.log('🚀 Deploying Firestore rules...');
try {
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('\n✅ Firestore rules deployed successfully!\n');
} catch (error) {
  console.error('\n❌ Failed to deploy Firestore rules');
  process.exit(1);
}

// Deploy indexes
console.log('🚀 Deploying Firestore indexes...');
try {
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log('\n✅ Firestore indexes deployed successfully!\n');
} catch (error) {
  console.error('\n❌ Failed to deploy Firestore indexes');
  console.log('Note: Indexes may take a few minutes to build');
  process.exit(1);
}

console.log('🎉 All Firestore configurations deployed successfully!');
console.log('\nYour database is now secured with the rules in firestore.rules');

