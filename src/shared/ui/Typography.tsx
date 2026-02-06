import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

const typographyVariants = cva("text-text-primary font-main", {
  variants: {
    variant: {
      h1: "text-4xl md:text-[4rem] font-bold leading-[1.1] tracking-tighter",
      h2: "text-3xl md:text-5xl font-bold leading-tight tracking-tight",
      h3: "text-2xl md:text-3xl font-bold leading-snug",
      body: "text-base md:text-lg text-text-secondary leading-relaxed",
      caption: "text-sm text-text-muted",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  asChild?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  className,
  variant,
  as,
  asChild = false,
  children,
  ...props
}) => {
  const Comp = asChild
    ? Slot
    : ((as ||
        (variant === "body" || variant === "caption" ? "p" : variant) ||
        "p") as any);

  return (
    <Comp className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  );
};
