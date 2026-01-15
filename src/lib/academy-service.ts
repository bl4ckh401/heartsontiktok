import db from './firebase-admin';
import { Workshop, Enrollment } from '@/types/academy';

const WORKSHOPS_COLLECTION = 'workshops';
const ENROLLMENTS_COLLECTION = 'enrollments';

// --- Workshop Management ---

export async function createWorkshop(data: Omit<Workshop, 'id' | 'createdAt' | 'updatedAt' | 'studentCount'>) {
  try {
    const docRef = db.firestore().collection(WORKSHOPS_COLLECTION).doc();
    const workshop: Workshop = {
      ...data,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentCount: 0,
    };
    await docRef.set(workshop);
    return workshop;
  } catch (error) {
    console.error('Error creating workshop:', error);
    throw error;
  }
}

export async function updateWorkshop(id: string, data: Partial<Workshop>) {
  try {
    await db.firestore().collection(WORKSHOPS_COLLECTION).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating workshop:', error);
    throw error;
  }
}

export async function getWorkshopById(id: string): Promise<Workshop | null> {
  try {
    const doc = await db.firestore().collection(WORKSHOPS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Workshop;
  } catch (error) {
    console.error('Error fetching workshop:', error);
    throw error;
  }
}

export async function getFeaturedWorkshops(limit = 10): Promise<Workshop[]> {
  try {
    const snapshot = await db.firestore()
      .collection(WORKSHOPS_COLLECTION)
      .where('status', '==', 'published')
      .orderBy('studentCount', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data() as Workshop);
  } catch (error) {
    console.error('Error fetching featured workshops:', error);
    throw error;
  }
}

export async function getWorkshopsByCreator(creatorId: string): Promise<Workshop[]> {
  try {
    const snapshot = await db.firestore()
      .collection(WORKSHOPS_COLLECTION)
      .where('creatorId', '==', creatorId)
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Workshop);
  } catch (error) {
    console.error('Error fetching creator workshops:', error);
    throw error;
  }
}

// --- Enrollment & Progress ---

export async function enrollUser(userId: string, workshopId: string) {
  try {
    // Check if already enrolled
    const existing = await db.firestore()
      .collection(ENROLLMENTS_COLLECTION)
      .where('userId', '==', userId)
      .where('workshopId', '==', workshopId)
      .get();

    if (!existing.empty) {
      return existing.docs[0].data() as Enrollment;
    }

    const docRef = db.firestore().collection(ENROLLMENTS_COLLECTION).doc();
    const enrollment: Enrollment = {
      id: docRef.id,
      userId,
      workshopId,
      progress: {},
      enrolledAt: new Date().toISOString(),
      status: 'active',
    };

    const batch = db.firestore().batch();
    batch.set(docRef, enrollment);
    
    // Increment student count
    const workshopRef = db.firestore().collection(WORKSHOPS_COLLECTION).doc(workshopId);
    batch.update(workshopRef, {
        studentCount: db.firestore.FieldValue.increment(1)
    });

    await batch.commit();
    return enrollment;
  } catch (error) {
    console.error('Error enrolling user:', error);
    throw error;
  }
}

export async function getEnrollment(userId: string, workshopId: string): Promise<Enrollment | null> {
    try {
      const snapshot = await db.firestore()
        .collection(ENROLLMENTS_COLLECTION)
        .where('userId', '==', userId)
        .where('workshopId', '==', workshopId)
        .limit(1)
        .get();
  
      if (snapshot.empty) return null;
      return snapshot.docs[0].data() as Enrollment;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  }

export async function updateLessonProgress(userId: string, workshopId: string, lessonId: string, completed: boolean) {
    try {
        const snapshot = await db.firestore()
            .collection(ENROLLMENTS_COLLECTION)
            .where('userId', '==', userId)
            .where('workshopId', '==', workshopId)
            .limit(1)
            .get();

        if (snapshot.empty) throw new Error("Enrollment not found");
        
        const enrollmentDoc = snapshot.docs[0];
        const enrollmentId = enrollmentDoc.id;
        
        await db.firestore().collection(ENROLLMENTS_COLLECTION).doc(enrollmentId).update({
            [`progress.${lessonId}`]: {
                completed,
                completedAt: completed ? new Date().toISOString() : null
            }
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
}
