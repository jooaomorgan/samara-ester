import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

interface FavoritesContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const EMPTY: string[] = [];

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = usePersistedState<string[]>("cherry-vibes:favorites", EMPTY);
  const toggle = useCallback((id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])), [setIds]);
  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle }), [ids, toggle]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites precisa estar dentro de FavoritesProvider");
  return ctx;
}
