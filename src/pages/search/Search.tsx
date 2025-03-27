import { useState } from 'react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [service, setService] = useState('all');
  const [location, setLocation] = useState('');

  const services = [
    { id: 'all', name: 'Tous les services' },
    { id: 'garden', name: 'Entretien de Jardin' },
    { id: 'pool', name: 'Maintenance de Piscine' }
  ];

  // Données de test pour les professionnels
  const professionals = [
    {
      id: '1',
      name: 'Jean Dupont',
      service: 'garden',
      rating: 4.8,
      reviews: 24,
      location: 'Bordeaux',
      specialties: ['Tonte', 'Taille de haies', 'Aménagement paysager'],
      avatar: '👨‍🌾'
    },
    {
      id: '2',
      name: 'Marie Martin',
      service: 'pool',
      rating: 4.9,
      reviews: 36,
      location: 'Bordeaux',
      specialties: ['Traitement eau', 'Réparation', 'Hivernage'],
      avatar: '👩‍🔧'
    }
  ];

  const filteredProfessionals = professionals.filter(pro => {
    const matchesService = service === 'all' || pro.service === service;
    const matchesSearch = 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pro.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Rechercher un professionnel
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Trouvez l'expert qu'il vous faut pour votre jardin ou votre piscine
          </p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Recherche par mot-clé
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="search"
                id="search"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Nom, spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Type de service
            </label>
            <select
              id="service"
              name="service"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Localisation
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="location"
                id="location"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Ville..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredProfessionals.length > 0 ? (
              filteredProfessionals.map((pro) => (
                <li key={pro.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{pro.avatar}</span>
                        <div>
                          <p className="text-sm font-medium text-indigo-600">
                            {pro.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {services.find(s => s.id === pro.service)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-sm text-gray-900">{pro.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({pro.reviews} avis)</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">📍</span>
                        {pro.location}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {pro.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                Aucun professionnel trouvé pour votre recherche
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 