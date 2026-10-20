import type { NextConfig } from "next";

/** 지원하는 실행 환경 */
const APP_ENVS = ["local", "dev", "prod"];

/**
 * APP_ENV에 맞는 env/.env.{APP_ENV} 파일을 process.env에 로드합니다.
 * 이미 주입된 환경변수는 덮어쓰지 않으므로 배포 환경에서 직접 주입한 값이 우선합니다.
 */
function loadAppEnv() {
  const appEnv = process.env.APP_ENV;

  // APP_ENV가 없으면 파일을 읽지 않고 주입된 환경변수만 사용한다.
  if (!appEnv) {
    return;
  }

  if (!APP_ENVS.includes(appEnv)) {
    throw new Error(`APP_ENV는 ${APP_ENVS.join(", ")} 중 하나여야 합니다. (현재: ${appEnv})`);
  }

  process.loadEnvFile(`env/.env.${appEnv}`);
}

loadAppEnv();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
