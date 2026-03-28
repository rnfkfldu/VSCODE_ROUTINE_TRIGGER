/**
 * @file engine.ts
 * @description Routine Trigger 엔진 핵심 타입 정의
 *
 * 4개 모듈의 수학적 공식을 TypeScript Interface로 추적 가능하도록 설계.
 * Firebase Firestore 연동을 고려한 확장 가능 구조.
 *
 * @module RoutineTriggerEngine
 */

// =============================================================================
// SECTION 0: 공통 기반 타입 (Shared Primitives)
// =============================================================================

/** 시간 단위 (Hours). 소수점 포함 number. 예: 1.5 = 1시간 30분 */
export type Hours = number;

/** 비중 단위 (0 ~ 100 사이의 퍼센트). 예: 20.5 = 20.5% */
export type Percentage = number;

/** ISO 8601 날짜 문자열. Firestore Timestamp 대신 직렬화 가능한 형태로 저장 */
export type ISODateString = string;

/** Firestore 문서 ID */
export type FirestoreDocId = string;

// =============================================================================
// SECTION 1: Module 1 — Time Wizard (가용 시간 산정)
// =============================================================================

/**
 * 고정 시간 블록 (Fixed Time Block)
 * 매주 반복되는 필수 시간 항목.
 *
 * @example
 * const sleep: FixedTimeBlock = { id: 'sleep', label: '수면', hoursPerWeek: 49 };
 */
export interface FixedTimeBlock {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 항목명. 예: '수면', '식사', '업무', '출퇴근' */
  label: string;
  /**
   * 주당 소요 시간 (Hours)
   * @constraint 반드시 0 초과여야 유효한 항목으로 간주
   */
  hoursPerWeek: Hours;
  /** 항목 설명 (선택) */
  description?: string;
}

/**
 * 특별 이벤트 블록 (Special Event Block)
 * 해당 주에만 발생하는 일회성 이벤트 항목.
 *
 * @example
 * const dinner: SpecialEventBlock = { id: 'dinner-01', label: '팀 회식', hours: 3, date: '2026-03-29' };
 */
export interface SpecialEventBlock {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 이벤트명. 예: '회식', '경조사', '병원' */
  label: string;
  /**
   * 해당 이벤트 소요 시간 (Hours)
   * @constraint 반드시 0 초과여야 유효한 항목으로 간주
   */
  hours: Hours;
  /** 발생 날짜 (ISO 8601) */
  date: ISODateString;
  /** 이벤트 설명 (선택) */
  description?: string;
}

/**
 * 주간 가용 시간 계산 결과 (Weekly Available Time)
 *
 * @formula T_available = 168 - (T_fixed + T_special)
 * @formula T_fixed = Σ FixedTimeBlock.hoursPerWeek
 * @formula T_special = Σ SpecialEventBlock.hours
 *
 * EDGE CASE:
 *   - T_available < 0: T_fixed + T_special 합계가 168시간을 초과하는 경우.
 *     → isOverAllocated = true 로 표시하고 UI에서 경고 처리.
 *     → 루틴 배분(Module 2)에서 T_available을 0으로 클램핑하여 사용.
 *   - T_available = 0: 가용 시간이 전혀 없는 경우 루틴 배분 불가.
 */
export interface WeeklyAvailableTime {
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 해당 주의 고정 시간 목록 */
  fixedBlocks: FixedTimeBlock[];
  /** 해당 주의 특별 이벤트 목록 */
  specialBlocks: SpecialEventBlock[];
  /**
   * 고정 시간 합계 (Hours)
   * @formula T_fixed = Σ fixedBlocks[i].hoursPerWeek
   */
  tFixed: Hours;
  /**
   * 특별 이벤트 합계 (Hours)
   * @formula T_special = Σ specialBlocks[i].hours
   */
  tSpecial: Hours;
  /**
   * 가용 시간 (Hours)
   * @formula T_available = 168 - (T_fixed + T_special)
   * @constraint 최솟값은 0 (음수 허용 안 함, isOverAllocated 플래그로 처리)
   */
  tAvailable: Hours;
  /**
   * 초과 배분 여부
   * true: T_fixed + T_special > 168 (가용 시간이 음수가 되는 엣지 케이스)
   */
  isOverAllocated: boolean;
}

// =============================================================================
// SECTION 2: Module 2 — Resource Lab (루틴 설계 및 배분)
// =============================================================================

/**
 * 루틴 유형 (Routine Type)
 * - TIME_BASED: 누적 시간이 중요한 루틴 (독서, 코딩 공부 등)
 * - ACTION_BASED: 수행 여부 자체가 중요한 루틴 (영양제 복용, 찬물 샤워 등)
 */
export const RoutineType = {
  TIME_BASED: 'TIME_BASED',
  ACTION_BASED: 'ACTION_BASED',
} as const;
export type RoutineType = (typeof RoutineType)[keyof typeof RoutineType];

/**
 * 트리거 시점 유형 (Trigger Timing Type)
 * 루틴을 실행할 시점을 정의하는 유형.
 */
export const TriggerTimingType = {
  /** 특정 시각에 실행. 예: 오전 7:00 */
  SPECIFIC_TIME: 'SPECIFIC_TIME',
  /** 특정 행동 직후에 실행. 예: 기상 직후, 식사 직후 */
  AFTER_ACTION: 'AFTER_ACTION',
  /** 특정 장소에 도착 시 실행. 예: 집 도착 시 */
  LOCATION_BASED: 'LOCATION_BASED',
} as const;
export type TriggerTimingType = (typeof TriggerTimingType)[keyof typeof TriggerTimingType];

/**
 * 루틴 트리거 정의 (Routine Trigger)
 * 루틴마다 [언제, 어디서, 무엇 직후에]를 정의.
 */
