import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { routeMeta } from "../../app/router/route-meta";
import {
  getOperationalDashboardSnapshot,
  MapAsset,
  OperationalMetric,
  OperationalNotification,
  OperationalDashboardSnapshot,
  SourceStatus,
} from "../../services/operations-api";

export type ThemeMode = "dark" | "light";

export interface LiveMetric {
  key: string;
  label: string;
  value: number;
  previous: number;
  unit: string;
  decimals?: number;
  status: "healthy" | "watch" | "critical" | "stable";
  sparkline: number[];
  updatedAt: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  acknowledged: boolean;
}

export interface PlatformToast {
  id: string;
  title: string;
  detail: string;
}

export interface MapUnit {
  id: string;
  label: string;
  type:
    | "traffic"
    | "ambulance"
    | "police"
    | "fire"
    | "waste"
    | "water"
    | "energy"
    | "sensor"
    | "drone";
  x: number;
  y: number;
  heading: number;
  status: "active" | "watch" | "offline" | "critical";
  detail: string;
}

export interface WeatherSnapshot {
  condition: string;
  temperatureC: number;
  humidity: number;
  windKph: number;
  rainfallMm: number;
  source: string;
}

export interface PlatformState {
  theme: ThemeMode;
  currentTime: string;
  currentDate: string;
  uptime: string;
  lastSync: string;
  autoRefreshMs: number;
  autoRefreshLabel: string;
  liveMetrics: Record<string, LiveMetric>;
  notifications: PlatformNotification[];
  toasts: PlatformToast[];
  mapUnits: MapUnit[];
  weather: WeatherSnapshot;
  liveDataMessage: string | null;
  sourceStatuses: SourceStatus[];
  aiRecommendation: OperationalDashboardSnapshot["ai_recommendation"];
  activeEvents: OperationalDashboardSnapshot["active_events"];
  searchQuery: string;
  commandPaletteOpen: boolean;
  notificationCenterOpen: boolean;
  profileMenuOpen: boolean;
  globalSearchResults: { label: string; path: string; badge?: string }[];
}

