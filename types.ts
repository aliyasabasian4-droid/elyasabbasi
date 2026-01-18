
export type Category = 'cars' | 'real-estate' | 'electronics' | 'home' | 'services' | 'hotels' | 'spare-parts';

export type Country = 'SA' | 'AE' | 'KW' | 'OM' | 'BH' | 'QA';

export type PaymentMethod = 'visa' | 'cash';

export interface User {
  id: string;
  name: string;
  phone: string;
  country: Country;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  avatar: string;
  preferredPaymentMethods?: PaymentMethod[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  userId: string;
  location: string;
  country: Country;
  createdAt: string;
  type: 'sale' | 'rent';
  acceptedPayments?: PaymentMethod[];
  sellerRating?: number;
  reviewCount?: number;
}

export interface CartItem extends Listing {
  quantity: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  listingId: string;
  lastMessage: string;
  messages: Message[];
}
