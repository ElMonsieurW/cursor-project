import { useEffect } from 'react';
import { timeSlotService } from '../services/timeSlotService';

// Version actuelle des créneaux - à incrémenter lorsque la logique des créneaux change
const TIMESLOTS_VERSION = '1.1';

interface TimeSlotsInitializerProps {
  professionalIds: number[];
}

const TimeSlotsInitializer: React.FC<TimeSlotsInitializerProps> = ({ professionalIds }) => {
  useEffect(() => {
    // Vérifier si l'initialisation a déjà été effectuée dans cette session
    const hasInitialized = sessionStorage.getItem('timeSlotsInitialized');
    // Vérifier la version des créneaux
    const storedVersion = localStorage.getItem('timeSlotsVersion');
    
    // Si la version a changé ou si c'est la première initialisation de la session
    if (!hasInitialized || storedVersion !== TIMESLOTS_VERSION) {
      // Initialiser les créneaux horaires pour tous les professionnels
      const initTimeSlots = async () => {
        try {
          console.log('Initialisation des créneaux horaires pour les professionnels:', professionalIds);
          
          // Si la version a changé, effacer tous les créneaux existants
          if (storedVersion !== TIMESLOTS_VERSION) {
            console.log(`Version des créneaux mise à jour: ${storedVersion || 'aucune'} -> ${TIMESLOTS_VERSION}`);
            timeSlotService.clearAllTimeSlots();
            localStorage.setItem('timeSlotsVersion', TIMESLOTS_VERSION);
          }
          
          // Générer de nouveaux créneaux
          timeSlotService.initializeDefaultTimeSlots(professionalIds);
          
          // Marquer comme initialisé pour cette session
          sessionStorage.setItem('timeSlotsInitialized', 'true');
        } catch (error) {
          console.error('Erreur lors de l\'initialisation des créneaux horaires:', error);
        }
      };

      initTimeSlots();
    }
  }, [professionalIds]);

  // Ce composant n'affiche rien, il initialise simplement les données
  return null;
};

export default TimeSlotsInitializer; 