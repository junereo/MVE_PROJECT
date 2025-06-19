// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/**/*.ts'],     // ✅ 전체 파일 빌드
    outDir: 'dist',
    format: ['esm'],
    splitting: false,
    clean: true,
    target: 'es2022',
    dts: false,                 // 타입 생성하려면 true
});
