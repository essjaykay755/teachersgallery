export default function Legal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Important Documents</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/legal/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/legal/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/legal/cookie-policy" className="text-blue-600 hover:underline">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="/legal/refund-policy" className="text-blue-600 hover:underline">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 