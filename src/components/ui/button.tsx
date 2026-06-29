import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-coral-400 to-coral-500 text-white shadow-glow-coral hover:shadow-[0_14px_44px_-10px_rgba(232,130,106,0.6)] hover:-translate-y-0.5",
        champagne:
          "bg-gradient-champagne text-stone-900 shadow-soft hover:shadow-lift hover:-translate-y-0.5",
        secondary:
          "bg-white text-foreground border border-cream-200 shadow-soft hover:border-coral-200 hover:shadow-lift",
        outline:
          "border-2 border-coral-400 text-coral-500 bg-transparent hover:bg-coral-50",
        ghost:
          "text-foreground hover:bg-cream-100",
        link:
          "text-coral-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
