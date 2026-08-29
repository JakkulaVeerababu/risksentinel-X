import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "primary-soft" | "success-soft" | "warning-soft" | "danger-soft" | "info-soft"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-caption font-semibold uppercase transition-colors",
        {
          "border-transparent bg-primary text-white": variant === "default",
          "border-transparent bg-surface-secondary text-text-secondary": variant === "secondary",
          "border-transparent bg-danger text-white": variant === "destructive",
          "border-transparent bg-success text-white": variant === "success",
          "border-transparent bg-warning text-white": variant === "warning",
          "border-transparent bg-info text-white": variant === "info",
          "text-text-primary border-border": variant === "outline",
          "border-primary/20 bg-primary-soft text-primary": variant === "primary-soft",
          "border-success/20 bg-success-soft text-success": variant === "success-soft",
          "border-warning/20 bg-warning-soft text-warning": variant === "warning-soft",
          "border-danger/20 bg-danger-soft text-danger": variant === "danger-soft",
          "border-info/20 bg-info-soft text-info": variant === "info-soft",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
