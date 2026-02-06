import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-main font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-desktop-primary text-black hover:brightness-110 hover:-translate-y-px active:translate-y-0 shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_25px_rgba(0,242,255,0.5)]",
        brand:
          "bg-[var(--color-purple-accent)] text-white hover:bg-[#6455b5] hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_15px_rgba(83,70,156,0.3)] hover:shadow-[0_8px_25px_rgba(83,70,156,0.4)]",
        secondary:
          "bg-transparent border border-desktop-primary text-desktop-primary hover:bg-desktop-primary/10",
        ghost: "bg-transparent text-text-primary hover:text-desktop-primary",
      },
      size: {
        small: "h-8 px-4 text-sm",
        medium: "h-10 px-6 text-base",
        large: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
