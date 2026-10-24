import { useSyncExternalStore } from "react";
import { getStoreDataStatus, subscribeStoreDataStatus } from "../services/catalog";

export function useStoreDataStatus() {
  return useSyncExternalStore(subscribeStoreDataStatus, getStoreDataStatus, getStoreDataStatus);
}

