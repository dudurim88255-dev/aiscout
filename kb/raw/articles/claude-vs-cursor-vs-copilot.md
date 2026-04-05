# Claude Code vs Cursor vs Copilot 비교 (2026년 4월)

> 출처: AI 도구 리서치 메모
> 날짜: 2026-04-05

## 개요

2026년 기준 주요 AI 코딩 도구 3종을 비교한다.

## Claude Code

- **개발사**: Anthropic
- **모델**: Claude Opus 4.6, Sonnet 4.6
- **방식**: CLI 기반 에이전틱 코딩
- **강점**: 긴 컨텍스트(200K), CLAUDE.md 기반 프로젝트 규칙, 서브에이전트, MCP 통합
- **약점**: CLI 전용 (GUI 없음), 비용 높음
- **가격**: Pro $20/월 (제한적), API 종량제

## Cursor

- **개발사**: Anysphere
- **방식**: VS Code 포크, IDE 통합
- **강점**: IDE 내장, 탭 자동완성, 멀티모델 지원
- **약점**: 대규모 리팩토링에 약함
- **가격**: Pro $20/월

## GitHub Copilot

- **개발사**: GitHub/Microsoft
- **방식**: IDE 확장, 최근 에이전트 모드 추가
- **강점**: GitHub 생태계 통합, 가장 넓은 IDE 지원
- **약점**: 복잡한 멀티파일 작업에 약함
- **가격**: Individual $10/월

## 비교 표

| 항목 | Claude Code | Cursor | Copilot |
|------|------------|--------|---------|
| 인터페이스 | CLI | IDE | IDE 확장 |
| 컨텍스트 | 200K | ~128K | ~128K |
| 에이전틱 | ✅ 네이티브 | ✅ 에이전트 모드 | ✅ 에이전트 모드 |
| MCP | ✅ | ✅ | ❌ |
| 프로젝트 규칙 | CLAUDE.md | .cursorrules | .github/copilot |
| 서브에이전트 | ✅ | ❌ | ❌ |

## 결론

대규모 리팩토링, 자동화 파이프라인 → Claude Code
일상 코딩, 빠른 편집 → Cursor
기존 GitHub 워크플로우 통합 → Copilot
