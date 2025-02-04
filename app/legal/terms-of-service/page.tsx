import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | TeachersGallery',
  description: 'Terms and conditions for using TeachersGallery services',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="mb-4">
                By accessing or using TeachersGallery, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must not share your account credentials with others</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Teacher Obligations</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate information about qualifications and experience</li>
                <li>Maintain professional conduct in all interactions</li>
                <li>Deliver services as described in their profile</li>
                <li>Comply with all applicable education laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Student Obligations</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide accurate information when booking classes</li>
                <li>Attend scheduled classes punctually</li>
                <li>Pay for services as agreed</li>
                <li>Maintain respectful behavior during interactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payments and Refunds</h2>
              <p className="mb-4">
                All payments are processed securely through our platform. Refunds are subject to our Refund Policy, which can be found separately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="mb-4">
                The content, features, and functionality of TeachersGallery are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="mb-4">
                TeachersGallery shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@teachersgallery.com
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