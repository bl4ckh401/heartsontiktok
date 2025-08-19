import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { TikTokIcon } from '@/components/tiktok-icon';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Welcome to VeriFlow</h1>
          <p className="text-muted-foreground mt-2">The mission control center for your creator career.</p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/api/auth/tiktok" className="flex items-center gap-3">
              <TikTokIcon className="h-6 w-6" />
              Continue with TikTok
            </Link>
          </Button>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to VeriFlow’s <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
