import { useState } from 'react';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Données de test - à remplacer par des données réelles
  const bookings = [
    {
      id: '1',
      service: 'Entretien de Jardin',
      type: 'Tonte et taille de haies',
      date: new Date('2024-04-01T10:00:00'),
      status: 'confirmed',
      professional: {
        name: 'Jean Dupont',
        rating: 4.8,
        avatar: '👨‍🌾'
      },
      price: 85
    },
    {
      id: '2',
      service: 'Maintenance de Piscine',
      type: 'Traitement de l\'eau et nettoyage',
      date: new Date('2024-04-03T14:00:00'),
      status: 'pending',
      professional: {
        name: 'Marie Martin',
        rating: 4.9,
        avatar: '👩‍🔧'
      },
      price: 95
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return new Date(booking.date) >= new Date();
    }
    return new Date(booking.date) < new Date();
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mes Réservations
          </h1>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`
                ${activeTab === 'upcoming'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`
                ${activeTab === 'past'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              Passées
            </button>
          </nav>
        </div>

        <div className="mt-8">
          {filteredBookings.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <li key={booking.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{booking.professional.avatar}</span>
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {booking.service}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.type}
                            </p>
                          </div>
                          <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {booking.date.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {booking.professional.name}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <span className="text-yellow-400 mr-1">⭐</span>
                            {booking.professional.rating}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p className="font-medium text-gray-900">{booking.price} €</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">
                Aucune réservation {activeTab === 'upcoming' ? 'à venir' : 'passée'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 