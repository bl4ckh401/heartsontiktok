
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
            'flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition-all duration-300 group relative overflow-hidden',
            isActive ? 'text-white bg-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'hover:bg-white/5 hover:text-white',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={(e) => disabled && e.preventDefault()}
          aria-disabled={disabled}
        >
        {isActive && (
          <div className="absolute inset-y-0 left-0 w-1 bg-primary shadow-[0_0_10px_var(--primary)]" />
        )}
        <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "")} />
        <span className="font-medium tracking-wide">{label}</span>
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
  const useRouterObj = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'LOADING' | 'ACTIVE' | 'INACTIVE'>('LOADING');

  const fetchSubStatus = useCallback(async () => {
      try {
        const res = await fetch('/api/user/status');
        if (res.ok) {
            const data = await res.json();
            setSubscriptionStatus(data.subscriptionStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE');
            setUserRole(data.role || 'user');
        } else {
            setSubscriptionStatus('INACTIVE');
            setUserRole('user');
        }
      } catch (error) {
        console.error("Failed to fetch user status", error);
        setSubscriptionStatus('INACTIVE');
        setUserRole('user');
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
    
    // Redirect non-admin users away from admin pages
    if (pathname === '/dashboard/admin' && userRole !== 'admin') {
      useRouterObj.push('/dashboard');
      return;
    }
    
    if (!isSubscribed && pathname !== '/dashboard/subscription' && pathname !== '/dashboard/admin') {
      useRouterObj.push('/dashboard/subscription');
    }
  }, [subscriptionStatus, isSubscribed, pathname, useRouterObj, userRole]);


  const NavContent = ({ inSheet = false }) => (
    <nav className={cn(
      "grid items-start text-sm font-medium gap-2",
      inSheet ? "text-lg" : "px-3"
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
          disabled={!isSubscribed && item.href !== '/dashboard/subscription' && item.href !== '/dashboard/admin'}
        />
      ))}
    </nav>
  );

  const BackgroundBlobs = () => (
    <>
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-pulse duration-[10000ms]" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-pulse duration-[15000ms]" />
    </>
  );

  const MainContent = () => (
    <div className="flex flex-col relative min-h-screen">
      <header className="flex h-20 items-center gap-4 px-4 lg:px-8 py-4 sticky top-0 z-40 w-full transition-all duration-300">
        <div className="glass-panel w-full h-full rounded-2xl flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col glass-panel border-r border-white/10 p-0">
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <Logo className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">LikezBuddy</span>
                  </Link>
                </div>
                <div className="p-4">
                  <NavContent inSheet={true} />
                </div>
              </SheetContent>
            </Sheet>
            {/* Breabcrumb or Page Title Could Go Here */}
          </div>

          <div className="flex items-center gap-3">
            <OnboardingTrigger />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-10 w-10 border border-white/10 overflow-hidden ring-2 ring-transparent hover:ring-primary/50 transition-all">
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
              <DropdownMenuContent align="end" className="glass-panel border-white/10 w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.display_name || 'My Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
                  <Link href="/dashboard/subscription" className="flex items-center w-full">
                    <CreditCard className="mr-2 h-4 w-4 text-primary" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-red-500/20 cursor-pointer">
                  <Link href="/api/auth/logout" className="flex items-center w-full text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8 overflow-x-hidden relative z-10 animate-fade-in-up">
          {showSubscriptionGate ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">Access Restricted</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Upgrade your plan to unlock premium features and maximize your reach.
              </p>
              <Button asChild size="lg" className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25 border-0">
                <Link href="/dashboard/subscription">Check Subscription Status</Link>
              </Button>
            </div>
          </div>
          ) : children}
        </main>
      </div>
  );

  if (subscriptionStatus === 'LOADING') {
      return (
         <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
          <BackgroundBlobs />
          <div className="glass-panel p-8 rounded-3xl flex flex-col items-center gap-4 relative z-10 w-full max-w-sm">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading experience...</p>
          </div>
         </div>
      )
  }

  return (
    <OnboardingProvider>
      <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
        <BackgroundBlobs />

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[280px] p-4 h-screen sticky top-0 z-30">
          <div className="glass-panel w-full h-full rounded-2xl flex flex-col overflow-hidden">
            <div className="flex h-20 items-center px-6 border-b border-white/5">
              <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all duration-500">
                  <Logo className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-bold tracking-tight group-hover:text-white transition-colors">LikezBuddy</span>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-2 custom-scrollbar">
              <NavContent />
            </div>

            <div className="p-4 mt-auto">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                <h4 className="font-semibold text-sm mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative z-10">Pro Creator Tips</h4>
                <p className="text-xs text-muted-foreground mb-3 relative z-10">Maximize your earnings with our daily guide.</p>
                <Button variant="outline" size="sm" className="w-full h-8 text-xs border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition-all relative z-10 bg-transparent">View Guide</Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col md:max-w-[calc(100vw-280px)]">
          <MainContent />
        </div>

        <WelcomeModal />
        <OnboardingWrapper />
        <FloatingHelp />
      </div>
    </OnboardingProvider>
  );
}
