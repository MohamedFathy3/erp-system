import { User } from '@/types/infoprofile'

interface DeviceInfoProps {
  deviceInfo: User['latestDevice']
}

export default function DeviceInfo({ deviceInfo }: DeviceInfoProps) {
  if (!deviceInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Device Information</h1>
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <i className="fas fa-laptop text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500">No device information available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Device Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Device Type</h3>
            <p className="text-lg">{deviceInfo.type || 'No data'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</h3>
            <p className="text-lg font-mono">{deviceInfo.serialNumber || 'No data'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</h3>
            <p className="text-lg">{deviceInfo.memory?.size || 'No data'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Processor</h3>
            <p className="text-lg">{deviceInfo.cpu?.name || 'No data'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</h3>
            <div className="text-lg">
              {deviceInfo.storages && deviceInfo.storages.length > 0 ? (
                deviceInfo.storages.map((storage, index) => (
                  <p key={index}>{storage.type} - {storage.size}</p>
                ))
              ) : (
                <p>No data</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Graphics Card</h3>
            <p className="text-lg">{deviceInfo.gpu?.model || 'No data'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
            <p className={`text-lg font-semibold ${
              deviceInfo.active ? 'text-green-600' : 'text-gray-500'
            }`}>
              {deviceInfo.active ? 'Active' : 'Inactive'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Expiry Date</h3>
            <p className="text-lg">{deviceInfo.warrantyExpireDate || 'No data'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}