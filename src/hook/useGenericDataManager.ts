// hooks/useGenericDataManager.ts
import { useState, FormEvent, useCallback, useEffect } from "react";
import { useQuery,useQueries, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiFetch } from "@/lib/api";
import {
  Entity,
  PaginationMeta,
  ApiResponse,
  FilterPayload,
  GenericDataManagerProps,
  GenericDataManagerState,
  GenericDataManagerHandlers,
  SaveOptions,
} from "@/types/generic-data-manager";

const PER_PAGE = 15;

interface AdditionalQueryResult {
  data?: unknown[];
  isLoading: boolean;
  error: Error | null;
}

export function useGenericDataManager({
  endpoint,
  additionalData = [],
  formFields = [],
  initialData = {},
  defaultFilters = {}
}: GenericDataManagerProps): GenericDataManagerState & GenericDataManagerHandlers & {
  data: Entity[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: Error | null;
  additionalQueries: Record<string, AdditionalQueryResult>;
  // غير من Entity لـ { data: Entity | FormData; isFormData?: boolean }
  saveItemMutation: UseMutationResult<unknown, Error, { data: Entity | FormData; isFormData?: boolean }>;
  deleteItemMutation: UseMutationResult<unknown, Error, { id: number; title: string }>;
  bulkDeleteMutation: UseMutationResult<unknown, Error, number[]>;
  bulkRestoreMutation: UseMutationResult<unknown, Error, number[]>;
  handleClearSearch: () => void;
  handleDeleteAll: () => void; 
} {
  const queryClient = useQueryClient();
  
  // State
  const [allData, setAllData] = useState<Entity[]>([]);
  const [filteredData, setFilteredData] = useState<Entity[]>([]);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Entity | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showingDeleted, setShowingDeleted] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
  const [orderBy, setOrderBy] = useState<string>('id');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<Record<string, string | number>>({});




  const handleToggleDeleted = (): void => {
  // صفّر العناصر المحددة
  setSelectedItems(new Set());

  // بدّل بين الوضعين
  setShowingDeleted(prev => !prev);

  // رجّع أول صفحة (اختياري)
  setCurrentPage(1);

  toast.success("View toggled successfully!");
};

const additionalQueriesArray = useQueries({
  queries: additionalData.map(data => ({
    queryKey: [data.key, data.filters],
    queryFn: async (): Promise<unknown[]> => {
      try {
        let json;
        
        if (data.filters && Object.keys(data.filters).length > 0) {
          const payload = {
            filters: data.filters,
            orderBy: "id",
            orderByDirection: "desc", 
            perPage: 100,
            paginate: true,
            deleted: false
          };
          
          console.log('🔍 Fetching additional data with payload:', payload);
          
          json = await apiFetch(`${data.endpoint}/index`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } else {
          // استخدام GET عادي إذا مفيش filters
          console.log('🔍 Fetching additional data without filters:', data.endpoint);
          json = await apiFetch(data.endpoint);
        }
        
        // Handle different response structures
        if (json && Array.isArray(json.data)) {
          console.log('✅ Additional data received:', json.data.length, 'items');
          return json.data;
        }
        if (Array.isArray(json)) {
          console.log('✅ Additional data received:', json.length, 'items');
          return json;
        }
        if (json && json.items && Array.isArray(json.items)) {
          console.log('✅ Additional data received:', json.items.length, 'items');
          return json.items;
        }
        console.warn(`❌ Unexpected response structure for ${data.endpoint}:`, json);
        return [];
      } catch (error) {
        console.error(`❌ Error fetching ${data.endpoint}:`, error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
    enabled: open,
  }))
});
  // تحويل الـ array إلى object
  const additionalQueries = additionalData.reduce((acc, data, index) => {
    acc[data.key] = additionalQueriesArray[index];
    return acc;
  }, {} as Record<string, AdditionalQueryResult>);

  // Main Data Query
  const { data: itemsData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: [endpoint, currentPage, showingDeleted, orderBy, orderByDirection, filters, defaultFilters],
    queryFn: async (): Promise<ApiResponse> => {
      const payload: FilterPayload = {
        filters: { ...defaultFilters, ...filters },
        orderBy,
        orderByDirection,
        perPage: 1000,
        page: 1,
        paginate: true,
        ...(showingDeleted && { deleted: true }),
      };

      const responseData = await apiFetch(`/${endpoint}/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle different response structures
      if (responseData.data && Array.isArray(responseData.data)) {
        return {
          data: responseData.data,
          meta: responseData.meta || {
            current_page: 1,
            last_page: 1,
            per_page: 1000,
            total: responseData.data.length,
            links: [],
          },
        };
      } else if (Array.isArray(responseData)) {
        return {
          data: responseData,
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 1000,
            total: responseData.length,
            links: [],
          },
        };
      } else if (responseData.items && Array.isArray(responseData.items)) {
        return {
          data: responseData.items,
          meta: responseData.meta || responseData.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: 1000,
            total: responseData.items.length,
            links: [],
          },
        };
      } else {
        console.warn("Unexpected API response structure");
        return {
          data: [],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE,
            total: 0,
            links: [],
          },
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // حفظ البيانات الكاملة
  useEffect(() => {
    if (itemsData?.data && Array.isArray(itemsData.data)) {
      setAllData(itemsData.data);
    }
  }, [itemsData]);

  // دالة البحث في كل الحقول
  const searchInAllFields = (item: Entity, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    
    const excludedFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
    
    return Object.entries(item).some(([key, value]) => {
      if (excludedFields.includes(key)) return false;
      
      if (value === null || value === undefined) return false;
      
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(term);
    });
  };

  // تطبيق البحث والفلترة
  const applySearchAndFilters = useCallback((): void => {
    if (!allData || !allData.length) {
      setFilteredData([]);
      return;
    }

    let result = [...allData];

    // تطبيق البحث الشامل
    if (filters.search && filters.search.trim()) {
      result = result.filter(item => 
        searchInAllFields(item, filters.search)
      );
    }

    // تطبيق الفلاتر العادية
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() && key !== 'search') {
        result = result.filter(item => {
          const itemValue = item[key];
          if (itemValue === null || itemValue === undefined) return false;
          return String(itemValue).toLowerCase().includes(value.toLowerCase().trim());
        });
      }
    });

    // تطبيق الترتيب
    result.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (orderByDirection === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

    setFilteredData(result);
  }, [allData, filters, orderBy, orderByDirection]);

  // تطبيق البحث لما البيانات أو الفلاتر تتغير
  useEffect(() => {
    applySearchAndFilters();
  }, [applySearchAndFilters]);

  // حساب البيانات للصفحة الحالية
  const getPaginatedData = (): Entity[] => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  };

  // تحديث الـ pagination بناءً على البيانات المفلترة
  const safePagination: PaginationMeta = {
    current_page: currentPage,
    last_page: Math.ceil(filteredData.length / PER_PAGE),
    per_page: PER_PAGE,
    total: filteredData.length,
    links: []
  };

  const currentPageData = getPaginatedData();

// في useGenericDataManager.ts - أضف هذه الدالة
const handleDeleteAll = (): void => {
  if (currentPageData.length === 0) return;
  
  const allIds = currentPageData.map(item => item.id);
  const itemTitles = currentPageData
    .map(item => item?.title || item?.name || `Item ${item.id}`)
    .join(', ');

  const message = showingDeleted 
    ? `⚠️ Are you sure you want to PERMANENTLY delete ALL ${allIds.length} item(s) on this page? This action cannot be undone!`
    : `Are you sure you want to delete ALL ${allIds.length} item(s) on this page: ${itemTitles}?`;

  if (confirm(message)) {
    if (showingDeleted) {
      // Force delete all
      const forceDeletePromises = allIds.map(id => 
        apiForceDelete(id)
      );
      
      Promise.all(forceDeletePromises)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: [endpoint] });
          toast.success(`All ${allIds.length} items permanently deleted!`);
        })
        .catch((error) => {
          console.error("Error force deleting all items:", error);
          toast.error("Error permanently deleting items");
        });
    } else {
      // Soft delete all
      bulkDeleteMutation.mutate(allIds);
    }
  }
};

const saveItemMutation = useMutation<unknown, Error, { 
  data: Entity | FormData; 
  isFormData?: boolean 
}>({
  mutationFn: async ({ data, isFormData = false }): Promise<unknown> => {
    if (isFormData) {
      // استخدام FormData للملفات
      const formData = data as FormData;
      
      if (editingItem?.id) {
        // للتعديل - أضف _method للـ FormData
        formData.append('_method', 'PUT');
        return apiFetch(`/${endpoint}/${editingItem.id}`, {
          method: "POST",
          body: formData,
        });
      } else {
        // للإضافة
        return apiFetch(`/${endpoint}`, {
          method: "POST",
          body: formData,
        });
      }
    } else {
      // استخدام JSON العادي
      const jsonData = data as Entity;
      if (jsonData.id) {
        return apiFetch(`/${endpoint}/${jsonData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });
      } else {
        return apiFetch(`/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...initialData, ...jsonData }),
        });
      }
    }
  },
  onSuccess: (): void => {
    queryClient.invalidateQueries({ queryKey: [endpoint] });
  },
  onError: (error: Error): void => {
    toast.error(error.message || "Error saving item");
  },
});


  const deleteItemMutation = useMutation<unknown, Error, { id: number; title: string }>({
    mutationFn: async ({ id }: { id: number; title: string }): Promise<unknown> => {
      if (!id) throw new Error('No items to delete');
      const itemsToDelete = [id];
      return await apiFetch(`/${endpoint}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToDelete }),
      });
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success('Deleted successfully!');
    },
    onError: (error: Error): void => {
      toast.error(error.message);
    },
  });

  const bulkDeleteMutation = useMutation<unknown, Error, number[]>({
    mutationFn: async (ids: number[]): Promise<unknown> => {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('No items to delete');
      }
      return await apiFetch(`/${endpoint}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: ids }),
      });
    },
    onSuccess: (data: unknown, variables: number[]): void => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setSelectedItems(new Set());
      toast.success(`${variables.length > 1 ? 'Items' : 'Item'} deleted successfully!`);
    },
    onError: (error: Error): void => {
      toast.error(error.message);
    },
  });

  const bulkRestoreMutation = useMutation<unknown, Error, number[]>({
    mutationFn: async (ids: number[]): Promise<unknown> => {
      return await apiFetch(`/${endpoint}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: ids }),
      });
    },
    onSuccess: (data: unknown, variables: number[]): void => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setSelectedItems(new Set());
      toast.success(`${variables.length > 1 ? 'Items' : 'Item'} restored successfully!`);
    },
    onError: (error: Error): void => {
      toast.error(error.message);
    },
  });

  // دالة toggle active
  const apiToggleActive = async (id: number, active: boolean): Promise<unknown> => {
    return await apiFetch(`/${endpoint}/${id}/active`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
  };

  const handleToggleActive = async (id: number, itemName: string, currentActive: boolean): Promise<void> => {
    if (!confirm(`Are you sure you want to ${currentActive ? 'deactivate' : 'activate'} "${itemName}"?`)) {
      return;
    }
    
    try {
      await apiToggleActive(id, !currentActive);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success(`Device ${currentActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error toggling device active status:', error);
      toast.error('Error updating device status');
    }
  };

 const isFormEvent = (e: SaveOptions | FormEvent<HTMLFormElement>): e is FormEvent<HTMLFormElement> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
   return typeof (e as any)?.preventDefault === 'function';
 };

// في useGenericDataManager.ts - عدل الـ handleSave كالتالي:
const handleSave = async (e: SaveOptions): Promise<void> => {
  let itemData: Record<string, string | number | File | null> = {};
  let keepOpen = false;
  let hasFiles = false;

  // التحقق من نوع e باستخدام الدالة المساعدة
  if (isFormEvent(e)) {
    // الحالة القديمة (FormEvent)
    e.preventDefault();
    
    const formDataObj = new FormData(e.currentTarget);
    itemData = { ...initialData };
    hasFiles = false;

    formFields.forEach(field => {
      const value = formDataObj.get(field.name);
      
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          // إذا كان ملف
          if (value.size > 0) {
            itemData[field.name] = value;
            hasFiles = true;
          } else {
            itemData[field.name] = null;
          }
        } else if (field.type === 'number') {
          itemData[field.name] = Number(value);
        } else if (field.type === 'checkbox') {
          itemData[field.name] = value === 'on' ? 1 : 0;
        } else {
          itemData[field.name] = value as string;
        }
      }
    });

    if (editingItem?.id) {
      itemData.id = editingItem.id;
    }
  } else {
    // الحالة الجديدة (object من زر Continue)
    itemData = { ...formData, ...initialData };
    keepOpen = e.keepOpen || false;
    
    if (editingItem?.id) {
      itemData.id = editingItem.id;
    }

    // تحقق إذا فيه ملفات
    hasFiles = Object.values(itemData).some(value => {
      return value instanceof File;
    });
  }

  // ... باقي الكود بدون تغيير
  // إعداد البيانات للإرسال
  let dataToSend: Entity | FormData;
  let isFormData = false;

  if (hasFiles) {
    // استخدام FormData للملفات
    const formDataToSend = new FormData();
    
    Object.entries(itemData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
        console.log(`📤 Appending file: ${key}`, value);
      } else if (value !== null && value !== undefined && value !== '') {
        // تحويل جميع القيم إلى string قبل الإضافة
        formDataToSend.append(key, String(value));
        console.log(`📤 Appending field: ${key} = ${value}`);
      }
    });
    
    dataToSend = formDataToSend;
    isFormData = true;
    console.log('🔄 Sending as FormData');
  } else {
    // استخدام JSON عادي
    const cleanData: Record<string, unknown> = {};
    Object.entries(itemData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanData[key] = value;
      }
    });
    
    dataToSend = cleanData as Entity;
    isFormData = false;
    console.log('🔄 Sending as JSON:', cleanData);
  }

  saveItemMutation.mutate({ data: dataToSend, isFormData }, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      
      if (!keepOpen) {
        // إغلاق الفورم - للحالة العادية
        setOpen(false);
        setEditingItem(null);
        setFormData({});
      } else {
        // تنظيف الفورم بس يفضل مفتوح - لحالة Continue
        setFormData({});
        setEditingItem(null);
        
        // تركيز على أول حقل بعد الحفظ
        setTimeout(() => {
          const firstInput = document.querySelector('input, select, textarea') as HTMLElement;
          firstInput?.focus();
        }, 100);
      }
      
      toast.success(editingItem ? "Updated successfully!" : "Created successfully!");
    },
    onError: (error: Error) => {
      console.error('❌ Save error:', error);
      toast.error(error.message || "Error saving item");
    }
  });
};

  const handleDelete = (id: number, itemTitle: string): void => {
    if (!id) return;
    if (confirm(`Are you sure you want to delete this ${itemTitle}?`)) {
      deleteItemMutation.mutate({ id, title: itemTitle });
    }
  };

  const handleBulkDelete = (): void => {
    if (selectedItems.size === 0) return;
    const itemsArray = Array.from(selectedItems);

    const itemTitles = itemsArray.map(id => {
      const item = currentPageData.find(item => item.id === id);
      return item?.title || item?.name || `Item ${id}`;
    }).join(', ');

    const message = itemTitles
      ? `Are you sure you want to delete the following items: ${itemTitles}?`
      : `Are you sure you want to delete ${itemsArray.length} item(s)?`;

    if (confirm(message)) {
      bulkDeleteMutation.mutate(itemsArray);
    }
  };

  const handleBulkRestore = (): void => {
    if (selectedItems.size === 0) return;
    if (confirm(`Are you sure you want to restore ${selectedItems.size} item(s)?`)) {
      const ids = Array.from(selectedItems);
      bulkRestoreMutation.mutate(ids);
    }
  };

  const handleFilter = (): void => {
    setCurrentPage(1);
    setShowFilter(false);
    toast.success('Filter applied successfully!');
  };

  const handleResetFilters = (): void => {
    setFilters({});
    setOrderBy('id');
    setOrderByDirection('desc');
    setCurrentPage(1);
    setShowFilter(false);
    toast.success('Filters reset successfully!');
  };

  const handleSearch = useCallback((): void => {
    if (search.trim()) {
      setFilters((prevFilters: Record<string, string>) => ({ 
        ...prevFilters, 
        search: search.trim() 
      }));
    } else {
      // إزالة المتغير غير المستخدم باستخدام destructuring
      const { search: removedSearch, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setCurrentPage(1);
  }, [search, filters]);

  const handleClearSearch = (): void => {
    setSearch('');
    // إزالة المتغير غير المستخدم باستخدام destructuring
    const { search: removedSearch, ...restFilters } = filters;
    setFilters(restFilters);
    setCurrentPage(1);
  };

  const toggleSelectAll = (): void => {
    const pageIds = currentPageData.map(item => item.id);
    const allSelected = pageIds.every(id => selectedItems.has(id));
    
    if (allSelected) {
      const newSet = new Set(selectedItems);
      pageIds.forEach(id => newSet.delete(id));
      setSelectedItems(newSet);
    } else {
      const newSet = new Set(selectedItems);
      pageIds.forEach(id => newSet.add(id));
      setSelectedItems(newSet);
    }
  };

  const toggleSelectItem = (id: number): void => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const apiRestore = async (id: number): Promise<unknown> => {
    return await apiFetch(`/${endpoint}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items:[id] }) 
    });
  };

  const apiForceDelete = async (id: number): Promise<unknown> => {
    return await apiFetch(`/${endpoint}/forceDelete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [id] }),
    });
  };

  const handleForceDelete = (id: number, itemTitle: string): void => {
    if (!id) return;

    if (confirm(`⚠️ Are you sure you want to permanently delete "${itemTitle}"? This action cannot be undone!`)) {
      apiForceDelete(id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: [endpoint] });
          toast.success(`${itemTitle} permanently deleted!`);
        })
        .catch((error) => {
          console.error("Error force deleting item:", error);
          toast.error("Error permanently deleting item");
        });
    }
  };

  const handleRestore = async (id: number, itemName: string): Promise<void> => {
    if (!confirm(`Are you sure you want to restore "${itemName}"?`)) {
      return;
    }
    
    try {
      await apiRestore(id);
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success('Item restored successfully!');
    } catch (error) {
      console.error('Error restoring item:', error);
      toast.error('Error restoring item');
    }
  };

  // Return all state and functions
  return {
    // State
    handleToggleDeleted,
    search,
    setSearch,
    open,
    setOpen,
    editingItem,
    setEditingItem,
    currentPage,
    setCurrentPage,
    showFilter,
    setShowFilter,
    showingDeleted,
    setShowingDeleted,
    filters,
    setFilters,
    orderBy,
    setOrderBy,
    orderByDirection,
    setOrderByDirection,
    selectedItems,
    setSelectedItems,
    formData,
    setFormData,
    
    // Data
    data: currentPageData,
    pagination: safePagination,
    isLoading,
    error,
    additionalQueries,
    
    // Actions
    handleSave,
    handleDelete,
    handleBulkDelete,
    handleBulkRestore,
    handleFilter,
      handleDeleteAll,
    handleResetFilters,
    handleSearch,
    handleClearSearch,
    toggleSelectAll,
    toggleSelectItem,
    handleRestore, 
    handleForceDelete,
    handleToggleActive, 
    // Mutations
    saveItemMutation,
    
    deleteItemMutation,
    bulkDeleteMutation,
    bulkRestoreMutation,
  };
}