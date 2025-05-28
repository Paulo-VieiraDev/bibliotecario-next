"use client"

import { Toaster } from "sonner"

export default function AlunosLayout({
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