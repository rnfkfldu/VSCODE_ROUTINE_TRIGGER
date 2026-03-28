# 🚀 THE ENGINE: 데이터 기반 루틴 관리 앱

> **의지력에 의존하지 않는, 데이터 기반의 인생 최적화 엔진**

엑셀의 정량적 통제력과 모바일의 즉각적 접근성을 결합하여, 사용자의 가용 시간을 가장 가치 있는 곳에 배분하고 실행을 자동 유도합니다.

---

## 📌 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | THE ENGINE |
| **목표** | 주간 시간 예산 기반 루틴 관리 |
| **기술 스택** | React 19 + TypeScript + Vite + Tailwind CSS + Firebase |
| **모바일 플랫폼** | iOS / Android (Capacitor) |

---

## 🎯 핵심 기능

### 1. 🕐 **Time Wizard** (가용 시간 산정)
```
T_available = 168시간 - (고정시간 + 특이사항)
```
- 고정 시간: 수면, 식사, 업무, 출퇴근 등
- 특이 사항: 회식, 경조사, 병원 등
- 결과: 실제 남는 시간 자동 계산 및 시각화

### 2. 📋 **Resource Lab** (루틴 설계 및 배분)
- 가용 시간을 루틴별 비중(%) 할당
- 트리거(Trigger) 설정: [언제, 어디서, 무엇 직후에]
- 자동 시간 목표 할당

### 3. 📊 **Dashboard** (실시간 엔진 상황판)
- Daily KPI: Plan vs Actual
- Delta ($\Delta$) 추적: 목표 대비 성과 측정
- 3초 컷 기록 환경

### 4. 📈 **Weekly Insight** (회고 및 분석)
- 주간 KPI: $KPI = \frac{\sum T_{actual}}{\sum T_{goal}} \times 100$
- AI 회고: 패턴 분석 및 다음 주 제안

---

## 📁 디렉토리 구조

```
Routine_Trigger/
├── 📋 핵심 문서
│   ├── CLAUDE.md                ← Claude 에이전트 가이드
│   ├── AUTONOMOUS_WORKFLOW.md   ← 4 Phase 자율 워크플로우
│   ├── PRD.md                   ← 제품 요구사항
│   └── STRUCTURE.md             ← 프로젝트 구조 시각화
│
├── 📊 진행 추적 (docs/)
│   ├── README.md                ← docs 폴더 가이드
│   ├── DECISION_LOG.md          ← 의사결정 기록
│   ├── WORKFLOW_STATUS.md       ← Phase별 진행 상황
│   ├── PROJECT_BOARD.md         ← 에피소드별 로드맵
│   └── test_results/            ← 테스트 결과
│
├── 🤖 에이전트 지침 (.claude/)
│   ├── architect.md             ← 리드 아키텍트 가이드
│   ├── designer.md              ← UI/UX 디자이너 가이드
│   ├── developer.md             ← 풀스택 개발자 가이드
│   └── qa.md                    ← QA 테스터 가이드
│
├── 💻 소스 코드 (src/)
│   ├── App.tsx                  ← 루트 컴포넌트
│   ├── components/
│   │   └── widgets/
│   │       └── TimeWizard/      ← Episode 1: 가용 시간
│   ├── stores/                  ← 상태 관리
│   ├── types/engine.ts          ← 핵심 데이터 타입
│   └── utils/engine/            ← 엔진 계산 로직
│
└── 🔧 자동화 스크립트
    ├── auto_commit.bat          ← Git 자동 커밋
    └── watch_and_commit.ps1     ← 감시 및 커밋
```

상세 구조는 [STRUCTURE.md](STRUCTURE.md)를 참고하세요.

---

## 🎬 에피소드 로드맵

| 에피소드 | 기능 | 상태 | 예정일 |
|---------|------|------|--------|
| Episode 1 | 🕐 Time Wizard | 🟡 진행 중 | 2026-03-31 |
| Episode 2 | 📋 Resource Lab | ⏸️ 예정 | 2026-04-07 |
| Episode 3 | 📊 Dashboard | ⏸️ 예정 | 2026-04-14 |
| Episode 4 | 📈 Weekly Insight | ⏸️ 예정 | 2026-04-21 |

자세한 로드맵은 [docs/PROJECT_BOARD.md](docs/PROJECT_BOARD.md)를 참고하세요.

---

## 🚀 빠른 시작

