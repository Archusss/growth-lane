import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: [api.analytics.overview.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.overview.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch analytics");
      }
      return api.analytics.overview.responses[200].parse(await res.json());
    },
  });
}

export function useTrackPageView() {
  return useMutation({
    mutationFn: async (data: { path: string }) => {
      const validated = api.analytics.trackPageView.input.parse(data);
      const res = await fetch(api.analytics.trackPageView.path, {
        method: api.analytics.trackPageView.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to track page view");
      return api.analytics.trackPageView.responses[200].parse(await res.json());
    },
  });
}
