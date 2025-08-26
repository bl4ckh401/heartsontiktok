
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              VeriFlow
            </span>{' '}
            is Your
          </h1>{' '}
          Creator{' '}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Mission Control
            </span>{' '}
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Manage brand partnerships, monetize content, and track your growth with powerful, intuitive tools. Focus on creating, we'll handle the rest.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3" asChild>
            <Link href="/login">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center lg:justify-start mt-4 space-x-2">
            <div className="flex -space-x-2">
              <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User 1" width={40} height={40} data-ai-hint="creator avatar" />
              <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="User 2" width={40} height={40} data-ai-hint="creator avatar" />
              <Image className="inline-block h-10 w-10 rounded-full ring-2 ring-background" src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="User 3" width={40} height={40} data-ai-hint="creator avatar" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1"/>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1"/>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1"/>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1"/>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                </div>
                <p className="text-sm text-muted-foreground">Loved by 10,000+ creators</p>
            </div>
        </div>
      </div>

      <div className="z-10">
        <Image
          src="https://picsum.photos/800/600"
          alt="Dashboard Preview"
          width={800}
          height={600}
          className="rounded-lg border shadow-lg"
          data-ai-hint="dashboard analytics"
        />
      </div>

      <div
        className="shadow"></div>
    </section>
  );
}
