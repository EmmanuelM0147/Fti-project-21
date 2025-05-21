import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  runTransaction,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ApplicationFormData } from '../validation/application';

interface ApplicationSubmission extends ApplicationFormData {
  userId: string;
  status: 'draft' | 'submitted' | 'under_review';
  createdAt: Date;
  lastModified: Date;
}

export async function submitApplication(
  formData: ApplicationFormData, 
  userId: string
): Promise<{ success: boolean; message: string; applicationId?: string }> {
  try {
    // Create application document reference
    const applicationsRef = collection(db, 'applications');
    const applicationRef = doc(applicationsRef);

    // Check for existing applications
    const existingApplications = await getDoc(doc(db, 'users', userId, 'meta', 'applications'));
    if (existingApplications.exists() && existingApplications.data().count >= 3) {
      throw new Error('Maximum number of applications (3) reached');
    }

    // Prepare application data
    const applicationData: ApplicationSubmission = {
      ...formData,
      userId,
      status: 'submitted',
      createdAt: new Date(),
      lastModified: new Date()
    };

    // Use transaction to ensure data consistency
    await runTransaction(db, async (transaction) => {
      // Create application document
      transaction.set(applicationRef, applicationData);

      // Update user's application count
      const userMetaRef = doc(db, 'users', userId, 'meta', 'applications');
      transaction.set(userMetaRef, {
        count: increment(1)
      }, { merge: true });
    });

    return {
      success: true,
      message: 'Application submitted successfully',
      applicationId: applicationRef.id
    };

  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to submit application');
  }
}

export async function saveDraft(
  formData: Partial<ApplicationFormData>, 
  userId: string,
  draftId?: string
): Promise<{ success: boolean; draftId: string }> {
  try {
    const draftRef = draftId 
      ? doc(db, 'applications', draftId)
      : doc(collection(db, 'applications'));

    const draftData = {
      ...formData,
      userId,
      status: 'draft',
      lastModified: serverTimestamp(),
      ...(draftId ? {} : { createdAt: serverTimestamp() })
    };

    if (draftId) {
      await updateDoc(draftRef, draftData);
    } else {
      await setDoc(draftRef, draftData);
    }

    return {
      success: true,
      draftId: draftRef.id
    };

  } catch (error) {
    console.error('Error saving draft:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save draft');
  }
}

export async function getDraft(draftId: string, userId: string) {
  try {
    const draftRef = doc(db, 'applications', draftId);
    const draftSnap = await getDoc(draftRef);

    if (!draftSnap.exists()) {
      throw new Error('Draft not found');
    }

    const draftData = draftSnap.data();
    if (draftData.userId !== userId) {
      throw new Error('Unauthorized access to draft');
    }

    return {
      success: true,
      data: draftData
    };

  } catch (error) {
    console.error('Error retrieving draft:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to retrieve draft');
  }
}