'use client'

import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
}

export const AuroraBackground = ({
  className,
  children,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div className="aurora-waves" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}