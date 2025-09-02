
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TikTokIcon } from '@/components/tiktok-icon';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const plan = searchParams.get('plan');
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (errorDescription) {
      toast({
        title: 'Authentication Error',
        description: decodeURIComponent(errorDescription),
        variant: 'destructive',
      });
      router.replace('/login', { scroll: false });
    }
  }, [errorDescription, toast, router]);

  useEffect(() => {
    if (ref) {
      // Set a cookie to store the referral ID
      document.cookie = `referral_id=${ref}; path=/; max-age=86400`; // Expires in 1 day
    }
  }, [ref]);

  const authUrl = plan ? `/api/auth/tiktok?plan=${plan}` : '/api/auth/tiktok';

  const errorMessages: { [key: string]: string } = {
    tiktok_auth_failed: 'Authentication with TikTok failed. Please try again.',
    invalid_state: 'Invalid state. The request could not be verified, please try again.',
    missing_code: 'The authorization code was not provided by TikTok. Please try again.',
    token_exchange_failed: 'Could not verify your TikTok account. Please check your app configuration and try again.',
    generic_error: 'An unexpected error occurred. Please try again later.',
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{errorMessages[error] || 'Authentication Error'}</AlertTitle>
          {errorDescription && <AlertDescription>{decodeURIComponent(errorDescription)}</AlertDescription>}
        </Alert>
      )}
      <Button asChild className="w-full" size="lg">
        <Link href={authUrl} className="flex items-center gap-3">
          <TikTokIcon className="h-6 w-6" />
          Continue with TikTok
        </Link>
      </Button>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to hearts on tiktok</h1>
          <p className="text-muted-foreground mt-2">The mission control center for your creator career.</p>
        </div>
        
        <div className="space-y-4">
          <Suspense fallback={<Button className="w-full" size="lg" disabled>Loading...</Button>}>
            <LoginContent />
          </Suspense>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to hearts on tiktok’s <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
