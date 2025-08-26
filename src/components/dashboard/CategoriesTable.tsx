// "use client";

// // import DataTableWithActions, { Column } from "@/components/dashboard/DataTableWithActions";
// import { Category } from "@/app/manage/device-type/page"; 
// import { useRouter } from "next/navigation";

// const columns: Column<Category>[] = [
//   { key: "id", header: "ID" },
//   { key: "name", header: "Name" },
//   { key: "type", header: "Type" },
// ];

// interface CategoriesTableProps {
//   data: Category[];
// }

// export default function CategoriesTable({ data }: CategoriesTableProps) {
//   const router = useRouter();

//   const handleAdd = () => {
//     router.push("/manage/device-type/create");
//   };

//   const handleEdit = (item: Category) => {
//     router.push(`/manage/device-type/${item.id}/edit`);
//   };

//   const handleDelete = (items: Category[]) => {
//     console.log("Deleting categories:", items);
//     // TODO: اعمل هنا apiFetch لطلب DELETE
//   };

//   return (
//     <DataTableWithActions<Category>
//       title="Categories"
//       data={data}
//       columns={columns}
//       searchable
//       selectable
//       addButtonLabel="Add Category"
//       onAdd={handleAdd}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//     />
//   );
// }
