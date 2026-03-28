# 🗺️ 프로젝트 구조 및 진행 현황 한눈에 보기

> THE ENGINE 프로젝트의 디렉토리 구조와 현재 개발 상황을 시각화한 문서입니다.

---

## 📁 전체 프로젝트 맵

```
Routine_Trigger/
│
├── 📋 설정 파일
│   ├── package.json                 ← 프로젝트 메타데이터 + 의존성
│   ├── tsconfig.json                ← TypeScript 설정
│   ├── vite.config.ts               ← Vite 빌드 도구 설정
│   └── eslint.config.js             ← 린팅 규칙
│
├── 🚀 워크플로우 정의
│   ├── CLAUDE.md                    ← Claude 에이전트 지침 (필독!)
│   ├── AUTONOMOUS_WORKFLOW.md       ← 4 Phase 자율 워크플로우 정의
│   └── PRD.md                       ← 제품 요구사항 정의 (비즈니스 로직)
│
├── 📊 진행 추적 (docs/)             ← 🆕 새로 생성됨
│   ├── README.md                    ← docs 폴더 가이드
│   ├── DECISION_LOG.md              ← 에이전트 의사결정 기록 (실시간)
│   ├── WORKFLOW_STATUS.md           ← Phase별 진행 상황
│   ├── PROJECT_BOARD.md             ← 에피소드별 로드맵
│   ├── design_v1_sw.md              ← Episode 1 설계 (예정)
│   └── test_results/                ← 테스트 결과 저장소 (예정)
│
├── 📁 소스 코드 (src/)
│   ├── main.tsx                     ← 앱 진입점
│   ├── App.tsx                      ← 루트 컴포넌트
│   ├── index.css                    ← 글로벌 스타일
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppHeader.tsx        ← 상단 네비게이션
│   │   │
│   │   └── widgets/
│   │       └── TimeWizard/          ← Episode 1: 가용 시간 산정
│   │           ├── TimeWizard.tsx               (메인 컴포넌트) 🟡 진행중
│   │           ├── FixedBlockSlider.tsx        (고정 시간 입력)
│   │           ├── SpecialEventInput.tsx       (특이 사항 입력)
│   │           ├── TimeBar.tsx                 (시각화)
│   │           └── AvailableTimeDisplay.tsx    (결과 표시)
│   │
│   ├── hooks/
│   │   └── useEngine.ts             ← 엔진 핵심 로직 (예정)
│   │
│   ├── stores/
│   │   └── timeWizardStore.ts       ← 상태 관리 (Zustand/Context)
│   │
│   ├── types/
│   │   └── engine.ts                ← 핵심 데이터 타입 정의
│   │
│   └── utils/
│       └── timeWizard.ts            ← TimeWizard 계산 함수들
│           ├── calculateAvailableTime()      🟡 구현중
│           └── validateConstraints()
│
├── 🔧 자동화 스크립트
│   ├── auto_commit.bat              ← Git 자동 커밋 (Phase 4에서 실행)
│   ├── watch_and_commit.ps1         ← 변경사항 자동 감시
│   └── create_startup.ps1           ← 초기 설정 스크립트
│
├── 📦 빌드 산출물 (dist/)            ← npm run build 결과
│   └── (자동 생성, 필요시만 참고)
│
└── 📚 루트 레벨 문서
    ├── README.md                    ← 프로젝트 소개
    ├── STRUCTURE.md                 ← 현재 파일
    └── .gitignore                   ← Git 무시 목록
```

---

## 🎯 현재 진행 상황

### Phase 1: 설계 및 정합성 검토 (Planning)
**담당:** 리드 아키텍트 + UI/UX 디자이너  
**상태:** 🟡 **진행 중 (30%)**

```
┌──────────────────────────────────┐
│ 📋 Episode 1: Time Wizard        │
├──────────────────────────────────┤
│ ✅ 컴포넌트 구조 설계            │
│ ✅ 데이터 모델 기초 작성         │
│ 🟡 로직 검증 중                  │
│ ⏳ UI/UX 상세 설계 대기          │
│ ⏳ design_v1_sw.md 작성 예정    │
└──────────────────────────────────┘
```

**다음 단계:** 리드 아키텍트가 설계안 작성 → 사용자 승인 → Phase 2

---

