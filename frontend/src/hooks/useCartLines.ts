import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { catalogService } from "../services/catalog";
import { useCart } from "../store/cart";
import type { CartLine } from "../types/catalog";

export function useCartLines() {
  const cart = useCart();
  const ids = useMemo(() => [...new Set(cart.items.map((i) => i.productId))], [cart.items]);
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["cart-products", ids],
    queryFn: () => catalogService.resolveMany(ids),
    enabled: ids.length > 0,
  });

  const lines = useMemo<CartLine[]>(() => {
    return cart.items.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      return product && variant ? [{ ...item, product, variant }] : [];
    });
  }, [cart.items, products]);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  return { ...cart, lines, subtotal, isLoading: isLoading && ids.length > 0 };
}
