import Link from 'next/link';
import Image from 'next/image';
import { Clock, BookOpen, User, PlayCircle, Star } from 'lucide-react';
import { Workshop } from '@/types/academy';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  workshop: Workshop;
}

export function CourseCard({ workshop }: CourseCardProps) {
  return (
    <Link href={`/academy/${workshop.id}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:-translate-y-1">
        
        {/* Thumbnail Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={workshop.thumbnailUrl || "https://placehold.co/600x400.png"}
            alt={workshop.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
             <Badge variant="secondary" className="bg-black/50 backdrop-blur-md border-white/10 text-xs uppercase tracking-wider">
               {workshop.difficulty}
             </Badge>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transform scale-90 group-hover:scale-100 transition-transform">
              <PlayCircle className="w-8 h-8 fill-current" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col h-[calc(100%-aspect-ratio)]">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-[10px] text-purple-300 border-purple-500/30 uppercase tracking-widest">
              {workshop.category?.replace('-', ' ')}
            </Badge>
            {workshop.rating && (
                <div className="flex items-center gap-1 text-xs text-yellow-400 ml-auto font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{workshop.rating}</span>
                </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
            {workshop.title}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
            {workshop.description}
          </p>

          <div className="pt-4 border-t border-white/10 mt-auto space-y-3">
             
            {/* Instructor */}
            <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-gray-800">
                    {workshop.creatorPhotoURL ? (
                        <Image src={workshop.creatorPhotoURL} alt={workshop.creatorName} fill className="object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                </div>
                <span className="text-xs font-medium text-gray-300">{workshop.creatorName}</span>
            </div>
            
            {/* Meta Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {workshop.totalLessons} Lessons
                </span>
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(workshop.totalDuration / 60)}m
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Link>
  );
}
