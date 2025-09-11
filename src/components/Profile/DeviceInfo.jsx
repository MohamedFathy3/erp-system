import LoadingSpinner from '@/components/Profile/LoadingSpinner';

const DeviceInfo = ({ deviceInfo, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
          <p className="text-gray-500 mr-2">جاري تحميل معلومات الجهاز...</p>
        </div>
      </div>
    );
  }

  if (!deviceInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">معلومات الجهاز</h1>
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <i className="fas fa-laptop text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500">لا توجد معلومات عن الجهاز</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">معلومات الجهاز</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">النوع</h3>
            <p className="text-lg">{deviceInfo.type}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">الرقم التسلسلي</h3>
            <p className="text-lg font-mono">{deviceInfo.serialNumber}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">الذاكرة العشوائية</h3>
            <p className="text-lg">{deviceInfo.ram}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">المعالج</h3>
            <p className="text-lg">{deviceInfo.processor}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">التخزين</h3>
            <p className="text-lg">{deviceInfo.storages}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">كارت الشاشة</h3>
            <p className="text-lg">{deviceInfo.gpu}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</h3>
            <p className="text-lg">{deviceInfo.status}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">تاريخ انتهاء الضمان</h3>
            <p className="text-lg">{deviceInfo.warrantyExpireDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;