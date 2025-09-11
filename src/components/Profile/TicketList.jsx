const TicketList = ({ title, tickets, emptyMessage, icon, iconColor }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
          عرض الكل
        </button>
      </div>
      
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{ticket.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ticket.category.name}</p>
              <p className="text-xs text-gray-400 mt-2">تم الإنشاء: {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <i className={`${icon} ${iconColor} text-4xl mb-3`}></i>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default TicketList;