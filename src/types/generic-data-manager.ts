// types/generic-data-manager.ts
import { UseMutationResult } from '@tanstack/react-query';

export interface Entity {
  id: number;
  name: string;
  title?: string;
  [key: string]: any; 
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface ApiResponse {
  data: Entity[];
  meta: PaginationMeta;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  className?: string;
}

export interface FilterPayload {
  filters: Record<string, string>;
  orderBy: string;
  orderByDirection: string;
  perPage: number;
  page: number;
  paginate: boolean;
  deleted?: boolean;
  search?: string;
}


export interface Device extends Entity {
  id: number;
  serialNumber: string;
  type: string;
  active: boolean;
  purchaseDateFormatted: string;
  memory?: { size: number; type: string };
  cpu?: { name: string };
  brand?: { name: string };
  deviceModel?: { name: string };
  brandId?: number;
  deviceModelId?: number;
  cpuId?: number;
  memoryId?: number;
}

export interface GenericDataManagerProps {
  endpoint: string;
  title: string;
  columns: ColumnDefinition[];
  additionalData?: AdditionalData[];
  formFields?: FormField[];
  availableFilters?: FilterField[];
  initialData?: Record<string, any>; // ← أضف هذا
  defaultFilters?: Record<string, string>;
}

export interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: Entity) => React.ReactNode;
}

export interface AdditionalData {
  key: string;
  endpoint: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'email' | 'password' | 'date';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  optionsKey?: string;
  defaultValue?: string | ((formData: Record<string, any>) => string);
}

export interface MutationResult {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// أنواع للـ State
export interface GenericDataManagerState {
  search: string;
  open: boolean;
  editingItem: Entity | null;
  currentPage: number;
  showFilter: boolean;
  showingDeleted: boolean;
  filters: Record<string, string>;
  orderBy: string;
  orderByDirection: 'asc' | 'desc';
  selectedItems: Set<number>;
  formData: Record<string, string | number>;
    defaultFilters?: Record<string, string>;
  // Setters
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingItem: React.Dispatch<React.SetStateAction<Entity | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setOrderByDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<number>>>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string | number>>>;
}

// أنواع للـ Handlers
export interface GenericDataManagerHandlers {
  handleSave: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDelete: (id: number, title: string) => void;
  handleBulkDelete: () => void;
  handleBulkRestore: () => void;
  handleFilter: () => void;
  handleResetFilters: () => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  toggleSelectAll: () => void;
  toggleSelectItem: (id: number) => void;
  handleRestore: (id: number, itemName: string) => void;
  handleForceDelete: (id: number, itemName: string) => void;
  handleToggleActive?: (id: number, itemName: string, currentActive: boolean) => void;
}


export interface FormFieldProps {
  field: FormField;
  value: string | number;
  onChange: (value: string) => void;
  additionalQueries: Record<string, unknown>;
  onAddNewItem?: (fieldName: string) => void;
  formData?: Record<string, any>;
}

export interface FormModalProps {
  title: string;
  editingItem: Entity | null;
  formFields: FormField[];
  formData: Record<string, string | number>;
  additionalQueries: Record<string, unknown>;
  onFormDataChange: (formData: Record<string, string | number>) => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  saveLoading: boolean;
  onAddNewItem?: (fieldName: string) => void;
}



export interface FilterSearchProps {
  search: string;
  onSearchChange: (search: string) => void;
  onSearch: () => void;
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  orderBy: string;
  onOrderByChange: (orderBy: string) => void;
  orderByDirection: 'asc' | 'desc';
  onOrderByDirectionChange: (direction: 'asc' | 'desc') => void;
  onApplyFilter: () => void;
  onResetFilters: () => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  availableFilters?: FilterField[];
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// أنواع للـ Sub Components
export interface HeaderProps {
  title: string;
  currentPage: number;
  pagination: PaginationMeta;
  selectedItems: Set<number>;
  showingDeleted: boolean;
  onBulkAction: () => void;
  onToggleFilter: () => void;
  onToggleDeleted: () => void;
  onAddItem: () => void;
  bulkLoading: boolean;
  showFilter: boolean;
}

export interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onSearch: () => void;
}

export interface FilterSectionProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  orderBy: string;
  onOrderByChange: (orderBy: string) => void;
  orderByDirection: 'asc' | 'desc';
  onOrderByDirectionChange: (direction: 'asc' | 'desc') => void;
  onApplyFilter: () => void;
  onResetFilters: () => void;
}

export interface DataTableProps {
  title: string;
  data: Entity[];
  columns: ColumnDefinition[];
  selectedItems: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  orderBy: string;
  orderByDirection: 'asc' | 'desc';
  pagination: PaginationMeta;
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: number) => void;
  onSort: (column: ColumnDefinition) => void;
  onEdit: (item: Entity) => void;
  onDelete: (id: number, title: string) => void;
  onToggleActive?: (id: number, itemName: string, currentActive: boolean) => void;
  deleteLoading: boolean;
  Checkbox: React.ComponentType<CheckboxProps>;
  showingDeleted?: boolean;
  onRestore?: (id: number, itemName: string) => void; 
  onForceDelete?: (id: number, itemName: string) => void;
}

export interface FormModalProps {
  title: string;
  editingItem: Entity | null;
  formFields: FormField[];
  formData: Record<string, string | number>;
  additionalQueries: Record<string, unknown>;
  onFormDataChange: (formData: Record<string, string | number>) => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  saveLoading: boolean;
}

export interface FormFieldProps {
  field: FormField;
  value: string | number;
  onChange: (value: string) => void;
  additionalQueries: Record<string, unknown>;
}

export interface SelectOption {
  value: string | number;
  label: string;
}