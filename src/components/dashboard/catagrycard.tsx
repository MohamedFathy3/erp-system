import {
  Landmark,
  Layers,
  Users,
  Briefcase,
  Wallet,
  Clock,
  LineChart,
  Archive,
  Megaphone,
  Cpu,
  HardDrive,
  MonitorSmartphone,
  Laptop2,
  ShieldCheck,
  Settings,
  UserCog,
  BookText,
  Tag,
  Globe,
  DollarSign,
  Warehouse,
  MapPin,
  Flag,
  Building,
  Home,
  Truck,
  Ship,
  Plane,
  FileText,
  CreditCard,
  Calendar,
  Battery,
  WalletCards,
  Car,
  ListCheck,
  Shield,
  Box,
  Package,
  Router,
  Map,
  UserCheck,
  Inbox,
  File,
  Banknote,
  Coins,
  Gem,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react'

const managementCards = [
  {
    id: 'issue-categories',
    title: 'Issue Categories',
    description: 'Manage issue categories settings.',
    icon: Tag,
    category: 'Settings',
  },
  {
    id: 'organizations',
    title: 'Organizations',
    description: 'Manage organizations settings.',
    icon: UserCog,
    category: 'HR',
  },
  {
    id: 'branches',
    title: 'Branches',
    description: 'Manage branches settings.',
    icon: UserCog,
    category: 'HR',
  },
  {
    id: 'employee',
    title: 'Employee',
    description: 'Manage employee settings.',
    icon: Users,
    category: 'HR',
  },
  {
    id: 'companies',
    title: 'Companies',
    description: 'Manage companies settings.',
    icon: Megaphone,
    category: 'HR',
  },
  {
    id: 'ticket-eta',
    title: 'Ticket ETA',
    description: 'Manage ticket ETA settings.',
    icon: Clock,
    category: 'Settings',
  },
  {
    id: 'device-status',
    title: 'Device Status',
    description: 'Manage device status settings.',
    icon: ShieldCheck,
    category: 'Settings',
  },
  {
    id: 'positions',
    title: 'Positions',
    description: 'Manage positions settings.',
    icon: Briefcase,
    category: 'HR',
  },
  {
    id: 'it-device-model',
    title: 'IT Device Model',
    description: 'Manage IT device model settings.',
    icon: Laptop2,
    category: 'Settings',
  },
  {
    id: 'payroll',
    title: 'Payroll',
    description: 'Manage payroll settings.',
    icon: Wallet,
    category: 'Finance',
  },
  {
    id: 'storage-drivers',
    title: 'Storage Drivers',
    description: 'Manage storage drivers settings.',
    icon: HardDrive,
    category: 'Settings',
  },
  {
    id: 'it-brands',
    title: 'IT Brands',
    description: 'Manage IT brands settings.',
    icon: Landmark,
    category: 'Settings',
  },
  {
    id: 'device-type',
    title: 'Device Type',
    description: 'Manage device type settings.',
    icon: MonitorSmartphone,
    category: 'Settings',
  },
  {
    id: 'processors',
    title: 'Processors',
    description: 'Manage processors settings.',
    icon: Cpu,
    category: 'Settings',
  },
  {
    id: 'training-and-development',
    title: 'Training and Development',
    description: 'Manage training and development settings.',
    icon: BookText,
    category: 'HR',
  },
  {
    id: 'department',
    title: 'Department',
    description: 'Manage Department settings.',
    icon: LineChart,
    category: 'HR',
  },
  {
    id: 'ram',
    title: 'RAM',
    description: 'Manage RAM settings.',
    icon: Layers,
    category: 'Settings',
  },
  {
    id: 'graphic-cards',
    title: 'Graphic Cards',
    description: 'Manage graphic cards settings.',
    icon: Layers,
    category: 'Settings',
  },
  // إضافة الـ cards الجديدة
  {
    id: 'countries',
    title: 'Countries',
    description: 'Manage countries settings.',
    icon: Flag,
    category: 'Geography',
  },
  {
    id: 'cities-ports',
    title: 'Cities / Ports',
    description: 'Manage cities and ports settings.',
    icon: MapPin,
    category: 'Geography',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Manage customers settings.',
    icon: Users,
    category: 'Partners',
  },
  {
    id: 'agents',
    title: 'Agents',
    description: 'Manage agents settings.',
    icon: UserCheck,
    category: 'Partners',
  },
  {
    id: 'shipping-lines',
    title: 'Shipping Lines',
    description: 'Manage shipping lines settings.',
    icon: Ship,
    category: 'Partners',
  },
  {
    id: 'airlines',
    title: 'Airlines',
    description: 'Manage airlines settings.',
    icon: Plane,
    category: 'Partners',
  },
  {
    id: 'shipping-agents',
    title: 'Shipping Agents',
    description: 'Manage shipping agents settings.',
    icon: UserCheck,
    category: 'Partners',
  },
  {
    id: 'truckers',
    title: 'Truckers',
    description: 'Manage truckers settings.',
    icon: Truck,
    category: 'Partners',
  },
  {
    id: 'custom-clearance-agents',
    title: 'Custom Clearance Agents',
    description: 'Manage custom clearance agents settings.',
    icon: Inbox,
    category: 'Partners',
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    description: 'Manage suppliers settings.',
    icon: UserCheck,
    category: 'Partners',
  },
  {
    id: 'leads',
    title: 'Leads',
    description: 'Manage leads settings.',
    icon: UserCheck,
    category: 'Partners',
  },
  {
    id: 'charges-type-group',
    title: 'Charges Type Group',
    description: 'Manage charges type group settings.',
    icon: DollarSign,
    category: 'Finance',
  },
  {
    id: 'currencies',
    title: 'Currencies',
    description: 'Manage currencies settings.',
    icon: Coins,
    category: 'Finance',
  },
  {
    id: 'credit-card-types',
    title: 'Credit Card Types',
    description: 'Manage credit card types settings.',
    icon: CreditCard,
    category: 'Finance',
  },
  {
    id: 'incoterms',
    title: 'Incoterms',
    description: 'Manage incoterms settings.',
    icon: FileText,
    category: 'Finance',
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    description: 'Manage payment terms settings.',
    icon: Calendar,
    category: 'Finance',
  },
  {
    id: 'tax-type',
    title: 'Tax Type',
    description: 'Manage tax type settings.',
    icon: FileText,
    category: 'Finance',
  },
  {
    id: 'charges-type',
    title: 'Charges Type',
    description: 'Manage charges type settings.',
    icon: Battery,
    category: 'Finance',
  },
  {
    id: 'invoice-type',
    title: 'Invoice Type',
    description: 'Manage invoice type settings.',
    icon: FileText,
    category: 'Finance',
  },
  {
    id: 'expenses',
    title: 'Expenses',
    description: 'Manage expenses settings.',
    icon: Wallet,
    category: 'Finance',
  },
  {
    id: 'customer-credit-limit',
    title: 'Customer Credit Limit',
    description: 'Manage customer credit limit settings.',
    icon: WalletCards,
    category: 'Finance',
  },
  {
    id: 'product-group',
    title: 'Product Group',
    description: 'Manage product group settings.',
    icon: Package,
    category: 'Finance',
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Manage services settings.',
    icon: HeartHandshake,
    category: 'Finance',
  },
  {
    id: 'bank-accounts',
    title: 'Bank Accounts',
    description: 'Manage bank accounts settings.',
    icon: Banknote,
    category: 'Finance',
  },
  {
    id: 'bank-templates',
    title: 'Bank Templates',
    description: 'Manage bank templates settings.',
    icon: FileText,
    category: 'Finance',
  },
  {
    id: 'treasures',
    title: 'Treasures',
    description: 'Manage treasures settings.',
    icon: Gem,
    category: 'Finance',
  },
  {
    id: 'custodies',
    title: 'Custodies',
    description: 'Manage custodies settings.',
    icon: Shield,
    category: 'Finance',
  },
  {
    id: 'truck-drivers',
    title: 'Truck Drivers',
    description: 'Manage truck drivers settings.',
    icon: Truck,
    category: 'Third Party',
  },
  {
    id: 'trailers',
    title: 'Trailers',
    description: 'Manage trailers settings.',
    icon: Truck,
    category: 'Third Party',
  },
  {
    id: 'vehicle-info',
    title: 'Vehicle Info',
    description: 'Manage vehicle info settings.',
    icon: Car,
    category: 'Third Party',
  },
  {
    id: 'customs-items',
    title: 'Customs Items',
    description: 'Manage customs items settings.',
    icon: ListCheck,
    category: 'Third Party',
  },
  {
    id: 'authorizations',
    title: 'Authorizations',
    description: 'Manage authorizations settings.',
    icon: ShieldCheck,
    category: 'Third Party',
  },
  {
    id: 'warehouse-names',
    title: 'Warehouse Names',
    description: 'Manage warehouse names settings.',
    icon: Home,
    category: 'Warehouse',
  },
  {
    id: 'package-type',
    title: 'Package Type',
    description: 'Manage package type settings.',
    icon: Box,
    category: 'Warehouse',
  },
  {
    id: 'commodities',
    title: 'Commodities',
    description: 'Manage commodities settings.',
    icon: Tag,
    category: 'Warehouse',
  },
  {
    id: 'warehouse-charges-type',
    title: 'Warehouse Charges Type',
    description: 'Manage warehouse charges type settings.',
    icon: DollarSign,
    category: 'Warehouse',
  },
  {
    id: 'area',
    title: 'Area',
    description: 'Manage area settings.',
    icon: Home,
    category: 'Warehouse',
  },
  {
    id: 'row',
    title: 'Row',
    description: 'Manage row settings.',
    icon: ListCheck,
    category: 'Warehouse',
  },
  {
    id: 'attendants-time',
    title: 'Attendants Time',
    description: 'Manage attendants time settings.',
    icon: Clock,
    category: 'HR',
  },
  {
    id: 'leave',
    title: 'Leave',
    description: 'Manage leave settings.',
    icon: Calendar,
    category: 'HR',
  },
  {
    id: 'appsens-type',
    title: 'Appsens Type',
    description: 'Manage appsens type settings.',
    icon: LineChart,
    category: 'HR',
  },
  {
    id: 'document-management',
    title: 'Document Management',
    description: 'Manage document management settings.',
    icon: FileText,
    category: 'HR',
  },
  {
    id: 'performance-apresels',
    title: 'Performance Apresels',
    description: 'Manage performance apresels settings.',
    icon: LineChart,
    category: 'HR',
  },
  {
    id: 'container-type',
    title: 'Container Type',
    description: 'Manage container type settings.',
    icon: Box,
    category: 'Logistics',
  },
  {
    id: 'package-types',
    title: 'Package Types',
    description: 'Manage package types settings.',
    icon: Package,
    category: 'Logistics',
  },
  {
    id: 'service-scoop',
    title: 'Service Scoop',
    description: 'Manage service scoop settings.',
    icon: FileText,
    category: 'Logistics',
  },
  {
    id: 'vessels',
    title: 'Vessels',
    description: 'Manage vessels settings.',
    icon: Ship,
    category: 'Logistics',
  },
  {
    id: 'document-types',
    title: 'Document Types',
    description: 'Manage document types settings.',
    icon: FileText,
    category: 'Logistics',
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Manage templates settings.',
    icon: FileText,
    category: 'Logistics',
  },
  {
    id: 'tracking-stage',
    title: 'Tracking Stage',
    description: 'Manage tracking stage settings.',
    icon: MapPin,
    category: 'Logistics',
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Manage network settings.',
    icon: Router,
    category: 'Logistics',
  },
]

const filters = [
  {
    label: 'Settings',
    icon: Settings,
    count: managementCards.filter(item => item.category === 'Settings').length,
    color: 'text-blue-500',
    border_olor: 'blue-500'
  },
  {
    label: 'Geography',
    icon: Globe,
    count: managementCards.filter(item => item.category === 'Geography').length,
    color: 'text-green-500',
    border_olor: 'green-500'
  },
  {
    label: 'Partners',
    icon: Users,
    count: managementCards.filter(item => item.category === 'Partners').length,
    color: 'text-purple-500',
    border_olor: 'purple-500'
  },
  {
    label: 'Finance',
    icon: DollarSign,
    count: managementCards.filter(item => item.category === 'Finance').length,
    color: 'text-yellow-500',
    border_olor: 'yellow-500'
  },
  {
    label: 'Third Party',
    icon: Building,
    count: managementCards.filter(item => item.category === 'Third Party').length,
    color: 'text-orange-500',
    border_olor: 'orange-500'
  },
  {
    label: 'Warehouse',
    icon: Warehouse,
    count: managementCards.filter(item => item.category === 'Warehouse').length,
    color: 'text-red-500',
    border_olor: 'red-500'
  },
  {
    label: 'HR',
    icon: UserCog,
    count: managementCards.filter(item => item.category === 'HR').length,
    color: 'text-pink-500',
    border_olor: 'pink-500'
  },
  {
    label: 'Logistics',
    icon: Truck,
    count: managementCards.filter(item => item.category === 'Logistics').length,
    color: 'text-indigo-500',
    border_olor: 'indigo-500'
  },
]

export default function MasterDataPage() {
  const [activeFilter, setActiveFilter] = useState('Settings')

  const filteredManagementCards = managementCards.filter(card => card.category === activeFilter)

  return (
    <div className="mt-8">
      <div className="mt-10 flex flex-wrap justify-center items-center gap-6">
        {filters.map(({ label, icon: Icon, color, border_olor }) => {
          const isActive = activeFilter === label;
          
          const getColorClasses = (type: 'border' | 'icon') => {
            const baseClass = type === 'border' ? 'border-' : 'text-';
            switch(border_olor) {
              case 'blue-500': return `${baseClass}blue-500`;
              case 'green-500': return `${baseClass}green-500`;
              case 'yellow-500': return `${baseClass}yellow-500`;
              case 'red-500': return `${baseClass}red-500`;
              case 'purple-500': return `${baseClass}purple-500`;
              case 'pink-500': return `${baseClass}pink-500`;
              case 'orange-500': return `${baseClass}orange-500`;
              case 'indigo-500': return `${baseClass}indigo-500`;
              default: return `${baseClass}gray-500`;
            }
          };

          const borderClass = getColorClasses('border');
          const iconClass = getColorClasses('icon');

          return (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`
                group relative flex flex-col items-center justify-center w-16 h-16 rounded-full
                transition-all duration-300 border-2
                ${isActive
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 shadow-md'
                  : `bg-white dark:bg-gray-800 ${borderClass} hover:border-blue-400 hover:shadow`
                }
              `}
            >
              <Icon
                className={`
                  w-6 h-6 transition-transform duration-1000 ease-in-out
                  group-hover:rotate-[360deg]
                  ${isActive ? color : iconClass}
                `}
              />
              <span
                className={`
                  absolute bottom-[-1.5rem] text-xs opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? 'text-black dark:text-white' : 'text-gray-400'}
                `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8"></div>
      <div className="mt-8 mb-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredManagementCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-bl from-[#3D63F4] to-[#000000] dark:bg-green-200" />

              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                    <Icon className="w-6 h-6 "   />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {card.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {card.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/MasterData/${card.id}`}
                  className="
                    flex items-center justify-center gap-1
                    w-28 h-10 rounded-lg
                    bg-gradient-to-r from-green-50 to-green-100 dark:bg-blue-900
                    text-green-600 dark:text-blue-300
                    text-xs font-medium
                    hover:bg-blue-200 dark:hover:bg-blue-800
                    hover:shadow-md transition-all duration-200
                  "
                >
                  <Icon className="w-4 h-4" />
                  Manage
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}