import { useState } from 'react'
import { useStockMovements, useCreateStockMovement } from '../../hooks/useStockMovements'
import { useProducts } from '../../hooks/useProducts'

export default function StockMovements() {
  const { data: movements, isLoading: loadingMovements, isError: movementsError } = useStockMovements()
  const { data: products, isLoading: loadingProducts } = useProducts()
  const createMovement = useCreateStockMovement()

  const [productId, setProductId] = useState('')
  const [movementType, setMovementType] = useState<'in' | 'out'>('in')
  const [quantity, setQuantity] = useState('1')
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const productMap = new Map((products ?? []).map((p) => [p.id, p.name]))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!productId) {
      setFormError('Please select a product.')
      return
    }
    const qty = Number(quantity)
    if (!qty || qty <= 0) {
      setFormError('Quantity must be a positive number.')
      return
    }
    try {
      await createMovement.mutateAsync({
        product_id: productId,
        movement_type: movementType,
        quantity: qty,
        reason: reason.trim() || null,
      })
      setProductId('')
      setMovementType('in')
      setQuantity('1')
      setReason('')
    } catch {
      setFormError('Failed to record movement. Please try again.')
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isLoading = loadingMovements || loadingProducts

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-slate-500 text-sm">Loading stock movements...</div>
      </div>
    )
  }

  if (movementsError) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        Failed to load stock movements. Please try again.
      </div>
    )
  }

  const sortedMovements = [...(movements ?? [])].reverse()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Movements table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {sortedMovements.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">
            No movements recorded yet. Record one below.
          </p>
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
                {sortedMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-800">
                      {productMap.get(m.product_id) ?? (
                        <span className="font-mono text-xs text-slate-400">
                          {m.product_id.slice(0, 8)}…
                        </span>
                      )}
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

      {/* Record movement form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Record Movement</h2>

        {formError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product <span className="text-red-500">*</span>
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">— Select product —</option>
                {(products ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Movement Type <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-md overflow-hidden border border-slate-300">
                <button
                  type="button"
                  onClick={() => setMovementType('in')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    movementType === 'in'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  IN
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('out')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors border-l border-slate-300 ${
                    movementType === 'out'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  OUT
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional reason..."
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={createMovement.isPending}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {createMovement.isPending ? 'Recording…' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
