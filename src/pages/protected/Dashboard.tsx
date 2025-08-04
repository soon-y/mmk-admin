import { useEffect, useState } from "react"
import { fetchAllOrderedProducts, fetchCustomerOrders, fetchOrderedProducts } from "../../utils/orderUtils"
import { getCustomers } from "../../utils/customerUtils"
import type { CustomerProps, OrderedProductProps, OrderProps, ProductProps } from "../../types"
import { fetchProduct, grouppingImgs } from "../../utils/productUtils"
import LoadingBar from "../../Components/LoadingBar"
import { useNavigate } from "react-router-dom"
import SalesPerMonthChart from "../../Components/salesPerMonth"

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)
  const [sales, setSales] = useState<number>(0)
  const [orders, setOrders] = useState<OrderProps[]>()
  const [totalOrder, setTotalOrder] = useState<number>(0)
  const [todayOrder, setTodayOrder] = useState<number>(0)
  const [bestProducts, setBestProducts] = useState<ProductProps[]>()
  const [bestProductsInfo, setBestProductsInfo] = useState<{ productId: number, color: string, size: string, count: number }[]>()
  const [customer, setCustomer] = useState<CustomerProps[]>()

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchCustomerOrders(), fetchAllOrderedProducts(), getCustomers()])
      .then(async ([orders, orderedProducts, customers]) => {
        if (orderedProducts) {
          const BestSellingProductsInfo = getTop3BestSelling(orderedProducts!)
          setBestProductsInfo(BestSellingProductsInfo)

          const productPromises = BestSellingProductsInfo.map((el) =>
            fetchProduct(Number(el.productId))
          )

          const results = await Promise.all(productPromises)

          const bestSellingProducts: ProductProps[] = results.filter(
            (product): product is ProductProps => product !== null
          )

          setBestProducts(bestSellingProducts)
        }

        if (customers) {
          setCustomer(customers)
        }

        if (orders) {
          setOrders(orders)
          const totalPaid = orders.reduce((sum, order) => sum + order.paidAmount, 0)
          setSales(totalPaid)
          setTotalOrder(orders.length)
          setTodayOrder(countTodaysOrders(orders))
        }
        setLoading(false)
      })
  }, [])

  function countTodaysOrders(orders: OrderProps[]): number {
    const today = new Date()
    const todayStr = today.toISOString().slice(0, 10)

    return orders.filter(order => order.created_at!.slice(0, 10) === todayStr).length
  }

  function getTop3BestSelling(orderedProducts: OrderedProductProps[]): { productId: number, color: string, size: string, count: number }[] {
    const countMap: Record<string, { productId: number, color: string, size: string, count: number }> = {}

    for (const item of orderedProducts) {
      const key = `${item.productId}_${item.color}_${item.size}`

      if (!countMap[key]) {
        countMap[key] = {
          productId: item.productId,
          color: item.color,
          size: item.size,
          count: 1,
        }
      } else {
        countMap[key].count += 1
      }
    }

    const sorted = Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
    return sorted
  }

  return (
    <div>
      {!loading ?
        <div className="container p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="p-4 bg-white rounded-xl shadow-md text-center">
              <h2>Total Sales</h2>
              <span className="text-xl font-bold">{sales}</span> €
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md text-center" onClick={() => navigate('/orders')}>
              <h2>Total Orders</h2>
              <p className="text-xl font-bold">{totalOrder}</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md text-center" onClick={() => navigate('/orders')}>
              <h2>Today's Orders</h2>
              <p className="text-xl font-bold">{todayOrder}</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-md text-center" onClick={() => navigate('/customers')}>
              <h2>Customers</h2>
              <p className="text-xl font-bold">{customer?.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-4 bg-white rounded-xl shadow-md flex flex-col gap-4">
              <h2>Sales</h2>
              <div className="h-full">
              <SalesPerMonthChart orders={orders!} />
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-md flex flex-col gap-4">
              <h2>Best Selling Products</h2>
              {bestProducts?.map((el, i) => (
                <div key={i} className="grid grid-cols-[120px_1fr] gap-4 cursor-pointer" onClick={() => navigate(`/product/${el.id}`)}>
                  <img className="rounded-md" src={grouppingImgs(el.images, el.imagesCount)[el.color.split('/').findIndex((el) => el === bestProductsInfo![i].color)][0]} />
                  <div>
                    <p>{el.name}</p>
                    <div className="flex gap-2 font-bold">
                      <p>{el.discount} €</p>
                      {el.discount !== el.price && <p className="text-gray-300 line-through">{el.price} €</p>}
                    </div>
                    <p>color: {bestProductsInfo![i].color}</p>
                    <p>size: {bestProductsInfo![i].size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> :
        <div>
          <LoadingBar />
        </div>}
    </div>
  )
}

export default Dashboard
