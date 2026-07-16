export interface RouteMeta {
  path: string;
  label: string;
  badge?: string;
}

export const routeMeta: RouteMeta[] = [
  { path: "/dashboard", label: "Dashboard", badge: "Live" },
  { path: "/traffic", label: "Traffic" },
  { path: "/waste", label: "Waste" },
  { path: "/water", label: "Water" },
  { path: "/energy", label: "Energy" },
  { path: "/air-quality", label: "Air Quality" },
  { path: "/emergency", label: "Emergency", badge: "3" },
  { path: "/incidents", label: "Incidents", badge: "Ops" },
  { path: "/command-center", label: "Command Center", badge: "Live" },
  { path: "/city-brain", label: "City Brain" },
  { path: "/analytics", label: "Analytics" },
  { path: "/settings", label: "Settings" },
  { path: "/admin", label: "Admin" },
  { path: "/profile", label: "Profile" },
];
