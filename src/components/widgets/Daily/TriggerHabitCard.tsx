import { useState } from 'react'
import { Check } from 'lucide-react'
import type { TriggerHabit } from '../../../types/engine'

interface TriggerHabitCardProps {
  habit: TriggerHabit
  isCompleted: boolean
  onToggle: (id: string) => void
}

const CONDITION_LABELS: Record<string, string> = {
  AFTER_MEAL: '식사 직후',
  AFTER_WORK: '퇴근 후',
  AFTER_WAKE_UP: '기상 직후',
  BEFORE_SLEEP: '취침 전',
  AFTER_FAMILY_SETTLED: '가족 재운 후',
  AFTER_ARRIVAL: '도착 직후',
  AFTER_TASK_DONE: '작업 완료 후',
  CUSTOM: '커스텀',
}

export function TriggerHabitCard({ habit, isCompleted, onToggle }: TriggerHabitCardProps) {
  const [pressing, setPressing] = useState(false)

  const conditionLabel = CONDITION_LABELS[habit.conditionType] ?? habit.conditionType

  const handleToggle = () => {
    setPressing(true)
    setTimeout(() => setPressing(false), 200)
    onToggle(habit.id)
  }

  return (
    <div
      className={`flex min-h-[72px] items-center gap-3 rounded-2xl border p-3 transition-colors ${
        isCompleted
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-[var(--border)] bg-[var(--bg)]'
      }`}
    >
      {/* Check circle */}
      <button
        onClick={handleToggle}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 transition-all active:scale-110 ${
          pressing ? 'scale-110' : 'scale-100'
        } ${
          isCompleted
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-[var(--border)] bg-transparent text-transparent'
        }`}
        aria-label={isCompleted ? '완료 취소' : '완료 표시'}
      >
        <Check size={20} strokeWidth={3} />
      </button>

      {/* Center: name + condition */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold text-[var(--text-h)] ${isCompleted ? 'line-through opacity-60' : ''}`}
        >
          {habit.name}
        </p>
        <p className="mt-0.5 text-xs text-[var(--text)]">{conditionLabel}</p>
      </div>

      {/* Right: streak */}
      {habit.streak.currentStreak > 0 && (
        <div className="flex items-center gap-1 text-sm font-medium text-orange-500">
          <span>🔥</span>
          <span>{habit.streak.currentStreak}일</span>
        </div>
      )}
    </div>
  )
}
