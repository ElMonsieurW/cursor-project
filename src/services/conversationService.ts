import { supabase } from '../lib/supabaseClient';
import { messageService, Message } from './messageService';
import { professionalService } from './professionalService';
import avatarService from './avatarService';

export interface Conversation {
  id: string;
  conversationPartnerId: string;
  conversationPartnerName: string;
  conversationPartnerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  bookingId: number;
  professionalId?: number; // ID du professionnel associé
}

// Récupérer les conversations stockées dans localStorage
const getLocalConversations = (): Conversation[] => {
  const stored = localStorage.getItem('localConversations');
  return stored ? JSON.parse(stored) : [];
};

// Sauvegarder les conversations dans localStorage
const saveLocalConversations = (conversations: Conversation[]) => {
  localStorage.setItem('localConversations', JSON.stringify(conversations));
};

// Effacer toutes les conversations dans localStorage
const clearLocalConversations = () => {
  localStorage.removeItem('localConversations');
  localConversations = [];
};

// Stockage initial des conversations depuis localStorage
let localConversations: Conversation[] = getLocalConversations();

// Récupérer tous les messages depuis localStorage
const getLocalMessages = (): Message[] => {
  const stored = localStorage.getItem('localMessages');
  return stored ? JSON.parse(stored) : [];
};

// Extraire l'ID du professionnel à partir de l'ID de la conversation
const extractProfessionalId = (partnerId: string): number | undefined => {
  return avatarService.extractProfessionalId(partnerId);
};

// Vérifier si une URL d'avatar est valide ou retourner l'avatar par défaut
const validateAvatar = (avatarUrl?: string): string => {
  return avatarService.validateAvatar(avatarUrl);
};

// Effacer les conversations au démarrage
clearLocalConversations();

