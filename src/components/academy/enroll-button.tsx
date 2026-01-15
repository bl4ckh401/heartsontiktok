'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { enroll } from '@/app/academy/actions';
import { Loader2, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EnrollButtonProps {
  workshopId: string;
  firstLessonId?: string;
  isEnrolled: boolean;
}

export function EnrollButton({ workshopId, firstLessonId, isEnrolled }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    if (isEnrolled) {
      if (firstLessonId) {
        router.push(`/academy/${workshopId}/learn/${firstLessonId}`);
      }
      return;
    }

    setLoading(true);
    try {
      await enroll(workshopId);
      router.refresh(); // Refresh to update server state (isEnrolled)
      if (firstLessonId) {
        router.push(`/academy/${workshopId}/learn/${firstLessonId}`);
      }
    } catch (error) {
      console.error(error);
      // Optional: Toast error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      size="lg" 
      onClick={handleEnroll} 
      disabled={loading}
      className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isEnrolled ? (
         <>
           <PlayCircle className="w-4 h-4 mr-2" />
           Continue Learning
         </>
      ) : (
        "Start Learning Now"
      )}
    </Button>
  );
}
