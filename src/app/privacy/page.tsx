import { Logo } from '@/components/icons';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Database, Globe, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your privacy is paramount. This policy details how we collect, use, and protect your personal information on the LikezBuddy platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Effective Date: {new Date().toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Data Protection</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-12 relative">

          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden md:block">
            <nav className="sticky top-24 space-y-1">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">Sections</p>
              <a href="#collection" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">1. Data Collection</a>
              <a href="#usage" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">2. Usage</a>
              <a href="#sharing" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">3. Sharing</a>
              <a href="#security" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">4. Security</a>
              <a href="#cookies" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">5. Cookies</a>
            </nav>
          </aside>

          {/* Content Content */}
          <article className="prose prose-invert prose-lg max-w-none space-y-12">

            <section id="collection" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">1</span>
                Information We Collect
              </h2>
              <p className="text-muted-foreground mb-6">
                We collect specific data to enable monetization and platform functionality.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                  <Database className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">Account Data</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• TikTok Phone Number/Email</li>
                    <li>• Profile Statistics</li>
                    <li>• M-Pesa Payment Details</li>
                  </ul>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                  <Eye className="w-6 h-6 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">Usage Metrics</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Login History</li>
                    <li>• Campaign Participation</li>
                    <li>• Transaction Logs</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="usage" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">2</span>
                How We Use Your Data
              </h2>
              <p className="text-muted-foreground">
                We strictly use your data to facilitate the core services of LikezBuddy:
              </p>
              <ul className="space-y-2 text-muted-foreground list-none pl-0 mt-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5" />
                  <span>Processing daily M-Pesa payouts (KES 50/1k likes).</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5" />
                  <span>Verifying campaign performance and calculating earnings.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5" />
                  <span>Preventing fraud and enforcing subscription limits.</span>
                </li>
              </ul>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="sharing" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">3</span>
                Information Sharing
              </h2>
              <p className="text-muted-foreground">
                We do not sell your personal data. We share information only with:
              </p>
              <div className="mt-6 space-y-4 not-prose">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <span className="font-bold min-w-[120px]">Swapuzi</span>
                  <span className="text-sm text-muted-foreground">Payment processor for M-Pesa transactions.</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <span className="font-bold min-w-[120px]">TikTok API</span>
                  <span className="text-sm text-muted-foreground">Integration for content verification.</span>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="security" className="scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">4</span>
                Data Security
              </h2>
              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6 md:p-8 not-prose">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-500 mb-2">Bank-Grade Encryption</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All sensitive financial data is encrypted in transit and at rest. We use industry-standard security protocols to protect your account information.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            <section id="cookies" className="scroll-mt-24 pb-24">
              <h2 className="flex items-center gap-3 text-2xl font-bold mb-6 text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">5</span>
                Cookies & Tracking
              </h2>
              <p className="text-muted-foreground">
                We use cookies solely for session management and user authentication. You can control cookie preferences in your browser settings, though disabling them may affect platform functionality.
              </p>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}