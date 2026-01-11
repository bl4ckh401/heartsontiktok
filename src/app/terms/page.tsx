import { Logo } from '@/components/icons';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center place-content-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ArrowLeft className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">likezBuddy</span>
          </div>
        </div>
      </header>

      <main className="container py-12 md:py-20 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Please read these terms carefully before using our platform. They contain important information regarding your legal rights and remedies.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Last Updated: {new Date().toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Scale className="w-4 h-4" /> Legal Agreement</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-12 relative">

          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden md:block">
            <nav className="sticky top-24 space-y-1">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Contents</p>
              <a href="#acceptance" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">1. Acceptance</a>
              <a href="#platform" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">2. Platform & Earnings</a>
              <a href="#responsibilities" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">3. Responsibilities</a>
              <a href="#liability" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">4. Liability Limits</a>
              <a href="#payment" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">5. Payment Terms</a>
              <a href="#termination" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">6. Termination</a>
            </nav>
          </aside>

          {/* Content Content */}
          <article className="prose prose-invert prose-lg max-w-none space-y-12">

            {/* Intro Alert */}
            <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-6 md:p-8 not-prose">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-500 mb-2">Risk Acknowledgement</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By using LikezBuddy, you acknowledge that social media monetization involves inherent risks. We are not responsible for account suspensions, bans, or lost earnings resulting from platform policy changes (TikTok, etc.). Use at your own risk.
                  </p>
                </div>
              </div>
            </div>

            <section id="acceptance" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing or using LikezBuddy ("Platform"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service. You represent that you are over the age of 18 and legally capable of entering into binding contracts.
              </p>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="platform" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                Platform Description
              </h2>
              <p className="text-muted-foreground mb-4">
                LikezBuddy acts as an intermediary marketplace connecting creators with campaigns. We do not own the social platforms (TikTok) where content is posted.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="font-semibold text-foreground mb-1">Earning Rates</h4>
                  <p className="text-sm text-muted-foreground">KES 50 per 1,000 verified likes on active campaigns.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="font-semibold text-foreground mb-1">Affiliates</h4>
                  <p className="text-sm text-muted-foreground">Earn up to 30% direct commission + 5% indirect rewards.</p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="responsibilities" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
                User Responsibilities
              </h2>
              <ul className="space-y-3 text-muted-foreground text-base list-none pl-0">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                  <span>You must comply with all TikTok Community Guidelines and Terms of Service.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                  <span>You are solely responsible for paying any applicable taxes on your earnings.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                  <span>You agree not to use bots, fake engagement, or manipulation tactics.</span>
                </li>
              </ul>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="liability" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">4</span>
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-6">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, LIKEZBUDDY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 not-prose">
                <p className="text-sm font-medium text-foreground mb-2">We are specifically NOT liable for:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• TikTok account bans or "shadowbans"</li>
                  <li>• Rejected payouts due to suspicious activity</li>
                  <li>• Content copyright claims</li>
                </ul>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="payment" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">5</span>
                Payment & Financial Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                All payments are processed via M-Pesa. Subscription fees for paid plans (Gold, Platinum, Diamond) are non-refundable.
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10 not-prose">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-foreground font-medium">
                    <tr>
                      <th className="p-4">Plan Tier</th>
                      <th className="p-4">Daily Limit</th>
                      <th className="p-4">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-muted-foreground">
                    <tr>
                      <td className="p-4 text-foreground">Gold</td>
                      <td className="p-4">KES 10,000</td>
                      <td className="p-4">KES 1,000/mo</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-foreground">Platinum</td>
                      <td className="p-4">KES 15,000</td>
                      <td className="p-4">KES 3,000/mo</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-foreground">Diamond</td>
                      <td className="p-4">KES 20,000</td>
                      <td className="p-4">KES 5,500/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="termination" className="scroll-mt-24 pb-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">6</span>
                Termination
              </h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}