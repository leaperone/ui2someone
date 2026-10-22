import { forwardRef, HTMLAttributes, ReactNode } from "react";
import cn from "../utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  shadow?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  isPressable?: boolean;
  variant?: "solid" | "flat" | "faded" | "bordered" | "light";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      shadow = "none",
      radius = "md",
      fullWidth = false,
      isPressable = false,
      variant = "solid",
      color = "default",
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      // Default styles using layout colors
      if (color === "default") {
        const variantStyles = {
          solid: "bg-content1 border-divider",
          flat: "bg-transparent border-none shadow-none",
          faded: "bg-content1/50 border-divider/50 backdrop-blur-sm",
          bordered: "bg-transparent border-2 border-divider",
          light: "bg-content1/30 border-divider/30",
        };
        return variantStyles[variant] || variantStyles.solid;
      }

      // Themed styles using semantic colors
      const colorClasses = {
        primary: {
          solid: `bg-primary text-primary-foreground border-primary`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-primary/10 border-primary/20 backdrop-blur-sm text-primary`,
          bordered: `bg-transparent border-2 border-primary text-primary`,
          light: `bg-primary/10 border-primary/20 text-primary`,
        },
        secondary: {
          solid: `bg-secondary text-secondary-foreground border-secondary`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-secondary/10 border-secondary/20 backdrop-blur-sm text-secondary`,
          bordered: `bg-transparent border-2 border-secondary text-secondary`,
          light: `bg-secondary/10 border-secondary/20 text-secondary`,
        },
        success: {
          solid: `bg-success text-success-foreground border-success`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-success/10 border-success/20 backdrop-blur-sm text-success`,
          bordered: `bg-transparent border-2 border-success text-success`,
          light: `bg-success/10 border-success/20 text-success`,
        },
        warning: {
          solid: `bg-warning text-warning-foreground border-warning`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-warning/10 border-warning/20 backdrop-blur-sm text-warning`,
          bordered: `bg-transparent border-2 border-warning text-warning`,
          light: `bg-warning/10 border-warning/20 text-warning`,
        },
        danger: {
          solid: `bg-danger text-danger-foreground border-danger`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-danger/10 border-danger/20 backdrop-blur-sm text-danger`,
          bordered: `bg-transparent border-2 border-danger text-danger`,
          light: `bg-danger/10 border-danger/20 text-danger`,
        },
        info: {
          solid: `bg-info text-info-foreground border-info`,
          flat: "bg-transparent border-none shadow-none",
          faded: `bg-info/10 border-info/20 backdrop-blur-sm text-info`,
          bordered: `bg-transparent border-2 border-info text-info`,
          light: `bg-info/10 border-info/20 text-info`,
        },
      };

      return colorClasses[color][variant] || colorClasses[color].solid;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border",
          getVariantClasses(),
          {
            "shadow-none": shadow === "none",
            "shadow-sm": shadow === "sm",
            "shadow-md": shadow === "md",
            "shadow-lg": shadow === "lg",
            "rounded-none": radius === "none",
            "rounded-sm": radius === "sm",
            "rounded-md": radius === "md",
            "rounded-lg": radius === "lg",
            "w-full": fullWidth,
            "cursor-pointer hover:shadow-lg transition-shadow": isPressable,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-6", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";
