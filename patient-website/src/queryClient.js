import { QueryClient } from "@tanstack/react-query";

/**
 * Default React Query options. Listener-driven data (Supabase Realtime / Firestore
 * snapshots) should use hook-level overrides so refetch does not fight subscriptions.
 * Reference-style fetches can use longer staleTime at the hook level.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
