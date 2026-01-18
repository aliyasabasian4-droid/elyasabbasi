
import React from 'react';
import { Car, Home, Smartphone, Sofa, Briefcase, Hotel, Wrench, ShoppingBag } from 'lucide-react';
import { Category, Country, Listing } from './types';

export const CATEGORIES: { id: Category; name: string; icon: React.ReactNode }[] = [
  { id: 'cars', name: 'سيارات', icon: <Car className="w-6 h-6" /> },
  { id: 'real-estate', name: 'عقارات', icon: <Home className="w-6 h-6" /> },
  { id: 'electronics', name: 'إلكترونيات', icon: <Smartphone className="w-6 h-6" /> },
  { id: 'home', name: 'أثاث منزلي', icon: <Sofa className="w-6 h-6" /> },
  { id: 'hotels', name: 'فنادق واستراحات', icon: <Hotel className="w-6 h-6" /> },
  { id: 'spare-parts', name: 'قطع غيار', icon: <Wrench className="w-6 h-6" /> },
  { id: 'services', name: 'خدمات', icon: <Briefcase className="w-6 h-6" /> },
];

export const COUNTRIES: { id: Country; nameAr: string; nameEn: string; flag: string }[] = [
  { id: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'AE', nameAr: 'الإمارات', nameEn: 'UAE', flag: '🇦🇪' },
  { id: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', flag: '🇰🇼' },
  { id: 'OM', nameAr: 'عمان', nameEn: 'Oman', flag: '🇴🇲' },
  { id: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', flag: '🇧🇭' },
  { id: 'QA', nameAr: 'قطر', nameEn: 'Qatar', flag: '🇶🇦' },
];

export const MOCK_LISTINGS: Partial<Listing>[] = [
  {
    id: '1',
    title: 'تويوتا كامري 2023 فل كامل',
    price: 95000,
    category: 'cars',
    images: ['https://picsum.photos/seed/car1/800/600'],
    location: 'الرياض، حي النرجس',
    country: 'SA',
    createdAt: 'منذ ساعتين',
    type: 'sale',
    acceptedPayments: ['visa', 'cash'],
    sellerRating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    title: 'شقة مفروشة للإيجار السنوي',
    price: 45000,
    category: 'real-estate',
    images: ['https://picsum.photos/seed/apt1/800/600'],
    location: 'دبي، مرسى دبي',
    country: 'AE',
    createdAt: 'منذ يوم',
    type: 'rent',
    acceptedPayments: ['visa'],
    sellerRating: 4.5,
    reviewCount: 42
  },
  {
    id: '3',
    title: 'استراحة خاصة للمناسبات مع مسبح',
    price: 1200,
    category: 'hotels',
    images: ['https://picsum.photos/seed/resort1/800/600'],
    location: 'المنامة، جزر أمواج',
    country: 'BH',
    createdAt: 'منذ 5 ساعات',
    type: 'rent',
    acceptedPayments: ['cash'],
    sellerRating: 4.9,
    reviewCount: 18
  },
  {
    id: '4',
    title: 'مساعدات تويوتا أصلية وكالة',
    price: 450,
    category: 'spare-parts',
    images: ['https://picsum.photos/seed/parts1/800/600'],
    location: 'الكويت، الشويخ',
    country: 'KW',
    createdAt: 'منذ ساعة',
    type: 'sale',
    acceptedPayments: ['visa', 'cash'],
    sellerRating: 4.2,
    reviewCount: 56
  }
];
