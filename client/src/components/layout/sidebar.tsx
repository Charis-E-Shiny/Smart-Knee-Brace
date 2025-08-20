import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard,
  Dumbbell,
  Footprints,
  AlertTriangle,
  BarChart3,
  Settings,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    testId: "nav-dashboard"
  },
  {
    name: "Exercises",
    href: "/exercises",
    icon: Dumbbell,
    testId: "nav-exercises"
  },
  {
    name: "Step Counter",
    href: "/steps",
    icon: Footprints,
    testId: "nav-steps"
  },
  {
    name: "Fall Detection",
    href: "/alerts",
    icon: AlertTriangle,
    testId: "nav-alerts"
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    testId: "nav-reports"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    testId: "nav-settings"
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-medical-blue shadow-lg fixed h-full z-10">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8" data-testid="sidebar-logo">
          <Heart className="text-white text-2xl" />
          <h1 className="text-white text-xl font-semibold">SmartKnee</h1>
        </div>
        
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center p-3 rounded-lg transition-colors",
                      isActive
                        ? "text-white bg-blue-800"
                        : "text-blue-100 hover:bg-blue-800 hover:text-white"
                    )}
                    data-testid={item.testId}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
