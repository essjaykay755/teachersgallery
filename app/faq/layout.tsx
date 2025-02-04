import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | TeachersGallery',
  description: 'Frequently asked questions about TeachersGallery',
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 