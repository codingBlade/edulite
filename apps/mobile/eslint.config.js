// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// const tsPlugin = require("@typescript-eslint/eslint-plugin")
// const importPlugin = require("eslint-plugin-import")

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    // plugins: {'@typescript-eslint': tsPlugin, 'import': importPlugin},
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
]);
