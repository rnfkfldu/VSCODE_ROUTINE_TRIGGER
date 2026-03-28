import { create } from 'zustand'
import type { TriggerHabit, TriggerConditionType } from '../types/engine'

const now = () => new Date().toISOString()

const DEFAULT_HABITS: TriggerHabit[] = [
  {
    id: 'habit-lunch-gym',
    name: '점심 헬스',
    conditionType: 'AFTER_MEAL',
    actionDescription: '점심 식사 후 헬스장 가기',
    activeDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    skipOnMissingTrigger: false,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      currentStreakStartDate: null,
      longestStreakStartDate: null,
    },
    weeklyCompletedCount: 0,
    weeklyTriggerCount: 0,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'habit-parking',
    name: '퇴근 주차',
    conditionType: 'AFTER_WORK',
    actionDescription: '차를 멀리 대고 걸어오기',
    activeDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    skipOnMissingTrigger: false,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      currentStreakStartDate: null,
      longestStreakStartDate: null,
    },
    weeklyCompletedCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'habit-study-after-kids',
    name: '아이 재운 후 공부',
    conditionType: 'AFTER_FAMILY_SETTLED',
    actionDescription: '아이 재운 직후 바로 책상 앞에 앉기',
    activeDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    skipOnMissingTrigger: true,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      currentStreakStartDate: null,
      longestStreakStartDate: null,
    },
    weeklyCompletedCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
]

interface TriggerStoreState {
  habits: TriggerHabit[]
}

interface TriggerStoreActions {
  addHabit: (name: string, conditionType: TriggerConditionType, description: string) => void
  removeHabit: (id: string) => void
  updateHabit: (id: string, updates: Partial<TriggerHabit>) => void
}

export const useTriggerStore = create<TriggerStoreState & TriggerStoreActions>((set) => ({
  habits: DEFAULT_HABITS,

  addHabit: (name, conditionType, description) => {
    const newHabit: TriggerHabit = {
      id: `habit-${Date.now()}`,
      name,
      conditionType,
      actionDescription: description,
      activeDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      skipOnMissingTrigger: false,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        currentStreakStartDate: null,
        longestStreakStartDate: null,
      },
      weeklyCompletedCount: 0,
      createdAt: now(),
      updatedAt: now(),
    }
    set((state) => ({ habits: [...state.habits, newHabit] }))
  },

  removeHabit: (id) => {
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }))
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updates, updatedAt: now() } : h,
      ),
    }))
  },
}))
