import { Plus } from 'lucide-react'
import type { RoutineDefinition } from '../../../types/engine'

interface RoutineProgressCardProps {
  routine: RoutineDefinition
  color: string
  scheduledHours: number
  actualHours: number
  goalToDate: number
  weeklyActual: number
  onAddLog: (id: string) => void
}

export function RoutineProgressCard({
  routine,
  color,
  scheduledHours,
  actualHours,
  goalToDate,
  weeklyActual,
  onAddLog,
}: RoutineProgressCardProps) {
  const delta = weeklyActual - goalToDate
  const isDeltaPositive = delta >= 0

  const progressPercent =
    scheduledHours > 0 ? Math.min((actualHours / scheduledHours) * 100, 100) : 0

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        {/* Left: name + stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <p className="text-sm font-bold text-[var(--text-h)] truncate">{routine.name}</p>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text)]">
            <span>오늘 {actualHours.toFixed(1)}h / {scheduledHours.toFixed(1)}h</span>
            <span className="text-[var(--border)]">|</span>
            <span
              className={isDeltaPositive ? 'text-blue-500' : 'text-red-500'}
            >
              주간 {isDeltaPositive ? '+' : ''}{delta.toFixed(1)}h
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: color }}
            />
          </div>
        </div>

        {/* Right: Add log button */}
        <button
          onClick={() => onAddLog(routine.id)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 text-xs font-medium text-[var(--accent)] active:scale-95 transition-transform flex-shrink-0"
          aria-label={`${routine.name} 기록 추가`}
        >
          <Plus size={14} />
          기록
        </button>
      </div>
    </div>
  )
}
