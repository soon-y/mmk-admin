import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CustomerProps } from '../../types'
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA } from 'lucide-react'
import Selection from '../../Components/ui/selection'
import { getCustomers } from '../../utils/customerUtils'
import { stringToDate } from '../../utils/orderUtils'
import SearchBar from '../../Components/SearchBar'

function Customers() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const [sortBy, setSortBy] = useState<'id' | 'firstName' | 'lastName' | 'created_at' | 'email' | null>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const paymentMethodFilterData: string[] = ['Klarna', 'Visa', 'Master', 'PayPal']
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')

  const style = 'grid grid-cols-[1fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center px-4'

  useEffect(() => {
    getCustomers().then((res) => {
      if (res) {
        setCustomers(res)
        setLoading(false)
      }
    })

  }, [])

  function toggleSort(field: 'id' | 'firstName' | 'lastName' | 'created_at' | 'email') {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  function SortArrow({ field }: { field: string }) {
    if (sortBy !== field) return null
    if (field === 'firstName' || field === 'lastName' || field === 'email') return sortDir === 'asc' ? <ArrowDownAZ className='w-5 ml-2' /> : <ArrowDownZA className='w-5 ml-2' />
    return sortDir === 'asc' ? <ArrowDown01 className='w-5 ml-2' /> : <ArrowDown10 className='w-5 ml-2' />
  }

  const sortedCustomers = [...customers]
    .filter(el => {
      const matchPaymentMethod = !paymentMethodFilter || el.payment === paymentMethodFilter
      const matchesSearch =
      !searchQuery ||
      Object.values(el)
        .some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )

      return matchPaymentMethod && matchesSearch
    }).sort((a, b) => {
      if (!sortBy) return 0
      const valA = a[sortBy]
      const valB = b[sortBy]

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA
      }

      return sortDir === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

  return (
    <div className="container-overflow-x">
      <div className="p-8 w-max xl:w-full">
        <div className={`${style} h-12 bg-white rounded-xl font-bold text-sm mb-2`}>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('created_at')}>Registered at <SortArrow field="created_at" /> </div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('email')}>Email<SortArrow field="email" /></div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('firstName')}>First Name <SortArrow field="firstName" /></div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('lastName')}>Last Name <SortArrow field="lastName" /></div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('email')}>Contact<SortArrow field="discount" /></div>
          <Selection value={paymentMethodFilter} setValue={setPaymentMethodFilter} option='P. Method' data={paymentMethodFilterData} />
        </div>

        {sortedCustomers.map((customer, index) => (
          <div onClick={() => navigate(`/customers/${customer.id}`)} key={index}
            className={`${style} border-b border-gray-300 cursor-pointer py-2`}>
            <p>{stringToDate(customer.created_at)}</p>
            <p>{customer.email}</p>
            <p>{customer.firstName}</p>
            <p>{customer.lastName}</p>
            <p>{customer.contact}</p>
            <p>{customer.payment}</p>
          </div>
        ))}

        {loading && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`${style} border-b border-gray-300 animate-pulse`}>
            <p className='rounded-md w-[90%] h-6 bg-gray-200'></p>
            <p className='rounded-md w-[90%] h-6 bg-gray-200'></p>
            <p className='rounded-md w-10 h-6 bg-gray-200'></p>
            <p className='rounded-md w-10 h-6 bg-gray-200'></p>
            <p className='rounded-md w-18 h-6 bg-gray-200'></p>
            <p className='rounded-md w-16 h-6 bg-gray-200'></p>
            <p className='rounded-md w-6 h-6 bg-gray-200'></p>
          </div>
        ))}
      </div>

      <SearchBar value={searchQuery} setValue={setSearchQuery}/>
    </div>
  )
}

export default Customers