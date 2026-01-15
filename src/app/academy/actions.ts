'use server';

import { cookies } from 'next/headers';
import { enrollUser } from '@/lib/academy-service';
import { redirect } from 'next/navigation';

export async function enroll(workshopId: string) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session?.value) {
        redirect('/login');
    }

    const userId = session.value;

    try {
        await enrollUser(userId, workshopId);
    } catch (error) {
        console.error('Enrollment failed:', error);
        throw new Error('Failed to enroll in the workshop');
    }

    // Find the first lesson to redirect to
    // For now, simpler to just redirect to the course page which will have the "Start" button change to "Continue"
    // or we can redirect to the learn page directly if we fetch the workshop here.
    // But strictly, enroll just enrolls.
}

export async function markLessonComplete(workshopId: string, lessonId: string, completed: boolean) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session?.value) {
        throw new Error("Unauthorized");
    }

    const userId = session.value;

    // Dynamic import or keeping imports at top? 
    // We already imported at top, so just use helper
    const { updateLessonProgress } = await import('@/lib/academy-service');

    try {
        await updateLessonProgress(userId, workshopId, lessonId, completed);
        return { success: true };
    } catch (error) {
        console.error('Failed to update progress', error);
        return { success: false, error };
    }
}
