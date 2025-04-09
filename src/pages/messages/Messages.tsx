import { useState } from 'react';

// Définir les interfaces pour les types
interface Professional {
  name: string;
  avatar: string;
  service: string;
}

interface Conversation {
  id: number;
  professional: Professional;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: number;
  sender: 'user' | 'professional';
  content: string;
  time: string;
}

export default function Messages() {
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [];

  const messages: Message[] = [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Logique d'envoi de message
      setNewMessage('');
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
          <div className="flex h-[600px]">
            {/* Liste des conversations */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {conversations.length > 0 ? (
                  conversations.map((conv: Conversation) => (
                    <button
                      key={conv.id}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{conv.professional.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conv.professional.name}
                            </p>
                            <p className="text-xs text-gray-500 ml-2">
                              {conv.time}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.professional.service}
                          </p>
                          <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Aucune conversation</p>
                  </div>
                )}
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-center p-8">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <p className="text-lg text-gray-500">
                  Aucun message disponible
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Les conversations avec les professionnels s'afficheront ici
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 