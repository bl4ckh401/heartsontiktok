import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { CreatorWorkshopManager } from '@/components/academy/creator-workshop-manager';
import { getWorkshopsByCreator } from '@/lib/academy-service';
import { Lock, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AcademyLayout } from '@/components/academy/academy-layout';

export default async function CreatorAcademyPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session?.value) {
    redirect('/login');
  }

  const userId = session.value;
  const userDoc = await db.firestore().collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    redirect('/login');
  }

  const userData = userDoc.data();
  const followerCount = userData?.followerCount || 0;
  const REQUIRED_FOLLOWERS = 100000;

  // Access Control Check
  if (followerCount < REQUIRED_FOLLOWERS) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-6">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
             <Lock className="w-10 h-10 text-gray-500" />
           </div>
           
           <h1 className="text-3xl font-bold text-white">Creator Access Locked</h1>
           
           <div className="space-y-4">
             <p className="text-gray-400 text-lg">
               To maintain the highest quality of content, the Creator Academy is exclusively available to creators with over <strong>100k followers</strong>.
             </p>
             
             <div className="flex items-center justify-center gap-8 py-4 px-6 bg-black/20 rounded-xl border border-white/5">
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Your Followers</div>
                  <div className="text-2xl font-bold text-white font-mono">{followerCount.toLocaleString()}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                   <div className="text-xs text-gray-500 uppercase tracking-widest">Required</div>
                   <div className="text-2xl font-bold text-purple-400 font-mono">100k</div>
                </div>
             </div>

             <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-1000" 
                  style={{ width: `${Math.min((followerCount / REQUIRED_FOLLOWERS) * 100, 100)}%` }}
                />
             </div>
           </div>
           
           <div className="pt-4">
              <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
           </div>
        </div>
      </div>
    );
  }

  // If passed check
  const workshops = await getWorkshopsByCreator(userId);

  return (
    <div className="p-8 space-y-8">
       <div className="flex items-center gap-3 mb-8">
         <BadgeCheck className="w-8 h-8 text-blue-400" />
         <h1 className="text-3xl font-bold text-white">Creator Studio</h1>
         <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 font-medium">Verified Creator</div>
       </div>
       
       <CreatorWorkshopManager initialWorkshops={workshops} />
    </div>
  );
}
