export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium text-lg animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  )
}
