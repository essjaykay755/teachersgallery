import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | TeachersGallery',
  description: 'Our refund policy and procedures for service cancellations',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                At TeachersGallery, we want you to be completely satisfied with our services. This Refund Policy outlines when and how you can request a refund for our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Trial Classes</h2>
              <p className="mb-4">
                For trial classes, we offer a 100% refund if:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The teacher doesn't show up for the scheduled class</li>
                <li>Technical issues on our platform prevent the class from taking place</li>
                <li>The teacher's expertise doesn't match the advertised profile</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Regular Classes</h2>
              <p className="mb-4">
                For regular classes, our refund policy is as follows:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Full refund if cancelled at least 24 hours before the scheduled class</li>
                <li>50% refund if cancelled between 12-24 hours before the class</li>
                <li>No refund for cancellations less than 12 hours before the class</li>
                <li>Full refund if the teacher cancels the class</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Package Bookings</h2>
              <p className="mb-4">
                For package bookings:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Full refund for unused classes if requested within 7 days of purchase</li>
                <li>Prorated refund for unused classes after 7 days</li>
                <li>No refund for completed classes</li>
                <li>Administrative fee may apply for package cancellations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
              <p className="mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Log into your TeachersGallery account</li>
                <li>Go to the class booking in question</li>
                <li>Click on the "Request Refund" button</li>
                <li>Fill out the refund request form</li>
                <li>Submit any relevant documentation</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
              <p className="mb-4">
                Refund requests are typically processed within 5-7 business days. The actual time to receive your refund may vary depending on your payment method:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Credit/Debit Cards: 5-10 business days</li>
                <li>Bank Transfers: 3-5 business days</li>
                <li>Wallet Credit: Immediate</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Exceptions</h2>
              <p className="mb-4">
                We reserve the right to deny refund requests that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violate our Terms of Service</li>
                <li>Show patterns of abuse or fraudulent behavior</li>
                <li>Are made after the eligible refund period</li>
                <li>Lack sufficient documentation or justification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have questions about our Refund Policy, please contact us at:
                <br />
                Email: support@teachersgallery.com
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