interface WeightDonutChartProps {
  routines: Array<{ id: string; name: string; weight: number; goalHours: number }>
  availableHours: number
  totalWeight: number
}

const CIRCUMFERENCE = 2 * Math.PI * 60 // ≈ 376.99

export function WeightDonutChart({ routines, availableHours, totalWeight }: WeightDonutChartProps) {
  const isExceeded = totalWeight > 100

  // 세그먼트 계산: 각 루틴의 arc 길이
  const segments: Array<{ offset: number; length: number; color: string }> = []
  let cumulativePercent = 0

  // 색상 팔레트 (routineStore와 동일 순서)
  const COLORS = [
    '#a855f7',
    '#3b82f6',
    '#22c55e',
    '#eab308',
    '#f97316',
    '#ec4899',
    '#14b8a6',
    '#f43f5e',
  ]

  routines.forEach((r, i) => {
    const pct = Math.min(r.weight, 100)
    const length = (pct / 100) * CIRCUMFERENCE
    const offset = CIRCUMFERENCE - (cumulativePercent / 100) * CIRCUMFERENCE
    segments.push({ offset, length, color: COLORS[i % COLORS.length] })
    cumulativePercent += pct
  })

  // 미배분 세그먼트
  const remaining = Math.max(0, 100 - totalWeight)
  const remainingLength = (remaining / 100) * CIRCUMFERENCE
  const remainingOffset = CIRCUMFERENCE - (Math.min(totalWeight, 100) / 100) * CIRCUMFERENCE

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--code-bg)] p-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* SVG 도넛 차트 */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* 배경 트랙 */}
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="var(--border)"
              strokeWidth="20"
            />
            {/* 미배분 세그먼트 */}
            {remaining > 0 && (
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="var(--border)"
                strokeWidth="20"
                strokeDasharray={`${remainingLength} ${CIRCUMFERENCE - remainingLength}`}
                strokeDashoffset={remainingOffset}
                transform="rotate(-90 80 80)"
                className="transition-all duration-500"
              />
            )}
            {/* 루틴 세그먼트들 */}
            {segments.map((seg, i) => (
              <circle
                key={routines[i].id}
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${seg.length} ${CIRCUMFERENCE - seg.length}`}
                strokeDashoffset={seg.offset}
                transform="rotate(-90 80 80)"
                className="transition-all duration-500"
              />
            ))}
          </svg>
          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-bold ${isExceeded ? 'text-red-500' : 'text-[var(--text-h)]'}`}
            >
              {totalWeight}%
            </span>
            <span className="text-xs text-[var(--text)]">배분</span>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex flex-1 flex-col gap-2">
          {routines.map((r, i) => {
            const color = COLORS[i % COLORS.length]
            const goalH = (availableHours * r.weight) / 100
            return (
              <div key={r.id} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="flex-1 truncate text-[var(--text-h)]">{r.name}</span>
                <span className="text-[var(--text)]">{r.weight}%</span>
                <span className="text-[var(--text)] opacity-70">{goalH.toFixed(1)}h</span>
              </div>
            )
          })}
          {remaining > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-[var(--border)]" />
              <span className="flex-1 text-[var(--text)]">미배분</span>
              <span className="text-[var(--text)]">{remaining}%</span>
              <span className="text-[var(--text)] opacity-70">
                {((availableHours * remaining) / 100).toFixed(1)}h
              </span>
            </div>
          )}
          {isExceeded && (
            <p className="mt-1 text-xs text-red-500">비중 합계가 100%를 초과했습니다</p>
          )}
        </div>
      </div>
    </div>
  )
}
