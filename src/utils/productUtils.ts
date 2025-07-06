import axios from 'axios'

export const fetchProducts = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/products')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

export const groupingImages = (existingImagesCount: string[], images: string[]) => {
  const groupedImages: string[][] = []
  let start = 0

  for (const count of existingImagesCount) {
    groupedImages.push(images.slice(start, start + Number(count)))
    start += Number(count)
  }

  return groupedImages
}

export const postProducts = async (formData: FormData) => {
  try {
    const res = await axios.post('http://localhost:3000/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  } catch (err: unknown) {
    const error = err as any
    console.error(error.response?.data || error.message || error)
  }
}

export const updateProduct = async (id: number, formData: FormData) => {
  try {
    const res = await axios.post(`http://localhost:3000/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  } catch (err: unknown) {
    const error = err as any
    console.error(error.response?.data || error.message || error)
  }
}

export const deleteProduct  = async (id: number) => {
  try {
    const res = await axios.delete(`https://mmk-backend.onrender.com/products/${id}`)
    return res
  } catch (err: unknown) {
    const error = err as any
    console.error(error.response?.data || error.message || error)
  }
}