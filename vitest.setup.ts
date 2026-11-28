import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 라우터가 마운트되지 않은 테스트에서도 useRouter를 쓸 수 있게 기본 동작을 대체합니다. (개별 테스트가 다시 mock하면 그 값이 우선)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// 각 테스트가 끝나면 렌더링한 DOM을 정리합니다.
afterEach(() => {
  cleanup();
});
