// components/skeletons/ChartSkeleton.tsx
export default function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow h-80 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-full bg-gray-100 dark:bg-gray-700 rounded"></div>
    </div>
  )
}