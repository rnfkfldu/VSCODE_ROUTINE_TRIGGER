# 🤖 CLAUDE.md: THE ENGINE 프로젝트 가이드라인

이 문서는 Claude Code가 이 프로젝트에서 수행해야 할 모든 작업의 기준이다.

## 1. 프로젝트 개요
- **이름:** THE ENGINE
- **목적:** 엑셀의 정량적 통제력을 가진 모바일 루틴 관리 앱.
- **핵심 지표:** Delta($\Delta$), 주간 가용 시간, KPI.

## 2. 기술 스택 (Tech Stack)
- **Frontend:** React 19 (Vite), TypeScript
- **Styling:** Tailwind CSS (Mobile-first, Dark Mode)
- **Backend:** Firebase (Firestore, Auth)
- **Architecture:** `src/hooks/useEngine.ts`에 핵심 계산 로직 집중.

## 3. 핵심 비즈니스 로직 (Core Math)
모든 로직 구현 시 아래 공식을 엄격히 준수할 것:
- **가용 시간:** $T_{avail} = 168 - (T_{fixed} + T_{special})$
- **수행 델타:** $\Delta = T_{actual} - T_{goal}$
- **KPI:** $( \sum T_{actual} / \sum T_{goal} ) \times 100$

## 4. 코딩 및 협업 규칙
- **Naming:** 컴포넌트는 PascalCase, 함수 및 변수는 camelCase 사용.
- **Agent 소환:** 복잡한 설계는 `/agents/architect.md`를, UI는 `/agents/designer.md` 지침을 반드시 먼저 읽고 수행할 것.
- **Workflow:** 수정 전 항상 `Plan`을 제시하고 사용자의 승인(Approve)을 받은 뒤 구현한다.
- **Git:** 작업 완료 후 반드시 `auto_commit.bat`을 실행하거나 클로드 내부 명령으로 커밋을 제안할 것.

## 5. 주요 파일 구조
- `/agents`: 서브 에이전트 정의서
- `/docs`: 설계서 및 API 명세서
- `/src/hooks`: 커스텀 훅 (엔진 로직)
- `/src/components`: UI 컴포넌트 (Atomic Design)