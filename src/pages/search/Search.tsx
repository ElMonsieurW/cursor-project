import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const services = [
    "Entretien de Jardin",
    "Maintenance de Piscine"
  ];

  const professionals = [
    {
      id: 1,
      name: "Jean Dupont",
      service: "Entretien de Jardin",
      rating: 4.8,
      reviews: 127,
      location: "Paris, Île-de-France",
      specialties: ["Taille de haies", "Tonte de pelouse", "Élagage"],
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "45€/h"
    },
    {
      id: 2,
      name: "Marie Martin",
      service: "Maintenance de Piscine",
      rating: 4.9,
      reviews: 89,
      location: "Nice, Provence-Alpes-Côte d'Azur",
      specialties: ["Nettoyage", "Traitement de l'eau", "Réparation"],
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "60€/h"
    },
    {
      id: 4,
      name: "Sophie Bernard",
      service: "Maintenance de Piscine",
      rating: 4.8,
      reviews: 112,
      location: "Lyon, Auvergne-Rhône-Alpes",
      specialties: ["Nettoyage", "Traitement de l'eau", "Vérification des équipements"],
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "55€/h"
    },
    {
      id: 5,
      name: "Marc Dubois",
      service: "Entretien de Jardin",
      rating: 4.6,
      reviews: 98,
      location: "Nantes, Pays de la Loire",
      specialties: ["Tonte", "Taille", "Fertilisation"],
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "35€/h"
    },
    {
      id: 6,
      name: "Claire Petit",
      service: "Maintenance de Piscine",
      rating: 4.9,
      reviews: 145,
      location: "Marseille, Provence-Alpes-Côte d'Azur",
      specialties: ["Nettoyage", "Traitement de l'eau", "Détection de fuites"],
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "65€/h"
    },
    {
      id: 7,
      name: "Thomas Moreau",
      service: "Entretien de Jardin",
      rating: 4.7,
      reviews: 134,
      location: "Toulouse, Occitanie",
      specialties: ["Jardinage écologique", "Compostage", "Taille d'arbres"],
      avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "42€/h"
    },
    {
      id: 8,
      name: "Julie Rousseau",
      service: "Maintenance de Piscine",
      rating: 4.8,
      reviews: 167,
      location: "Lille, Hauts-de-France",
      specialties: ["Nettoyage", "Traitement de l'eau", "Optimisation énergétique"],
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "50€/h"
    },
    {
      id: 9,
      name: "Lucas Girard",
      service: "Entretien de Jardin",
      rating: 4.5,
      reviews: 78,
      location: "Rennes, Bretagne",
      specialties: ["Tonte", "Désherbage", "Aménagement"],
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "38€/h"
    },
    {
      id: 10,
      name: "Emma Durand",
      service: "Maintenance de Piscine",
      rating: 4.9,
      reviews: 189,
      location: "Strasbourg, Grand Est",
      specialties: ["Nettoyage", "Traitement de l'eau", "Rénovation"],
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: "58€/h"
    }
  ];

  const filteredProfessionals = professionals.filter(pro => {
    const matchesService = !service || pro.service === service;
    const matchesQuery = !searchQuery || 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !location || 
      pro.location.toLowerCase().includes(location.toLowerCase());
    return matchesService && matchesQuery && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trouvez votre professionnel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recherchez le professionnel idéal pour vos besoins
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                Service
              </label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tous les services</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Localisation
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Paris 15e"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Recherche
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom ou service..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Liste des professionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map((pro) => (
            <div key={pro.id} className="group bg-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm shadow-lg">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-medium text-gray-900">{pro.rating}</span>
                    <span className="text-gray-500 ml-1">({pro.reviews})</span>
                  </span>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src={pro.avatar} 
                    alt={`${pro.name}`} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-xl font-semibold text-white mb-1">{pro.name}</h3>
                  <p className="text-sm font-medium text-white/90">{pro.service}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {pro.location}
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">{pro.price}</p>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {pro.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/booking/${pro.id}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-xl"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 