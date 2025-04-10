import { supabase } from '../lib/supabaseClient';

export interface TimeSlot {
  id: string;
  professionalId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const STORAGE_KEY = 'timeSlots';

// Fonction pour générer des créneaux horaires (8h-18h par défaut)
const generateTimeSlots = (
  professionalId: number, 
  date: string,
  startHour: number = 8,
  endHour: number = 18,
  slotDuration: number = 30 // en minutes (maintenant 30 minutes par défaut)
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const slotCount = (endHour - startHour) * (60 / slotDuration);
  
  for (let i = 0; i < slotCount; i++) {
    const minutesFromStart = i * slotDuration;
    const startMinutes = startHour * 60 + minutesFromStart;
    const endMinutes = startMinutes + slotDuration;
    
    const startTime = `${Math.floor(startMinutes / 60).toString().padStart(2, '0')}:${(startMinutes % 60).toString().padStart(2, '0')}`;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    
    slots.push({
      id: `slot-${professionalId}-${date}-${startTime}`,
      professionalId,
      date,
      startTime,
      endTime,
      isAvailable: true
    });
  }
  
  return slots;
};

// Fonction pour obtenir les créneaux depuis le localStorage
const getLocalTimeSlots = (): TimeSlot[] => {
  const storedSlots = localStorage.getItem(STORAGE_KEY);
  return storedSlots ? JSON.parse(storedSlots) : [];
};

// Fonction pour sauvegarder les créneaux dans le localStorage
const saveLocalTimeSlots = (slots: TimeSlot[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
};

export const timeSlotService = {
  // Récupérer tous les créneaux
  getAllTimeSlots: (): TimeSlot[] => {
    return getLocalTimeSlots();
  },
  
  // Effacer tous les créneaux (utile pour réinitialiser l'application)
  clearAllTimeSlots: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Tous les créneaux ont été supprimés');
  },
  
  // Récupérer les créneaux disponibles pour un professionnel à une date donnée
  getAvailableTimeSlots: (professionalId: number, date: string): TimeSlot[] => {
    try {
      // Vérifier d'abord si nous avons des créneaux pour ce professionnel à cette date
      const allSlots = getLocalTimeSlots();
      
      // Créer un Map pour éviter les doublons (basé sur l'heure de début)
      const slotMap = new Map<string, TimeSlot>();
      
      // Filtrer les créneaux pour ce professionnel à cette date
      const existingSlots = allSlots.filter(
        slot => slot.professionalId === professionalId && 
                slot.date === date &&
                slot.isAvailable === true
      );
      
      // Ajouter les créneaux existants au Map
      existingSlots.forEach(slot => {
        slotMap.set(slot.startTime, slot);
      });
      
      // Si aucun créneau n'existe, générer des créneaux par défaut
      if (existingSlots.length === 0) {
        const newSlots = generateTimeSlots(professionalId, date);
        
        // Ajouter les nouveaux créneaux au Map
        newSlots.forEach(slot => {
          slotMap.set(slot.startTime, slot);
        });
        
        // Sauvegarder les nouveaux créneaux avec les existants
        saveLocalTimeSlots([...allSlots, ...newSlots]);
      }
      
      // Convertir le Map en tableau et trier par heure de début
      const uniqueSlots = Array.from(slotMap.values()).sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
      
      return uniqueSlots;
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux disponibles:', error);
      return [];
    }
  },
  
  // Marquer un créneau comme réservé
  bookTimeSlot: (slotId: string): boolean => {
    try {
      const allSlots = getLocalTimeSlots();
      const slotIndex = allSlots.findIndex(slot => slot.id === slotId);
      
      if (slotIndex === -1) {
        console.error('Créneau non trouvé:', slotId);
        return false;
      }
      
      // Marquer le créneau comme non disponible
      allSlots[slotIndex].isAvailable = false;
      saveLocalTimeSlots(allSlots);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la réservation du créneau:', error);
      return false;
    }
  },
  
  // Libérer un créneau précédemment réservé
  releaseTimeSlot: (slotId: string): boolean => {
    try {
      const allSlots = getLocalTimeSlots();
      const slotIndex = allSlots.findIndex(slot => slot.id === slotId);
      
      if (slotIndex === -1) {
        console.error('Créneau non trouvé:', slotId);
        return false;
      }
      
      // Marquer le créneau comme disponible
      allSlots[slotIndex].isAvailable = true;
      saveLocalTimeSlots(allSlots);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la libération du créneau:', error);
      return false;
    }
  },
  
  // Générer des créneaux pour un professionnel sur plusieurs jours
  generateTimeSlotsForPeriod: (
    professionalId: number, 
    startDate: string, 
    endDate: string
  ): TimeSlot[] => {
    try {
      const allSlots = getLocalTimeSlots();
      const newSlots: TimeSlot[] = [];
      
      // Convertir les dates en objets Date
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Pour chaque jour de la période
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Générer des créneaux pour ce jour
        const daySlots = generateTimeSlots(professionalId, dateString);
        newSlots.push(...daySlots);
        
        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Sauvegarder les nouveaux créneaux avec les existants
      saveLocalTimeSlots([...allSlots, ...newSlots]);
      
      return newSlots;
    } catch (error) {
      console.error('Erreur lors de la génération des créneaux:', error);
      return [];
    }
  },
  
  // Générer des créneaux pour les 30 prochains jours pour tous les professionnels
  initializeDefaultTimeSlots: (professionalIds: number[]): void => {
    try {
      // Date actuelle
      const today = new Date();
      
      // Date dans 30 jours
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      // Format de date pour l'API
      const startDateString = today.toISOString().split('T')[0];
      const endDateString = thirtyDaysLater.toISOString().split('T')[0];
      
      // Pour chaque professionnel, générer des créneaux
      for (const professionalId of professionalIds) {
        timeSlotService.generateTimeSlotsForPeriod(
          professionalId, 
          startDateString, 
          endDateString
        );
      }
      
      console.log('Créneaux initialisés pour les 30 prochains jours');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des créneaux par défaut:', error);
    }
  }
}; 