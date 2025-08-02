export type ProductProps = {
  id: number
  name: string
  category: number
  price: number
  discount: number
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

export type CustomerProps = {
  id: string
  firstName: string
  lastName: string
  created_at: string
  contact: string
  email: string
  payment: string
}

export type ProductDisplayProps = {
  id: number
  name: string
  category: number
  discount: number
  price: number
  stock: string
  images: string[]
  size: string
  color: string
  colorHex: string
  created_at?: string
}

export type ProductSortedProps = {
  id: number
  name: string
  category: number
  price: number
  stock: number[][]
  images: string[][]
  description: string
  material: string
  size: string[]
  color: string[]
  colorHex: string[]
  imagesCount: number[]
  measurement: string
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

export type OrderProps = {
  orderId?: string
  userId: string
  status: string
  totalAmount: number
  discount: number
  paidAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingFee: number
  transactionId: string
  shippingAddr: string
  billingAddr: string
  shippingName: string
  billingName: string
  shippingContact: string
  billingContact: string
  created_at?: string
  userInfo?: {
    email: string
    firstName: string
    lastName: string
  }
}

export type OrderedProductProps = {
  orderId?: string
  productId: number
  size: string
  color: string
  quantity: number
  total: number
}

export type SortedOrderProps = {
  orderId?: string
  userId: string
  status: string
  totalAmount: number
  discount: number
  paidAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingFee: number
  transactionId: string
  shippingAddr: string
  billingAddr: string
  shippingName: string
  billingName: string
  shippingContact: string
  billingContact: string
  created_at?: string
  products: SortedOrderProductProps[]
  dateProcessingCompleted?: string,
  dateShipped?: string,
  dateDelivered?: string,
  userInfo?: {
    email: string
    firstName: string
    lastName: string
  }
}

export type SortedOrderProductProps = {
  id: number
  name: string
  price: number
  color: string
  colorIndex: number
  size: string
  image: string
  category: string
  categoryGroup: string
  qnt: number
  total: number
}

export type addressProps = {
  firstName: string
  lastName: string
  contact: string
  street: string
  postalCode: string
  city: string
  country: string
}