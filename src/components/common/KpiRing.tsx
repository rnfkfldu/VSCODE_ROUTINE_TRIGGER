interface KpiRingProps {
  value: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  animate?: boolean
}

export function KpiRing({
  value,
  size = 100,
  strokeWidth = 10,
  showLabel = true,
  animate = true,
}: KpiRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.min(value, 100)
  const dashOffset = circumference - (clampedValue / 100) * circumference

  const color =
    value < 60 ? '#ef4444' : value <= 80 ? '#eab308' : '#22c55e'

  const cx = size / 2
  const cy = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`KPI ${Math.round(value)}%`}
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={
          animate
            ? { transition: 'stroke-dashoffset 0.7s ease, stroke 0.7s ease' }
            : undefined
        }
      />
      {showLabel && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.2}
          fontWeight="700"
          fill="var(--text-h)"
        >
          {Math.round(value)}%
        </text>
      )}
    </svg>
  )
}
