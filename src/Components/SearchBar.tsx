import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

function SearchBar({ value, setValue }: {
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
}) {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if(!open) setValue('')
  }, [open])

  return (
    <div className='w-[100vw] h-[100vh] fixed'>
      <div className='fixed right-4 bottom-4 z-100'>
        <div className={`${open ? 'w-full md:w-[450px] bg-white' : 'w-12 bg-[#E30072]'} 
        rounded-full duration-500 flex items-center justify-center overflow-hidden shadow-lg
        `}>
          <input
            className={`${open ? 'w-full md:w-[400px] py-3 px-6' : 'w-[0px]'} outline-none duration-500`}
            type='string'
            value={value}
            onChange={(e) => setValue(e.target.value)}

          />
          <Search className={`${open ? '' : 'text-white'} m-3 cursor-pointer`} onClick={() => setOpen((state) => !state)} />
        </div>
      </div>
    </div>
  )
}

export default SearchBar