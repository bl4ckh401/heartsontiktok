
import { Logo } from '@/components/icons';
import { TikTokIcon } from '../tiktok-icon';
import { Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">VeriFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The mission control center for your creator career.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold">Platform</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between border-t pt-6 sm:flex-row">
          <p className="mt-4 text-sm text-muted-foreground sm:mt-0">
            &copy; {new Date().getFullYear()} VeriFlow Inc. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground"><TikTokIcon className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
