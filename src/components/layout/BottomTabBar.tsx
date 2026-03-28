import { Clock, FlaskConical, CalendarDays, Zap, BarChart3 } from 'lucide-react'
import type { TabKey } from '../../types/tabs'
import type { LucideIcon } from 'lucide-react'

interface BottomTabBarProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
  pendingCount?: number
}

type TabConfig = {
  key: TabKey
  icon: LucideIcon
  label: string
}

const TABS: TabConfig[] = [
  { key: 'setup', icon: Clock, label: '설정' },
  { key: 'lab', icon: FlaskConical, label: '배정' },
  { key: 'schedule', icon: CalendarDays, label: '분배' },
  { key: 'daily', icon: Zap, label: '오늘' },
  { key: 'review', icon: BarChart3, label: '리뷰' },
]

export function BottomTabBar({ activeTab, onChange, pendingCount }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map(({ key, icon: Icon, label }) => {
          const isActive = activeTab === key
          const showBadge = key === 'daily' && pendingCount != null && pendingCount > 0
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`relative flex flex-1 min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
                    {pendingCount! > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
