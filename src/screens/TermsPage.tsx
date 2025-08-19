import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function TermsPage() {
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
            Terms of Service
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
                Agreement to Terms
              </h2>
              <p className="leading-relaxed text-gray-700">
                By accessing and using Council of Sages ("the Service," "we,"
                "us," or "our"), you accept and agree to be bound by these Terms
                of Service ("Terms"). If you do not agree to these Terms, you
                may not access or use the Service. These Terms apply to all
                users of the Service, including without limitation registered
                users.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Description of Service
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Council of Sages is an AI-powered advisory platform that
                provides personalized guidance and insights through artificial
                intelligence. The Service includes:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>AI-powered conversation and advisory services</li>
                <li>Personalized recommendations and insights</li>
                <li>Conversation history and continuity</li>
                <li>User account management and authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                User Accounts and Registration
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed text-gray-700">
                  To access certain features of the Service, you must create an
                  account. You agree to:
                </p>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  <li>
                    Provide accurate, current, and complete information during
                    registration
                  </li>
                  <li>Maintain and update your account information</li>
                  <li>
                    Maintain the security and confidentiality of your account
                    credentials
                  </li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Acceptable Use Policy
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree NOT to use the Service:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>
                  For any unlawful purpose or to solicit unlawful activity
                </li>
                <li>
                  To harass, abuse, insult, harm, or impersonate other persons
                </li>
                <li>To submit false, inaccurate, or misleading information</li>
                <li>
                  To upload or transmit viruses, malware, or other malicious
                  code
                </li>
                <li>To attempt to gain unauthorized access to our systems</li>
                <li>
                  To engage in any automated use of the system without explicit
                  permission
                </li>
                <li>
                  To collect or harvest personal information of other users
                </li>
                <li>To generate harmful, discriminatory, or illegal content</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                AI Service Limitations and Disclaimers
              </h2>
              <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="mb-2 font-semibold text-yellow-800">
                  Important Notice:
                </p>
                <p className="text-yellow-700">
                  Council of Sages provides AI-generated advice and insights for
                  informational purposes only. This service does not constitute
                  professional advice in any field.
                </p>
              </div>
              <p className="mb-4 leading-relaxed text-gray-700">
                You acknowledge and agree that:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>
                  AI responses are generated based on patterns in training data
                  and may not always be accurate
                </li>
                <li>
                  The Service does not provide professional medical, legal,
                  financial, or therapeutic advice
                </li>
                <li>
                  You should not rely solely on AI advice for important
                  decisions
                </li>
                <li>
                  AI responses may reflect biases present in training data
                </li>
                <li>
                  The Service may occasionally produce inappropriate or
                  inaccurate responses
                </li>
                <li>
                  You remain responsible for your own decisions and actions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Content and Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Your Content
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    You retain ownership of content you submit to the Service.
                    However, by submitting content, you grant us a
                    non-exclusive, worldwide, royalty-free license to use,
                    modify, and process your content solely to provide and
                    improve the Service.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Our Content
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    The Service, including all software, text, images, and other
                    content, is protected by copyright, trademark, and other
                    laws. You may not copy, modify, distribute, or create
                    derivative works of our content without explicit permission.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Privacy and Data Protection
              </h2>
              <p className="leading-relaxed text-gray-700">
                Your privacy is important to us. Please review our Privacy
                Policy, which explains how we collect, use, and protect your
                information. By using the Service, you agree to our privacy
                practices as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Payment and Billing
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Council of Sages operates on a usage-based billing model. You
                agree to:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Pay all applicable fees for your use of the Service</li>
                <li>Provide accurate billing information</li>
                <li>Update payment methods as needed</li>
                <li>Pay all charges incurred under your account</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-700">
                We reserve the right to suspend or terminate service for
                non-payment.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Service Availability and Modifications
              </h2>
              <p className="leading-relaxed text-gray-700">
                We strive to maintain high service availability but cannot
                guarantee uninterrupted access. We reserve the right to modify,
                suspend, or discontinue the Service at any time, with or without
                notice. We may also update these Terms and will notify you of
                material changes.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Disclaimers and Limitation of Liability
              </h2>
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 font-semibold text-gray-800">DISCLAIMER:</p>
                <p className="text-gray-700">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                  WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
                  BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </div>
              <p className="leading-relaxed text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE
                SERVICE.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Indemnification
              </h2>
              <p className="leading-relaxed text-gray-700">
                You agree to indemnify, defend, and hold harmless Council of
                Sages and its officers, directors, employees, and agents from
                and against any claims, liabilities, damages, losses, and
                expenses arising out of or relating to your use of the Service
                or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Termination
              </h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                Either party may terminate this agreement at any time. We may
                terminate or suspend your account immediately, without prior
                notice, for:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Violation of these Terms</li>
                <li>Non-payment of fees</li>
                <li>Suspected fraudulent or illegal activity</li>
                <li>Extended period of inactivity</li>
              </ul>
              <p className="mt-4 leading-relaxed text-gray-700">
                Upon termination, your right to use the Service will cease
                immediately, and we may delete your account and data.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Governing Law and Dispute Resolution
              </h2>
              <p className="leading-relaxed text-gray-700">
                These Terms shall be governed by and construed in accordance
                with the laws of the United States, without regard to its
                conflict of law principles. Any disputes arising under these
                Terms shall be resolved through binding arbitration in
                accordance with the rules of the American Arbitration
                Association.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Severability and Entire Agreement
              </h2>
              <p className="leading-relaxed text-gray-700">
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will remain in full force and effect.
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and Council of Sages regarding the
                Service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="leading-relaxed text-gray-700">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Council of Sages Support</strong>
                  <br />
                  Email: legal@council-of-sages.com
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
