# 📚 docs 폴더 가이드

> THE ENGINE 프로젝트의 중앙 문서화 허브입니다. 모든 기술적 결정, 설계, 진행 상황이 여기에 기록됩니다.

---

## 📂 폴더 구조

```
docs/
├── README.md                    ← 현재 파일 (가이드)
├── DECISION_LOG.md              ← 🔴 에이전트 의사결정 기록 (실시간 업데이트)
├── WORKFLOW_STATUS.md           ← 🟡 Phase별 진행 상황 추적
├── PROJECT_BOARD.md             ← 🟢 에피소드별 로드맵
├── design_v1_sw.md              ← Episode 1 설계 산출물 (예정)
├── design_v2_rl.md              ← Episode 2 설계 산출물 (예정)
└── test_results/                ← Phase 3 테스트 결과 저장 (예정)
    ├── Episode_1_TimeWizard.md
    └── Episode_2_ResourceLab.md
```

---

## 🎯 각 문서의 역할

### 1. **DECISION_LOG.md** 📋
**목적:** 모든 에이전트의 기술적 선택과 결정 과정 기록

**사용 시기:**
- 두 가지 구현 방식 중 하나를 선택했을 때
- 버그를 발견하고 해결 방법을 결정했을 때
- 아키텍처 관련 중요 결정을 내렸을 때

**기록 양식:**
```markdown
### [작업 ID] 제목
- **날짜:** YYYY-MM-DD HH:MM
- **담당 에이전트:** 에이전트 이름
- **분류:** Design / Implementation / Bug Fix / Test / Architecture
- **내용:** 어떤 결정을 내렸고 왜 그렇게 했는지
- **영향 범위:** 어떤 파일/기능이 영향받는지
- **상태:** ⏳ In Progress / ✅ Completed / 🔄 Review Pending
```

---

### 2. **WORKFLOW_STATUS.md** 🔄
**목적:** 4 Phase 워크플로우의 현재 진행 상황 시각화

**구성:**
- 각 Phase별 진행률 (%)
- 담당 에이전트
- 완료 체크리스트
- 게이트킬 조건
- 현재 일시 중단된 작업

**팀장님이 주기적으로 확인할 문서입니다.**

---

### 3. **PROJECT_BOARD.md** 📊
**목적:** 전체 프로젝트의 에피소드별 로드맵

**구성:**
- Episode별 요구사항
- 각 Phase의 세부 체크리스트
- 예상 담당 에이전트
- 전체 진행률 시각화

**에피소드 구조:**
```
Episode 1: Time Wizard (가용 시간 산정)
Episode 2: Resource Lab (루틴 설계 및 배분)
Episode 3: Dashboard (실시간 엔진 상황판)
Episode 4: Weekly Insight (회고 및 KPI)
```

---

### 4. **design_v{N}_{abbr}.md** 🎨
**목적:** 각 에피소드의 Phase 1 설계 산출물

**생성 시점:** 각 에피소드 Phase 1 완료 후
**담당:** 리드 아키텍트 + UI/UX 디자이너
**내용:**
- 데이터 모델 (TypeScript 인터페이스)
- 계산 로직 (수학 공식)
- UI/UX 설계 (Wireframe, Tailwind CSS 클래스)
- 트리거 및 제약사항

**파일명 규칙:**
- `design_v1_sw.md` → Episode 1 Time Wizard (SW = Short Wizard)
- `design_v2_rl.md` → Episode 2 Resource Lab (RL)
- `design_v3_db.md` → Episode 3 Dashboard (DB)
- `design_v4_wi.md` → Episode 4 Weekly Insight (WI)

---

## 🔄 워크플로우와 문서의 관계

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Planning                                           │
│ 리드 아키텍트 + UI/UX 디자이너                                 │
│ ↓ 산출물: design_v{N}_{abbr}.md                             │
│ ↓ 기록: DECISION_LOG.md에 의사결정 사항 기록                   │
│ ↓ 상태: WORKFLOW_STATUS.md 업데이트                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Coding                                             │
│ 풀스택 개발자                                                 │
│ ↓ 산출물: React 컴포넌트, 유틸 함수                             │
│ ↓ 기록: DECISION_LOG.md에 기술적 결정 기록                     │
│ ↓ 상태: WORKFLOW_STATUS.md 업데이트                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Testing & QA                                       │
│ QA 및 성능 테스터 + 풀스택 개발자                               │
│ ↓ 산출물: test_results/Episode_{N}_{name}.md                │
│ ↓ 기록: DECISION_LOG.md에 버그 해결 과정 기록                   │
│ ↓ 상태: WORKFLOW_STATUS.md 업데이트                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Review & Commit                                    │
│ 모든 에이전트                                                  │
│ ↓ 산출물: auto_commit.bat 실행, Git 기록                      │
│ ↓ 기록: DECISION_LOG.md에 완료 기록                          │
│ ↓ 상태: WORKFLOW_STATUS.md 업데이트, 사용자 승인 대기          │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 사용 팁

### 🔍 **팀장님 (사용자)이 빠르게 확인하는 법**
1. **PROJECT_BOARD.md** → 전체 로드맵 및 진행률 확인
2. **WORKFLOW_STATUS.md** → 현재 어느 Phase에 있는지 확인
3. **DECISION_LOG.md** → 의사결정 과정 세부 확인

### 🤖 **에이전트가 기록하는 법**
모든 중요한 기술적 선택은 **DECISION_LOG.md**에 다음과 같이 기록:
```markdown
### [XXX] 짧은 제목
- **날짜:** 2026-03-29 16:00
- **담당 에이전트:** ○○
- **분류:** Design / Implementation / Bug Fix ...
- **내용:** 왜 이 방식을 선택했는가?
- **영향 범위:** 어떤 파일이 바뀌는가?
- **상태:** ⏳ / ✅ / 🔄
```

---

## 📞 문의 사항

더 많은 정보는 다음을 참고하세요:
- [AUTONOMOUS_WORKFLOW.md](../AUTONOMOUS_WORKFLOW.md) - 워크플로우 정의
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 기본 지침
- [PRD.md](../PRD.md) - 제품 요구사항 정의
