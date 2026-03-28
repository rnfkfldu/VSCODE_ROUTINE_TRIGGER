import { useState } from 'react'
import { BottomSheet } from '../../common/BottomSheet'
import type { RoutineDefinition } from '../../../types/engine'

interface QuickLogSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedRoutineId?: string
  routines: RoutineDefinition[]
  onLog: (routineId: string, hours: number) => void
}

export function QuickLogSheet({
  isOpen,
  onClose,
  selectedRoutineId,
  routines,
  onLog,
}: QuickLogSheetProps) {
  const [chosenId, setChosenId] = useState<string>(selectedRoutineId ?? routines[0]?.id ?? '')
  const [hours, setHours] = useState(0.5)

  // Sync selectedRoutineId when it changes
  const effectiveId =
    selectedRoutineId !== undefined ? selectedRoutineId : chosenId

  const handleLog = () => {
    const id = selectedRoutineId ?? chosenId
    if (!id) return
    onLog(id, hours)
  }

  const hoursLabel = (h: number) => {
    if (h < 1) return `${Math.round(h * 60)}분`
    const intPart = Math.floor(h)
    const minPart = Math.round((h - intPart) * 60)
    return minPart > 0 ? `${intPart}시간 ${minPart}분` : `${intPart}시간`
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="빠른 기록">
      <div className="space-y-4 pt-2">
        {/* Routine selector (only when no pre-selected) */}
        {selectedRoutineId === undefined && (
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--text)]">루틴 선택</p>
            <div className="flex flex-col gap-2">
              {routines.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setChosenId(r.id)}
                  className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-medium text-left transition-colors ${
                    chosenId === r.id
                      ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-h)]'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected routine display (when pre-selected) */}
        {selectedRoutineId !== undefined && (
          <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] px-4 py-3">
            <p className="text-sm font-medium text-[var(--accent)]">
              {routines.find((r) => r.id === selectedRoutineId)?.name ?? selectedRoutineId}
            </p>
          </div>
        )}

        {/* Time slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--text)]">수행 시간</p>
            <p className="text-sm font-bold text-[var(--text-h)]">{hoursLabel(hours)}</p>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent)]"
            aria-label="수행 시간 선택"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--text)]">
            <span>0분</span>
            <span>1시간</span>
            <span>2시간</span>
            <span>3시간</span>
            <span>4시간</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleLog}
          disabled={!effectiveId || hours === 0}
          className="min-h-[52px] w-full rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
        >
          기록 추가
        </button>
      </div>
    </BottomSheet>
  )
}
