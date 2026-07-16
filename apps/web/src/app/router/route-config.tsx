import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Command,
  Droplets,
  Gauge,
  Leaf,
  ListTree,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  Zap,
} from "lucide-react";
import { ReactNode } from "react";
import { CommandCenterPage } from "../../features/command-center/command-center-page";
import { CityBrainPage } from "../../features/city-brain/city-brain-page";
import { DashboardPage } from "../../features/dashboard/dashboard-page";
import { IncidentCenterPage } from "../../features/incidents/incident-center-page";
import { moduleDefinitions } from "../../features/modules/module-config";
import { ModulePage } from "../../features/modules/module-page";

export interface AppRouteDefinition {
  path: string;
  label: string;
  badge?: string;
  icon: ReactNode;
  element: JSX.Element;
}

export const appRoutes: AppRouteDefinition[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <Gauge className="h-4 w-4" />,
    badge: "Live",
    element: <DashboardPage />,
  },
  {
    path: "/traffic",
    label: "Traffic",
    icon: <Activity className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.traffic} />,
  },
  {
    path: "/waste",
    label: "Waste",
    icon: <Trash2 className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.waste} />,
  },
  {
    path: "/water",
    label: "Water",
    icon: <Droplets className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.water} />,
  },
  {
    path: "/energy",
    label: "Energy",
    icon: <Zap className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.energy} />,
  },
  {
    path: "/air-quality",
    label: "Air Quality",
    icon: <Leaf className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions["air-quality"]} />,
  },
  {
    path: "/emergency",
    label: "Emergency",
    icon: <AlertTriangle className="h-4 w-4" />,
    badge: "3",
    element: <ModulePage module={moduleDefinitions.emergency} />,
  },
  {
    path: "/incidents",
    label: "Incidents",
    icon: <ListTree className="h-4 w-4" />,
    badge: "Ops",
    element: <IncidentCenterPage />,
  },
  {
    path: "/command-center",
    label: "Command Center",
    icon: <Command className="h-4 w-4" />,
    badge: "Live",
    element: <CommandCenterPage />,
  },
  {
    path: "/city-brain",
    label: "City Brain",
    icon: <BrainCircuit className="h-4 w-4" />,
    element: <CityBrainPage />,
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.analytics} />,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.settings} />,
  },
  {
    path: "/admin",
    label: "Admin",
    icon: <ShieldCheck className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.admin} />,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: <UserRound className="h-4 w-4" />,
    element: <ModulePage module={moduleDefinitions.profile} />,
  },
];
