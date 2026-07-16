export interface ModuleDefinition {
  key: string;
  title: string;
  eyebrow: string;
  summary: string;
  primaryMetricKey: string;
  secondaryMetricKey: string;
  tertiaryMetricKey: string;
  quaternaryMetricKey: string;
  workspaceLabel: string;
  actionLabel: string;
  priorities: string[];
  insights: string[];
  workflows: string[];
  assets: Array<{
    name: string;
    detail: string;
    status: "healthy" | "watch" | "critical" | "stable";
  }>;
}

export const moduleDefinitions: Record<string, ModuleDefinition> = {
  traffic: {
    key: "traffic",
    title: "Traffic Operations",
    eyebrow: "Flow Intelligence",
    summary:
      "Intersection telemetry, AI congestion prediction, corridor protection, public transport tracking, and incident-aware diversion planning from one control surface.",
    primaryMetricKey: "traffic",
    secondaryMetricKey: "emergency",
    tertiaryMetricKey: "reports",
    quaternaryMetricKey: "infrastructure",
    workspaceLabel: "Traffic cameras, signal health, parking occupancy, and travel time prediction are actively orchestrated.",
    actionLabel: "Optimize corridor",
    priorities: [
      "Protect harbor emergency corridor before the freight pulse reaches downtown.",
      "Rebalance adaptive signal plans around Stadium Loop for the next 20 minutes.",
      "Review accident-detection confidence on the northern arterial camera cluster.",
    ],
    insights: [
      "Vehicle throughput remains resilient, but spillover risk is accelerating near the cargo route.",
      "Public transport adherence improved after the last diversion plan was deployed.",
      "Parking occupancy pressure is highest near the civic core between 17:00 and 19:00.",
    ],
    workflows: [
      "Launch historical playback",
      "Dispatch road closure advisory",
      "Reserve emergency response corridor",
    ],
    assets: [
      { name: "Signal Cluster North", detail: "48 intersections synchronized", status: "healthy" },
      { name: "Camera Grid Harbor", detail: "3 feeds under enhanced monitoring", status: "watch" },
      { name: "Parking Mesh Central", detail: "Occupancy forecast enabled", status: "stable" },
    ],
  },
  waste: {
    key: "waste",
    title: "Waste Operations",
    eyebrow: "Sanitation Autonomy",
    summary:
      "Smart-bin monitoring, overflow prediction, complaint correlation, truck dispatch, and route optimization for city sanitation teams.",
    primaryMetricKey: "waste",
    secondaryMetricKey: "reports",
    tertiaryMetricKey: "traffic",
    quaternaryMetricKey: "infrastructure",
    workspaceLabel: "Collection schedules, vehicle tracking, illegal dumping hotspots, and recycling analytics are synchronized.",
    actionLabel: "Rebalance collection",
    priorities: [
      "Pre-position overflow support near the stadium before event egress begins.",
      "Reroute Truck WT-11 away from a high-delay corridor to recover collection cadence.",
      "Review complaint clustering for illegal dumping around the rail overpass.",
    ],
    insights: [
      "Morning collection efficiency remains above target with no overtime escalation required.",
      "Overflow probability is concentrated in mixed-use districts with increased footfall.",
      "Recycling participation rose in the last 24 hours after targeted outreach.",
    ],
    workflows: [
      "Optimize route plan",
      "Notify field supervisor",
      "Generate sanitation report",
    ],
    assets: [
      { name: "Smart Bin Mesh", detail: "1,284 bins reporting heartbeat", status: "healthy" },
      { name: "Fleet Route 11", detail: "Delay due to traffic spillover", status: "watch" },
      { name: "Recycling Hub East", detail: "Normal throughput", status: "stable" },
    ],
  },
  water: {
    key: "water",
    title: "Water Monitoring",
    eyebrow: "Pressure Assurance",
    summary:
      "Pipeline visualization, leak detection, pump and valve telemetry, water quality tracking, and predictive maintenance planning.",
    primaryMetricKey: "water",
    secondaryMetricKey: "infrastructure",
    tertiaryMetricKey: "reports",
    quaternaryMetricKey: "emergency",
    workspaceLabel: "Reservoir levels, pressure heatmaps, and maintenance schedules are coordinated against live demand.",
    actionLabel: "Dispatch leak crew",
    priorities: [
      "Validate the Sector 4 pressure anomaly before evening demand ramps up.",
      "Inspect valve telemetry around the southern feeder loop for intermittent variance.",
      "Confirm water quality readings after the latest rainfall pulse.",
    ],
    insights: [
      "Leak detection confidence is rising, but the projected impact remains localized.",
      "Reservoir coverage is strong enough to absorb a single feeder outage if required.",
      "Pump efficiency improved after the last predictive maintenance window.",
    ],
    workflows: [
      "Create maintenance schedule",
      "Isolate valve corridor",
      "Export water quality summary",
    ],
    assets: [
      { name: "Reservoir Alpha", detail: "82% capacity", status: "healthy" },
      { name: "Sector 4 Main", detail: "Leak probability elevated", status: "watch" },
      { name: "Pump Station South", detail: "Efficiency within target", status: "stable" },
    ],
  },
  energy: {
    key: "energy",
    title: "Energy Management",
    eyebrow: "Grid Stability",
    summary:
      "Grid visualization, renewable generation, transformer health, outage coordination, peak demand prediction, and load balancing insights.",
    primaryMetricKey: "energy",
    secondaryMetricKey: "infrastructure",
    tertiaryMetricKey: "traffic",
    quaternaryMetricKey: "emergency",
    workspaceLabel: "Transformer status, solar production, storage reserves, and power quality analytics are visible in one workspace.",
    actionLabel: "Run load balancing",
    priorities: [
      "Prepare commercial demand response ahead of the evening peak window.",
      "Inspect transformer pair T-14 and T-18 before thermal load enters watch state.",
      "Validate battery reserve availability for critical emergency facilities.",
    ],
    insights: [
      "Renewable contribution is offsetting midday load more effectively than yesterday.",
      "Carbon intensity is trending down as storage dispatch smooths thermal ramp-up.",
      "Outage restoration readiness remains strong across critical service corridors.",
    ],
    workflows: [
      "Dispatch storage reserve",
      "Open outage board",
      "Publish energy briefing",
    ],
    assets: [
      { name: "Solar Array West", detail: "96 MW active generation", status: "healthy" },
      { name: "Transformer T-18", detail: "Thermal watch threshold near", status: "watch" },
      { name: "Battery Reserve Hub", detail: "Ready for dispatch", status: "stable" },
    ],
  },
  "air-quality": {
    key: "air-quality",
    title: "Air Quality",
    eyebrow: "Environmental Sensing",
    summary:
      "AQI overlays, particulate monitoring, weather coupling, pollutant source correlation, and forecast-driven public health recommendations.",
    primaryMetricKey: "air",
    secondaryMetricKey: "traffic",
    tertiaryMetricKey: "reports",
    quaternaryMetricKey: "infrastructure",
    workspaceLabel: "PM2.5, PM10, gases, wind, rain, and exposure forecasts are blended into a citywide sensing view.",
    actionLabel: "Issue advisory",
    priorities: [
      "Monitor freight corridor emissions during the next traffic swell.",
      "Review rainfall-assisted dispersion impact on particulate hotspots.",
      "Compare source attribution confidence before public advisory decisions.",
    ],
    insights: [
      "Air quality remains favorable, with pollutant concentration localized to transport corridors.",
      "Wind direction is currently reducing exposure risk near dense residential zones.",
      "Historical analytics show improved morning conditions after traffic policy tuning.",
    ],
    workflows: [
      "Generate AQI heatmap",
      "Compare forecast bands",
      "Share environmental bulletin",
    ],
    assets: [
      { name: "AQI Sensor Cluster", detail: "Harbor district stable", status: "healthy" },
      { name: "PM2.5 Corridor West", detail: "Transient spike detected", status: "watch" },
      { name: "Weather Fusion Feed", detail: "Forecast synced", status: "stable" },
    ],
  },
  emergency: {
    key: "emergency",
    title: "Emergency Response",
    eyebrow: "Incident Coordination",
    summary:
      "Priority queues, dispatch management, hospital availability, responder tracking, severity scoring, routing, and incident playback for field command.",
    primaryMetricKey: "emergency",
    secondaryMetricKey: "traffic",
    tertiaryMetricKey: "infrastructure",
    quaternaryMetricKey: "reports",
    workspaceLabel: "Incident timelines, resource allocation, communications, and response corridors are continuously synchronized.",
    actionLabel: "Dispatch response plan",
    priorities: [
      "Secure ambulance priority routing for the harbor incident while traffic remains volatile.",
      "Confirm hospital intake availability before escalating resource allocation.",
      "Replay recent field unit movements to refine response timing.",
    ],
    insights: [
      "Response time is improving after the last signal-priority optimization.",
      "Police and fire coverage remain balanced across current incident clusters.",
      "Cross-domain dependencies are limited and no citywide escalation is required yet.",
    ],
    workflows: [
      "Acknowledge incident",
      "Allocate nearest unit",
      "Open communications center",
    ],
    assets: [
      { name: "Harbor Incident Queue", detail: "Severity high, contained", status: "watch" },
      { name: "Hospital Capacity Board", detail: "3 facilities ready", status: "healthy" },
      { name: "Responder Mesh", detail: "Tracked in real time", status: "stable" },
    ],
  },
  "city-brain": {
    key: "city-brain",
    title: "City Brain",
    eyebrow: "Multi-Agent Reasoning",
    summary:
      "Cross-domain intelligence, predictive analytics, root cause analysis, explainable AI, scenario simulation, and daily operational briefing from the flagship command center.",
    primaryMetricKey: "infrastructure",
    secondaryMetricKey: "traffic",
    tertiaryMetricKey: "water",
    quaternaryMetricKey: "emergency",
    workspaceLabel: "Reasoning agents, confidence scoring, scenario planning, and resource optimization are orchestrated into one decision support surface.",
    actionLabel: "Run what-if simulation",
    priorities: [
      "Model the impact of heavy rainfall arriving within the next 25 minutes.",
      "Coordinate drainage, emergency routing, and sanitation inspection into one workflow.",
      "Publish the next operational briefing with explainable action rationale.",
    ],
    insights: [
      "Current cross-domain posture supports staged interventions instead of full escalation.",
      "Traffic and emergency agents agree on corridor prioritization with 94% confidence.",
      "Water system variance is the highest uncertainty factor in the next decision window.",
    ],
    workflows: [
      "Generate AI briefing",
      "Explain anomaly chain",
      "Recommend autonomous workflow",
    ],
    assets: [
      { name: "Reasoning Graph", detail: "14 active inferencing chains", status: "healthy" },
      { name: "Rainfall Scenario Pack", detail: "Awaiting operator approval", status: "watch" },
      { name: "Decision Support Engine", detail: "Confidence scoring live", status: "stable" },
    ],
  },
  analytics: {
    key: "analytics",
    title: "Analytics",
    eyebrow: "City Performance",
    summary:
      "Interactive dashboards, date-based comparisons, forecasting accuracy, drill-down reporting, and export-ready operational intelligence.",
    primaryMetricKey: "reports",
    secondaryMetricKey: "traffic",
    tertiaryMetricKey: "energy",
    quaternaryMetricKey: "air",
    workspaceLabel: "Historical trends, department comparisons, export workflows, and executive rollups are centrally managed.",
    actionLabel: "Export dashboard pack",
    priorities: [
      "Compare traffic and emergency performance after the recent corridor policy change.",
      "Refresh forecasting confidence across utilities before the weekly leadership review.",
      "Validate drill-down reports for export and print readiness.",
    ],
    insights: [
      "Traffic forecasts remain the strongest-performing model family this week.",
      "Energy volatility is the primary candidate for deeper model tuning.",
      "Operational dashboards are ready for PDF, CSV, and Excel exports.",
    ],
    workflows: [
      "Print executive view",
      "Export PDF pack",
      "Schedule weekly comparison report",
    ],
    assets: [
      { name: "Forecast Model Board", detail: "96.4% average accuracy", status: "healthy" },
      { name: "Department Comparator", detail: "Prepared for briefing", status: "stable" },
      { name: "Export Pipeline", detail: "Last validation passed", status: "healthy" },
    ],
  },
  settings: {
    key: "settings",
    title: "Settings",
    eyebrow: "Platform Controls",
    summary:
      "Theme, notifications, language, units, alert thresholds, API configuration, map tuning, and operator workspace preferences.",
    primaryMetricKey: "infrastructure",
    secondaryMetricKey: "reports",
    tertiaryMetricKey: "traffic",
    quaternaryMetricKey: "energy",
    workspaceLabel: "Operator preferences, system thresholds, and platform controls are organized for quick governance.",
    actionLabel: "Save workspace policy",
    priorities: [
      "Review alert threshold tuning before the next simulated storm scenario.",
      "Confirm map overlay defaults for emergency and environmental teams.",
      "Validate operator notification rules against escalation workflows.",
    ],
    insights: [
      "Workspace preferences remain aligned to the operations-center baseline.",
      "Notification channels are ready for role-based personalization.",
      "Map and unit configuration can be updated without changing shell architecture.",
    ],
    workflows: [
      "Update map defaults",
      "Tune alert policy",
      "Review API configuration",
    ],
    assets: [
      { name: "Theme Profile", detail: "Dark and light modes enabled", status: "healthy" },
      { name: "Alert Ruleset", detail: "Threshold review pending", status: "watch" },
      { name: "Preference Sync", detail: "Operator workspace healthy", status: "stable" },
    ],
  },
  admin: {
    key: "admin",
    title: "Admin",
    eyebrow: "Governance Console",
    summary:
      "User and role management, permissions, audit visibility, sensor administration, API keys, backups, and security operations for enterprise governance.",
    primaryMetricKey: "infrastructure",
    secondaryMetricKey: "reports",
    tertiaryMetricKey: "emergency",
    quaternaryMetricKey: "air",
    workspaceLabel: "Identity, device governance, audit logs, and security monitoring are managed from one enterprise console.",
    actionLabel: "Review audit trail",
    priorities: [
      "Verify role assignments before onboarding the next operations cohort.",
      "Inspect sensor heartbeat exceptions to confirm maintenance scheduling.",
      "Review API key rotation readiness and security log anomalies.",
    ],
    insights: [
      "Governance workflows are prepared for persistent identity rollout.",
      "Device monitoring remains healthy with only minor heartbeat variance.",
      "Security posture is stable, with no unresolved audit escalations.",
    ],
    workflows: [
      "Open user management",
      "Rotate API key",
      "Validate backup policy",
    ],
    assets: [
      { name: "Role Matrix", detail: "8 enterprise roles tracked", status: "healthy" },
      { name: "Sensor Registry", detail: "2 devices need review", status: "watch" },
      { name: "Audit Ledger", detail: "No critical exceptions", status: "stable" },
    ],
  },
  profile: {
    key: "profile",
    title: "User Profile",
    eyebrow: "Operator Context",
    summary:
      "Session identity, workspace customization, access scope, notification preferences, and operational accountability for the active user.",
    primaryMetricKey: "reports",
    secondaryMetricKey: "infrastructure",
    tertiaryMetricKey: "traffic",
    quaternaryMetricKey: "air",
    workspaceLabel: "Role-aware preferences, recent workflows, and secure operator context are surfaced in one personal workspace.",
    actionLabel: "Update operator profile",
    priorities: [
      "Review personal alert routing before the evening shift transition.",
      "Confirm role access for analytics and emergency coordination workspaces.",
      "Refresh the executive briefing subscription preferences.",
    ],
    insights: [
      "RBAC remains active for the current session with secure mode enforced.",
      "Profile configuration is ready for deeper live-auth integration.",
      "Notification and theme preferences can be adjusted without leaving the app shell.",
    ],
    workflows: [
      "Manage session security",
      "Update preferences",
      "Export personal activity log",
    ],
    assets: [
      { name: "Operator Session", detail: "Secure mode enabled", status: "healthy" },
      { name: "Preference Center", detail: "Theme and alerts synchronized", status: "stable" },
      { name: "Access Scope", detail: "Role review available", status: "healthy" },
    ],
  },
};
