# 🚀 [Master PRD] 프로젝트: THE ENGINE (v1.0)

## 1. 제품 비전 (Vision)
> **"의지력에 의존하지 않는, 데이터 기반의 인생 최적화 엔진"**
> 기존 엑셀의 '정량적 통제력'과 모바일의 '즉각적 접근성'을 결합하여, 사용자의 가용 시간을 가장 가치 있는 곳에 배분하고 실행을 자동 유도한다.

---

## 2. 핵심 컨셉 (Core Philosophy)
1. **Time Budgeting (시간 가계부):** 돈을 예산 세워 쓰듯, 시간도 168시간(1주) 단위로 예산을 세운다.
2. **Quantitative Feedback (정량적 피드백):** "열심히 했다"는 주관적 느낌 대신, **Delta($\Delta$)** 수치로 성장을 증명한다.
3. **Environment Design (환경 설계):** 의지력을 쓰지 않도록 시간, 장소, 사건 기반의 **트리거(Trigger)**를 배치한다.

---

## 3. 주요 기능 및 로직 상세 (Detailed Features)

### 3.1. [Module 1] Time Wizard (가용 시간 산정)
사용자의 이번 주 '진짜 남는 시간'을 계산하는 엔진의 출발점입니다.
* **핵심 로직:**
  $$T_{available} = 168 - (T_{fixed} + T_{special})$$
* **변수 정의:**
  - **고정 시간($T_{fixed}$):** 수면, 식사, 업무, 출퇴근 등 매주 반복되는 필수 시간.
  - **특이 사항($T_{special}$):** 회식, 경조사, 병원 등 해당 주에만 발생하는 일회성 이벤트.
* **UI/UX 요구사항:** 168시간에서 바(Bar)가 실시간으로 깎여나가는 시각적 효과 제공.

### 3.2. [Module 2] Resource Lab (루틴 설계 및 배분)
확보된 가용 시간을 어떤 가치에 투자할지 결정합니다.
* **배분 로직:** 각 루틴에 중요도에 따른 **비중(%)**을 부여.
  - *예: 이번 주 가용 40시간 중 '외국어 공부' 비중 20% 설정 시 -> 목표 시간 8시간 자동 할당.*
* **루틴의 유형화:**
  - **Time-based:** 누적 시간이 중요한 루틴 (독서, 코딩 공부).
  - **Action-based:** 수행 여부 자체가 중요한 루틴 (영양제 복용, 찬물 샤워).
* **트리거 설계:** 루틴마다 [언제, 어디서, 무엇 직후에] 실행할지 정의.

### 3.3. [Module 3] The Dashboard (실시간 엔진 상황판)
현재 내가 계획대로 가고 있는지 보여주는 실전 화면입니다.
* **핵심 지표:**
  - **Plan vs Actual:** 오늘까지의 목표 시간 대비 실제 수행 시간.
  - **Delta ($\Delta$):**
    $$\Delta = T_{actual} - T_{goal\_to\_date}$$
  - 마이너스면 빨간색, 플러스면 파란색으로 표시하여 시각적 압박감/성취감 제공.
* **Quick Log:** 한 손으로 3초 안에 기록 가능한 '원터치 타이머' 또는 '체크박스'.

### 3.4. [Module 4] Weekly Insight (회고 및 KPI)
* **주간 KPI:**
  $$KPI = \frac{\sum T_{actual}}{\sum T_{goal}} \times 100$$
* **AI 회고:** 이번 주의 Delta 패턴을 분석하여 다음 주 비중 조절 제안. (예: "화요일 밤마다 Delta가 급격히 떨어지네요. 이 시간엔 휴식을 배치하는 건 어떨까요?")

---

## 4. 기술 스택 (Technical Stack)
* **Frontend:** React (Vite) / TypeScript
* **Styling:** Tailwind CSS (Mobile-first, Dark mode 지원)
* **Backend/DB:** Firebase (Firestore, Authentication)
* **Architecture:**
  - **Logic:** `src/hooks/useEngine.ts` (가용 시간 및 Delta 계산 로직 집중)
  - **View:** Atomic Design 기반 컴포넌트 구조

---

## 5. 에이전트별 특수 지침 (Agent SOP)

* **Lead Architect:** 엑셀의 복잡한 수식이 소수점 단위까지 정확하게 계산되도록 `Engine Core` 로직을 최우선으로 설계하라.
* **UI/UX Designer:** 엑셀의 '표' 느낌을 완전히 지워라. 애플 워치나 헬스 앱처럼 지표가 세련되게 시각화되어야 한다. 
* **Full-stack Developer:** Firebase의 실시간 업데이트를 활용하여 기기 간 데이터 동기화에 신경 써라. 
* **QA Tester:** 가용 시간이 0 이하가 되거나 비중 합이 100%를 넘는 등의 예외 상황을 철저히 검증하라.