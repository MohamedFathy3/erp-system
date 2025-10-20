// schemas/device-schema.ts
import { z } from 'zod';

// ==================== RELATED ENTITIES SCHEMAS ====================
export const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const deviceModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  brandId: z.number().optional(),
});

export const processorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const graphicCardSchema = z.object({
  id: z.number(),
  model: z.string(),
  vram: z.string().optional(),
});

export const memorySchema = z.object({
  id: z.number(),
  size: z.number(),
  type: z.string(),
});

export const storageSchema = z.object({
  id: z.number(),
  size: z.number(),
  type: z.string(),
});

export const deviceStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
});

export const storageAssignmentSchema = z.object({
  type: z.enum(['primary', 'additional']),
  storageId: z.number(),
});

// ==================== MAIN DEVICE SCHEMA ====================
export const deviceSchema = z.object({
  id: z.number(),
  serialNumber: z.string().min(1, "Serial number is required"),
  type: z.string(), // غيرت من enum إلى string علشان الـ API بيرجع أنواع مختلفة
  condition: z.enum(['new', 'used', 'refurbished']).default('used'),
  note: z.string().nullable().optional().default(''),
  purchaseDate: z.string().optional(),
  purchaseDateFormatted: z.string().optional(),
  warrantyExpireDate: z.string().nullable().optional().default(''),
  active: z.boolean().default(true),
  
  // Foreign keys
  memoryId: z.number().optional().nullable(),
  graphicCardId: z.number().optional().nullable(),
  processorId: z.number().optional().nullable(),
  brandId: z.number().optional().nullable(),
  device_status_id: z.number().default(1),
  employee: employeeSchema.optional().nullable(),
  deviceModelId: z.number().optional().nullable(),
  
  // Relations (for API responses)
  memory: memorySchema.optional().nullable(),
  cpu: processorSchema.optional().nullable(), // للتوافق مع الاسم القديم
  graphicCard: graphicCardSchema.optional().nullable(),
  brand: brandSchema.optional().nullable(),
  device_status: deviceStatusSchema.optional().nullable(),
  deviceModel: deviceModelSchema.optional().nullable(),
  storages: z.array(storageAssignmentSchema).default([]),
});

// Create and Update Schemas
export const createDeviceSchema = deviceSchema.omit({ 
  id: true,
  memory: true,
  cpu: true,
  graphicCard: true,
  brand: true,
  device_status: true,
  deviceModel: true,
  purchaseDateFormatted: true
}).extend({
  active: z.boolean().default(true),
});

export const updateDeviceSchema = createDeviceSchema.partial();

// ==================== API RESPONSE SCHEMAS ====================
// schema مخصوص للـ API response علشان الـ API بيرجع هيكل مختلف
export const apiDeviceSchema = z.object({
  id: z.number(),
  serialNumber: z.string(),
  type: z.string(), // string عادي
  active: z.boolean(), // API بيرجع boolean
  purchaseDateFormatted: z.string().optional(),
  memory: z.object({
    id: z.number(),
    size: z.number(),
    type: z.string()
  }).optional().nullable(),
  cpu: z.object({
    id: z.number(),
    name: z.string()
  }).optional().nullable(),
  brand: z.object({
    id: z.number(),
    name: z.string()
  }).optional().nullable(),
  deviceModel: z.object({
    id: z.number(),
    name: z.string()
  }).optional().nullable(),
  device_status: z.object({
    id: z.number(),
    name: z.string()
  }).optional().nullable(),
  graphicCard: z.object({
    id: z.number(),
    model: z.string()
  }).optional().nullable(),
});

export const devicesResponseSchema = z.object({
  data: z.array(apiDeviceSchema),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

// ==================== FILTER SCHEMAS ====================
export const deviceFiltersSchema = z.object({
  type: z.string().optional(),
  brand: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  memorySize: z.number().optional(),
  memoryType: z.string().optional(),
}).partial();

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().default('serialNumber'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const deviceQuerySchema = deviceFiltersSchema.merge(paginationSchema);

// ==================== INFER TYPES ====================
export type Device = z.infer<typeof deviceSchema>;
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;
export type DeviceFilters = z.infer<typeof deviceFiltersSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type DeviceQueryParams = z.infer<typeof deviceQuerySchema>;
export type DevicesResponse = z.infer<typeof devicesResponseSchema>;
export type ApiDevice = z.infer<typeof apiDeviceSchema>;

// Related entities types
export type Brand = z.infer<typeof brandSchema>;
export type DeviceModel = z.infer<typeof deviceModelSchema>;
export type Processor = z.infer<typeof processorSchema>;
export type GraphicCard = z.infer<typeof graphicCardSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type Storage = z.infer<typeof storageSchema>;
export type DeviceStatus = z.infer<typeof deviceStatusSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type StorageAssignment = z.infer<typeof storageAssignmentSchema>;