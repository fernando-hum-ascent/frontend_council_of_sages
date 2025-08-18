import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-primary hover:text-primary-600"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Introduction
              </h2>
              <p className="leading-relaxed text-gray-700">
                Council of Sages ("we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our AI-powered advisory service. By using Council of Sages,
                you agree to the collection and use of information in accordance
                with this policy.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-gray-700">
                    <li>
                      Email address (for account creation and authentication)
                    </li>
                    <li>Display name (optional, for personalization)</li>
                    <li>Profile photo (optional, via Google sign-in)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Usage Information
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-gray-700">
                    <li>
                      Conversations and messages you send to our AI advisors
                    </li>
                    <li>Usage patterns and preferences</li>
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Provide and improve our AI advisory services</li>
                <li>Personalize your experience and recommendations</li>
                <li>Maintain conversation history for continuity</li>
                <li>
                  Monitor and analyze usage patterns to improve our service
                </li>
                <li>Communicate with you about service updates and features</li>
                <li>Ensure security and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                AI and Machine Learning
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Council of Sages uses artificial intelligence to provide
                advisory services. Your conversations may be processed to:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Generate personalized responses and advice</li>
                <li>
                  Improve our AI models and service quality (in aggregated,
                  anonymized form)
                </li>
                <li>Understand context and maintain conversation flow</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-700">
                We do not use your personal conversations to train public AI
                models without explicit consent.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Data Sharing and Disclosure
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>
                  With trusted service providers who assist in operating our
                  service (under strict confidentiality agreements)
                </li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="leading-relaxed text-gray-700">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                This includes encryption of data in transit and at rest, regular
                security assessments, and access controls. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Data Retention
              </h2>
              <p className="leading-relaxed text-gray-700">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy. Conversation history may be retained to maintain
                service continuity. You may request deletion of your data at any
                time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Your Rights
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Delete your personal data (right to be forgotten)</li>
                <li>Restrict or object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Cookies and Tracking
              </h2>
              <p className="leading-relaxed text-gray-700">
                We use cookies and similar tracking technologies to enhance your
                experience, maintain your session, and analyze usage patterns.
                You can control cookie preferences through your browser
                settings, though this may affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Third-Party Services
              </h2>
              <p className="leading-relaxed text-gray-700">
                Council of Sages integrates with third-party services including
                Firebase for authentication and hosting. These services have
                their own privacy policies, and we encourage you to review them.
                We are not responsible for the privacy practices of third
                parties.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Children's Privacy
              </h2>
              <p className="leading-relaxed text-gray-700">
                Council of Sages is not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you become aware that a child has provided
                us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                International Data Transfers
              </h2>
              <p className="leading-relaxed text-gray-700">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your personal
                information in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. Your
                continued use of the service after such modifications
                constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Contact Us
              </h2>
              <p className="leading-relaxed text-gray-700">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at:
              </p>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Council of Sages Support</strong>
                  <br />
                  Email: privacy@council-of-sages.com
                  <br />
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
