import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../services/dashboard-api";
export type { DashboardSummary, DomainMetric } from "./dashboard-types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.getSummary,
  });
}
