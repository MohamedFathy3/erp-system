import TicketList from '@/components/Profile/TicketList';
import LoadingSpinner from '@/components/Profile/LoadingSpinner';

const TicketsSection = ({ userTickets, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
            <p className="text-gray-500 mr-2">جاري تحميل التذاكر...</p>
          </div>
        </div>
      </div>
    );
  }

  // تصنيف التذاكر حسب حالتها
  const overdueTickets = userTickets.filter(ticket => 
    ticket.status === 'postponed' || ticket.dailyStatus === false
  );
  
  const assignedTickets = userTickets.filter(ticket => 
    ticket.status === 'open' || ticket.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* التذاكر المتأخرة */}
      <TicketList 
        title="المهام المتأخرة"
        tickets={overdueTickets}
        emptyMessage="لا توجد مهام متأخرة"
        icon="fas fa-exclamation-circle"
        iconColor="text-red-500"
      />

      {/* التذاكر المعينة */}
      <TicketList 
        title="المهام المعينة"
        tickets={assignedTickets}
        emptyMessage="لا توجد مهام معينة"
        icon="fas fa-check-circle"
        iconColor="text-green-500"
      />
    </div>
  );
};

export default TicketsSection;