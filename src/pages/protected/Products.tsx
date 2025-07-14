import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductProps, ProductDisplayProps, CategoryProps } from '../../types'
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Image } from 'lucide-react'
import { fetchCategory } from "../../utils/categoryUtils"
import { fetchProducts, groupingImages } from '../../utils/productUtils'
import CategorySelection from '../../Components/ui/categorySelection'
import Selection from '../../Components/ui/selection'

function Products() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<ProductDisplayProps[]>([])
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'price' | 'stock' | null>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [categoryFilter, setCategoryFilter] = useState<string | number>('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [colorFilter, setColorFilter] = useState('')
  const [sizeFilterData, setSizeFilterData] = useState<string[]>([])
  const [colorFilterData, setColorFilterData] = useState<string[]>([])
  const [category, setCategory] = useState<CategoryProps[]>([])
  const style = 'grid grid-cols-[70px_100px_150px_80px_90px_120px_80px_120px] lg:grid-cols-[70px_100px_1fr_80px_90px_120px_80px_120px] gap-2 items-center'

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        setCategory(categoryData)

        const newProductArr: ProductDisplayProps[] = []

        productData.forEach((p: ProductProps) => {
          const size = p.size.split('/')
          const color = p.color.split('/')
          const colorHex = p.colorHex.split('/')
          const stock = p.stock.split('/').map(row => row.split(',').map(Number))
          const groupedImages = groupingImages(p.imagesCount.split('/'), p.images)

          for (let i = 0; i < size.length; i++) {
            for (let j = 0; j < color.length; j++) {
              setSizeFilterData((prev) => {
                if (!prev.includes(size[i])) {
                  return [...prev, size[i]]
                }
                return prev
              })

              setColorFilterData((prev) => {
                if (!prev.includes(color[j])) {
                  return [...prev, color[j]]
                }
                return prev
              })

              const data: ProductDisplayProps = {
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: (stock[i][j].toString()),
                images: groupedImages[j],
                size: size[i],
                color: color[j],
                colorHex: colorHex[j],
              }
              newProductArr.push(data)
            }

          }
        })
        setProducts(newProductArr)
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

  const sortedProducts = [...products].filter(p =>
    (!categoryFilter || category[p.category - 1].name === categoryFilter) &&
    (!sizeFilter || p.size === sizeFilter) &&
    (!colorFilter || p.color === colorFilter)
  ).sort((a, b) => {
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
    <div className="container-overflow-x">
      <div className="p-8 w-max">
        <div className={`${style} h-12 bg-white rounded-xl font-bold text-sm mb-2`}>
          <div className='cursor-pointer h-5 flex itmes-center ml-4' onClick={() => toggleSort('id')}>ID <SortArrow field="id" /> </div>
          <CategorySelection disabled={false} option='Category' categoryIndex={categoryFilter} noPadding={true} setValue={setCategoryFilter} setLoading={setLoading} />
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('name')}>Name <SortArrow field="name" /></div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('price')}>Price <SortArrow field="price" /></div>
          <Selection value={sizeFilter} setValue={setSizeFilter} option='Size' data={sizeFilterData} />
          <Selection value={colorFilter} setValue={setColorFilter} option='Color' data={colorFilterData} />
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('stock')}>Stock <SortArrow field="stock" /></div>
          <p>IMG</p>
        </div>

        {sortedProducts.map((product, index) => (
          <div onClick={() => navigate(`/product/${product.id}`)} key={index}
            className={`${style} border-b border-gray-300 cursor-pointer`}>
            <p className='ml-4'>{product.id}</p>
            <p>{category[product.category - 1].name}</p>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <p>{product.size}</p>
            <p>{product.color}</p>
            <p>{product.stock}</p>
            <img src={product.images[0]} alt="Product" />
          </div>
        ))}

        {loading && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`${style} border-b border-gray-300 animate-pulse`}>
            <p className='ml-4 rounded-md w-8 h-6 bg-gray-200'></p>
            <p className='rounded-md w-[90%] h-6 bg-gray-200'></p>
            <p className='rounded-md w-[50%] h-6 bg-gray-200'></p>
            <p className='rounded-md w-6 h-6 bg-gray-200'></p>
            <p className='rounded-md w-18 h-6 bg-gray-200'></p>
            <div className='flex gap-2'>
              <p key={i} className='border border-gray-300 rounded-full w-5 aspect-square bg-gray-200'></p>
              <p className='rounded-md w-12 h-6 bg-gray-200'></p>
            </div>
            <p className='rounded-md w-6 h-6 bg-gray-200'></p>
            <div className='w-[120px] aspect-square bg-gray-200 grid place-items-center'>
              <Image className='text-gray-400' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products