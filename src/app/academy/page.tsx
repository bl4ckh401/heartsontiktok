import { getFeaturedWorkshops } from '@/lib/academy-service';
import { AcademyLayout } from '@/components/academy/academy-layout';
import { CourseCard } from '@/components/academy/course-card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

export default async function AcademyPage() {
  const workshops = await getFeaturedWorkshops();

  return (
    <AcademyLayout>
      
      {/* Search / Filter Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Featured Workshops</h2>
        
        <div className="relative w-full sm:w-[350px]">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
             <Search className="w-4 h-4" />
           </div>
           <Input 
             placeholder="Search for courses..." 
             className="pl-10 bg-white/5 border-white/10 focus:border-purple-500 rounded-xl"
           />
        </div>
      </div>

      {/* Grid */}
      {workshops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workshops.map((workshop) => (
            <CourseCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-3xl border-dashed border-white/10 bg-white/5">
           <div className="p-4 rounded-full bg-white/5 mb-4">
             <Search className="w-8 h-8 text-gray-500" />
           </div>
           <h3 className="text-xl font-medium text-white mb-2">No workshops found</h3>
           <p className="text-gray-400 max-w-sm">
             Our top creators are busy crafting the next generation of content. Check back soon!
           </p>
        </div>
      )}

    </AcademyLayout>
  );
}
