import { useState } from 'react'

interface ReflectionEditorProps {
  weekId: string
  initialText: string
  initialGoal: string
  onSave: (text: string, goal: string) => void
}

const MAX_LENGTH = 500

export function ReflectionEditor({
  initialText,
  initialGoal,
  onSave,
}: ReflectionEditorProps) {
  const [text, setText] = useState(initialText)
  const [goal, setGoal] = useState(initialGoal)

  const hasChanges = text !== initialText || goal !== initialGoal

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--text-h)]">이번 주 회고</h3>

      {/* Reflection textarea */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-[var(--text)]">
          회고 내용
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="이번 주를 돌아보며 느낀 점을 적어보세요..."
          rows={4}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-[var(--text)]">
          {text.length}/{MAX_LENGTH}
        </p>
      </div>

      {/* Next week goal textarea */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-[var(--text)]">
          다음 주 목표
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="다음 주에 집중하고 싶은 목표를 적어보세요..."
          rows={3}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3 text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <p className="mt-1 text-right text-xs text-[var(--text)]">
          {goal.length}/{MAX_LENGTH}
        </p>
      </div>

      {/* Save button */}
      <button
        onClick={() => onSave(text, goal)}
        disabled={!hasChanges}
        className="min-h-[44px] w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
      >
        저장
      </button>
    </div>
  )
}
