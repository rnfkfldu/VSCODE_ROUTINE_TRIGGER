import { create } from 'zustand'
import type { RoutineDefinition, RoutineType, RoutineTrigger } from '../types/engine'
import { TriggerTimingType } from '../types/engine'

// 루틴 고유 색상 팔레트 (순서대로 자동 배정)
const ROUTINE_COLORS = [
  '#a855f7',
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
]

const now = () => new Date().toISOString()

const DEFAULT_ROUTINES: RoutineDefinition[] = [
  {
    id: 'routine-exercise',
    name: '운동',
    type: 'TIME_BASED',
    weight: 20,
    trigger: {
      timingType: TriggerTimingType.AFTER_ACTION,
      afterAction: '점심 식사',
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'routine-reading',
    name: '독서',
    type: 'TIME_BASED',
    weight: 10,
    trigger: {
      timingType: TriggerTimingType.SPECIFIC_TIME,
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'routine-coding',
    name: '코딩 공부',
    type: 'TIME_BASED',
    weight: 15,
    trigger: {
      timingType: TriggerTimingType.SPECIFIC_TIME,
    },
    createdAt: now(),
    updatedAt: now(),
  },
]

interface RoutineStoreState {
  routines: RoutineDefinition[]
}

interface RoutineStoreActions {
  addRoutine: (name: string, type: RoutineType) => void
  updateRoutineWeight: (id: string, weight: number) => void
  updateRoutineFrequency: (id: string, freq: number) => void
  updateRoutineTrigger: (id: string, trigger: RoutineTrigger) => void
  removeRoutine: (id: string) => void
  reorderRoutines: (from: number, to: number) => void
}

export const useRoutineStore = create<RoutineStoreState & RoutineStoreActions>((set, get) => ({
  routines: DEFAULT_ROUTINES,

  addRoutine: (name, type) => {
    const newRoutine: RoutineDefinition = {
      id: `routine-${Date.now()}`,
      name,
      type,
      weight: 10,
      trigger: { timingType: TriggerTimingType.SPECIFIC_TIME },
      createdAt: now(),
      updatedAt: now(),
    }
    set((state) => ({ routines: [...state.routines, newRoutine] }))
  },

  updateRoutineWeight: (id, weight) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, weight, updatedAt: now() } : r,
      ),
    }))
  },

  updateRoutineFrequency: (id, freq) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, targetFrequencyPerWeek: freq, updatedAt: now() } : r,
      ),
    }))
  },

  updateRoutineTrigger: (id, trigger) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, trigger, updatedAt: now() } : r,
      ),
    }))
  },

  removeRoutine: (id) => {
    set((state) => ({ routines: state.routines.filter((r) => r.id !== id) }))
  },

  reorderRoutines: (from, to) => {
    const { routines } = get()
    const updated = [...routines]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    set({ routines: updated })
  },
}))

// 파생 selectors
export const useTotalWeight = () =>
  useRoutineStore((state) => state.routines.reduce((sum, r) => sum + r.weight, 0))

export const useIsTotalWeightExceeded = () =>
  useRoutineStore((state) => state.routines.reduce((sum, r) => sum + r.weight, 0) > 100)

// 루틴 색상 반환 훅
export function useRoutineColor(id: string): string {
  return useRoutineStore((state) => {
    const index = state.routines.findIndex((r) => r.id === id)
    if (index === -1) return ROUTINE_COLORS[0]
    return ROUTINE_COLORS[index % ROUTINE_COLORS.length]
  })
}
