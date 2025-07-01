export type ProductProps = {
  id: number
  name: string
  category: number
  stock: number
  price: number
  mainImg: string
  images: string[]
  description: string
  size: string
  color: string
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

export type UserProps = {
  id: string
  name:string
  avatar_url: string
  created_at: string
  email: string
  password: string
}