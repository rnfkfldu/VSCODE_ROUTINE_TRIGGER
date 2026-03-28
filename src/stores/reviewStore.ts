import { create } from 'zustand'

type ReviewEntry = {
  text: string
  nextWeekGoal: string
  isShared: boolean
  isFinalized: boolean
}

interface ReviewStoreState {
  reviews: Record<string, ReviewEntry>
}

interface ReviewStoreActions {
  saveReview: (weekId: string, text: string, nextWeekGoal: string) => void
  finalizeReview: (weekId: string) => void
  toggleShare: (weekId: string) => void
}

export const useReviewStore = create<ReviewStoreState & ReviewStoreActions>((set, get) => ({
  reviews: {},

  saveReview: (weekId, text, nextWeekGoal) => {
    const { reviews } = get()
    const existing = reviews[weekId] ?? { isShared: false, isFinalized: false }
    set({
      reviews: {
        ...reviews,
        [weekId]: { ...existing, text, nextWeekGoal },
      },
    })
  },

  finalizeReview: (weekId) => {
    const { reviews } = get()
    const existing = reviews[weekId]
    if (!existing) return
    set({
      reviews: {
        ...reviews,
        [weekId]: { ...existing, isFinalized: true },
      },
    })
  },

  toggleShare: (weekId) => {
    const { reviews } = get()
    const existing = reviews[weekId]
    if (!existing) return
    set({
      reviews: {
        ...reviews,
        [weekId]: { ...existing, isShared: !existing.isShared },
      },
    })
  },
}))
