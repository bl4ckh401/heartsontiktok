import { Logo } from '@/components/icons';
import Link from 'next/link';
import { FileText, AlertTriangle, DollarSign, Shield, Scale, Ban, XCircle, Info } from 'lucide-react';

export default function TermsOfServicePage() {
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
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/30 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Important Legal Notice</h2>
                <p className="text-red-800 dark:text-red-200 font-semibold leading-relaxed">BY USING HEARTSONTIKTOK, YOU ASSUME ALL RISKS. WE ARE NOT RESPONSIBLE FOR ANY LOSSES, DAMAGES, OR CONSEQUENCES.</p>
              </div>
            </div>
          </div>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">1. Acceptance of Terms</h2>
            </div>
          <p>By accessing HeartsOnTikTok ("Platform", "Service", "we", "us"), you agree to these Terms. If you disagree, do not use our service. You must be 18+ and legally capable of entering contracts.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">2. Platform Description & Disclaimers</h2>
            </div>
          <p><strong>HeartsOnTikTok is ONLY a marketplace platform with the following features:</strong></p>
          <ul>
            <li><strong>Video Payouts:</strong> KES 50 per 1,000 likes on campaign videos</li>
            <li><strong>Affiliate System:</strong> 30% direct + 5% indirect commissions (4 levels)</li>
            <li><strong>Plan Limits:</strong> Gold (3), Platinum (5), Diamond (10) campaigns/month</li>
            <li><strong>Daily Limits:</strong> KES 10K/15K/20K payout limits per plan</li>
            <li><strong>Pricing:</strong> KES 1,000/3,000/5,500 monthly subscriptions</li>
          </ul>
          <p><strong>WE ARE NOT RESPONSIBLE FOR:</strong></p>
          <ul>
            <li>TikTok account suspensions, bans, or policy violations</li>
            <li>Content removal or community guideline strikes</li>
            <li>Payment processing failures or delays</li>
            <li>Campaign performance or engagement results</li>
            <li>Subscription plan changes or feature modifications</li>
            <li>Third-party platform changes or policies</li>
            <li>Lost earnings, missed opportunities, or business losses</li>
            <li>Technical issues, bugs, or platform downtime</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">3. User Responsibilities</h2>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">ALL USERS MUST:</h3>
          <ul>
            <li>Comply with ALL TikTok terms, policies, and community guidelines</li>
            <li>Ensure content is original and non-infringing</li>
            <li>Disclose sponsored content as required by law</li>
            <li>Maintain account security and authenticity</li>
            <li>Pay all applicable taxes on earnings</li>
            <li>Verify all legal requirements in their jurisdiction</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">4. Complete Limitation of Liability</h2>
            </div>
          <p className="font-bold text-red-600 text-lg">HEARTSONTIKTOK PROVIDES SERVICES "AS IS" WITHOUT ANY WARRANTIES. WE DISCLAIM ALL LIABILITY FOR:</p>
          <ul>
            <li><strong>Account Issues:</strong> Suspensions, bans, restrictions by TikTok or other platforms</li>
            <li><strong>Content Issues:</strong> Removal, strikes, policy violations, copyright claims</li>
            <li><strong>Financial Losses:</strong> Lost revenue, missed opportunities, payment failures</li>
            <li><strong>Technical Problems:</strong> Bugs, downtime, data loss, security breaches</li>
            <li><strong>Third-Party Actions:</strong> Platform changes, policy updates, algorithm changes</li>
            <li><strong>Legal Issues:</strong> Regulatory compliance, tax obligations, licensing requirements</li>
            <li><strong>All Damages:</strong> Direct, indirect, consequential, punitive, or special damages</li>
          </ul>
          <p className="font-bold text-red-600">MAXIMUM LIABILITY LIMITED TO KES 100 TOTAL.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">5. Full Indemnification</h2>
            </div>
          <p><strong>Users agree to indemnify, defend, and hold harmless HeartsOnTikTok from ALL claims, damages, costs, and expenses including attorney fees arising from:</strong></p>
          <ul>
            <li>User content, activities, or conduct</li>
            <li>Violation of these terms or any laws</li>
            <li>Infringement of third-party rights</li>
            <li>TikTok or platform policy violations</li>
            <li>Tax obligations or regulatory compliance</li>
            <li>Any use of our platform or services</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">6. Payment & Financial Terms</h2>
            </div>
          <p><strong>Subscription Pricing (Monthly, Non-Refundable):</strong></p>
          <ul>
            <li>Gold Plan: KES 1,000/month - 3 campaigns, KES 10,000 daily limit</li>
            <li>Platinum Plan: KES 3,000/month - 5 campaigns, KES 15,000 daily limit</li>
            <li>Diamond Plan: KES 5,500/month - 10 campaigns, KES 20,000 daily limit</li>
          </ul>
          <p><strong>Payout Structure:</strong></p>
          <ul>
            <li>Video earnings: KES 50 per 1,000 likes (all plans)</li>
            <li>Affiliate commissions: 30% direct, 5% indirect (4 levels)</li>
            <li>Daily payout limits enforced automatically</li>
            <li>All payments via M-Pesa through Swapuzi (third-party processor)</li>
          </ul>
          <p><strong>Financial Disclaimers:</strong></p>
          <ul>
            <li>All subscription fees are non-refundable under any circumstances</li>
            <li>Users solely responsible for tax reporting and compliance</li>
            <li>We may modify pricing, limits, or features without notice</li>
            <li>We may suspend payouts for violations or technical issues</li>
            <li>No guarantee of payment processing timing or success</li>
            <li>Minimum payout: KES 10, maximum per transaction: plan limits</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ban className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">7. Prohibited Activities</h2>
            </div>
          <p>Users may not engage in:</p>
          <ul>
            <li>Any fraudulent, misleading, or deceptive practices</li>
            <li>Violation of platform policies or applicable laws</li>
            <li>Harassment, hate speech, or illegal content</li>
            <li>Manipulation of metrics, engagement, or algorithms</li>
            <li>Unauthorized access or system interference</li>
            <li>Any activity that could harm our reputation or operations</li>
          </ul>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">8. Account Termination</h2>
          <p><strong>We may suspend or terminate accounts immediately at our sole discretion for any reason or no reason. No refunds, credits, or compensation will be provided for terminated accounts.</strong></p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">9. Intellectual Property</h2>
          <p>Users retain content ownership but grant us unlimited license to use, display, and process content. Users must respect all intellectual property rights and assume full liability for infringement claims.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">10. Dispute Resolution</h2>
          <p><strong>ALL disputes resolved through binding arbitration in Nairobi, Kenya. Users waive rights to jury trials and class actions. Kenyan law governs all disputes.</strong></p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">11. Modifications</h2>
          <p>We may modify terms at any time without notice. Continued use constitutes acceptance. Users responsible for reviewing terms regularly.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">12. Force Majeure</h2>
          <p>We are not liable for delays or failures due to circumstances beyond our control including but not limited to: natural disasters, government actions, internet outages, third-party platform changes, or technical failures.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">13. Severability</h2>
          <p>If any provision is deemed invalid, the remaining terms remain in full effect. Invalid provisions will be replaced with similar enforceable terms.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">14. Entire Agreement</h2>
          <p>These terms constitute the complete agreement between parties. No other agreements, representations, or warranties apply.</p>

          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold mb-6">15. Contact</h2>
          <p>Questions about terms should be submitted through our platform support system. We do not guarantee responses to inquiries.</p>

          </section>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-2 border-yellow-500/30 p-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">Final Warning</h3>
              </div>
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-4">
                BY USING HEARTSONTIKTOK, YOU ACKNOWLEDGE THAT:
              </p>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span><span>You understand and accept ALL risks of social media marketing</span></li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span><span>We provide NO guarantees of success, earnings, or account safety</span></li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span><span>You are solely responsible for compliance with all laws and platform policies</span></li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span><span>We assume ZERO liability for any consequences of platform use</span></li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">•</span><span>You will not hold us responsible for any losses or damages</span></li>
              </ul>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}