export interface RoutineTrigger {
  /** 트리거 시점 유형 */
  timingType: TriggerTimingType;
  /**
   * 구체적 시각 (HH:MM 형식, SPECIFIC_TIME일 때 사용)
   * @example '07:00'
   */
  specificTime?: string;
  /**
   * 선행 행동 (AFTER_ACTION일 때 사용)
   * @example '기상', '점심 식사', '퇴근'
   */
  afterAction?: string;
  /**
   * 장소 (LOCATION_BASED 또는 보조 정보로 사용)
   * @example '집', '사무실', '헬스장'
   */
  location?: string;
  /** 트리거 추가 설명 */
  note?: string;
}

/**
 * 루틴 정의 (Routine Definition)
 * Resource Lab에서 설계된 개별 루틴.
 *
 * @formula T_goal_weekly = T_available × (weight / 100)
 *
 * EDGE CASE:
 *   - weight 합계가 100%를 초과하는 경우:
 *     → WeeklyRoutinePlan.isTotalWeightExceeded = true 로 표시.
 *     → 초과 시 자동 정규화 또는 사용자 수동 조정 필요 (UI에서 경고).
 *   - T_available = 0일 때 T_goal_weekly는 항상 0이 됨.
 */
export interface RoutineDefinition {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 루틴명. 예: '독서', '코딩 공부', '영양제 복용' */
  name: string;
  /** 루틴 유형 */
  type: RoutineType;
  /**
   * 중요도 비중 (%)
   * @constraint 0 < weight <= 100
   * @constraint 동일 WeeklyRoutinePlan 내 모든 루틴의 weight 합계는 100 이하여야 정상
   */
  weight: Percentage;
  /**
   * 주간 목표 시간 (Hours) — TIME_BASED 전용
   * @formula T_goal_weekly = T_available × (weight / 100)
   * @note ACTION_BASED 루틴에서는 null 또는 0으로 설정
   */
  goalHoursPerWeek?: Hours;
  /**
   * 일회 수행 예상 소요 시간 (Hours) — TIME_BASED 전용
   * @example 독서 1회 = 0.5 (30분)
   */
  sessionDurationHours?: Hours;
  /**
   * 주간 목표 수행 횟수 — ACTION_BASED 전용
   * @example 영양제 복용 = 7 (매일)
   */
  targetFrequencyPerWeek?: number;
  /** 루틴 트리거 (언제/어디서/무엇 직후에) */
  trigger: RoutineTrigger;
  /** 루틴 설명 (선택) */
  description?: string;
  /** Firestore 생성 타임스탬프 (ISODateString) */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 (ISODateString) */
  updatedAt: ISODateString;
}

/**
 * 주간 루틴 플랜 (Weekly Routine Plan)
 * 특정 주의 가용 시간과 루틴 배분 계획.
 *
 * EDGE CASE:
 *   - isTotalWeightExceeded = true: 전체 비중 합계 > 100%
 *     → 루틴별 실제 배분 시간이 T_available을 초과할 수 있음.
 *     → 사용자가 weight를 조정하거나 루틴을 제거해야 함.
 */
export interface WeeklyRoutinePlan {
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 연결된 WeeklyAvailableTime */
  availableTime: WeeklyAvailableTime;
  /** 해당 주의 루틴 목록 */
  routines: RoutineDefinition[];
  /**
   * 전체 비중 합계 (%)
   * @formula totalWeight = Σ routines[i].weight
   * @constraint 정상 범위: 0 <= totalWeight <= 100
   */
  totalWeight: Percentage;
  /**
   * 비중 초과 여부
   * true: totalWeight > 100 (엣지 케이스 - 배분 시간 합이 T_available 초과)
   */
  isTotalWeightExceeded: boolean;
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 */
  updatedAt: ISODateString;
}

// =============================================================================
// SECTION 3: Module 3 — Dashboard (실시간 엔진 상황판)
// =============================================================================

/**
 * 로그 유형 (Log Entry Type)
 * - TIMER: 원터치 타이머로 기록된 시간 (TIME_BASED 루틴용)
 * - CHECKBOX: 체크박스로 기록된 완료 여부 (ACTION_BASED 루틴용)
 */
export const LogEntryType = {
  TIMER: 'TIMER',
  CHECKBOX: 'CHECKBOX',
} as const;
export type LogEntryType = (typeof LogEntryType)[keyof typeof LogEntryType];

/**
 * 루틴 수행 로그 (Routine Log Entry)
 * Quick Log: 원터치 타이머 또는 체크박스로 기록.
 */
export interface RoutineLogEntry {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 연결된 루틴 ID */
  routineId: FirestoreDocId;
  /** 로그 유형 */
  type: LogEntryType;
  /**
   * 실제 수행 시간 (Hours) — TIMER 유형 전용
   * @note CHECKBOX 유형에서는 null 또는 0 (시간 추적 불필요)
   */
  actualHours?: Hours;
  /**
   * 완료 여부 — CHECKBOX 유형 전용
   * @note TIMER 유형에서는 actualHours > 0 이면 완료로 간주
   */
  isCompleted?: boolean;
  /** 로그 기록 일시 (ISO 8601) */
  loggedAt: ISODateString;
  /** 메모 (선택) */
  note?: string;
}

/**
 * 루틴별 일일 진행 현황 (Routine Daily Progress)
 * Dashboard의 Plan vs Actual 계산 단위.
 *
 * @formula T_goal_to_date = T_goal_weekly × (elapsedDays / 7)
 * @formula delta = T_actual - T_goal_to_date
 *
 * EDGE CASE:
 *   - delta < 0 (빨강): 목표 대비 뒤처짐
 *   - delta > 0 (파랑): 목표 대비 앞서 있음
 *   - delta = 0: 정확히 목표치 달성
 *   - ACTION_BASED 루틴: T_goal_to_date 대신 completedCount / targetFrequencyPerWeek 비율로 대체
 */
