import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchOrderedProducts, fetchThisOrder, sortedOrders, stringToDate, updateOrderStatus } from '../../utils/orderUtils'
import type { SortedOrderProps } from '../../types'
import { useNavigate } from 'react-router-dom'
import Selection from '../../Components/ui/selection'
import Badge from '../../Components/ui/badge'
import LoadingBar from '../../Components/LoadingBar'
import BtnForAdmin from '../../Components/ui/btnForAdmin'

function OrderDetail() {
  const [loading, setLoading] = useState<boolean>(true)
  const [order, setOrder] = useState<SortedOrderProps>()
  const navigate = useNavigate()
  const statusData: string[] = ['ordered', 'processing completed', 'shipped', 'delivered']
  const [status, setStatus] = useState<string>('')
  const { orderId } = useParams()
  const { userId } = useParams()

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, products] = await Promise.all([
          fetchThisOrder(userId!, orderId!),
          fetchOrderedProducts(userId!)
        ])

        if (orders && products) {
          sortedOrders(orders, products).then((res) => {
            setOrder(res[0])
            setStatus(res[0].status)
            setLoading(false)
          })
        }
      } catch (err) {
        console.error('Fetching error:', err)
      }
    }

    if (userId !== undefined && orderId !== undefined) {
      fetchData()
    }
  }, [userId, orderId, loading])

  const updateAction = async () => {
    setLoading(true)

    if (order) {
      const res = await updateOrderStatus(userId!, orderId!, status)

      if (res) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="container-overflow-x p-8">
      <div className='min-w-[700px]'>
        {!loading && order && order !== undefined ?
          <div className='flex flex-col gap-8'>
            <div className='flex justify-between items-center'>
              <div className='grid grid-cols-[200px_1fr]'>
                <h3 className='text-gray-500'>Order No.</h3>
                <h3>{order.orderId}</h3>
              </div>
              <h3>{Badge(order.status)}</h3>
            </div>

            <div>
              <h3 className='mb-1'>Basic Information</h3>
              <div className='bg-white p-4 rounded-md grid lg:grid-cols-2 gap-y-4 gap-x-4 items-center'>
                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Ordered at</p>
                  <p>{stringToDate(order.created_at!)}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Customer</p>
                  <p className='hover:underline cursor-pointer' onClick={() => navigate(`/customers/${userId}`)}>{order.userInfo?.email}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Process completed at</p>
                  <p>{stringToDate(order.dateProcessingCompleted!)}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Shipping fee</p>
                  <p>{order.shippingFee} €</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Shipped at</p>
                  <p>{stringToDate(order.dateShipped!)}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Paid Amount</p>
                  <p>{order.paidAmount} €</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Delivered at</p>
                  <p>{stringToDate(order.dateDelivered!)}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr] items-center'>
                  <p className='text-gray-500'>Payment</p>
                  <div className='flex gap-3 items-center'>{order.paymentMethod} {Badge(order.paymentStatus)}</div>
                </div>
              </div>
            </div>

            <div>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <h3 className='mb-1'>Delievery Information</h3>
                  <div className='bg-white p-4 rounded-md grid gap-2'>
                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Name</p>
                      <p>{order.shippingName}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Contact</p>
                      <p>{order.shippingContact}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Address</p>
                      <p>{order.shippingAddr}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='mb-1'>Billing Information</h3>
                  <div className='bg-white p-4 rounded-md grid gap-2'>
                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Name</p>
                      <p>{order.billingName}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Contact</p>
                      <p>{order.billingContact}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Address</p>
                      <p>{order.billingAddr}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-1'>Products Information</h3>
              <div className='bg-white p-4 rounded-md'>
                <div className='grid [grid-template-columns:20px_repeat(7,1fr)] gap-4 items-center font-bold text-gray-400'>
                  <p>No.</p>
                  <p>Img</p>
                  <p>Name</p>
                  <p>Size</p>
                  <p>Color</p>
                  <p>Price</p>
                  <p>Qnt.</p>
                  <p>Total</p>
                </div>
                <hr className='my-4 border-gray-300' />
                <div className='flex flex-col gap-2'>
                  {order.products.map((el, i) => (
                    <div key={i} className='cursor-pointer grid [grid-template-columns:20px_repeat(7,1fr)] gap-4 items-center' onClick={() => navigate(`/product/${el.id}`)}>
                      <p className='text-center'>{i + 1}</p>
                      <img className='rounded-md' src={el.image} alt={el.name} />
                      <p className='text-base/4'>{el.name}</p>
                      <p className='text-base/4'>{el.size}</p>
                      <p className='text-base/4'>{el.color}</p>
                      <p className='text-base/4'>{el.price} €</p>
                      <p className='text-base/4'>{el.qnt}</p>
                      <p className='text-base/4'>{el.total} €</p>
                    </div>
                  ))}
                </div>
                <hr className='my-4 border-gray-300' />
                <div className='grid [grid-template-columns:20px_repeat(7,1fr)] gap-4 items-center font-bold'>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Total</p>
                  <p>{order.totalAmount} €</p>
                </div>
              </div>
            </div>

            <div className='bg-white p-4 rounded-md'>
              <div className='grid grid-cols-[180px_1fr]'>
                <p className='text-gray-500'>Status</p>
                <Selection data={statusData} value={status} setValue={setStatus}></Selection>
              </div>
            </div>

            <BtnForAdmin onClick={updateAction} classname='w-fit'>Update</BtnForAdmin>
          </div>
          :
          <div>
            <LoadingBar />
          </div>
        }

      </div>
    </div>
  )
}

export default OrderDetail