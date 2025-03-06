import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | TeachersGallery',
  description: 'Learn about how we use cookies and similar technologies',
}

import CookiePolicyContent from './cookie-policy-content'

export default function CookiePolicy() {
  return <CookiePolicyContent />
} 