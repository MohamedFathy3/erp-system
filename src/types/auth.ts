// types/auth.ts
import {Ticket} from '@/types/ticket'
export interface Device {
  id: number
  name: string
  condition: string
  note: string | null
  device_status_id: number
  type?: string
  serialNumber?: string
  active?: boolean
  purchaseDate?: string
  warrantyExpireDate?: string
  memory?: {
    id: number
    size: number
    type: string
  }
  cpu?: {
    id: number
    name: string
  }
  gpu?: {
    id: number
    model: string
    vram: string
  }
  storages?: Array<{
    id: number
    type: string
    size: string
  }>
  // Add other device properties from your API
}

export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string
  address: string
  phoneExt: string
  cell: string
  avatar?: string
  role: string | string[]
  remember: boolean
  password: string
  latestDevice?: Device
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickets?: any[] // Use a more specific type if available
  // Other properties from your API
  positionId?: number
  position?: string
  active?: boolean
  departmentId?: number
  department?: {
    id: number
    name: string
    description: string | null
  }
}