export interface RoutineDailyProgress {
  /** 연결된 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 (비정규화 캐시용) */
  routineName: string;
  /** 루틴 유형 */
  routineType: RoutineType;
  /**
   * 오늘까지의 누적 실제 수행 시간 (Hours) — TIME_BASED 전용
   * @formula T_actual = Σ RoutineLogEntry.actualHours (해당 주 누적)
   */
  tActual: Hours;
  /**
   * 오늘까지의 목표 시간 (Hours) — TIME_BASED 전용
   * @formula T_goal_to_date = T_goal_weekly × (elapsedDays / 7)
   */
  tGoalToDate: Hours;
  /**
   * Delta: 목표 대비 실제 수행 차이 (Hours) — TIME_BASED 전용
   * @formula delta = T_actual - T_goal_to_date
   * @note 음수 = 빨강(뒤처짐), 양수 = 파랑(앞서 있음)
   */
  delta: Hours;
  /**
   * 오늘까지 완료 횟수 — ACTION_BASED 전용
   */
  completedCount?: number;
  /**
   * 오늘까지 목표 완료 횟수 — ACTION_BASED 전용
   * @formula targetCountToDate = targetFrequencyPerWeek × (elapsedDays / 7)
   */
  targetCountToDate?: number;
  /** 해당 일자 (ISO 8601) */
  date: ISODateString;
}

/**
 * 대시보드 상태 (Dashboard State)
 * 실시간 엔진 상황판의 전체 상태.
 */
export interface DashboardState {
  /** 현재 주간 ID (예: '2026-W13') */
  weekId: string;
  /** 현재 날짜 (ISO 8601) */
  today: ISODateString;
  /** 주 시작일로부터 경과 일수 (1~7) */
  elapsedDays: number;
  /** 현재 주의 루틴 플랜 */
  weeklyPlan: WeeklyRoutinePlan;
  /** 루틴별 진행 현황 목록 */
  progressList: RoutineDailyProgress[];
  /** 오늘의 로그 목록 */
  todayLogs: RoutineLogEntry[];
}

// =============================================================================
// SECTION 4: Module 4 — Weekly Insight (회고 및 KPI)
// =============================================================================

/**
 * AI 비중 조절 제안 (AI Weight Adjustment Suggestion)
 * Delta 패턴 분석 후 다음 주 비중 조절을 제안.
 */
export interface WeightAdjustmentSuggestion {
  /** 대상 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 (비정규화 캐시용) */
  routineName: string;
  /** 현재 비중 (%) */
  currentWeight: Percentage;
  /** 제안 비중 (%) */
  suggestedWeight: Percentage;
  /**
   * 비중 변화량 (%)
   * @formula weightDelta = suggestedWeight - currentWeight
   * @note 양수 = 비중 증가 제안, 음수 = 비중 감소 제안
   */
  weightDelta: Percentage;
  /** 제안 이유 (AI 생성 텍스트) */
  reason: string;
}

/**
 * 루틴별 주간 KPI (Routine Weekly KPI)
 *
 * @formula KPI = (Σ T_actual / Σ T_goal) × 100
 *
 * EDGE CASE:
 *   - T_goal = 0 또는 T_goal_weekly = 0인 경우: KPI 계산 불가 (division by zero).
 *     → kpi = null 로 처리하고 UI에서 'N/A' 표시.
 *   - ACTION_BASED 루틴: 시간 대신 완료 횟수 기반 KPI 계산.
 *     → kpi = (completedCount / targetFrequencyPerWeek) × 100
 */
export interface RoutineWeeklyKPI {
  /** 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 (비정규화 캐시용) */
  routineName: string;
  /** 루틴 유형 */
  routineType: RoutineType;
  /**
   * 주간 실제 수행 시간 합계 (Hours) — TIME_BASED 전용
   * @formula sumTActual = Σ RoutineLogEntry.actualHours (해당 주 전체)
   */
  sumTActual?: Hours;
  /**
   * 주간 목표 시간 (Hours) — TIME_BASED 전용
   * @formula sumTGoal = T_available × (weight / 100)
   */
  sumTGoal?: Hours;
  /**
   * 주간 완료 횟수 — ACTION_BASED 전용
   */
  completedCount?: number;
  /**
   * 주간 목표 완료 횟수 — ACTION_BASED 전용
   */
  targetFrequencyPerWeek?: number;
  /**
   * KPI 달성률 (%)
   * @formula KPI = (sumTActual / sumTGoal) × 100  [TIME_BASED]
   * @formula KPI = (completedCount / targetFrequencyPerWeek) × 100  [ACTION_BASED]
   * @note null: 목표값이 0이어서 계산 불가 (division by zero 방지)
   */
  kpi: Percentage | null;
}

/**
 * 주간 회고 요약 (Weekly Insight Summary)
 * Weekly Insight 모듈의 최종 집계 및 AI 제안.
 *
 * @formula overallKPI = (Σ T_actual_all / Σ T_goal_all) × 100
 *
 * EDGE CASE:
 *   - overallKPI > 100: 모든 목표를 초과 달성한 경우. 정상적인 값.
 *   - overallKPI = null: T_goal_all = 0 (가용 시간이 없었거나 루틴이 없는 경우).
 */
