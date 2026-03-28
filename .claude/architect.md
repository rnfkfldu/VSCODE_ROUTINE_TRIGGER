# 🏗️ 리드 아키텍트 지침 (.claude/architect.md)

> 리드 아키텍트는 데이터 모델 설계, 로직 검증, 의사결정 기록을 담당합니다.

---

## 📋 역할 (Role)

- **데이터 모델 설계:** PRD의 수학 공식을 TypeScript 인터페이스로 변환
- **로직 검증:** 계산 함수가 엑셀 결과와 일치하는지 확인
- **의사결정 기록:** 모든 기술적 선택을 `docs/DECISION_LOG.md`에 기록
- **최종 보고:** Phase 4에서 전체 기능 요약 보고서 작성

---

## 🎯 현재 미션 (Episode 1)

### Phase 1: Planning - 데이터 모델 설계

**배경:**
```
PRD의 Time Wizard 핵심 로직:
T_available = 168 - (T_fixed + T_special)
```

**작업 체크리스트:**
- [ ] `types/engine.ts`에서 다음 타입 정의
  ```typescript
  interface TimeWizardData {
    fixedBlocks: {
      sleep: number;      // 시간
      meals: number;
      work: number;
      commute: number;
      // ... 추가 고정 시간 항목
    };
    specialEvents: {
      name: string;
      duration: number;   // 시간
      date: string;
    }[];
    weeklyTotal: number;  // 168시간
  }
  ```

- [ ] 계산 함수 인터페이스 설계
  ```typescript
  function calculateAvailableTime(data: TimeWizardData): {
    totalFixed: number;
    totalSpecial: number;
    available: number;
    utillizationRate: number;
  }
  ```

- [ ] 검증 로직 설계
  - [ ] `available >= 0` 체크
  - [ ] `totalFixed + totalSpecial <= 168` 체크
  - [ ] 입력값 음수 체크

**산출물:** 설계된 타입과 로직 설명을 `docs/design_v1_sw.md`에 작성

---

## 🔧 작업 단계

### Step 1: 현재 코드 분석
```bash
# 확인할 파일
src/types/engine.ts           # 기존 타입 정의
src/utils/timeWizard.ts       # 기존 함수
stores/timeWizardStore.ts     # 상태 관리
```

### Step 2: 설계 문서 작성
```markdown
# Episode 1 설계: Time Wizard (design_v1_sw.md)

## 1. 데이터 모델
[TypeScript 인터페이스 정의]

## 2. 계산 로직
[T_available = 168 - (T_fixed + T_special) 상세 설명]

## 3. 제약사항 및 검증
[엣지 케이스, 에러 처리]

## 4. UI/UX 통합점
[컴포넌트가 이 데이터를 어떻게 사용할지]
```

### Step 3: 의사결정 기록
모든 설계 선택사항을 `docs/DECISION_LOG.md`에 기록:
- 왜 이 데이터 구조를 선택했는가?
- 다른 방식은 고려했는가?
- 프로젝트에 미치는 영향은?

### Step 4: 설계 검증
- [ ] PRD 공식과 일치하는가?
- [ ] UI 컴포넌트가 이 데이터를 쉽게 사용할 수 있는가?
- [ ] Firebase로 저장/로드 가능한가?

---

## 📞 체크포인트

**설계 완료 후 다음 연락:**
```
[설계 완료]
- 데이터 모델: types/engine.ts 작성 완료
- 로직 설계: design_v1_sw.md 작성 완료
- 의사결정: DECISION_LOG.md 기록 완료

다음 에이전트: UI/UX 디자이너 (설계 기반 UI 스케치)
```

---

## 🔗 관련 문서

- [PRD.md](../PRD.md) - 수학 공식 참고
- [CLAUDE.md](../CLAUDE.md) - 코딩 규칙
- [docs/DECISION_LOG.md](../docs/DECISION_LOG.md) - 의사결정 기록
- [docs/design_v1_sw.md](../docs/design_v1_sw.md) - 설계 산출물 템플릿
