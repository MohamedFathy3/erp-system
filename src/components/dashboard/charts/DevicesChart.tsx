'use client'

import { useEffect, useState } from 'react'
import { fetchDevicesStats } from '@/services/dashboardService'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DevicesChart() {
  const [deviceType, setDeviceType] = useState('all')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchDevicesStats(deviceType)
        setData(res)
      } catch (err) {
        setError('حدث خطأ في تحميل بيانات الأجهزة')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [deviceType])

  if (loading) return <div>جاري تحميل الرسم البياني...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">توزيع الأجهزة</h3>
        <select
          className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-sm"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
        >
          <option value="all">الكل</option>
          <option value="laptops">أجهزة لاب توب</option>
          <option value="mobiles">أجهزة محمولة</option>
          <option value="servers">سيرفرات</option>
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
