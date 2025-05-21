import { supabase } from '../supabase/client';
import { toast } from 'react-hot-toast';

/**
 * Fetches all career tracks from the database
 * @returns Promise with array of career tracks
 */
export async function getCareerTracks() {
  try {
    const { data, error } = await supabase
      .from('career_tracks')
      .select('*')
      .order('title');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching career tracks:', error);
    throw error;
  }
}

/**
 * Fetches learning resources, optionally filtered by track ID
 * @param trackId Optional track ID to filter resources
 * @returns Promise with array of learning resources
 */
export async function getLearningResources(trackId?: string) {
  try {
    let query = supabase
      .from('learning_resources')
      .select('*')
      .order('rating', { ascending: false });
    
    if (trackId) {
      query = query.eq('track_id', trackId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    throw error;
  }
}

/**
 * Fetches tech communities from the database
 * @returns Promise with array of tech communities
 */
export async function getTechCommunities() {
  try {
    const { data, error } = await supabase
      .from('tech_communities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tech communities:', error);
    throw error;
  }
}

/**
 * Fetches job opportunities, optionally filtered by type
 * @param type Optional opportunity type to filter by
 * @returns Promise with array of job opportunities
 */
export async function getJobOpportunities(type?: string) {
  try {
    let query = supabase
      .from('job_opportunities')
      .select('*')
      .order('posted_date', { ascending: false });
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job opportunities:', error);
    throw error;
  }
}

/**
 * Toggles a resource bookmark for the current user
 * @param userId User ID
 * @param resourceId Resource ID to toggle
 * @returns Promise with success status
 */
export async function toggleResourceBookmark(userId: string, resourceId: string) {
  try {
    // First get current bookmarks
    const { data: preferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select('bookmarked_resources')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw fetchError;
    }
    
    // Get current bookmarks or initialize empty array
    const currentBookmarks = preferences?.bookmarked_resources || [];
    
    // Toggle the bookmark
    const newBookmarks = currentBookmarks.includes(resourceId)
      ? currentBookmarks.filter((id: string) => id !== resourceId)
      : [...currentBookmarks, resourceId];
    
    // Upsert the preferences
    const { error: upsertError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        bookmarked_resources: newBookmarks,
        updated_at: new Date().toISOString()
      });
    
    if (upsertError) throw upsertError;
    
    // Show success message
    toast.success(
      currentBookmarks.includes(resourceId)
        ? 'Resource removed from bookmarks'
        : 'Resource bookmarked successfully'
    );
    
    return { success: true, bookmarked: !currentBookmarks.includes(resourceId) };
  } catch (error) {
    console.error('Error toggling resource bookmark:', error);
    toast.error('Failed to update bookmarks');
    throw error;
  }
}

/**
 * Toggles a job opportunity save for the current user
 * @param userId User ID
 * @param opportunityId Opportunity ID to toggle
 * @returns Promise with success status
 */
export async function toggleSavedOpportunity(userId: string, opportunityId: string) {
  try {
    // First get current saved opportunities
    const { data: preferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select('saved_opportunities')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw fetchError;
    }
    
    // Get current saved opportunities or initialize empty array
    const currentSaved = preferences?.saved_opportunities || [];
    
    // Toggle the saved status
    const newSaved = currentSaved.includes(opportunityId)
      ? currentSaved.filter((id: string) => id !== opportunityId)
      : [...currentSaved, opportunityId];
    
    // Upsert the preferences
    const { error: upsertError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        saved_opportunities: newSaved,
        updated_at: new Date().toISOString()
      });
    
    if (upsertError) throw upsertError;
    
    // Show success message
    toast.success(
      currentSaved.includes(opportunityId)
        ? 'Opportunity removed from saved list'
        : 'Opportunity saved successfully'
    );
    
    return { success: true, saved: !currentSaved.includes(opportunityId) };
  } catch (error) {
    console.error('Error toggling saved opportunity:', error);
    toast.error('Failed to update saved opportunities');
    throw error;
  }
}

/**
 * Gets user preferences including bookmarks and saved opportunities
 * @param userId User ID
 * @returns Promise with user preferences
 */
export async function getUserPreferences(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    return data || {
      bookmarked_resources: [],
      saved_opportunities: [],
      career_interests: []
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
}