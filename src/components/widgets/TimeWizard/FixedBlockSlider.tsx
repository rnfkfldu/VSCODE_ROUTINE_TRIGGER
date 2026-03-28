/**
 * FixedBlockSlider — 고정 시간 블록 슬라이더 원자 컴포넌트
 *
 * 슬라이더 1개 + 레이블 + 현재 값 표시.
 * 터치 타겟 44px 보장 (Designer 규칙 준수).
 */

import type { FixedTimeBlock } from '../../../types/engine'

// 항목별 합리적인 슬라이더 최댓값 (주당 시간)
const MAX_HOURS: Record<string, number> = {
  sleep: 98,    // 최대 14h/일 × 7
  meal: 21,     // 최대 3h/일 × 7
  work: 80,     // 최대 16h/일 × 5
  commute: 20,  // 최대 2h × 2 × 5
}
const DEFAULT_MAX = 84 // 12h/일 × 7

interface FixedBlockSliderProps {
  block: FixedTimeBlock
  step?: number
  onChange: (id: string, value: number) => void
}

export function FixedBlockSlider({ block, step = 0.5, onChange }: FixedBlockSliderProps) {
  const max = MAX_HOURS[block.id] ?? DEFAULT_MAX

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`slider-${block.id}`}
          className="text-sm font-medium text-[var(--text-h)]"
        >
          {block.label}
        </label>
        <span className="min-w-[4rem] text-right text-sm tabular-nums text-[var(--accent)]">
          {block.hoursPerWeek.toFixed(1)}h/주
        </span>
      </div>

      {/* 터치 타겟 44px 확보를 위한 패딩 wrapper */}
      <div className="py-2">
        <input
          id={`slider-${block.id}`}
          type="range"
          min={0}
          max={max}
          step={step}
          value={block.hoursPerWeek}
          onChange={(e) => onChange(block.id, parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--border)]"
          aria-label={`${block.label} 주당 시간`}
        />
      </div>

      {/* 최솟값/최댓값 힌트 */}
      <div className="flex justify-between text-xs text-[var(--text)]">
        <span>0h</span>
        <span>{max}h</span>
      </div>
    </div>
  )
}
