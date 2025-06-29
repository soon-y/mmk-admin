import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { X, Plus, ImagePlus } from "lucide-react"
import axios from 'axios'
import LoadingBar from './LoadingBar'
import type { ProductProps, GroupedCategory } from '../types'
import { sortData, fetchCategory } from '../utils/categoryUtils'

function ProductForm({ product }: { product: ProductProps | '' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileInputRefMain = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>(product === '' ? '' : product.name)
  const [price, setPrice] = useState<string>(product === '' ? '' : product.price.toString())
  const [stock, setStock] = useState<string>(product === '' ? '' : product.stock.toString())
  const [description, setDescription] = useState<string>(product === '' ? '' : product.description)
  const [existingImages, setExistingImages] = useState<string[]>(product === '' ? [] : product.images)
  const [existingMainImg, setExistingMainImages] = useState<string>(product === '' ? '' : product.mainImg)
  const [images, setImages] = useState<File[]>([])
  const [mainImg, setMainImg] = useState<File | null>(null)
  const [category, setCategory] = useState(product === '' ? '' : product.category)
  const [categories, setCategories] = useState<GroupedCategory[]>([])

  useEffect(() => {
    fetchCategory().then((data) => {
      setCategories(sortData(data))
      setLoading(false)
    })
  }, [])

  const handleImageChangeMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImg(file)
      setExistingMainImages('')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
    e.target.value = ''
  }

  const removeImageMain = () => {
    setMainImg(null)
    setExistingMainImages('')
  }

  const removeImage = (index: number) => {
    setImages(images => images.filter((_, i) => i !== index))
  }

  function removeExistingImage(indexToRemove: number) {
    setExistingImages(existingImages.filter((_, i) => i !== indexToRemove))
  }

  const addImage = () => {
    fileInputRef.current?.click()
  }

  const addImageMain = () => {
    fileInputRefMain.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!(mainImg || existingMainImg)) {
      alert('Please attach main image!')
      return
    } else {
      setLoading(true)
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category', category)
    formData.append('description', description)
    if (mainImg) {
      formData.append('mainImg', mainImg)
    }
    Array.from(images).forEach((file) => {
      formData.append('files', file)
    })

    if (product === '') {
      try {
        const res = await axios.post('https://mmk-backend.onrender.com/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (res.data) {
          setLoading(false)
          navigate('/products')
        }
      } catch (err: unknown) {
        const error = err as any
        console.error(error.response?.data || error.message || error)
      }
    } else {
      formData.append('existingMainImg', existingMainImg)
      Array.from(existingImages).forEach((url) => {
        formData.append('existingImages', url)
      })

      try {
        const res = await axios.patch(`https://mmk-backend.onrender.com/products/${product.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (res.data) {
          setLoading(false)
          navigate('/products')
        }
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }
  }

  const deleteProduct = async () => {
    if (product) {
      try {
        const res = await axios.delete(`https://mmk-backend.onrender.com/products/${product.id}`)

        if (res.data.message === 'Product deleted') {
          setLoading(false)
          navigate('/products')
        }
      } catch (err: unknown) {
        const error = err as any
        console.error(error.response?.data || error.message || error)
      }
    }
  }

  return (
    <div className="container p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold cursor-pointer" onClick={addImageMain}>
            Attach Main Image
            <Plus className='ml-2 inline bg-white rounded-full p-1 border border-gray-300' />
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChangeMain}
            className='hidden'
            ref={fileInputRefMain}
          />
        </div>

        {!mainImg && existingMainImg === '' &&
          <div onClick={addImageMain} className='cursor-pointer w-[50%] aspect-square bg-white rounded-xl grid place-items-center'>
            <ImagePlus />
          </div>
        }

        {mainImg && (
          <div className="relative w-[50%] aspect-square ">
            <img
              src={URL.createObjectURL(mainImg)}
              alt='mainImg'
              className="w-full h-full object-cover rounded-xl"
            />
            <X
              onClick={() => removeImageMain()}
              className="cursor-pointer text-black absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
            />
          </div>
        )}

        {existingMainImg && (
          <div className="relative w-[50%] aspect-square ">
            <img
              src={existingMainImg}
              alt='mainImg'
              className="w-full h-full object-cover rounded-xl"
            />
            <X
              onClick={() => removeImageMain()}
              className="cursor-pointer text-black absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
            />
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">
          Product Name
        </label>
        <input
          id="product-name"
          className="w-full rounded-xl bg-white p-4"
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">
          Category
        </label>

        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl bg-white p-4 appearance-none"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((group) => (
            <optgroup label={group.name} key={group.id}>
              {group.children.map((sub) => (
                <option value={sub.name} key={sub.id}>
                  {sub.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className='flex w-full space-x-4'>
          <div className='w-[50%]'>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-price">
              Price
            </label>
            <input
              id="product-price"
              className="w-full rounded-xl bg-white p-4"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => Number(e.target.value) > 0 ? setPrice(e.target.value) : ''}
              required
            />
          </div>

          <div className='w-[50%]'>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-stock">
              Stock
            </label>
            <input
              id="product-stock"
              className="w-full rounded-xl bg-white p-4"
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => Number(e.target.value) > 0 ? setStock(e.target.value) : ''}
              required
            />
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-Description">
          Description
        </label>
        <textarea
          className="w-full rounded-xl bg-white p-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div>
          <label className="font-semibold cursor-pointer" onClick={addImage}>
            Attach Sub Images
            <Plus className='ml-2 inline bg-white rounded-full p-1 border border-gray-300' />
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className='hidden'
            ref={fileInputRef}
          />
        </div>

        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((file, index) => (
              <div key={index} className="relative w-[25%] aspect-square ">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`attachment-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <X
                  onClick={() => removeImage(index)}
                  className="cursor-pointer text-black absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
                />
              </div>
            ))}
          </div>
        )}

        {existingImages.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative w-[25%] aspect-square">
                <img
                  src={url}
                  alt={`existing-image-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <X
                  onClick={() => removeExistingImage(index)}
                  className="cursor-pointer text-black absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit">
          {location.pathname.includes('new') ? 'Add Product' : 'Update Product'}
        </button>

        {!location.pathname.includes('new') &&
          <button type="button" className='float-right' onClick={deleteProduct}>
            delete
          </button>
        }
      </form>

      {loading && <LoadingBar />}

    </div>
  )
}

export default ProductForm