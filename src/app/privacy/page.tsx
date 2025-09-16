import { Logo } from '@/components/icons';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">hearts on tiktok</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-blue-800 font-bold text-xl mb-2">🔒 Privacy Notice</h2>
            <p className="text-blue-700">HeartsOnTikTok collects and processes data as described below. By using our platform, you consent to our data practices and assume responsibility for your own privacy protection.</p>
          </div>

          <h2>1. INFORMATION WE COLLECT</h2>
          <h3>Account Information:</h3>
          <ul>
            <li>TikTok profile data (username, display name, profile picture, follower count)</li>
            <li>TikTok authentication tokens and access credentials</li>
            <li>Video performance metrics (views, likes, comments, shares)</li>
            <li>Campaign participation and submission data</li>
          </ul>
          
          <h3>Payment Information:</h3>
          <ul>
            <li>M-Pesa phone numbers for payouts</li>
            <li>Transaction history and payout records</li>
            <li>Subscription plan and billing information</li>
          </ul>

          <h3>Usage Data:</h3>
          <ul>
            <li>Platform activity logs and interaction data</li>
            <li>Device information and IP addresses</li>
            <li>Browser type, operating system, and referral sources</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          <h2>2. HOW WE USE YOUR INFORMATION</h2>
          <p><strong>We use collected information to:</strong></p>
          <ul>
            <li>Provide platform services and facilitate campaign matching</li>
            <li>Process payments and manage affiliate commissions</li>
            <li>Monitor platform usage and prevent fraud</li>
            <li>Communicate about account status and platform updates</li>
            <li>Comply with legal obligations and enforce our terms</li>
            <li>Improve platform functionality and user experience</li>
          </ul>

          <h2>3. INFORMATION SHARING & DISCLOSURE</h2>
          <p><strong>We may share your information with:</strong></p>
          <ul>
            <li><strong>TikTok:</strong> Through API integrations for content posting and metrics</li>
            <li><strong>Payment Processors:</strong> Swapuzi and other financial service providers</li>
            <li><strong>Campaign Sponsors:</strong> Performance metrics and content data for campaigns you join</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            <li><strong>Service Providers:</strong> Third-party vendors supporting platform operations</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
          </ul>

          <h2>4. DATA SECURITY & PROTECTION</h2>
          <p><strong>Security Measures:</strong></p>
          <ul>
            <li>Encrypted data transmission and storage</li>
            <li>Access controls and authentication systems</li>
            <li>Regular security audits and monitoring</li>
            <li>Secure payment processing through certified providers</li>
          </ul>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
            <p className="text-yellow-800 font-semibold">⚠️ SECURITY DISCLAIMER:</p>
            <p className="text-yellow-700">While we implement security measures, we cannot guarantee absolute security. Users are responsible for maintaining account security and reporting suspicious activity.</p>
          </div>

          <h2>5. DATA RETENTION</h2>
          <p><strong>We retain information:</strong></p>
          <ul>
            <li>Account data: Until account deletion or 2 years of inactivity</li>
            <li>Transaction records: 7 years for tax and legal compliance</li>
            <li>Usage logs: 12 months for platform optimization</li>
            <li>Legal compliance data: As required by applicable laws</li>
          </ul>

          <h2>6. COOKIES & TRACKING</h2>
          <p><strong>We use cookies for:</strong></p>
          <ul>
            <li>Authentication and session management</li>
            <li>Platform functionality and user preferences</li>
            <li>Analytics and performance monitoring</li>
            <li>Security and fraud prevention</li>
          </ul>
          <p>Users can control cookies through browser settings, but this may affect platform functionality.</p>

          <h2>7. THIRD-PARTY INTEGRATIONS</h2>
          <p><strong>Our platform integrates with:</strong></p>
          <ul>
            <li><strong>TikTok API:</strong> Subject to TikTok's privacy policy and terms</li>
            <li><strong>Firebase:</strong> Google's privacy policy applies to data storage</li>
            <li><strong>Swapuzi:</strong> Payment processor with separate privacy terms</li>
            <li><strong>Analytics Services:</strong> For platform improvement and monitoring</li>
          </ul>
          <p className="font-semibold text-red-600">We are not responsible for third-party privacy practices. Users should review all third-party privacy policies.</p>

          <h2>8. USER RIGHTS & CONTROLS</h2>
          <p><strong>Depending on your location, you may have rights to:</strong></p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Restrict or object to certain processing</li>
            <li>Data portability (where technically feasible)</li>
          </ul>
          <p>Contact us through the platform to exercise these rights. We may require identity verification and have up to 30 days to respond.</p>

          <h2>9. INTERNATIONAL DATA TRANSFERS</h2>
          <p>Your information may be transferred to and processed in countries outside your residence, including Kenya, the United States, and other jurisdictions where our service providers operate. By using our platform, you consent to such transfers.</p>

          <h2>10. CHILDREN'S PRIVACY</h2>
          <p><strong>Our platform is not intended for users under 18.</strong> We do not knowingly collect information from minors. If we discover such collection, we will delete the information immediately.</p>

          <h2>11. CALIFORNIA PRIVACY RIGHTS</h2>
          <p>California residents have additional rights under CCPA, including the right to know about personal information collection, sale, and disclosure. We do not sell personal information to third parties.</p>

          <h2>12. GDPR COMPLIANCE</h2>
          <p>For EU residents, we process data based on legitimate interests, contractual necessity, or consent. You have rights to access, rectify, erase, restrict, and port your data, as well as object to processing.</p>

          <h2>13. POLICY UPDATES</h2>
          <p>We may update this policy at any time. Material changes will be communicated through the platform or email. Continued use after updates constitutes acceptance of the revised policy.</p>

          <h2>14. DATA BREACH NOTIFICATION</h2>
          <p>In case of a data breach affecting your information, we will notify you and relevant authorities as required by law, typically within 72 hours of discovery.</p>

          <h2>15. CONTACT INFORMATION</h2>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li>Use the platform's support system</li>
            <li>Email: privacy@heartsontiktok.com</li>
            <li>Response time: Up to 30 business days</li>
          </ul>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-red-800 text-lg mb-2">🚨 IMPORTANT PRIVACY NOTICE</h3>
            <p className="text-red-700 font-semibold mb-2">
              BY USING HEARTSONTIKTOK, YOU ACKNOWLEDGE:
            </p>
            <ul className="text-red-700">
              <li>• You understand our data collection and sharing practices</li>
              <li>• You consent to data processing as described in this policy</li>
              <li>• You are responsible for protecting your own account security</li>
              <li>• We are not liable for third-party privacy practices</li>
              <li>• You assume all risks related to data sharing and platform use</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}