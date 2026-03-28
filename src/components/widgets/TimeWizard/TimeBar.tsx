/**
 * TimeBar — 168시간 시각화 바
 *
 * 슬라이더 변경 시 바 너비가 transition으로 실시간 애니메이션.
 * 3구역: 고정 시간(accent) / 특이사항(yellow) / 가용 시간(green or red)
 */

import { calcBarPercentage } from '../../../utils/timeWizard'

interface TimeBarProps {
  tFixed: number
  tSpecial: number
  tAvailable: number
  isOverAllocated: boolean
}

export function TimeBar({ tFixed, tSpecial, tAvailable, isOverAllocated }: TimeBarProps) {
  const fixedPct = calcBarPercentage(tFixed)
  const specialPct = calcBarPercentage(tSpecial)
  // 가용 시간은 음수일 때 0으로 클램핑 (바 오버플로우 방지)
  const availablePct = calcBarPercentage(Math.max(tAvailable, 0))

  return (
    <div className="space-y-2">
      {/* 레이블 행 */}
      <div className="flex items-center justify-between text-xs text-[var(--text)]">
        <span>0h</span>
        <span className="font-medium text-[var(--text-h)]">1주 = 168시간</span>
        <span>168h</span>
      </div>

      {/* 바 컨테이너 */}
      <div
        className="relative h-5 w-full overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-valuenow={tFixed + tSpecial}
        aria-valuemax={168}
      >
        {/* 고정 시간 (accent 보라) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-all duration-300 ease-out"
          style={{ width: `${fixedPct}%` }}
        />
        {/* 특이사항 (yellow) */}
        <div
          className="absolute top-0 h-full bg-yellow-500 transition-all duration-300 ease-out"
          style={{ left: `${fixedPct}%`, width: `${specialPct}%` }}
        />
        {/* 가용 시간 (초과 시 red, 정상 시 green) */}
        {!isOverAllocated && (
          <div
            className="absolute top-0 h-full bg-green-500 opacity-30 transition-all duration-300 ease-out"
            style={{ left: `${fixedPct + specialPct}%`, width: `${availablePct}%` }}
          />
        )}
        {/* 초과 시 전체 바를 빨간 오버레이 */}
        {isOverAllocated && (
          <div className="absolute inset-0 animate-pulse bg-red-500 opacity-20" />
        )}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text)]">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
          고정 {tFixed.toFixed(1)}h
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
          특이사항 {tSpecial.toFixed(1)}h
        </span>
        <span className="flex items-center gap-1">
          <span className={`inline-block h-2 w-2 rounded-full ${isOverAllocated ? 'bg-red-500' : 'bg-green-500'}`} />
          가용 {tAvailable.toFixed(1)}h
        </span>
      </div>
    </div>
  )
}
