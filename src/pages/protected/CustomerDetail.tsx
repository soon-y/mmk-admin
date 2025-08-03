import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import type { CustomerProps, addressProps, OrderProps } from '../../types'
import { getCustomerAddressByUserId, getCustomerBillingAddressByUserId, getCustomerInfoByUserId, getCustomerOrdersByUserId } from '../../utils/customerUtils'
import { stringToDate } from '../../utils/orderUtils'
import LoadingBar from '../../Components/LoadingBar'
import Badge from '../../Components/ui/badge'

function CustomerDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [orders, setOrders] = useState<OrderProps[] | null>([])
  const [customer, setCustomer] = useState<CustomerProps | null>()
  const [address, setAddress] = useState<addressProps | null>()
  const [billingAddress, setbBillingAddress] = useState<addressProps | null>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, addr, billingAddr, orders] = await Promise.all([
          getCustomerInfoByUserId(id!),
          getCustomerAddressByUserId(id!),
          getCustomerBillingAddressByUserId(id!),
          getCustomerOrdersByUserId(id!)
        ])
        setCustomer(user)
        setAddress(addr)
        setbBillingAddress(billingAddr)
        setOrders(orders)
        setLoading(false)
      } catch (err) {
        console.error('Fetching error:', err)
      }
    }

    if (id && id !== undefined) {
      fetchData()
    }

  }, [])


  return (
    <div className="container-overflow-x">
      {!loading ?
        <div className='flex flex-col p-8 w-max xl:w-full gap-8'>
          {customer &&
            <div>
              <h3 className='mb-1'>Basic Information</h3>
              <div className='bg-white p-4 rounded-md grid lg:grid-cols-2 gap-y-4 gap-x-4 items-center'>
                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Registered at</p>
                  <p>{stringToDate(customer.created_at!)}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Email</p>
                  <p>{customer.email}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Customer</p>
                  <p>{customer.firstName} {customer.lastName}</p>
                </div>

                <div className='grid grid-cols-[180px_1fr]'>
                  <p className='text-gray-500'>Contact</p>
                  <p>{customer.contact}</p>
                </div>
              </div>
            </div>
          }

          <div>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <h3 className='mb-1'>Delievery Information</h3>
                {address ?
                  <div className='bg-white p-4 rounded-md grid gap-2'>
                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Name</p>
                      <p>{address.firstName} {address.lastName}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Contact</p>
                      <p>{address.contact}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Address</p>
                      <p>{address.street} {address.postalCode} {address.city} {address.country}</p>
                    </div>
                  </div> :
                  <div className='bg-white p-4 rounded-md'>
                    <p className='text-gray-400'>null</p>
                  </div>
                }
              </div>

              <div>
                <h3 className='mb-1'>Billing Information</h3>
                {billingAddress ?
                  <div className='bg-white p-4 rounded-md grid gap-2'>
                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Name</p>
                      <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Contact</p>
                      <p>{billingAddress.contact}</p>
                    </div>

                    <div className='grid grid-cols-[180px_1fr]'>
                      <p className='text-gray-500'>Address</p>
                      <p>{billingAddress.street} {billingAddress.postalCode} {billingAddress.city} {billingAddress.country}</p>
                    </div>
                  </div> :
                  <div className='bg-white p-4 rounded-md'>
                    <p className='text-gray-400'>null</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div>
            <h3 className='mb-1'>Orders</h3>
            {orders && orders.length > 0 ?
              <div className='bg-white p-4 rounded-md'>
                <div className='grid grid-cols-[18px_1fr_1fr_1fr_1fr_1fr] gap-4'>
                  <p>No.</p>
                  <p>Ordered at</p>
                  <p>Amount(€)</p>
                  <p>Payment</p>
                  <div>P. Status</div>
                  <div>Status</div>
                </div>
                <hr className='border-gray-300 my-4' />
                {orders.map((el, i) => (
                  <div key={i}>
                    <div className='cursor-pointer grid grid-cols-[18px_1fr_1fr_1fr_1fr_1fr] items-center gap-4' onClick={() => navigate(`/orders/${id}/${el.orderId}`)}>
                      <p>{i + 1}</p>
                      <p>{stringToDate(el.created_at!)}</p>
                      <p>€ {el.paidAmount}</p>
                      <p>{el.paymentMethod}</p>
                      <div>{Badge(el.paymentStatus)}</div>
                      <div>{Badge(el.status)}</div>
                    </div>
                    {orders.length > 1 && orders.length !== i + 1 && <hr className='border-gray-300 my-4' />}
                  </div>
                ))}
              </div> :
              <div className='bg-white p-4 rounded-md'>
                <p className='text-gray-400'>No Orders yest</p>
              </div>
            }
          </div>
        </div>
        :
        <div><LoadingBar /></div>
      }
    </div>
  )
}

export default CustomerDetail