export interface WeeklyInsightSummary {
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 주 시작일 (ISO 8601) */
  weekStartDate: ISODateString;
  /** 주 종료일 (ISO 8601) */
  weekEndDate: ISODateString;
  /** 해당 주의 가용 시간 */
  availableTime: WeeklyAvailableTime;
  /** 루틴별 KPI 목록 */
  routineKPIs: RoutineWeeklyKPI[];
  /**
   * 전체 KPI (%)
   * @formula overallKPI = (Σ sumTActual_all / Σ sumTGoal_all) × 100
   * @note null: 전체 목표 시간이 0인 경우 (계산 불가)
   */
  overallKPI: Percentage | null;
  /**
   * 총 실제 수행 시간 합계 (Hours)
   * @formula totalTActual = Σ routineKPIs[i].sumTActual
   */
  totalTActual: Hours;
  /**
   * 총 목표 시간 합계 (Hours)
   * @formula totalTGoal = Σ routineKPIs[i].sumTGoal
   */
  totalTGoal: Hours;
  /** AI 제안 비중 조절 목록 */
  weightAdjustmentSuggestions: WeightAdjustmentSuggestion[];
  /** AI 회고 텍스트 (Delta 패턴 분석 요약) */
  aiReflectionText: string;
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
}

// =============================================================================
// SECTION 5: Module 5 — Schedule Distribution (주간 분배)
// =============================================================================

/**
 * 요일 리터럴 유니온 타입 (Day of Week)
 * ISO 8601 기준: 월요일(MON) ~ 일요일(SUN)
 *
 * EDGE CASE:
 *   - 특정 요일에 0h를 배분하는 경우: 해당 요일은 휴식일로 간주.
 *   - DailyRoutineAllocation 배열에서 해당 요일 항목을 생략하거나 allocatedHours = 0으로 포함해도 무방.
 */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

/** 요일 표시 순서 상수 (UI 렌더링 순서 보장용) */
export const DAY_OF_WEEK_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const satisfies DayOfWeek[];

/**
 * 요일별 루틴 시간 배분 단위 (Daily Routine Allocation)
 * 특정 루틴의 특정 요일 목표 시간을 나타내는 최소 단위.
 *
 * @example
 * // '운동' 루틴, 월요일 2h 배분
 * const mon: DailyRoutineAllocation = { day: 'MON', allocatedHours: 2 };
 */
export interface DailyRoutineAllocation {
  /** 요일 */
  day: DayOfWeek;
  /**
   * 해당 요일에 배분된 목표 시간 (Hours)
   * @constraint 반드시 0 이상. 0 = 해당 요일 휴식
   */
  allocatedHours: Hours;
  /** 선택적 메모 (예: '헬스장 픽업 루틴') */
  note?: string;
}

/**
 * 루틴별 주간 분배 계획 (Routine Schedule Distribution)
 * 하나의 루틴에 대해 7개 요일에 목표 시간을 분배.
 *
 * @formula validationConstraint: Σ dailyAllocations[i].allocatedHours === routine.goalHoursPerWeek
 *
 * EDGE CASE:
 *   - isSumValid = false: 요일별 배분 합계가 루틴 주간 목표 시간과 불일치.
 *     → 실수 부동소수점 오차 허용 범위: |allocatedSum - goalHoursPerWeek| < 0.01
 *     → UI에서 경고 표시, 저장 시 사용자 확인 요구.
 *   - ACTION_BASED 루틴: allocatedHours 대신 targetCount(횟수)를 요일별로 배분.
 *     → allocatedHours는 0으로 고정하고 dailyTargetCount 필드 사용.
 *   - 일부 요일만 선택하는 경우 (예: 주 3회 루틴):
 *     → 나머지 요일의 DailyRoutineAllocation.allocatedHours = 0 또는 항목 생략.
 */
export interface RoutineScheduleDistribution {
  /** 연결된 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 (비정규화 캐시용) */
  routineName: string;
  /** 루틴 유형 */
  routineType: RoutineType;
  /**
   * 루틴 주간 목표 시간 (Hours) — TIME_BASED 전용
   * @note ACTION_BASED의 경우 0 또는 undefined
   */
  goalHoursPerWeek?: Hours;
  /**
   * 루틴 주간 목표 횟수 — ACTION_BASED 전용
   * @note TIME_BASED의 경우 undefined
   */
  targetFrequencyPerWeek?: number;
  /**
   * 요일별 배분 목록 (최대 7개 항목)
   * @constraint 길이 0~7. 없는 요일 = 해당 루틴 없는 날
   */
  dailyAllocations: DailyRoutineAllocation[];
  /**
   * 배분 합계 (Hours) — TIME_BASED 전용
   * @formula allocatedSum = Σ dailyAllocations[i].allocatedHours
   */
  allocatedSum?: Hours;
  /**
   * 배분 합계 유효성 플래그 — TIME_BASED 전용
   * @formula isSumValid = |allocatedSum - goalHoursPerWeek| < 0.01
   * @note ACTION_BASED는 횟수 기준이므로 별도 계산 (항상 true로 설정 가능)
   */
  isSumValid: boolean;
}

/**
 * 주간 전체 분배 계획 (Weekly Schedule Distribution)
 * WeeklyRoutinePlan에 요일별 분배 정보를 추가한 확장 계획.
 *
 * EDGE CASE:
 *   - routineDistributions 길이가 weeklyPlan.routines 길이와 다를 경우:
 *     → 일부 루틴에 아직 요일 배분이 설정되지 않은 상태.
 *     → UI에서 '미배분 루틴 있음' 경고 표시.
 */
export interface WeeklyScheduleDistribution {
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 연결된 주간 루틴 플랜 ID */
  weeklyPlanId: FirestoreDocId;
  /** 루틴별 요일 분배 목록 */
  routineDistributions: RoutineScheduleDistribution[];
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 */
  updatedAt: ISODateString;
}

// =============================================================================
// SECTION 6: Module 6 — Trigger Habits (트리거 습관)
// =============================================================================

