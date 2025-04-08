import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z' fill='%239CA3AF'/%3E%3C/svg%3E";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings = bookingService.getBookings();
    const now = new Date();
    
    const upcomingBookings = allBookings.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      return bookingDate >= now && booking.status !== 'cancelled';
    });

    const pastBookings = allBookings.filter(booking => {
      const bookingDate = new Date(`${booking.date}T${booking.time}`);
      return bookingDate < now || booking.status === 'cancelled';
    });

    setBookings(activeTab === 'upcoming' ? upcomingBookings : pastBookings);
  }, [activeTab]);

  const handleCancelBooking = (bookingId: string) => {
    bookingService.updateBookingStatus(bookingId, 'cancelled');
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = DEFAULT_AVATAR;
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
                        onError={handleImageError}
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

                  {activeTab === 'upcoming' && booking.status === 'pending' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Annuler la réservation
                      </button>
                    </div>
                  )}
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
    </div>
  );
} 