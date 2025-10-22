// hooks/useGenericDataManager.ts
import { useState, FormEvent, useCallback,useEffect } from "react";
import { useQuery, useQueries, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
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

const PER_PAGE = 10;

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
  saveItemMutation: UseMutationResult<unknown, Error, { data: Entity | FormData; isFormData?: boolean }>;
  deleteItemMutation: UseMutationResult<unknown, Error, { id: number; title: string }>;
  bulkDeleteMutation: UseMutationResult<unknown, Error, number[]>;
  bulkRestoreMutation: UseMutationResult<unknown, Error, number[]>;
  handleClearSearch: () => void;
  handleDeleteAll: () => void;
} {
  const queryClient = useQueryClient();

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

  // Additional queries section (unchanged)
  const additionalQueriesArray = useQueries({
    queries: additionalData.map(data => ({
      queryKey: [data.key, data.filters, 'static'],
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
            json = await apiFetch(`${data.endpoint}/index`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
          } else {
            json = await apiFetch(data.endpoint);
          }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (json && Array.isArray((json as any).data)) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (json as any).data;
          }
          if (Array.isArray(json)) {
            return json;
          }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((json as any).items && Array.isArray((json as any).items)) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (json as any).items;
          }
          return [];
        } catch (error) {
          console.error(`Error fetching ${data.endpoint}:`, error);
          return [];
        }
      },
      staleTime: 30 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }))
  });
  const additionalQueries = additionalData.reduce((acc, data, idx) => {
    acc[data.key] = additionalQueriesArray[idx];
    return acc;
  }, {} as Record<string, AdditionalQueryResult>);

  // Main data query (pagination + server-side filters)
  const { data: itemsData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: [endpoint, currentPage, showingDeleted, orderBy, orderByDirection, filters, defaultFilters],
    queryFn: async (): Promise<ApiResponse> => {
      const payload: FilterPayload = {
        filters: { ...defaultFilters, ...filters },
        orderBy,
        orderByDirection,
        perPage: PER_PAGE,
        page: currentPage,
        paginate: true,
        ...(showingDeleted && { deleted: true }),
      };

      const responseData = await apiFetch(`/${endpoint}/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((responseData as any).data && Array.isArray((responseData as any).data)) {
        return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: (responseData as any).data,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          meta: (responseData as any).meta || {
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            total: (responseData as any).data.length,
            links: []
          }
        };
      } else if (Array.isArray(responseData)) {
        return {
          data: responseData,
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE,
            total: responseData.length,
            links: []
          }
        };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((responseData as any).items && Array.isArray((responseData as any).items)) {
        return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: (responseData as any).items,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          meta: (responseData as any).meta || (responseData as any).pagination || {
            current_page: 1,
            last_page: 1,
            per_page: PER_PAGE,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            total: (responseData as any).items.length,
            links: []
          }
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
            links: []
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Data from API
  const data: Entity[] = itemsData?.data || [];
  const pagination: PaginationMeta = itemsData?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
    total: 0,
    links: []
  };

  // Handlers
  const handleFilter = (): void => {
    setCurrentPage(1);
    // optionally toggle showFilter here or keep it open
  };

  const handleResetFilters = (): void => {
    setFilters({});
    setOrderBy('id');
    setOrderByDirection('desc');
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleSearch = useCallback((): void => {
    if (search.trim()) {
      setFilters(prev => ({ ...prev, search: search.trim() }));
    } else {
      const { search: _removed, ...rest } = filters;
      setFilters(rest);
    }
    setCurrentPage(1);
  }, [search, filters]);

  const handleClearSearch = (): void => {
    setSearch('');
    const { search: _removed, ...rest } = filters;
    setFilters(rest);
    setCurrentPage(1);
  };

  // في GenericDataManager.tsx
const handleToggleDeleted = (): void => {
  console.log('🎯 TOGGLE DELETED - Clearing selections');
  
  // تنظيف فوري
  setSelectedItems(new Set());
  
  // تبديل الحالة
  setShowingDeleted(prev => !prev);
  
  // الرجوع للصفحة الأولى
  setCurrentPage(1);
  
  toast.success("View toggled successfully!");
};

// وأضف الـ useEffect كنسخة احتياطية
useEffect(() => {
  if (selectedItems.size > 0) {
    console.log('🔄 AUTO-CLEAR on view change');
    setSelectedItems(new Set());
  }
}, [showingDeleted]);

  const handleDeleteAll = (): void => {
    if (data.length === 0) return;
    const allIds = data.map(item => item.id);
    const titles = data.map(item => item.title || item.name || `Item ${item.id}`).join(', ');

    const message = showingDeleted
      ? `⚠️ Are you sure you want to PERMANENTLY delete all ${allIds.length} items?`
      : `Are you sure you want to delete all ${allIds.length} items: ${titles}?`;

    if (!confirm(message)) return;

    if (showingDeleted) {
      const promises = allIds.map(id => apiFetch(`/${endpoint}/forceDelete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [id] }),
      }));
      Promise.all(promises)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: [endpoint] });
          toast.success(`All ${allIds.length} items permanently deleted!`);
        })
        .catch(err => {
          console.error(err);
          toast.error("Error permanently deleting items");
        });
    } else {
      // use bulk delete mutation
      // Note: could reuse bulkDeleteMutation
      alert("Bulk delete logic not shown here");
    }
  };

  // Save / Delete / Bulk logic (unchanged)
  const saveItemMutation = useMutation<unknown, Error, { data: Entity | FormData; isFormData?: boolean }>({
    mutationFn: async ({ data: sendData, isFormData = false }) => {
      if (isFormData) {
        const formDataObj = sendData as FormData;
        if (editingItem?.id) {
          formDataObj.append('_method', 'PUT');
          return apiFetch(`/${endpoint}/${editingItem.id}`, {
            method: "POST",
            body: formDataObj,
          });
        } else {
          return apiFetch(`/${endpoint}`, {
            method: "POST",
            body: formDataObj,
          });
        }
      } else {
        const clean = sendData as Entity;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((clean as any).id) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return apiFetch(`/${endpoint}/${(clean as any).id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clean),
          });
        } else {
          return apiFetch(`/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...initialData, ...clean }),
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success(editingItem ? "Updated successfully!" : "Created successfully!");
      setEditingItem(null);
      setFormData({});
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error saving item");
    }
  });

  const deleteItemMutation = useMutation<unknown, Error, { id: number; title: string }>({
    mutationFn: async ({ id }) => {
      return await apiFetch(`/${endpoint}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [id] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success('Deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const bulkDeleteMutation = useMutation<unknown, Error, number[]>({
    mutationFn: async (ids: number[]) => {
      return await apiFetch(`/${endpoint}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: ids }),
      });
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setSelectedItems(new Set());
      toast.success(`${vars.length} items deleted successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const bulkRestoreMutation = useMutation<unknown, Error, number[]>({
    mutationFn: async (ids: number[]) => {
      return await apiFetch(`/${endpoint}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: ids }),
      });
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setSelectedItems(new Set());
      toast.success(`${vars.length} items restored successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const handleToggleActive = async (id: number, itemName: string, currentActive: boolean): Promise<void> => {
    if (!confirm(`Are you sure you want to ${currentActive ? 'deactivate' : 'activate'} "${itemName}"?`)) {
      return;
    }
    try {
      await apiFetch(`/${endpoint}/${id}/active`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast.success(`${currentActive ? 'Deactivated' : 'Activated'} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    }
  };

  const isFormEvent = (e: SaveOptions | FormEvent<HTMLFormElement>): e is FormEvent<HTMLFormElement> => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return typeof (e as any)?.preventDefault === 'function';
  };

  const handleSave = async (e: SaveOptions): Promise<void> => {
    let itemData: Record<string, string | number | File | null> = {};
    let keepOpen = false;
    let hasFiles = false;

    if (isFormEvent(e)) {
      e.preventDefault();
      const formObj = new FormData(e.currentTarget);
      itemData = { ...initialData };
      formFields.forEach(field => {
        const value = formObj.get(field.name);
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            if (value.size > 0) {
              itemData[field.name] = value;
              hasFiles = true;
            } else {
              itemData[field.name] = null;
            }
          } else if (field.type === 'number') {
            itemData[field.name] = Number(value);
          } else if (field.type === 'checkbox') {
            itemData[field.name] = (value === 'on' ? 1 : 0);
          } else {
            itemData[field.name] = value as string;
          }
        }
      });
      if (editingItem?.id) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (itemData as any).id = editingItem.id;
      }
    } else {
      itemData = { ...formData, ...initialData };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      keepOpen = (e as any).keepOpen || false;
      if (editingItem?.id) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (itemData as any).id = editingItem.id;
      }
      hasFiles = Object.values(itemData).some(v => v instanceof File);
    }

    let dataToSend: Entity | FormData;
    let isFormData = false;

    if (hasFiles) {
      const formDataObj = new FormData();
      Object.entries(itemData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataObj.append(key, value);
        } else if (value !== null && value !== undefined && value !== '') {
          formDataObj.append(key, String(value));
        }
      });
      dataToSend = formDataObj;
      isFormData = true;
    } else {
      const clean: Record<string, unknown> = {};
      Object.entries(itemData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          clean[key] = value;
        }
      });
      dataToSend = clean as Entity;
      isFormData = false;
    }

    saveItemMutation.mutate({ data: dataToSend, isFormData });
  };
