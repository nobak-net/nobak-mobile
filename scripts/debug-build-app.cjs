const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Utility function to execute shell commands synchronously
function runCommand(command, options = {}) {
  try {
    console.log(`🔧 Running: ${command}`);
    execSync(command, { stdio: 'inherit', shell: true, ...options });
  } catch (error) {
    console.error(`❌ Error executing command: ${command}\n`, error.message);
    process.exit(1);
  }
}

// Define paths
const rootDir = path.resolve(__dirname, '..');
const mobileDir = rootDir; // Assuming script is in nobak-mobile/scripts/
const iosDir = path.join(mobileDir, 'ios');

// Step 1: Delete node_modules and lock files
console.log('🧹 Cleaning node_modules and lock files for nobak-mobile...');

const nodeModulesPath = path.join(mobileDir, 'node_modules');
const packageLockPath = path.join(mobileDir, 'package-lock.json');
const yarnLockPath = path.join(mobileDir, 'yarn.lock');

if (fs.existsSync(nodeModulesPath)) {
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('✅ Deleted nobak-mobile/node_modules');
}

if (fs.existsSync(packageLockPath)) {
  fs.unlinkSync(packageLockPath);
  console.log('✅ Deleted nobak-mobile/package-lock.json');
}

if (fs.existsSync(yarnLockPath)) {
  fs.unlinkSync(yarnLockPath);
  console.log('✅ Deleted nobak-mobile/yarn.lock');
}

// Step 2: Delete iOS Pods and Podfile.lock
console.log('🧹 Cleaning iOS Pods and Podfile.lock...');

const podsPath = path.join(iosDir, 'Pods');
const podfileLockPath = path.join(iosDir, 'Podfile.lock');

if (fs.existsSync(podsPath)) {
  fs.rmSync(podsPath, { recursive: true, force: true });
  console.log('✅ Deleted ios/Pods');
}

if (fs.existsSync(podfileLockPath)) {
  fs.unlinkSync(podfileLockPath);
  console.log('✅ Deleted ios/Podfile.lock');
}

// Step 3: Install dependencies
console.log('🔧 Installing dependencies for nobak-mobile...');
runCommand('yarn install', { cwd: mobileDir });

console.log('🔧 Installing react-native-quick-crypto via Expo...');
runCommand('npx expo install react-native-quick-crypto', { cwd: mobileDir });


console.log('🔧 Installing react-native-svg via Expo...');
runCommand('npx expo install react-native-svg', { cwd: mobileDir });

// console.log('🔧 Installing react-native-svg-transformer via Expo...');
// runCommand('npx expo install react-native-svg-transformer', { cwd: mobileDir });

// Step 5: Prebuild the Expo project
console.log('🚀 Running Expo prebuild...');
runCommand('npx expo prebuild --clean', { cwd: mobileDir });

// Step 6: Install iOS Pods with repo update
console.log('🔧 Installing iOS Pods...');
runCommand('pod install --repo-update', { cwd: iosDir });

// Step 7: Build the App for iOS
console.log('📦 Building the app for iOS...');
runCommand('npx expo run:ios', { cwd: mobileDir });

// Step 8: Build the App for Android
// console.log('📦 Building the app for Android...');
// runCommand('npx expo run:android', { cwd: mobileDir });

console.log('✅ Build steps completed successfully.');