'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { TikTokIcon } from '@/components/tiktok-icon';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'login_successful') {
        toast({
            title: "Login Successful",
            description: "Welcome to your dashboard!",
        });
        // clean up the URL
        router.replace('/dashboard'); 
    }
  }, [searchParams, toast, router]);


  const errorMessages: { [key: string]: string } = {
    tiktok_auth_failed: 'Authentication with TikTok failed. Please try again.',
    invalid_state: 'Invalid state. The request could not be verified, please try again.',
    missing_code: 'The authorization code was not provided by TikTok. Please try again.',
    token_exchange_failed: 'Could not verify your TikTok account. Please try again later.',
  };

  const errorMessage = error ? errorMessages[error] : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Welcome to VeriFlow</h1>
          <p className="text-muted-foreground mt-2">The mission control center for your creator career.</p>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
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
