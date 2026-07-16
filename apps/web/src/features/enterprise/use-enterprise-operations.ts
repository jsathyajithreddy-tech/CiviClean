import { useMutation, useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "../../services/enterprise-api";

export function useAgentStatus() {
  return useQuery({
    queryKey: ["enterprise", "agents"],
    queryFn: enterpriseApi.getAgents,
    staleTime: 30_000,
  });
}

export function useCityBrainBriefing() {
  return useQuery({
    queryKey: ["enterprise", "city-brain"],
    queryFn: enterpriseApi.getCityBrainBriefing,
    staleTime: 30_000,
  });
}

export function useDigitalTwinOverview() {
  return useQuery({
    queryKey: ["enterprise", "digital-twin"],
    queryFn: enterpriseApi.getDigitalTwinOverview,
    staleTime: 30_000,
  });
}

export function useIncidents() {
  return useQuery({
    queryKey: ["enterprise", "incidents"],
    queryFn: enterpriseApi.getIncidents,
    staleTime: 30_000,
  });
}

export function useSensors() {
  return useQuery({
    queryKey: ["enterprise", "sensors"],
    queryFn: enterpriseApi.getSensors,
    staleTime: 30_000,
  });
}

export function useReportsCatalog() {
  return useQuery({
    queryKey: ["enterprise", "reports"],
    queryFn: enterpriseApi.getReports,
    staleTime: 60_000,
  });
}

export function useCommandTimeline() {
  return useQuery({
    queryKey: ["enterprise", "command-timeline"],
    queryFn: enterpriseApi.getCommandTimeline,
    staleTime: 15_000,
  });
}

export function useAuditLog() {
  return useQuery({
    queryKey: ["enterprise", "audit-log"],
    queryFn: enterpriseApi.getAuditLog,
    staleTime: 15_000,
  });
}

export function useOperationalKpis() {
  return useQuery({
    queryKey: ["enterprise", "operational-kpis"],
    queryFn: enterpriseApi.getOperationalKpis,
    staleTime: 15_000,
  });
}

export function useCopilotQuery() {
  return useMutation({
    mutationFn: enterpriseApi.askCopilot,
  });
}

export function useCommandAction() {
  return useMutation({
    mutationFn: enterpriseApi.executeCommandAction,
  });
}

export function useIncidentAction() {
  return useMutation({
    mutationFn: ({ incidentId, command }: { incidentId: string; command: string }) =>
      enterpriseApi.executeIncidentAction(incidentId, command),
  });
}
