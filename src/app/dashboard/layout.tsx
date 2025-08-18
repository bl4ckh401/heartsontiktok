'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Banknote,
  LayoutDashboard,
  Megaphone,
  User,
  PanelLeft,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/icons';
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
import Image from 'next/image';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/payouts', label: 'Payouts', icon: Banknote },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) =>
    navLinks.map(link => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex items-center gap-4 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-foreground',
          pathname === link.href && 'bg-secondary text-foreground',
          isMobile && 'text-lg'
        )}
      >
        <link.icon className="h-5 w-5" />
        {link.label}
      </Link>
    ));

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-6">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Logo className="h-6 w-6 text-primary" />
              <span>VeriFlow</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-base font-medium">
              {renderNavLinks()}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" variant="secondary" className="w-full">
                <Settings className="h-4 w-4 mr-2"/>
                Settings
              </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-4 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="">VeriFlow</span>
                </Link>
                {renderNavLinks(true)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                <div className="relative h-10 w-10">
                  <Image
                    src="https://placehold.co/40x40.png"
                    alt="User Avatar"
                    layout="fill"
                    className="rounded-full"
                    data-ai-hint="user avatar"
                  />
                </div>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6 bg-secondary/40">
          {children}
        </main>
      </div>
    </div>
  );
}
