import axios from 'axios'

import type { CategoryProps, GroupedCategory } from "../types"

export const sortData = (categories: CategoryProps[]) => {
  const groups = categories
    .filter((cat) => cat.optGroup)
    .sort((a, b) => a.order - b.order)

  const items = categories
    .filter((cat) => !cat.optGroup)
    .sort((a, b) => a.order - b.order)

  const groupedData: GroupedCategory[] = groups.map((group) => ({
    id: group.id,
    name: group.name,
    order: group.order,
    image: group.image,
    children: items.filter((item) => item.groupID === group.id),
  }))

  return groupedData
}

export const fetchCategory = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/category')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return err
  }
}

export const updateCategory = async (data: FormData) => {
  try {
    const res = await axios.post('http://localhost:3000/category/replace', data)
    return res
  } catch (err: unknown) {
    const error = err as any
    console.error(error.response?.data || error.message || error)
  }
}