import { useEffect, useState } from 'react'
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA } from 'lucide-react'
import { fetchCustomerOrders, stringToDate } from '../../utils/orderUtils'
import type { OrderProps } from '../../types'
import { useLocation, useNavigate } from 'react-router-dom'
import Selection from '../../Components/ui/selection'
import Badge from '../../Components/ui/badge'
import SearchBar from '../../Components/SearchBar'

function Order() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [sortBy, setSortBy] = useState<'created_at' | 'orderId' | 'userInfo' | 'paidAmount' | null>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const navigate = useNavigate()
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')
  const paymentMethodFilterData: string[] = ['Klarna', 'Visa', 'Master', 'PayPal']
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const paymentStatusFilterData: string[] = ['approved', 'processing', 'declined']
  const [statusFilter, setStatusFilter] = useState('')
  const statusFilterData: string[] = ['ordered', 'processing completed', 'shipped', 'delivered']
  const style = 'grid grid-cols-[150px_220px_80px_90px_110px_190px_1fr] gap-4 items-center px-4 py-4 border-b border-gray-300'
  const location = useLocation()

  useEffect(() => {
    setLoading(false)

  const queryParams = new URLSearchParams(location.search)
  const status = queryParams.get('status')
  if(status) setStatusFilter(statusFilterData[0])
  }, [])

  useEffect(() => {
    fetchCustomerOrders().then((res) => {
      if (res) {
        setOrders(res)
        setLoading(false)
      }
    })
  }, [])

  function toggleSort(field: 'created_at' | 'orderId' | 'userInfo' | 'paidAmount') {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  function SortArrow({ field }: { field: string }) {
    if (sortBy !== field) return null
    if (field === 'orderId' || field === 'userInfo') return sortDir === 'asc' ? <ArrowDownAZ className='w-5 ml-2' /> : <ArrowDownZA className='w-5 ml-2' />
    return sortDir === 'asc' ? <ArrowDown01 className='w-5 ml-2' /> : <ArrowDown10 className='w-5 ml-2' />
  }

  const sortedorders = [...orders]
    .filter(order => {
      const matchPaymentMethod = !paymentMethodFilter || order.paymentMethod === paymentMethodFilter
      const matchPaymentStatus = !paymentStatusFilter || order.paymentStatus === paymentStatusFilter
      const matchStatus = !statusFilter || order.status === statusFilter
      const matchesSearch =
        !searchQuery ||
        Object.values(order)
          .some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )

      return matchPaymentMethod && matchPaymentStatus && matchStatus && matchesSearch
    })
    .sort((a, b) => {
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
        <div className={`${style} bg-white rounded-xl font-bold text-sm mb-2`}>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('created_at')}>Date <SortArrow field="created_at" /></div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('orderId')}>ID <SortArrow field="orderId" /> </div>
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('paidAmount')}>Amount <SortArrow field="paidAmount" /></div>
          <Selection value={paymentMethodFilter} setValue={setPaymentMethodFilter} option='P. Method' data={paymentMethodFilterData} />
          <Selection value={paymentStatusFilter} setValue={setPaymentStatusFilter} option='P. Status' data={paymentStatusFilterData} />
          <Selection value={statusFilter} setValue={setStatusFilter} option='Status' data={statusFilterData} />
          <div className='cursor-pointer h-5 flex itmes-center' onClick={() => toggleSort('userInfo')}>Customer <SortArrow field="userInfo" /></div>
        </div>

        {!loading && orders.length > 0 ?
          sortedorders.map((order, i) => (
            <div onClick={() => navigate(`/orders/${order.userId}/${order.orderId}`)} key={i} className={`${style} py-1 cursor-pointer`}>
              <p>{stringToDate(order.created_at!)}</p>
              <p>{order.orderId}</p>
              <p>{order.paidAmount}</p>
              <p>{order.paymentMethod}</p>
              {Badge(order.paymentStatus)}
              {Badge(order.status)}
              <p>{order.userInfo!.email}</p>
            </div>
          ))
          :
          <div>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className={`${style} my-1 animate-pulse`}>
                <p className='rounded-md w-full h-6 bg-gray-200'></p>
                <p className='rounded-md w-full h-6 bg-gray-200'></p>
                <p className='rounded-md w-12 h-6 bg-gray-200'></p>
                <p className='rounded-md w-14 h-6 bg-gray-200'></p>
                <p className='rounded-full w-full h-9 border-gray-300 border-2 bg-gray-200'></p>
                <p className='rounded-full w-full h-9 border-gray-300 border-2 bg-gray-200'></p>
                <p className='rounded-md w-full h-6 bg-gray-200'></p>
              </div>
            ))}
          </div>
        }
      </div>

      <SearchBar value={searchQuery} setValue={setSearchQuery} />
    </div>
  )
}

export default Order