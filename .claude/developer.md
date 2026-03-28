# 💻 풀스택 개발자 지침 (.claude/developer.md)

> 풀스택 개발자는 아키텍트의 설계와 디자이너의 UI를 바탕으로 실제 코드를 구현합니다.

---

## 📋 역할 (Role)

- **React 구현:** 설계된 컴포넌트 구현 및 확장
- **로직 개발:** 순수 함수로 계산 로직 작성 (테스트 용이성)
- **상태 관리:** Zustand/Context API로 상태 동기화
- **Firebase 통합:** Firestore 스키마 구현, 실시간 동기화
- **의사결정 기록:** 기술적 선택사항을 `docs/DECISION_LOG.md`에 기록

---

## 🎯 현재 미션 (Episode 1)

### Phase 2: Coding - Time Wizard 구현

**선행 조건:**
- ✅ 리드 아키텍트: `design_v1_sw.md` 데이터 모델 완료
- ✅ UI/UX 디자이너: `design_v1_sw.md` UI 설계 완료
- ✅ 사용자: 설계안 승인 (Approve)

**작업 체크리스트:**

#### 1️⃣ 데이터 타입 정의
```bash
파일: src/types/engine.ts
```

```typescript
// TimeWizard 관련 타입
interface FixedBlock {
  sleep: number;      // 시간 (0-24)
  meals: number;      // 시간 (0-24)
  work: number;       // 시간 (0-24)
  commute: number;    // 시간 (0-24)
  other?: number;     // 추가 고정 시간
}

interface SpecialEvent {
  id: string;
  name: string;
  duration: number;   // 시간
  date: string;       // YYYY-MM-DD
}

interface TimeWizardState {
  fixedBlocks: FixedBlock;
  specialEvents: SpecialEvent[];
  weekStartDate: string;  // YYYY-MM-DD
}

interface TimeWizardResult {
  totalFixed: number;
  totalSpecial: number;
  available: number;
  utilizationRate: number;  // 0-100
}
```

#### 2️⃣ 계산 함수 구현
```bash
파일: src/utils/engine/timeWizard.ts
```

```typescript
/**
 * 가용 시간 계산
 * T_available = 168 - (T_fixed + T_special)
 */
export function calculateAvailableTime(
  fixed: number,
  special: number
): number {
  const available = 168 - (fixed + special);
  return Math.max(0, available);  // 음수 방지
}

/**
 * 주간 이용률 계산
 */
export function calculateUtilizationRate(
  used: number
): number {
  return (used / 168) * 100;
}

/**
 * 제약조건 검증
 */
export function validateTimeVsConstraints(
  fixed: number,
  special: number
): { valid: boolean; error?: string } {
  if (fixed < 0 || special < 0) {
    return { valid: false, error: '시간은 0 이상이어야 합니다.' };
  }
  if (fixed + special > 168) {
    return { valid: false, error: '총 시간이 168시간을 초과합니다.' };
  }
  return { valid: true };
}
```

#### 3️⃣ 상태 관리 구현
```bash
파일: src/stores/timeWizardStore.ts
```

**선택지:**
- [ ] Zustand (경량, 권장)
- [ ] Context API + useReducer (React 내장)

```typescript
import { create } from 'zustand';

interface TimeWizardStore {
  state: TimeWizardState;
  setFixedBlocks: (blocks: FixedBlock) => void;
  addSpecialEvent: (event: SpecialEvent) => void;
  removeSpecialEvent: (eventId: string) => void;
  getResult: () => TimeWizardResult;
}

export const useTimeWizardStore = create<TimeWizardStore>((set, get) => ({
  state: {
    fixedBlocks: { sleep: 8, meals: 2, work: 8, commute: 1 },
    specialEvents: [],
    weekStartDate: new Date().toISOString().split('T')[0]
  },
  setFixedBlocks: (blocks) => set({ state: { ...get().state, fixedBlocks: blocks } }),
  addSpecialEvent: (event) => set({ state: { 
    ...get().state, 
    specialEvents: [...get().state.specialEvents, event] 
  }}),
  removeSpecialEvent: (eventId) => set({ state: {
    ...get().state,
    specialEvents: get().state.specialEvents.filter(e => e.id !== eventId)
  }}),
  getResult: () => {
    const state = get().state;
    const totalFixed = Object.values(state.fixedBlocks).reduce((a, b) => a + b, 0);
    const totalSpecial = state.specialEvents.reduce((sum, e) => sum + e.duration, 0);
    const available = 168 - (totalFixed + totalSpecial);
    
    return {
      totalFixed,
      totalSpecial,
      available: Math.max(0, available),
      utilizationRate: ((totalFixed + totalSpecial) / 168) * 100
    };
  }
}));
```

