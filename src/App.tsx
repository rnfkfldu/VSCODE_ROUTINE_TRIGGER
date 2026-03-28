import { useState } from 'react'
import type { TabKey } from './types/tabs'
import { AppHeader } from './components/layout/AppHeader'
import { BottomTabBar } from './components/layout/BottomTabBar'
import { SetupScreen } from './screens/SetupScreen'
import { LabScreen } from './screens/LabScreen'
import { ScheduleScreen } from './screens/ScheduleScreen'
import { TriggersScreen } from './screens/TriggersScreen'
import { ReviewScreen } from './screens/ReviewScreen'

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('setup')

  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-2">
        {activeTab === 'setup' && <SetupScreen onNext={() => setActiveTab('lab')} />}
        {activeTab === 'lab' && <LabScreen />}
        {activeTab === 'schedule' && <ScheduleScreen />}
        {activeTab === 'daily' && <TriggersScreen />}
        {activeTab === 'review' && <ReviewScreen />}
      </main>
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
