'use client'

import MainLayout from "@/components/MainLayout";
import { 
  Laptop, 
  Server, 
  Network, 
  ShieldCheck,
  Settings,
  Bell,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "@/components/dashboard/SmalCard";
// Data constants for the cards


const SMALL_CARDS = [
  {
    title: "System Devices",
    description: "Manage IT settings",
    icon: Settings,
    buttonText: "Configure",
    href:'It_module/System_Devices',
    color: {
      iconBg: "bg-blue-100",
      darkIconBg: "dark:bg-blue-900/30",
      iconColor: "text-blue-600",
      darkIconColor: "dark:text-blue-400"
    }
  },
  {
    title: "Ticketing",
    description: "Manage ticketing settings",
    icon: Bell,
    buttonText: "View",
    href:'It_module/Ticketing',

    color: {
      iconBg: "bg-green-100",
      darkIconBg: "dark:bg-green-900/30",
      iconColor: "text-green-600",
      darkIconColor: "dark:text-green-400"
    }
  }
];

export default function ITModulePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">IT Module Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to the IT module management system
          </p>
        </div>

        {/* Main Cards with Chart-like Backgrounds */}
       <Cards />

        {/* Two Small Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SMALL_CARDS.map((card, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${card.color.iconBg} ${card.color.darkIconBg} ${card.color.iconColor} ${card.color.darkIconColor}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{card.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
                </div>
              </div>
           {card.href ? (
  <Link href={card.href}>
    <Button variant="outline" size="sm">
      {card.buttonText}
    </Button>
  </Link>
) : (
  <Button variant="outline" size="sm" disabled>
    {card.buttonText}
  </Button>
)}

       
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}