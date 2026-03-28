import { Share2 } from 'lucide-react'
import { useRoutineStore } from '../stores/routineStore'
import { useTimeWizardStore } from '../stores/timeWizardStore'
import { useLogStore } from '../stores/logStore'
import { useReviewStore } from '../stores/reviewStore'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/common/Toast'
import { OverallKPIHero } from '../components/widgets/Review/OverallKPIHero'
import { RoutineKPIList } from '../components/widgets/Review/RoutineKPIList'
import { AIInsightCard } from '../components/widgets/Review/AIInsightCard'
import { ReflectionEditor } from '../components/widgets/Review/ReflectionEditor'

const ROUTINE_COLORS = [
  '#a855f7',
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#f43f5e',
]

export function ReviewScreen() {
  const { routines } = useRoutineStore()
  const { computed: timeComputed } = useTimeWizardStore()
  const { getWeeklyRoutineHours } = useLogStore()
  const { reviews, saveReview } = useReviewStore()
  const { toast, isVisible, showToast, hideToast } = useToast()

  const weekId = timeComputed.weekId
  const review = reviews[weekId]

  const routineKPIs = routines
    .filter((r) => r.type === 'TIME_BASED')
    .map((r, index) => {
      const color = ROUTINE_COLORS[index % ROUTINE_COLORS.length]
      const goalHours = timeComputed.tAvailable * r.weight / 100
      const actualHours = getWeeklyRoutineHours(r.id, weekId)
      const kpi = goalHours > 0 ? (actualHours / goalHours) * 100 : null
      return {
        routineId: r.id,
        routineName: r.name,
        color,
        kpi,
        actual: actualHours,
        goal: goalHours,
      }
    })

  const totalGoal = routineKPIs.reduce((s, r) => s + r.goal, 0)
  const totalActual = routineKPIs.reduce((s, r) => s + r.actual, 0)
  const overallKPI = totalGoal > 0 ? (totalActual / totalGoal) * 100 : null

  const handleShare = async () => {
    const text = `[THE ENGINE] ${weekId} 주간 리뷰\n달성률: ${overallKPI?.toFixed(0) ?? 'N/A'}%\n총 ${totalActual.toFixed(1)}h / 목표 ${totalGoal.toFixed(1)}h`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'THE ENGINE 주간 리뷰', text })
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        showToast('클립보드에 복사됐습니다', 'success')
      } catch {
        showToast('복사에 실패했습니다', 'error')
      }
    }
  }

  return (
    <div className="space-y-4 pt-4 pb-6">
      <Toast
        message={toast?.message ?? ''}
        type={toast?.type ?? 'info'}
        isVisible={isVisible}
        onHide={hideToast}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--text-h)]">Weekly Review</h2>
        <span className="text-xs text-[var(--text)]">{weekId}</span>
      </div>

      <OverallKPIHero
        kpi={overallKPI}
        totalActual={totalActual}
        totalGoal={totalGoal}
        weekId={weekId}
      />

      <RoutineKPIList items={routineKPIs} />

      <AIInsightCard
        weeklyKpi={overallKPI}
        routineKPIs={routineKPIs.map((r) => ({
          name: r.routineName,
          kpi: r.kpi,
          delta: r.actual - r.goal,
        }))}
      />

      <ReflectionEditor
        weekId={weekId}
        initialText={review?.text ?? ''}
        initialGoal={review?.nextWeekGoal ?? ''}
        onSave={(text, goal) => saveReview(weekId, text, goal)}
      />

      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 min-h-[52px] rounded-2xl border border-[var(--border)] text-sm font-medium text-[var(--text-h)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98] transition-all"
      >
        <Share2 size={18} />
        주간 리포트 공유
      </button>
    </div>
  )
}