#### 4️⃣ React 컴포넌트 구현
```bash
기존 파일 확인 및 개선:
src/components/widgets/TimeWizard/
├── TimeWizard.tsx               # 메인 컴포넌트 (상태 관리)
├── FixedBlockSlider.tsx         # 고정 시간 슬라이더
├── SpecialEventInput.tsx        # 특이 사항 추가/제거
├── TimeBar.tsx                  # 가용 시간 시각화
└── AvailableTimeDisplay.tsx     # 결과 표시
```

**TimeWizard.tsx 예제:**
```typescript
import React from 'react';
import { useTimeWizardStore } from '@/stores/timeWizardStore';
import FixedBlockSlider from './FixedBlockSlider';
import SpecialEventInput from './SpecialEventInput';
import TimeBar from './TimeBar';
import AvailableTimeDisplay from './AvailableTimeDisplay';

export default function TimeWizard() {
  const state = useTimeWizardStore(s => s.state);
  const result = useTimeWizardStore(s => s.getResult());

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Time Wizard
      </h1>
      
      <FixedBlockSlider />
      <TimeBar result={result} />
      <SpecialEventInput />
      <AvailableTimeDisplay result={result} />
    </div>
  );
}
```

#### 5️⃣ 단위 테스트 작성
```bash
파일: src/utils/engine/__tests__/timeWizard.test.ts
```

```typescript
import { calculateAvailableTime, validateTimeVsConstraints } from '../timeWizard';

describe('Time Wizard Utils', () => {
  describe('calculateAvailableTime', () => {
    it('should calculate correct available time', () => {
      const result = calculateAvailableTime(10, 5);  // 10시간 고정, 5시간 특이
      expect(result).toBe(153);  // 168 - 10 - 5
    });

    it('should not return negative available time', () => {
      const result = calculateAvailableTime(150, 20);
      expect(result).toBe(0);  // 음수 방지
    });
  });

  describe('validateTimeVsConstraints', () => {
    it('should pass valid constraint', () => {
      const result = validateTimeVsConstraints(10, 5);
      expect(result.valid).toBe(true);
    });

    it('should fail when total exceeds 168', () => {
      const result = validateTimeVsConstraints(100, 70);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('168');
    });
  });
});
```

---

## 🛠️ 작업 단계

### Step 1: 설계 문서 리뷰
- [ ] `docs/design_v1_sw.md` 정독
- [ ] 데이터 구조 이해
- [ ] UI 레이아웃 이해

### Step 2: 타입 정의
- [ ] `src/types/engine.ts` 타입 작성
- [ ] 린트 에러 확인

### Step 3: 유틸 함수 구현
- [ ] `src/utils/engine/timeWizard.ts` 구현
- [ ] 테스트 코드 작성 및 통과 확인

### Step 4: 상태 관리 구현
- [ ] `src/stores/timeWizardStore.ts` 구현 (또는 기존 개선)
- [ ] Zustand/Context API 선택 후 구현

### Step 5: React 컴포넌트 구현
- [ ] 기존 컴포넌트 분석
- [ ] 필요한 부분 수정/확장
- [ ] 상태 관리와 연결

### Step 6: 최종 검증
- [ ] npm run build 성공?
- [ ] 린트 에러/경고 없는가?
- [ ] dev 서버에서 정상 작동하는가?

---

## 📞 완료 보고

**"Implementation Complete"를 다음과 같이 보고:**

```
✅ Implementation Complete (Time Wizard - Episode 1)

**수정된 파일:**
- src/types/engine.ts (새 타입 정의)
- src/utils/engine/timeWizard.ts (계산 함수)
- src/stores/timeWizardStore.ts (상태 관리)
- src/components/widgets/TimeWizard/*.tsx (컴포넌트 개선)
- src/utils/engine/__tests__/timeWizard.test.ts (테스트)

**기능 요약:**
- 고정 시간(sleep, meals, work, commute) 입력
- 특이 사항(회식, 병원 등) 추가/제거
- 168시간 기준 가용 시간 자동 계산
- 시각화 (Bar chart with 고정/특이/가용 구분)

**다음 단계:** Phase 3 QA & Testing
```

---

## 🔗 관련 문서

- [CLAUDE.md](../CLAUDE.md) - 네이밍 규칙 & 코딩 스타일
- [docs/design_v1_sw.md](../docs/design_v1_sw.md) - 설계 산출물
- [docs/DECISION_LOG.md](../docs/DECISION_LOG.md) - 의사결정 기록