interface PlatformContextValue extends PlatformState {
  toggleTheme: () => void;
  toggleCommandPalette: (next?: boolean) => void;
  toggleNotificationCenter: (next?: boolean) => void;
  toggleProfileMenu: (next?: boolean) => void;
  setSearchQuery: (value: string) => void;
  acknowledgeNotification: (id: string) => void;
  pushToast: (title: string, detail: string) => void;
  dismissToast: (id: string) => void;
  triggerQuickAction: (label: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const now = () => new Date().toISOString();

const initialMetrics: Record<string, LiveMetric> = {
  traffic: {
    key: "traffic",
    label: "Traffic Flow",
    value: 78,
    previous: 74,
    unit: "%",
    status: "watch",
    sparkline: [64, 68, 67, 70, 74, 75, 78],
    updatedAt: now(),
  },
  water: {
    key: "water",
    label: "Water Pressure",
    value: 5.5,
    previous: 5.3,
    unit: "bar",
    decimals: 1,
    status: "stable",
    sparkline: [5.1, 5.2, 5.2, 5.3, 5.4, 5.4, 5.5],
    updatedAt: now(),
  },
  energy: {
    key: "energy",
    label: "Energy Usage",
    value: 1.2,
    previous: 1.16,
    unit: "GW",
    decimals: 2,
    status: "watch",
    sparkline: [1.02, 1.04, 1.08, 1.1, 1.15, 1.17, 1.2],
    updatedAt: now(),
  },
  waste: {
    key: "waste",
    label: "Bin Fill",
    value: 71,
    previous: 69,
    unit: "%",
    status: "watch",
    sparkline: [58, 61, 63, 65, 67, 69, 71],
    updatedAt: now(),
  },
  air: {
    key: "air",
    label: "Air Quality Index",
    value: 45,
    previous: 49,
    unit: "AQI",
    status: "healthy",
    sparkline: [53, 51, 49, 48, 47, 46, 45],
    updatedAt: now(),
  },
  emergency: {
    key: "emergency",
    label: "Active Emergencies",
    value: 3,
    previous: 4,
    unit: "",
    status: "critical",
    sparkline: [6, 5, 5, 4, 4, 3, 3],
    updatedAt: now(),
  },
  reports: {
    key: "reports",
    label: "Citizen Reports",
    value: 128,
    previous: 117,
    unit: "",
    status: "watch",
    sparkline: [82, 90, 97, 105, 114, 119, 128],
    updatedAt: now(),
  },
  infrastructure: {
    key: "infrastructure",
    label: "Infrastructure Health",
    value: 92,
    previous: 90,
    unit: "%",
    status: "healthy",
    sparkline: [85, 86, 87, 88, 90, 91, 92],
    updatedAt: now(),
  },
};

const initialNotifications: PlatformNotification[] = [
  {
    id: "notif-1",
    title: "Harbor corridor congestion rising",
    detail: "Travel time is up 14% and emergency lane protection has been recommended.",
    severity: "high",
    timestamp: now(),
    acknowledged: false,
  },
  {
    id: "notif-2",
    title: "Sector 4 leak probability elevated",
    detail: "Water pressure variance crossed predictive maintenance threshold.",
    severity: "medium",
    timestamp: now(),
    acknowledged: false,
  },
  {
    id: "notif-3",
    title: "Evening load balancing ready",
    detail: "Battery reserve and commercial demand response plan are synchronized.",
    severity: "low",
    timestamp: now(),
    acknowledged: true,
  },
];

const initialUnits: MapUnit[] = [
  { id: "u1", label: "Bus 14", type: "traffic", x: 18, y: 62, heading: 45, status: "active", detail: "Moving bus on civic core route." },
  { id: "u2", label: "AMB-7", type: "ambulance", x: 58, y: 36, heading: 140, status: "active", detail: "Ambulance pre-positioned for corridor access." },
  { id: "u3", label: "PAT-2", type: "police", x: 70, y: 44, heading: 300, status: "active", detail: "Police unit monitoring incident zone." },
  { id: "u4", label: "FIR-3", type: "fire", x: 62, y: 54, heading: 220, status: "watch", detail: "Fire unit covering harbor district." },
  { id: "u5", label: "WT-11", type: "waste", x: 42, y: 68, heading: 90, status: "active", detail: "Garbage truck rerouted around congestion." },
  { id: "u6", label: "PMP-4", type: "water", x: 36, y: 78, heading: 0, status: "active", detail: "Drainage pump crew staged for water risk." },
  { id: "u7", label: "GRID-9", type: "energy", x: 76, y: 25, heading: 0, status: "active", detail: "Grid reserve asset monitoring transformer band." },
  { id: "u8", label: "AQ-12", type: "sensor", x: 44, y: 26, heading: 0, status: "active", detail: "Environmental sensor broadcasting AQI telemetry." },
  { id: "u9", label: "DRN-1", type: "drone", x: 27, y: 34, heading: 180, status: "watch", detail: "Recon drone tracking weather-affected corridor." },
];

const initialWeather: WeatherSnapshot = {
  condition: "Cloudy",
  temperatureC: 29,
  humidity: 68,
  windKph: 14,
  rainfallMm: 1.8,
  source: "simulated",
};

const initialAiRecommendation: OperationalDashboardSnapshot["ai_recommendation"] = {
  priority: "High",
  risk_score: 78,
  confidence_score: 0.94,
  recommended_actions: [
    "Deploy additional waste trucks before peak traffic.",
    "Pre-stage drainage teams in Sector 4.",
    "Protect emergency corridors around Harbor Loop.",
  ],
  reasoning: [
    "Traffic congestion is increasing.",
    "Overflow risk in Sector 4 is above threshold.",
  ],
};

function formatClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRelative(durationMs: number) {
  const totalMinutes = Math.max(1, Math.floor(durationMs / 60_000));
  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function toLiveMetrics(metrics: OperationalMetric[]): Record<string, LiveMetric> {
  return metrics.reduce<Record<string, LiveMetric>>((accumulator, metric) => {
    accumulator[metric.key] = {
      key: metric.key,
      label: metric.label,
      value: metric.value,
      previous: metric.previous,
      unit: metric.unit,
      decimals: metric.decimals,
      status: metric.status,
      sparkline: metric.sparkline,
      updatedAt: metric.updated_at,
    };
    return accumulator;
  }, {});
}

function toNotifications(items: OperationalNotification[]): PlatformNotification[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    detail: item.detail,
    severity: item.severity,
    timestamp: item.timestamp,
    acknowledged: item.acknowledged,
  }));
}

