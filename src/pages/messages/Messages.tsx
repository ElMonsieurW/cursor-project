import { useState } from 'react';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      professional: {
        name: "Jean Dupont",
        avatar: "👨‍🌾",
        service: "Entretien de Jardin"
      },
      lastMessage: "Je peux passer demain à 14h si cela vous convient.",
      time: "10:30",
      unread: true
    },
    {
      id: 2,
      professional: {
        name: "Marie Martin",
        avatar: "👩‍🔧",
        service: "Maintenance de Piscine"
      },
      lastMessage: "Merci pour votre confiance !",
      time: "Hier",
      unread: false
    },
    {
      id: 3,
      professional: {
        name: "Pierre Laurent",
        avatar: "👨‍🌾",
        service: "Entretien de Jardin"
      },
      lastMessage: "Je vous envoie le devis dans la journée.",
      time: "Lun.",
      unread: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "user",
      content: "Bonjour, je souhaite un devis pour l'entretien de mon jardin.",
      time: "10:00"
    },
    {
      id: 2,
      sender: "professional",
      content: "Bonjour ! Je peux passer demain à 14h si cela vous convient.",
      time: "10:30"
    }
  ];

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
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      selectedConversation === conv.id ? 'bg-gray-50' : ''
                    }`}
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
                ))}
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* En-tête de la conversation */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">
                        {conversations.find(c => c.id === selectedConversation)?.professional.avatar}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {conversations.find(c => c.id === selectedConversation)?.professional.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {conversations.find(c => c.id === selectedConversation)?.professional.service}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zone de saisie */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Envoyer
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <p className="text-lg text-gray-500">
                      Sélectionnez une conversation pour commencer
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 