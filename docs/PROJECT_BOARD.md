# 🚀 프로젝트 진행판 (PROJECT_BOARD)

> THE ENGINE 구현 로드맵. 각 에피소드별로 구현할 기능, 담당 에이전트, 검증 기준을 정의합니다.

---

## 📌 에피소드 구조

각 에피소드는 다음의 4 Phase를 거칩니다:
1. **Planning** → 2. **Coding** → 3. **Testing** → 4. **Review**

---

## 🎬 Episode 1: Time Wizard (가용 시간 산정 엔진)

### 📋 요구사항 (PRD 참고)
- **핵심 로직:** $T_{available} = 168 - (T_{fixed} + T_{special})$
- **UI 기능:** 고정 시간 입력 → 특이 사항 입력 → 가용 시간 시각화 (Bar)

### 🏗️ Phase 1: Planning
**Gatekeeper:** 리드 아키텍트 + UI/UX 디자이너

- [ ] **로직 분석**
  - [ ] 고정 시간(T_fixed) 데이터 모델 정의 (타입: ?수면시간, 식사시간, 업무시간 등)
  - [ ] 특이 사항(T_special) 데이터 모델 정의
  - [ ] 168시간 제약 검증 로직 (음수 체크, 초과 경고 등)

- [ ] **UI/UX 설계**
  - [ ] 정보 입력 흐름 (Wireframe)
  - [ ] 시각화 방식 결정 (Bar chart, Progress, 그래프 등)
  - [ ] 모바일 반응형 레이아웃 (Tailwind CSS 기반)
  - [ ] Dark mode 지원 여부

- [ ] **산출물:** `design_v1_sw.md` 생성
- [ ] **검증:** 사용자 승인 (Approve)

**현재 상태:** 🟡 In Progress

---

### 🛠️ Phase 2: Coding
**담당:** 풀스택 개발자

- [ ] **React 컴포넌트 생성**
  - [ ] `TimeWizard.tsx` (메인 컴포넌트)
  - [ ] `FixedBlockSlider.tsx` (고정 시간 입력 - 기존 컴포넌트)
  - [ ] `SpecialEventInput.tsx` (특이 사항 입력 - 기존 컴포넌트)
  - [ ] `TimeBar.tsx` (시각화 - 기존 컴포넌트)

- [ ] **데이터 모델 (types/engine.ts)**
  - [ ] `TimeWizardData` 인터페이스 정의
  - [ ] Firebase Firestore 스키마 맵핑

- [ ] **계산 로직 (src/utils/engine/timeWizard.ts)**
  - [ ] `calculateAvailableTime()` 순수 함수
  - [ ] `validateTimeConstraints()` 검증 함수

- [ ] **상태 관리 (stores/timeWizardStore.ts)**
  - [ ] 기존 store 확인 및 개선
  - [ ] Zustand/Pinia 또는 Context API 활용

- [ ] **산출물:** 수정 파일 목록과 함께 "Implementation Complete" 보고

**현재 상태:** ⏸️ Not Started

---

### 🧪 Phase 3: Testing & QA
**담당:** QA 및 성능 테스터 + 풀스택 개발자

- [ ] **테스트 케이스 설계**
  - [ ] 정상 케이스 (T_fixed + T_special < 168)
  - [ ] 경계 케이스 (T_fixed + T_special = 168)
  - [ ] 오류 케이스 (T_fixed + T_special > 168)
  - [ ] 빈 입력값 처리

- [ ] **엑셀 비교 검증**
  - [ ] 기존 엑셀 Time Wizard 모듈과 동일 결과 확인
  - [ ] 편차 ≤ 0.1시간 (6분) 허용

- [ ] **UI 테스트**
  - [ ] 모바일 반응성 확인 (iOS, Android 시뮬레이터)
  - [ ] 다크모드 테스트
  - [ ] 입력값 실시간 업데이트 확인

- [ ] **버그 수정 반복**
  - [ ] QA 발견 버그 → Developer 수정 → 재테스트 (무한 루프)
  - [ ] 수정 내용은 DECISION_LOG.md에 기록

- [ ] **PASS 선언**
  - [ ] 모든 테스트 통과
  - [ ] 성능 기준 충족 (로드 시간 < 1초)

**현재 상태:** ⏸️ Not Started

---

### 🏁 Phase 4: Review & Commit
**담당:** 모든 에이전트

- [ ] **최종 보고서 작성**
  - [ ] 구현 개요
  - [ ] 테스트 결과 요약
  - [ ] 알려진 제약사항 (있을 경우)

- [ ] **Git 커밋**
  ```batch
  auto_commit.bat  # 또는 내부 명령으로 커밋 제안
  ```

- [ ] **사용자 최종 확인**
  - [ ] 브라우저에서 실행 확인
  - [ ] "Done" 선언

**현재 상태:** ⏸️ Not Started

---

## 🎬 Episode 2: Resource Lab (루틴 설계 및 배분)
*향후 계획 - Phase 1 완료 후 착수*

| 단계 | 내용 | 상태 |
|------|------|------|
| Planning | 루틴 데이터 모델, 비중(%) 할당 로직 설계 | ⏸️ Not Started |
| Coding | 루틴 관리 UI/컴포넌트, 트리거 설정 기능 | ⏸️ Not Started |
| Testing | 비중 합계 100% 검증, 트리거 로직 테스트 | ⏸️ Not Started |
| Review | 최종 보고 및 커밋 | ⏸️ Not Started |

---

## 🎬 Episode 3: Dashboard (실시간 엔진 상황판)
*향후 계획 - Episode 2 완료 후 착수*

| 단계 | 내용 | 상태 |
|------|------|------|
| Planning | Delta 계산 로직, 대시보드 UI 설계 | ⏸️ Not Started |
| Coding | Quick Log 기능, 실시간 업데이트 구현 | ⏸️ Not Started |
| Testing | 계산 정확도, 네트워크 끊김 시나리오 테스트 | ⏸️ Not Started |
| Review | 최종 보고 및 커밋 | ⏸️ Not Started |

---

## 🎬 Episode 4: Weekly Insight (회고 및 KPI)
*향후 계획 - Episode 3 완료 후 착수*

| 단계 | 내용 | 상태 |
|------|------|------|
| Planning | KPI 계산 로직, AI 회고 제안 알고리즘 설계 | ⏸️ Not Started |
| Coding | 주간 통계 수집, 회고 UI 구현 | ⏸️ Not Started |
| Testing | KPI 계산 정확도, 샘플 데이터로 회고 내용 검증 | ⏸️ Not Started |
| Review | 최종 보고 및 커밋 | ⏸️ Not Started |

---

## 📊 전체 진행률

```
Episode 1 (Time Wizard):    🟡 30% ████░░░░░░░░░░░░ Planning 진행 중
Episode 2 (Resource Lab):   ⏸️  0% ░░░░░░░░░░░░░░░░░░░░ Not Started
Episode 3 (Dashboard):      ⏸️  0% ░░░░░░░░░░░░░░░░░░░░ Not Started
Episode 4 (Weekly Insight): ⏸️  0% ░░░░░░░░░░░░░░░░░░░░ Not Started

전체 진행률:                🟡 8% ██░░░░░░░░░░░░░░░░░░
```

---

## 🔗 관련 문서

- [WORKFLOW_STATUS.md](./WORKFLOW_STATUS.md) - 현재 Phase 상태
- [DECISION_LOG.md](./DECISION_LOG.md) - 의사결정 기록
- [design_v1_sw.md](./design_v1_sw.md) - Episode 1 설계 문서 (예정)
