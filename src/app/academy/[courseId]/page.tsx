import { getWorkshopById, getEnrollment } from '@/lib/academy-service';
import { AcademyLayout } from '@/components/academy/academy-layout';
import { EnrollButton } from '@/components/academy/enroll-button';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Star, User, Play, Lock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default async function WorkshopPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const workshop = await getWorkshopById(courseId);

  if (!workshop) {
    return (
      <AcademyLayout>
        <div className="text-center py-20 text-white">Workshop not found</div>
      </AcademyLayout>
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const userId = session?.value;
  
  let isEnrolled = false;
  if (userId) {
    const enrollment = await getEnrollment(userId, courseId);
    isEnrolled = !!enrollment;
  }

  // Find first lesson for the button
  const firstLessonId = workshop.modules[0]?.lessons[0]?.id;

  return (
    <AcademyLayout title={workshop.title} description={workshop.description}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Info Cards */}
           <div className="flex flex-wrap gap-4">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-gray-300">
               <Clock className="w-4 h-4 text-purple-400" />
               {Math.round(workshop.totalDuration / 60)} Minutes
             </div>
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-gray-300">
               <BookOpen className="w-4 h-4 text-purple-400" />
               {workshop.totalLessons} Lessons
             </div>
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-gray-300 capitalize">
               <Badge variant="secondary" className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">{workshop.difficulty}</Badge>
             </div>
           </div>

           {/* Curriculum */}
           <div className="space-y-4">
             <h2 className="text-2xl font-bold text-white">Curriculum</h2>
             <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={workshop.modules[0]?.id}>
                {workshop.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id} className="border-none bg-white/5 rounded-2xl overflow-hidden px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-purple-300">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{module.title}</div>
                          {module.description && <div className="text-sm text-gray-500 font-normal">{module.description}</div>}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                       <div className="space-y-2 pl-11">
                         {module.lessons.map((lesson) => (
                           <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:text-purple-400 transition-colors">
                                  {lesson.isFreePreview || isEnrolled ? <Play className="w-3 h-3 fill-current" /> : <Lock className="w-3 h-3" />}
                                </div>
                                <div>
                                  <div className="text-sm text-gray-300 group-hover:text-white font-medium">{lesson.title}</div>
                                  <div className="text-xs text-gray-500">{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}</div>
                                </div>
                              </div>
                              
                              {lesson.isFreePreview && !isEnrolled && (
                                <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30">Preview</Badge>
                              )}
                           </div>
                         ))}
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
             </Accordion>
           </div>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={workshop.thumbnailUrl} alt={workshop.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white">
                     <Play className="w-6 h-6 fill-current ml-1" />
                   </div>
                </div>
             </div>

             <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                     <Image src={workshop.creatorPhotoURL || "https://placehold.co/100"} alt={workshop.creatorName} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Instructor</div>
                    <div className="font-bold text-white">{workshop.creatorName}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <EnrollButton workshopId={workshop.id} firstLessonId={firstLessonId} isEnrolled={isEnrolled} />
                   {!isEnrolled && (
                     <p className="text-center text-xs text-gray-500 mt-3">
                       Get unlimited access to this course and all resources.
                     </p>
                   )}
                </div>
             </div>
          </div>
        </div>

      </div>
    </AcademyLayout>
  );
}
