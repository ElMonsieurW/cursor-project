import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService, Booking } from '../services/bookingService';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getUserBookings(user?.id || '');
      setBookings(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des réservations:', err);
      setError('Une erreur est survenue lors de la récupération de vos réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setError(null);
      await bookingService.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la réservation:', err);
      setError('Une erreur est survenue lors de l\'annulation de la réservation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Vous n'avez aucune réservation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {booking.professional?.avatar_url && (
                  <img
                    src={booking.professional.avatar_url}
                    alt={booking.professional.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{booking.professional?.name}</h3>
                  <p className="text-gray-600">{booking.professional?.profession}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Date :</span>{' '}
                  {new Date(booking.time_slot?.start_time || '').toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Statut :</span>{' '}
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmé' :
                     booking.status === 'cancelled' ? 'Annulé' :
                     'En attente'}
                  </span>
                </p>
              </div>

              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Annuler la réservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 