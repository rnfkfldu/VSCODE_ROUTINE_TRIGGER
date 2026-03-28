interface TodayHeaderProps {
  date?: Date
}

export function TodayHeader({ date }: TodayHeaderProps) {
  const today = date ?? new Date()
  const dateStr = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  // 주차 계산 (ISO 8601)
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const weekNum = Math.ceil(
    ((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7,
  )

  return (
    <div className="pt-4 pb-2 text-center">
      <h1 className="text-xl font-bold text-[var(--text-h)]">{dateStr}</h1>
      <p className="mt-0.5 text-xs text-[var(--text)]">{today.getFullYear()}년 {weekNum}주차</p>
    </div>
  )
}
