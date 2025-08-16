export default function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-32 animate-pulse"></div>
      ))}
    </div>
  )
}

