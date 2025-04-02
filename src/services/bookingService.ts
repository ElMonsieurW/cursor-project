import { Booking } from '../types/booking';

const STORAGE_KEY = 'bookings';

export const bookingService = {
  getBookings: (): Booking[] => {
    const bookings = localStorage.getItem(STORAGE_KEY);
    return bookings ? JSON.parse(bookings) : [];
  },

  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    const bookings = bookingService.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  updateBookingStatus: (bookingId: string, status: Booking['status']): void => {
    const bookings = bookingService.getBookings();
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
  },

  deleteBooking: (bookingId: string): void => {
    const bookings = bookingService.getBookings();
    const filteredBookings = bookings.filter(booking => booking.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBookings));
  }
}; 