/**
 * 트리거 조건 유형 (Trigger Condition Type)
 * RoutineTrigger.TriggerTimingType의 AFTER_ACTION을 생활 맥락별로 세분화한 전용 타입.
 *
 * RoutineTrigger와의 차이점:
 *   - RoutineTrigger: 루틴 실행 시점을 선언적으로 정의 (TIME_BASED/ACTION_BASED 공용)
 *   - TriggerConditionType: 트리거 습관(TriggerHabit) 전용. 생활 맥락의 의미론적 분류.
 *     스트릭 계산 및 달성 체크에 특화된 구조.
 */
export const TriggerConditionType = {
  /** 식사 후. 예: 점심 후 영양제 복용, 저녁 후 스트레칭 */
  AFTER_MEAL: 'AFTER_MEAL',
  /** 퇴근 후. 예: 퇴근 후 운동 */
  AFTER_WORK: 'AFTER_WORK',
  /** 기상 직후. 예: 기상 후 물 한 잔 */
  AFTER_WAKE_UP: 'AFTER_WAKE_UP',
  /** 취침 직전. 예: 취침 전 독서 */
  BEFORE_SLEEP: 'BEFORE_SLEEP',
  /** 자녀/가족 재운 후. 예: 아이 재운 후 개인 공부 */
  AFTER_FAMILY_SETTLED: 'AFTER_FAMILY_SETTLED',
  /** 특정 장소 도착 후. 예: 헬스장 도착 후 */
  AFTER_ARRIVAL: 'AFTER_ARRIVAL',
  /** 특정 작업 완료 후. 예: 코딩 세션 후 회고 */
  AFTER_TASK_DONE: 'AFTER_TASK_DONE',
  /** 사용자 정의 트리거 */
  CUSTOM: 'CUSTOM',
} as const;
export type TriggerConditionType = (typeof TriggerConditionType)[keyof typeof TriggerConditionType];

/**
 * 스트릭 기록 (Streak Record)
 * 트리거 습관의 연속 달성 및 최장 스트릭을 추적.
 *
 * 스트릭 계산 규칙:
 *   1. 해당 습관이 적용되는 요일(activeDays)에만 스트릭 카운트 적용.
 *   2. activeDays에 포함된 날에 isCompleted = false이면 스트릭 리셋.
 *   3. activeDays에 포함되지 않은 날(예: 주말 제외)은 스트릭 유지 (카운트 불변).
 *   4. currentStreak는 오늘 기준 가장 최근 연속 달성 일수.
 *
 * EDGE CASE:
 *   - 첫 번째 날 달성 시: currentStreak = 1, longestStreak = 1.
 *   - 달성 실패 후 재시작: currentStreak = 0 (또는 다음 달성일부터 1로 리셋).
 *   - activeDays가 비어 있는 경우: 스트릭 계산 불가, currentStreak = 0.
 */
export interface StreakRecord {
  /** 현재 연속 달성 일수 (스트릭) */
  currentStreak: number;
  /** 역대 최장 연속 달성 일수 */
  longestStreak: number;
  /**
   * 마지막으로 달성한 날짜 (ISO 8601)
   * @note null: 아직 한 번도 달성하지 않은 경우
   */
  lastCompletedDate: ISODateString | null;
  /**
   * 스트릭이 시작된 날짜 (ISO 8601)
   * @note null: 현재 스트릭이 0인 경우
   */
  currentStreakStartDate: ISODateString | null;
  /**
   * 역대 최장 스트릭이 시작된 날짜 (ISO 8601)
   * @note null: 아직 한 번도 달성하지 않은 경우
   */
  longestStreakStartDate: ISODateString | null;
}

/**
 * 트리거 습관 로그 (Trigger Habit Log)
 * 하루 단위 트리거 습관 달성 여부를 기록.
 * RoutineLogEntry와 분리된 이유: 스트릭 계산을 위해 날짜별 달성 여부가 핵심이며,
 * 시간 측정(actualHours)보다 트리거 발생 여부와 맥락 메모가 중요.
 */
export interface TriggerHabitLog {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 연결된 TriggerHabit ID */
  habitId: FirestoreDocId;
  /** 기록 날짜 (ISO 8601, YYYY-MM-DD) */
  date: ISODateString;
  /** 트리거 조건 발생 여부 (트리거 자체가 일어났는지) */
  triggerOccurred: boolean;
  /**
   * 트리거 후 습관 달성 여부
   * @note triggerOccurred = false이면 isCompleted는 항상 false
   */
  isCompleted: boolean;
  /**
   * 실제 수행 시간 (Hours) — 선택적, 시간 측정이 의미 있는 경우
   * @note 대부분의 트리거 습관은 완료 여부가 핵심이므로 optional
   */
  actualHours?: Hours;
  /** 기록 일시 (ISO 8601 datetime) */
  loggedAt: ISODateString;
  /** 메모 (예: '트리거 발생했지만 피곤해서 건너뜀') */
  note?: string;
}

/**
 * 트리거 습관 정의 (Trigger Habit)
 * RoutineDefinition의 ACTION_BASED와의 명확한 차이:
 *
 * | 항목               | ACTION_BASED RoutineDefinition   | TriggerHabit                          |
 * |--------------------|----------------------------------|---------------------------------------|
 * | 핵심 측정 단위     | 주간 목표 횟수 (targetFrequency) | 트리거 발생 → 행동 연결 (맥락 의존)   |
 * | 스트릭 추적        | 없음                             | StreakRecord로 추적                    |
 * | 트리거 상세 조건   | RoutineTrigger (범용)            | TriggerConditionType (생활 맥락 특화) |
 * | 트리거 실패 처리   | 없음                             | triggerOccurred 분리 추적             |
 * | 주간 배분 대상     | WeeklyScheduleDistribution 포함  | activeDays로 독립 관리                |
 *
 * EDGE CASE:
 *   - triggerOccurred = false인 날의 처리:
 *     → 트리거 자체가 없었으면 isCompleted = false이지만 스트릭 리셋 여부는
 *       skipOnMissingTrigger 플래그에 따라 결정.
 *     → skipOnMissingTrigger = true: 트리거 없는 날은 스트릭 유지 (건너뜀 처리).
 *     → skipOnMissingTrigger = false: 트리거 없는 날도 실패로 간주, 스트릭 리셋.
 */
