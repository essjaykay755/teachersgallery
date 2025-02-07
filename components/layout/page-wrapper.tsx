"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  )
} 