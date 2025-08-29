
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground mt-2">Last updated: August 26, 2025</p>
          </div>

          <h2>1. Agreement to Terms</h2>
          <p>By using our services, you agree to be bound by these Terms. If you do not agree to be bound by these Terms, do not use the services. If you are accessing and using the services on behalf of a company (such as your employer) or other legal entity, you represent and warrant that you have the authority to bind that company or other legal entity to these Terms. In that case, “you” and “your” will refer to that company or other legal entity.</p>

          <h2>2. Privacy Policy</h2>
          <p>Please refer to our Privacy Policy for information on how we collect, use, and disclose information from our users. You acknowledge and agree that your use of the services is subject to our Privacy Policy.</p>

          <h2>3. Changes to Terms or Services</h2>
          <p>We may update the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the updated Terms on the site or through other communications. It’s important that you review the Terms whenever we update them or you use the services. If you continue to use the services after we have posted updated Terms, you are agreeing to be bound by the updated Terms.</p>

          <h2>4. Who May Use the Services?</h2>
          <p>You may use the services only if you are 18 years or older and capable of forming a binding contract with hearts on tiktok and are not barred from using the services under applicable law.</p>

          <h2>5. Content Ownership, Responsibility, and Removal</h2>
          <p>You are responsible for your content. You represent and warrant that you own your content or you have all rights that are necessary to grant us the license rights in your content under these Terms. You also represent and warrant that neither your content, nor your use and provision of your content to be made available through the services, nor any use of your content by hearts on tiktok on or through the services will infringe, misappropriate or violate a third party’s intellectual property rights, or rights of publicity or privacy, or result in the violation of any applicable law or regulation.</p>
          
          <h2>6. General Prohibitions</h2>
          <p>You agree not to do any of the following:</p>
          <ul>
            <li>Post, upload, publish, submit or transmit any content that: (i) infringes, misappropriates or violates a third party’s patent, copyright, trademark, trade secret, moral rights or other intellectual property rights, or rights of publicity or privacy; (ii) violates, or encourages any conduct that would violate, any applicable law or regulation or would give rise to civil liability.</li>
            <li>Use, display, mirror or frame the services or any individual element within the services, hearts on tiktok’s name, any hearts on tiktok trademark, logo or other proprietary information, or the layout and design of any page or form contained on a page, without hearts on tiktok’s express written consent.</li>
            <li>Attempt to probe, scan or test the vulnerability of any hearts on tiktok system or network or breach any security or authentication measures.</li>
          </ul>

          <h2>7. Termination</h2>
          <p>We may terminate your access to and use of the services, at our sole discretion, at any time and without notice to you. You may cancel your account at any time by sending an email to us at [contact@heartsontiktok.com].</p>

          <h2>8. Disclaimers</h2>
          <p>The services and content are provided “AS IS,” without warranty of any kind. Without limiting the foregoing, we explicitly disclaim any warranties of merchantability, fitness for a particular purpose, quiet enjoyment or non-infringement, and any warranties arising out of course of dealing or usage of trade.</p>

          <h2>9. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <address>
            hearts on tiktok Inc.<br />
            123 Creator Lane<br />
            Innovate City, 12345
          </address>
        </article>
      </main>
    </div>
  );
}
