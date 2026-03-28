import { create } from 'zustand'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const

function emptyWeek(): Record<string, number> {
  return Object.fromEntries(DAYS.map((d) => [d, 0]))
}

interface ScheduleStoreState {
  // routineId → { MON: 1, TUE: 0, ... }
  distributions: Record<string, Record<string, number>>
}

interface ScheduleStoreActions {
  setDayHours: (routineId: string, day: string, hours: number) => void
  autoDistribute: (routineId: string, goalHours: number) => void
  resetRoutine: (routineId: string) => void
}

export const useScheduleStore = create<ScheduleStoreState & ScheduleStoreActions>((set, get) => ({
  distributions: {},

  setDayHours: (routineId, day, hours) => {
    const { distributions } = get()
    const current = distributions[routineId] ?? emptyWeek()
    set({
      distributions: {
        ...distributions,
        [routineId]: { ...current, [day]: hours },
      },
    })
  },

  autoDistribute: (routineId, goalHours) => {
    const { distributions } = get()
    const perDay = goalHours / 7
    const week: Record<string, number> = {}
    DAYS.forEach((d) => {
      week[d] = Math.round(perDay * 10) / 10
    })
    set({
      distributions: { ...distributions, [routineId]: week },
    })
  },

  resetRoutine: (routineId) => {
    const { distributions } = get()
    const updated = { ...distributions }
    delete updated[routineId]
    set({ distributions: updated })
  },
}))

// 파생 selectors
export const useGetTotalDistributed = (routineId: string): number =>
  useScheduleStore((state) => {
    const week = state.distributions[routineId]
    if (!week) return 0
    return Object.values(week).reduce((sum, h) => sum + h, 0)
  })

export const useGetDayTotal = (day: string): number =>
  useScheduleStore((state) =>
    Object.values(state.distributions).reduce((sum, week) => sum + (week[day] ?? 0), 0),
  )
