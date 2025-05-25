// supabaseClient.js

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace this
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace this

if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('Supabase URL or Anon Key is not configured. Please update supabaseClient.js');
    // Optionally, you could throw an error to make it more obvious during development
    // throw new Error('Supabase client is not configured. Update supabaseClient.js with your project URL and Anon Key.');
}

const supabase = self.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// You can export the client for use in other scripts
// For simple script tag inclusion, it will be available globally as `supabase`
// or you can do: window.supabaseClient = supabase; if needed.
