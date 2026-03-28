/**
 * TimeWizard — 주간 가용 시간 산정 위젯
 *
 * useTimeWizardStore를 유일하게 구독하는 위젯 루트.
 * 계산 로직 없이 store → props 분배만 담당.
 *
 * PRD Module 1: T_available = 168 - (T_fixed + T_special)
 */

import { useTimeWizardStore } from '../../../stores/timeWizardStore'
import { getAvailabilityStatus } from '../../../utils/timeWizard'
import { TimeBar } from './TimeBar'
import { FixedBlockSlider } from './FixedBlockSlider'
import { SpecialEventInput } from './SpecialEventInput'
import { AvailableTimeDisplay } from './AvailableTimeDisplay'

export function TimeWizard() {
  const {
    fixedBlocks,
    specialBlocks,
    computed,
    updateFixedBlock,
    addSpecialBlock,
    removeSpecialBlock,
    resetToDefault,
  } = useTimeWizardStore()

  const status = getAvailabilityStatus(computed.tAvailable)

  return (
    <section
      className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm"
      aria-label="Time Wizard — 주간 가용 시간 산정"
    >
      {/* 위젯 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-h)]">
            Time Wizard
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text)]">
            {computed.weekId} · 이번 주 가용 시간 산정
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="min-h-[44px] rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          초기화
        </button>
      </div>

      {/* 168h 시각화 바 */}
      <TimeBar
        tFixed={computed.tFixed}
        tSpecial={computed.tSpecial}
        tAvailable={computed.tAvailable}
        isOverAllocated={computed.isOverAllocated}
      />

      {/* 가용 시간 표시 */}
      <AvailableTimeDisplay
        tAvailable={computed.tAvailable}
        isOverAllocated={computed.isOverAllocated}
        status={status}
      />

      {/* 구분선 */}
      <hr className="border-[var(--border)]" />

      {/* 고정 시간 슬라이더 */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
          고정 시간 (T_fixed)
        </h3>
        {fixedBlocks.map((block) => (
          <FixedBlockSlider
            key={block.id}
            block={block}
            onChange={updateFixedBlock}
          />
        ))}
      </div>

      {/* 구분선 */}
      <hr className="border-[var(--border)]" />

      {/* 특이사항 입력 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
            특이사항 (T_special)
          </h3>
          {specialBlocks.length > 0 && (
            <span className="text-xs text-yellow-400">
              −{computed.tSpecial.toFixed(1)}h
            </span>
          )}
        </div>
        <SpecialEventInput
          blocks={specialBlocks}
          onAdd={addSpecialBlock}
          onRemove={removeSpecialBlock}
        />
      </div>
    </section>
  )
}
