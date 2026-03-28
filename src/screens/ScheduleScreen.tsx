import { useState } from 'react'
import { useRoutineStore, useRoutineColor } from '../stores/routineStore'
import { useTimeWizardStore } from '../stores/timeWizardStore'
import { useScheduleStore } from '../stores/scheduleStore'
import { RoutineTabSelector } from '../components/widgets/Schedule/RoutineTabSelector'
import { DayDistributor } from '../components/widgets/Schedule/DayDistributor'

// ─── 인라인 SectionHeader ────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string
  subtitle?: string
}
function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--text-h)]">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-[var(--text)] opacity-70">{subtitle}</p>}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-6">
      <p className="text-center text-sm text-[var(--text)] opacity-60">{message}</p>
    </div>
  )
}

// ─── SelectedRoutineDistributor: 색상 훅을 내부에서 사용 ─────────────────────
interface SelectedRoutineDistributorProps {
  routineId: string
  goalHours: number
  distribution: Record<string, number>
  onDayChange: (day: string, hours: number) => void
  onAutoDistribute: () => void
}
function SelectedRoutineDistributor({
  routineId,
  goalHours,
  distribution,
  onDayChange,
  onAutoDistribute,
}: SelectedRoutineDistributorProps) {
  const color = useRoutineColor(routineId)
  return (
    <DayDistributor
      routineId={routineId}
      color={color}
      goalHours={goalHours}
      distribution={distribution}
      onDayChange={onDayChange}
      onAutoDistribute={onAutoDistribute}
    />
  )
}

// ─── RoutineTabSelectorWithColors ─────────────────────────────────────────────
interface TabRoutine {
  id: string
  name: string
  weight: number
}
interface RoutineTabWithColorProps {
  routines: TabRoutine[]
  availableHours: number
  selectedId: string | null
  onSelect: (id: string) => void
}
function RoutineTabWithColor({
  routines,
  availableHours,
  selectedId,
  onSelect,
}: RoutineTabWithColorProps) {
  // 색상 훅은 각 루틴에 따라 다르므로 별도 컴포넌트로 분리
  const allRoutines = useRoutineStore((state) => state.routines)
  const tabRoutines = routines.map((r, i) => {
    const idx = allRoutines.findIndex((ar) => ar.id === r.id)
    const COLORS = [
      '#a855f7', '#3b82f6', '#22c55e', '#eab308',
      '#f97316', '#ec4899', '#14b8a6', '#f43f5e',
    ]
    return {
      id: r.id,
      name: r.name,
      color: COLORS[idx >= 0 ? idx % COLORS.length : i % COLORS.length],
      goalHours: (availableHours * r.weight) / 100,
    }
  })

  return (
    <RoutineTabSelector
      routines={tabRoutines}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  )
}

// ─── ScheduleScreen ───────────────────────────────────────────────────────────
export function ScheduleScreen() {
  const { routines } = useRoutineStore()
  const { computed } = useTimeWizardStore()
  const { distributions, setDayHours, autoDistribute } = useScheduleStore()

  const timeBasedRoutines = routines.filter((r) => r.type === 'TIME_BASED')

  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(
    timeBasedRoutines[0]?.id ?? null,
  )

  const selectedRoutine = timeBasedRoutines.find((r) => r.id === selectedRoutineId) ?? null
  const goalHours = selectedRoutine
    ? computed.tAvailable * (selectedRoutine.weight / 100)
    : 0
  const distribution = distributions[selectedRoutineId ?? ''] ?? {}

  return (
    <div className="space-y-4 pt-4">
      <SectionHeader title="Weekly Schedule" subtitle="루틴별 요일 분배" />

      {/* 루틴 탭 선택 */}
      <RoutineTabWithColor
        routines={timeBasedRoutines.map((r) => ({ id: r.id, name: r.name, weight: r.weight }))}
        availableHours={computed.tAvailable}
        selectedId={selectedRoutineId}
        onSelect={setSelectedRoutineId}
      />

      {/* 선택된 루틴의 요일 분배 */}
      {selectedRoutine && (
        <SelectedRoutineDistributor
          routineId={selectedRoutine.id}
          goalHours={goalHours}
          distribution={distribution}
          onDayChange={(day, h) => setDayHours(selectedRoutine.id, day, h)}
          onAutoDistribute={() => autoDistribute(selectedRoutine.id, goalHours)}
        />
      )}

      {/* 빈 상태 */}
      {timeBasedRoutines.length === 0 && (
        <EmptyState message="Lab 탭에서 TIME_BASED 루틴을 먼저 추가해주세요" />
      )}
    </div>
  )
}
