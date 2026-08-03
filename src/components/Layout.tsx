import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/products', label: 'Products', exact: false },
  { to: '/categories', label: 'Categories', exact: false },
  { to: '/stock-movements', label: 'Stock Movements', exact: false },
]

function pageTitleFromPath(pathname: string): string {
  if (pathname === '/') return 'Dashboard'
  if (pathname.startsWith('/products/new')) return 'New Product'
  if (pathname.match(/^\/products\/.+\/edit$/)) return 'Edit Product'
  if (pathname.startsWith('/products')) return 'Products'
  if (pathname.startsWith('/categories')) return 'Categories'
  if (pathname.startsWith('/stock-movements')) return 'Stock Movements'
  return 'Stockroom'
}

export default function Layout() {
  const location = useLocation()
  const pageTitle = pageTitleFromPath(location.pathname)

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white shadow-md flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-800">&#x1F4E6; Stockroom</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">Warehouse Management</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
