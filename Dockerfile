# 의존성 설치 Stage
# package.json, lock 파일이 바뀌지 않으면 이 레이어를 재사용해 npm 설치를 건너뛴다.
FROM node:22.23.4-alpine AS deps

WORKDIR /app

# package-lock.json은 .gitignore 대상이라 없는 환경도 있으므로, 있으면 npm ci, 없으면 npm install로 설치한다.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi


# Next.js 빌드 Stage
FROM node:22.23.4-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 브라우저가 호출할 member-api 주소. NEXT_PUBLIC_ 값은 빌드 시 번들에 고정되므로 실행 시가 아닌 빌드 인자로 받는다.
# 로컬 compose는 브라우저가 호스트에서 접속하므로 http://localhost:8080을 넘긴다.
ARG NEXT_PUBLIC_MEMBER_API_BASE_URL
ENV NEXT_PUBLIC_MEMBER_API_BASE_URL=${NEXT_PUBLIC_MEMBER_API_BASE_URL}

# APP_ENV를 주지 않으므로 next.config.ts는 env/.env.* 파일을 읽지 않고 주입된 환경변수만 쓴다.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# Next.js 실행 Stage
# next.config.ts의 output: "standalone" 결과물만 복사해 node_modules 없이 실행한다.
FROM node:22.23.4-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# 컨테이너 밖(포트 매핑)에서 접근할 수 있도록 모든 인터페이스에 바인딩한다.
ENV HOSTNAME=0.0.0.0

# standalone 결과물에는 public과 정적 파일(.next/static)이 포함되지 않아 따로 복사한다.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# node 이미지에 기본으로 있는 비root 계정으로 실행한다.
USER node

# Next.js HTTP 포트
EXPOSE 3000

# 서버가 member-api를 호출할 주소(MEMBER_API_BASE_URL)는 실행 환경(compose, k8s)에서 환경변수로 주입한다.
CMD ["node", "server.js"]
