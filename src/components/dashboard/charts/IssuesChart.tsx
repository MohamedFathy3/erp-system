'use client'

import { useEffect, useState } from 'react'
import { fetchIssuesStats } from '@/services/dashboardService'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function IssuesChart() {
  const [timeRange, setTimeRange] = useState('monthly')
  const [data, setData] = useState<[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchIssuesStats(timeRange)
        setData(res)
      } catch (err) {
        setError('حدث خطأ في تحميل بيانات المشكلات')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  if (loading) return <div>جاري تحميل الرسم البياني...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">تحليل المشكلات</h3>
        <select
          className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="weekly">أسبوعي</option>
          <option value="monthly">شهري</option>
          <option value="yearly">سنوي</option>
        </select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="opened" stroke="#f59e0b" name="مفتوحة" />
            <Line type="monotone" dataKey="closed" stroke="#10b981" name="مغلقة" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
