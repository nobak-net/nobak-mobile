module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-react-jsx", {
        "runtime": "automatic"
      }],
      'inline-dotenv',
      // Add other plugins one by one
    ],
  };
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: [
//       ["@babel/plugin-transform-react-jsx", {
//         "runtime": "automatic"
//       }],
//       'inline-dotenv',
//       [
//         "module-resolver",
//         {
//           alias: {
//             crypto: "react-native-quick-crypto",
//             stream: "stream-browserify",
//             buffer: "@craftzdog/react-native-buffer",
//           },
//         },
//       ],
//     ],
//   };
// };


// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: [
//       ["@babel/plugin-transform-react-jsx", {
//         "runtime": "automatic"
//       }],
//       'inline-dotenv',
//       [
//         "module-resolver",
//         {
//           root: ['./src'], // Add this line to set the root to src
//           alias: {
//             crypto: "react-native-quick-crypto",
//             stream: "stream-browserify",
//             buffer: "@craftzdog/react-native-buffer",
//             "@": "./src", // Add the alias for '~'
//           },
//         },
//       ],
//     ],
//   };
// };