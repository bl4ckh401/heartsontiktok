'use client';

import { useState } from 'react';
import { Lesson, Enrollment } from '@/types/academy';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, FileText, Download, ExternalLink, Play } from 'lucide-react';
import { markLessonComplete } from '@/app/academy/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LessonViewerProps {
  workshopId: string;
  lesson: Lesson;
  nextLessonId?: string;
  prevLessonId?: string;
  isCompleted: boolean;
}

export function LessonViewer({ workshopId, lesson, nextLessonId, prevLessonId, isCompleted: initialCompleted }: LessonViewerProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleComplete = async () => {
    setLoading(true);
    const newState = !completed;
    setCompleted(newState); // Optimistic update
    
    try {
      await markLessonComplete(workshopId, lesson.id, newState);
      router.refresh(); // Refresh server state
      
      if (newState && nextLessonId) {
        // Optional: Auto-advance could go here? 
        // For now, let user choose to go next
      }
    } catch (error) {
      console.error(error);
      setCompleted(!newState); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
     if (nextLessonId) {
       router.push(`/academy/${workshopId}/learn/${nextLessonId}`);
     }
  };

   const handlePrev = () => {
     if (prevLessonId) {
       router.push(`/academy/${workshopId}/learn/${prevLessonId}`);
     }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
         {/* Placeholder for actual video player - in real prod use Mux/Vimeo/Youtube player */}
         {/* Since we use direct URLs, standard video tag or iframe if we detect youtube */}
         {(lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('youtu.be')) ? (
           <iframe 
             src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
             className="w-full h-full" 
             allowFullScreen 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           />
         ) : (
           <video 
             src={lesson.videoUrl} 
             controls 
             className="w-full h-full"
             poster="https://placehold.co/1920x1080/1a1a1a/FFF?text=Video+Player"
           />
         )}
      </div>

      {/* Controls & Title */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
           <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
           <p className="text-gray-400 max-w-2xl">{lesson.description}</p>
        </div>

        <div className="flex items-center gap-3">
           <Button
             variant="outline"
             size="sm"
             onClick={handleToggleComplete}
             disabled={loading}
             className={cn(
               "border-white/10 hover:bg-white/5",
               completed ? "text-green-500 hover:text-green-400" : "text-gray-400"
             )}
           >
             {completed ? <CheckCircle className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
             {completed ? "Completed" : "Mark Complete"}
           </Button>
           
           {nextLessonId && (
            <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white">
              Next Lesson <Play className="w-4 h-4 ml-2 fill-current" />
            </Button>
           )}
        </div>
      </div>

      {/* Resources & Notes */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Lesson Resources
          </h3>
          <div className="space-y-3">
             {lesson.resources.map((res, i) => (
               <a 
                 key={i} 
                 href={res.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
               >
                 <div className="flex items-center gap-3">
                   {res.type === 'pdf' ? <FileText className="w-4 h-4 text-red-400" /> : 
                    res.type === 'link' ? <ExternalLink className="w-4 h-4 text-blue-400" /> : 
                    <Download className="w-4 h-4 text-green-400" />}
                   <span className="text-sm font-medium text-gray-300 group-hover:text-white">{res.title}</span>
                 </div>
                 <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
               </a>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
