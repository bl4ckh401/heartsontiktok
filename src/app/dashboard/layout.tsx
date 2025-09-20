
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Home,
  LayoutGrid,
  Megaphone,
  Plus,
  Settings,
  Wallet,
  Menu,
  User,
  LogOut,
  Users,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OnboardingProvider, OnboardingTour, OnboardingTrigger, WelcomeModal, FloatingHelp, useOnboarding } from '@/components/onboarding';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/campaigns/list', label: 'Campaigns', icon: Megaphone },
  { href: '/dashboard/payouts', label: 'Payouts', icon: Wallet },
  { href: '/dashboard/affiliates', label: 'Affiliates', icon: Users },
  { href: '/dashboard/admin', label: 'Admin', icon: ShieldAlert, adminOnly: true },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard, mobileOnly: true },
];

function NavLink({ href, icon: Icon, label, disabled }: { href: string; icon: React.ElementType; label: string; disabled: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
          href={disabled ? '#' : href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            isActive && 'bg-muted text-primary',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={(e) => disabled && e.preventDefault()}
          aria-disabled={disabled}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
    )
}

function OnboardingWrapper() {
  const { isOnboardingOpen, closeOnboarding } = useOnboarding();
  return <OnboardingTour isOpen={isOnboardingOpen} onClose={closeOnboarding} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'LOADING' | 'ACTIVE' | 'INACTIVE'>('LOADING');

  const fetchSubStatus = useCallback(async () => {
      try {
        const res = await fetch('/api/user/status');
        if (res.ok) {
            const data = await res.json();
            setSubscriptionStatus(data.subscriptionStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE');
        } else {
            setSubscriptionStatus('INACTIVE');
        }
      } catch (error) {
        console.error("Failed to fetch user status", error);
        setSubscriptionStatus('INACTIVE');
      }
    }, []);


  useEffect(() => {
    const userInfoCookie = Cookies.get('user_info');
    if (userInfoCookie) {
      const parsedUser = JSON.parse(userInfoCookie);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'user');
    }
    
    fetchSubStatus();
  }, [fetchSubStatus]);
  
  // Poll for subscription status changes
  useEffect(() => {
    if (subscriptionStatus === 'INACTIVE') {
      const intervalId = setInterval(fetchSubStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [subscriptionStatus, fetchSubStatus]);


  const isSubscribed = subscriptionStatus === 'ACTIVE';
  const showSubscriptionGate = !isSubscribed && pathname !== '/dashboard/subscription';

  useEffect(() => {
    if (subscriptionStatus === 'LOADING') {
        return; // Don't redirect while we're still checking the status
    }
    
    if (!isSubscribed && pathname !== '/dashboard/subscription') {
      router.push('/dashboard/subscription');
    }
  }, [subscriptionStatus, isSubscribed, pathname, router]);


  const NavContent = ({ inSheet = false }) => (
    <nav className={cn(
        "grid items-start text-sm font-medium",
        inSheet ? "gap-2 text-lg" : "px-2 lg:px-4"
    )}>
      {navItems
        .filter(item => inSheet ? true : !item.mobileOnly)
        .filter(item => item.adminOnly ? userRole === 'admin' : true)
        .map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          icon={item.icon}
          label={item.label}
          disabled={!isSubscribed && item.href !== '/dashboard/subscription' && !item.adminOnly}
        />
      ))}
    </nav>
  );

  const MainContent = () => (
    <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Logo className="h-6 w-6 text-primary" />
                <span className="">VeriFlow</span>
              </Link>
              <NavContent inSheet={true} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <OnboardingTrigger />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {user ? (
                  <Image
                    src={user.avatar_url || "https://placehold.co/40x40.png"}
                    width={40} height={40} alt={user.display_name || "User Avatar"}
                    className="rounded-full"
                    data-ai-hint="creator avatar"
                  />
                ) : <User className="h-5 w-5" />}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? user.display_name : 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/api/auth/logout" className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {showSubscriptionGate ? (
              <div className="flex items-center justify-center h-full">
                  <Alert className="max-w-md">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>Subscription Required</AlertTitle>
                      <AlertDescription>
                          Please choose a subscription plan to access this page and unlock all features.
                      </AlertDescription>
                  </Alert>
              </div>
          ) : children}
        </main>
      </div>
  )

  if (subscriptionStatus === 'LOADING') {
      return (
         <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2 p-2">
                        <Skeleton className="h-14" />
                        <Skeleton className="h-full" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Skeleton className="h-8 w-8" />
                         <div className="w-full flex-1" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </header>
                    <main className="flex-1 p-6">
                        <Skeleton className="w-full h-full" />
                    </main>
                </div>
            </div>
         </div>
      )
  }

  return (
    <OnboardingProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span>Hearts On Tiktok</span>
              </Link>
            </div>
            <div className="flex-1">
              <NavContent />
            </div>
          </div>
        </div>
        <MainContent/>
        <WelcomeModal />
        <OnboardingWrapper />
        <FloatingHelp />
      </div>
    </OnboardingProvider>
  );
}
