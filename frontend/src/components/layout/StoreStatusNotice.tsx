import { useQueryClient } from "@tanstack/react-query";
import { useStoreDataStatus } from "../../hooks/useStoreDataStatus";

export function StoreStatusNotice() {
  const status = useStoreDataStatus();
  const queryClient = useQueryClient();
  if (!status.message) return null;

  return (
    <div className="border-b border-blossom/20 bg-wine-soft px-4 py-2 text-center text-xs text-cream" role="status" data-testid="store-data-status">
      <span>{status.message}</span>
      <button type="button" className="ml-3 underline underline-offset-2" onClick={() => queryClient.invalidateQueries()} data-testid="store-data-retry">
        Tentar novamente
      </button>
    </div>
  );
}