const handleRestore = async (id: number, title: string): Promise<void> => {
  if (!confirm(`Are you sure you want to restore "${title}"?`)) return;

  try {
    await apiFetch(`/${endpoint}/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [id] }),
    });
    queryClient.invalidateQueries({ queryKey: [endpoint] });
    toast.success(`"${title}" has been successfully restored!`);
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while restoring the item.");
  }
};


const handleForceDelete = async (id: number, title: string): Promise<void> => {
  if (!confirm(`⚠️ Are you sure you want to permanently delete "${title}"? This action cannot be undone!`)) return;

  try {
    await apiFetch(`/${endpoint}/forceDelete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [id] }),
    });
    queryClient.invalidateQueries({ queryKey: [endpoint] });
    toast.success(`"${title}" has been permanently deleted!`);
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while permanently deleting the item.");
  }
};


  return {
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

    data,
    pagination,
    isLoading,
    error,
    additionalQueries,

    handleSave,
    handleDelete: (id: number, title: string) => deleteItemMutation.mutate({ id, title }),
    handleBulkDelete: () => bulkDeleteMutation.mutate(Array.from(selectedItems)),
    handleBulkRestore: () => bulkRestoreMutation.mutate(Array.from(selectedItems)),
    handleFilter,
    handleDeleteAll,
    handleResetFilters,
    handleSearch,
    handleClearSearch,
    toggleSelectAll: () => {
      const pageIds = data.map(item => item.id);
      const allSel = pageIds.every(id => selectedItems.has(id));
      if (allSel) {
        const newSet = new Set(selectedItems);
        pageIds.forEach(id => newSet.delete(id));
        setSelectedItems(newSet);
      } else {
        const newSet = new Set(selectedItems);
        pageIds.forEach(id => newSet.add(id));
        setSelectedItems(newSet);
      }
    },
    toggleSelectItem: (id: number) => {
      const newSet = new Set(selectedItems);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedItems(newSet);
    },
    handleRestore,
    handleForceDelete,
    handleToggleActive,
    saveItemMutation,
    deleteItemMutation,
    bulkDeleteMutation,
    bulkRestoreMutation,
  };
}
