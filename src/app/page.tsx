import MainLayout from '../components/MainLayout'
import '../styles/globals.css'

export default function Home() {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">ERP System Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your high-performance ERP system
        </p>
      </div>
    </MainLayout>
  )
}