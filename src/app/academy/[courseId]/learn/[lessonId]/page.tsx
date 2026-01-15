import { getWorkshopById, getEnrollment } from '@/lib/academy-service';
import { LessonViewer } from '@/components/academy/lesson-viewer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Play, ChevronLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const { courseId, lessonId } = params;
  
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session?.value) {
    redirect('/login');
  }
  const userId = session.value;

  const [workshop, enrollment] = await Promise.all([
    getWorkshopById(courseId),
    getEnrollment(userId, courseId)
  ]);

  if (!workshop) redirect('/academy');
  if (!enrollment) redirect(`/academy/${courseId}`); // Must redirect to course page if not enrolled
  
  // Flatten curriculum logic to find current, prev, next
  const allLessons = workshop.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  
  if (currentIndex === -1) {
      return <div className="p-10 text-center text-white">Lesson not found</div>;
  }

  const currentLesson = allLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined;

  const isCompleted = enrollment.progress[lessonId]?.completed || false;

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar Navigation */}
      <div className="w-[350px] border-r border-white/10 flex flex-col hidden lg:flex bg-[#0a0a0a]">
         <div className="p-4 border-b border-white/10">
           <Link href={`/academy/${courseId}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
             <ChevronLeft className="w-4 h-4" />
             Back to Course Home
           </Link>
           <h2 className="font-bold text-white line-clamp-2">{workshop.title}</h2>
           
           {/* Overall Progress Bar could go here */}
           
         </div>
         
         <ScrollArea className="flex-1">
           <div className="p-4 space-y-6">
             {workshop.modules.map((module, i) => (
               <div key={module.id}>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Module {i + 1}: {module.title}</h3>
                 <div className="space-y-1">
                   {module.lessons.map((l) => {
                     const isLessonCompleted = enrollment.progress[l.id]?.completed;
                     const isActive = l.id === lessonId;
                     
                     return (
                       <Link 
                         key={l.id} 
                         href={`/academy/${courseId}/learn/${l.id}`}
                         className={cn(
                            "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors",
                            isActive ? "bg-purple-500/10 text-purple-300" : "hover:bg-white/5 text-gray-300 hover:text-white"
                         )}
                       >
                         {isLessonCompleted ? (
                           <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                         ) : (
                           isActive ? <Play className="w-4 h-4 fill-current shrink-0" /> : <Circle className="w-4 h-4 shrink-0 text-gray-600" />
                         )}
                         <span className="line-clamp-1">{l.title}</span>
                         <span className="ml-auto text-xs text-gray-600 font-mono">{Math.floor(l.duration / 60)}m</span>
                       </Link>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
         </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Mobile Header (Basic) */}
         <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
            <Link href={`/academy/${courseId}`} className="text-gray-400"><ChevronLeft /></Link>
            <span className="font-bold text-white truncate max-w-[200px]">{currentLesson.title}</span>
            <div className="w-6" /> {/* spacer */}
         </div>

         <ScrollArea className="flex-1">
            <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto w-full">
              <LessonViewer 
                workshopId={courseId} 
                lesson={currentLesson} 
                nextLessonId={nextLesson?.id}
                prevLessonId={prevLesson?.id}
                isCompleted={isCompleted}
              />
            </div>
         </ScrollArea>
      </div>
    </div>
  );
}
