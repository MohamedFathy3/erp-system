
// lib/api/deviceTyepApi.ts
export interface Category {
  id: number;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  deleted?: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type`);
  const json = await res.json();
  console.log("Raw API response:", json); // نشوف كل الرد
  console.log("Data array:", json.data);   // نشوف الـ array
  return json.data?.map((item: Category) => ({
    id: item.id,
    name: item.name,
    type: item.type
  })) || [];
}


export async function addCategory(category: { name: string; type: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });

  if (!res.ok) throw new Error("Failed to add category");

  return res.json();
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/type/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] }),
  });

  if (!res.ok) throw new Error("Failed to delete category");

  return res.json();
}
