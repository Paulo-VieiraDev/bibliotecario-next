"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {!error ? (
          <Image
            src={src || ""}
            alt={alt || ""}
            className={cn("h-full w-full object-cover", className)}
            width={100}
            height={100}
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            {fallback}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar } 