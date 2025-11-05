import { Ticket } from '@/types/infoprofile'

interface TicketsSectionProps {
  overdueTickets: Ticket[]
  assignedTickets: Ticket[]
}

export default function TicketsSection({ overdueTickets, assignedTickets }: TicketsSectionProps) {
  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{ticket.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${
          ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {ticket.priority}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{ticket.category.name}</p>
      <p className="text-xs text-gray-400 mt-2">Created: {ticket.createdAt}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Overdue Tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Overdue Tasks</h2>
          <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            View All
          </button>
        </div>
        
        {overdueTickets.length > 0 ? (
          <div className="space-y-4">
            {overdueTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
            <p className="text-gray-500">No overdue tasks</p>
          </div>
        )}
      </div>

      {/* Assigned Tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assigned Tasks</h2>
          <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            View All
          </button>
        </div>
        
        {assignedTickets.length > 0 ? (
          <div className="space-y-4">
            {assignedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-3"></i>
            <p className="text-gray-500">No assigned tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}