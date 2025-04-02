import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '1',
    address: '',
    notes: ''
  });

  // Données de test - À remplacer par des données réelles
  const professional = {
    id: 1,
    name: "Jean Dupont",
    service: "Entretien de Jardin",
    rating: 4.8,
    reviews: 127,
    avatar: "👨‍🌾",
    price: "45€/h"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer le prix total
    const pricePerHour = parseInt(professional.price);
    const duration = parseInt(formData.duration);
    const totalPrice = `${pricePerHour * duration}€`;

    // Créer la réservation
    bookingService.addBooking({
      professionalId: professional.id,
      professionalName: professional.name,
      professionalAvatar: professional.avatar,
      service: professional.service,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      address: formData.address,
      notes: formData.notes,
      price: totalPrice
    });

    navigate('/bookings');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Réserver un service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour réserver votre service
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Informations du professionnel */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
              <span className="text-4xl mr-6">{professional.avatar}</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{professional.name}</h2>
                <p className="text-gray-600">{professional.service}</p>
              </div>
              <div className="flex flex-col items-end space-y-4">
                <p className="text-xl font-bold text-gray-900">{professional.price}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-sm font-medium text-gray-900">{professional.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({professional.reviews} avis)</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Changer de professionnel
                </button>
              </div>
            </div>

            {/* Formulaire de réservation */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Heure
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Durée (heures)
                  </label>
                  <select
                    name="duration"
                    id="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                      <option key={hour} value={hour}>{hour} heure{hour > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes supplémentaires
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informations supplémentaires sur le service souhaité..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 