import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useRoutineStore, useRoutineColor } from '../stores/routineStore'
import { useTimeWizardStore } from '../stores/timeWizardStore'
import type { RoutineDefinition, RoutineTrigger, RoutineType } from '../types/engine'
import { WeightDonutChart } from '../components/widgets/ResourceLab/WeightDonutChart'
import { RoutineCard } from '../components/widgets/ResourceLab/RoutineCard'
import { TriggerBottomSheet } from '../components/widgets/ResourceLab/TriggerBottomSheet'
import { AddRoutineSheet } from '../components/widgets/ResourceLab/AddRoutineSheet'
import { Toast } from '../components/common/Toast'
import { useToast } from '../hooks/useToast'

// ─── 인라인 SectionHeader ─────────────────────────────────────────────────────
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

// ─── RoutineCardWrapper: 색상 훅 사용 ────────────────────────────────────────
interface RoutineCardWrapperProps {
  routine: RoutineDefinition
  availableHours: number
  onWeightChange: (id: string, weight: number) => void
  onFrequencyChange: (id: string, freq: number) => void
  onTypeToggle: (id: string) => void
  onDelete: (id: string) => void
  onTriggerEdit: (id: string) => void
}
function RoutineCardWrapper(props: RoutineCardWrapperProps) {
  const color = useRoutineColor(props.routine.id)
  return <RoutineCard {...props} color={color} />
}

// ─── LabScreen ────────────────────────────────────────────────────────────────
export function LabScreen() {
  const {
    routines,
    addRoutine,
    updateRoutineWeight,
    updateRoutineFrequency,
    updateRoutineTrigger,
    removeRoutine,
  } = useRoutineStore()
  const { computed } = useTimeWizardStore()
  const availableHours = computed.tAvailable

  const totalWeight = routines.reduce((s, r) => s + r.weight, 0)

  const [editingTriggerId, setEditingTriggerId] = useState<string | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const { toast, isVisible, showToast, hideToast } = useToast()

  // 비중 합계 초과 경고
  useEffect(() => {
    if (totalWeight > 100) {
      showToast('비중 합계가 100%를 초과했습니다', 'warning')
    }
  }, [totalWeight]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTypeToggle = (id: string) => {
    const routine = routines.find((r) => r.id === id)
    if (!routine) return
    const nextType: RoutineType = routine.type === 'TIME_BASED' ? 'ACTION_BASED' : 'TIME_BASED'
    // type만 변경 — store에 직접 updateType이 없으므로 weight/freq update로 우회
    // updateRoutineWeight 호출 시 내부적으로 updatedAt만 갱신 — 여기선 직접 store 접근
    useRoutineStore.setState((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, type: nextType, updatedAt: new Date().toISOString() } : r,
      ),
    }))
  }

  const editingRoutine = editingTriggerId
    ? routines.find((r) => r.id === editingTriggerId)
    : undefined

  // 도넛 차트용 데이터
  const chartRoutines = routines.map((r) => ({
    id: r.id,
    name: r.name,
    weight: r.weight,
    goalHours: (availableHours * r.weight) / 100,
  }))

  const handleTriggerSave = (routineId: string, trigger: RoutineTrigger) => {
    updateRoutineTrigger(routineId, trigger)
  }

  const handleAddRoutine = (name: string, type: RoutineType) => {
    addRoutine(name, type)
  }

  return (
    <div className="space-y-4 pt-4">
      <SectionHeader
        title="Resource Lab"
        subtitle={`가용 ${availableHours.toFixed(1)}h 배분`}
      />

      {/* 도넛 차트 */}
      <WeightDonutChart
        routines={chartRoutines}
        availableHours={availableHours}
        totalWeight={totalWeight}
      />

      {/* 배분 현황 요약 */}
      <div className="flex justify-between rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-sm">
        <span className="text-[var(--text)]">
          배분됨:{' '}
          <span className="font-semibold text-[var(--text-h)]">
            {((availableHours * totalWeight) / 100).toFixed(1)}h
          </span>
        </span>
        <span className="text-[var(--text)]">
          잔여:{' '}
          <span className="font-semibold text-[var(--text-h)]">
            {((availableHours * Math.max(0, 100 - totalWeight)) / 100).toFixed(1)}h
          </span>
        </span>
      </div>

      {/* 루틴 카드 목록 */}
      {routines.map((r) => (
        <RoutineCardWrapper
          key={r.id}
          routine={r}
          availableHours={availableHours}
          onWeightChange={updateRoutineWeight}
          onFrequencyChange={updateRoutineFrequency}
          onTypeToggle={handleTypeToggle}
          onDelete={removeRoutine}
          onTriggerEdit={setEditingTriggerId}
        />
      ))}

      {/* 루틴 추가 버튼 */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="루틴 추가"
      >
        <Plus size={18} />
        루틴 추가
      </button>

      {/* 트리거 바텀시트 */}
      <TriggerBottomSheet
        isOpen={editingTriggerId !== null}
        onClose={() => setEditingTriggerId(null)}
        routineId={editingTriggerId ?? ''}
        currentTrigger={editingRoutine?.trigger}
        onSave={handleTriggerSave}
      />

      {/* 루틴 추가 바텀시트 */}
      <AddRoutineSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={handleAddRoutine}
      />

      {/* 토스트 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={isVisible}
          onHide={hideToast}
        />
      )}
    </div>
  )
}
