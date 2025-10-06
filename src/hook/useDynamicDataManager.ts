// hooks/useDynamicDataManager.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export interface DynamicField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "date" | "textarea" | "checkbox";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  optionsEndpoint?: string;
}

export interface DynamicColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "number" | "date" | "status" | "action";
}

export interface DynamicConfig {
  endpoint: string;
  title: string;
  primaryKey?: string;
  nameField?: string;
  additionalEndpoints?: Record<string, string>;
  customColumns?: DynamicColumn[];
  customFields?: DynamicField[];
}

export function useDynamicDataManager(config: DynamicConfig) {
  const {
    endpoint,
    title,
    primaryKey = "id",
    nameField = "name",
    additionalEndpoints = {},
    customColumns = [],
    customFields = []
  } = config;

  const queryClient = useQueryClient();
  
  // State
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>(primaryKey);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch main data
  const { data: mainData, isLoading, error, refetch } = useQuery({
    queryKey: [endpoint, filters, sortBy, sortDirection],
    queryFn: async () => {
      const payload = {
        filters: filters,
        orderBy: sortBy,
        orderByDirection: sortDirection,
        perPage: 1000,
        paginate: true,
        deleted: false
      };

      const response = await apiFetch(`/${endpoint}/index`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.data || [];
    },
  });

  // Create individual queries for additional endpoints
  const createAdditionalQuery = (key: string, endpoint: string) => {
    return useQuery({
      queryKey: [key],
      queryFn: async () => {
        const response = await apiFetch(`/${endpoint}/index`, {
          method: "POST",
          body: JSON.stringify({
            perPage: 1000,
            paginate: false
          }),
        });
        return response.data || [];
      },
      enabled: isModalOpen, // Fetch only when modal is open
      staleTime: 5 * 60 * 1000,
    });
  };

  // Individual additional queries
  const additionalQueries = Object.entries(additionalEndpoints).reduce((acc, [key, endpoint]) => {
    acc[key] = createAdditionalQuery(key, endpoint);
    return acc;
  }, {} as Record<string, any>);

  // Update data when main data changes
  useEffect(() => {
    if (mainData) {
      setData(mainData);
      setFilteredData(mainData);
    }
  }, [mainData]);

  // Auto-generate columns from data
  const generatedColumns = useMemo((): DynamicColumn[] => {
    if (data.length === 0) return customColumns;
    
    const sampleItem = data[0];
    const excludedFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
    
    const columns: DynamicColumn[] = Object.keys(sampleItem)
      .filter(key => !excludedFields.includes(key))
      .map(key => ({
        key,
        label: key.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        sortable: true,
        type: typeof sampleItem[key] === 'number' ? 'number' : 
              sampleItem[key] instanceof Date ? 'date' : 'text'
      }));

    // Add custom columns
    return [...columns, ...customColumns];
  }, [data, customColumns]);

  // Auto-generate form fields from data
  const generatedFields = useMemo((): DynamicField[] => {
    if (data.length === 0) return customFields;
    
    const sampleItem = data[0];
    const excludedFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
    
    const fields: DynamicField[] = Object.keys(sampleItem)
      .filter(key => !excludedFields.includes(key))
      .map(key => {
        const field: DynamicField = {
          name: key,
          label: key.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          type: 'text'
        };

        // Auto-detect field types
        if (typeof sampleItem[key] === 'number') {
          field.type = 'number';
        } else if (key.includes('email')) {
          field.type = 'email';
        } else if (key.includes('date')) {
          field.type = 'date';
        } else if (key.includes('description') || key.includes('note')) {
          field.type = 'textarea';
        }

        // Check if this field has options from additional endpoints
        if (additionalEndpoints[key.replace('Id', 's')]) {
          field.type = 'select';
          field.optionsEndpoint = key.replace('Id', 's');
        }

        return field;
      });

    return [...fields, ...customFields];
  }, [data, customFields, additionalEndpoints]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const pagination = {
    current_page: currentPage,
    last_page: Math.ceil(filteredData.length / itemsPerPage),
    per_page: itemsPerPage,
    total: filteredData.length,
  };

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (itemData: any) => {
      if (itemData[primaryKey]) {
        return apiFetch(`/${endpoint}/${itemData[primaryKey]}`, {
          method: "PUT",
          body: JSON.stringify(itemData),
        });
      } else {
        return apiFetch(`/${endpoint}`, {
          method: "POST",
          body: JSON.stringify(itemData),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      toast.success(`${title} saved successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to save ${title}: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return apiFetch(`/${endpoint}/delete`, {
        method: "POST",
        body: JSON.stringify({ items: ids }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setSelectedItems(new Set());
      toast.success(`${title}(s) deleted successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete ${title}: ${error.message}`);
    },
  });

  // Handlers
  const handleSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data]);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }, [sortBy, sortDirection]);

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    if (confirm(`Are you sure you want to delete this ${title}?`)) {
      deleteMutation.mutate([id]);
    }
  }, [title, deleteMutation]);

  const handleBulkDelete = useCallback(() => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.size} ${title}(s)?`)) {
      deleteMutation.mutate(Array.from(selectedItems));
    }
  }, [selectedItems, title, deleteMutation]);

  const handleSave = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  }, [formData, saveMutation]);

  const handleFormChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const toggleSelectItem = useCallback((id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  }, [selectedItems]);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginatedData.map(item => item[primaryKey]);
    const allSelected = pageIds.every(id => selectedItems.has(id));
    
    const newSelected = new Set(selectedItems);
    if (allSelected) {
      pageIds.forEach(id => newSelected.delete(id));
    } else {
      pageIds.forEach(id => newSelected.add(id));
    }
    setSelectedItems(newSelected);
  }, [paginatedData, selectedItems, primaryKey]);

  return {
    // Data
    data: paginatedData,
    allData: data,
    columns: generatedColumns,
    fields: generatedFields,
    selectedItems,
    pagination,
    isLoading,
    error,
    
    // Modal
    isModalOpen,
    setIsModalOpen,
    editingItem,
    formData,
    
    // Additional data
    additionalQueries,
    
    // Handlers
    handleSearch,
    handleSort,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleSave,
    handleFormChange,
    toggleSelectItem,
    toggleSelectAll,
    
    // State
    currentPage,
    setCurrentPage,
    sortBy,
    sortDirection,
    
    // Mutations
    saveMutation,
    deleteMutation,
  };
}