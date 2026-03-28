import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useLogStore } from '../stores/logStore'
import { useTriggerStore } from '../stores/triggerStore'
import { useRoutineStore } from '../stores/routineStore'
import { useScheduleStore } from '../stores/scheduleStore'
import { useTimeWizardStore } from '../stores/timeWizardStore'
import { TodayHeader } from '../components/widgets/Daily/TodayHeader'
import { DeltaSummaryCard } from '../components/widgets/Daily/DeltaSummaryCard'
import { TriggerHabitCard } from '../components/widgets/Daily/TriggerHabitCard'
import { RoutineProgressCard } from '../components/widgets/Daily/RoutineProgressCard'
import { QuickLogSheet } from '../components/widgets/Daily/QuickLogSheet'

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

function getDayOfWeek(date: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  return days[date.getDay()]
}

function calcGoalToDate(distributions: Record<string, number>, today: Date): number {
  const dayIndex = today.getDay() // 0=Sun, 1=Mon, ...
  const orderedDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  // dayIndex 0=Sun → index 6 in Mon-based array
  const todayInWeek = dayIndex === 0 ? 6 : dayIndex - 1
  return orderedDays
    .slice(0, todayInWeek + 1)
    .reduce((s, d) => s + (distributions[d] ?? 0), 0)
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-1 pt-2">
      <h2 className="text-sm font-semibold text-[var(--text-h)]">{title}</h2>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  )
}

export function TriggersScreen() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const { habits } = useTriggerStore()
  const { routines } = useRoutineStore()
  const { distributions } = useScheduleStore()
  const { computed: timeComputed } = useTimeWizardStore()
  const { addRoutineHours, toggleTrigger, getRoutineHoursForDate, getTriggerCompletedForDate, getWeeklyRoutineHours } =
    useLogStore()

  const [showQuickLog, setShowQuickLog] = useState(false)
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)

  const dayOfWeek = getDayOfWeek(today)

  const timeBasedRoutines = routines.filter((r) => r.type === 'TIME_BASED')

  const routineProgress = timeBasedRoutines.map((r, index) => {
    const color = ROUTINE_COLORS[index % ROUTINE_COLORS.length]
    const routineDist = distributions[r.id] ?? {}
    const scheduledHours = routineDist[dayOfWeek] ?? 0
    const actualHours = getRoutineHoursForDate(r.id, todayStr)
    const weeklyActual = getWeeklyRoutineHours(r.id, timeComputed.weekId)
    const goalToDate = calcGoalToDate(routineDist, today)
    return { routine: r, color, scheduledHours, actualHours, weeklyActual, goalToDate }
  })

  const totalActual = routineProgress.reduce((s, r) => s + r.weeklyActual, 0)
  const totalGoalToDate = routineProgress.reduce((s, r) => s + r.goalToDate, 0)
  const triggerCompleted = habits.filter((h) => getTriggerCompletedForDate(h.id, todayStr)).length

  return (
    <div className="space-y-3 pt-4 pb-24">
      <TodayHeader date={today} />

      <DeltaSummaryCard
        totalActual={totalActual}
        totalGoalToDate={totalGoalToDate}
        triggerCompleted={triggerCompleted}
        triggerTotal={habits.length}
      />

      {/* 트리거 습관 섹션 */}
      <SectionLabel title="트리거 습관" />
      {habits.length === 0 ? (
        <p className="px-1 text-sm text-[var(--text)]">등록된 트리거 습관이 없습니다.</p>
      ) : (
        habits.map((h) => (
          <TriggerHabitCard
            key={h.id}
            habit={h}
            isCompleted={getTriggerCompletedForDate(h.id, todayStr)}
            onToggle={(id) => toggleTrigger(id, todayStr)}
          />
        ))
      )}

      {/* 루틴 진행 섹션 */}
      <SectionLabel title="오늘의 루틴" />
      {routineProgress.length === 0 ? (
        <p className="px-1 text-sm text-[var(--text)]">오늘 배정된 루틴이 없습니다.</p>
      ) : (
        routineProgress.map((rp) => (
          <RoutineProgressCard
            key={rp.routine.id}
            routine={rp.routine}
            color={rp.color}
            scheduledHours={rp.scheduledHours}
            actualHours={rp.actualHours}
            goalToDate={rp.goalToDate}
            weeklyActual={rp.weeklyActual}
            onAddLog={(id) => {
              setSelectedRoutineId(id)
              setShowQuickLog(true)
            }}
          />
        ))
      )}

      {/* FAB */}
      <button
        onClick={() => {
          setSelectedRoutineId(null)
          setShowQuickLog(true)
        }}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-transform active:scale-95"
        aria-label="빠른 기록"
      >
        <Plus size={24} />
      </button>

      <QuickLogSheet
        isOpen={showQuickLog}
        onClose={() => setShowQuickLog(false)}
        selectedRoutineId={selectedRoutineId ?? undefined}
        routines={timeBasedRoutines}
        onLog={(routineId, hours) => {
          addRoutineHours(routineId, hours, todayStr)
          setShowQuickLog(false)
        }}
      />
    </div>
  )
}
