import ProductForm from '../Components/ProductForm'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { ProductProps } from '../types'

function ProductDetail() {
  const [product, setProduct] = useState<ProductProps>()
  const { id } = useParams()

  useEffect(() => {
    axios.get(`https://mmk-backend.onrender.com/products/${id}`).then((res) => {
      setProduct(res.data)
    })
  }, [id])

  if (!product) return

  return (
    <ProductForm product={product} />
  )
}

export default ProductDetail