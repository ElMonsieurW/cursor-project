export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'professional' | 'customer';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
}

export interface Professional extends User {
  services: string[];
  description: string;
  availability: {
    [key: string]: TimeSlot[];
  };
  rating: number;
  reviews: Review[];
  pricing: {
    [key: string]: number;
  };
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  professionalId: string;
  customerId: string;
  service: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
} 