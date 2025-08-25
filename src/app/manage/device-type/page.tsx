// StorageCategoriesPage.tsx (server component)
import MainLayout from "@/components/MainLayout";
import { apiFetch } from "@/lib/api";
import CategoriesTable from "@/components/dashboard/CategoriesTable"; 
import Cards from "@/components/dashboard/SmalCard";

export interface Category {
  id: number;
  name: string | null;
  type: String | null;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/type`, { 
      next: { 
        revalidate: 86400, 
        tags: ['categories'] 
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.data || data).map((item: Category) => ({
      id: item.id || 0,
      name: item.name || '',
      type_id: item.type || 0
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return []; 
  }
}

export default async function StorageCategoriesPage() {
  const categories = await fetchCategories();

  return (
    <MainLayout>

      <div className="p-4 sm:p-6 lg:p-8">
        <Cards />
          <CategoriesTable categories={categories} />
      </div>
    </MainLayout>
  );
}