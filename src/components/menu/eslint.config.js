import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json', 
      },
      globals: globals.browser,
    },
    
    extends: [
      js.configs.recommended,
      typescriptEslint.configs.eslintRecommended, 
      typescriptEslint.configs.recommended,     
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    
    rules: {
      'no-unused-vars': 'off', 
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      
      '@typescript-eslint/explicit-module-boundary-types': 'off', 
    },
  },
])
