import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';
import { useAuth } from '../../contexts/AuthContext';
import MessageModal from '../../components/MessageModal';
import { professionalService } from '../../services/professionalService';

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

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { isLoggedIn, refreshKey } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadBookings();
    }
  }, [activeTab, isLoggedIn, refreshKey]);

  const loadBookings = () => {
    const allBookings = bookingService.getBookings();
    const now = new Date();
    
    // Récupérer les détails des professionnels pour chaque réservation
    const bookingsWithProfessionalDetails = allBookings.map(booking => {
      // Si la réservation a déjà les détails de professionnel complets, on la retourne telle quelle
      if (booking.professionalName && booking.professionalAvatar) {
        return {
          ...booking,
          professionalAvatar: validateAvatar(booking.professionalAvatar)
        };
      }
      
      // Sinon, on récupère les détails du professionnel
      const professional = professionalService.getProfessionalById(Number(booking.professionalId));
      return {
        ...booking,
        professionalName: professional?.name || 'Professionnel inconnu',
        professionalAvatar: validateAvatar(professional?.avatar)
      };
    });
    
    const upcomingBookings = bookingsWithProfessionalDetails.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      return bookingDate >= now && booking.status !== 'cancelled';
    });

    const pastBookings = bookingsWithProfessionalDetails.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      return bookingDate < now || booking.status === 'cancelled';
    });

    setBookings(activeTab === 'upcoming' ? upcomingBookings : pastBookings);
  };

  const handleCancelBooking = (bookingId: string) => {
    bookingService.updateBookingStatus(bookingId, 'cancelled');
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleOpenMessageModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setTimeout(() => {
      setSelectedBooking(null);
    }, 300);
  };

  // Renvoie l'ID du prestataire au format attendu par le service de messagerie
  const getProfessionalId = (booking: Booking) => {
    return `pro-${booking.professionalId}`;
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-8 sm:px-0">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mes réservations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gérez toutes vos réservations de services
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                À venir
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`${
                  activeTab === 'past'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Passées
              </button>
            </nav>
          </div>

          <div className="divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={booking.professionalAvatar || DEFAULT_AVATAR} 
                        alt={`${booking.professionalName}`} 
                        className="w-16 h-16 rounded-full object-cover mr-6"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.professionalName}
                        </h3>
                        <p className="text-sm text-gray-500">{booking.service}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <p className="text-xl font-bold text-gray-900 mt-2">{booking.price}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Date :</span> {new Date(booking.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <span className="font-medium">Heure :</span> {booking.time}
                    </div>
                    <div>
                      <span className="font-medium">Durée :</span> {booking.duration} heure{parseInt(booking.duration) > 1 ? 's' : ''}
                    </div>
                    <div>
                      <span className="font-medium">Adresse :</span> {booking.address}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4">
                      <span className="font-medium text-sm text-gray-500">Notes :</span>
                      <p className="mt-1 text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleOpenMessageModal(booking)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message
                    </button>
                    
                    {activeTab === 'upcoming' && booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Annuler la réservation
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">Aucune réservation {activeTab === 'upcoming' ? 'à venir' : 'passée'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de messagerie */}
      {selectedBooking && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          bookingId={Number(selectedBooking.id)}
          recipientId={getProfessionalId(selectedBooking)}
          recipientName={selectedBooking.professionalName}
          recipientAvatar={selectedBooking.professionalAvatar}
        />
      )}
    </div>
  );
} 