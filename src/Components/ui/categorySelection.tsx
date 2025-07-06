import { useEffect, useState } from 'react'
import type { GroupedCategory, CategoryProps } from '../../types'
import { sortData, fetchCategory } from '../../utils/categoryUtils'

export default function CategorySelection(
  {
    categoryIndex, option, setValue, setLoading, noPadding, disabled
  }: {
    noPadding: boolean,
    categoryIndex: string | number,
    option: string
    disabled: boolean
    setValue: React.Dispatch<React.SetStateAction<string | number>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  }) {

  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const [category, setCategory] = useState<CategoryProps[]>([])

  useEffect(() => {
    fetchCategory().then((data) => {
      setCategories(sortData(data))
      setCategory(data)
      setLoading(false)
    })
  }, [])

  return (
    <select
      required
      value={typeof categoryIndex === 'number' && category[categoryIndex - 1] ? category[categoryIndex - 1].name : categoryIndex}
      onChange={(e) => setValue(e.target.value)}
      className={`cursor-pointer w-full rounded-xl bg-white appearance-none focus:outline-none ${noPadding ? '' : 'px-4 py-2'}`}
    >
      <option value="" disabled={disabled}>{option}</option>
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
  )
}