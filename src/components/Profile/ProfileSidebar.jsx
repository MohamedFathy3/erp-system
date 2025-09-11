import Image from 'next/image';

const ProfileSidebar = ({ user, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: 'fas fa-user-circle' },
    { id: 'device', label: 'معلومات الجهاز', icon: 'fas fa-laptop' },
    { id: 'tickets', label: 'التذاكر', icon: 'fas fa-ticket-alt' },
  ];

  return (
    <div className="w-full md:w-1/3 lg:w-1/4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          <Image
            src={user?.avatar || '/default-avatar.png'}
            width={96}
            height={96}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover mb-4"
          />
          <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          
          <div className="w-full mt-6 space-y-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right py-2 px-4 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <i className={`${tab.icon} ml-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;