### 설치
```bash
npm install
```

### 개발 서버 시작
```bash
npm run dev          # localhost:5173에서 실행
```

### 빌드
```bash
npm run build        # dist/ 폴더에 배포용 파일 생성
npm run preview      # 프로덕션 빌드 미리보기
```

### 린팅
```bash
npm run lint         # ESLint 실행
```

---

## 🤖 에이전트 협업 체계

이 프로젝트는 4명의 전문 에이전트가 다음의 워크플로우에 따라 협업합니다:

### Phase 1: Planning (설계)
👥 **리드 아키텍트** + **UI/UX 디자이너**
- 데이터 모델 설계
- UI/UX 레이아웃 설계
- 산출물: `docs/design_v*.md`

### Phase 2: Coding (구현)
👥 **풀스택 개발자**
- React 컴포넌트 구현
- 로직 함수 개발
- 상태 관리 통합

### Phase 3: Testing (QA)
👥 **QA 테스터** + **풀스택 개발자**
- 수식 검증 (엑셀 비교)
- 엣지 케이스 테스트
- 버그 수정 반복

### Phase 4: Review (최종)
👥 **모든 에이전트**
- Git 커밋
- 최종 보고

자세한 내용은:
- [AUTONOMOUS_WORKFLOW.md](AUTONOMOUS_WORKFLOW.md) - 워크플로우 정의
- [.claude/architect.md](.claude/architect.md) - 리드 아키텍트 지침
- [.claude/designer.md](.claude/designer.md) - UI/UX 디자이너 지침
- [.claude/developer.md](.claude/developer.md) - 풀스택 개발자 지침
- [.claude/qa.md](.claude/qa.md) - QA 테스터 지침

---

## 📚 주요 문서 읽는 순서

### 팀장님 (사용자)
1. **[PRD.md](PRD.md)** - 제품이 뭔지 이해
2. **[docs/PROJECT_BOARD.md](docs/PROJECT_BOARD.md)** - 로드맵 확인
3. **[docs/WORKFLOW_STATUS.md](docs/WORKFLOW_STATUS.md)** - 현재 진행 상황
4. **[docs/DECISION_LOG.md](docs/DECISION_LOG.md)** - 의사결정 과정

### 에이전트들
1. **[CLAUDE.md](CLAUDE.md)** - 프로젝트 기본 규칙
2. **[AUTONOMOUS_WORKFLOW.md](AUTONOMOUS_WORKFLOW.md)** - 워크플로우
3. **[.claude/[역할].md](.claude/)** - 각 에이전트 지침
4. **[docs/design_v*.md](docs/)** - 설계 문서

---

## 📊 진행 현황

```
🟡 Episode 1: Time Wizard
├─ Phase 1 (Planning):  🟡 30% 진행 중
├─ Phase 2 (Coding):    ⏸️ 대기
├─ Phase 3 (Testing):   ⏸️ 대기
└─ Phase 4 (Review):    ⏸️ 대기

전체 진행률: 🟡 8%
```

실시간 진행 상황은 [docs/WORKFLOW_STATUS.md](docs/WORKFLOW_STATUS.md)에서 확인하세요.

---

## 🔗 관련 링크

- 📋 [STRUCTURE.md](STRUCTURE.md) - 프로젝트 구조 한눈에 보기
- 📊 [docs/](docs/) - 진행 추적 및 문서화
- 🤖 [.claude/](claude/) - 에이전트 지침
- 📌 [PRD.md](PRD.md) - 제품 요구사항 정의
- ⚙️ [AUTONOMOUS_WORKFLOW.md](AUTONOMOUS_WORKFLOW.md) - 워크플로우 정의

---

## 💡 기술 스택

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Dark Mode)
- **State:** Zustand / Context API
- **Backend:** Firebase (Firestore, Auth)
- **Mobile:** Capacitor (React Native)
- **Testing:** Jest, Vitest
- **Linting:** ESLint

---

## 📞 문의

프로젝트 관련 문의는 각 단계의 담당 에이전트를 참고하세요:
- 🏗️ 설계 관련: [.claude/architect.md](.claude/architect.md)
- 🎨 UI/UX 관련: [.claude/designer.md](.claude/designer.md)
- 💻 개발 관련: [.claude/developer.md](.claude/developer.md)
- 🧪 테스트 관련: [.claude/qa.md](.claude/qa.md)
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