export interface TriggerHabit {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 습관명. 예: '점심 후 영양제', '퇴근 후 30분 독서' */
  name: string;
  /** 트리거 조건 유형 */
  conditionType: TriggerConditionType;
  /**
   * 커스텀 트리거 설명 (conditionType = CUSTOM일 때 필수)
   * @example '아이 재운 후', '회의 끝나고 바로'
   */
  customConditionLabel?: string;
  /**
   * 트리거 후 수행할 구체적 행동 설명
   * @example '비타민D + 오메가3 복용', '스트레칭 10분'
   */
  actionDescription: string;
  /**
   * 습관이 적용되는 요일 목록
   * @constraint 길이 1~7. 빈 배열은 비활성 상태를 의미.
   * @example ['MON', 'TUE', 'WED', 'THU', 'FRI'] // 평일만
   */
  activeDays: DayOfWeek[];
  /**
   * 트리거가 발생하지 않은 날의 스트릭 처리 방식
   * true: 트리거 없는 날은 스트릭 유지 (건너뜀 허용)
   * false: 트리거 없는 날도 실패로 간주하여 스트릭 리셋
   * @default false
   */
  skipOnMissingTrigger: boolean;
  /** 스트릭 기록 */
  streak: StreakRecord;
  /**
   * 이번 주 달성 횟수
   * @formula weeklyCompletedCount = 해당 주 TriggerHabitLog 중 isCompleted = true 개수
   */
  weeklyCompletedCount: number;
  /**
   * 이번 주 트리거 발생 횟수
   * @note weeklyCompletedCount <= weeklyTriggerCount 항상 성립
   */
  weeklyTriggerCount: number;
  /**
   * 연결된 RoutineDefinition ID (선택)
   * 트리거 습관이 특정 TIME_BASED 루틴의 시작 트리거 역할을 할 때 연결.
   * @example '퇴근 후 독서' 습관이 '독서' 루틴 ID와 연결
   */
  linkedRoutineId?: FirestoreDocId;
  /** 습관 설명 (선택) */
  description?: string;
  /** 활성화 여부 */
  isActive: boolean;
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 */
  updatedAt: ISODateString;
}

// =============================================================================
// SECTION 7: Module 7 — Daily Check-in (일간 체크인)
// =============================================================================

/**
 * 루틴별 일간 체크인 항목 (Routine Daily Check-in Item)
 * DailyCheckIn의 구성 단위. 특정 날짜의 특정 루틴 상태.
 *
 * @formula delta = T_actual - T_goal_to_date  [TIME_BASED]
 * @formula completionRate = completedCount / targetCountToDate  [ACTION_BASED]
 *
 * EDGE CASE:
 *   - scheduledHours = 0인 날: 해당 루틴이 오늘 배분되지 않은 날.
 *     → isScheduledToday = false로 표시. delta 계산 제외.
 *   - TIME_BASED이나 아직 로그 없는 경우: tActual = 0, delta < 0 (뒤처짐 상태).
 */
export interface RoutineDailyCheckInItem {
  /** 연결된 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 (비정규화 캐시용) */
  routineName: string;
  /** 루틴 유형 */
  routineType: RoutineType;
  /**
   * 오늘 배분된 목표 시간 (Hours) — TIME_BASED 전용
   * WeeklyScheduleDistribution에서 오늘 요일의 allocatedHours 참조.
   * @note 오늘이 activeDays에 없으면 0
   */
  scheduledHours: Hours;
  /**
   * 오늘까지의 누적 실제 수행 시간 (Hours) — TIME_BASED 전용
   * @formula tActual = Σ RoutineLogEntry.actualHours (해당 주 월~오늘 누적)
   */
  tActual: Hours;
  /**
   * 오늘까지의 누적 목표 시간 (Hours) — TIME_BASED 전용
   * @formula tGoalToDate = T_goal_weekly × (elapsedDays / 7)
   */
  tGoalToDate: Hours;
  /**
   * Delta: 누적 목표 대비 실제 수행 차이 (Hours) — TIME_BASED 전용
   * @formula delta = tActual - tGoalToDate
   * @note 음수 = 뒤처짐(빨강), 양수 = 앞서 있음(파랑), 0 = 정확히 달성
   */
  delta: Hours;
  /**
   * 오늘까지 완료 횟수 — ACTION_BASED 전용
   */
  completedCount?: number;
  /**
   * 오늘까지 목표 횟수 — ACTION_BASED 전용
   * @formula targetCountToDate = ceil(targetFrequencyPerWeek × (elapsedDays / 7))
   */
  targetCountToDate?: number;
  /**
   * 오늘 루틴이 스케줄에 있는지 여부
   * false인 경우 UI에서 회색으로 표시 또는 생략
   */
  isScheduledToday: boolean;
  /**
   * 오늘 해당 루틴 완료 여부
   * TIME_BASED: scheduledHours <= 오늘 실제 수행 시간
   * ACTION_BASED: 오늘 목표 횟수 달성 여부
   */
  isCompletedToday: boolean;
}

/**
 * 일간 트리거 습관 체크인 항목 (Daily Trigger Habit Check-in Item)
 * DailyCheckIn에서 트리거 습관 상태를 표시하는 단위.
 */
