import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useStockMovements } from '../hooks/useStockMovements'
import StatCard from '../components/StatCard'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Dashboard() {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts()
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories()
  const {
    data: movements,
    isLoading: movementsLoading,
    isError: movementsError,
  } = useStockMovements()

  const isLoading = productsLoading || categoriesLoading || movementsLoading
  const isError = productsError || categoriesError || movementsError

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-slate-500 text-sm">Loading dashboard...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        Failed to load dashboard data. Please try again.
      </div>
    )
  }

  const totalProducts = products?.length ?? 0
  const lowStockCount = products?.filter((p) => p.quantity_in_stock < 5).length ?? 0
  const totalCategories = categories?.length ?? 0
  const recentMovements = [...(movements ?? [])].reverse().slice(0, 10)

  // Build a quick product ID → name map
  const productMap = new Map((products ?? []).map((p) => [p.id, p.name]))

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={totalProducts} color="blue" />
        <StatCard
          label="Low Stock"
          value={lowStockCount}
          sub="quantity < 5"
          color={lowStockCount > 0 ? 'red' : 'green'}
        />
        <StatCard label="Categories" value={totalCategories} color="green" />
      </div>

      {/* Recent movements */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-700">Recent Stock Movements</h2>
        </div>
        {recentMovements.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">No movements recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {recentMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-xs text-slate-600">
                      {productMap.get(m.product_id) ?? m.product_id.slice(0, 8) + '…'}
                    </td>
                    <td className="px-6 py-3">
                      {m.movement_type === 'in' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                          IN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                          OUT
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{m.quantity}</td>
                    <td className="px-6 py-3 text-slate-500">{m.reason ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(m.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
