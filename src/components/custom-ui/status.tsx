import React from "react"
import { cn } from "@/lib/utils" // optional: shadcn/ui helper if available

interface StatusProps {
  status: "pending" | "active" | "declined"
  className?: string
}

export default function Status({ status, className }: StatusProps) {
  const baseStyle =
    "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2"

  const variants: Record<StatusProps["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    active: "bg-green-100 text-green-800 border border-green-300",
    declined: "bg-red-100 text-red-800 border border-red-300",
  }

  const label =
    status.charAt(0).toUpperCase() + status.slice(1) // capitalize first letter

  return (
    <span className={cn(baseStyle, variants[status], className)}>
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          status === "pending" && "bg-yellow-500",
          status === "active" && "bg-green-500",
          status === "declined" && "bg-red-500"
        )}
      />
      {label}
    </span>
  )
}
