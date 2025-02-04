import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal | TeachersGallery',
  description: 'Legal information and policies for TeachersGallery',
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 