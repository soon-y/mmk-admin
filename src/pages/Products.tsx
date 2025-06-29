import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductProps } from '../types'
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA } from 'lucide-react'

function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductProps[]>([])
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'price' | 'stock' | null>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://mmk-backend.onrender.com/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }

    fetchProducts()
  }, [])

  function toggleSort(field: 'id' | 'name' | 'price' | 'stock') {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  function SortArrow({ field }: { field: string }) {
    if (sortBy !== field) return null
    if (field === 'name') return sortDir === 'asc' ? <ArrowDownAZ className='w-5 ml-2' /> : <ArrowDownZA className='w-5 ml-2' />
    return sortDir === 'asc' ? <ArrowDown01 className='w-5 ml-2' /> : <ArrowDown10 className='w-5 ml-2' />
  }

  const sortedProducts = [...products]
    .filter(p => !categoryFilter || p.category === categoryFilter)
    .sort((a, b) => {
      if (!sortBy) return 0
      const valA = a[sortBy]
      const valB = b[sortBy]

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA
      }

      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

  return (
    <div className="container p-8">
      <div className="h-16 grid grid-cols-[60px_140px_1fr_10%_10%_100px] gap-2 bg-white p-4 rounded-xl font-bold text-sm mb-2 flex items-center">
        <div className='h-5 flex itmes-center' onClick={() => toggleSort('id')}>ID <SortArrow field="id" /> </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-transparent focus:outline-none"
        >
          <option value="">Category</option>
          <option value="tshirts">T-shirts</option>
          <option value="hoodies">Hoodies</option>
          <option value="cups">Cups</option>
          <option value="tote bags">Tote Bags</option>
          <option value="stationerys">Stationerys</option>
        </select>

        <div className='h-5 flex itmes-center' onClick={() => toggleSort('name')}>Name <SortArrow field="name" /></div>
        <div className='h-5 flex itmes-center' onClick={() => toggleSort('price')}>Price <SortArrow field="price" /></div>
        <div className='h-5 flex itmes-center' onClick={() => toggleSort('stock')}>Stock <SortArrow field="stock" /></div>
        <p>IMG</p>
      </div>

      {sortedProducts.map((product) => (
        <div onClick={() => navigate(`/product/${product.id}`)} key={product.id}
          className='grid grid-cols-[60px_140px_1fr_10%_10%_120px] gap-2 items-center border-b border-gray-300 cursor-pointer'>
          <p className='pl-4'>{product.id}</p>
          <p className='pl-5'>{product.category}</p>
          <p className='pl-4'>{product.name}</p>
          <p className='pl-4'>{product.price}</p>
          <p className='pl-4'>{product.stock}</p>
          <img src={product.mainImg} alt="Product" />
        </div>
      ))}

    </div>
  )
}

export default Products
