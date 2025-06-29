export const fetchProducts = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/products')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}