export interface DailyTriggerHabitCheckInItem {
  /** 연결된 TriggerHabit ID */
  habitId: FirestoreDocId;
  /** 습관명 */
  habitName: string;
  /** 트리거 조건 유형 */
  conditionType: TriggerConditionType;
  /** 트리거 조건 레이블 (UI 표시용, 예: '점심 후') */
  conditionLabel: string;
  /** 오늘이 activeDays에 포함되어 있는지 여부 */
  isActiveToday: boolean;
  /** 오늘 트리거 조건 발생 여부 */
  triggerOccurred: boolean;
  /** 오늘 달성 여부 */
  isCompleted: boolean;
  /** 현재 스트릭 (오늘 기준) */
  currentStreak: number;
  /** 연결된 TriggerHabitLog ID (오늘 로그가 있을 때만) */
  logId?: FirestoreDocId;
}

/**
 * 일간 체크인 전체 상태 (Daily Check-in)
 * 특정 날짜의 루틴 진행 + 트리거 습관 달성 여부를 한 번에 집계.
 *
 * EDGE CASE:
 *   - routineItems가 비어 있는 경우: 해당 날짜에 배분된 루틴이 없음.
 *   - triggerHabitItems가 비어 있는 경우: 트리거 습관이 아직 설정되지 않음.
 *   - overallCompletionRate = null: 체크인 항목이 하나도 없는 경우.
 *   - 동일 날짜의 DailyCheckIn이 이미 존재할 때 upsert 처리 (중복 방지).
 */
export interface DailyCheckIn {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 체크인 날짜 (ISO 8601, YYYY-MM-DD) */
  date: ISODateString;
  /** 해당 날짜의 요일 */
  dayOfWeek: DayOfWeek;
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 주 시작일로부터 경과 일수 (1~7) */
  elapsedDays: number;
  /** 루틴별 체크인 항목 목록 */
  routineItems: RoutineDailyCheckInItem[];
  /** 트리거 습관별 체크인 항목 목록 */
  triggerHabitItems: DailyTriggerHabitCheckInItem[];
  /**
   * 오늘의 전체 루틴 완료율 (%)
   * @formula overallCompletionRate = (완료된 routineItems 수 / 오늘 스케줄된 routineItems 수) × 100
   * @note null: 오늘 스케줄된 루틴이 없는 경우
   */
  overallCompletionRate: Percentage | null;
  /**
   * 오늘의 트리거 습관 달성률 (%)
   * @formula triggerHabitCompletionRate = (isCompleted = true인 항목 수 / isActiveToday = true인 항목 수) × 100
   * @note null: 오늘 활성화된 트리거 습관이 없는 경우
   */
  triggerHabitCompletionRate: Percentage | null;
  /**
   * 체크인 제출 여부
   * false: 아직 오늘 체크인을 완료하지 않은 상태 (데이터는 있으나 미제출)
   * true: 사용자가 오늘 체크인을 명시적으로 완료한 상태
   */
  isSubmitted: boolean;
  /** 체크인 제출 일시 (isSubmitted = true일 때 설정) */
  submittedAt?: ISODateString;
  /** 오늘의 한 줄 메모 (선택) */
  note?: string;
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 */
  updatedAt: ISODateString;
}

// =============================================================================
// SECTION 8: Module 8 — Weekly Review (주간 리뷰)
// =============================================================================

/**
 * 주간 리뷰 루틴 KPI 항목 (Weekly Review Routine KPI Item)
 * WeeklyInsightSummary의 RoutineWeeklyKPI에 추가 컨텍스트를 붙인 리뷰 전용 타입.
 * WeeklyInsightSummary는 AI 분석/제안 중심이고,
 * WeeklyReview는 사용자 회고 + 공유 중심으로 역할이 분리됨.
 */
export interface WeeklyReviewRoutineItem {
  /** 루틴 ID */
  routineId: FirestoreDocId;
  /** 루틴명 */
  routineName: string;
  /** 루틴 유형 */
  routineType: RoutineType;
  /**
   * 주간 KPI 달성률 (%)
   * @formula kpi = (sumTActual / sumTGoal) × 100  [TIME_BASED]
   * @formula kpi = (completedCount / targetFrequencyPerWeek) × 100  [ACTION_BASED]
   * @note null: 목표값이 0이어서 계산 불가
   */
  kpi: Percentage | null;
  /** 주간 실제 수행 시간 (Hours) — TIME_BASED 전용 */
  sumTActual?: Hours;
  /** 주간 목표 시간 (Hours) — TIME_BASED 전용 */
  sumTGoal?: Hours;
  /** 주간 완료 횟수 — ACTION_BASED 전용 */
  completedCount?: number;
  /** 주간 목표 횟수 — ACTION_BASED 전용 */
  targetFrequencyPerWeek?: number;
  /**
   * 목표 달성 여부
   * @formula isGoalMet = kpi !== null && kpi >= 100
   */
  isGoalMet: boolean;
  /** 해당 루틴에 대한 사용자 회고 텍스트 (선택) */
  userReflection?: string;
}

/**
 * 주간 트리거 습관 리뷰 항목 (Weekly Trigger Habit Review Item)
 */
export interface WeeklyTriggerHabitReviewItem {
  /** TriggerHabit ID */
  habitId: FirestoreDocId;
  /** 습관명 */
  habitName: string;
  /** 트리거 조건 유형 */
  conditionType: TriggerConditionType;
  /**
   * 이번 주 달성 횟수
   * @formula weeklyCompleted = 해당 주 TriggerHabitLog 중 isCompleted = true 개수
   */
  weeklyCompleted: number;
  /**
   * 이번 주 activeDays 기준 목표 횟수
   * @formula weeklyTarget = activeDays 중 이번 주에 포함된 날 수
   */
  weeklyTarget: number;
  /**
   * 이번 주 달성률 (%)
   * @formula weeklyCompletionRate = (weeklyCompleted / weeklyTarget) × 100
   * @note null: weeklyTarget = 0인 경우
   */
  weeklyCompletionRate: Percentage | null;
  /** 이번 주 말 기준 스트릭 */
  streakAtWeekEnd: StreakRecord;
  /** 해당 습관에 대한 사용자 회고 텍스트 (선택) */
  userReflection?: string;
}

