import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'

interface FormState {
  sku: string
  name: string
  category_id: string
  description: string
  unit_price: string
  quantity_in_stock: string
}

const empty: FormState = {
  sku: '',
  name: '',
  category_id: '',
  description: '',
  unit_price: '',
  quantity_in_stock: '0',
}

export default function ProductForm() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: existing, isLoading: loadingProduct } = useProduct(id ?? '')
  const { data: categories, isLoading: loadingCategories } = useCategories()

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [form, setForm] = useState<FormState>(empty)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (existing) {
      setForm({
        sku: existing.sku,
        name: existing.name,
        category_id: existing.category_id ?? '',
        description: existing.description ?? '',
        unit_price: existing.unit_price,
        quantity_in_stock: String(existing.quantity_in_stock),
      })
    }
  }, [existing])

  const isLoading = (isEdit && loadingProduct) || loadingCategories
  const isPending = createProduct.isPending || updateProduct.isPending

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category_id: form.category_id || null,
      description: form.description.trim() || null,
      unit_price: form.unit_price,
      quantity_in_stock: Number(form.quantity_in_stock),
    }

    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, ...payload })
      } else {
        await createProduct.mutateAsync(payload)
      }
      navigate('/products')
    } catch {
      setFormError('Failed to save product. Please check your inputs and try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
        {formError && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {formError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            required
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. WIDGET-001"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">— None —</option>
            {(categories ?? []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional description..."
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Unit Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unit_price"
              required
              min="0"
              step="0.01"
              value={form.unit_price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Qty in Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity_in_stock"
              required
              min="0"
              step="1"
              value={form.quantity_in_stock}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-5 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
