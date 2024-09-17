const path = require('path');
const { execSync } = require('child_process');

function runCommand(command, options = {}) {
  try {
    console.log(`🔧 Running: ${command}`);
    execSync(command, { stdio: 'inherit', shell: true, ...options });
  } catch (error) {
    console.error(`❌ Error executing command: ${command}\n`, error.message);
    process.exit(1);
  }
}

const mobileDir = path.resolve(__dirname, '..');

// Step 1: Trigger EAS Build for iOS
console.log('📦 Triggering EAS Build for iOS...');
runCommand('eas build --platform ios', { cwd: mobileDir });

// Step 2: Trigger EAS Build for Android
// console.log('📦 Triggering EAS Build for Android...');
// runCommand('eas build --platform android', { cwd: mobileDir });

console.log('✅ EAS Build steps completed successfully.');