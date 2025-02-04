import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TeachersGallery',
  description: 'Our commitment to protecting your privacy and personal information',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                TeachersGallery ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information</li>
                <li>Email address and phone number</li>
                <li>Profile information (for teachers)</li>
                <li>Educational background and qualifications</li>
                <li>Payment information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process your transactions</li>
                <li>To communicate with you about our services</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
                <li>Other users as necessary for the platform's functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@teachersgallery.com
                <br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 