import { useState, useEffect } from "react"
import type { GroupedCategory, ProductProps, CategoryProps } from "../types"
import { Trash2, Plus, ChevronDown, ChevronUp, ListTree } from "lucide-react"
import CategoryName from "./CategoryName"
import { sortData, fetchCategory } from "../utils/categoryUtils"
import { fetchProducts } from "../utils/productUtils"
import LoadingBar from "./LoadingBar"
import axios from 'axios'

export default function Category() {
  const [categories, setCategories] = useState<GroupedCategory[]>([])
  const [products, setProducts] = useState<ProductProps[]>([])
  const [arrayInit, setArrayInit] = useState<CategoryProps[]>([])
  const [array, setArray] = useState<CategoryProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [changeDetected, setChangeDetected] = useState<boolean>(false)

  useEffect(() => {
    Promise.all([fetchCategory(), fetchProducts()])
      .then(([categoryData, productData]) => {
        setCategories(sortData(categoryData))
        setArray(categoryData)
        setArrayInit(categoryData)
        setProducts(productData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err)
      })
  }, [updating])

  useEffect(() => {
    if (array.length !== arrayInit.length) {
      setChangeDetected(true)
      return
    }

    for (let i = 0; i < array.length; i++) {
      if (array[i] !== arrayInit[i]) {
        setChangeDetected(true)
        return
      }
    }

  }, [array])

  const updateArrayOrder = (id: number, newVal: number) => {
    setArray(prev =>
      prev.map(item => {
        if (item.id === id) { return { ...item, order: newVal } } else { return item }
      })
    )
  }

  const addcategory = () => {
    const newCategory = {
      id: array.length + 1,
      name: 'New Category',
      order: categories.length,
      children: []
    }

    const newItem = {
      id: array.length + 1,
      name: 'New Category',
      order: categories.length,
      optGroup: true,
      groupID: null,
    }

    setCategories(prev => [...prev, newCategory])
    setArray(prev => [...prev, newItem])
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
                id: array.length + 1,
                name: 'New Subcategory',
                order: group.children.length,
                optGroup: false,
                groupID: groupId,
              },
            ],
          }
          : group
      )
    )

    const group = categories.find(cat => cat.id === groupId)
    const count = group ? group.children.length : 0

    const newItem = {
      id: array.length + 1,
      name: 'New Subcategory',
      order: count,
      optGroup: false,
      groupID: groupId,
    }

    setArray(prev => [...prev, newItem])
  }

  const deleteCategory = (groupId: number) => {
    setCategories(prev => prev.filter(group => group.id !== groupId))
    setArray(prev => prev.filter(item => item.id !== groupId))
    setArray(prev => prev.filter(el => el.groupID !== groupId))
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
    setArray(prev => prev.filter(item => item.id !== subId))
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

  const updateCategory = async () => {
    setUpdating(true)
    try {
      const res = await axios.post('https://mmk-backend.onrender.com/replace', array, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.data) {
        setUpdating(false)
      }
    } catch (err: unknown) {
      const error = err as any
      console.error(error.response?.data || error.message || error)
      setUpdating(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <ListTree className="inline mr-2 w-5" />
          <span className="font-bold">Category</span>
        </div>
        <button disabled={!changeDetected} onClick={updateCategory}>SAVE</button>
      </div>

      <div className="mt-2">
        {categories.map((group) => (
          <div key={group.id} className="mb-6">
            <div className="flex justify-between gap-2 bg-white w-full p-4 rounded-full shadow-xl">
              <strong className="inline"><CategoryName name={group.name} id={group.id} setArray={setArray} /></strong>
              <div className="flex items-center">
                {products.filter(p => group.children.some(child => child.name === p.category)).length === 0 ?
                  <Trash2 onClick={() => deleteCategory(group.id)} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7 border-red-300 text-red-500" /> :
                  <span className="mx-2">{products.filter(p => group.children.some(child => child.name === p.category)).length}</span>
                }
                <ChevronUp onClick={() => moveGroup(group.id, 'up')} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7" />
                <ChevronDown onClick={() => moveGroup(group.id, 'down')} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7" />
                <Plus onClick={() => addSubcategory(group.id)} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7" />
              </div>
            </div>
            <ul className="ml-4">
              {group.children.map((sub) => (
                <div key={sub.id}>
                  <div className="ml-8 w-1 h-3 bg-white"></div>
                  <li className="items-center gap-2 bg-white w-94 ml-2 px-4 py-3 rounded-full flex justify-between shadow-xl">
                    <CategoryName name={sub.name} id={sub.id} setArray={setArray} />
                    <div className="flex items-center">
                      {products.filter(p => p.category === sub.name).length === 0 ?
                        <Trash2 onClick={() => deleteSubcategory(group.id, sub.id)} className="cursor-pointer inline mx-1 p-1 border rounded-full border-red-300 text-red-500" /> :
                        <span className="mx-2">{products.filter(p => p.category === sub.name).length}</span>
                      }
                      <ChevronUp onClick={() => moveSubcategory(group.id, sub.id, 'up')} className="cursor-pointer inline mx-1 p-1 border rounded-full" />
                      <ChevronDown onClick={() => moveSubcategory(group.id, sub.id, 'down')} className="cursor-pointer inline mx-1 p-1 border rounded-full" />
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}

        {loading ?
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='animate-pulse bg-white h-14 mb-4 w-full p-4 rounded-full shadow-xl'></div>
          )) :
          <div className="cursor-pointer flex gap-2 bg-yellow-300 w-full p-4 rounded-full shadow-xl" onClick={addcategory}>
            <Plus className="w-5" /> <p className="inline text-black font-medium">add new Category Group</p>
          </div>
        }

        {updating && <LoadingBar />}

      </div>
    </div>
  )
}