/**
 * 주간 리뷰 (Weekly Review)
 * 사용자 회고 텍스트 + 공유 플래그가 포함된 주간 최종 리뷰.
 *
 * WeeklyInsightSummary와의 차이점:
 *   - WeeklyInsightSummary: AI가 자동 생성한 분석/제안 중심 (읽기 전용에 가까움)
 *   - WeeklyReview: 사용자가 직접 작성하는 회고 + 외부 공유 제어 포함
 *
 * @formula overallKPI = (Σ T_actual_all / Σ T_goal_all) × 100
 *
 * EDGE CASE:
 *   - overallKPI = null: 전체 목표 시간이 0인 경우.
 *   - isShared = true인 상태에서 reviewText 수정 시:
 *     → 공유된 버전과 현재 버전이 다를 수 있음. lastSharedAt으로 공유 시점 추적.
 *   - reviewItems가 비어 있는 경우: 해당 주에 루틴이 없었던 상태.
 */
export interface WeeklyReview {
  /** Firestore 문서 ID */
  id: FirestoreDocId;
  /** 주간 기준 ID (예: '2026-W13') */
  weekId: string;
  /** 주 시작일 (ISO 8601) */
  weekStartDate: ISODateString;
  /** 주 종료일 (ISO 8601) */
  weekEndDate: ISODateString;
  /** 연결된 WeeklyInsightSummary ID (AI 분석과 연결) */
  insightSummaryId?: FirestoreDocId;
  /** 루틴별 KPI 리뷰 항목 목록 */
  reviewItems: WeeklyReviewRoutineItem[];
  /** 트리거 습관 리뷰 항목 목록 */
  triggerHabitReviewItems: WeeklyTriggerHabitReviewItem[];
  /**
   * 전체 KPI (%)
   * @formula overallKPI = (Σ sumTActual / Σ sumTGoal) × 100
   * @note null: 전체 목표 시간이 0인 경우 (계산 불가)
   */
  overallKPI: Percentage | null;
  /**
   * 총 실제 수행 시간 합계 (Hours)
   * @formula totalTActual = Σ reviewItems[i].sumTActual
   */
  totalTActual: Hours;
  /**
   * 총 목표 시간 합계 (Hours)
   * @formula totalTGoal = Σ reviewItems[i].sumTGoal
   */
  totalTGoal: Hours;
  /**
   * 사용자 작성 전체 회고 텍스트
   * @note 자유 형식. UI에서 마크다운 또는 일반 텍스트로 작성
   */
  reviewText: string;
  /**
   * 다음 주 다짐 / 목표 텍스트 (선택)
   */
  nextWeekGoal?: string;
  /**
   * 외부 공유 여부 플래그
   * true: 공유 링크 생성 또는 SNS 공유 허용 상태
   * false: 비공개 (기본값)
   * @default false
   */
  isShared: boolean;
  /**
   * 마지막 공유 일시 (ISO 8601)
   * @note null: 아직 공유된 적 없거나 isShared = false인 경우
   */
  lastSharedAt: ISODateString | null;
  /**
   * 공유 URL 슬러그 또는 토큰 (isShared = true일 때 생성)
   * @example 'review-2026-W13-abc123'
   */
  shareToken?: string;
  /** 리뷰 작성 완료 여부 (저장만 했는지 vs 최종 완료했는지) */
  isFinalized: boolean;
  /** Firestore 생성 타임스탬프 */
  createdAt: ISODateString;
  /** Firestore 수정 타임스탬프 */
  updatedAt: ISODateString;
}

// =============================================================================
// SECTION 9: Firestore 컬렉션 경로 상수 (Firestore Collection Paths)
// =============================================================================

/**
 * Firestore 컬렉션 경로 상수
 * 실제 Firestore 연동 시 컬렉션명 오타 방지용.
 *
 * @example
 * // 사용 예시
 * firestore.collection(FIRESTORE_COLLECTIONS.ROUTINE_DEFINITIONS)
 */
export const FIRESTORE_COLLECTIONS = {
  /** 루틴 정의 컬렉션 */
  ROUTINE_DEFINITIONS: 'routineDefinitions',
  /** 주간 루틴 플랜 컬렉션 */
  WEEKLY_ROUTINE_PLANS: 'weeklyRoutinePlans',
  /** 주간 요일별 분배 계획 컬렉션 */
  WEEKLY_SCHEDULE_DISTRIBUTIONS: 'weeklyScheduleDistributions',
  /** 루틴 로그 컬렉션 */
  ROUTINE_LOGS: 'routineLogs',
  /** 트리거 습관 정의 컬렉션 */
  TRIGGER_HABITS: 'triggerHabits',
  /** 트리거 습관 로그 컬렉션 */
  TRIGGER_HABIT_LOGS: 'triggerHabitLogs',
  /** 일간 체크인 컬렉션 */
  DAILY_CHECK_INS: 'dailyCheckIns',
  /** 주간 인사이트 컬렉션 (AI 분석) */
  WEEKLY_INSIGHTS: 'weeklyInsights',
  /** 주간 리뷰 컬렉션 (사용자 회고) */
  WEEKLY_REVIEWS: 'weeklyReviews',
} as const;

export type FirestoreCollectionKey = keyof typeof FIRESTORE_COLLECTIONS;
