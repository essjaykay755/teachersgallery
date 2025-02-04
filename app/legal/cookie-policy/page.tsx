import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | TeachersGallery',
  description: 'Learn about how we use cookies and similar technologies',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To keep you signed in</li>
                <li>To remember your preferences</li>
                <li>To understand how you use our website</li>
                <li>To improve our services</li>
                <li>To provide personalized content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                  <p className="mb-2">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Performance Cookies</h3>
                  <p className="mb-2">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Functionality Cookies</h3>
                  <p className="mb-2">
                    These cookies enable the website to provide enhanced functionality and personalization based on your preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Targeting Cookies</h3>
                  <p className="mb-2">
                    These cookies may be set through our site by our advertising partners to build a profile of your interests.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our website.
              </p>
              <p className="mb-4">
                To manage cookies in your browser:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                <li>Safari: Preferences → Privacy → Cookies and website data</li>
                <li>Edge: Settings → Cookies and site permissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about our Cookie Policy, please contact us at:
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