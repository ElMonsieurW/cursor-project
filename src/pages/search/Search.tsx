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
      avatar: "👨‍🌾",
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
      avatar: "👩‍🔧",
      price: "60€/h"
    },
    {
      id: 3,
      name: "Pierre Laurent",
      service: "Entretien de Jardin",
      rating: 4.7,
      reviews: 156,
      location: "Bordeaux, Nouvelle-Aquitaine",
      specialties: ["Aménagement paysager", "Irrigation", "Désherbage"],
      avatar: "👨‍🌾",
      price: "40€/h"
    },
    {
      id: 4,
      name: "Sophie Bernard",
      service: "Maintenance de Piscine",
      rating: 4.8,
      reviews: 112,
      location: "Lyon, Auvergne-Rhône-Alpes",
      specialties: ["Nettoyage", "Traitement de l'eau", "Vérification des équipements"],
      avatar: "👩‍🔧",
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
      avatar: "👨‍🌾",
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
      avatar: "👩‍🔧",
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
      avatar: "👨‍🌾",
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
      avatar: "👩‍🔧",
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
      avatar: "👨‍🌾",
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
      avatar: "👩‍🔧",
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
        <div className="space-y-6">
          {filteredProfessionals.map((pro) => (
            <div key={pro.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-6">{pro.avatar}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{pro.name}</h3>
                    <p className="text-sm text-gray-500">{pro.service}</p>
                    <p className="text-sm text-gray-500">{pro.location}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-4">
                    <p className="text-xl font-bold text-gray-900">{pro.price}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm font-medium text-gray-900">{pro.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({pro.reviews} avis)</span>
                    </div>
                    <Link
                      to={`/booking/${pro.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {pro.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 