// hooks/useGenericDataManager.ts
import { useState, FormEvent, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
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
} from "@/types/generic-data-manager";

const PER_PAGE = 15;

interface AdditionalQueryResult {
  data?: unknown[];
  isLoading: boolean;
  error: Error | null;
}

export function useGenericDataManager({
  endpoint,
  title,
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
  saveItemMutation: UseMutationResult<unknown, Error, Entity>;
  deleteItemMutation: UseMutationResult<unknown, Error, { id: number; title: string }>;
  bulkDeleteMutation: UseMutationResult<unknown, Error, number[]>;
  bulkRestoreMutation: UseMutationResult<unknown, Error, number[]>;
  handleClearSearch: () => void;
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
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<Record<string, string | number>>({});

  // Additional Data Queries
// hooks/useGenericDataManager.ts - تحديث الـ additionalQueries
const additionalQueries = additionalData && additionalData.length > 0 
  ? additionalData.reduce((acc, data) => {
      acc[data.key] = useQuery({
        queryKey: [data.key],
        queryFn: async (): Promise<unknown[]> => {
          try {
            const json = await apiFetch(data.endpoint);
            
            // Handle different response structures
            if (json && Array.isArray(json.data)) {
              return json.data;
            }
            if (Array.isArray(json)) {
              return json;
            }
            if (json && json.items && Array.isArray(json.items)) {
              return json.items;
            }
            console.warn(`Unexpected response structure for ${data.endpoint}:`, json);
            return [];
          } catch (error) {
            console.error(`Error fetching ${data.endpoint}:`, error);
            return [];
          }
        },
        staleTime: 10 * 60 * 1000,
        enabled: open, // ← مهم: يجيب البيانات فقط لما المودال مفتوح
      });
      return acc;
    }, {} as Record<string, AdditionalQueryResult>)
  : {};

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

  // Mutations
  const saveItemMutation = useMutation<unknown, Error, Entity>({
    mutationFn: async (item: Entity): Promise<unknown> => {
      if (item.id) {
        return apiFetch(`/${endpoint}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      } else {
        return apiFetch(`/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...initialData, ...item }),
        });
      }
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setOpen(false);
      setEditingItem(null);
      setFormData({});
      toast.success("Saved successfully!");
    },
    onError: (error: Error): void => {
      toast.error(error.message || "Error saving item");
    },
  });

  const deleteItemMutation = useMutation<unknown, Error, { id: number; title: string }>({
    mutationFn: async ({ id, title }: { id: number; title: string }): Promise<unknown> => {
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

  // Handlers
  const handleSave = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const formDataObj = new FormData(e.currentTarget);
    const itemData: Record<string, string | number> = {
      ...initialData,
    };

    formFields.forEach(field => {
      const value = formDataObj.get(field.name) as string;
      if (value !== null && value !== undefined) {
        if (field.type === 'number') {
          itemData[field.name] = Number(value);
        } else {
          itemData[field.name] = value;
        }
      }
    });

    if (editingItem?.id) {
      itemData.id = editingItem.id;
    }

    saveItemMutation.mutate(itemData as Entity);
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
      const { search: _, ...restFilters } = filters;
      setFilters(restFilters);
    }
    setCurrentPage(1);
  }, [search, filters]);

  const handleClearSearch = (): void => {
    setSearch('');
    const { search: _, ...restFilters } = filters;
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