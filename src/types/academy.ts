export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in seconds
  order: number;
  isFreePreview?: boolean;
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'file';
  }[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Workshop {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price?: number; // 0 or undefined for free
  category: 'content-creation' | 'marketing' | 'editing' | 'storytelling' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  modules: Module[];
  totalDuration: number; // in seconds
  totalLessons: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  studentCount: number;
  rating?: number;
}

export interface Enrollment {
  id: string; 
  userId: string;
  workshopId: string;
  progress: {
    [lessonId: string]: {
      completed: boolean;
      lastWatchedPosition?: number; // timestamp in video
      completedAt?: string;
    };
  };
  enrolledAt: string;
  completedAt?: string;
  status: 'active' | 'completed';
}
