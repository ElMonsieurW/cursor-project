import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook personnalisé qui écoute les changements de session Supabase
 * et permet de rafraîchir les composants quand l'état d'authentification change
 * 
 * @returns {Object} Un objet contenant refreshKey qui change à chaque changement d'authentification
 */
export function useSessionRefresh() {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier l'état d'authentification au chargement
    const checkInitialAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isAuthed = !!(data?.session);
      setIsAuthenticated(isAuthed);
    };

    checkInitialAuth();

    // S'abonner aux changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Événement d\'authentification:', event);
      
      const newAuthState = !!session;
      
      // Seulement déclencher un rafraîchissement si l'état a changé
      if (newAuthState !== isAuthenticated) {
        setIsAuthenticated(newAuthState);
        setRefreshKey(prev => prev + 1);
      }
    });

    return () => {
      // Nettoyer l'abonnement à la désinscription du composant
      authListener?.subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  return { refreshKey, isAuthenticated };
} 