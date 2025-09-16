import { Logo } from '@/components/icons';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-red-800 font-bold text-xl mb-2">⚠️ IMPORTANT LEGAL NOTICE</h2>
            <p className="text-red-700 font-semibold">BY USING HEARTSONTIKTOK, YOU ASSUME ALL RISKS. WE ARE NOT RESPONSIBLE FOR ANY LOSSES, DAMAGES, OR CONSEQUENCES.</p>
          </div>

          <h2>1. ACCEPTANCE OF TERMS</h2>
          <p>By accessing HeartsOnTikTok ("Platform", "Service", "we", "us"), you agree to these Terms. If you disagree, do not use our service. You must be 18+ and legally capable of entering contracts.</p>

          <h2>2. PLATFORM DESCRIPTION & DISCLAIMERS</h2>
          <p><strong>HeartsOnTikTok is ONLY a marketplace platform connecting creators and sponsors. WE ARE NOT RESPONSIBLE FOR:</strong></p>
          <ul>
            <li>TikTok account suspensions, bans, or policy violations</li>
            <li>Content removal or community guideline strikes</li>
            <li>Payment disputes between users</li>
            <li>Campaign performance or results</li>
            <li>Content quality, accuracy, or compliance</li>
            <li>Third-party platform changes or policies</li>
            <li>Lost earnings or business opportunities</li>
            <li>Technical issues or platform downtime</li>
          </ul>

          <h2>3. USER RESPONSIBILITIES</h2>
          <h3>ALL USERS MUST:</h3>
          <ul>
            <li>Comply with ALL TikTok terms, policies, and community guidelines</li>
            <li>Ensure content is original and non-infringing</li>
            <li>Disclose sponsored content as required by law</li>
            <li>Maintain account security and authenticity</li>
            <li>Pay all applicable taxes on earnings</li>
            <li>Verify all legal requirements in their jurisdiction</li>
          </ul>

          <h2>4. COMPLETE LIMITATION OF LIABILITY</h2>
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

          <h2>5. FULL INDEMNIFICATION</h2>
          <p><strong>Users agree to indemnify, defend, and hold harmless HeartsOnTikTok from ALL claims, damages, costs, and expenses including attorney fees arising from:</strong></p>
          <ul>
            <li>User content, activities, or conduct</li>
            <li>Violation of these terms or any laws</li>
            <li>Infringement of third-party rights</li>
            <li>TikTok or platform policy violations</li>
            <li>Tax obligations or regulatory compliance</li>
            <li>Any use of our platform or services</li>
          </ul>

          <h2>6. PAYMENT & FINANCIAL TERMS</h2>
          <ul>
            <li>All payments processed by third-party providers (we are not liable for payment issues)</li>
            <li>Platform fees are non-refundable under all circumstances</li>
            <li>Users solely responsible for tax reporting and compliance</li>
            <li>Payout limits based on subscription plans (subject to change)</li>
            <li>We may suspend payouts for any reason without notice</li>
            <li>No guarantee of payment processing or timing</li>
          </ul>

          <h2>7. PROHIBITED ACTIVITIES</h2>
          <p>Users may not engage in:</p>
          <ul>
            <li>Any fraudulent, misleading, or deceptive practices</li>
            <li>Violation of platform policies or applicable laws</li>
            <li>Harassment, hate speech, or illegal content</li>
            <li>Manipulation of metrics, engagement, or algorithms</li>
            <li>Unauthorized access or system interference</li>
            <li>Any activity that could harm our reputation or operations</li>
          </ul>

          <h2>8. ACCOUNT TERMINATION</h2>
          <p><strong>We may suspend or terminate accounts immediately at our sole discretion for any reason or no reason. No refunds, credits, or compensation will be provided for terminated accounts.</strong></p>

          <h2>9. INTELLECTUAL PROPERTY</h2>
          <p>Users retain content ownership but grant us unlimited license to use, display, and process content. Users must respect all intellectual property rights and assume full liability for infringement claims.</p>

          <h2>10. DISPUTE RESOLUTION</h2>
          <p><strong>ALL disputes resolved through binding arbitration in Nairobi, Kenya. Users waive rights to jury trials and class actions. Kenyan law governs all disputes.</strong></p>

          <h2>11. MODIFICATIONS</h2>
          <p>We may modify terms at any time without notice. Continued use constitutes acceptance. Users responsible for reviewing terms regularly.</p>

          <h2>12. FORCE MAJEURE</h2>
          <p>We are not liable for delays or failures due to circumstances beyond our control including but not limited to: natural disasters, government actions, internet outages, third-party platform changes, or technical failures.</p>

          <h2>13. SEVERABILITY</h2>
          <p>If any provision is deemed invalid, the remaining terms remain in full effect. Invalid provisions will be replaced with similar enforceable terms.</p>

          <h2>14. ENTIRE AGREEMENT</h2>
          <p>These terms constitute the complete agreement between parties. No other agreements, representations, or warranties apply.</p>

          <h2>15. CONTACT</h2>
          <p>Questions about terms should be submitted through our platform support system. We do not guarantee responses to inquiries.</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-yellow-800 text-lg mb-2">🚨 FINAL WARNING</h3>
            <p className="text-yellow-700 font-semibold">
              BY USING HEARTSONTIKTOK, YOU ACKNOWLEDGE THAT:
            </p>
            <ul className="text-yellow-700 mt-2">
              <li>• You understand and accept ALL risks of social media marketing</li>
              <li>• We provide NO guarantees of success, earnings, or account safety</li>
              <li>• You are solely responsible for compliance with all laws and platform policies</li>
              <li>• We assume ZERO liability for any consequences of platform use</li>
              <li>• You will not hold us responsible for any losses or damages</li>
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}