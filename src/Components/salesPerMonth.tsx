import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { OrderProps } from '../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  orders: OrderProps[]
}

const SalesPerMonthChart: React.FC<Props> = ({ orders }) => {
  const getMonthlySales = (orders: OrderProps[]) => {
    const salesMap: Record<string, number> = {}

    for (const order of orders) {
      const date = new Date(order.created_at!)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      salesMap[key] = (salesMap[key] || 0) + order.paidAmount
    }

    return Object.entries(salesMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }))
  }

  const monthlySales = getMonthlySales(orders)

  const chartData = {
    labels: monthlySales.map((s) => s.month),
    datasets: [
      {
        label: 'Sales per Month',
        data: monthlySales.map((s) => s.total),
        backgroundColor: 'rgba(253, 18, 116, 0.81)',
        borderRadius: 6
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

  return <div className="h-96">
    <div className="h-full">
      <Bar
        data={chartData}
        options={{
          ...chartOptions,
          maintainAspectRatio: false // Important for full height
        }}
      />
    </div>
  </div>

}

export default SalesPerMonthChart
