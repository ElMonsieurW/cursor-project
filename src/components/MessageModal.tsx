import { useState, useEffect, useRef } from 'react';
import { messageService, Message } from '../services/messageService';
import { supabase } from '../lib/supabaseClient';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z' fill='%239CA3AF'/%3E%3C/svg%3E";

// Vérifier si une URL d'avatar est valide
const validateAvatar = (avatarUrl?: string): string => {
  if (!avatarUrl) return DEFAULT_AVATAR;
  
  // Vérifier si l'URL est valide
  try {
    new URL(avatarUrl);
    return avatarUrl;
  } catch (e) {
    console.warn('URL d\'avatar invalide:', avatarUrl);
    return DEFAULT_AVATAR;
  }
};

export default function MessageModal({ isOpen, onClose, bookingId, recipientId, recipientName, recipientAvatar }: MessageModalProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATAR);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer l'avatar de l'utilisateur
  useEffect(() => {
    const getUserAvatar = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user && user.user && user.user.user_metadata && user.user.user_metadata.avatar_url) {
          setUserAvatar(user.user.user_metadata.avatar_url);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'avatar utilisateur:', error);
      }
    };
    
    getUserAvatar();
  }, []);

  // Charger les messages existants
  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true);
      console.log(`🔄 Chargement des messages pour la réservation #${bookingId}, destinataire: ${recipientId}`);
      loadMessages();
    }
  }, [isOpen, bookingId, recipientId]);

  // Faire défiler jusqu'au dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      console.log(`📥 Récupération des messages pour la réservation #${bookingId}...`);
      const messagesData = await messageService.getBookingMessages(bookingId);
      console.log(`✅ ${messagesData.length} messages récupérés:`, messagesData);
      setMessages(messagesData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des messages', error);
      setError('Impossible de charger les messages précédents');
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      setSending(true);
      setError('');
      
      console.log(`📤 Envoi du message à ${recipientName} (${recipientId}) pour la réservation #${bookingId}...`);
      console.log(`📤 Contenu du message: "${message}"`);
      
      const result = await messageService.sendMessage(bookingId, recipientId, message.trim());
      
      if (result) {
        console.log(`✅ Message envoyé avec succès:`, result);
        
        // Ajouter immédiatement le message au tableau local
        setMessages(prev => [...prev, result]);
        setMessage('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error(`❌ Échec de l'envoi du message`);
        setError('Impossible d\'envoyer le message. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message', error);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  // Récupérer l'avatar correspondant à l'ID de l'expéditeur
  const getMessageAvatar = (senderId: string) => {
    if (senderId === recipientId) {
      return validateAvatar(recipientAvatar);
    } else {
      return userAvatar;
    }
  };

  if (!isOpen) return null;

  const safeRecipientAvatar = validateAvatar(recipientAvatar);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex items-center mb-4">
                  <img 
                    src={safeRecipientAvatar} 
                    alt={recipientName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                  />
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {recipientName}
                    </h3>
                    <p className="text-xs text-gray-500">Réservation #{bookingId}</p>
                  </div>
                </div>
                
                {/* Liste des messages */}
                {loading ? (
                  <div className="flex justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-60 overflow-y-auto">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`mb-2 p-2 rounded-lg ${
                          msg.senderId === recipientId 
                            ? 'bg-gray-200 mr-12' 
                            : 'bg-indigo-100 ml-12'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <img 
                            src={getMessageAvatar(msg.senderId)} 
                            alt={msg.senderId === recipientId ? recipientName : "Moi"}
                            className="w-6 h-6 rounded-full object-cover mr-2"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                            }}
                          />
                          <p className="text-xs font-medium text-gray-700">
                            {msg.senderId === recipientId ? recipientName : "Moi"}
                          </p>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-500 text-right">
                          {new Date(msg.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Aucun message échangé pour le moment
                  </p>
                )}
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
                    <p className="font-medium">Erreur:</p>
                    <p>{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm animate-pulse">
                    <p className="font-medium">✅ Message envoyé avec succès !</p>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage}>
                  <div className="mb-4">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows={4}
                      placeholder="Écrivez votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onClose}
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      disabled={sending || !message.trim()}
                      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${
                        sending || !message.trim()
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {sending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 