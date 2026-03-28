import { create } from 'zustand'
import type { FixedTimeBlock, SpecialEventBlock, WeeklyAvailableTime } from '../types/engine'
import { buildWeeklyAvailableTime } from '../utils/timeWizard'

// =============================================================================
// 기본값 상수 (컴포넌트 외부에서 관리)
// =============================================================================

const DEFAULT_FIXED_BLOCKS: FixedTimeBlock[] = [
  { id: 'sleep',   label: '수면',   hoursPerWeek: 49 },    // 7h × 7일
  { id: 'meal',    label: '식사',   hoursPerWeek: 10.5 },  // 1.5h × 7일
  { id: 'work',    label: '업무',   hoursPerWeek: 40 },    // 8h × 5일
  { id: 'commute', label: '출퇴근', hoursPerWeek: 5 },     // 1h × 5일
]

function getCurrentWeekId(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNum = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
  )
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

// =============================================================================
// Store 타입 정의
// =============================================================================

interface TimeWizardState {
  weekId: string
  fixedBlocks: FixedTimeBlock[]
  specialBlocks: SpecialEventBlock[]
  /** utils/timeWizard.ts로 계산된 파생 값 — 컴포넌트에서 직접 읽기 전용 */
  computed: WeeklyAvailableTime
}

interface TimeWizardActions {
  updateFixedBlock: (id: string, hoursPerWeek: number) => void
  addSpecialBlock: (block: Omit<SpecialEventBlock, 'id'>) => void
  removeSpecialBlock: (id: string) => void
  updateSpecialBlock: (id: string, hours: number) => void
  resetToDefault: () => void
}

export type TimeWizardStore = TimeWizardState & TimeWizardActions

// =============================================================================
// 초기 상태 계산
// =============================================================================

const initialWeekId = getCurrentWeekId()
const initialComputed = buildWeeklyAvailableTime(initialWeekId, DEFAULT_FIXED_BLOCKS, [])

// =============================================================================
// Zustand Store 생성
// =============================================================================

export const useTimeWizardStore = create<TimeWizardStore>((set, get) => ({
  // --- State ---
  weekId: initialWeekId,
  fixedBlocks: DEFAULT_FIXED_BLOCKS,
  specialBlocks: [],
  computed: initialComputed,

  // --- Actions ---

  updateFixedBlock: (id, hoursPerWeek) => {
    const { weekId, fixedBlocks, specialBlocks } = get()
    const updated = fixedBlocks.map((b) =>
      b.id === id ? { ...b, hoursPerWeek } : b,
    )
    set({
      fixedBlocks: updated,
      computed: buildWeeklyAvailableTime(weekId, updated, specialBlocks),
    })
  },

  addSpecialBlock: (block) => {
    const { weekId, fixedBlocks, specialBlocks } = get()
    const newBlock: SpecialEventBlock = {
      ...block,
      id: `special-${Date.now()}`,
    }
    const updated = [...specialBlocks, newBlock]
    set({
      specialBlocks: updated,
      computed: buildWeeklyAvailableTime(weekId, fixedBlocks, updated),
    })
  },

  removeSpecialBlock: (id) => {
    const { weekId, fixedBlocks, specialBlocks } = get()
    const updated = specialBlocks.filter((b) => b.id !== id)
    set({
      specialBlocks: updated,
      computed: buildWeeklyAvailableTime(weekId, fixedBlocks, updated),
    })
  },

  updateSpecialBlock: (id, hours) => {
    const { weekId, fixedBlocks, specialBlocks } = get()
    const updated = specialBlocks.map((b) => (b.id === id ? { ...b, hours } : b))
    set({
      specialBlocks: updated,
      computed: buildWeeklyAvailableTime(weekId, fixedBlocks, updated),
    })
  },

  resetToDefault: () => {
    set({
      fixedBlocks: DEFAULT_FIXED_BLOCKS,
      specialBlocks: [],
      computed: buildWeeklyAvailableTime(initialWeekId, DEFAULT_FIXED_BLOCKS, []),
    })
  },
}))
