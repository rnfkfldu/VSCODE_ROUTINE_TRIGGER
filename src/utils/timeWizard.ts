/**
 * timeWizard.ts — Time Wizard 계산 로직 (순수 함수 전용)
 *
 * Developer 규칙: 모든 계산 로직은 컴포넌트가 아닌 utils/에 격리한다.
 * 이 파일의 모든 함수는 부작용 없는 순수 함수(pure function)로 구현한다.
 */

import type { FixedTimeBlock, SpecialEventBlock, WeeklyAvailableTime } from '../types/engine'

/** @formula 1주 = 168시간 (7일 × 24시간) */
export const TOTAL_WEEK_HOURS = 168

// =============================================================================
// 핵심 계산 함수
// =============================================================================

/**
 * 고정 시간 합산
 * @formula T_fixed = Σ fixedBlocks[i].hoursPerWeek
 */
export function calcTFixed(blocks: FixedTimeBlock[]): number {
  return blocks.reduce((sum, b) => sum + b.hoursPerWeek, 0)
}

/**
 * 특이사항 시간 합산
 * @formula T_special = Σ specialBlocks[i].hours
 */
export function calcTSpecial(blocks: SpecialEventBlock[]): number {
  return blocks.reduce((sum, b) => sum + b.hours, 0)
}

/**
 * 가용 시간 계산
 * @formula T_available = 168 - (T_fixed + T_special)
 * @note 음수 허용 — isOverAllocated 플래그로 UI에서 경고 표시
 */
export function calcTAvailable(tFixed: number, tSpecial: number): number {
  return TOTAL_WEEK_HOURS - tFixed - tSpecial
}

/**
 * 초과 배분 여부 판단
 * @edge_case T_fixed + T_special > 168 → true
 */
export function checkOverAllocated(tFixed: number, tSpecial: number): boolean {
  return tFixed + tSpecial > TOTAL_WEEK_HOURS
}

/**
 * WeeklyAvailableTime 전체 객체를 한 번에 계산
 * store action에서 호출하는 단일 진입점.
 */
export function buildWeeklyAvailableTime(
  weekId: string,
  fixedBlocks: FixedTimeBlock[],
  specialBlocks: SpecialEventBlock[],
): WeeklyAvailableTime {
  const tFixed = calcTFixed(fixedBlocks)
  const tSpecial = calcTSpecial(specialBlocks)
  const tAvailable = calcTAvailable(tFixed, tSpecial)
  const isOverAllocated = checkOverAllocated(tFixed, tSpecial)

  return {
    weekId,
    fixedBlocks,
    specialBlocks,
    tFixed,
    tSpecial,
    tAvailable,
    isOverAllocated,
  }
}

// =============================================================================
// UI 상태 계산 함수
// =============================================================================

/**
 * 가용 시간에 따른 UI 색상 상태
 * - success  (> 20h) : 여유 있음 → green
 * - progress (> 5h)  : 보통      → blue
 * - warning  (> 0h)  : 빠듯함    → yellow
 * - danger   (≤ 0h)  : 초과 배분 → red
 */
export const AvailabilityStatus = {
  SUCCESS: 'success',
  PROGRESS: 'progress',
  WARNING: 'warning',
  DANGER: 'danger',
} as const
export type AvailabilityStatus = (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus]

export function getAvailabilityStatus(tAvailable: number): AvailabilityStatus {
  if (tAvailable > 20) return AvailabilityStatus.SUCCESS
  if (tAvailable > 5) return AvailabilityStatus.PROGRESS
  if (tAvailable > 0) return AvailabilityStatus.WARNING
  return AvailabilityStatus.DANGER
}

/**
 * 168h 바에서 특정 시간이 차지하는 퍼센트 계산
 * @returns 0~100 범위 (100 초과 클램핑)
 */
export function calcBarPercentage(hours: number): number {
  return Math.min((hours / TOTAL_WEEK_HOURS) * 100, 100)
}
