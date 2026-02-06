import { cn } from '../lib/utils';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
    asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
    className,
    interactive = false,
    asChild = false,
    children,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
        <Comp
            ref={ref}
            className={cn(
                "bg-card rounded-xl border border-white/5 p-6 backdrop-blur-sm transition-all duration-300",
                interactive && "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)] hover:-translate-y-1 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </Comp>
    );
});
Card.displayName = "Card";
