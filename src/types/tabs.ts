export const TAB_KEYS = ['setup', 'lab', 'schedule', 'daily', 'review'] as const
export type TabKey = (typeof TAB_KEYS)[number]
