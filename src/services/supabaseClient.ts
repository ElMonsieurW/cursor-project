import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://evvdpqnfaiodfyipcjzr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dmRwcW5mYWlvZGZ5aXBjanpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODYxNjUsImV4cCI6MjA1OTc2MjE2NX0.W7PJ1O15C_lO3F6wDecijsiA1VMleykvFmB7BtKZsrU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 