// // components/dashboard/StorageCategoriesPageClient.tsx
// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dialog } from "@headlessui/react";
// import { apiFetch } from "@/lib/api";

// // Types
// export interface Category {
//   id: number;
//   name: string;
//   type: string;
// }

// // API
// export async function fetchCategories(): Promise<Category[]> {
//   const res = await apiFetch(`/type`);
//   if (!res.ok) throw new Error("Failed to fetch categories");
//   return res.data.map((item: Category) => ({ id: item.id, name: item.name, type: item.type }));
// }


// export async function addCategory(category: { name: string; type: string }) {
//   await apiFetch(`/type/create`, {
//     method: "POST",
//     body: JSON.stringify(category),
//     headers: { "Content-Type": "application/json" },
//   });
// }

// export async function deleteCategory(id: number) {
//   await apiFetch(`/type/delete`, {
//     method: "POST",
//     body: JSON.stringify({ ids: [id] }),
//     headers: { "Content-Type": "application/json" },
//   });
// }

// // Client Component
// export default function StorageCategoriesPageClient({ initialData }: { initialData: Category[] }) {
//   const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({ name: "", type: "device" });

//   const queryClient = useQueryClient();

//   const { data } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//     initialData,
//     staleTime: 24 * 60 * 60 * 1000, // 24 ساعة
//   });

//   const addMutation = useMutation({ mutationFn: addCategory, onSuccess: () => queryClient.invalidateQueries(["categories"]) });
//   const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: () => queryClient.invalidateQueries(["categories"]) });

//   const toggleSelect = (id: number) => {
//     const s = new Set(selectedItems);
//     s.has(id) ? s.delete(id) : s.add(id);
//     setSelectedItems(s);
//   };

//   const toggleSelectAll = () => {
//     if (!data) return;
//     selectedItems.size === data.length ? setSelectedItems(new Set()) : setSelectedItems(new Set(data.map(c => c.id)));
//   };

//   const handleSubmitAdd = () => {
//     if (!modalData.name.trim()) return;
//     addMutation.mutate(modalData);
//     setIsModalOpen(false);
//     setModalData({ name: "", type: "device" });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Categories</h1>
//         <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Add</button>
//       </div>

//       <div className="overflow-x-auto border rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2">
//                 <input type="checkbox" onChange={toggleSelectAll} checked={data ? selectedItems.size === data.length : false} />
//               </th>
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data?.map((c) => (
//               <tr key={c.id}>
//                 <td className="px-4 py-2">
//                   <input type="checkbox" checked={selectedItems.has(c.id)} onChange={() => toggleSelect(c.id)} />
//                 </td>
//                 <td className="px-4 py-2">{c.id}</td>
//                 <td className="px-4 py-2">{c.name}</td>
//                 <td className="px-4 py-2">{c.type}</td>
//                 <td className="px-4 py-2 text-right space-x-2">
//                   <button onClick={() => { setModalData(c); setIsModalOpen(true); }} className="px-2 border rounded">Edit</button>
//                   <button onClick={() => deleteMutation.mutate(c.id)} className="px-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center">
//         <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//         <div className="bg-white p-6 rounded shadow z-20 w-full max-w-md">
//           <h2 className="text-lg font-bold mb-4">Add / Edit Category</h2>
//           <input type="text" placeholder="Name" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} className="border px-2 py-1 w-full mb-2" />
//           <select value={modalData.type} onChange={(e) => setModalData({ ...modalData, type: e.target.value })} className="border px-2 py-1 w-full mb-2">
//             <option value="device">Device</option>
//             <option value="issue">Issue</option>
//           </select>
//           <div className="flex justify-end gap-2">
//             <button onClick={() => setIsModalOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
//             <button onClick={handleSubmitAdd} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Save</button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// }
