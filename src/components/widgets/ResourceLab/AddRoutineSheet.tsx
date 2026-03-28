import { useState } from 'react'
import { Clock, Zap } from 'lucide-react'
import { BottomSheet } from '../../common/BottomSheet'
import type { RoutineType } from '../../../types/engine'
import { RoutineType as RT } from '../../../types/engine'

interface AddRoutineSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, type: RoutineType) => void
}

export function AddRoutineSheet({ isOpen, onClose, onAdd }: AddRoutineSheetProps) {
  const [name, setName] = useState('')
  const [selectedType, setSelectedType] = useState<RoutineType>(RT.TIME_BASED)

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, selectedType)
    setName('')
    setSelectedType(RT.TIME_BASED)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="루틴 추가" maxHeight="70vh">
      <div className="space-y-4 pb-2">
        {/* 루틴명 입력 */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text-h)]">루틴 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 독서, 운동, 명상"
            className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-40 focus:border-[var(--accent)] focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
            aria-label="루틴 이름 입력"
          />
        </div>

        {/* 유형 선택 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-h)]">루틴 유형</p>
          <button
            onClick={() => setSelectedType(RT.TIME_BASED)}
            className={`flex min-h-[72px] w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
              selectedType === RT.TIME_BASED
                ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                : 'border-[var(--border)] bg-[var(--code-bg)] hover:border-[var(--accent-border)]'
            }`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                selectedType === RT.TIME_BASED ? 'text-[var(--accent)]' : 'text-[var(--text)]'
              }`}
            >
              <Clock size={20} />
            </div>
            <div>
              <p
                className={`font-semibold ${selectedType === RT.TIME_BASED ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'}`}
              >
                TIME BASED
              </p>
              <p className="text-xs text-[var(--text)] opacity-70">누적 시간이 중요한 루틴</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedType(RT.ACTION_BASED)}
            className={`flex min-h-[72px] w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
              selectedType === RT.ACTION_BASED
                ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
                : 'border-[var(--border)] bg-[var(--code-bg)] hover:border-[var(--accent-border)]'
            }`}
          >
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                selectedType === RT.ACTION_BASED ? 'text-[var(--accent)]' : 'text-[var(--text)]'
              }`}
            >
              <Zap size={20} />
            </div>
            <div>
              <p
                className={`font-semibold ${selectedType === RT.ACTION_BASED ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'}`}
              >
                ACTION BASED
              </p>
              <p className="text-xs text-[var(--text)] opacity-70">수행 여부가 중요한 루틴</p>
            </div>
          </button>
        </div>

        {/* 추가 버튼 */}
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="min-h-[56px] w-full rounded-2xl bg-[var(--accent)] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="루틴 추가"
        >
          추가
        </button>
      </div>
    </BottomSheet>
  )
}
