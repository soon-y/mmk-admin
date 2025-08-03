import axios from 'axios'
import type { CategoryProps, OrderedProductProps, OrderProps, ProductProps, SortedOrderProductProps, SortedOrderProps } from '../types'
import { fetchProduct, grouppingImgs } from './productUtils'
import { fetchCategory } from './categoryUtils'
import { getCustomerInfoByUserId } from './customerUtils'

export function stringToDate(dateString: string): string {
  const date = new Date(dateString)

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  const datePart = date.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '.')
  const timePart = date.toLocaleTimeString('en-GB', timeOptions)

  const result = datePart + ' at ' + timePart

  return `${dateString ? result : '-'}`
}


export const sortedOrders = async (orders: OrderProps[], orderedProducts: OrderedProductProps[]): Promise<SortedOrderProps[]> => {
  const array: SortedOrderProps[] = orders.map(order => ({
    ...order,
    products: [] as SortedOrderProductProps[]
  }))

  const categoryData = await fetchCategory()

  const promises = orderedProducts.map(async (p) => {
    const productData = await fetchProduct(p.productId)
    const product: ProductProps = productData.data

    const colorId = product.color.split('/').findIndex((item) => item === p.color)
    const img = grouppingImgs(product.images, product.imagesCount)[colorId][0]

    const categoryId = categoryData.findIndex((item: CategoryProps) => item.id === product.category)
    const categoryGroupId = categoryData.findIndex((item: CategoryProps) => item.id === categoryData[categoryId].groupID)

    const newArr: SortedOrderProductProps = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: p.color,
      colorIndex: colorId,
      size: p.size,
      image: img,
      category: categoryData[categoryId].name,
      categoryGroup: categoryData[categoryGroupId].name,
      qnt: p.quantity,
      total: p.total,
    }

    const orderIndex = array.findIndex((o) => o.orderId === p.orderId)
    if (orderIndex !== -1) {
      array[orderIndex].products.push(newArr)
    }
  })

  await Promise.all(promises)

  return array
}

export const fetchCustomerOrders = async (): Promise<OrderProps[] | null> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/orders/customer`)

    if (res.status === 200 || res.status === 201) {
      const order = res.data

      const newOrders = await Promise.all(
        order.map(async (el: OrderProps) => {
          const userInfo = await getCustomerInfoByUserId(el.userId)
          return {
            ...el,
            userInfo,
          }
        })
      )

      return newOrders
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const fetchOrderedProducts = async (user: string, orderId: string): Promise<OrderedProductProps[] | null> => {
  try {
    const products = await axios.get(`https://mmk-backend.onrender.com/orders/product`, {
      params: { user, orderId }
    })

    if (products.status === 200 || products.status === 201) {
      return products.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const updateOrderStatus = async (userId: string, orderId: string, status: string): Promise<boolean> => {
  try {
    const res = await axios.post(`https://mmk-backend.onrender.com/orders/update`, {userId, orderId, status} )

    if (res) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

export const fetchThisOrder = async (user: string, orderId: string): Promise<OrderProps[] | null> => {
  try {
    const res = await axios.get(`https://mmk-backend.onrender.com/orders/this`, {
      params: { user, orderId }
    })

    if (res.status === 200 || res.status === 201) {
      const newOrders = await Promise.all(
        res.data.map(async (el: OrderProps) => {
          const userInfo = await getCustomerInfoByUserId(el.userId)
          return {
            ...el,
            userInfo,
          }
        })
      )

      return newOrders
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}