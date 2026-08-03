import { useState } from 'react'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from '../../hooks/useCategories'

export default function Categories() {
  const { data: categories, isLoading, isError } = useCategories()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  function handleDelete(id: string, categoryName: string) {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return
    deleteCategory.mutate(id)
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!name.trim()) return
    try {
      await createCategory.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
      })
      setName('')
      setDescription('')
    } catch {
      setFormError('Failed to create category. Please try again.')
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-slate-500 text-sm">Loading categories...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
        Failed to load categories. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {!categories || categories.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">
            No categories yet. Add one below.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-800">{cat.name}</td>
                    <td className="px-6 py-3 text-slate-500">{cat.description ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(cat.created_at)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleteCategory.isPending}
                        className="inline-flex items-center px-3 py-1 border border-red-200 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add category form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Add Category</h2>

        {formError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="flex-1">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name *"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {createCategory.isPending ? 'Adding…' : '+ Add Category'}
          </button>
        </form>
      </div>
    </div>
  )
}
