import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Users, FileText, Globe, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-lg">likezBuddy</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-16 px-4 md:px-8 max-w-5xl">
        <article className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">Privacy Notice</h2>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">HeartsOnTikTok collects and processes data as described below. By using our platform, you consent to our data practices and assume responsibility for your own privacy protection.</p>
              </div>
            </div>
          </div>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">1. Information We Collect</h2>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">Account Information:</h3>
          <ul>
            <li>TikTok profile data (username, display name, profile picture, follower count)</li>
            <li>TikTok authentication tokens and access credentials</li>
            <li>Video performance metrics (views, likes, comments, shares)</li>
            <li>Campaign participation and submission data</li>
          </ul>
          
            <h3 className="text-xl font-semibold mb-3 mt-6 text-primary">Payment Information:</h3>
          <ul>
            <li>M-Pesa phone numbers for payouts (KES 50 per 1,000 likes)</li>
            <li>Transaction history and payout records (daily limits: KES 10K-20K)</li>
            <li>Subscription plan data (Gold/Platinum/Diamond: KES 1K-5.5K/month)</li>
            <li>Affiliate commission records (30% direct, 5% indirect, 4 levels)</li>
            <li>Campaign participation tracking (3-10 campaigns per month)</li>
          </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6 text-primary">Usage Data:</h3>
          <ul>
            <li>Platform activity logs and interaction data</li>
            <li>Device information and IP addresses</li>
            <li>Browser type, operating system, and referral sources</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">2. How We Use Your Information</h2>
            </div>
          <p><strong>We use collected information to:</strong></p>
          <ul>
            <li>Calculate and process video payouts (KES 50 per 1,000 likes)</li>
            <li>Manage affiliate commissions (30% direct, 5% indirect up to 4 levels)</li>
            <li>Enforce campaign participation limits (3-10 per month based on plan)</li>
            <li>Apply daily payout limits (KES 10,000-20,000 based on subscription)</li>
            <li>Process monthly subscription billing (KES 1,000-5,500)</li>
            <li>Track TikTok video performance and engagement metrics</li>
            <li>Facilitate M-Pesa payments through Swapuzi integration</li>
            <li>Monitor platform usage and prevent fraud or abuse</li>
            <li>Communicate about account status, limits, and platform updates</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">3. Information Sharing & Disclosure</h2>
            </div>
          <p><strong>We may share your information with:</strong></p>
          <ul>
            <li><strong>TikTok:</strong> Through API integrations for content posting and metrics</li>
            <li><strong>Payment Processors:</strong> Swapuzi and other financial service providers</li>
            <li><strong>Campaign Sponsors:</strong> Performance metrics and content data for campaigns you join</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            <li><strong>Service Providers:</strong> Third-party vendors supporting platform operations</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">4. Data Security & Protection</h2>
            </div>
          <p><strong>Security Measures:</strong></p>
          <ul>
            <li>Encrypted data transmission and storage</li>
            <li>Access controls and authentication systems</li>
            <li>Regular security audits and monitoring</li>
            <li>Secure payment processing through certified providers</li>
          </ul>
          
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 p-6 my-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Security Disclaimer</p>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">While we implement security measures, we cannot guarantee absolute security. Users are responsible for maintaining account security and reporting suspicious activity.</p>
                </div>
              </div>
            </div>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">5. Data Retention</h2>
            </div>
          <p><strong>We retain information:</strong></p>
          <ul>
            <li>Account data: Until account deletion or 2 years of inactivity</li>
            <li>Payment records: 7 years (video payouts, affiliate commissions, subscriptions)</li>
            <li>TikTok performance data: 2 years for payout calculations</li>
            <li>Campaign participation history: 2 years for limit enforcement</li>
            <li>Usage logs: 12 months for platform optimization</li>
            <li>Legal compliance data: As required by Kenyan and international laws</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">6. Cookies & Tracking</h2>
          <p><strong>We use cookies for:</strong></p>
          <ul>
            <li>Authentication and session management</li>
            <li>Platform functionality and user preferences</li>
            <li>Analytics and performance monitoring</li>
            <li>Security and fraud prevention</li>
          </ul>
          <p>Users can control cookies through browser settings, but this may affect platform functionality.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">7. Third-Party Integrations</h2>
          <p><strong>Our platform integrates with:</strong></p>
          <ul>
            <li><strong>TikTok API:</strong> Subject to TikTok's privacy policy and terms</li>
            <li><strong>Firebase:</strong> Google's privacy policy applies to data storage</li>
            <li><strong>Swapuzi:</strong> Payment processor with separate privacy terms</li>
            <li><strong>Analytics Services:</strong> For platform improvement and monitoring</li>
          </ul>
          <p className="font-semibold text-red-600">We are not responsible for third-party privacy practices. Users should review all third-party privacy policies.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">8. User Rights & Controls</h2>
          <p><strong>Depending on your location, you may have rights to:</strong></p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Restrict or object to certain processing</li>
            <li>Data portability (where technically feasible)</li>
          </ul>
          <p>Contact us through the platform to exercise these rights. We may require identity verification and have up to 30 days to respond.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">9. International Data Transfers</h2>
            </div>
          <p>Your information may be transferred to and processed in countries outside your residence, including Kenya, the United States, and other jurisdictions where our service providers operate. By using our platform, you consent to such transfers.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">10. Children's Privacy</h2>
          <p><strong>Our platform is not intended for users under 18.</strong> We do not knowingly collect information from minors. If we discover such collection, we will delete the information immediately.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">11. California Privacy Rights</h2>
          <p>California residents have additional rights under CCPA, including the right to know about personal information collection, sale, and disclosure. We do not sell personal information to third parties.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">12. GDPR Compliance</h2>
          <p>For EU residents, we process data based on legitimate interests, contractual necessity, or consent. You have rights to access, rectify, erase, restrict, and port your data, as well as object to processing.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">13. Policy Updates</h2>
          <p>We may update this policy at any time. Material changes will be communicated through the platform or email. Continued use after updates constitutes acceptance of the revised policy.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">14. Data Breach Notification</h2>
          <p>In case of a data breach affecting your information, we will notify you and relevant authorities as required by law, typically within 72 hours of discovery.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">15. Contact Information</h2>
          <p>For privacy-related questions or requests:</p>
          <ul>
            <li>Use the platform's support system</li>
              <li>Email: privacy@likezzbuddy.com</li>
            <li>Response time: Up to 30 business days</li>
          </ul>

          </section>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/30 p-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-900 dark:text-red-100">Important Privacy Notice</h3>
              </div>
              <p className="text-red-800 dark:text-red-200 font-semibold mb-4">
                BY USING HEARTSONTIKTOK, YOU ACKNOWLEDGE:
              </p>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span><span>You understand our data collection and sharing practices</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span><span>You consent to data processing as described in this policy</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span><span>You are responsible for protecting your own account security</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span><span>We are not liable for third-party privacy practices</span></li>
                <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span><span>You assume all risks related to data sharing and platform use</span></li>
              </ul>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}