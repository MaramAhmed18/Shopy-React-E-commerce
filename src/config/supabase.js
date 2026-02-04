import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yenxvztmzlvvhgoslrfr.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllbnh2enRtemx2dmhnb3NscmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODI0MjUsImV4cCI6MjA4NTQ1ODQyNX0.RTYEz4iLOYa0ygZoUuRdysG6zMbKdinz90-U5RdoxM4'; 

export const supabase = createClient(supabaseUrl, supabaseKey);