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