import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import type { CartItem } from "../types/catalog";

interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (productId: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const EMPTY: CartItem[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = usePersistedState<CartItem[]>("cherry-vibes:cart", EMPTY);

  const add = useCallback((productId: string, variantId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) return prev.map((i) => (i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { productId, variantId, quantity }];
    });
  }, [setItems]);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => (quantity <= 0 ? prev.filter((i) => i.variantId !== variantId) : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))));
  }, [setItems]);

  const remove = useCallback((variantId: string) => setItems((prev) => prev.filter((i) => i.variantId !== variantId)), [setItems]);
  const clear = useCallback(() => setItems(EMPTY), [setItems]);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, i) => n + i.quantity, 0), add, setQuantity, remove, clear }),
    [items, add, setQuantity, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de CartProvider");
  return ctx;
}
