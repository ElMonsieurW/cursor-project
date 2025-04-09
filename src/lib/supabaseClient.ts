import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Configuration Supabase:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        const cookies = document.cookie.split(';');
        const cookie = cookies.find(c => c.trim().startsWith(`${key}=`));
        return cookie ? cookie.split('=')[1] : null;
      },
      setItem: (key, value) => {
        document.cookie = `${key}=${value}; path=/; secure; samesite=strict`;
      },
      removeItem: (key) => {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  },
  db: {
    schema: 'public'
  }
});

// Vérification de la connexion
supabase
  .from('profiles')
  .select('count')
  .then(({ data, error }) => {
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
    } else {
      console.log('Connexion à Supabase réussie');
    }
  }); 