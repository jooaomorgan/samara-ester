import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog";

export const STORE_SETTINGS_QUERY_KEY = ["store-settings"] as const;

export function useStoreSettings() {
  return useQuery({
    queryKey: STORE_SETTINGS_QUERY_KEY,
    queryFn: catalogService.getStoreSettings,
  });
}

