import { useEffect, useState } from 'react'
import type { CategoryProps, ProductProps } from '../../types'
import { fetchCategory } from '../../utils/categoryUtils'
import { fetchProducts } from '../../utils/productUtils'

export default function BannerLinkSelection(
  {
    option, setValue, value
  }: {
    value: string
    option: string
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) {

  const [selection, setSelection] = useState<string[]>([])

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {

        const Array: string[] = []

        categoryData.map((el: CategoryProps) => Array.push(el.name))
        productData.map((el: ProductProps) => Array.push(el.name))

        setSelection(Array)
      })

  }, [])

  return (
    <select
      required
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`px-4 border border-gray-400 h-[40px] cursor-pointer w-full rounded-xl bg-white appearance-none focus:outline-none`}
    >
      <option value="">{option}</option>
      {selection.map((el, i) => (
        <option value={el} key={i}>
          {el}
        </option>
      ))}
    </select>
  )
}