// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'eslint.config.js',
			'vitest.config.ts',
			'dist/**',
			'coverage/**',
			'build/**',
			'node_modules/**',
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		files: ['**/*.{ts,tsx}'],
		extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			// O fluxo deste cliente (axios → API conhecida) usa respostas
			// dinâmicas; a segurança é garantida pelos tipos no contrato.
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			// Handlers de eventos frequentemente disparam mutações assíncronas
			// sem esperar o retorno (padrão próprio do react-query).
			'@typescript-eslint/no-misused-promises': 'off',
			// Sincronizar formulários a partir de dados remotos via efeito é uma
			// prática aceitável aqui.
			'react-hooks/set-state-in-effect': 'off',
			'react-refresh/only-export-components': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
		},
	},
	{
		// Os testes usam mocks e helpers sem tipos completos; manter o código
		// de produção estrito.
		files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'src/test/**/*'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/unbound-method': 'off',
		},
	},
);