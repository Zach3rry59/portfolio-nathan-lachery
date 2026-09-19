import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
export default [
  { ignores: ['**/node_modules/**','**/dist/**','.pnpm-store/**','archive/**','src/**','tests/**'] },
  js.configs.recommended,
  { files: ['**/*.{js,mjs,jsx}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node, ...globals.browser }, parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } },
  { files: ['frontend/**/*.jsx'], plugins: { react }, rules: { 'react/jsx-uses-vars': 'error', 'react/jsx-uses-react': 'error', 'react/jsx-no-target-blank': 'error', 'react/jsx-no-duplicate-props': 'error', 'react/jsx-key': 'error' } },
];
