import { useState, useEffect, useRef } from "react"
import type { BannerProps } from "../types"
import { Trash2, Plus, ChevronDown, ChevronUp, Image, ImagePlus } from "lucide-react"
import LoadingBar from "./LoadingBar"
import { X } from "lucide-react"
import { fetchBanner, sortBanner, updateBanner } from "../utils/bannerUtils"
import Label from "./ui/label"
import Input from "./ui/input"
import BannerLinkSelection from "./ui/bannerLinkSelection"

export default function Banner() {
  const [banners, setBanners] = useState<BannerProps[]>([])
  const [arrayInit, setArrayInit] = useState<BannerProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updating, setUpdating] = useState<boolean>(false)
  const [changeDetected, setChangeDetected] = useState<boolean>(false)

  useEffect(() => {
    fetchBanner().then((res) => {
      setBanners(res)
      setArrayInit(res)
      setLoading(false)

      if (res.length === 0) {
        setBanners([
          {
            id: 1,
            title: '',
            text: '',
            image: null,
            order: 0,
            buttonName: '',
            buttonLink: '',
          },
        ]);
      }

    })
  }, [])

  useEffect(() => {
    if (banners.length !== arrayInit.length) {
      setChangeDetected(true)
      return
    }

    for (let i = 0; i < banners.length; i++) {
      if (banners[i].image !== arrayInit[i].image ||
        banners[i].title !== arrayInit[i].title ||
        banners[i].order !== arrayInit[i].order) {
        setChangeDetected(true)
        return
      } else {
        setChangeDetected(false)
      }
    }

  }, [banners])

  const addNewBanner = () => {
    const newItem = {
      id: banners.length + 1,
      title: 'title',
      text: '',
      buttonName: '',
      buttonLink: '',
      order: banners.length,
      image: null,
    }

    setBanners(prev => [...prev, newItem])
  }

  const update = async () => {
    setUpdating(true)

    const formData = new FormData()

    const form = banners.map(el => {
      if (el.image instanceof File) {
        formData.append(`image-${el.id}`, el.image)
        return { ...el, image: null }
      }
      return el
    })

    formData.append('banners', JSON.stringify(form))
    const res = await updateBanner(formData)

    if (res) {
      setUpdating(false)
      setChangeDetected(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Image className="inline mr-2 w-5" />
          <span className="font-bold">Banner</span>
        </div>
        <button disabled={!changeDetected} onClick={update}>SAVE</button>
      </div>

      {banners.length === 1 &&
        <BannerComp banners={banners} index={banners.length - 1} setBanners={setBanners} />
      }

      {banners.length > 1 &&
        banners.map((_, i) => (
          <BannerComp banners={sortBanner(banners)} index={i} setBanners={setBanners} key={i} />
        ))
      }

      {loading ?
        Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='animate-pulse mb-4 text-gray-400'>

          </div>
        )) :
        <div className="mt-4 cursor-pointer flex gap-2 items-center bg-yellow-300 rounded-md p-2" onClick={addNewBanner}>
          <Plus className="w-5" /> <p className="inline text-black font-medium">add new banner</p>
        </div>
      }

      {updating && <LoadingBar />}
      
    </div>
  )
}

const BannerComp = ({ banners, index, setBanners }: {
  banners: BannerProps[]
  index: number
  setBanners: React.Dispatch<React.SetStateAction<BannerProps[]>>
}) => {
  const btnStyleGroup = 'cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7'
  const item = banners[index]
  const [title, setTitle] = useState<string>(item.title)
  const [text, setText] = useState<string>(item.text)
  const [buttonName, setButtonName] = useState<string>(item.buttonName)
  const [buttonLink, setButtonLink] = useState<string>(item.buttonLink)
  const fileInputRef = useRef<(HTMLInputElement | null)>(null)
  const i = item.id

  useEffect(() => {
    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, title } : el
      )
    )
  }, [title])

  useEffect(() => {
    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, text } : el
      )
    )
  }, [text])

  useEffect(() => {
    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, buttonName } : el
      )
    )
  }, [buttonName])

  useEffect(() => {
    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, buttonLink } : el
      )
    )
  }, [buttonLink])

  useEffect(() => {
    setTitle(item.title)
    setText(item.text)
    setButtonName(item.buttonName)
    setButtonLink(item.buttonLink)
  }, [item])

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, image: file } : el
      )
    )
    e.target.value = ''
  }

  const removeImage = () => {
    setBanners(prev =>
      prev.map((el) =>
        el.id === i ? { ...el, image: null } : el
      )
    )
  }

  const deleteBanner = () => {
    setBanners(prev => prev.filter(el => el.id !== i))
  }

  const moveGroup = (direction: 'up' | 'down') => {
    setBanners(prev => {
      const index = prev.findIndex(item => item.id === i)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newArr = [...prev]

      const temp = newArr[index]
      newArr[index] = newArr[newIndex]
      newArr[newIndex] = temp

      newArr[index].order = index
      newArr[newIndex].order = newIndex

      return newArr
    })
  }

  return (
    <div>
      <div className="flex justify-end mt-8">
        <ChevronUp onClick={() => moveGroup('up')} className={btnStyleGroup} />
        <ChevronDown onClick={() => moveGroup('down')} className={btnStyleGroup} />
        <Trash2 onClick={() => deleteBanner()} className="cursor-pointer inline mx-1 p-1 border-2 rounded-full w-7 h-7 border-red-300 text-red-500" />
      </div>
      <div className="grid grid-rows md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => addImage(e)}
            className="hidden"
            ref={fileInputRef}
          />
          {item.image === null ?
            <div className="cursor-pointer w-full h-42 rounded-md md:h-full bg-gray-50 grid place-items-center" onClick={() => { fileInputRef.current!.click() }}>
              <ImagePlus className="text-gray-200"></ImagePlus>
            </div>
            :
            <div className="relative cursor-pointer">
              <img onClick={() => { fileInputRef.current!.click() }}
                src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                alt={`attachment-${item.id}`}
                className="rounded-md"
              />
              <X
                onClick={() => removeImage()} strokeWidth={3}
                className="cursor-pointer text-gray-700 absolute top-2 right-2 rounded-full w-5 h-5 p-1 border bg-white"
              />
            </div>

          }
        </div>

        <div className="flex flex-col gap-1">
          <div>
            <Label name="Title" />
            <Input classname="border border-gray-400" label='Title' type='text' value={title} setValue={setTitle} />
          </div>
          <div>
            <Label name="Description" />
            <Input classname="border border-gray-400" label='Description' type='text' value={text} setValue={setText} />
          </div>
          <div>
            <Label name="Button name" />
            <Input classname="border border-gray-400" label='Button name' type='text' value={buttonName} setValue={setButtonName} />
          </div>
          {buttonName !== '' &&
            <div>
              <Label name="Button link" />
              <BannerLinkSelection option="Select a item to link" value={buttonLink} setValue={setButtonLink} />
            </div>
          }

        </div>
      </div>
    </div>
  )
}
