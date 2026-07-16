from datetime import UTC, datetime, timedelta

from src.domain.entities.operations import (
    AgentDecision,
    AgentRecommendation,
    AgentResourceUsage,
    AuditLogEntry,
    CityBrainBriefing,
    CommandExecutionResult,
    CopilotChart,
    CopilotChartPoint,
    CopilotResponse,
    CopilotSource,
    DigitalTwinOverview,
    DigitalTwinScenario,
    DomainAgent,
    IncidentNote,
    IncidentRecord,
    IncidentResolutionEntry,
    IncidentTimelineEntry,
    MissionTimelineEntry,
    OperationalKpi,
    ReportDefinition,
    SensorRecord,
    TwinLayer,
)
from src.domain.repositories.operations_repository import OperationsRepository


class InMemoryOperationsRepository(OperationsRepository):
    def __init__(self) -> None:
        self._agents = self._build_agents()
        self._incidents = self._build_incidents()
        self._sensors = self._build_sensors()
        self._reports = self._build_reports()
        self._timeline = self._build_timeline()
        self._audit_logs = self._build_audit_logs()

    async def list_agents(self) -> list[DomainAgent]:
        return list(self._agents)

    async def get_city_brain_briefing(self) -> CityBrainBriefing:
        now = datetime.now(UTC)
        return CityBrainBriefing(
            generated_at=now,
            headline="Heavy rainfall predicted in 18 minutes with correlated mobility and drainage stress.",
            executive_summary=(
                "City Brain has correlated projected rainfall, harbor corridor congestion, drainage overload "
                "risk, transformer reserve demand, and emergency response timing into a single staged action plan."
            ),
            risk_score=78,
            confidence_score=0.94,
            predicted_window_minutes=18,
            correlated_domains=["traffic", "water", "energy", "emergency", "waste", "weather"],
            recommendations=[
                "Increase drainage capacity in Sector 4 and pre-position pumps.",
                "Protect the harbor emergency corridor before freight spillover expands.",
                "Notify waste operations to inspect storm drains and adjacent overflow bins.",
                "Hold energy reserve capacity for hospitals, pumps, and emergency facilities.",
            ],
            reasoning=[
                "Weather Agent forecasted rainfall arrival in 18 minutes with a 92% confidence band.",
                "Traffic Agent predicts a 16% downtown speed reduction if corridor protection is delayed.",
                "Water Agent predicts localized overload in Sector 4 storm drains under current conditions.",
                "Emergency Agent projects response time breach if ambulances are not staged early.",
            ],
            autonomous_workflows=[
                "drainage_resilience_sector_4",
                "harbor_corridor_priority_lock",
                "pre_storm_sanitation_inspection",
                "critical_facility_energy_reserve",
            ],
        )

    async def get_digital_twin_overview(self) -> DigitalTwinOverview:
        now = datetime.now(UTC)
        return DigitalTwinOverview(
            generated_at=now,
            city_name="Neo Metro",
            layers=[
                TwinLayer("roads", "Road Network", 582, "active", "Traffic speed, closures, and signal timings"),
                TwinLayer("buildings", "Buildings", 1240, "active", "Occupancy proxies and critical facilities"),
                TwinLayer("power", "Power Grid", 118, "watch", "Transformer temperature and reserve state"),
                TwinLayer("water", "Water Pipelines", 214, "watch", "Pressure, flow, and valve telemetry"),
                TwinLayer("iot", "IoT Devices", 2842, "active", "Heartbeat, battery, and firmware status"),
                TwinLayer("waste", "Waste Bins", 1284, "active", "Fill percentage and route coverage"),
                TwinLayer("emergency", "Emergency Assets", 96, "active", "Units, hospitals, and response corridors"),
            ],
            active_failures=[
                "Sector 4 drainage subsystem in watch state.",
                "Transformer T-18 thermal reserve below preferred threshold.",
            ],
            simulations=[
                DigitalTwinScenario(
                    name="Rainfall Surge Scenario",
                    time_horizon_minutes=30,
                    impact="Localized flooding and travel slowdown without staged intervention.",
                    confidence_score=0.91,
                    suggested_actions=["Activate pumps and drainage crews.", "Protect emergency corridor before onset."],
                ),
                DigitalTwinScenario(
                    name="Evening Peak Energy Scenario",
                    time_horizon_minutes=90,
                    impact="Commercial demand spike intersects with storm-response equipment load.",
                    confidence_score=0.87,
                    suggested_actions=["Reserve battery dispatch for critical facilities.", "Shift non-essential municipal demand."],
                ),
            ],
            historical_replay_available=True,
        )

    async def list_incidents(self) -> list[IncidentRecord]:
        return list(self._incidents)

    async def list_sensors(self) -> list[SensorRecord]:
        return list(self._sensors)

    async def list_reports(self) -> list[ReportDefinition]:
        return list(self._reports)

    async def ask_copilot(self, question: str) -> CopilotResponse:
        now = datetime.now(UTC)
        lowered = question.lower()
        chart = None
        if "water" in lowered:
            answer = (
                "Two water-related issues are active: the Sector 4 drainage overload watch and a localized feeder-branch pressure anomaly. "
                "No confirmed rupture is active, but inspection and pump staging are recommended."
            )
            markdown_answer = (
                "## Water status\n"
                "- **Primary incident:** Sector 4 drainage overload watch\n"
                "- **Current posture:** inspection staged, pumps pre-positioned\n"
                "- **Decision:** act before rainfall onset to avoid road flooding\n"
            )
            cited_domains = ["water", "waste", "city-brain"]
            suggested_actions = [
                "Open the Sector 4 incident timeline.",
                "Dispatch leak inspection crew.",
                "Generate a water resilience PDF briefing.",
            ]
            suggested_prompts = [
                "Compare water demand today with yesterday.",
                "Show all critical incidents affecting utilities.",
                "Explain the drainage risk model.",
            ]
            reasoning = [
                "Pressure variance and rainfall probability align in the same drainage basin.",
                "No rupture signature is visible, so pre-emptive inspection is lower risk than shutdown.",
            ]
            sources = [
                CopilotSource("Sector 4 Pressure Node", "sensor", "24 seconds ago", 0.91),
                CopilotSource("Drainage overload incident", "incident", "4 minutes ago", 0.89),
            ]
        elif "traffic" in lowered or "congestion" in lowered:
            answer = (
                "Traffic is increasing because freight inflow, commuter traffic, and weather-related caution behavior "
                "are overlapping around Harbor Loop and the civic core."
            )
            markdown_answer = (
                "## Traffic increase drivers\n"
                "1. Freight inflow is peaking on Harbor Loop.\n"
                "2. Rainfall risk is reducing average travel speed.\n"
                "3. Emergency-lane protection narrows general traffic capacity.\n"
            )
            cited_domains = ["traffic", "weather", "emergency"]
            suggested_actions = [
                "Launch traffic forecast export.",
                "Reserve emergency corridor.",
                "Run downtown what-if simulation.",
            ]
            suggested_prompts = [
                "Predict congestion in the next hour.",
                "Compare today with yesterday.",
                "Dispatch emergency resources.",
            ]
            reasoning = [
                "Three models agree on a 12-16% throughput dip during the next hour.",
                "Weather onset increases braking behavior and compresses intersection discharge rates.",
            ]
            sources = [
                CopilotSource("Traffic Agent forecast", "agent", "1 minute ago", 0.93),
                CopilotSource("Harbor camera cluster NC-4", "sensor", "18 seconds ago", 0.9),
            ]
            chart = CopilotChart(
                title="Predicted corridor congestion",
                unit="%",
                points=[
                    CopilotChartPoint("15m", 68, 63, 72),
                    CopilotChartPoint("30m", 74, 69, 78),
                    CopilotChartPoint("60m", 79, 73, 84),
                ],
            )
        elif "critical incident" in lowered:
            critical_incidents = [incident.title for incident in self._incidents if incident.priority.lower() == "critical"]
            answer = f"There are {len(critical_incidents)} critical incidents active: {', '.join(critical_incidents)}."
            markdown_answer = "## Critical incidents\n" + "\n".join(f"- {item}" for item in critical_incidents)
            cited_domains = ["emergency", "city-brain"]
            suggested_actions = ["Open Harbor incident", "Escalate incident bridge", "Generate incident report"]
            suggested_prompts = [
                "Explain AI decisions.",
                "Dispatch emergency resources.",
                "Summarize city status.",
            ]
            reasoning = ["Critical incidents are ranked by response-time risk and service impact."]
            sources = [CopilotSource("Incident board", "incident", "2 minutes ago", 0.95)]
        elif "dispatch emergency" in lowered:
            result = await self.execute_command("INC-240710-001", "Dispatch emergency resources")
            answer = result.outcome
            markdown_answer = f"## Dispatch result\n- **Status:** {result.status}\n- **Outcome:** {result.outcome}"
            cited_domains = ["emergency", "traffic", "city-brain"]
            suggested_actions = ["Open incident commander board", "Protect emergency corridor", "Notify hospitals"]
            suggested_prompts = [
                "Show all critical incidents.",
                "Explain the dispatch decision.",
                "Compare response time with yesterday.",
            ]
            reasoning = ["Dispatch was triggered because route degradation was approaching the emergency threshold."]
            sources = [CopilotSource("Emergency Agent", "agent", "just now", 0.95)]
        else:
            answer = (
                "City Brain recommends a staged response: protect the harbor emergency corridor, pre-stage drainage crews in Sector 4, "
                "reserve energy capacity for critical facilities, and issue an executive readiness briefing."
            )
            markdown_answer = (
                "## City status summary\n"
                "- **Traffic:** Harbor Loop is under rising pressure.\n"
                "- **Water:** Sector 4 drainage remains on watch.\n"
                "- **Energy:** Reserve capacity is stable.\n"
                "- **Emergency:** Response posture is elevated but contained.\n"
            )
            cited_domains = ["city-brain", "traffic", "water", "energy", "emergency"]
            suggested_actions = [
                "Generate executive summary.",
                "Acknowledge correlated incident.",
                "Run rainfall surge simulation.",
            ]
            suggested_prompts = [
                "Why is traffic increasing?",
                "Show all critical incidents.",
                "Predict congestion in the next hour.",
            ]
            reasoning = ["Correlated domain models agree on a localized but high-confidence intervention package."]
            sources = [
                CopilotSource("City Brain Orchestrator", "agent", "1 minute ago", 0.94),
                CopilotSource("Operational dashboard stream", "telemetry", "5 seconds ago", 0.9),
            ]

        return CopilotResponse(
            question=question,
            answer=answer,
            markdown_answer=markdown_answer,
            confidence_score=0.92,
            cited_domains=cited_domains,
            suggested_actions=suggested_actions,
            suggested_prompts=suggested_prompts,
            reasoning=reasoning,
            sources=sources,
            chart=chart,
            generated_at=now,
        )

    async def list_timeline(self) -> list[MissionTimelineEntry]:
        return list(self._timeline)

    async def list_audit_logs(self) -> list[AuditLogEntry]:
        return list(self._audit_logs)

    async def get_operational_kpis(self) -> list[OperationalKpi]:
        return [
            OperationalKpi("response_time", "Emergency Response Time", "7m 12s", "-14%", "improving"),
            OperationalKpi("flood_risk", "Flood Probability", "28%", "-14 pts", "watch"),
            OperationalKpi("traffic_risk", "Congestion Risk", "79%", "+11 pts", "critical"),
            OperationalKpi("cost_avoidance", "Preventive Cost Avoidance", "$142k", "+14%", "healthy"),
        ]

    async def execute_command(self, incident_id: str, command: str) -> CommandExecutionResult:
        now = datetime.now(UTC)
        incident = next((item for item in self._incidents if item.id == incident_id), None)
        outcome = f"{command} executed at citywide command-center scope."

        if incident is not None:
            if "assign" in command.lower():
                incident = self._update_incident(
                    incident,
                    status="Assigned",
                    assigned_department="Integrated Operations",
                    assigned_officer="Field Commander Neha Kapoor",
                    timeline_entry=IncidentTimelineEntry(now, "Incident assigned", "Field commander assignment confirmed through command center.", "assigned"),
                    comment=IncidentNote("Command Center", "Assignment confirmed and field coordination initiated.", now),
                )
                outcome = f"{incident.id} assigned to Field Commander Neha Kapoor."
            elif "escalate" in command.lower():
                incident = self._update_incident(
                    incident,
                    status="Escalated",
                    priority="Critical",
                    timeline_entry=IncidentTimelineEntry(now, "Incident escalated", "Escalated to executive command bridge.", "escalated"),
                )
                outcome = f"{incident.id} escalated to the executive command bridge."
            elif "close" in command.lower() or "resolve" in command.lower():
                incident = self._update_incident(
                    incident,
                    status="Resolved",
                    timeline_entry=IncidentTimelineEntry(now, "Incident resolved", "Command center marked the incident resolved.", "resolved"),
                    resolution_entry=IncidentResolutionEntry(now, "Incident closed by command center workflow.", "Service continuity restored and monitoring retained."),
                )
                outcome = f"{incident.id} has been resolved and moved to after-action review."
            elif "transfer" in command.lower():
                incident = self._update_incident(
                    incident,
                    assigned_department="City Resilience Office",
                    assigned_officer="Ritika Sharma",
                    timeline_entry=IncidentTimelineEntry(now, "Incident transferred", "Operational ownership transferred to City Resilience Office.", "transferred"),
                )
                outcome = f"{incident.id} transferred to the City Resilience Office."
            elif "report" in command.lower():
                outcome = f"Incident report for {incident.id} generated in PDF, CSV, and Excel formats."
            elif "dispatch" in command.lower():
                incident = self._update_incident(
                    incident,
                    status="Dispatching",
                    eta_minutes=max(3, incident.eta_minutes - 2),
                    timeline_entry=IncidentTimelineEntry(now, "Resources dispatched", "Nearest available response resources dispatched from command center.", "dispatching"),
                )
                outcome = f"Emergency resources dispatched for {incident.id}; ETA improved to {incident.eta_minutes} minutes."

        result = CommandExecutionResult(
            command=command,
            incident_id=incident_id,
            status="completed",
            outcome=outcome,
            updated_at=now,
        )
        self._timeline.insert(
            0,
            MissionTimelineEntry(
                id=f"timeline-{len(self._timeline) + 1}",
                timestamp=now,
                agent="Command Center",
                title=command,
                detail=outcome,
                status="completed",
            ),
        )
        self._audit_logs.insert(
            0,
            AuditLogEntry(
                id=f"audit-{len(self._audit_logs) + 1}",
                timestamp=now,
                agent="Command Center",
                decision=command,
                reason="Operator-confirmed command execution.",
                outcome=outcome,
                operator="Maya Chen",
                status="completed",
            ),
        )
        return result

    def _build_agents(self) -> list[DomainAgent]:
        now = datetime.now(UTC)
        return [
            self._agent(
                name="Traffic Agent",
                domain="traffic",
                status="watch",
                objective="Protect Harbor Loop throughput while preserving emergency access.",
                anomaly="Harbor freight inflow is likely to reduce downtown travel speed by 16%.",
                severity="high",
                confidence=0.93,
                recent_events=[
                    "Camera cluster NC-4 recovered from packet loss.",
                    "Emergency corridor priority signals activated on Harbor Loop.",
                ],
                dependencies=["Emergency Agent", "Weather Agent", "City Brain Orchestrator"],
                reasoning=[
                    "Inbound freight and commuter volume overlap during the same 20-minute window.",
                    "Signal priority can recover most of the lost travel time before it becomes systemic.",
                ],
                completed_tasks=["Validated NC-4 camera telemetry recovery.", "Applied harbor corridor signal-priority baseline."],
                running_tasks=["Forecasting eastbound spillover for the next 60 minutes.", "Evaluating lane closure side effects on ambulance ETA."],
                resource_usage=AgentResourceUsage(61, 48, 3, 18400),
                last_decision=AgentDecision("Preserve Harbor Loop emergency bandwidth before enforcing broader diversions.", "Projected ambulance delay reduced by 4 minutes.", now - timedelta(minutes=3)),
                recommendation=AgentRecommendation(
                    summary="Reserve the harbor corridor and rebalance adaptive signal timing.",
                    confidence_score=0.93,
                    rationale="Traffic density and rainfall risk are rising at the same time.",
                    suggested_action="Dispatch corridor optimization workflow.",
                ),
            ),
            self._agent(
                name="Water Agent",
                domain="water",
                status="watch",
                objective="Contain Sector 4 drainage overload risk before rainfall onset.",
                anomaly="Drainage load in Sector 4 is forecast to exceed safe operating band.",
                severity="high",
                confidence=0.91,
                recent_events=["Pressure deviation remained localized to the feeder branch.", "Storm drain inspection request has been staged."],
                dependencies=["Weather Agent", "Waste Agent", "City Brain Orchestrator"],
                reasoning=[
                    "Drain telemetry and rainfall probability are aligned in the same basin.",
                    "Storm-drain obstruction increases the chance of localized road flooding.",
                ],
                completed_tasks=["Validated pressure-node stability outside the feeder branch."],
                running_tasks=["Staging pump crew route plan.", "Scanning downstream blockage patterns."],
                resource_usage=AgentResourceUsage(54, 43, 2, 13620),
                last_decision=AgentDecision("Trigger pre-rain inspection instead of waiting for threshold breach.", "Flood probability reduced from 42% to 28% in simulation.", now - timedelta(minutes=4)),
                recommendation=AgentRecommendation(
                    summary="Pre-stage pump crews and clear storm drains before rainfall onset.",
                    confidence_score=0.91,
                    rationale="Rainfall and current hydraulic variance create a narrow response window.",
                    suggested_action="Launch drainage resilience playbook.",
                ),
            ),
            self._agent(
                name="Energy Agent",
                domain="energy",
                status="healthy",
                objective="Reserve critical power support for hospitals and flood-response assets.",
                anomaly="Transformer stress remains manageable but may increase if flood pumps activate.",
                severity="medium",
                confidence=0.88,
                recent_events=["Battery reserve dispatch plan validated for emergency facilities.", "Commercial demand-response groups are standing by for peak support."],
                dependencies=["Water Agent", "Emergency Agent", "City Brain Orchestrator"],
                reasoning=["Flood-response loads overlap with the commercial ramp window.", "Battery reserve can absorb the first stage if dispatched early."],
                completed_tasks=["Validated reserve state for two critical facilities."],
                running_tasks=["Monitoring transformer T-18 thermal margin."],
                resource_usage=AgentResourceUsage(39, 35, 1, 9450),
                last_decision=AgentDecision("Keep reserve power pinned to critical facilities.", "Avoided non-essential dispatch that would cut resilience buffer.", now - timedelta(minutes=6)),
                recommendation=AgentRecommendation(
                    summary="Hold reserve capacity for flood-response equipment and hospitals.",
                    confidence_score=0.88,
                    rationale="Projected pump demand overlaps with the evening commercial ramp.",
                    suggested_action="Prepare transformer support workflow.",
                ),
            ),
            self._agent(
                name="Waste Agent",
                domain="waste",
                status="watch",
                objective="Reduce overflow amplification around storm-drain-adjacent routes.",
                anomaly="Overflow probability is rising near the civic core ahead of weather impact.",
                severity="medium",
                confidence=0.86,
                recent_events=["Route WT-11 was rerouted around a congestion hotspot.", "Illegal dumping alert cluster was cleared after field verification."],
                dependencies=["Water Agent", "Citizen Agent", "City Brain Orchestrator"],
                reasoning=["Bin overflow near drains increases runoff obstruction risk.", "A pre-storm surge route is cheaper than post-event cleanup deployment."],
                completed_tasks=["Rerouted WT-11 around a congestion hotspot."],
                running_tasks=["Optimizing surge collection route for downtown bins."],
                resource_usage=AgentResourceUsage(42, 31, 2, 8130),
                last_decision=AgentDecision("Advance a sanitation surge route before heavy rainfall.", "Projected overflow complaints reduced by 19%.", now - timedelta(minutes=5)),
                recommendation=AgentRecommendation(
                    summary="Inspect drain-adjacent bins and increase pre-rain collection density.",
                    confidence_score=0.86,
                    rationale="Waste overflow would amplify flood risk and citizen complaints.",
                    suggested_action="Deploy sanitation surge route.",
                ),
            ),
            self._agent(
                name="Emergency Agent",
                domain="emergency",
                status="critical",
                objective="Hold sub-8-minute emergency response for Harbor Loop.",
                anomaly="Harbor response time could slip below target if congestion and rainfall overlap.",
                severity="critical",
                confidence=0.95,
                recent_events=["Ambulance AMB-7 pre-positioned near Harbor Loop.", "Hospital intake board shows three available facilities."],
                dependencies=["Traffic Agent", "Energy Agent", "City Brain Orchestrator"],
                reasoning=["Current route variance is already outside the preferred safety margin.", "Pre-positioning is more reliable than reactive dispatch under weather uncertainty."],
                completed_tasks=["Staged AMB-7 near Harbor Loop.", "Validated hospital intake capacity."],
                running_tasks=["Monitoring route degradation thresholds.", "Reprioritizing standby units."],
                resource_usage=AgentResourceUsage(74, 58, 4, 20110),
                last_decision=AgentDecision("Pre-position ambulance coverage before rainfall overlap.", "Worst-case medical access ETA reduced by 5 minutes.", now - timedelta(minutes=2)),
                recommendation=AgentRecommendation(
                    summary="Pre-position ambulances and protect the emergency lane immediately.",
                    confidence_score=0.95,
                    rationale="Current travel-time variance reduces the safe dispatch margin.",
                    suggested_action="Authorize emergency corridor lockdown.",
                ),
            ),
            self._agent(
                name="Citizen Agent",
                domain="citizen-services",
                status="watch",
                objective="Cluster citizen complaints into field-ready operational actions.",
                anomaly="Citizen complaint density is rising around transit-adjacent waste and parking hotspots.",
                severity="medium",
                confidence=0.84,
                recent_events=["Triage model linked 14 complaints to two active field incidents.", "Priority outreach script prepared for civic core disruption window."],
                dependencies=["Waste Agent", "Traffic Agent"],
                reasoning=["Complaint spikes line up with mobility friction and sanitation overflow signals.", "Closing the loop early reduces duplicate escalations to the command floor."],
                completed_tasks=["Classified 92 inbound complaints by service line."],
                running_tasks=["Preparing localized public advisory."],
                resource_usage=AgentResourceUsage(33, 28, 2, 7210),
                last_decision=AgentDecision("Bundle complaints into the same response package as field operations.", "Reduced duplicate dispatch requests by 11%.", now - timedelta(minutes=7)),
                recommendation=AgentRecommendation(
                    summary="Issue targeted citizen advisory near Harbor Loop and Sector 4.",
                    confidence_score=0.84,
                    rationale="Clear early communication limits repeat escalations and route conflicts.",
                    suggested_action="Broadcast localized service advisory.",
                ),
            ),
            self._agent(
                name="Weather Agent",
                domain="weather",
                status="active",
                objective="Monitor rainfall onset and downscale local storm-cell impact.",
                anomaly="Storm-cell arrival confidence remains high for the harbor-adjacent basin.",
                severity="high",
                confidence=0.92,
                recent_events=["Radar blend updated with local station telemetry."],
                dependencies=["Water Agent", "Traffic Agent", "City Brain Orchestrator"],
                reasoning=["Radar and station telemetry agree on arrival time within a narrow confidence band.", "Localized basin effects create asymmetric impact across the city grid."],
                completed_tasks=["Updated 60-minute rainfall envelope."],
                running_tasks=["Recomputing flood-watch polygons."],
                resource_usage=AgentResourceUsage(46, 37, 2, 10110),
                last_decision=AgentDecision("Escalate rainfall arrival to correlated-domain models immediately.", "Cross-domain simulation window advanced by 12 minutes.", now - timedelta(minutes=3)),
                recommendation=AgentRecommendation(
                    summary="Trigger pre-rain response package before the next 15-minute update.",
                    confidence_score=0.92,
                    rationale="Weather certainty is high enough to act before first impact.",
                    suggested_action="Launch rainfall surge simulation.",
                ),
            ),
            self._agent(
                name="Infrastructure Agent",
                domain="infrastructure",
                status="watch",
                objective="Protect critical city assets across drainage, power, and road corridors.",
                anomaly="Infrastructure stress is concentrated around T-18 and Sector 4 drainage interfaces.",
                severity="medium",
                confidence=0.87,
                recent_events=["Bridge sensor health verified.", "Drainage asset inspection order staged."],
                dependencies=["Water Agent", "Energy Agent"],
                reasoning=["Two assets are near threshold but can be stabilized with early intervention.", "Infrastructure risk rises quickly if both water and energy pressures coincide."],
                completed_tasks=["Verified bridge and substation sensor heartbeats."],
                running_tasks=["Preparing preventive maintenance packet."],
                resource_usage=AgentResourceUsage(37, 29, 1, 6420),
                last_decision=AgentDecision("Escalate preventive inspection for combined utility stress points.", "Avoided deferred maintenance during a high-risk weather window.", now - timedelta(minutes=8)),
                recommendation=AgentRecommendation(
                    summary="Dispatch preventive inspection team to Sector 4 and T-18.",
                    confidence_score=0.87,
                    rationale="A small early intervention prevents multi-domain degradation.",
                    suggested_action="Create preventive maintenance work order.",
                ),
            ),
            self._agent(
                name="Finance Agent",
                domain="finance",
                status="active",
                objective="Optimize operational spend during weather-related readiness actions.",
                anomaly="The current staged response remains cheaper than post-event recovery escalation.",
                severity="low",
                confidence=0.82,
                recent_events=["Scenario cost model refreshed with staffing and fuel updates."],
                dependencies=["Emergency Agent", "Waste Agent", "City Brain Orchestrator"],
                reasoning=["Pre-positioning costs are materially lower than surge recovery response.", "Fuel and overtime exposure remain within approved resilience envelope."],
                completed_tasks=["Repriced surge route and standby unit costs."],
                running_tasks=["Calculating rainfall scenario recovery curve."],
                resource_usage=AgentResourceUsage(24, 21, 1, 5130),
                last_decision=AgentDecision("Recommend staged readiness over delayed surge recovery.", "Projected cost avoidance of 14% for the event window.", now - timedelta(minutes=9)),
                recommendation=AgentRecommendation(
                    summary="Approve early response package to minimize overtime and recovery cost.",
                    confidence_score=0.82,
                    rationale="The financial model favors prevention over reactive field scaling.",
                    suggested_action="Publish cost-aware readiness summary.",
                ),
            ),
            self._agent(
                name="City Brain Orchestrator",
                domain="cross-domain",
                status="active",
                objective="Coordinate the citywide readiness package across ten specialized agents.",
                anomaly="Multi-domain weather event requires coordinated action across mobility, utilities, and emergency response.",
                severity="high",
                confidence=0.94,
                recent_events=["Cross-domain reasoning graph linked rainfall, congestion, and pump demand.", "Autonomous workflow recommendation package generated for operator review."],
                dependencies=["Traffic Agent", "Water Agent", "Energy Agent", "Emergency Agent", "Citizen Agent", "Weather Agent", "Infrastructure Agent", "Finance Agent"],
                reasoning=["Localized risk is rising across four core domains with high model agreement.", "A staged intervention protects service continuity without triggering citywide escalation."],
                completed_tasks=["Generated cross-domain briefing package.", "Ranked autonomous workflows by operational impact and reversibility."],
                running_tasks=["Monitoring approval status for readiness workflows.", "Synthesizing next-hour congestion and flood forecast deltas."],
                resource_usage=AgentResourceUsage(68, 64, 6, 28400),
                last_decision=AgentDecision("Recommend staged intervention instead of full escalation.", "Preserves citywide reserve capacity while containing localized risk.", now - timedelta(minutes=1)),
                recommendation=AgentRecommendation(
                    summary="Approve staged intervention rather than full citywide escalation.",
                    confidence_score=0.94,
                    rationale="Critical risk is localized but highly correlated across four domains.",
                    suggested_action="Publish coordinated response briefing.",
                ),
            ),
        ]

    def _build_incidents(self) -> list[IncidentRecord]:
        now = datetime.now(UTC)
        return [
            IncidentRecord(
                id="INC-240710-001",
                title="Harbor Corridor Congestion and Medical Access Risk",
                domain="emergency",
                category="Mobility Access",
                status="Investigating",
                priority="Critical",
                assigned_department="Emergency Command",
                assigned_officer="Asha Rao",
                owner="Emergency Commander Asha Rao",
                location="Harbor Transit Loop",
                live_location="13.0485, 80.2821",
                opened_at=now - timedelta(minutes=32),
                updated_at=now - timedelta(minutes=2),
                timeline=[
                    IncidentTimelineEntry(now - timedelta(minutes=32), "Correlated alert generated", "Traffic and emergency models detected medical access risk.", "new"),
                    IncidentTimelineEntry(now - timedelta(minutes=19), "Corridor reservation proposed", "Traffic Agent recommended emergency lane protection.", "in_progress"),
                    IncidentTimelineEntry(now - timedelta(minutes=8), "Ambulance staged", "AMB-7 was moved to Harbor Loop pre-position.", "in_progress"),
                ],
                comments=[
                    IncidentNote("Hospital Liaison", "Hospital intake remains available in three facilities.", now - timedelta(minutes=9)),
                    IncidentNote("Field Supervisor", "Eastbound lane closure validation requested.", now - timedelta(minutes=4)),
                ],
                notifications=["Emergency and traffic operations notified.", "Mayor briefing queue updated."],
                severity="critical",
                eta_minutes=7,
                assigned_agents=["Emergency Agent", "Traffic Agent", "City Brain Orchestrator"],
                affected_services=["Emergency Access", "Traffic Flow", "Public Transit"],
                images=["Harbor-Cam-12", "AMB-7 Route Replay"],
                resolution_history=[],
            ),
            IncidentRecord(
                id="INC-240710-002",
                title="Sector 4 Drainage Overload Watch",
                domain="water",
                category="Drainage Capacity",
                status="Acknowledged",
                priority="High",
                assigned_department="Water Operations",
                assigned_officer="Priya Menon",
                owner="Water Engineer Priya Menon",
                location="Sector 4 Utility District",
                live_location="13.0531, 80.2487",
                opened_at=now - timedelta(minutes=19),
                updated_at=now - timedelta(minutes=4),
                timeline=[
                    IncidentTimelineEntry(now - timedelta(minutes=19), "Anomaly detected", "Water Agent detected pressure and drainage correlation anomaly.", "new"),
                    IncidentTimelineEntry(now - timedelta(minutes=11), "Inspection workflow staged", "Drainage inspection and pump readiness workflow prepared.", "acknowledged"),
                ],
                comments=[IncidentNote("Water Agent", "Leak probability remains localized with no confirmed rupture.", now - timedelta(minutes=7))],
                notifications=["Water, waste, and city brain teams notified."],
                severity="high",
                eta_minutes=14,
                assigned_agents=["Water Agent", "Waste Agent", "Weather Agent"],
                affected_services=["Storm Drainage", "Road Access"],
                images=["Drainage-Node-4 Heatmap"],
                resolution_history=[],
            ),
        ]

    def _build_sensors(self) -> list[SensorRecord]:
        now = datetime.now(UTC)
        return [
            SensorRecord("SNS-TRA-104", "Harbor Camera Cluster NC-4", "Traffic", "Online", 94, 88, 33.4, "v4.8.2", now - timedelta(seconds=18), "Healthy", "2026-08-12", "Harbor Transit Loop"),
            SensorRecord("SNS-WAT-208", "Sector 4 Pressure Node", "Water", "Online", 71, 81, 29.1, "v3.1.7", now - timedelta(seconds=24), "Watch", "2026-07-29", "Sector 4 Utility District"),
            SensorRecord("SNS-AIR-044", "Freight Corridor AQI Sensor", "Air", "Online", 83, 91, 30.0, "v2.9.4", now - timedelta(seconds=14), "Healthy", "2026-09-03", "West Freight Corridor"),
        ]

    def _build_reports(self) -> list[ReportDefinition]:
        return [
            ReportDefinition("report-daily-ops", "Daily Operations Briefing", "Executive", "Daily", ["PDF", "CSV", "Print"], "Cross-domain executive view of incidents, AI recommendations, and critical KPIs."),
            ReportDefinition("report-traffic-forecast", "Traffic Forecast and Corridor Risk", "Traffic", "Hourly", ["PDF", "Excel", "CSV"], "Forecast confidence, congestion risk, corridor travel times, and intervention outcomes."),
            ReportDefinition("report-resilience", "Storm Resilience Readiness", "Emergency", "Event Driven", ["PDF", "Print"], "Preparedness package covering drainage, emergency routing, utilities, and field operations."),
        ]

    def _build_timeline(self) -> list[MissionTimelineEntry]:
        now = datetime.now(UTC)
        return [
            MissionTimelineEntry("timeline-1", now - timedelta(minutes=14), "City Brain Orchestrator", "Cross-domain event package generated", "Readiness workflows linked traffic, water, energy, and emergency posture.", "completed"),
            MissionTimelineEntry("timeline-2", now - timedelta(minutes=8), "Emergency Agent", "AMB-7 pre-positioned", "Ambulance staging approved at Harbor Loop to protect medical access.", "running"),
            MissionTimelineEntry("timeline-3", now - timedelta(minutes=5), "Water Agent", "Sector 4 pump crew workflow launched", "Drainage overload mitigation plan moved into operator-ready state.", "running"),
        ]

    def _build_audit_logs(self) -> list[AuditLogEntry]:
        now = datetime.now(UTC)
        return [
            AuditLogEntry("audit-1", now - timedelta(minutes=12), "City Brain Orchestrator", "Recommend staged intervention", "Localized risk is highly correlated but not yet citywide.", "Awaiting operator approval", "Maya Chen", "pending"),
            AuditLogEntry("audit-2", now - timedelta(minutes=6), "Emergency Agent", "Pre-position AMB-7", "Route degradation was approaching safe-margin limits.", "Approved and executed", "Asha Rao", "completed"),
        ]

    def _agent(
        self,
        *,
        name: str,
        domain: str,
        status: str,
        objective: str,
        anomaly: str,
        severity: str,
        confidence: float,
        recent_events: list[str],
        dependencies: list[str],
        reasoning: list[str],
        completed_tasks: list[str],
        running_tasks: list[str],
        resource_usage: AgentResourceUsage,
        last_decision: AgentDecision,
        recommendation: AgentRecommendation,
    ) -> DomainAgent:
        return DomainAgent(
            name=name,
            domain=domain,
            status=status,
            current_objective=objective,
            anomaly=anomaly,
            severity=severity,
            confidence_score=confidence,
            last_updated=datetime.now(UTC),
            recent_events=recent_events,
            dependencies=dependencies,
            reasoning=reasoning,
            completed_tasks=completed_tasks,
            running_tasks=running_tasks,
            resource_usage=resource_usage,
            last_decision=last_decision,
            recommendation=recommendation,
        )

    def _update_incident(
        self,
        incident: IncidentRecord,
        *,
        status: str | None = None,
        priority: str | None = None,
        assigned_department: str | None = None,
        assigned_officer: str | None = None,
        eta_minutes: int | None = None,
        timeline_entry: IncidentTimelineEntry | None = None,
        comment: IncidentNote | None = None,
        resolution_entry: IncidentResolutionEntry | None = None,
    ) -> IncidentRecord:
        updated = IncidentRecord(
            id=incident.id,
            title=incident.title,
            domain=incident.domain,
            category=incident.category,
            status=status or incident.status,
            priority=priority or incident.priority,
            assigned_department=assigned_department or incident.assigned_department,
            assigned_officer=assigned_officer or incident.assigned_officer,
            owner=incident.owner,
            location=incident.location,
            live_location=incident.live_location,
            opened_at=incident.opened_at,
            updated_at=datetime.now(UTC),
            timeline=[*incident.timeline, *([timeline_entry] if timeline_entry else [])],
            comments=[*incident.comments, *([comment] if comment else [])],
            notifications=list(incident.notifications),
            severity=incident.severity,
            eta_minutes=eta_minutes if eta_minutes is not None else incident.eta_minutes,
            assigned_agents=list(incident.assigned_agents or []),
            affected_services=list(incident.affected_services or []),
            images=list(incident.images or []),
            resolution_history=[*(incident.resolution_history or []), *([resolution_entry] if resolution_entry else [])],
        )
        self._incidents = [updated if item.id == updated.id else item for item in self._incidents]
        return updated
