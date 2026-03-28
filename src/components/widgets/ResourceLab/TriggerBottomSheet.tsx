import { useState } from 'react'
import { Clock, Zap, MapPin } from 'lucide-react'
import { BottomSheet } from '../../common/BottomSheet'
import type { RoutineTrigger, TriggerTimingType } from '../../../types/engine'
import { TriggerTimingType as TTT } from '../../../types/engine'

interface TriggerBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  routineId: string
  currentTrigger?: RoutineTrigger
  onSave: (routineId: string, trigger: RoutineTrigger) => void
}

type TriggerTypeOption = TriggerTimingType

interface TriggerTypeCardProps {
  type: TriggerTypeOption
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  description: string
}

function TriggerTypeCard({ selected, onSelect, icon, title, description }: TriggerTypeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex min-h-[88px] w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
        selected
          ? 'border-[var(--accent)] bg-[var(--accent-bg)]'
          : 'border-[var(--border)] bg-[var(--code-bg)] hover:border-[var(--accent-border)]'
      }`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
          selected ? 'text-[var(--accent)]' : 'text-[var(--text)]'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className={`font-semibold ${selected ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'}`}>
          {title}
        </p>
        <p className="text-sm text-[var(--text)] opacity-70">{description}</p>
      </div>
    </button>
  )
}

export function TriggerBottomSheet({
  isOpen,
  onClose,
  routineId,
  currentTrigger,
  onSave,
}: TriggerBottomSheetProps) {
  const [selectedType, setSelectedType] = useState<TriggerTypeOption>(
    currentTrigger?.timingType ?? TTT.SPECIFIC_TIME,
  )
  const [specificTime, setSpecificTime] = useState(currentTrigger?.specificTime ?? '')
  const [afterAction, setAfterAction] = useState(currentTrigger?.afterAction ?? '')
  const [location, setLocation] = useState(currentTrigger?.location ?? '')
  const [note, setNote] = useState(currentTrigger?.note ?? '')

  const handleSave = () => {
    const trigger: RoutineTrigger = {
      timingType: selectedType,
      ...(selectedType === TTT.SPECIFIC_TIME && specificTime ? { specificTime } : {}),
      ...(selectedType === TTT.AFTER_ACTION && afterAction ? { afterAction } : {}),
      ...(selectedType === TTT.LOCATION_BASED && location ? { location } : {}),
      ...(note ? { note } : {}),
    }
    onSave(routineId, trigger)
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="트리거 설정" maxHeight="90vh">
      <div className="space-y-4 pb-2">
        {/* 트리거 타입 선택 */}
        <div className="space-y-2">
          <TriggerTypeCard
            type={TTT.SPECIFIC_TIME}
            selected={selectedType === TTT.SPECIFIC_TIME}
            onSelect={() => setSelectedType(TTT.SPECIFIC_TIME)}
            icon={<Clock size={22} />}
            title="특정 시각"
            description="정해진 시간에 루틴을 시작합니다"
          />
          <TriggerTypeCard
            type={TTT.AFTER_ACTION}
            selected={selectedType === TTT.AFTER_ACTION}
            onSelect={() => setSelectedType(TTT.AFTER_ACTION)}
            icon={<Zap size={22} />}
            title="행동 직후"
            description="특정 행동을 마친 뒤 바로 시작합니다"
          />
          <TriggerTypeCard
            type={TTT.LOCATION_BASED}
            selected={selectedType === TTT.LOCATION_BASED}
            onSelect={() => setSelectedType(TTT.LOCATION_BASED)}
            icon={<MapPin size={22} />}
            title="장소 도착 시"
            description="특정 장소에 도착하면 시작합니다"
          />
        </div>

        {/* 타입별 입력 필드 */}
        {selectedType === TTT.SPECIFIC_TIME && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-h)]">시각</label>
            <input
              type="time"
              value={specificTime}
              onChange={(e) => setSpecificTime(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-h)] focus:border-[var(--accent)] focus:outline-none"
              aria-label="시각 입력"
            />
          </div>
        )}

        {selectedType === TTT.AFTER_ACTION && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-h)]">선행 행동</label>
            <input
              type="text"
              value={afterAction}
              onChange={(e) => setAfterAction(e.target.value)}
              placeholder="예: 점심 식사, 기상, 퇴근"
              className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-40 focus:border-[var(--accent)] focus:outline-none"
              aria-label="선행 행동 입력"
            />
          </div>
        )}

        {selectedType === TTT.LOCATION_BASED && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-h)]">장소</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 헬스장, 카페, 사무실"
              className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-40 focus:border-[var(--accent)] focus:outline-none"
              aria-label="장소 입력"
            />
          </div>
        )}

        {/* 메모 (선택) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text-h)]">
            메모 <span className="font-normal opacity-50">(선택)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="추가 메모"
            className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-[var(--text-h)] placeholder:text-[var(--text)] placeholder:opacity-40 focus:border-[var(--accent)] focus:outline-none"
            aria-label="메모 입력"
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="min-h-[56px] w-full rounded-2xl bg-[var(--accent)] font-semibold text-white transition-opacity hover:opacity-90"
          aria-label="트리거 저장"
        >
          저장
        </button>
      </div>
    </BottomSheet>
  )
}
