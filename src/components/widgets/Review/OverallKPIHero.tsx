import { KpiRing } from '../../common/KpiRing'

interface OverallKPIHeroProps {
  kpi: number | null
  totalActual: number
  totalGoal: number
  weekId: string
}

export function OverallKPIHero({ kpi, totalActual, totalGoal, weekId }: OverallKPIHeroProps) {
  const displayKpi = kpi ?? 0
  const isOverAchieved = kpi !== null && kpi >= 100

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6">
      <p className="text-xs text-[var(--text)]">{weekId} 주간 KPI</p>

      <div className="relative">
        <KpiRing value={displayKpi} size={160} strokeWidth={16} showLabel={kpi !== null} />
        {kpi === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--text)]">N/A</span>
          </div>
        )}
      </div>

      {isOverAchieved && (
        <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500 border border-green-500/20">
          목표 초과 달성!
        </div>
      )}

      <div className="flex gap-6 text-center">
        <div>
          <p className="text-xl font-bold text-[var(--text-h)]">{totalActual.toFixed(1)}h</p>
          <p className="text-xs text-[var(--text)]">실제 수행</p>
        </div>
        <div className="w-px bg-[var(--border)]" />
        <div>
          <p className="text-xl font-bold text-[var(--text-h)]">{totalGoal.toFixed(1)}h</p>
          <p className="text-xs text-[var(--text)]">목표 시간</p>
        </div>
      </div>
    </div>
  )
}
