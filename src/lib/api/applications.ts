import { supabase } from '../supabase/client';
import { ApplicationFormData } from '../validation/application';
import { toast } from 'react-hot-toast';

/**
 * Submits a student application to Supabase
 * @param formData The application form data
 * @returns Promise with success status and message
 */
export async function submitApplication(formData: ApplicationFormData): Promise<{ success: boolean; message: string; applicationId?: string }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to submit an application');
    }

    // Prepare application data
    const applicationData = {
      user_id: user.id,
      personal_info: formData.personalInfo,
      academic_background: formData.academicBackground,
      program_selection: formData.programSelection,
      accommodation: formData.accommodation,
      referee: formData.referee,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert application into Supabase
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Show success toast
    toast.success('Application submitted successfully!');
    
    // Return success result
    return {
      success: true,
      message: 'Application submitted successfully',
      applicationId: data.id
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Show error toast
    toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    
    // Return error result
    return {
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to submit application'
    };
  }
}

/**
 * Saves a draft application to Supabase
 * @param formData Partial application form data
 * @param draftId Optional existing draft ID to update
 * @returns Promise with success status and draft ID
 */
export async function saveDraft(formData: Partial<ApplicationFormData>, draftId?: string): Promise<{ success: boolean; draftId: string }> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to save a draft');
    }

    // Prepare draft data
    const draftData = {
      user_id: user.id,
      personal_info: formData.personalInfo || {},
      academic_background: formData.academicBackground || {},
      program_selection: formData.programSelection || {},
      accommodation: formData.accommodation || {},
      referee: formData.referee || {},
      status: 'draft',
      updated_at: new Date().toISOString()
    };

    let result;

    if (draftId) {
      // Update existing draft
      result = await supabase
        .from('applications') 
        .update(draftData)
        .eq('id', draftId)
        .eq('user_id', user.id)
        .select('id')
        .single();
    } else {
      // Create new draft
      draftData.created_at = new Date().toISOString();
      result = await supabase
        .from('applications')
        .insert(draftData)
        .select('id')
        .single();
    }

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      success: true,
      draftId: result.data.id
    };
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
}

/**
 * Retrieves a user's applications from Supabase
 * @returns Promise with array of applications
 */
export async function getUserApplications() {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to view applications');
    }

    // Fetch applications
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

/**
 * Retrieves a specific application by ID
 * @param applicationId The application ID to retrieve
 * @returns Promise with application data
 */
export async function getApplicationById(applicationId: string) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be signed in to view applications');
    }

    // Fetch application
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}