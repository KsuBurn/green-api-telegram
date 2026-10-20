import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
    globalIgnores(['dist', 'coverage']),

    {
        files: ['**/*.{ts,tsx}'],

        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],

        languageOptions: {
            globals: globals.browser,
        },

        rules: {
            // Правила для JavaScript
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'prefer-const': 'error',
            'no-var': 'error',

            // Правила для TypeScript
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            // Правила для React
            'react-hooks/exhaustive-deps': 'warn',
        },
    },

    prettier,
]);
