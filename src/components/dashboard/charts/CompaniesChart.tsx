'use client'

import { useEffect, useState } from 'react'
import { fetchCompaniesStats } from '@/services/dashboardService'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CompaniesChart() {
  const [timeRange, setTimeRange] = useState('yearly')
  const [data, setData] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchCompaniesStats(timeRange)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setError('حدث خطأ في تحميل بيانات الشركات')
        setLoading(false)
      })
  }, [timeRange])

  if (loading) return <div>جاري تحميل الرسم البياني...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">نمو الشركات</h3>
        <select 
          className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="quarterly">ربع سنوي</option>
          <option value="yearly">سنوي</option>
          <option value="3years">3 سنوات</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" name="شركات جديدة" />
            <Area type="monotone" dataKey="churned" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="شركات مغلقة" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
