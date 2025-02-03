import Navbar from "@/components/navbar"

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience and understand how you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                <p>Required for basic website functionality and security. Cannot be disabled.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                <p>Remember your preferences and enhance your experience.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
                <p>Help us understand how visitors interact with our website.</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
                <p>Used to deliver relevant advertisements and track their effectiveness.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Authentication and security</li>
              <li>Remembering your preferences</li>
              <li>Analyzing site performance</li>
              <li>Personalizing content</li>
              <li>Improving our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="mb-4">
              You can control cookies through your browser settings. However, disabling certain
              cookies may limit your ability to use some features of our platform.
            </p>
            <p className="mb-4">
              To manage your cookie preferences on TeachersGallery, use our cookie settings panel
              accessible via the footer of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
            <p className="mb-4">
              We use services from third parties that may place cookies on your device. These
              services include analytics, advertising, and social media integration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy periodically. We will notify you of any significant
              changes by posting a notice on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our Cookie Policy, please contact:
              <br />
              <a href="mailto:privacy@teachersgallery.com" className="text-blue-600 hover:text-blue-800">
                privacy@teachersgallery.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 