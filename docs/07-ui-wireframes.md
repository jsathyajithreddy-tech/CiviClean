# UI Wireframes

## Design Direction

- Dark, operations-center visual language
- Cyan and teal accent system with danger red and warning amber
- Dense but readable data presentation
- Left navigation, top utility bar, and domain-focused workspace
- Map-first dashboard consistent with the supplied reference image

## Global Layout

```text
+--------------------------------------------------------------------------------------------------+
| Top Bar: Search | Notifications | Agent Status | Theme | User Menu                               |
+----------------------+---------------------------------------------------------------------------+
| Sidebar              | Main Content                                                              |
| - Dashboard          |                                                                           |
| - Traffic            | Page Header | Filters | Live Status                                       |
| - Waste              |                                                                           |
| - Water              | Page-specific cards, maps, charts, tables, and activity panels           |
| - Energy             |                                                                           |
| - Air Quality        |                                                                           |
| - Emergency          |                                                                           |
| - City Brain         |                                                                           |
| - Analytics          |                                                                           |
| - Settings           |                                                                           |
| - Admin              |                                                                           |
| - Profile            |                                                                           |
+----------------------+---------------------------------------------------------------------------+
```

## Dashboard

```text
+--------------------------------------------------------------------------------------------------+
| Dashboard Header                                         | City / Shift / Scenario Selector     |
+--------------------------------------------------------------------------------------------------+
| Alert Count | Traffic Flow | AQI | Energy Load | Water Pressure | Active Emergencies              |
+--------------------------------------------------------------------------------------------------+
| City Map with heat layers and markers                     | Real-Time Agent Activity Feed        |
| - Traffic hotspots                                        | - agent events                       |
| - AQI markers                                             | - alerts                             |
| - Bins / pipelines / vehicles / signals                   | - coordination messages              |
+-----------------------------------------------------------+--------------------------------------+
| Energy & Multi-domain Trend Chart | Resource Allocation   | Alerts by Category                   |
+--------------------------------------------------------------------------------------------------+
```

## Traffic Page

```text
+--------------------------------------------------------------------------------------------------+
| Traffic Overview | Live Congestion Score | Open Incidents | Average Speed | Signal Health         |
+--------------------------------------------------------------------------------------------------+
| Interactive traffic map                                  | Congestion forecast panel            |
+----------------------------------------------------------+---------------------------------------+
| Incident table                                           | Route optimization recommendations   |
+--------------------------------------------------------------------------------------------------+
```

## Waste Page

```text
+--------------------------------------------------------------------------------------------------+
| Waste KPIs | Overflow Risk | Route Efficiency | Fleet Availability                              |
+--------------------------------------------------------------------------------------------------+
| Smart bin map                                                | Overflow prediction leaderboard     |
+---------------------------------------------------------------+-------------------------------------+
| Collection schedule table                                     | Sanitation recommendations          |
+--------------------------------------------------------------------------------------------------+
```

## Water Page

```text
+--------------------------------------------------------------------------------------------------+
| Water KPIs | Pressure | Reservoir Levels | Leak Alerts | Supply Risk                               |
+--------------------------------------------------------------------------------------------------+
| Pipeline and valve map                                         | Leak anomaly timeline               |
+---------------------------------------------------------------+-------------------------------------+
| Reservoir and pressure charts                                  | Water agent recommendations         |
+--------------------------------------------------------------------------------------------------+
```

## Energy Page

```text
+--------------------------------------------------------------------------------------------------+
| Grid KPIs | Current Load | Peak Forecast | Outages | Grid Stability                                  |
+--------------------------------------------------------------------------------------------------+
| Grid zone map                                                  | Overload forecast                   |
+---------------------------------------------------------------+-------------------------------------+
| Consumption and generation charts                              | Preventive action recommendations   |
+--------------------------------------------------------------------------------------------------+
```

## Air Quality Page

```text
+--------------------------------------------------------------------------------------------------+
| AQI KPIs | Hotspots | Health Risk Window | Weather Impact                                         |
+--------------------------------------------------------------------------------------------------+
| AQI heatmap                                                     | Pollution forecast panel           |
+---------------------------------------------------------------+-------------------------------------+
| Trend charts                                                    | Public advisory recommendations    |
+--------------------------------------------------------------------------------------------------+
```

## Emergency Page

```text
+--------------------------------------------------------------------------------------------------+
| Emergency KPIs | Active Incidents | Avg Response Time | Available Units                               |
+--------------------------------------------------------------------------------------------------+
| Live incident map                                               | Response corridor panel            |
+---------------------------------------------------------------+-------------------------------------+
| Incident queue                                                   | Dispatch recommendations           |
+--------------------------------------------------------------------------------------------------+
```

## City Brain Page

```text
+--------------------------------------------------------------------------------------------------+
| Coordinator Status | Active Scenario | Decision Queue | Confidence | Policy Mode                          |
+--------------------------------------------------------------------------------------------------+
| Cross-domain summary                                             | Decision explanation panel         |
+---------------------------------------------------------------+-------------------------------------+
| Agent contribution matrix                                        | Recommended action plan            |
+---------------------------------------------------------------+-------------------------------------+
| Decision history timeline                                        | Approval / reject / escalate       |
+--------------------------------------------------------------------------------------------------+
```

## Analytics Page

```text
+--------------------------------------------------------------------------------------------------+
| Filters: Date Range | Domain | Zone | Scenario | Export                                            |
+--------------------------------------------------------------------------------------------------+
| Trend charts | Heatmaps | SLA metrics | Agent performance | Forecast accuracy                            |
+--------------------------------------------------------------------------------------------------+
```

## Admin Page

```text
+--------------------------------------------------------------------------------------------------+
| Tabs: Users | Agents | Datasets | API Keys | Audit Logs | Settings                                    |
+--------------------------------------------------------------------------------------------------+
| Admin workspace with searchable tables, detail drawers, and action modals                         |
+--------------------------------------------------------------------------------------------------+
```

## Mobile Adaptation

- Sidebar collapses to bottom sheet navigation.
- KPI cards become horizontally scrollable.
- Map and live feed stack vertically.
- City Brain decision actions remain pinned for fast approval workflows.
