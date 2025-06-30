import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductProps, GroupedCategory } from '../../types'
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Image } from 'lucide-react'
import { sortData, fetchCategory } from "../../utils/categoryUtils"
import { fetchProducts } from '../../utils/productUtils'

function Products() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<ProductProps[]>([])
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'price' | 'stock' | null>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const [category, setCategory] = useState<GroupedCategory[]>([])

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        setCategories(sortData(categoryData))
        setCategory(categoryData)
        setProducts(productData)
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err)
      })
      .finally(() => {
        setLoading(false)
      })
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
    .filter(p => !categoryFilter || category[p.category-1].name === categoryFilter)
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
        <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('id')}>ID <SortArrow field="id" /> </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-transparent focus:outline-none"
        >
          <option value="">Category</option>
          {categories.map((group) => (
            <optgroup label={group.name} key={group.id}>
              {group.children.map((sub) => (
                <option value={sub.name} key={sub.id}>
                  {sub.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('name')}>Name <SortArrow field="name" /></div>
        <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('price')}>Price <SortArrow field="price" /></div>
        <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('stock')}>Stock <SortArrow field="stock" /></div>
        <p>IMG</p>
      </div>

      {sortedProducts.map((product) => (
        <div onClick={() => navigate(`/product/${product.id}`)} key={product.id}
          className='grid grid-cols-[60px_140px_1fr_10%_10%_120px] gap-2 items-center border-b border-gray-300 cursor-pointer'>
          <p className='pl-4'>{product.id}</p>
          <p className='pl-5'>{category[product.category-1].name}</p>
          <p className='pl-4'>{product.name}</p>
          <p className='pl-4'>{product.price}</p>
          <p className='pl-4'>{product.stock}</p>
          <img src={product.mainImg} alt="Product" />
        </div>
      ))}

      {loading && Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className='grid grid-cols-[60px_140px_1fr_10%_10%_120px] gap-2 items-center border-b border-gray-300'>
          <p className='ml-4 rounded-md w-8 h-6 bg-gray-200 animate-pulse'></p>
          <p className='ml-5 rounded-md w-14 h-6 bg-gray-200 animate-pulse'></p>
          <p className='ml-4 rounded-md w-[50%] h-6 bg-gray-200 animate-pulse'></p>
          <p className='ml-4 rounded-md w-8 h-6 bg-gray-200 animate-pulse'></p>
          <p className='ml-4 rounded-md w-8 h-6 bg-gray-200 animate-pulse'></p>
          <div className='w-[120px] aspect-square bg-gray-200 animate-pulse grid place-items-center'>
            <Image className='text-gray-400' />
          </div>
        </div>
      ))}

    </div>
  )
}

export default Products