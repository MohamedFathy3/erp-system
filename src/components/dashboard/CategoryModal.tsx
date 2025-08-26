// components/categories/CategoryModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Category } from "@/app/manage/device-type/page";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Category, "id">) => void;
  category?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setTypeId(category.type?.toString() || "");
    } else {
      setName("");
      setDescription("");
      setTypeId("");
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type: typeId 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {category ? "Edit Category" : "Add New Category"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type ID</label>
            <input
              type="number"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {category ? "Update" : "Add"} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}