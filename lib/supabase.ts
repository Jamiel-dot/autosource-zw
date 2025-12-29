
import { createClient } from '@supabase/supabase-js';
import { Car } from '../types';

const supabaseUrl = 'https://svazvuxrosjlddujtcsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YXp2dXhyb3NqbGRkdWp0Y3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjgzMjUsImV4cCI6MjA3OTc0NDMyNX0.Xj3xOucFCIjHgs6UMRMPHnRZ7vbTmZZJZDgzE0WkeTs';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper to be used in your Dashboard Project to post a new car.
 * Ensure the user is authenticated via supabase.auth.signInWithPassword first.
 */
export const createListing = async (carData: Partial<Car>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("You must be logged in to post a car.");

  const { data, error } = await supabase
    .from('listings')
    .insert([{
      ...carData,
      user_id: user.id,
      status: 'pending', // Usually pending admin approval
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};
