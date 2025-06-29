export type ProductProps = {
  id: number
  name: string
  category: string
  stock: number
  price: number
  mainImg: string
  images: string[]
  description: string
}

export type CategoryProps = {
  id: number
  name: string
  order: number
  optGroup: boolean
  groupID: number | null
}

export type GroupedCategory = {
  id: number
  name: string
  order: number
  children: CategoryProps[]
}