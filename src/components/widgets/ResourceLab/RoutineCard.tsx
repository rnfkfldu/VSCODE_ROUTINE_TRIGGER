import { Zap, X, Minus, Plus } from 'lucide-react'
import type { RoutineDefinition } from '../../../types/engine'
import { TriggerTimingType } from '../../../types/engine'

interface RoutineCardProps {
  routine: RoutineDefinition
  color: string
  availableHours: number
  onWeightChange: (id: string, weight: number) => void
  onFrequencyChange: (id: string, freq: number) => void
  onTypeToggle: (id: string) => void
  onDelete: (id: string) => void
  onTriggerEdit: (id: string) => void
}

function getTriggerSummary(routine: RoutineDefinition): string | null {
  const t = routine.trigger
  if (!t) return null
  if (t.timingType === TriggerTimingType.SPECIFIC_TIME) {
    if (t.specificTime) return `${t.specificTime}에 시작`
    return null
  }
  if (t.timingType === TriggerTimingType.AFTER_ACTION) {
    if (t.afterAction) return `${t.afterAction} 직후`
    return null
  }
  if (t.timingType === TriggerTimingType.LOCATION_BASED) {
    if (t.location) return `${t.location} 도착 시`
    return null
  }
  return null
}

function isTriggerSet(routine: RoutineDefinition): boolean {
  const t = routine.trigger
  if (!t) return false
  if (t.timingType === TriggerTimingType.SPECIFIC_TIME && t.specificTime) return true
  if (t.timingType === TriggerTimingType.AFTER_ACTION && t.afterAction) return true
  if (t.timingType === TriggerTimingType.LOCATION_BASED && t.location) return true
  return false
}

export function RoutineCard({
  routine,
  color,
  availableHours,
  onWeightChange,
  onFrequencyChange,
  onTypeToggle,
  onDelete,
  onTriggerEdit,
}: RoutineCardProps) {
  const isTimeBased = routine.type === 'TIME_BASED'
  const goalHours = isTimeBased ? (availableHours * routine.weight) / 100 : 0
  const freq = routine.targetFrequencyPerWeek ?? 3
  const triggerSet = isTriggerSet(routine)
  const triggerSummary = getTriggerSummary(routine)

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--code-bg)] p-4 space-y-3">
      {/* 상단 행 */}
      <div className="flex items-center gap-2">
        {/* 색상 dot + 루틴명 */}
        <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="flex-1 font-semibold text-[var(--text-h)] truncate">{routine.name}</span>

        {/* TIME / ACTION 토글 */}
        <button
          onClick={() => onTypeToggle(routine.id)}
          className="flex min-h-[36px] items-center rounded-lg border border-[var(--border)] px-2 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          aria-label="유형 전환"
        >
          {isTimeBased ? 'TIME' : 'ACTION'}
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(routine.id)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--text)] hover:text-red-500 transition-colors"
          aria-label="루틴 삭제"
        >
          <X size={16} />
        </button>
      </div>

      {/* 메인 컨트롤 */}
      {isTimeBased ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text)]">비중</span>
            <span className="font-medium text-[var(--text-h)]">
              {routine.weight}% → {goalHours.toFixed(1)}h
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={routine.weight}
            onChange={(e) => onWeightChange(routine.id, Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            aria-label="비중 슬라이더"
          />
          <div className="flex justify-between text-xs text-[var(--text)] opacity-60">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text)]">주간 목표 횟수</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFrequencyChange(routine.id, Math.max(1, freq - 1))}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              aria-label="횟수 감소"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold text-[var(--text-h)]">{freq}</span>
            <button
              onClick={() => onFrequencyChange(routine.id, Math.min(21, freq + 1))}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              aria-label="횟수 증가"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 트리거 설정 버튼 */}
      <button
        onClick={() => onTriggerEdit(routine.id)}
        className={`flex min-h-[44px] w-full items-center gap-2 rounded-xl border px-3 text-sm transition-colors ${
          triggerSet
            ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400'
            : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
        }`}
        aria-label="트리거 설정"
      >
        <Zap size={16} className="flex-shrink-0" />
        <span className="flex-1 text-left">
          {triggerSet && triggerSummary ? triggerSummary : '트리거 설정하기'}
        </span>
      </button>
    </div>
  )
}
