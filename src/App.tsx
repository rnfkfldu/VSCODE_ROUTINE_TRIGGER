import { AppHeader } from './components/layout/AppHeader'
import { TimeWizard } from './components/widgets/TimeWizard/TimeWizard'

function App() {
  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--text)]">
      <AppHeader />
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <TimeWizard />
        {/* 향후 위젯 추가 위치: Resource Lab, Dashboard, Weekly Insight */}
      </main>
    </div>
  )
}

export default App