export const conversationService = {
  // Récupérer les conversations d'un utilisateur
  getUserConversations: async (): Promise<Conversation[]> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // ID de l'utilisateur (réel ou simulé si non connecté)
      let userId: string;
      
      if (user && user.user) {
        userId = user.user.id;
      } else {
        // Utiliser l'ID simulé depuis le localStorage
        const simulatedUserId = localStorage.getItem('simulatedUserId');
        if (!simulatedUserId) {
          return [];
        }
        userId = simulatedUserId;
      }

      // Tenter d'abord via Supabase
      try {
        // À implémenter quand Supabase sera configuré pour les conversations
        // const { data, error } = await supabase
        //   .from('conversations')
        //   .select('*')
        //   .eq('user_id', userId);
        // 
        // if (!error && data && data.length > 0) {
        //   return data.map((conv: any) => ({
        //     id: conv.id,
        //     conversationPartnerId: conv.conversation_partner_id,
        //     conversationPartnerName: conv.conversation_partner_name,
        //     conversationPartnerAvatar: conv.conversation_partner_avatar,
        //     lastMessage: conv.last_message,
        //     lastMessageTime: conv.last_message_time,
        //     unread: conv.unread,
        //     bookingId: conv.booking_id,
        //     professionalId: conv.professional_id
        //   }));
        // }
      } catch (err) {
        console.log('Erreur Supabase, utilisation du stockage local', err);
      }
      
      // Récupérer tous les messages locaux
      const allMessages = getLocalMessages();
      
      // Filtrer les messages de l'utilisateur (envoyés ou reçus)
      const userMessages = allMessages.filter((msg: Message) => 
        msg.senderId === userId || msg.recipientId === userId
      );
      
      // Grouper les messages par partenaire de conversation
      const conversationMap = new Map<string, Message[]>();
      
      userMessages.forEach((msg: Message) => {
        const partnerId = msg.senderId === userId ? msg.recipientId : msg.senderId;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)?.push(msg);
      });
      
      // Créer les conversations à partir des messages groupés
      const conversations: Conversation[] = [];
      
      for (const [partnerId, messages] of conversationMap.entries()) {
        // Uniquement traiter les messages avec des prestataires (IDs commençant par 'pro-')
        if (!partnerId.startsWith('pro-')) {
          continue;
        }

        // Extraire l'ID du professionnel
        const professionalId = avatarService.extractProfessionalId(partnerId);
        if (!professionalId) {
          continue; // Ignorer les partenaires qui ne sont pas des professionnels valides
        }

        // Vérifier si le professionnel existe
        const professional = professionalService.getProfessionalById(professionalId);
        if (!professional) {
          continue; // Ignorer les professionnels qui n'existent pas dans notre liste
        }
        
        // Trier les messages par date (du plus récent au plus ancien)
        messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const lastMsg = messages[0];
        const isUnread = messages.some(msg => msg.recipientId === userId && !msg.read);
        
        // Récupérer l'avatar directement du service pour garantir la cohérence
        const professionalAvatar = avatarService.getProfessionalAvatar(professionalId);
        
        conversations.push({
          id: `conv-${partnerId}`,
          conversationPartnerId: partnerId,
          conversationPartnerName: professional.name,
          conversationPartnerAvatar: professionalAvatar,
          lastMessage: lastMsg.content,
          lastMessageTime: lastMsg.createdAt,
          unread: isUnread,
          bookingId: lastMsg.bookingId,
          professionalId
        });
      }
      
      // Trier les conversations par date du dernier message (la plus récente en premier)
      conversations.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );
      
      // Sauvegarder les conversations locales
      localConversations = conversations;
      saveLocalConversations(localConversations);
      
      return conversations;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      return [];
    }
  },
  
  // Créer ou mettre à jour une conversation après l'envoi d'un message
  updateConversationAfterMessage: async (message: Message): Promise<void> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // ID de l'utilisateur (réel ou simulé si non connecté)
      let userId: string;
      
      if (user && user.user) {
        userId = user.user.id;
      } else {
        // Utiliser l'ID simulé depuis le localStorage
        const simulatedUserId = localStorage.getItem('simulatedUserId');
        if (!simulatedUserId) {
          return;
        }
        userId = simulatedUserId;
      }
      
      // Partenaire de conversation (l'autre personne)
      const partnerId = message.senderId === userId ? message.recipientId : message.senderId;
      
      // Vérifier si le partenaire est un professionnel
      if (!partnerId.startsWith('pro-')) {
        return; // Ne pas créer de conversation si ce n'est pas un professionnel
      }

      // Extraire l'ID du professionnel
      const professionalId = avatarService.extractProfessionalId(partnerId);
      if (!professionalId) {
        return; // Ignorer si l'ID du professionnel n'est pas valide
      }

      // Vérifier si le professionnel existe
      const professional = professionalService.getProfessionalById(professionalId);
      if (!professional) {
        return; // Ignorer si le professionnel n'existe pas
      }
      
      // Récupérer l'avatar directement du service pour garantir la cohérence
      const professionalAvatar = avatarService.getProfessionalAvatar(professionalId);
      
      // Vérifier si une conversation existe déjà
      const existingConvIndex = localConversations.findIndex(
        conv => conv.conversationPartnerId === partnerId
      );
      
      if (existingConvIndex >= 0) {
        // Mettre à jour la conversation existante
        localConversations[existingConvIndex] = {
          ...localConversations[existingConvIndex],
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unread: message.recipientId === userId && !message.read,
          // Mettre à jour l'avatar pour garantir la cohérence
          conversationPartnerAvatar: professionalAvatar
        };
      } else {
        // Créer une nouvelle conversation
        localConversations.push({
          id: `conv-${partnerId}`,
          conversationPartnerId: partnerId,
          conversationPartnerName: professional.name,
          conversationPartnerAvatar: professionalAvatar,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unread: message.recipientId === userId && !message.read,
          bookingId: message.bookingId,
          professionalId
        });
      }
      
      // Sauvegarder les conversations mises à jour
      saveLocalConversations(localConversations);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la conversation:', error);
    }
  },

  // Effacer toutes les conversations
  clearAllConversations: async (): Promise<void> => {
    try {
      // Pour le moment, uniquement effacer les conversations locales
      clearLocalConversations();
      console.log('Toutes les conversations ont été effacées');
    } catch (error) {
      console.error('Erreur lors de l\'effacement des conversations:', error);
    }
  }
}; 