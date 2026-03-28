/**
 * AvailableTimeDisplay — 가용 시간 큰 숫자 표시 컴포넌트
 *
 * tAvailable 값을 강조 표시하고 상태에 따른 색상 배지를 렌더링.
 * isOverAllocated = true 시 빨간 경고 배너 표시.
 */

import type { AvailabilityStatus } from '../../../utils/timeWizard'

interface AvailableTimeDisplayProps {
  tAvailable: number
  isOverAllocated: boolean
  status: AvailabilityStatus
}

const STATUS_CONFIG = {
  success:  { label: '여유 있음',  badgeClass: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  progress: { label: '적당함',     badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  warning:  { label: '빠듯함',     badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  danger:   { label: '초과 배분!', badgeClass: 'bg-red-500/20 text-red-400 border border-red-500/30' },
} satisfies Record<AvailabilityStatus, { label: string; badgeClass: string }>

const NUMBER_COLOR: Record<AvailabilityStatus, string> = {
  success:  'text-green-400',
  progress: 'text-blue-400',
  warning:  'text-yellow-400',
  danger:   'text-red-400',
}

export function AvailableTimeDisplay({
  tAvailable,
  isOverAllocated,
  status,
}: AvailableTimeDisplayProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div className="space-y-3">
      {/* 초과 배분 경고 배너 */}
      {isOverAllocated && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span className="text-base">⚠️</span>
          <span>
            고정 + 특이사항 시간이 168시간을 초과했습니다. 슬라이더를 조절해주세요.
          </span>
        </div>
      )}

      {/* 가용 시간 메인 표시 */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text)]">
            이번 주 가용 시간
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-5xl font-bold tabular-nums ${NUMBER_COLOR[status]}`}>
              {Math.max(tAvailable, 0).toFixed(1)}
            </span>
            <span className="text-lg text-[var(--text)]">h</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badgeClass}`}>
            {config.label}
          </span>
          <p className="text-xs text-[var(--text)]">
            168 − {(tAvailable <= 0 ? 168 - tAvailable : 168 - tAvailable).toFixed(1)}h
          </p>
        </div>
      </div>
    </div>
  )
}