function toMapUnits(items: MapAsset[]): MapUnit[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    type: item.type === "bus" ? "traffic" : item.type === "garbage-truck" ? "waste" : item.type === "fire-vehicle" ? "fire" : item.type === "incident" ? "police" : (item.type as MapUnit["type"]),
    x: item.x,
    y: item.y,
    heading: item.heading,
    status: item.status,
    detail: item.detail,
  }));
}

export function PlatformProvider({ children }: { children: ReactNode }): JSX.Element {
  const launchedAt = useMemo(() => Date.now() - 1000 * 60 * 60 * 72, []);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [currentTime, setCurrentTime] = useState(formatClock(new Date()));
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [lastSync, setLastSync] = useState(now());
  const [searchQuery, setSearchQuery] = useState("");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(initialMetrics);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState<PlatformToast[]>([]);
  const [mapUnits, setMapUnits] = useState(initialUnits);
  const [weather, setWeather] = useState(initialWeather);
  const [liveDataMessage, setLiveDataMessage] = useState<string | null>(
    "Live data unavailable. Showing simulated operational data.",
  );
  const [sourceStatuses, setSourceStatuses] = useState<SourceStatus[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState(initialAiRecommendation);
  const [activeEvents, setActiveEvents] = useState<OperationalDashboardSnapshot["active_events"]>([]);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const operationsQuery = useQuery({
    queryKey: ["dashboard", "operations"],
    queryFn: getOperationalDashboardSnapshot,
    refetchInterval: 5_000,
    staleTime: 4_000,
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = new Date();
      setCurrentTime(formatClock(current));
      setCurrentDate(formatDate(current));
    }, 1_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const snapshot = operationsQuery.data;
    if (!snapshot) {
      return;
    }
    setLiveMetrics(toLiveMetrics(snapshot.metrics));
    setNotifications(toNotifications(snapshot.notifications));
    setMapUnits(toMapUnits(snapshot.map_assets));
    setWeather({
      condition: snapshot.weather.condition,
      temperatureC: snapshot.weather.temperature_celsius,
      humidity: snapshot.weather.humidity_percent,
      rainfallMm: snapshot.weather.rainfall_mm,
      windKph: snapshot.weather.wind_speed_kph,
      source: snapshot.weather.source,
    });
    setSourceStatuses(snapshot.source_statuses);
    setLiveDataMessage(snapshot.live_data_message);
    setAiRecommendation(snapshot.ai_recommendation);
    setActiveEvents(snapshot.active_events);
    setLastSync(snapshot.generated_at);
  }, [operationsQuery.data]);

  useEffect(() => {
    const controller = new AbortController();
    let websocket: WebSocket | null = null;

    const connect = async () => {
      const httpProtocol = window.location.protocol === "https:" ? "https" : "http";
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.hostname;

      try {
        const response = await fetch(`${httpProtocol}://${host}:8010/health`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }
      } catch {
        return;
      }

      websocket = new WebSocket(`${wsProtocol}://${host}:8010/ws/v1/dashboard`);
      websocket.addEventListener("open", () => {
        websocket?.send("subscribe:operations");
      });
      websocket.addEventListener("message", (event) => {
        try {
          const payload = JSON.parse(event.data) as { type?: string; timestamp?: string };
          if (payload.type === "operations.snapshot" && payload.timestamp) {
            setLastSync(payload.timestamp);
          }
        } catch {
          return;
        }
      });
    };

    void connect();

    return () => {
      controller.abort();
      websocket?.close();
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 4_000),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setNotificationCenterOpen(false);
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const pushToast = useCallback((title: string, detail: string) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), title, detail }]);
  }, []);

  const acknowledgeNotification = useCallback(
    (id: string) => {
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, acknowledged: true } : item)),
      );
      pushToast("Notification acknowledged", "The alert workflow has been updated.");
    },
    [pushToast],
  );

  const triggerQuickAction = useCallback(
    (label: string) => {
      const timestamp = now();
      setNotifications((current) => [
        {
          id: crypto.randomUUID(),
          title: label,
          detail: "Operator-confirmed action has been queued into the command workflow.",
          severity: "medium",
          timestamp,
          acknowledged: false,
        },
        ...current,
      ]);
      pushToast("Workflow launched", `${label} has been queued in the operations center.`);
    },
    [pushToast],
  );

  const globalSearchResults = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    const operationalResults = [
      ...mapUnits.map((unit) => ({
        label: `${unit.label} • ${unit.detail}`,
        path: "/dashboard",
        badge: unit.type,
      })),
      ...notifications.map((notification) => ({
        label: `${notification.title} • ${notification.detail}`,
        path: "/command-center",
        badge: notification.severity,
      })),
      ...activeEvents.map((event) => ({
        label: `${event.name} • ${event.summary}`,
        path: "/city-brain",
        badge: event.severity,
      })),
      ...Object.values(liveMetrics).map((metric) => ({
        label: `${metric.label} • ${metric.value}${metric.unit}`,
        path: "/dashboard",
        badge: metric.status,
      })),
    ];

    if (!query) {
      return [
        ...routeMeta.slice(0, 8).map((route) => ({
          label: route.label,
          path: route.path,
          badge: route.badge,
        })),
        ...operationalResults.slice(0, 6),
      ];
    }

    return [...routeMeta.map((route) => ({
      label: route.label,
      path: route.path,
      badge: route.badge,
    })), ...operationalResults]
      .filter((route) => route.label.toLowerCase().includes(query) || route.path.includes(query))
      .map((route) => ({
        label: route.label,
        path: route.path,
        badge: route.badge,
      }))
      .slice(0, 12);
  }, [activeEvents, deferredSearchQuery, liveMetrics, mapUnits, notifications]);

  const value = useMemo<PlatformContextValue>(
    () => ({
      theme,
      currentTime,
      currentDate,
      uptime: formatRelative(Date.now() - launchedAt),
      lastSync,
      autoRefreshMs: 5_000,
      autoRefreshLabel: "5s stream",
      liveMetrics,
      notifications,
      toasts,
      mapUnits,
      weather,
      liveDataMessage,
      sourceStatuses,
      aiRecommendation,
      activeEvents,
      searchQuery,
      commandPaletteOpen,
      notificationCenterOpen,
      profileMenuOpen,
      globalSearchResults,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      toggleCommandPalette: (next) => setCommandPaletteOpen(next ?? ((current) => !current)),
      toggleNotificationCenter: (next) =>
        setNotificationCenterOpen(next ?? ((current) => !current)),
      toggleProfileMenu: (next) => setProfileMenuOpen(next ?? ((current) => !current)),
      setSearchQuery,
      acknowledgeNotification,
      pushToast,
      dismissToast: (id) => setToasts((current) => current.filter((item) => item.id !== id)),
      triggerQuickAction,
    }),
    [
      acknowledgeNotification,
      commandPaletteOpen,
      currentDate,
      currentTime,
      globalSearchResults,
      launchedAt,
      lastSync,
      liveMetrics,
      liveDataMessage,
      mapUnits,
      notificationCenterOpen,
      notifications,
      profileMenuOpen,
      pushToast,
      searchQuery,
      sourceStatuses,
      theme,
      toasts,
      weather,
      aiRecommendation,
      activeEvents,
    ],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const value = useContext(PlatformContext);
  if (!value) {
    throw new Error("usePlatform must be used within PlatformProvider");
  }

  return value;
}
