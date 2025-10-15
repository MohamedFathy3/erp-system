// components/Pagination.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className = ""
}: PaginationProps) {
  const startItem = ((currentPage - 1) * perPage) + 1;
  const endItem = Math.min(currentPage * perPage, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (lastPage <= maxVisiblePages) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      } else if (currentPage >= lastPage - 2) {
        // في النهاية
        pages.push(1);
        pages.push('...');
        for (let i = lastPage - 3; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        // في المنتصف
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(lastPage);
      }
    }
    
    return pages;
  };

  return (
    <div className={`flex flex-col md:flex-row justify-between items-center gap-4 mt-6 ${className}`}>
      {/* معلومات الصفحة */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startItem} to {endItem} of {total} entries • Page {currentPage} of {lastPage}
      </div>
      
      {/* عناصر التحكم في الصفحات */}
      <div className="flex items-center space-x-2">
        {/* أول صفحة */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="min-w-[60px]"
        >
          First
        </Button>
        
        {/* الصفحة السابقة */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-w-[80px] text-black bg-green-300  dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
        >
          Previous
        </Button>
        
        {/* أرقام الصفحات */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="px-3 py-2 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] ${
                currentPage === page 
                  ? "bg-green-100 dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 text-white hover:bg-green-500" 
                  : ""
              }`}
            >
              {page}
            </Button>
          )
        ))}
        
        {/* الصفحة التالية */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-w-[60px] bg-green-100 dark:bg-orange-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
        >
          Next
        </Button>
        
        {/* آخر صفحة */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(lastPage)}
          className="min-w-[60px]"
        >
          Last
        </Button>
      </div>
      
      {/* الانتقال لصفحة محددة */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 w-40">Go to:</span>
        <Input
          type="number"
          min="1"
          max={lastPage}
          defaultValue={currentPage}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              const page = parseInt(input.value);
              if (page >= 1 && page <= lastPage) {
                onPageChange(page);
                input.value = currentPage.toString(); 
              }
            }
          }}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= lastPage) {
              onPageChange(page);
            }
          }}
          className="w-20 text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800"
        />
      </div>
    </div>
  );
}