import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts'],
    format: ['esm'],
    splitting: false,
    clean: true,
    sourcemap: true,
    external: ['dotenv'],
});
