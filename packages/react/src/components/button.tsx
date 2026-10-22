import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import cn from "../utils/cn";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children?: ReactNode;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
  disableAnimation?: boolean;
  isLoading?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  spinner?: ReactNode;
  spinnerPlacement?: "start" | "end";
  onPress?: () => void;
}

// Button variant styles function
const getButtonClasses = ({
  variant = "solid",
  color = "default",
  size = "md",
  radius = "md",
  fullWidth = false,
  isDisabled = false,
  isIconOnly = false,
  isLoading = false,
  disableAnimation = false,
}: Partial<ButtonProps>) => {
  // Base classes
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "whitespace-nowrap",
    "font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "appearance-none",
    "select-none",
    "box-border",
    "outline-none",
    "tap-highlight-transparent",
  ];

  // Size classes
  const sizeClasses = {
    sm: isIconOnly ? "h-8 w-8 min-w-8" : "h-8 px-3 text-tiny gap-2",
    md: isIconOnly ? "h-10 w-10 min-w-10" : "h-10 px-4 text-small gap-2",
    lg: isIconOnly ? "h-12 w-12 min-w-12" : "h-12 px-6 text-medium gap-3",
  };

  // Radius classes
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-small",
    md: "rounded-medium",
    lg: "rounded-large",
    full: "rounded-full",
  };

  // Variant and color combination classes
  const getVariantColorClasses = () => {
    const combinations = {
      solid: {
        default: "bg-default text-default-foreground hover:bg-default/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
      },
      bordered: {
        default: "border-medium border-default bg-transparent text-default hover:bg-default/10",
        primary: "border-medium border-primary bg-transparent text-primary hover:bg-primary/10",
        secondary:
          "border-medium border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        success: "border-medium border-success bg-transparent text-success hover:bg-success/10",
        warning: "border-medium border-warning bg-transparent text-warning hover:bg-warning/10",
        danger: "border-medium border-danger bg-transparent text-danger hover:bg-danger/10",
      },
      light: {
        default: "bg-transparent text-default hover:bg-default/40",
        primary: "bg-transparent text-primary hover:bg-primary/20",
        secondary:
          "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        success: "bg-transparent text-success hover:bg-success/20",
        warning: "bg-transparent text-warning hover:bg-warning/20",
        danger: "bg-transparent text-danger hover:bg-danger/20",
      },
      flat: {
        default: "bg-default/20 text-default hover:bg-default/30",
        primary: "bg-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        success: "bg-success/20 text-success hover:bg-success/30",
        warning: "bg-warning/20 text-warning hover:bg-warning/30",
        danger: "bg-danger/20 text-danger hover:bg-danger/30",
      },
      faded: {
        default: "border-medium bg-default/20 border-default/20 text-default hover:bg-default/30",
        primary: "border-medium bg-primary/20 border-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "border-medium bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600",
        success: "border-medium bg-success/20 border-success/20 text-success hover:bg-success/30",
        warning: "border-medium bg-warning/20 border-warning/20 text-warning hover:bg-warning/30",
        danger: "border-medium bg-danger/20 border-danger/20 text-danger hover:bg-danger/30",
      },
      shadow: {
        default:
          "shadow-lg shadow-default/50 bg-default text-default-foreground hover:bg-default/90",
        primary:
          "shadow-lg shadow-primary/50 bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "shadow-lg shadow-gray-300/50 bg-gray-100 text-gray-900 hover:bg-gray-200 dark:shadow-gray-700/50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        success:
          "shadow-lg shadow-success/50 bg-success text-success-foreground hover:bg-success/90",
        warning:
          "shadow-lg shadow-warning/50 bg-warning text-warning-foreground hover:bg-warning/90",
        danger: "shadow-lg shadow-danger/50 bg-danger text-danger-foreground hover:bg-danger/90",
      },
    };

    return combinations[variant]?.[color] || combinations.solid.default;
  };

  // State classes
  const stateClasses = [];
  if (isDisabled || isLoading) {
    stateClasses.push("opacity-disabled", "pointer-events-none");
  }
  if (fullWidth) {
    stateClasses.push("w-full");
  }
  if (!disableAnimation) {
    stateClasses.push("transition-all", "duration-200");
  }
  if (isLoading) {
    stateClasses.push("cursor-default");
  }

  return cn(
    baseClasses,
    sizeClasses[size],
    radiusClasses[radius],
    getVariantColorClasses(),
    stateClasses
  );
};

// Simple button group function
const getButtonGroupClasses = ({ fullWidth = false }: { fullWidth?: boolean } = {}) => {
  return cn("inline-flex", "items-center", "justify-center", "h-auto", fullWidth && "w-full");
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "solid",
      color = "default",
      size = "md",
      radius = "md",
      startContent,
      endContent,
      spinner,
      spinnerPlacement = "start",
      fullWidth = false,
      isIconOnly = false,
      isDisabled = false,
      isLoading = false,
      disableAnimation = false,
      onPress,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled || isLoading) return;

      if (onPress) {
        onPress();
      }
      if (onClick) {
        onClick(e);
      }
    };

    const defaultSpinner = (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    return (
      <button
        ref={ref}
        className={cn(
          getButtonClasses({
            variant,
            color,
            size,
            radius,
            fullWidth,
            isDisabled: isDisabled || disabled,
            isIconOnly,
            isLoading,
            disableAnimation,
          }),
          className
        )}
        onClick={handleClick}
        disabled={isDisabled || isLoading || disabled}
        {...props}
      >
        {isLoading && spinnerPlacement === "start" && (
          <span className={cn("flex items-center", !isIconOnly && "mr-2")}>
            {spinner || defaultSpinner}
          </span>
        )}
        {!isLoading && startContent && (
          <span className={cn("flex items-center", !isIconOnly && "mr-2")}>{startContent}</span>
        )}
        {!isIconOnly && children}
        {!isLoading && endContent && (
          <span className={cn("flex items-center", !isIconOnly && "ml-2")}>{endContent}</span>
        )}
        {isLoading && spinnerPlacement === "end" && (
          <span className={cn("flex items-center", !isIconOnly && "ml-2")}>
            {spinner || defaultSpinner}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Export utility functions for external use
export const button = getButtonClasses;
export const buttonGroup = getButtonGroupClasses;
