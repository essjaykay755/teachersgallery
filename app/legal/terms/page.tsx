import Navbar from "@/components/navbar"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using TeachersGallery, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="mb-4">When creating an account, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Teacher Verification</h2>
            <p className="mb-4">Teachers must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide valid identification</li>
              <li>Submit educational qualifications</li>
              <li>Complete background verification process</li>
              <li>Maintain professional standards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              All payments are processed securely through our platform. Teachers agree to our commission
              structure and payment schedule. Featured listings are subject to additional fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
            <p className="mb-4">Users must not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Share false or misleading information</li>
              <li>Harass or abuse other users</li>
              <li>Circumvent the platform's payment system</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms
              or engage in fraudulent activity. Users may terminate their accounts at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact:
              <br />
              <a href="mailto:legal@teachersgallery.com" className="text-blue-600 hover:text-blue-800">
                legal@teachersgallery.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 