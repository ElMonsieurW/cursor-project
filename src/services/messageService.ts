import { supabase } from '../lib/supabaseClient';

export interface Message {
  id: string;
  bookingId: number;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// Récupérer les messages stockés dans localStorage
const getLocalMessages = (): Message[] => {
  const stored = localStorage.getItem('localMessages');
  return stored ? JSON.parse(stored) : [];
};

// Sauvegarder les messages dans localStorage
const saveLocalMessages = (messages: Message[]) => {
  localStorage.setItem('localMessages', JSON.stringify(messages));
};

// Effacer tous les messages dans localStorage
const clearLocalMessages = () => {
  localStorage.removeItem('localMessages');
  localMessages = [];
};

// Stockage initial des messages depuis localStorage
let localMessages: Message[] = getLocalMessages();

// Import dynamique pour éviter les dépendances circulaires
const getConversationService = async () => {
  try {
    const module = await import('./conversationService');
    return module.conversationService;
  } catch (error) {
    console.error('Erreur lors du chargement du service de conversation:', error);
    return null;
  }
};

// Exécuter immédiatement pour effacer les messages au chargement
clearLocalMessages();

export const messageService = {
  // Envoyer un message
  sendMessage: async (bookingId: number, recipientId: string, content: string): Promise<Message | null> => {
    try {
      // Tenter d'abord l'envoi via Supabase
      const { data: user } = await supabase.auth.getUser();
      
      // ID de l'utilisateur (réel ou simulé si non connecté)
      let senderId: string;
      
      if (user && user.user) {
        senderId = user.user.id;
      } else {
        // Créer un ID utilisateur simulé si non connecté
        console.warn('Utilisateur non authentifié, utilisation d\'un ID simulé');
        
        // Récupérer l'ID simulé depuis le localStorage ou en créer un nouveau
        let simulatedUserId = localStorage.getItem('simulatedUserId');
        if (!simulatedUserId) {
          simulatedUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem('simulatedUserId', simulatedUserId);
        }
        
        senderId = simulatedUserId;
      }
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            booking_id: bookingId,
            sender_id: senderId,
            recipient_id: recipientId,
            content,
            created_at: new Date().toISOString(),
            read: false
          })
          .select()
          .single();
        
        if (!error) {
          // Si Supabase fonctionne, retourner la réponse
          const newMessage = {
            id: data.id,
            bookingId: data.booking_id,
            senderId: data.sender_id,
            recipientId: data.recipient_id,
            content: data.content,
            createdAt: data.created_at,
            read: data.read
          };
          
          // Mettre à jour la conversation associée
          const conversationService = await getConversationService();
          if (conversationService) {
            await conversationService.updateConversationAfterMessage(newMessage);
          }
          
          return newMessage;
        }
        
        // Si l'envoi à Supabase échoue, utiliser le stockage local
        console.log('Utilisation du stockage local pour les messages (Supabase indisponible)');
      } catch (err) {
        console.log('Erreur Supabase, utilisation du stockage local', err);
      }
      
      // Créer un message local
      const newMessage: Message = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        bookingId,
        senderId,
        recipientId,
        content,
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Ajouter au stockage local
      localMessages.push(newMessage);
      // Sauvegarder dans localStorage
      saveLocalMessages(localMessages);
      
      console.log('Message local créé et sauvegardé', newMessage);
      
      // Mettre à jour la conversation associée
      const conversationService = await getConversationService();
      if (conversationService) {
        await conversationService.updateConversationAfterMessage(newMessage);
      }
      
      return newMessage;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      return null;
    }
  },
  
  // Récupérer les messages d'une réservation
  getBookingMessages: async (bookingId: number): Promise<Message[]> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Vérifier si l'utilisateur est connecté via Supabase
      let isLoggedIn = !!(user && user.user);
      
      if (!isLoggedIn) {
        console.warn('Utilisateur non authentifié, utilisation des messages locaux uniquement');
      } else {
        // Si l'utilisateur est connecté, essayer de récupérer depuis Supabase
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('booking_id', bookingId)
            .order('created_at', { ascending: true });
          
          if (!error && data && data.length > 0) {
            // Si des données sont récupérées de Supabase, les retourner
            return data.map((message: any) => ({
              id: message.id,
              bookingId: message.booking_id,
              senderId: message.sender_id,
              recipientId: message.recipient_id,
              content: message.content,
              createdAt: message.created_at,
              read: message.read
            }));
          }
        } catch (err) {
          console.log('Erreur Supabase, utilisation du stockage local', err);
        }
      }
      
      // Rafraîchir les messages locaux depuis localStorage
      localMessages = getLocalMessages();
      
      // Filtrer les messages locaux pour cette réservation
      const bookingMessages = localMessages.filter(msg => msg.bookingId === bookingId);
      console.log(`${bookingMessages.length} messages locaux trouvés pour la réservation ${bookingId}`);
      
      return bookingMessages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }
  },
  
  // Marquer un message comme lu
  markAsRead: async (messageId: string): Promise<boolean> => {
    try {
      // Essayer d'abord avec Supabase
      try {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', messageId);
        
        if (!error) {
          return true;
        }
      } catch (err) {
        console.log('Erreur Supabase, utilisation du stockage local', err);
      }
      
      // Rafraîchir les messages locaux depuis localStorage
      localMessages = getLocalMessages();
      
      // Mettre à jour le message local
      const localIndex = localMessages.findIndex(msg => msg.id === messageId);
      if (localIndex >= 0) {
        localMessages[localIndex].read = true;
        // Sauvegarder dans localStorage
        saveLocalMessages(localMessages);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
      return false;
    }
  },
  
  // Exposer la fonction getLocalMessages pour le service de conversation
  getLocalMessages: (): Message[] => {
    // Rafraîchir depuis localStorage avant de retourner
    localMessages = getLocalMessages();
    return localMessages;
  },
  
  // Effacer tous les messages
  clearAllMessages: async (): Promise<void> => {
    try {
      // Essayer d'abord avec Supabase (si implémenté)
      // Pour l'instant, uniquement effacer les messages locaux
      clearLocalMessages();
      
      // Également effacer les conversations
      const conversationService = await getConversationService();
      if (conversationService && conversationService.clearAllConversations) {
        await conversationService.clearAllConversations();
      } else {
        // Si la méthode n'existe pas, effacer directement le localStorage
        localStorage.removeItem('localConversations');
      }
      
      console.log('Tous les messages ont été effacés');
    } catch (error) {
      console.error('Erreur lors de l\'effacement des messages:', error);
    }
  }
}; 