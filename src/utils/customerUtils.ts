import axios from 'axios'
import type { addressProps, CustomerProps, OrderProps } from '../types'

export const getCustomers = async (): Promise<CustomerProps[] | null> => {
  try {
    const res = await axios.get(`http://localhost:3000/users/customers`)

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getCustomerInfoByUserId = async (user: string): Promise<CustomerProps | null> => {
  try {
    const res = await axios.get(`http://localhost:3000/users/customerInfo`, {
      params: { user }
    })

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getCustomerAddressByUserId = async (user: string): Promise<addressProps | null> => {
  try {
    const res = await axios.get(`http://localhost:3000/users/customerAddress`, {
      params: { user }
    })

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getCustomerBillingAddressByUserId = async (user: string): Promise<addressProps | null> => {
  try {
    const res = await axios.get(`http://localhost:3000/users/customerBillingAddress`, {
      params: { user }
    })

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getCustomerOrdersByUserId = async (user: string): Promise<OrderProps[] | null> => {
  try {
    const res = await axios.get(`http://localhost:3000/users/customerOrders`, {
      params: { user }
    })

    if (res.status === 200 || res.status === 201) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}
