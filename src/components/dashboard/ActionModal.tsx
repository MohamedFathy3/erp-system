// // components/ActionModal.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";

// export default function ActionModal() {
//   const [open, setOpen] = useState(false);
//   const [device, setDevice] = useState<any>(null);

//   useEffect(() => {
//     const handler = (event: Event) => {
//       const customEvent = event as CustomEvent;
//       setDevice(customEvent.detail);
//       setOpen(true);
//     };
//     window.addEventListener("open-action-modal", handler);
//     return () => window.removeEventListener("open-action-modal", handler);
//   }, []);

//   return (
//     <>
//       {/* المودال */}
//       {open && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-4">
//               Add Action for{" "}
//               <span className="text-blue-600">{device?.brand?.name}</span>
//             </h2>

//             {/* Select */}
//             <label className="block text-sm font-medium mb-2">Action Type</label>
//             <select className="w-full border rounded-lg p-2 mb-4">
//               <option>Maintenance</option>
//               <option>Repair</option>
//               <option>Upgrade</option>
//             </select>

//             {/* Textarea */}
//             <label className="block text-sm font-medium mb-2">Notes</label>
//             <textarea
//               className="w-full border rounded-lg p-2 h-24 mb-4"
//               placeholder="Enter action details..."
//             />

//             <div className="flex justify-end gap-3">
//               <Button
//                 className="bg-gray-200 text-gray-800 hover:bg-gray-300"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//                 onClick={() => setOpen(false)}
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
