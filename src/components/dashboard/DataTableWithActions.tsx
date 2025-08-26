// // components/ui/DataTableWithActions.tsx
// "use client";

// import { useState, useMemo, ReactNode } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// // تعريف الأنواع
// export interface Column<T> {
//   key: keyof T;
//   header: string;
//   render?: (value: T[keyof T], row: T) => ReactNode;
// }

// interface DataTableWithActionsProps<T> {
//   data: T[] | undefined | null;
//   columns: Column<T>[] | undefined | null;
//   searchable?: boolean;
//   selectable?: boolean;
//   onAdd?: () => void;
//   onEdit?: (item: T) => void;
//   onDelete?: (items: T[]) => void;
//   addButtonLabel?: string;
//   searchPlaceholder?: string;
//   title?: string;
// }

// // دالة مساعدة للتحقق من وجود خاصية في الكائن
// function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
//   return key in obj;
// }

// export default function DataTableWithActions<T extends { id: string | number }>({
//   data,
//   columns,
//   searchable = true,
//   selectable = true,
//   onAdd,
//   onEdit,
//   onDelete,
//   addButtonLabel = "Add New",
//   searchPlaceholder = "Search for items",
//   title = "Data Table"
// }: DataTableWithActionsProps<T>) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedItems, setSelectedItems] = useState<Set<T["id"]>>(new Set());
//   const [selectAll, setSelectAll] = useState(false);

//   const cleanData = useMemo(() => {
//     if (!data || !Array.isArray(data)) {
//       return [];
//     }
//     return data.filter(item => item != null);
//   }, [data]);

//   const cleanColumns = useMemo(() => {
//     if (!columns || !Array.isArray(columns)) {
//       return [];
//     }
//     return columns.filter(column => column != null);
//   }, [columns]);

//   const filteredData = useMemo(() => {
//     if (!searchTerm) return cleanData;
    
//     const lowerSearchTerm = searchTerm.toLowerCase();
    
//     return cleanData.filter((item) => {
//       return cleanColumns.some(column => {
//         if (!hasKey(item, column.key)) return false;
        
//         const value = item[column.key];
//         if (value === null || value === undefined) return false;
        
//         return value.toString().toLowerCase().includes(lowerSearchTerm);
//       });
//     });
//   }, [searchTerm, cleanData, cleanColumns]);

//   const toggleSelectAll = () => {
//     if (selectAll) {
//       setSelectedItems(new Set());
//     } else {
//       const allIds = filteredData.map(item => item.id);
//       setSelectedItems(new Set(allIds));
//     }
//     setSelectAll(!selectAll);
//   };

//   const toggleSelectItem = (id: T["id"]) => {
//     const newSelectedItems = new Set(selectedItems);
//     if (newSelectedItems.has(id)) {
//       newSelectedItems.delete(id);
//     } else {
//       newSelectedItems.add(id);
//     }
//     setSelectedItems(newSelectedItems);
//     setSelectAll(newSelectedItems.size === filteredData.length);
//   };

//   const handleDeleteSelected = () => {
//     if (selectedItems.size === 0) return;
    
//     const itemsToDelete = cleanData.filter(item => selectedItems.has(item.id));
//     if (onDelete) {
//       onDelete(itemsToDelete);
//     }
    
//     // إعادة تعيين التحديد
//     setSelectedItems(new Set());
//     setSelectAll(false);
//   };

//   // حساب عدد الأعمدة لعرض رسالة عدم وجود بيانات
//   const colSpanCount = useMemo(() => {
//     return cleanColumns.length + (selectable ? 1 : 0) + ((onEdit || onDelete) ? 1 : 0);
//   }, [cleanColumns, selectable, onEdit, onDelete]);

//   return (
//     <div className="space-y-4 p-6">
//       {/* Header with Add Button */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
//         {onAdd && (
//           <Button
//             className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
//             onClick={onAdd}
//           >
//             {addButtonLabel}
//           </Button>
//         )}
//       </div>

//       {/* Search and Bulk Actions */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         {searchable && (
//           <Input
//             placeholder={searchPlaceholder}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="max-w-md text-black dark:text-gray-100 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:placeholder-gray-400"
//           />
//         )}
        
//         {selectable && selectedItems.size > 0 && onDelete && (
//           <Button
//             variant="destructive"
//             onClick={handleDeleteSelected}
//             className="flex items-center gap-2"
//           >
//             <TrashIcon className="w-4 h-4" />
//             Delete Selected ({selectedItems.size})
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//           <thead className="bg-gray-50 dark:bg-gray-800">
//             <tr>
//               {selectable && (
//                 <th className="px-6 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={toggleSelectAll}
//                     className="rounded text-indigo-600 focus:ring-indigo-500"
//                   />
//                 </th>
//               )}
//               {cleanColumns.length > 0 ? (
//                 cleanColumns.map((column) => (
//                   <th key={column.key as string} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                     {column.header}
//                   </th>
//                 ))
//               ) : (
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   No columns defined
//                 </th>
//               )}
//               {(onEdit || onDelete) && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
//             </tr>
//           </thead>
//           <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//             {filteredData.length > 0 ? (
//               filteredData.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//                   {selectable && (
//                     <td className="px-6 py-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.has(item.id)}
//                         onChange={() => toggleSelectItem(item.id)}
//                         className="rounded text-indigo-600 focus:ring-indigo-500"
//                       />
//                     </td>
//                   )}
//                   {cleanColumns.map((column) => {
//                     const value = hasKey(item, column.key) ? item[column.key] : undefined;
//                     return (
//                       <td key={column.key as string} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
//                         {column.render ? column.render(value, item) : (value ?? '-')}
//                       </td>
//                     );
//                   })}
//                   {(onEdit || onDelete) && (
//                     <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
//                       {onEdit && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onEdit(item)}
//                         >
//                           Edit
//                         </Button>
//                       )}
//                       {onDelete && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => onDelete([item])}
//                         >
//                           Delete
//                         </Button>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td 
//                   colSpan={colSpanCount} 
//                   className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
//                 >
//                   {cleanData.length === 0 ? 'No data available' : 'No items found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // Icons
// const TrashIcon = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//   </svg>
// );