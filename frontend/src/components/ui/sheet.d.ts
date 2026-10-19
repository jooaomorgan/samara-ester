import type * as SheetPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";

type Side = "top" | "bottom" | "left" | "right";

export const Sheet: typeof SheetPrimitive.Root;
export const SheetTrigger: typeof SheetPrimitive.Trigger;
export const SheetClose: typeof SheetPrimitive.Close;
export const SheetPortal: typeof SheetPrimitive.Portal;
export const SheetOverlay: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & React.RefAttributes<HTMLDivElement>>;
export const SheetContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: Side } & React.RefAttributes<HTMLDivElement>>;
export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const SheetTitle: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> & React.RefAttributes<HTMLHeadingElement>>;
export const SheetDescription: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & React.RefAttributes<HTMLParagraphElement>>;
