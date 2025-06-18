// Vitest 설정 파일 (테스트 의존성 설치 후 활성화 예정)

// /// <reference types="vitest" />
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths';

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   test: {
//     globals: true,
//     environment: 'jsdom', 
//     setupFiles: ['./src/test/setup.ts'],
//     css: true,
//     coverage: {
//       provider: 'v8',
//       reporter: ['text', 'json', 'html'],
//       exclude: [
//         'node_modules/',
//         'src/test/',
//         '**/*.d.ts',
//         '**/*.test.{ts,tsx}',
//         '**/*.spec.{ts,tsx}',
//         'src/routeTree.gen.ts',
//       ],
//     },
//   },
// });

export {};
