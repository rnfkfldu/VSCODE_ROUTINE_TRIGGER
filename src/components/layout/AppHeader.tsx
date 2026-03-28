/**
 * AppHeader — THE ENGINE 앱 헤더
 * sticky top-0, 블러 배경 효과 적용.
 */

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-h)]">
            THE ENGINE
          </h1>
          <p className="text-xs text-[var(--text)]">데이터 기반 인생 최적화</p>
        </div>

        {/* 주간 상태 배지 — 향후 실제 데이터 연결 예정 */}
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--accent)]">Live</span>
        </div>
      </div>
    </header>
  )
}
