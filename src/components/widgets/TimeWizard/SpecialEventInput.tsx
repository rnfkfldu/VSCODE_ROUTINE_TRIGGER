/**
 * SpecialEventInput — 특이사항(일회성 이벤트) 추가/삭제 UI
 *
 * 항목명, 시간, 날짜 3개 필드 입력 후 store에 추가.
 * 터치 타겟 44px 보장 (Designer 규칙 준수).
 */

import { useState } from 'react'
import type { SpecialEventBlock } from '../../../types/engine'

interface SpecialEventInputProps {
  blocks: SpecialEventBlock[]
  onAdd: (block: Omit<SpecialEventBlock, 'id'>) => void
  onRemove: (id: string) => void
}

const TODAY = new Date().toISOString().split('T')[0]

export function SpecialEventInput({ blocks, onAdd, onRemove }: SpecialEventInputProps) {
  const [label, setLabel] = useState('')
  const [hours, setHours] = useState('')
  const [date, setDate] = useState(TODAY)
  const [isOpen, setIsOpen] = useState(false)

  function handleAdd() {
    const h = parseFloat(hours)
    if (!label.trim() || isNaN(h) || h <= 0) return
    onAdd({ label: label.trim(), hours: h, date })
    setLabel('')
    setHours('')
    setDate(TODAY)
    setIsOpen(false)
  }

  return (
    <div className="space-y-3">
      {/* 기존 특이사항 목록 */}
      {blocks.length > 0 && (
        <ul className="space-y-2">
          {blocks.map((block) => (
            <li
              key={block.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-h)]">{block.label}</span>
                <span className="text-xs text-[var(--text)]">{block.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium tabular-nums text-yellow-400">
                  {block.hours.toFixed(1)}h
                </span>
                <button
                  onClick={() => onRemove(block.id)}
                  className="min-h-[44px] min-w-[44px] rounded-lg p-2 text-[var(--text)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`${block.label} 삭제`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 추가 폼 토글 */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <span>+</span>
          <span>특이사항 추가 (회식, 경조사, 병원 등)</span>
        </button>
      ) : (
        <div className="space-y-3 rounded-lg border border-[var(--border)] p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-[var(--text)]">
                항목명
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="예: 팀 회식"
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text)]">
                소요 시간 (h)
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="3"
                min={0}
                step={0.5}
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text)]">
                날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text-h)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="min-h-[44px] flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              추가
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="min-h-[44px] rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--border)]"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