### Phase 2: 구현 (Coding)
**담당:** 풀스택 개발자  
**상태:** ⏸️ **대기 중 (Phase 1 완료 대기)**

```
┌──────────────────────────────────┐
│ 🛠️ 구현 예정 작업               │
├──────────────────────────────────┤
│ ⏳ React 컴포넌트 확장           │
│ ⏳ 계산 함수 구현                │
│ ⏳ Firebase 스키마 설정          │
│ ⏳ 상태 관리 통합               │
└──────────────────────────────────┘
```

---

### Phase 3: 테스트 & QA
**담당:** QA 및 성능 테스터  
**상태:** ⏸️ **대기 중 (Phase 2 완료 대기)**

```
┌──────────────────────────────────┐
│ 🧪 테스트 예정 작업              │
├──────────────────────────────────┤
│ ⏳ 엑셀과 비교 검증             │
│ ⏳ 엣지 케이스 테스트            │
│ ⏳ 모바일 UI 반응성 확인        │
│ ⏳ 버그 수정 반복               │
└──────────────────────────────────┘
```

---

### Phase 4: 최종 보고 & 커밋
**담당:** 모든 에이전트  
**상태:** ⏸️ **대기 중 (Phase 3 완료 대기)**

```
┌──────────────────────────────────┐
│ 🏁 완료 예정 작업                │
├──────────────────────────────────┤
│ ⏳ auto_commit.bat 실행         │
│ ⏳ Git 기록 남기기               │
│ ⏳ 최종 보고서 작성             │
│ ⏳ 사용자 최종 확인             │
└──────────────────────────────────┘
```

---

## 🔍 에이전트 역할 분담

| 에이전트 | 주요 책임 | 관련 문서 | 현재 상태 |
|---------|---------|---------|---------|
| **리드 아키텍트** | 데이터 모델 설계, 로직 검증 | `docs/design_v*.md` | 🟡 활동 중 |
| **UI/UX 디자이너** | 화면 레이아웃, Tailwind 스타일 | `docs/design_v*.md` | 🟡 활동 중 |
| **풀스택 개발자** | React 구현, Firebase 통합 | `src/` | ⏸️ 대기 |
| **QA 테스터** | 테스트 케이스, 버그 검증 | `docs/test_results/` | ⏸️ 대기 |

---

## 📚 주요 문서 읽는 순서

### 🔴 **프로젝트 팀장님 (사용자)**
1. **PRD.md** - 제품이 뭔지 이해
2. **PROJECT_BOARD.md** - 구현 로드맵 확인
3. **WORKFLOW_STATUS.md** - 현재 진행 상황 확인
4. **DECISION_LOG.md** - 의사결정 과정 이해

### 🔵 **에이전트들**
1. **CLAUDE.md** - 프로젝트 기본 규칙 숙지
2. **AUTONOMOUS_WORKFLOW.md** - 4 Phase 워크플로우 이해
3. **DECISION_LOG.md** - 기존 결정사항 검토
4. **관련 설계 문서** (design_v*.md)

---

## ✨ 주요 기능 현황

| 기능 | 담당 에피소드 | 상태 | 비고 |
|-----|-----------|------|------|
| 가용 시간 계산 ($T_{avail}$) | Episode 1 | 🟡 진행중 | TimeWizard |
| 루틴 설계 및 배분 | Episode 2 | ⏸️ 대기 | Resource Lab |
| 실시간 대시보드 | Episode 3 | ⏸️ 대기 | Dashboard |
| 주간 KPI 및 회고 | Episode 4 | ⏸️ 대기 | Weekly Insight |

---

## 🚀 빠른 시작

### 개발 서버 실행
```bash
npm run dev      # Vite 개발 서버 시작 (localhost:5173)
```

### 최종 빌드
```bash
npm run build    # dist/ 폴더에 배포용 파일 생성
```

### Git 커밋 (Phase 4에서)
```bash
./auto_commit.bat  # 변경사항 자동 커밋
```

---

## 🔗 관련 링크

- [docs/README.md](docs/README.md) - 문서화 시스템 가이드
- [AUTONOMOUS_WORKFLOW.md](AUTONOMOUS_WORKFLOW.md) - 워크플로우 정의
- [CLAUDE.md](CLAUDE.md) - Claude 에이전트 지침
