interface RoutineKPIItem {
  routineId: string
  routineName: string
  color: string
  kpi: number | null
  actual: number
  goal: number
}

interface RoutineKPIListProps {
  items: RoutineKPIItem[]
}

function kpiColor(kpi: number | null): string {
  if (kpi === null) return 'text-[var(--text)]'
  if (kpi < 60) return 'text-red-500'
  if (kpi < 80) return 'text-yellow-500'
  return 'text-green-500'
}

function kpiBarColor(kpi: number | null): string {
  if (kpi === null) return 'bg-[var(--border)]'
  if (kpi < 60) return 'bg-red-500'
  if (kpi < 80) return 'bg-yellow-500'
  return 'bg-green-500'
}

export function RoutineKPIList({ items }: RoutineKPIListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <p className="text-center text-sm text-[var(--text)]">루틴 데이터가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--text-h)]">루틴별 달성률</h3>
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const progressPercent = item.kpi !== null ? Math.min(item.kpi, 100) : 0

          return (
            <div key={item.routineId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-[var(--text-h)]">
                    {item.routineName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text)]">
                    {item.actual.toFixed(1)}h / {item.goal.toFixed(1)}h
                  </span>
                  <span className={`text-sm font-bold ${kpiColor(item.kpi)}`}>
                    {item.kpi !== null ? `${Math.round(item.kpi)}%` : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${kpiBarColor(item.kpi)}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
