import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { timeSlotService, TimeSlot } from '../../services/timeSlotService';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { AddressSuggestion } from '../../services/addressService';

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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);

  // Données de test - À remplacer par des données réelles
  const professional = {
    id: 1,
    name: "Jean Dupont",
    service: "Entretien de Jardin",
    rating: 4.8,
    reviews: 127,
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
    price: "45€/h"
  };

  // Générer les dates disponibles pour les deux prochaines semaines
  useEffect(() => {
    const dates: string[] = [];
    const today = new Date();
    
    // Générer les dates pour les 14 prochains jours
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    setAvailableDates(dates);
  }, []);

  // Charger les créneaux horaires lorsque la date change
  useEffect(() => {
    if (formData.date) {
      setIsLoading(true);
      const slots = timeSlotService.getAvailableTimeSlots(professional.id, formData.date);
      setTimeSlots(slots);
      setSelectedSlotId(null);
      setFormData(prev => ({ ...prev, time: '' }));
      setIsLoading(false);
    }
  }, [formData.date, professional.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlotId) {
      alert('Veuillez sélectionner un créneau horaire');
      return;
    }
    
    // Calculer le prix total
    const pricePerHour = parseInt(professional.price);
    const duration = parseInt(formData.duration);
    const totalPrice = `${pricePerHour * duration}€`;

    // Marquer le créneau comme réservé
    timeSlotService.bookTimeSlot(selectedSlotId);

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

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedSlotId(slot.id);
    setFormData(prev => ({ 
      ...prev, 
      time: slot.startTime 
    }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, date }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setSelectedAddress(suggestion);
    setFormData(prev => ({ ...prev, address: suggestion.fullAddress }));
  };

  // Fonction pour formater la date en français
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir le jour de la semaine
  const getDayOfWeek = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir le jour du mois
  const getDayOfMonth = (dateString: string): string => {
    return new Date(dateString).getDate().toString();
  };

  // Vérifier si une date est aujourd'hui
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
              <img 
                src={professional.avatar} 
                alt={`${professional.name}`} 
                className="w-16 h-16 rounded-full object-cover mr-6"
              />
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
              {/* Sélection de date */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choisissez une date</h3>
                <div className="mb-6">
                  <div className="grid grid-cols-7 gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                          formData.date === date
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium uppercase">
                          {getDayOfWeek(date).substring(0, 3)}
                        </span>
                        <span className="text-xl font-bold my-1">{getDayOfMonth(date)}</span>
                        {isToday(date) && (
                          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Aujourd'hui
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="date"
                    value={formData.date}
                    required
                  />
                </div>
              </div>

              {/* Sélection de créneau horaire */}
              {formData.date && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Choisissez un créneau horaire pour le {formatDate(formData.date)}
                  </h3>
                  
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">Chargement des créneaux...</p>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`py-3 px-4 rounded-md text-center ${
                            selectedSlotId === slot.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-red-500">Aucun créneau disponible pour cette date</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={handleAddressChange}
                    onSelect={handleAddressSelect}
                    required={true}
                    placeholder="Saisissez votre adresse complète"
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

              {selectedSlotId && (
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-green-800">Résumé de votre réservation</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p><strong>Date:</strong> {formatDate(formData.date)}</p>
                    <p><strong>Heure:</strong> {formData.time}</p>
                    <p><strong>Durée:</strong> {formData.duration} heure{parseInt(formData.duration) > 1 ? 's' : ''}</p>
                    {formData.address && (
                      <p><strong>Adresse:</strong> {formData.address}</p>
                    )}
                    <p><strong>Prix estimé:</strong> {parseInt(professional.price) * parseInt(formData.duration)}€</p>
                  </div>
                </div>
              )}

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
                  disabled={!selectedSlotId}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    selectedSlotId 
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
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