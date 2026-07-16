import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Command,
  Expand,
  Menu,
  MoonStar,
  Search,
  Shield,
  SunMedium,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { appRoutes } from "../../app/router/route-config";
import { usePlatform } from "../../features/platform/platform-context";
import { formatLocalTimestamp } from "../../lib/date";
import { ErrorBoundary } from "./error-boundaries";
import {
  CommandPalette,
  NotificationCenter,
  ProfileMenu,
  QuickStatsBar,
  StatusBadge,
  ToastViewport,
} from "../ui/enterprise-widgets";
import { CopilotAssistant } from "../ui/copilot-assistant";

export function AppLayout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const {
    liveDataMessage,
    currentTime,
    lastSync,
    notificationCenterOpen,
    notifications,
    profileMenuOpen,
    searchQuery,
    setSearchQuery,
    theme,
    toggleCommandPalette,
    toggleNotificationCenter,
    toggleProfileMenu,
    toggleTheme,
    triggerQuickAction,
  } = usePlatform();
  const activeRoute = useMemo(
    () => appRoutes.find((route) => route.path === location.pathname) ?? appRoutes[0],
    [location.pathname],
  );
  const breadcrumbs = useMemo(() => {
    const sections = activeRoute.path.split("/").filter(Boolean);
    return ["Operations", ...sections.map((section) => section.replace("-", " "))];
  }, [activeRoute.path]);

  const openFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen();
  };

  return (
    <div className="min-h-screen bg-app text-primary">
      <CommandPalette />
      <NotificationCenter />
      <ToastViewport />
      <CopilotAssistant />
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside
          className={[
            "border-b border-white/10 bg-panel p-6 backdrop-blur-xl lg:border-b-0 lg:border-r",
            isSidebarOpen ? "block" : "hidden lg:block",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-accent-400/30 bg-accent-500/10 p-2">
              <BrainCircuit className="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-primary">Smart City</p>
              <p className="text-xs text-muted">Operations Center</p>
            </div>
          </div>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Operations Mode</p>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge label="Live stream" tone="accent" pulse />
              <span className="text-sm text-muted">{currentTime}</span>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {appRoutes.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-accent-500/15 text-accent-300 shadow-glow"
                      : "text-muted hover:bg-white/5 hover:text-primary",
                  ].join(" ")
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="rounded-full border border-accent-400/20 bg-accent-500/10 px-2 py-0.5 text-[11px] text-accent-300">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-app/80 px-6 py-4 backdrop-blur-xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
              <div className="mb-3 flex items-center gap-3 lg:hidden">
                <button
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary"
                  onClick={() => setIsSidebarOpen((current) => !current)}
                  type="button"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <span className="text-sm uppercase tracking-[0.24em] text-accent-300/80">
                  Navigation
                </span>
              </div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                  {breadcrumbs.map((crumb) => (
                    <span key={crumb}>{crumb}</span>
                  ))}
                </div>
              <p className="mt-3 text-sm uppercase tracking-[0.28em] text-accent-300/80">
                Agentic Smart City Brain
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-primary">{activeRoute.label}</h1>
              <p className="mt-2 text-sm text-muted">
                Updated {formatLocalTimestamp(new Date(lastSync))} for the active operations workspace.
              </p>
              </div>
              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="hidden min-w-[280px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:flex">
                    <Search className="h-4 w-4 text-muted" />
                    <input
                      aria-label="Search"
                      className="w-full border-0 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onFocus={() => toggleCommandPalette(true)}
                      placeholder="Global search, modules, workflows..."
                      value={searchQuery}
                    />
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-muted">
                      Ctrl+K
                    </span>
                  </div>
                  <HeaderPill label="Live Metrics" />
                  <HeaderPill icon={<Shield className="h-4 w-4" />} label="Secure Mode" />
                  <button
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={() => toggleCommandPalette(true)}
                    type="button"
                  >
                    <Command className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={openFullscreen}
                    type="button"
                  >
                    <Expand className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={toggleTheme}
                    type="button"
                  >
                    {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                  <button
                    className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={() => toggleNotificationCenter(!notificationCenterOpen)}
                    type="button"
                  >
                <Bell className="h-4 w-4" />
                    <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 py-0.5 text-[10px] text-white">
                      {notifications.filter((item) => !item.acknowledged).length}
                    </span>
                  </button>
                  <div className="relative">
                    <button
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                      onClick={() => toggleProfileMenu(!profileMenuOpen)}
                      type="button"
                    >
                      <UserRound className="h-4 w-4" />
                    </button>
                    <ProfileMenu />
                  </div>
                </div>
                <div className="hidden xl:block">
                  <button
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={() => triggerQuickAction("Generate operational briefing")}
                    type="button"
                  >
                    AI briefing ready
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            {liveDataMessage ? (
              <div className="mb-6 rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning">
                {liveDataMessage}
              </div>
            ) : null}
            <QuickStatsBar />
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
              >
                <ErrorBoundary
                  fallbackTitle="This page could not be rendered"
                  fallbackDescription="The navigation shell is still available. We caught the page error and kept the command-center workspace running."
                  preserveShell
                >
                  <Outlet />
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function HeaderPill(props: { icon?: JSX.Element; label: string }): JSX.Element {
  return (
    <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary md:flex">
      {props.icon}
      <span>{props.label}</span>
    </div>
  );
}
