import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    include: ['**/tests/*.spec.*'],
    globals: true,
    setupFiles: './tests/setup.ts',
    environment: 'jsdom',
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/docs/**',
        '**/__mocks__/**',
        '**/coverage/**',
        '**/.dumi/**',
        '**/.vercel/**',
        '**/es/**',
        '**/lib/**',
        '**/*.config.*',
        '**/.dumirc.ts',
        '**/.fatherrc.ts',
        '**/*.d.ts',
      ],
    },
  },
});
