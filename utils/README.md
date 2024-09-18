
# Development

```
npx expo install react-native-svg
rm -rf Pod Podfile.lock
eas build:configure
npx expo prebuild
pod install --repo-update
npm  eas:build.dev.sim

```