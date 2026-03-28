import { Shuffle } from 'lucide-react'

interface DayDistributorProps {
  routineId: string
  color: string
  goalHours: number
  distribution: Record<string, number>
  onDayChange: (day: string, hours: number) => void
  onAutoDistribute: () => void
}

const DAYS = [
  { key: 'MON', label: '월' },
  { key: 'TUE', label: '화' },
  { key: 'WED', label: '수' },
  { key: 'THU', label: '목' },
  { key: 'FRI', label: '금' },
  { key: 'SAT', label: '토' },
  { key: 'SUN', label: '일' },
] as const

const MAX_BAR_HEIGHT = 96 // px

export function DayDistributor({
  color,
  goalHours,
  distribution,
  onDayChange,
  onAutoDistribute,
}: DayDistributorProps) {
  const totalDistributed = Object.values(distribution).reduce((s, h) => s + h, 0)
  const progressPct = goalHours > 0 ? Math.min((totalDistributed / goalHours) * 100, 100) : 0
  const isComplete = totalDistributed >= goalHours && goalHours > 0

  const handleDayTap = (dayKey: string) => {
    const current = distribution[dayKey] ?? 0
    // 순환: 0 → 0.5 → 1.0 → ... → goalHours → 0
    const maxVal = goalHours > 0 ? Math.ceil(goalHours * 2) / 2 : 4
    const step = 0.5
    const next = current + step > maxVal ? 0 : Math.round((current + step) * 10) / 10
    onDayChange(dayKey, next)
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--code-bg)] p-4 space-y-4">
      {/* 바 그래프 */}
      <div className="flex items-end justify-between gap-1">
        {DAYS.map(({ key, label }) => {
          const hours = distribution[key] ?? 0
          const barH = goalHours > 0 ? Math.round((hours / goalHours) * MAX_BAR_HEIGHT) : (hours > 0 ? MAX_BAR_HEIGHT / 2 : 0)

          return (
            <button
              key={key}
              onClick={() => handleDayTap(key)}
              className="flex min-h-[44px] flex-1 flex-col items-center gap-1 pt-2"
              aria-label={`${label}요일 ${hours}시간`}
            >
              {/* 시간 표시 */}
              <span className="text-xs font-medium text-[var(--text-h)]">
                {hours > 0 ? hours : ''}
              </span>
              {/* 막대 컨테이너 */}
              <div
                className="relative w-full rounded-t-md overflow-hidden"
                style={{ height: `${MAX_BAR_HEIGHT}px` }}
              >
                {/* 배경 트랙 */}
                <div className="absolute inset-0 rounded-t-md bg-[var(--border)] opacity-30" />
                {/* 실제 막대 */}
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-300"
                  style={{
                    height: `${barH}px`,
                    backgroundColor: color,
                    opacity: hours > 0 ? 1 : 0,
                  }}
                />
              </div>
              {/* 요일 라벨 */}
              <span className="text-xs text-[var(--text)]">{label}</span>
            </button>
          )
        })}
      </div>

      {/* 배분 합계 진행 바 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text)]">
            배분: {totalDistributed.toFixed(1)}h / 목표: {goalHours.toFixed(1)}h
          </span>
          <span
            className={`font-medium ${isComplete ? 'text-green-500' : 'text-[var(--text)]'}`}
          >
            {progressPct.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, backgroundColor: isComplete ? '#22c55e' : color }}
          />
        </div>
      </div>

      {/* 균등 배분 버튼 */}
      <button
        onClick={onAutoDistribute}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="균등 배분"
      >
        <Shuffle size={16} />
        균등 배분
      </button>
    </div>
  )
}
