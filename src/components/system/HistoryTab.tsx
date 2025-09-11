// components/HistoryTab.tsx
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  FileText, 
  Users, 
  Calendar, 
  User, 
  UserX, 
  Filter, 
  Download, 
  Activity 
} from 'lucide-react';
import FilterModal from './FilterModal';
import { HistoryRecord, Employee, FilterOptions } from '@/types/history';

interface HistoryTabProps {
  historyData: HistoryRecord[];
  isLoading: boolean;
  deviceId: number;
  onDownload: (deviceId: number, filters: FilterOptions) => void;
  employees?: Employee[];
  categories?: string[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ 
  historyData, 
  isLoading, 
  deviceId, 
  onDownload, 
  employees = [], 
  categories = [] 
}) => {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});

  const handleApplyFilter = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    setShowFilterModal(false);
    // هنا يمكنك استدعاء دالة لتصفية البيانات بناءً على الفلتر
  };

  const handleDownload = () => {
    onDownload(deviceId, appliedFilters);
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Device History
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Device History
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm bg-blue-500/20 px-3 py-1.5 rounded-full">
                <span className="bg-white/20 p-1 rounded-full">
                  <FileText className="h-4 w-4" />
                </span>
                <span>{historyData?.length || 0} records found</span>
              </div>
              
              <Button
                onClick={() => setShowFilterModal(true)}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-0">
          {historyData && historyData.length > 0 ? (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-left border-b border-gray-200 dark:border-gray-600">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Action Type
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Note
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Involved Parties
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date & Time
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {historyData.map((item) => (
                      <tr 
                        key={item.id} 
                        className="transition-all duration-200 hover:bg-blue-50/30 dark:hover:bg-gray-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg flex items-center ${
                              item.action_type === "Hardware Issues" ? 
                                "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                              item.action_type === "Email & Communication" ? 
                                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                              item.action_type === "Software Installation" ? 
                                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            }`}>
                              <span className="text-xs font-medium">{item.action_type}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="group relative">
                            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 font-medium">
                              {item.note}
                            </p>
                            {item.note && item.note.length > 60 && (
                              <div className="absolute invisible group-hover:visible z-10 bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl">
                                <div className="font-semibold mb-1">Full Note:</div>
                                {item.note}
                                <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            {item.help_desk_name && (
                              <div className="flex items-center text-sm">
                                <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-full mr-2">
                                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400 text-xs">Help Desk</div>
                                  <div className="text-gray-900 dark:text-white font-medium">{item.help_desk_name}</div>
                                </div>
                              </div>
                            )}
                            {item.employee_name && (
                              <div className="flex items-center text-sm">
                                <div className="bg-green-100 dark:bg-green-900/20 p-1.5 rounded-full mr-2">
                                  <User className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <div className="text-gray-500 dark:text-gray-400 text-xs">Employee</div>
                                  <div className="text-gray-900 dark:text-white font-medium">{item.employee_name}</div>
                                </div>
                              </div>
                            )}
                            {!item.help_desk_name && !item.employee_name && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center">
                                <UserX className="h-4 w-4 mr-1" />
                                No parties involved
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {item.createdAt}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No history recorded</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                There are no history records for this device yet. Actions will appear here once they are logged.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
        employees={employees}
        categories={categories}
      />
    </>
  );
};

export default HistoryTab;