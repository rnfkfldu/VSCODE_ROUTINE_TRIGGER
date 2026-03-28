import { Sparkles } from 'lucide-react'

interface RoutineKPIItem {
  name: string
  kpi: number | null
  delta: number
}

interface AIInsightCardProps {
  weeklyKpi: number | null
  routineKPIs: RoutineKPIItem[]
}

function buildInsightText(weeklyKpi: number | null, routineKPIs: RoutineKPIItem[]): string {
  const lines: string[] = []

  // Overall assessment
  if (weeklyKpi === null) {
    lines.push('이번 주 기록된 데이터가 없습니다. 루틴을 시작해보세요!')
  } else if (weeklyKpi >= 80) {
    lines.push(`훌륭합니다! 이번 주 목표의 ${Math.round(weeklyKpi)}%를 달성했습니다.`)
  } else if (weeklyKpi >= 60) {
    lines.push('이번 주 조금 아쉬웠지만 꾸준히 나아가고 있습니다.')
  } else {
    lines.push('이번 주 목표 달성이 어려웠네요. 다음 주 비중을 조정해보는 건 어떨까요?')
  }

  // Best / worst routine
  const withKpi = routineKPIs.filter((r) => r.kpi !== null) as (RoutineKPIItem & { kpi: number })[]

  if (withKpi.length > 0) {
    const best = withKpi.reduce((a, b) => (a.kpi >= b.kpi ? a : b))
    const worst = withKpi.reduce((a, b) => (a.kpi <= b.kpi ? a : b))

    lines.push(`가장 잘 된 루틴: "${best.name}" (${Math.round(best.kpi)}%)`)

    if (withKpi.length > 1 && worst.routineId !== best.routineId) {
      lines.push(`조금 더 노력이 필요한 루틴: "${worst.name}" (${Math.round(worst.kpi)}%)`)
    }
  }

  return lines.join('\n')
}

export function AIInsightCard({ weeklyKpi, routineKPIs }: AIInsightCardProps) {
  const insightText = buildInsightText(weeklyKpi, routineKPIs)

  return (
    <div className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-[var(--accent)]" />
        <h3 className="text-sm font-semibold text-[var(--accent)]">AI 인사이트</h3>
      </div>
      <div className="space-y-1">
        {insightText.split('\n').map((line, i) => (
          <p key={i} className="text-sm leading-relaxed text-[var(--text-h)]">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
