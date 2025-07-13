import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { X, ImagePlus, MinusCircle } from "lucide-react"
import LoadingBar from './LoadingBar'
import type { ProductProps, CategoryProps } from '../types'
import { fetchCategory } from '../utils/categoryUtils'
import EditableName from './ui/EditableName'
import { Palette } from './Palette'
import { groupingImages, postProducts, updateProduct, deleteProduct } from '../utils/productUtils'
import Input from './ui/input'
import TextArea from './ui/textArea'
import CategorySelection from './ui/categorySelection'
import Label from './ui/label'
import PlusBtn from './ui/plusBtn'

function ProductForm({ product }: { product: ProductProps | '' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>(product === '' ? '' : product.name)
  const [price, setPrice] = useState<string>(product === '' ? '' : product.price.toString())
  const [size, setSize] = useState<string[]>(product === '' ? ['one size'] : product.size.split('/'))
  const [color, setColor] = useState<string[]>(product === '' ? ['White'] : product.color.split('/'))
  const [stock, setStock] = useState<number[][]>(product === '' ? [[0]] : product.stock.split('/').map(row => row.split(',').map(Number)))
  const [colorHex, setColorHex] = useState<string[]>(product === '' ? ['#ffffff'] : product.colorHex.split('/'))
  const [description, setDescription] = useState<string>(product === '' ? '' : product.description)
  const [material, setMaterial] = useState<string>(product === '' ? '' : product.material)
  const [measurement, setMeasurement] = useState<string>(product === '' ? '' : product.measurement)
  const [existingImages, setExistingImages] = useState<string[][]>([])
  const [images, setImages] = useState<File[][]>([])
  const [imagesCount, setImagesCount] = useState<string[]>(['0'])
  const [existingImagesCount, setExistingImagesCount] = useState<string[]>(product === '' ? ['0'] : product.imagesCount.split('/'))
  const [categoryIndex, setCategoryIndex] = useState<number | string>(product === '' ? '' : product.category)
  const [deletedColorIndex, setDeletedColorIndex] = useState<number | null>(null)
  const [deletedSizeIndex, setDeletedSizeIndex] = useState<number | null>(null)
  const [category, setCategory] = useState<CategoryProps[]>([])

  useEffect(() => {
    fetchCategory().then((data) => {
      setCategory(data)
      setLoading(false)
    })

    if (product) {
      const groupedImages = groupingImages(existingImagesCount, product.images)
      setExistingImages(groupedImages)
      setImagesCount(Array(existingImagesCount.length).fill('0'))
    }
  }, [])

  const addImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = Array.from(e.target.files || [])

    setImages(prev => {
      const temp = [...prev]
      temp[index] = temp[index] ? [...temp[index], ...files] : [...files]
      return temp
    })

    setImagesCount(prev =>
      prev.map((count, i) =>
        i === index ? (Number(count) + 1).toString() : count
      )
    )

    e.target.value = ''
  }

  const removeImage = (colorIndex: number, imageIndex: number) => {
    setImages(prev =>
      prev.map((group, i) =>
        i === colorIndex ? group.filter((_, j) => j !== imageIndex) : group
      )
    )

    setImagesCount(prev =>
      prev.map((count, i) =>
        i === imageIndex ? (Number(count) - 1).toString() : count
      )
    )
  }

  function removeExistingImage(colorIndex: number, imageIndex: number) {
    setExistingImages(prev =>
      prev.map((group, i) =>
        i === colorIndex ? group.filter((_, j) => j !== imageIndex) : group
      )
    )

    setExistingImagesCount(prev =>
      prev.map((count, i) =>
        i === colorIndex ? (Number(count) - 1).toString() : count
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)
    formData.append('material', material)
    formData.append('measurement', measurement)
    formData.append('size', size.join('/'))
    formData.append('color', color.join('/'))
    formData.append('colorHex', colorHex.join('/'))
    formData.append('stock', stock.join('/'))

    if (typeof categoryIndex === 'string') {
      const matched = category.find((item) => item.name === categoryIndex)
      if (matched) formData.append('category', (matched.id).toString())
    } else {
      formData.append('category', categoryIndex.toString())
    }

    if (product === '') {
      images.flat().forEach(file => { formData.append('files', file) })

      if (imagesCount.includes('0')) {
        alert('Please attach images!')
        return
      } else {
        setLoading(true)
        formData.append('imagesCount', imagesCount.join('/'))
      }

      const res = await postProducts(formData)
      if (res) {
        setLoading(false)
        navigate('/products')
      } else {

      }

    } else {
      formData.append('originalOrderCount', existingImagesCount.join('/'))
      formData.append('newOrderCount', imagesCount.join('/'))
      const maxLength = Math.max(existingImagesCount.length, imagesCount.length)
      const imgCounts: number[] = Array.from({ length: maxLength }, (_, i) => (Number(existingImagesCount[i] ?? 0)) + (Number(imagesCount[i] ?? 0)))
      formData.append('imagesCount', imgCounts.join('/'))

      if (imgCounts.includes(0)) {
        alert('Please attach images!')
        return
      } else {
        setLoading(true)
      }

      const flatImages = existingImages.flat()
      if (flatImages.length > 0) {
        flatImages.forEach(file => {
          formData.append('existingImages', file)
        })
      } else {
        formData.append('existingImages', '[]')
      }

      images.flat().forEach(file => {
        formData.append('files', file)
      })

      const res = await updateProduct(product.id, formData)
      if (res) {
        setLoading(false)
        navigate('/products')
      } else {

      }
    }
  }

  const deleteAction = async () => {
    if (product) {
      const res = await deleteProduct(product.id)

      if (res && res.data.message === 'Product deleted') {
        setLoading(false)
        navigate('/products')
      }
    }
  }

  const updateStock = (i: number, j: number, value: number) => {
    setStock(prev =>
      prev.map((row, rowIndex) =>
        rowIndex === i
          ? row.map((col, colIndex) => (colIndex === j ? value : col))
          : row
      )
    )
  }

  useEffect(() => {
    if (deletedSizeIndex !== null) { setStock(stock.filter((_, i) => i !== deletedSizeIndex)) }
  }, [deletedSizeIndex])

  useEffect(() => {
    if (deletedColorIndex !== null) {
      setStock(stock.map(row => row.filter((_, j) => j !== deletedColorIndex)))
      setImages(images.map(row => row.filter((_, j) => j !== deletedColorIndex)))
      setColor(prev => prev.filter((_, index) => index !== deletedColorIndex))
      setColorHex(prev => prev.filter((_, index) => index !== deletedColorIndex))
    }
  }, [deletedColorIndex])

  return (
    <div className="container p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label name='Product Name' />
        <Input label='Product Name' type='text' value={name} setValue={setName} />
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <Label name='Category' />
            <CategorySelection disabled={true} option='Select a category' noPadding={false}
              setValue={setCategoryIndex}
              setLoading={setLoading}
              categoryIndex={categoryIndex} />
          </div>

          <div>
            <Label name='Price (€)' />
            <Input label='Price' type='number' value={price} setValue={setPrice} />
          </div>

          <div>
            <Label name='Size' />
            <PlusBtn onClick={() => {
              setSize(prev => [...prev, 'size ' + prev.length])
              setStock(prev => [...prev, new Array(color.length).fill(0)])
            }} />
            <div className='bg-white px-4 py-2 rounded-xl my-2'>
              {size.map((item, index) => (
                <EditableName name={item} id={index} arrayLength={size.length} setArray={setSize} key={index} setDeletedIndex={setDeletedSizeIndex} />
              ))}
            </div>
          </div>

          <div>
            <Label name='Color' />
            <PlusBtn onClick={() => {
              setColor(prev => [...prev, 'White'])
              setColorHex(prev => [...prev, '#ffffff'])
              setStock(prev => prev.map(row => [...row, 0]))
              setImages(prev => [...prev, []])
              setImagesCount(prev => [...prev, '0'])
            }} />

            <div className='bg-white px-4 py-3 rounded-xl my-2 grid gap-2'>
              {color.map((item, index) => (
                <div key={index} className='grid md:grid-cols-2 gap-1 items-center'>
                  <div className='flex gap-1'>
                    <p>{item}</p>
                    {color.length > 1 && <MinusCircle className='pointer-cursor w-5 text-red-500' strokeWidth={1} onClick={() => setDeletedColorIndex(index)} />}
                  </div>
                  <div className='flex'>
                    <Palette index={index} setColorArray={setColor} setColorHex={setColorHex} initial={colorHex[index]}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Label name='Stock' />
        <div>
          {size.map((s, i) => (
            color.map((c, j) => (
              <div key={`${i}-${j}`} className="grid md:grid-cols-2 gap-2 my-2 items-center">
                <p>{s} - {c}</p>
                <input
                  className="w-full rounded-xl bg-white px-4 py-2"
                  type="number"
                  value={stock[i][j]}
                  onChange={(e) => updateStock(i, j, Number(e.target.value))}
                  required
                />
              </div>
            ))
          ))}
        </div>

        <TextArea label='Description' value={description} setValue={setDescription} />
        <TextArea label='Material' value={material} setValue={setMaterial} />
        <TextArea label='Measurement' value={measurement} setValue={setMeasurement} />

        <Label name='Images' />
        {color.map((color, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-2 my-2 items-center">
            <div>
              <p className='inline-block'>{color}</p>
              <PlusBtn onClick={() => fileInputRefs.current[i]!.click()} />
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addImage(e, i)}
              className="hidden"
              ref={el => { fileInputRefs.current[i] = el }}
            />

            <div className="grid grid-cols-4 gap-2 mb-2">
              {existingImages.length > 0 && (
                existingImages[i].map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`image-${index}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <X
                      onClick={() => removeExistingImage(i, index)}
                      className="cursor-pointer text-gray-700 absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
                    />
                  </div>
                ))
              )}

              {images[i]?.length > 0 && (
                images[i].map((file, index) => (
                  <div key={index} className="relative block aspect-square ">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`attachment-${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <X
                      onClick={() => removeImage(i, index)}
                      className="cursor-pointer text-gray-700 absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
                    />
                  </div>
                ))
              )}

              <div className="mb-2 rounded-lg aspect-square bg-white grid place-items-center cursor-pointer hover:opacity-50 duration-500" onClick={() => { fileInputRefs.current[i]!.click() }}>
                <ImagePlus className='text-gray-400' />
              </div>
            </div>
          </div>
        ))}

        <button type="submit">
          {location.pathname.includes('new') ? 'Add Product' : 'Update Product'}
        </button>

        {!location.pathname.includes('new') &&
          <button type="button" className='float-right' onClick={deleteAction}>
            delete
          </button>
        }
      </form>

      {loading && <LoadingBar />}

    </div>
  )
}

export default ProductForm