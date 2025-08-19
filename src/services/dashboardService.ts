import { QueryFunction } from '@tanstack/react-query'

// أنواع البيانات
interface DashboardStats {
  employees: EmployeeStats
  issues: IssueStats
  devices: DeviceStats
  companies: CompanyStats
}

interface EmployeeStats {
  total: number
  active: number
  inactive: number
}

interface IssueStats {
  total: number
  open: number
  closed: number
}

interface DeviceStats {
  total: number
  assigned: number
  unassigned: number
}

interface CompanyStats {
  total: number
  active: number
  inactive: number
}

// بيانات مخبأة لتقليل إعادة الحساب
let cachedData: DashboardStats | null = null

export const fetchDashboardStats: QueryFunction<DashboardStats> = async () => {
  // استخدام البيانات المخبأة إذا كانت موجودة
  if (cachedData) {
    return cachedData
  }

  // بيانات وهمية خفيفة
  const data: DashboardStats = {
    employees: {
      total: 245,
      active: 230,
      inactive: 15
    },
    issues: {
      total: 42,
      open: 18,
      closed: 24
    },
    devices: {
      total: 156,
      assigned: 132,
      unassigned: 24
    },
    companies: {
      total: 38,
      active: 35,
      inactive: 3
    }
  }

  // تخزين البيانات في الكاش
  cachedData = data
  return data
}

// دوال مخبأة للرسوم البيانية
const chartCache = new Map<string, []>()

export const fetchEmployeeStats = async (range: string) => {
  const cacheKey = `employees-${range}`
  if (chartCache.has(cacheKey)) {
    return chartCache.get(cacheKey)
  }

  // بيانات خفيفة للرسم البياني
  const data = range === 'weekly' ? [
    { name: 'الاثنين', hired: 3, left: 0 },
    { name: 'الثلاثاء', hired: 2, left: 1 },
    { name: 'الأربعاء', hired: 4, left: 0 }
  ] : range === 'monthly' ? [
    { name: 'يناير', hired: 12, left: 2 },
    { name: 'فبراير', hired: 8, left: 1 }
  ] : [
    { name: '2022', hired: 72, left: 18 },
    { name: '2023', hired: 60, left: 10 }
  ]

  chartCache.set(cacheKey, data)
  return data
}

export const fetchIssuesStats = async (range: string) => {
  const cacheKey = `issues-${range}`
  if (chartCache.has(cacheKey)) {
    return chartCache.get(cacheKey)
  }

  const data = range === 'weekly' ? [
    { name: 'الاثنين', opened: 5, closed: 2 },
    { name: 'الثلاثاء', opened: 3, closed: 4 }
  ] : range === 'monthly' ? [
    { name: 'يناير', opened: 25, closed: 20 },
    { name: 'فبراير', opened: 18, closed: 15 }
  ] : [
    { name: '2022', opened: 220, closed: 200 },
    { name: '2023', opened: 150, closed: 130 }
  ]

  chartCache.set(cacheKey, data)
  return data
}

export const fetchDevicesStats = async (type: string) => {
  const cacheKey = `devices-${type}`
  if (chartCache.has(cacheKey)) {
    return chartCache.get(cacheKey)
  }

  const data = type === 'laptops' ? [
    { name: 'معينة', value: 75 }
  ] : type === 'mobiles' ? [
    { name: 'معينة', value: 45 }
  ] : [
    { name: 'أجهزة لاب توب', value: 100 }
  ]

  chartCache.set(cacheKey, data)
  return data
}

export const fetchCompaniesStats = async (range: string) => {
  const cacheKey = `companies-${range}`
  if (chartCache.has(cacheKey)) {
    return chartCache.get(cacheKey)
  }

  const data = range === 'quarterly' ? [
    { name: 'Q1', new: 5, churned: 1 }
  ] : range === 'yearly' ? [
    { name: '2022', new: 30, churned: 12 }
  ] : [
    { name: '2021-2023', new: 73, churned: 29 }
  ]

  chartCache.set(cacheKey, data)
  return data
}