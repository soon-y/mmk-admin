export type ProductProps = {
  id: number
  name: string
  category: number
  price: number
  stock: string
  images: string[]
  description: string
  material: string
  size: string
  color: string
  colorHex: string
  imagesCount: string
  measurement: string
}

export type ProductDisplayProps = {
  id: number
  name: string
  category: number
  price: number
  stock: string
  images: string[]
  size: string
  color: string
  colorHex: string
}

export type CategoryProps = {
  id: number
  name: string
  order: number
  optGroup: boolean
  groupID: number | null
  image: string | File | null
}

export type GroupedCategory = {
  id: number
  name: string
  order: number
  image: string | File | null
  children: CategoryProps[]
}

export type UserProps = {
  id: string
  name:string
  avatar_url: string
  created_at: string
  email: string
  password: string
  admin: boolean
}

export type BannerProps = {
  id: number
  title: string
  text: string
  image: string | File | null
  order: number
  buttonName: string
  buttonLink: string
}