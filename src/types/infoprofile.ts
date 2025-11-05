export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  phoneExt: string
  cell: string
  avatar?: string
  role: string
  latestDevice?: {
    type?: string
    serialNumber?: string
    memory?: { size: string }
    cpu?: { name: string }
    storages?: Array<{ type: string; size: string }>
    gpu?: { model: string }
    active?: boolean
    purchaseDate?: string
    warrantyExpireDate?: string
  }
  tickets?: Ticket[]
}

export interface FormData {
  name: string
  email: string
  phone: string
  address: string
  phoneExt: string
  cell: string
}

export interface Ticket {
  id: number
  createdAt: string
  title: string
  status: 'open' | 'pending' | 'postponed' | 'closed'
  priority: 'High' | 'Medium' | 'Low'
  dailyStatus?: boolean
  category: {
    name: string
  }
}

export type ActiveTab = 'profile' | 'device' | 'tickets'

// Helper function to convert any user object to our User type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createProfileUser(userData: any): User {
  return {
    id: userData.id,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    phoneExt: userData.phoneExt || '',
    cell: userData.cell || '',
    avatar: userData.avatar,
    role: typeof userData.role === 'string' ? userData.role : 
          Array.isArray(userData.role) ? userData.role[0] : 'user',
    latestDevice: userData.latestDevice ? {
      type: userData.latestDevice.type,
      serialNumber: userData.latestDevice.serialNumber,
      memory: userData.latestDevice.memory ? { 
        size: `${userData.latestDevice.memory.size} GB` 
      } : undefined,
      cpu: userData.latestDevice.cpu ? { 
        name: userData.latestDevice.cpu.name 
      } : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storages: userData.latestDevice.storages?.map((storage: any) => ({
        type: storage.type,
        size: storage.size
      })),
      gpu: userData.latestDevice.gpu ? { 
        model: userData.latestDevice.gpu.model 
      } : undefined,
      active: userData.latestDevice.active,
      purchaseDate: userData.latestDevice.purchaseDate,
      warrantyExpireDate: userData.latestDevice.warrantyExpireDate
    } : undefined,
    tickets: userData.tickets || []
  }
}