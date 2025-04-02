export interface Booking {
  id: string;
  professionalId: number;
  professionalName: string;
  professionalAvatar: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  address: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: string;
  createdAt: string;
} 