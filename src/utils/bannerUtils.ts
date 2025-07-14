import axios from 'axios'

import type { BannerProps } from "../types"

export const sortBanner = (items: BannerProps[]) => {
  const sorted = items.sort((a, b) => a.order - b.order)
  return sorted
}

export const fetchBanner = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/banner')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch banner:', err)
    return err
  }
}

export const updateBanner = async (data: FormData) => {
  try {
    const res = await axios.post('https://mmk-backend.onrender.com/replace', data)
    return res
  } catch (err: unknown) {
    const error = err as any
    console.error(error.response?.data || error.message || error)
  }
}