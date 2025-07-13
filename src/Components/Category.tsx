import { useState, useEffect, useRef } from "react"
import type { GroupedCategory, ProductProps, CategoryProps } from "../types"
import { Trash2, Plus, ChevronDown, ChevronUp, ListTree, ImagePlus } from "lucide-react"
import CategoryName from "./ui/CategoryName"
import { sortData, fetchCategory, updateCategory } from "../utils/categoryUtils"
import { fetchProducts } from "../utils/productUtils"
import LoadingBar from "./LoadingBar"
import { X } from "lucide-react"

export default function Category() {
  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const [products, setProducts] = useState<ProductProps[]>([])
  const [arrayInit, setArrayInit] = useState<CategoryProps[]>([])
  const [categoryArray, setCategoryArray] = useState<CategoryProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [changeDetected, setChangeDetected] = useState<boolean>(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const btnStyleGroup = 'cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7'
  const btnStyleChild = 'cursor-pointer inline mx-1 p-1 border rounded-full'

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        setCategories(sortData(categoryData))
        setCategoryArray(categoryData)
        setArrayInit(categoryData)
        setProducts(productData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err)
      })
  }, [])

  useEffect(() => {
    setCategories(sortData(categoryArray))

    if (categoryArray.length !== arrayInit.length) {
      setChangeDetected(true)
      return
    }

    for (let i = 0; i < categoryArray.length; i++) {
      if (categoryArray[i].image !== arrayInit[i].image ||
        categoryArray[i].name !== arrayInit[i].name ||
        categoryArray[i].order !== arrayInit[i].order) {
        setChangeDetected(true)
        return
      } else {
        setChangeDetected(false)
      }
    }

  }, [categoryArray])

  const updateArrayOrder = (id: number, newVal: number) => {
    setCategoryArray(prev =>
      prev.map(item => {
        if (item.id === id) { return { ...item, order: newVal } } else { return item }
      })
    )
  }

  const addcategory = () => {
    const newCategory = {
      id: categoryArray.length + 1,
      name: 'New Category',
      order: categories.length,
      image: null,
      children: []
    }

    const newItem = {
      id: categoryArray.length + 1,
      name: 'New Category',
      order: categories.length,
      optGroup: true,
      groupID: null,
      image: null
    }

    setCategories(prev => [...prev, newCategory])
    setCategoryArray(prev => [...prev, newItem])
  }

  const addSubcategory = (groupId: number) => {
    setCategories(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
            ...group,
            children: [
              ...group.children,
              {
                id: categoryArray.length + 1,
                name: 'New Subcategory',
                order: group.children.length,
                optGroup: false,
                groupID: groupId,
                image: null,
              },
            ],
          }
          : group
      )
    )

    const group = categories.find(cat => cat.id === groupId)
    const count = group ? group.children.length : 0

    const newItem = {
      id: categoryArray.length + 1,
      name: 'New Subcategory',
      order: count,
      optGroup: false,
      groupID: groupId,
      image: null,
    }

    setCategoryArray(prev => [...prev, newItem])
  }

  const deleteCategory = (groupId: number) => {
    setCategories(prev => prev.filter(group => group.id !== groupId))
    setCategoryArray(prev => prev.filter(item => item.id !== groupId))
    setCategoryArray(prev => prev.filter(el => el.groupID !== groupId))
  }

  const deleteSubcategory = (groupId: number, subId: number) => {
    setCategories(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
            ...group,
            children: group.children.filter(sub => sub.id !== subId),
          }
          : group
      )
    )
    setCategoryArray(prev => prev.filter(item => item.id !== subId))
  }

  const moveGroup = (groupId: number, direction: 'up' | 'down') => {
    setCategories(prev => {
      const index = prev.findIndex(g => g.id === groupId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newArr = [...prev]
      const temp = newArr[index]
      newArr[index] = newArr[newIndex]
      newArr[newIndex] = temp

      updateArrayOrder(groupId, newIndex)
      updateArrayOrder(newArr[index].id, index)

      return newArr
    })
  }

  const moveSubcategory = (groupId: number, subId: number, direction: 'up' | 'down') => {
    setCategories(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group

        const index = group.children.findIndex(sub => sub.id === subId)
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (index === -1 || newIndex < 0 || newIndex >= group.children.length)
          return group

        const newChildren = [...group.children]
        const temp = newChildren[index]
        newChildren[index] = newChildren[newIndex]
        newChildren[newIndex] = temp

        updateArrayOrder(subId, newIndex)
        updateArrayOrder(newChildren[index].id, index)

        return {
          ...group,
          children: newChildren,
        }
      })
    )
  }

  const update = async () => {
    setUpdating(true)

    const formData = new FormData()

    const categoryForm = categoryArray.map(cat => {
      if (cat.image instanceof File) {
        formData.append(`image-${cat.id}`, cat.image)
        return { ...cat, image: null }
      }
      return cat;
    });

    formData.append('categories', JSON.stringify(categoryForm))
    const res = await updateCategory(formData)

    if (res) {
      setUpdating(false)
      setChangeDetected(false)
    }
  }

  const addImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]

    if (!file) return

    setCategoryArray(prev =>
      prev.map((el) =>
        el.id === index ? { ...el, image: file } : el
      )
    )
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setCategoryArray(prev =>
      prev.map((el) =>
        el.id === index ? { ...el, image: null } : el
      )
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <ListTree className="inline mr-2 w-5" />
          <span className="font-bold">Category</span>
        </div>
        <button disabled={!changeDetected} onClick={update}>SAVE</button>
      </div>

      <div className="mt-4">
        {categories.map((group) => (
          <div key={group.id} className="mb-6">
            <div className="flex justify-between items-center gap-2 border-b border-gray-400 w-full mx-1 py-2">
              <strong className="inline"><CategoryName name={group.name} id={group.id} setArray={setCategoryArray} /></strong>
              <div className="flex items-center">
                {products.filter(p => group.children.some(child => child.id === p.category)).length === 0 ?
                  <Trash2 onClick={() => deleteCategory(group.id)} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7 border-red-300 text-red-500" /> :
                  <span className="mx-3">{products.filter(p => group.children.some(child => child.id === p.category)).length}</span>
                }
                <ChevronUp onClick={() => moveGroup(group.id, 'up')} className={btnStyleGroup} />
                <ChevronDown onClick={() => moveGroup(group.id, 'down')} className={btnStyleGroup} />
                <Plus onClick={() => addSubcategory(group.id)} className={btnStyleGroup} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => addImage(e, group.id)}
                  className="hidden"
                  ref={el => { fileInputRefs.current[group.id] = el }}
                />
                <div>
                  {group.image === null ?
                    <div>
                      <ImagePlus className={btnStyleGroup} onClick={() => { fileInputRefs.current[group.id]!.click() }}></ImagePlus>
                    </div>
                    :
                    <div className="ml-2 relative">
                      <img onClick={() => { fileInputRefs.current[group.id]!.click() }}
                        src={typeof group.image === 'string' ? group.image : URL.createObjectURL(group.image)}
                        alt={`attachment-${group.id}`}
                        className="h-20"
                      />
                      <X
                        onClick={() => removeImage(group.id)} strokeWidth={3}
                        className="cursor-pointer text-gray-700 absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
            <ul>
              {group.children.map((sub) => (
                <div key={sub.id}>
                  <li className="items-center gap-2 border-b border-gray-400 py-2 flex justify-between">
                    <div className="flex">
                      <span className="mr-2 text-gray-400">└─</span><CategoryName name={sub.name} id={sub.id} setArray={setCategoryArray} />
                    </div>
                    <div className="flex items-center">
                      {products.filter(p => p.category === sub.id).length === 0 ?
                        <Trash2 onClick={() => deleteSubcategory(group.id, sub.id)} className={`${btnStyleChild} border-red-300 text-red-500`} /> :
                        <span className="mx-3">{products.filter(p => p.category === sub.id).length}</span>
                      }
                      <ChevronUp onClick={() => moveSubcategory(group.id, sub.id, 'up')} className={btnStyleChild} />
                      <ChevronDown onClick={() => moveSubcategory(group.id, sub.id, 'down')} className={btnStyleChild} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => addImage(e, sub.id)}
                        className="hidden"
                        ref={el => { fileInputRefs.current[sub.id] = el }}
                      />
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}

        {loading ?
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='animate-pulse mb-4 text-gray-400'>
              <div className="flex justify-between border-b py-3 border-gray-200">
                <div className="flex gap-2 items-center">
                  <div className="bg-gray-100 w-5 h-5 mx-1 rounded-md"></div>
                  <div className="bg-gray-100 w-20 h-5 rounded-md"></div>
                </div>
                <div className='flex gap-2 items-center'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-7 rounded-full aspect-square bg-gray-100"></div>
                  ))}
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between border-b py-2 border-gray-300">
                  <div className="flex gap-2 items-center">
                    <span className="mr-2">└─</span>
                    <div className="bg-gray-100 w-5 h-5 mx-1 rounded-md"></div>
                    <div className="bg-gray-100 w-20 h-5 rounded-md"></div>
                  </div>
                  <div className='flex gap-2 items-center'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-6 rounded-full aspect-square bg-gray-100"></div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )) :
          <div className="cursor-pointer flex gap-2 items-center bg-yellow-300 rounded-md p-2" onClick={addcategory}>
            <Plus className="w-5" /> <p className="inline text-black font-medium">add new Category Group</p>
          </div>
        }

        {updating && <LoadingBar />}

      </div>
    </div>
  )
}
