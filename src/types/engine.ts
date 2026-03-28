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
export enum TriggerTimingType {
  /** 특정 시각에 실행. 예: 오전 7:00 */
  SPECIFIC_TIME = 'SPECIFIC_TIME',
  /** 특정 행동 직후에 실행. 예: 기상 직후, 식사 직후 */
  AFTER_ACTION = 'AFTER_ACTION',
  /** 특정 장소에 도착 시 실행. 예: 집 도착 시 */
  LOCATION_BASED = 'LOCATION_BASED',
}

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
export enum LogEntryType {
  TIMER = 'TIMER',
  CHECKBOX = 'CHECKBOX',
}

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
// SECTION 5: Firestore 컬렉션 경로 상수 (Firestore Collection Paths)
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
  /** 루틴 로그 컬렉션 */
  ROUTINE_LOGS: 'routineLogs',
  /** 주간 인사이트 컬렉션 */
  WEEKLY_INSIGHTS: 'weeklyInsights',
} as const;

export type FirestoreCollectionKey = keyof typeof FIRESTORE_COLLECTIONS;
