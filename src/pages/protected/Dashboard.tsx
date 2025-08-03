import { useEffect, useState } from "react"
import { fetchCustomerOrders } from "../../utils/orderUtils"
import { getCustomers } from "../../utils/customerUtils"
import type { CustomerProps, OrderProps } from "../../types"

function Dashboard() {
  const [order, setOrder] = useState<OrderProps[]>()
  const [customer, setCustomer] = useState<CustomerProps[]>()

  useEffect(() => {
    Promise.all([fetchCustomerOrders(), getCustomers()])
      .then(([orders, customers]) => {
        if (orders && customers) {
          setOrder(orders)
          setCustomer(customers)
        }
      })
  }, [])

  return (
    <div className="container p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-4 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          €
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p>{customer?.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Today Orders</h2>
          <p>{customer?.length}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Customers</h2>
          <p>{customer?.length}</p>
        </div>
      </div>


    </div>
  )
}

export default Dashboard
