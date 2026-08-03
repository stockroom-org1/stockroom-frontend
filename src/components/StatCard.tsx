interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: 'blue' | 'green' | 'yellow' | 'red'
}

const colorMap: Record<NonNullable<StatCardProps['color']>, string> = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  yellow: 'border-yellow-500',
  red: 'border-red-500',
}

export default function StatCard({ label, value, sub, color = 'blue' }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 border-l-4 ${colorMap[color]} p-5`}
    >
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}
