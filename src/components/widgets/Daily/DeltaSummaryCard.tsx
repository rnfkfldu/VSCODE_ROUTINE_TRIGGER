import { KpiRing } from '../../common/KpiRing'

interface DeltaSummaryCardProps {
  totalActual: number
  totalGoalToDate: number
  triggerCompleted: number
  triggerTotal: number
}

export function DeltaSummaryCard({
  totalActual,
  totalGoalToDate,
  triggerCompleted,
  triggerTotal,
}: DeltaSummaryCardProps) {
  const delta = totalActual - totalGoalToDate
  const isDeltaPositive = delta >= 0
  const kpi = totalGoalToDate > 0 ? (totalActual / totalGoalToDate) * 100 : 0

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="flex items-center gap-4">
        {/* Left: Delta + KpiRing */}
        <div className="flex flex-col items-center gap-1">
          <KpiRing value={kpi} size={80} strokeWidth={8} showLabel={true} />
          <span
            className={`text-sm font-bold ${isDeltaPositive ? 'text-blue-500' : 'text-red-500'}`}
          >
            {isDeltaPositive ? '+' : ''}
            {delta.toFixed(1)}h
          </span>
          <span className="text-xs text-[var(--text)]">
            {isDeltaPositive ? '앞서가는 중' : '뒤처지는 중'}
          </span>
        </div>

        {/* Right: stats */}
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <p className="text-xs text-[var(--text)]">이번 주 누적</p>
            <p className="text-base font-semibold text-[var(--text-h)]">
              {totalActual.toFixed(1)}h{' '}
              <span className="text-xs font-normal text-[var(--text)]">
                / 목표 {totalGoalToDate.toFixed(1)}h
              </span>
            </p>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div>
            <p className="text-xs text-[var(--text)]">트리거 달성</p>
            <p className="text-base font-semibold text-[var(--text-h)]">
              {triggerCompleted}
              <span className="text-xs font-normal text-[var(--text)]">
                /{triggerTotal} 달성
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
