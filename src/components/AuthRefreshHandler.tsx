import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRefreshHandler() {
  const { isLoggedIn, refreshKey } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [previousIsLoggedIn, setPreviousIsLoggedIn] = useState(false);

  // Détecter les changements d'état de connexion
  useEffect(() => {
    // Si l'utilisateur vient juste de se connecter
    if (isLoggedIn && !previousIsLoggedIn) {
      setShowNotification(true);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    
    setPreviousIsLoggedIn(isLoggedIn);
  }, [isLoggedIn, previousIsLoggedIn, refreshKey]);

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 text-green-800 p-4 rounded-md shadow-md animate-fade-in-out z-50">
      <div className="flex items-center">
        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-medium">Connexion réussie ! Rafraîchissement des données...</p>
      </div>
    </div>
  );
} 