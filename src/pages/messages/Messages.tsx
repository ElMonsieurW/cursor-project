import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { conversationService, Conversation } from '../../services/conversationService';
import { messageService } from '../../services/messageService';
import MessageModal from '../../components/MessageModal';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z' fill='%239CA3AF'/%3E%3C/svg%3E";

export default function Messages() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const { isLoggedIn, refreshKey } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadConversations();
    }
  }, [isLoggedIn, refreshKey]);

  // Fonction pour charger les conversations
  const loadConversations = async () => {
    setLoading(true);
    try {
      console.log('Chargement des conversations...');
      const conversationsData = await conversationService.getUserConversations();
      console.log(`${conversationsData.length} conversations trouvées:`, conversationsData);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessageModal = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setTimeout(() => {
      setSelectedConversation(null);
      // Recharger les conversations après fermeture du modal
      loadConversations();
    }, 300);
  };

  const handleClearAllMessages = async () => {
    setClearingData(true);
    try {
      await messageService.clearAllMessages();
      setConversations([]);
      setShowClearConfirmation(false);
    } catch (error) {
      console.error('Erreur lors de l\'effacement des messages:', error);
    } finally {
      setClearingData(false);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.conversationPartnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Aujourd'hui, afficher l'heure
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Hier
      return 'Hier';
    } else if (diffDays < 7) {
      // Cette semaine, afficher le jour
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    } else {
      // Plus ancien, afficher la date complète
      return date.toLocaleDateString('fr-FR');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Messages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Communiquez avec les professionnels pour vos services
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="flex h-[600px]">
              {/* En-tête avec titre et bouton d'effacement */}
              <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
                  <button
                    onClick={() => setShowClearConfirmation(true)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-150 text-sm"
                  >
                    Effacer tout
                  </button>
                </div>

                {/* Confirmation d'effacement */}
                {showClearConfirmation && (
                  <div className="p-4 bg-red-50 border-b border-red-100">
                    <p className="text-sm text-red-800 mb-2">
                      Tous les messages seront effacés. Cette action est irréversible.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleClearAllMessages}
                        disabled={clearingData}
                        className={`px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 ${
                          clearingData ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {clearingData ? 'Effacement...' : 'Confirmer'}
                      </button>
                      <button
                        onClick={() => setShowClearConfirmation(false)}
                        disabled={clearingData}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Barre de recherche */}
                <div className="p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une conversation..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                  </div>
                </div>

                {/* Liste des conversations */}
                <div className="overflow-y-auto flex-1 divide-y divide-gray-200">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleOpenMessageModal(conv)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center">
                          <img 
                            src={conv.conversationPartnerAvatar || DEFAULT_AVATAR} 
                            alt={conv.conversationPartnerName}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                            onError={(e: any) => { e.target.src = DEFAULT_AVATAR }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conv.conversationPartnerName}
                              </p>
                              <p className="text-xs text-gray-500 ml-2">
                                {formatDate(conv.lastMessageTime)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              Réservation #{conv.bookingId}
                            </p>
                            <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {conv.lastMessage}
                            </p>
                          </div>
                          {conv.unread && (
                            <span className="inline-block w-3 h-3 bg-indigo-600 rounded-full ml-2"></span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Aucune conversation</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Envoyez un message à un professionnel depuis la page des réservations
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Zone de messages vide */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="text-center p-8">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <p className="text-lg text-gray-500">
                    Sélectionnez une conversation
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Cliquez sur une conversation pour voir les messages
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de messagerie */}
      {selectedConversation && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          bookingId={selectedConversation.bookingId}
          recipientId={selectedConversation.conversationPartnerId}
          recipientName={selectedConversation.conversationPartnerName}
          recipientAvatar={selectedConversation.conversationPartnerAvatar}
        />
      )}
    </div>
  );
} 