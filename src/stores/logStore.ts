import { create } from 'zustand'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function weekStartDate(weekId: string): Date {
  // weekId: 'YYYY-Www'
  const [yearStr, weekStr] = weekId.split('-W')
  const year = parseInt(yearStr, 10)
  const week = parseInt(weekStr, 10)
  const jan1 = new Date(year, 0, 1)
  const dayOfWeek = jan1.getDay() || 7
  const firstMonday = new Date(jan1)
  firstMonday.setDate(jan1.getDate() + (dayOfWeek <= 4 ? 2 - dayOfWeek : 9 - dayOfWeek))
  firstMonday.setDate(firstMonday.getDate() + (week - 1) * 7)
  return firstMonday
}

type DailyLog = {
  routineHours: Record<string, number>
  triggerCompleted: Record<string, boolean>
}

interface LogStoreState {
  dailyLogs: Record<string, DailyLog>
}

interface LogStoreActions {
  addRoutineHours: (routineId: string, hours: number, date?: string) => void
  toggleTrigger: (habitId: string, date?: string) => void
  getRoutineHoursForDate: (routineId: string, date: string) => number
  getTriggerCompletedForDate: (habitId: string, date: string) => boolean
  getWeeklyRoutineHours: (routineId: string, weekId: string) => number
}

export const useLogStore = create<LogStoreState & LogStoreActions>((set, get) => ({
  dailyLogs: {},

  addRoutineHours: (routineId, hours, date) => {
    const key = date ?? todayKey()
    const { dailyLogs } = get()
    const day = dailyLogs[key] ?? { routineHours: {}, triggerCompleted: {} }
    const prev = day.routineHours[routineId] ?? 0
    set({
      dailyLogs: {
        ...dailyLogs,
        [key]: {
          ...day,
          routineHours: { ...day.routineHours, [routineId]: prev + hours },
        },
      },
    })
  },

  toggleTrigger: (habitId, date) => {
    const key = date ?? todayKey()
    const { dailyLogs } = get()
    const day = dailyLogs[key] ?? { routineHours: {}, triggerCompleted: {} }
    const prev = day.triggerCompleted[habitId] ?? false
    set({
      dailyLogs: {
        ...dailyLogs,
        [key]: {
          ...day,
          triggerCompleted: { ...day.triggerCompleted, [habitId]: !prev },
        },
      },
    })
  },

  getRoutineHoursForDate: (routineId, date) => {
    const { dailyLogs } = get()
    return dailyLogs[date]?.routineHours[routineId] ?? 0
  },

  getTriggerCompletedForDate: (habitId, date) => {
    const { dailyLogs } = get()
    return dailyLogs[date]?.triggerCompleted[habitId] ?? false
  },

  getWeeklyRoutineHours: (routineId, weekId) => {
    const { dailyLogs } = get()
    const start = weekStartDate(weekId)
    let total = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      total += dailyLogs[key]?.routineHours[routineId] ?? 0
    }
    return total
  },
}))
