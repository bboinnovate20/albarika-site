import { Send } from 'lucide-react'
import React, { ComponentProps, ReactNode } from 'react'
import { Button } from '../ui/button'

interface PrimaryBtnProps extends ComponentProps<typeof Button> {
  isLoading?: boolean
  prefixIcon?: ReactNode,

}

export default function PrimaryBtn({
  isLoading = false,
  children,
  disabled,
  className,
  prefixIcon,
  ...props
}: PrimaryBtnProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      className={`mt-5 font-bold text-lg p-6 flex items-center gap-2 ${className ?? ""}`}
      {...props}>
      {isLoading ? (
        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
      ) : prefixIcon}
      {children}
    </Button>
  )
}