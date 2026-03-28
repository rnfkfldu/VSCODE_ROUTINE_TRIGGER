import { TimeWizard } from '../components/widgets/TimeWizard/TimeWizard'
import { useTimeWizardStore } from '../stores/timeWizardStore'

interface SetupScreenProps {
  onNext: () => void
}

export function SetupScreen({ onNext }: SetupScreenProps) {
  const { computed } = useTimeWizardStore()
  return (
    <div className="space-y-4 pt-4">
      {/* WeekContextBanner */}
      <div className="flex items-center justify-between rounded-xl border-l-4 border-[var(--accent)] bg-[var(--accent-bg)] px-4 py-3">
        <div>
          <p className="text-xs text-[var(--text)]">이번 주 가용 시간</p>
          <p className="text-sm font-semibold text-[var(--text-h)]">{computed.weekId}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-[var(--accent)]">
            {Math.max(computed.tAvailable, 0).toFixed(1)}h
          </span>
        </div>
      </div>
      <TimeWizard />
      <button
        disabled={computed.tAvailable <= 0}
        onClick={onNext}
        className="flex w-full items-center justify-center gap-2 min-h-[56px] rounded-2xl font-semibold text-base transition-all duration-200 bg-[var(--accent)] text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        루틴 배정하기 →
      </button>
    </div>
  )
}
