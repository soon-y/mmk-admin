import { useEffect } from "react"

function Home() {
  // const [stats, setStats] = useState({
  //   totalSales: 0,
  //   totalOrders: 0,
  //   totalCustomers: 0,
  //   topProducts: [],
  // })

  useEffect(() => {
    // const fetchStats = async () => {
    //   try {
    //     const token = localStorage.getItem('token')
    //     const res = await axios.get('http://localhost:3000/admin/dashboard', {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     setStats(res.data)
    //   } catch (err) {
    //     console.error('Error loading dashboard stats:', err)
    //   }
    // }

    // fetchStats()
  }, [])

  return (
      <div className="container p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          {/* <p className="text-2xl font-bold text-green-600">${stats.totalSales.toFixed(2)}</p> */}
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          {/* <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p> */}
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold">Customers</h2>
          {/* <p className="text-2xl font-bold text-purple-600">{stats.totalCustomers}</p> */}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Sold</th>
              <th className="px-4 py-2 border">Revenue ($)</th>
            </tr>
          </thead>
          <tbody>
            {/* {stats.topProducts.map((product) => ( */}
              <tr>
                <td className="px-4 py-2 border">product.name</td>
                <td className="px-4 py-2 border">product.sold</td>
                <td className="px-4 py-2 border">product.revenue.toFixed(2)</td>
              </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>

      </div>
  )
}

export default Home
