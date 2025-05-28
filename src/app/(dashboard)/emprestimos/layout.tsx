"use client"

import { Toaster } from "sonner"

export default function EmprestimosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
} 