'use client';
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { apiFetch } from "@/lib/api";

export interface Category {
  id: number;
  size: number;
  type: string;
}

export default function StorageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [size, setSize] = useState("");
  const [type, setType] = useState("");

  // جلب كل البيانات
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/storage`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();

      setCategories(json.data); // تأكد أن backend يرجع { data: [...] }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // إضافة صنف جديد
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!size || !type) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await apiFetch("/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: Number(size),
          type,
        }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      alert("Category added successfully!");
      setSize("");
      setType("");

      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // حذف صنف
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await apiFetch(`/storage/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      alert("Category deleted!");
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <></>
  );
}
