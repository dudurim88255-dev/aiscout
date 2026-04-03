# CLAUDE.md (과학블로그 프로젝트 — 프로젝트 루트에 배치)

## 프로젝트 정보

- 이름: 과학블로그 (한국어 생명과학 논문 해설)
- 스택: Next.js 15 (App Router) + Vercel
- API: Anthropic API (난이도 토글), CrossRef API (DOI 자동 정보)
- AdSense: ca-pub-3012911913573742
- 배포: `npx vercel --prod` (수동)

## 프로젝트 구조 규칙

- app/ 디렉토리 구조 (App Router)
- 글 데이터: content/ 또는 MDX 파일
- API 라우트: app/api/
- 컴포넌트: components/ (서버/클라이언트 명확히 분리)
- 스타일: Tailwind CSS

## 핵심 기능

- 난이도 토글: 전문가 버전 ↔ 쉬운 버전 (Anthropic API)
- DOI 입력 → CrossRef에서 논문 메타데이터 자동 추출
- AdSense 광고 배치
- SEO 최적화 (메타태그, OG 이미지)

## 주의사항

- Anthropic API 키는 서버 사이드에서만 사용 (클라이언트 노출 금지)
- `'use client'` 디렉티브는 꼭 필요한 컴포넌트에만
- 빌드 에러 시 `npx vercel --prod` 전에 `npm run build`로 로컬 확인
- 이미지 최적화: next/image 사용 필수
- AdSense 스크립트는 layout.tsx에 한 번만 로드

## 금지 패턴

- pages/ 디렉토리 사용 금지 (App Router만)
- API 키를 클라이언트 컴포넌트에 넣지 않을 것
- `getServerSideProps` / `getStaticProps` 금지 (App Router 방식 사용)
- fetch에 캐시 설정 없이 사용 금지 (revalidate 명시)
