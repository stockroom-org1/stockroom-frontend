import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/Products/ProductForm'
import Categories from './pages/Categories'
import StockMovements from './pages/StockMovements'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/stock-movements" element={<StockMovements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
