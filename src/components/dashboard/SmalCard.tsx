import { 
  Laptop, 
  Server, 
  Network, 
  ShieldCheck,
} from 'lucide-react';


const STAT_CARDS = [
  {
    title: "Devices",
    value: "142",
    icon: Laptop,
    trend: "+12%",
    description: "from last month",
    color: {
      bgFrom: "from-blue-50",
      bgTo: "to-blue-100",
      darkBgFrom: "dark:from-blue-900/30",
      darkBgTo: "dark:to-blue-800/30",
      border: "border-blue-100",
      darkBorder: "dark:border-blue-900/50",
      circle1: "bg-blue-200",
      darkCircle1: "dark:bg-blue-700/20",
      circle2: "bg-blue-300",
      darkCircle2: "dark:bg-blue-600/20",
      text: "text-blue-800",
      darkText: "dark:text-blue-200",
      iconBg: "bg-blue-100",
      darkIconBg: "dark:bg-blue-900/30",
      iconColor: "text-blue-600",
      darkIconColor: "dark:text-blue-400",
      descColor: "text-blue-700",
      darkDescColor: "dark:text-blue-300"
    }
  },
  {
    title: "Servers",
    value: "8",
    icon: Server,
    trend: "100%",
    description: "systems operational",
    color: {
      bgFrom: "from-green-50",
      bgTo: "to-green-100",
      darkBgFrom: "dark:from-green-900/30",
      darkBgTo: "dark:to-green-800/30",
      border: "border-green-100",
      darkBorder: "dark:border-green-900/50",
      circle1: "bg-green-200",
      darkCircle1: "dark:bg-green-700/20",
      circle2: "bg-green-300",
      darkCircle2: "dark:bg-green-600/20",
      text: "text-green-800",
      darkText: "dark:text-green-200",
      iconBg: "bg-green-100",
      darkIconBg: "dark:bg-green-900/30",
      iconColor: "text-green-600",
      darkIconColor: "dark:text-green-400",
      descColor: "text-green-700",
      darkDescColor: "dark:text-green-300"
    }
  },
  {
    title: "Network",
    value: "24",
    icon: Network,
    trend: "Active",
    description: "connections",
    color: {
      bgFrom: "from-purple-50",
      bgTo: "to-purple-100",
      darkBgFrom: "dark:from-purple-900/30",
      darkBgTo: "dark:to-purple-800/30",
      border: "border-purple-100",
      darkBorder: "dark:border-purple-900/50",
      circle1: "bg-purple-200",
      darkCircle1: "dark:bg-purple-700/20",
      circle2: "bg-purple-300",
      darkCircle2: "dark:bg-purple-600/20",
      text: "text-purple-800",
      darkText: "dark:text-purple-200",
      iconBg: "bg-purple-100",
      darkIconBg: "dark:bg-purple-900/30",
      iconColor: "text-purple-600",
      darkIconColor: "dark:text-purple-400",
      descColor: "text-purple-700",
      darkDescColor: "dark:text-purple-300"
    }
  },
  {
    title: "Security",
    value: "97%",
    icon: ShieldCheck,
    trend: "Secure",
    description: "systems secured",
    color: {
      bgFrom: "from-orange-50",
      bgTo: "to-orange-100",
      darkBgFrom: "dark:from-orange-900/30",
      darkBgTo: "dark:to-orange-800/30",
      border: "border-orange-100",
      darkBorder: "dark:border-orange-900/50",
      circle1: "bg-orange-200",
      darkCircle1: "dark:bg-orange-700/20",
      circle2: "bg-orange-300",
      darkCircle2: "dark:bg-orange-600/20",
      text: "text-orange-800",
      darkText: "dark:text-orange-200",
      iconBg: "bg-orange-100",
      darkIconBg: "dark:bg-orange-900/30",
      iconColor: "text-orange-600",
      darkIconColor: "dark:text-orange-400",
      descColor: "text-orange-700",
      darkDescColor: "dark:text-orange-300"
    }
  }
];


export default function Cards() {
    return(
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((card, index) => (
            <div 
              key={index}
              className={`relative bg-gradient-to-br ${card.color.bgFrom} ${card.color.bgTo} ${card.color.darkBgFrom} ${card.color.darkBgTo} rounded-xl p-6 shadow-sm border ${card.color.border} ${card.color.darkBorder} overflow-hidden`}
            >
              <div className={`absolute -right-10 -top-10 w-40 h-40 ${card.color.circle1} ${card.color.darkCircle1} rounded-full opacity-30`}></div>
              <div className={`absolute -right-5 -bottom-5 w-32 h-32 ${card.color.circle2} ${card.color.darkCircle2} rounded-full opacity-20`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${card.color.text} ${card.color.darkText}`}>{card.title}</h3>
                  <div className={`p-2 rounded-lg ${card.color.iconBg} ${card.color.darkIconBg} ${card.color.iconColor} ${card.color.darkIconColor}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{card.value}</p>
                <p className={`text-sm ${card.color.descColor} ${card.color.darkDescColor}`}>
                  {card.trend} {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
}