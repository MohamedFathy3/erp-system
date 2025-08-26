// // app/manage/device-type/page.tsx
// "use client";

// import MainLayout from "@/components/MainLayout";
// import Cards from "@/components/dashboard/SmalCard";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dialog } from "@headlessui/react";
// import { QueryProvider } from "@/providers/QueryProvider";
// import { useState } from "react";

// // ----- API -----

// async function fetchCategories(): Promise<Category[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type`);
//   const json = await res.json();
//   console.log("Raw API response:", json);
//   console.log("Data array:", json.data);
//   return json.data?.map((item: any) => ({
//     id: item.id,
//     name: item.name,
//     type: item.type,
//   })) || [];
// }

// async function addCategory(category: { name: string; type: string }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/create`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(category),
//   });
//   if (!res.ok) throw new Error("Failed to add category");
//   return res.json();
// }

// async function deleteCategory(id: number) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/delete`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ids: [id] }),
//   });
//   if (!res.ok) throw new Error("Failed to delete category");
//   return res.json();
// }

// // ----- COMPONENT -----
// function CategoriesTable() {
//   const queryClient = useQueryClient();
//   const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({ name: "", type: "device", id: 0 });

//   const { data: categories = [], isLoading, isError } = useQuery({
//     queryKey: ["categories", "list"],
//     queryFn: fetchCategories,
//     staleTime: 60 * 1000,
//   });

//   const addMutation = useMutation({ mutationFn: addCategory, onSuccess: () => queryClient.invalidateQueries(["categories", "list"]) });
//   const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: () => queryClient.invalidateQueries(["categories", "list"]) });

//   const toggleSelect = (id: number) => {
//     const s = new Set(selectedItems);
//     s.has(id) ? s.delete(id) : s.add(id);
//     setSelectedItems(s);
//   };

//   const toggleSelectAll = () => {
//     selectedItems.size === categories.length
//       ? setSelectedItems(new Set())
//       : setSelectedItems(new Set(categories.map(c => c.id)));
//   };

//   const handleSubmitAdd = () => {
//     if (!modalData.name.trim()) return;
//     addMutation.mutate({ name: modalData.name, type: modalData.type });
//     setIsModalOpen(false);
//     setModalData({ name: "", type: "device", id: 0 });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Categories</h1>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//         >
//           Add
//         </button>
//       </div>

//       {isLoading && <p>Loading categories...</p>}
//       {isError && <p className="text-red-500">Error fetching categories.</p>}

//       {selectedItems.size > 0 && (
//         <button
//           onClick={() => selectedItems.forEach(id => deleteMutation.mutate(id))}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mb-2"
//         >
//           Delete Selected ({selectedItems.size})
//         </button>
//       )}

//       <div className="overflow-x-auto border rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2">
//                 <input type="checkbox" onChange={toggleSelectAll} checked={categories.length > 0 && selectedItems.size === categories.length} />
//               </th>
//               <th className="px-4 py-2">ID</th>
//               <th className="px-4 py-2">Name</th>
//               <th className="px-4 py-2">Type</th>
//               <th className="px-4 py-2 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map(c => (
//               <tr key={c.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-2">
//                   <input type="checkbox" checked={selectedItems.has(c.id)} onChange={() => toggleSelect(c.id)} />
//                 </td>
//                 <td className="px-4 py-2">{c.id}</td>
//                 <td className="px-4 py-2">{c.name}</td>
//                 <td className="px-4 py-2">{c.type}</td>
//                 <td className="px-4 py-2 text-right space-x-2">
//                   <button onClick={() => { setModalData(c); setIsModalOpen(true); }} className="px-2 border rounded hover:bg-gray-100 transition">Edit</button>
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
//           <input
//             type="text"
//             placeholder="Name"
//             value={modalData.name}
//             onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
//             className="border px-2 py-1 w-full mb-2"
//           />
//           <select
//             value={modalData.type}
//             onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
//             className="border px-2 py-1 w-full mb-2"
//           >
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

// export default function Page() {
//   return (
//     <QueryProvider>
//       <MainLayout>
//         <Cards />
//         <CategoriesTable />
//       </MainLayout>
//     </QueryProvider>
//   );
// }
