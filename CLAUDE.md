# CLAUDE.md (aiscout 프로젝트)

## 프로젝트 정보
- 이름: AI Scout (aiscout)
- 스택: Next.js 16 App Router + TypeScript + Tailwind CSS v4 + MDX
- 배포: Vercel (git push 시 자동 배포)
- 자동화: GitHub Actions Cron (매일 09:00 KST)

## 디렉토리 구조
- `app/` — Next.js App Router 페이지
- `components/` — React 컴포넌트 (ComparisonTable, PricingCard, ToolRating, FaqSection 포함)
- `content/posts/` — 자동 생성 MDX 포스트
- `lib/` — posts.ts (MDX 파싱), affiliate.ts (제휴 링크)
- `scripts/` — 자동화 스크립트 (collect-and-generate.ts가 메인)
- `tests/` — Vitest 테스트

## 주요 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 빌드
- `npm test` — 테스트 실행
- `npm run generate` — 포스트 수동 생성 (ANTHROPIC_API_KEY 필요)

## 코딩 규칙
- App Router 사용 (pages/ 금지)
- Server Component 기본, Client Component 최소화
- API 키는 서버 사이드에서만 사용
- PostType: NEW_TOOL_REVIEW | VS_COMPARISON | PRICING_GUIDE | UPDATE_SUMMARY | HOW_TO_GUIDE
