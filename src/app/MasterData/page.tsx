'use client';

import MainLayout from '@/components/MainLayout'
import '@/styles/globals.css'
import Link from 'next/link'
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import Cards from '@/components/dashboard/SmalCard';
import MasterDataPage from '@/components/dashboard/catagrycard';
import {
  Building2,
  Landmark,
  Layers,
  Users,
  Briefcase,
  Wallet,
  Clock,
  CalendarX2,
  CalendarCheck2,
  FileText,
  GraduationCap,
  LineChart,
  Archive,
  Megaphone,
  Cpu,
  HardDrive,
  MonitorSmartphone,
  Laptop2,
  ShieldCheck,
  Settings,
  Network,
  Server,
  BadgePercent,
  UserCog,
  BookText,
  Tag,
Globe,
DollarSign,
Warehouse,
} from 'lucide-react';





export default function ITModulePage() {

  return (
    <MainLayout>
      <div className="w-full h-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
         <Cards />

         <MasterDataPage />

      </div>
    </MainLayout>
  )
}

export async function GetStaticProps() {
  return {
    props: {}, 
    revalidate: 86400 
  }
}