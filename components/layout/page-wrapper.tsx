"use client"

import { usePathname } from "next/navigation"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  )
} 