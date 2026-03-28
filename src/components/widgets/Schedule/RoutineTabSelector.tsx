interface RoutineTabSelectorProps {
  routines: Array<{ id: string; name: string; color: string; goalHours: number }>
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RoutineTabSelector({ routines, selectedId, onSelect }: RoutineTabSelectorProps) {
  if (routines.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {routines.map((r) => {
        const isSelected = r.id === selectedId
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`flex min-h-[44px] flex-shrink-0 items-center gap-2 rounded-2xl border px-4 text-sm font-medium transition-colors ${
              isSelected
                ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--code-bg)] text-[var(--text)] hover:border-[var(--accent-border)]'
            }`}
            aria-pressed={isSelected}
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            <span>{r.name}</span>
            <span className="opacity-60">{r.goalHours.toFixed(1)}h</span>
          </button>
        )
      })}
    </div>
  )
}
