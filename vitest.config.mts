import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Vitest 설정입니다.
 * - jsdom 환경에서 React 컴포넌트를 렌더링합니다.
 * - tsconfig의 `@/*` 경로 별칭을 Vite 내장 옵션(`resolve.tsconfigPaths`)으로 그대로 사용합니다.
 * - 테스트 파일은 `tests/unit/` 아래에 `src/`와 같은 경로로 `*.test.ts(x)`로 둡니다.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
