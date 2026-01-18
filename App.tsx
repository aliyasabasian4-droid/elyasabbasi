
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, MessageCircle, User, Home as HomeIcon, MapPin, Camera, X, Send, ChevronRight, ShoppingBag, SlidersHorizontal, Heart, Share2, Star, ShieldCheck, Map, Languages, Tag, Key, Sparkles, ShoppingCart, Trash2, PlusCircle, MinusCircle, CreditCard, Banknote, Globe, Filter, ChevronLeft, ChevronDown, Navigation, Check, Video, Play, StopCircle, Wand2, Info, ExternalLink } from 'lucide-react';
import { CATEGORIES, MOCK_LISTINGS, COUNTRIES } from './constants';
import { Listing, User as UserType, Category, Chat, Message, CartItem, Country, PaymentMethod } from './types';
import { generateListingDescription, suggestPrice, editListingImage, searchNearbyPlaces, getMarketInsight } from './geminiService';
import CategoryFilter from './CategoryFilter';

// Extended Listing type
interface ExtendedListing extends Listing {
  videoUrl?: string;
  lat?: number;
  lng?: number;
}

const TRANSLATIONS = {
  ar: {
    appName: "توفير تايم",
    searchPlaceholder: "ابحث عن سيارات، شقق، أجهزة...",
    minPrice: "الأقل",
    maxPrice: "الأعلى",
    from: "السعر من:",
    to: "إلى:",
    reset: "مسح التصفية",
    priceFilterActive: "تصفية حسب السعر",
    priceRangeTitle: "نطاق السعر (ريال)",
    advertiseNow: "أعلن الآن مجاناً!",
    fasterReach: "وصول أسرع لآلاف المشترين في منطقتك",
    addAd: "إضافة إعلان",
    suggestedAds: "الإعلانات المقترحة",
    noResults: "لا توجد نتائج تطابق خياراتك في هذه الدولة",
    home: "الرئيسية",
    chats: "دردشة",
    saved: "المحفوظات",
    profile: "حسابي",
    rent: "إيجار",
    sale: "بيع",
    allTypes: "الكل",
    contact: "تواصل",
    contactSeller: "تواصل مع البائع",
    trustedSeller: "البائع الموثوق",
    shareLocation: "مشاركة الموقع",
    addNewListing: "أضف إعلان جديد",
    listingPhoto: "صورة وفيديو الإعلان",
    capturePhoto: "التقط صورة",
    captureVideo: "تسجيل فيديو",
    whatSelling: "ماذا تبيع؟",
    aiHelp: "توليد بالذكاء الاصطناعي",
    thinking: "جاري التفكير...",
    category: "القسم",
    price: "السعر",
    description: "وصف الإعلان",
    detailsPlaceholder: "اكتب تفاصيل المنتج...",
    publish: "نشر الإعلان",
    descriptionTitle: "الوصف",
    noDescription: "لا يوجد وصف متوفر لهذا الإعلان.",
    memberSince: "عضو منذ",
    rating: "التقييم",
    listingsCount: "الإعلانات",
    viewAllAds: "عرض جميع الإعلانات",
    sendMessage: "إرسال رسالة",
    verifiedIdentity: "هوية موثقة",
    locationAccessRequired: "يرجى تفعيل صلاحية الوصول للموقع للمشاركة.",
    browserNoGeo: "المتصفح لا يدعم تحديد الموقع",
    locationShared: "تم نسخ الموقع:",
    all: "الكل",
    cart: "سلة المشتريات",
    addToCart: "إضافة للسلة",
    total: "الإجمالي",
    emptyCart: "السلة فارغة حالياً",
    checkout: "إتمام الطلب",
    itemAdded: "تمت إضافة المنتج للسلة",
    country: "الدولة",
    paymentMethod: "طريقة الدفع",
    visa: "فيزا",
    cash: "كاش عند الاستلام",
    paymentMethodsLabel: "طرق الدفع المقبولة",
    changeCountry: "اختر الدولة",
    selectPayment: "اختر طريقة الدفع",
    confirmOrder: "تأكيد الطلب",
    currency: "ريال",
    itemsCount: "منتجات",
    aiEdit: "تعديل ذكي للصورة",
    editPromptPlaceholder: "مثلاً: اجعل الصورة أكثر إشراقاً، أضف خلفية...",
    processing: "جاري المعالجة...",
    marketAnalysis: "تحليل السوق",
    nearbyServices: "خدمات قريبة",
    sources: "المصادر",
    marketInsight: "رؤية السوق",
    insightLoading: "جاري تحليل السوق...",
    nearbyLoading: "جاري البحث عن خدمات قريبة...",
    categories: {
      'cars': 'سيارات',
      'real-estate': 'عقارات',
      'electronics': 'إلكترونيات',
      'home': 'أثاث منزلي',
      'hotels': 'فنادق واستراحات',
      'spare-parts': 'قطع غيار',
      'services': 'خدمات'
    }
  },
  en: {
    appName: "Tawfeer Time",
    searchPlaceholder: "Search for cars, apts, devices...",
    minPrice: "Min",
    maxPrice: "Max",
    from: "Price From:",
    to: "To:",
    reset: "Reset Filter",
    priceFilterActive: "Price Filter Active",
    priceRangeTitle: "Price Range (SAR)",
    advertiseNow: "Post Ad for Free!",
    fasterReach: "Reach thousands of buyers in your area faster",
    addAd: "Add Listing",
    suggestedAds: "Suggested Ads",
    noResults: "No results match your filters in this country",
    home: "Home",
    chats: "Chats",
    saved: "Saved",
    profile: "Profile",
    rent: "Rent",
    sale: "Sale",
    allTypes: "All",
    contact: "Contact",
    contactSeller: "Contact Seller",
    trustedSeller: "Trusted Seller",
    shareLocation: "Share Location",
    addNewListing: "Add New Listing",
    listingPhoto: "Photo & Video",
    capturePhoto: "Take Photo",
    captureVideo: "Record Video",
    whatSelling: "What are you selling?",
    aiHelp: "AI Generate",
    thinking: "Thinking...",
    category: "Category",
    price: "Price",
    description: "Description",
    detailsPlaceholder: "Write product details...",
    publish: "Publish Ad",
    descriptionTitle: "Description",
    noDescription: "No description available.",
    memberSince: "Member since",
    rating: "Rating",
    listingsCount: "Listings",
    viewAllAds: "View all ads",
    sendMessage: "Send message",
    verifiedIdentity: "Verified Identity",
    locationAccessRequired: "Please enable location access to share.",
    browserNoGeo: "Browser does not support geolocation",
    locationShared: "Location copied:",
    all: "All",
    cart: "Shopping Cart",
    addToCart: "Add to Cart",
    total: "Total",
    emptyCart: "Cart is currently empty",
    checkout: "Checkout",
    itemAdded: "Item added to cart",
    country: "Country",
    paymentMethod: "Payment Method",
    visa: "Visa",
    cash: "Cash on Delivery",
    paymentMethodsLabel: "Accepted Payment Methods",
    changeCountry: "Select Country",
    selectPayment: "Select Payment Method",
    confirmOrder: "Confirm Order",
    currency: "SAR",
    itemsCount: "items",
    aiEdit: "Smart Image Edit",
    editPromptPlaceholder: "E.g., Make it brighter, add background...",
    processing: "Processing...",
    marketAnalysis: "Market Analysis",
    nearbyServices: "Nearby Services",
    sources: "Sources",
    marketInsight: "Market Insight",
    insightLoading: "Analyzing market...",
    nearbyLoading: "Searching nearby...",
    categories: {
      'cars': 'Cars',
      'real-estate': 'Real Estate',
      'electronics': 'Electronics',
      'home': 'Furniture',
      'hotels': 'Resorts',
      'spare-parts': 'Spare Parts',
      'services': 'Services'
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('tawfeer_lang') as 'ar' | 'en') || 'ar';
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('tawfeer_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const [activeTab, setActiveTab] = useState<'home' | 'chats' | 'add' | 'profile' | 'saved'>('home');
  const [user, setUser] = useState<UserType | null>(null);
  const [listings, setListings] = useState<ExtendedListing[]>(MOCK_LISTINGS as any);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'sale' | 'rent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ExtendedListing | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [viewingSeller, setViewingSeller] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('tawfeer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const newUser: UserType = { 
        id: 'u1', 
        name: lang === 'ar' ? 'زائر' : 'Guest', 
        phone: '0500000000', 
        country: 'SA',
        avatar: 'https://picsum.photos/seed/user/100',
        preferredPaymentMethods: ['cash']
      };
      setUser(newUser);
      localStorage.setItem('tawfeer_user', JSON.stringify(newUser));
    }

    const savedListings = localStorage.getItem('tawfeer_listings');
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    }

    const favorites = localStorage.getItem('tawfeer_favorites');
    if (favorites) {
      setSavedIds(JSON.parse(favorites));
    }

    const savedCart = localStorage.getItem('tawfeer_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('tawfeer_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (e: React.MouseEvent, listing: Listing) => {
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === listing.id);
      if (existing) {
        return prev.map(item => item.id === listing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...listing, quantity: 1 }];
    });
    showToast(t.itemAdded);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartItemCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const handleAddListing = (newListing: ExtendedListing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem('tawfeer_listings', JSON.stringify(updated));
    setActiveTab('home');
    showToast(lang === 'ar' ? 'تم نشر الإعلان بنجاح' : 'Listing published successfully');
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSaved = savedIds.includes(id) 
      ? savedIds.filter(favId => favId !== id) 
      : [...savedIds, id];
    setSavedIds(newSaved);
    localStorage.setItem('tawfeer_favorites', JSON.stringify(newSaved));
  };

  const handleStartChat = (listing: Listing) => {
    const newChat: Chat = { 
      id: `c_${listing.id}`, 
      participants: ['u1', listing.userId || 'u2'], 
      listingId: listing.id, 
      lastMessage: '', 
      messages: [] 
    };
    setActiveChat(newChat);
    setActiveTab('chats');
    setSelectedListing(null);
  };

  const handleShareListingLocation = (e: React.MouseEvent | React.TouchEvent, listing: Listing) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert(t.browserNoGeo);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const shareData = {
        title: `${t.appName}: ${listing.title}`,
        text: `${lang === 'ar' ? 'شاهد موقع هذا الإعلان:' : 'Check out this listing location:'} ${listing.title} (${listing.location}).`,
        url: mapsUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error("Error sharing location:", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(`${shareData.text} ${mapsUrl}`);
          alert(`${t.locationShared} ${mapsUrl}`);
        } catch (copyErr) {
          alert(mapsUrl);
        }
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert(t.locationAccessRequired);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  };

  const updateCountry = (countryId: Country) => {
    if (user) {
      const updatedUser = { ...user, country: countryId };
      setUser(updatedUser);
      localStorage.setItem('tawfeer_user', JSON.stringify(updatedUser));
    }
    setIsCountryModalOpen(false);
  };

  const isFilterActive = minPrice !== '' || maxPrice !== '';

  const filteredListings = listings.filter(l => {
    const matchesCountry = user?.country === l.country;
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
    const matchesType = selectedType === 'all' || l.type === selectedType;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
    const min = minPrice === '' ? 0 : parseFloat(minPrice);
    const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
    const matchesPrice = l.price >= min && l.price <= max;
    return matchesCountry && matchesCategory && matchesType && matchesSearch && matchesPrice;
  });

  const savedListingsItems = listings.filter(l => savedIds.includes(l.id));

  const currentCountry = COUNTRIES.find(c => c.id === user?.country);

  const ListingCard = ({ listing }: { listing: ExtendedListing }) => (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 active:scale-95 transition-transform relative flex flex-col h-full"
      onClick={() => setSelectedListing(listing)}
    >
      <div className="h-32 relative">
        <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
        {listing.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Play className="w-8 h-8 text-white drop-shadow-lg opacity-70" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] shadow-sm font-bold">
          {listing.type === 'rent' ? t.rent : t.sale}
        </div>
        <button 
          onClick={(e) => toggleFavorite(e, listing.id)}
          className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md border border-white/30 transition-colors ${savedIds.includes(listing.id) ? 'bg-red-500 text-white' : 'bg-black/20 text-white'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${savedIds.includes(listing.id) ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-1">
          <h4 className="text-sm font-bold line-clamp-1 mb-0.5">{listing.title}</h4>
          <button 
            onClick={(e) => handleShareListingLocation(e, listing)} 
            className="p-1 text-gray-400 hover:text-emerald-500 active:scale-125 transition-transform"
            title={t.shareLocation}
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <p className="text-emerald-600 font-bold text-sm">{listing.price} {t.currency}</p>
          <div className="flex items-center gap-0.5 text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{listing.sellerRating !== undefined ? listing.sellerRating : '4.5'}</span>
            <span className="text-gray-400 font-normal">({listing.reviewCount || '0'})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{listing.location}</span>
        </div>
        <div 
          className="mt-auto pt-2 border-t border-gray-50 flex items-center gap-2 hover:bg-gray-50 transition-colors rounded-md py-1 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setViewingSeller(listing.userId || 'u2'); }}
        >
          <img src={`https://picsum.photos/seed/${listing.userId || 'u2'}/50`} className="w-5 h-5 rounded-full" alt="" />
          <span className="text-[10px] font-bold text-gray-600 truncate">{t.trustedSeller}</span>
        </div>
      </div>
      <div className="px-2 pb-2 flex gap-1.5">
        <button onClick={(e) => { e.stopPropagation(); handleStartChat(listing); }} className="flex-1 bg-emerald-50 text-emerald-600 py-1.5 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform">
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">{t.contact}</span>
        </button>
        <button onClick={(e) => addToCart(e, listing)} className="bg-emerald-600 text-white px-2 rounded-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-emerald-700" title={t.addToCart}>
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-2xl relative">
      <header className="bg-white px-4 py-3 shadow-sm z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-emerald-600 tracking-tight">{t.appName}</h1>
            <button 
              onClick={() => setIsCountryModalOpen(true)}
              className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl active:scale-95 transition-all shadow-sm"
            >
              <span className="text-xl leading-none">{currentCountry?.flag}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleLanguage} className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-1 transition-colors">
              <Languages className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button 
              className={`p-2 rounded-full relative transition-all ${showFilters || isFilterActive ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-gray-50 text-gray-400'}`} 
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {isFilterActive && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full bg-gray-100 rounded-xl py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-inner transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3 text-gray-400 w-5 h-5`} />
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-bold text-gray-500">{t.priceRangeTitle}</span>
              {isFilterActive && (
                <button 
                  onClick={() => { setMinPrice(''); setMaxPrice(''); }} 
                  className="text-[10px] text-red-500 font-bold hover:underline"
                >
                  {t.reset}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-white rounded-xl border border-gray-100 px-3 py-2.5 shadow-sm focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
                <span className="text-[10px] text-gray-400 min-w-max mr-1">{t.from}</span>
                <input 
                  type="number" 
                  placeholder={t.minPrice} 
                  className="bg-transparent text-xs w-full outline-none font-bold text-gray-700" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                />
              </div>
              <div className="flex-1 flex items-center bg-white rounded-xl border border-gray-100 px-3 py-2.5 shadow-sm focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
                <span className="text-[10px] text-gray-400 min-w-max mr-1">{t.to}</span>
                <input 
                  type="number" 
                  placeholder={t.maxPrice} 
                  className="bg-transparent text-xs w-full outline-none font-bold text-gray-700" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {activeTab === 'home' && (
          <>
            <CategoryFilter 
              categories={CATEGORIES.map(c => ({...c, name: t.categories[c.id as keyof typeof t.categories]}))} 
              selectedCategory={selectedCategory} 
              onSelect={(cat) => { setSelectedCategory(cat); setSelectedType('all'); }} 
              allText={t.all}
            />

            <div className="px-4 mb-4 flex gap-2">
              <button 
                onClick={() => setSelectedType('all')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${selectedType === 'all' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-500 border-gray-100'}`}
              >
                {t.allTypes}
              </button>
              <button 
                onClick={() => setSelectedType('sale')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${selectedType === 'sale' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-500 border-gray-100'}`}
              >
                <Tag className="w-3 h-3" />
                {t.sale}
              </button>
              <button 
                onClick={() => setSelectedType('rent')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${selectedType === 'rent' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-500 border-gray-100'}`}
              >
                <Key className="w-3 h-3" />
                {t.rent}
              </button>
            </div>

            <div className="px-4 grid grid-cols-2 gap-3 mb-6">
              {filteredListings.length > 0 ? (
                filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} />)
              ) : (
                <div className="col-span-2 py-20 text-center">
                  <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                    <Globe className="w-12 h-12 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-xs px-10 leading-relaxed font-bold">{t.noResults}</p>
                  {isFilterActive && (
                    <button 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); }} 
                      className="mt-6 text-emerald-600 font-bold text-sm bg-emerald-50 px-6 py-2.5 rounded-xl border border-emerald-100 active:scale-95 transition-transform"
                    >
                      {t.reset}
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div className="px-4 py-4">
            <h2 className="text-xl font-bold mb-6">{t.saved}</h2>
            {savedListingsItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {savedListingsItems.map(listing => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Heart className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm">{lang === 'ar' ? 'لم تقم بحفظ أي إعلان بعد' : 'No saved ads yet'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <AddListingScreen 
            t={t} 
            onAdd={handleAddListing} 
            onCancel={() => setActiveTab('home')} 
            lang={lang} 
            userCountry={user?.country || 'SA'}
            userPreferredPayments={user?.preferredPaymentMethods}
            showToast={showToast}
          />
        )}
        {activeTab === 'chats' && <ChatListScreen t={t} lang={lang} chats={chats} onSelectChat={setActiveChat} />}
        {activeTab === 'profile' && (
          <ProfileScreen 
            t={t} 
            lang={lang} 
            user={user!} 
            onUpdateUser={(u) => { 
              setUser(u); 
              localStorage.setItem('tawfeer_user', JSON.stringify(u)); 
            }} 
          />
        )}
      </main>

      {/* Floating Cart FAB */}
      {cart.length > 0 && !isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-[0_10px_25px_rgba(5,150,105,0.4)] z-[45] flex items-center justify-center animate-in zoom-in duration-300 active:scale-90 transition-transform hover:bg-emerald-700"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {cartItemCount}
            </span>
          </div>
        </button>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl z-[200] animate-in slide-in-from-top duration-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Country Selection Modal */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCountryModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">{t.changeCountry}</h3>
              <button onClick={() => setIsCountryModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {COUNTRIES.map(country => (
                <button 
                  key={country.id}
                  onClick={() => updateCountry(country.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${user?.country === country.id ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-50 bg-white text-gray-600 hover:border-emerald-200'}`}
                >
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <span className="text-xs font-bold">
                    {lang === 'ar' ? country.nameAr : country.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side Cart Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className={`relative bg-white w-full max-w-[85%] sm:max-w-sm h-full shadow-2xl flex flex-col animate-in ${lang === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-300`}>
            <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold leading-none mb-1">{t.cart}</h2>
                  <p className="text-[10px] font-medium opacity-80">{cartItemCount} {t.itemsCount}</p>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="bg-gray-100 p-6 rounded-full mb-4"><ShoppingCart className="w-12 h-12 opacity-20" /></div>
                  <p className="font-bold text-sm">{t.emptyCart}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0"><img src={item.images[0]} className="w-full h-full object-cover" alt="" /></div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs line-clamp-2 pr-1">{item.title}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-1 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-emerald-600 font-black text-xs">{item.price} {t.currency}</p>
                        <div className="flex items-center gap-2 bg-emerald-50 px-1.5 py-1 rounded-lg border border-emerald-100">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-emerald-600 hover:scale-110 transition-transform"><MinusCircle className="w-4 h-4" /></button>
                          <span className="text-[10px] font-black w-3 text-center text-emerald-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-emerald-600 hover:scale-110 transition-transform"><PlusCircle className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs font-bold">{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="text-gray-600 font-bold text-sm">{cartTotal} {t.currency}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-emerald-900 font-black text-sm">{t.total}</span>
                    <span className="text-xl font-black text-emerald-600">{cartTotal} {t.currency}</span>
                  </div>
                </div>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-emerald-700"><CreditCard className="w-5 h-5" />{t.checkout}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">{t.selectPayment}</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 mb-8">
              <button onClick={() => setSelectedPayment('visa')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'visa' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 text-gray-500'}`}>
                <div className="flex items-center gap-4"><CreditCard className={`w-6 h-6 ${selectedPayment === 'visa' ? 'text-emerald-600' : 'text-gray-400'}`} /><span className="font-bold">{t.visa}</span></div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'visa' ? 'border-emerald-600' : 'border-gray-300'}`}>{selectedPayment === 'visa' && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}</div>
              </button>
              <button onClick={() => setSelectedPayment('cash')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${selectedPayment === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 text-gray-500'}`}>
                <div className="flex items-center gap-4"><Banknote className={`w-6 h-6 ${selectedPayment === 'cash' ? 'text-emerald-600' : 'text-gray-400'}`} /><span className="font-bold">{t.cash}</span></div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'cash' ? 'border-emerald-600' : 'border-gray-300'}`}>{selectedPayment === 'cash' && <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />}</div>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm px-1"><span className="text-gray-500 font-bold">{t.total}</span><span className="font-black text-emerald-600">{cartTotal} {t.currency}</span></div>
              <button onClick={() => { alert(lang === 'ar' ? `تم تأكيد طلبك بنجاح! وسيلة الدفع: ${selectedPayment === 'visa' ? t.visa : t.cash}. شكراً لاستخدامك توفير تايم.` : `Order confirmed! Payment: ${selectedPayment === 'visa' ? t.visa : t.cash}. Thank you for using Tawfeer Time.`); setCart([]); setIsCheckoutOpen(false); setIsCartOpen(false); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 active:scale-95 transition-transform">{t.confirmOrder}</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-3 rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <HomeIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">{t.home}</span>
        </button>
        <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center gap-1 ${activeTab === 'chats' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold">{t.chats}</span>
        </button>
        <div className="relative -top-6">
          <button onClick={() => setActiveTab('add')} className="bg-emerald-500 p-4 rounded-full text-white shadow-xl active:scale-90 transition-transform"><Plus className="w-6 h-6" /></button>
        </div>
        <button onClick={() => setActiveTab('saved')} className={`flex flex-col items-center gap-1 ${activeTab === 'saved' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <Heart className={`w-6 h-6 ${activeTab === 'saved' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">{t.saved}</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">{t.profile}</span>
        </button>
      </nav>

      {selectedListing && (
        <ListingDetail 
          t={t} lang={lang} listing={selectedListing} isSaved={savedIds.includes(selectedListing.id)}
          onToggleSave={(e) => toggleFavorite(e, selectedListing.id)} onClose={() => setSelectedListing(null)} 
          onChat={() => handleStartChat(selectedListing)} 
          onAddToCart={(e) => { addToCart(e, selectedListing); setSelectedListing(null); }}
          onShareLocation={(e) => handleShareListingLocation(e, selectedListing)}
        />
      )}
      {activeChat && <ChatWindow t={t} lang={lang} chat={activeChat} onClose={() => setActiveChat(null)} />}
      
      {viewingSeller && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-end animate-in fade-in duration-300 px-4 pb-20">
          <div className="bg-white w-full rounded-3xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4"><img src={`https://picsum.photos/seed/${viewingSeller}/100`} className="w-16 h-16 rounded-full border-2 border-emerald-100" alt="" /><div><h3 className="font-bold text-lg">{t.trustedSeller}</h3><div className="flex items-center gap-1 text-emerald-500 text-xs"><ShieldCheck className="w-3 h-3" /><span>{t.verifiedIdentity}</span></div></div></div>
              <button onClick={() => setViewingSeller(null)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-400 mb-1">{t.rating}</p><div className="flex items-center justify-center gap-1 text-emerald-600 font-bold"><span>4.8</span> <Star className="w-3 h-3 fill-current" /></div></div>
              <div className="bg-gray-50 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-400 mb-1">{t.memberSince}</p><p className="text-xs font-bold text-gray-700">2022</p></div>
              <div className="bg-gray-50 p-3 rounded-2xl text-center"><p className="text-[10px] text-gray-400 mb-1">{t.listingsCount}</p><p className="text-xs font-bold text-gray-700">14</p></div>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200">{t.viewAllAds}</button>
              <button onClick={() => { setActiveTab('chats'); setViewingSeller(null); }} className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold">{t.sendMessage}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ListingDetail: React.FC<{ 
  t: any; 
  lang: string; 
  listing: ExtendedListing; 
  isSaved: boolean; 
  onToggleSave: (e: React.MouseEvent) => void; 
  onClose: () => void; 
  onChat: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onShareLocation: (e: React.MouseEvent) => void;
}> = ({ t, lang, listing, isSaved, onToggleSave, onClose, onChat, onAddToCart, onShareLocation }) => {
  const [marketInsight, setMarketInsight] = useState<{text: string, links: any[]} | null>(null);
  const [nearbyHighlights, setNearbyHighlights] = useState<{text: string, links: any[]} | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(false);

  const handleFetchMarketInsight = async () => {
    setLoadingInsight(true);
    const res = await getMarketInsight(listing.title);
    setMarketInsight(res);
    setLoadingInsight(false);
  };

  const handleFetchNearby = async () => {
    setLoadingNearby(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await searchNearbyPlaces(pos.coords.latitude, pos.coords.longitude, listing.category);
      setNearbyHighlights(res);
      setLoadingNearby(false);
    }, () => {
       searchNearbyPlaces(24.7136, 46.6753, listing.category).then(res => {
         setNearbyHighlights(res);
         setLoadingNearby(false);
       });
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-[80] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
      <div className="relative h-72 bg-black">
        {listing.videoUrl ? (
          <video src={listing.videoUrl} className="w-full h-full object-contain" controls autoPlay loop />
        ) : (
          <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <button onClick={onClose} className="bg-black/20 backdrop-blur-md text-white p-2 rounded-full border border-white/30 pointer-events-auto">
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-2 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); onShareLocation(e); }} 
              className="p-2 rounded-full backdrop-blur-md border border-white/30 bg-black/20 text-white hover:bg-emerald-600 transition-colors"
              title={t.shareLocation}
            >
              <Navigation className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleSave(e); }} className={`p-2 rounded-full backdrop-blur-md border border-white/30 transition-colors ${isSaved ? 'bg-red-500 text-white border-red-500' : 'bg-black/20 text-white'}`}>
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-black text-gray-800 flex-1">{listing.title}</h2>
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
              {listing.type === 'rent' ? t.rent : t.sale}
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div 
              className="flex items-center gap-1.5 text-gray-400 text-xs cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={onShareLocation}
            >
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{listing.sellerRating !== undefined ? listing.sellerRating : '4.5'}</span>
              <span className="text-gray-400 font-normal ml-1">({listing.reviewCount || '0'} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mb-4">{listing.price} {t.currency}</p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleFetchMarketInsight}
              className="flex-1 bg-blue-50 text-blue-700 px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs border border-blue-100 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4" />
              {t.marketAnalysis}
            </button>
            <button 
              onClick={handleFetchNearby}
              className="flex-1 bg-amber-50 text-amber-700 px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs border border-amber-100 transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              {t.nearbyServices}
            </button>
          </div>

          {listing.acceptedPayments && listing.acceptedPayments.length > 0 && (
            <div className="mt-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{t.paymentMethodsLabel}</span>
              <div className="flex gap-2">
                {listing.acceptedPayments.map(p => (
                  <div key={p} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                    {p === 'visa' ? <CreditCard className="w-3.5 h-3.5 text-blue-600" /> : <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="text-[10px] font-bold text-gray-700">{t[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gemini Grounding Sections */}
        {loadingInsight && <div className="p-4 bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 animate-pulse text-xs font-bold text-blue-400 text-center">{t.insightLoading}</div>}
        {marketInsight && (
          <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Globe className="w-4 h-4" /></div>
              <h4 className="font-black text-blue-900 text-sm">{t.marketInsight}</h4>
            </div>
            <p className="text-blue-800/80 text-xs leading-relaxed mb-4">{marketInsight.text}</p>
            {marketInsight.links.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{t.sources}</span>
                <div className="flex flex-wrap gap-2">
                  {marketInsight.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-white px-3 py-1.5 rounded-full text-[10px] text-blue-600 border border-blue-100 flex items-center gap-1.5 font-bold shadow-sm">
                      {link.title || 'Source'}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loadingNearby && <div className="p-4 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200 animate-pulse text-xs font-bold text-amber-400 text-center">{t.nearbyLoading}</div>}
        {nearbyHighlights && (
          <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-600 p-1.5 rounded-lg text-white"><MapPin className="w-4 h-4" /></div>
              <h4 className="font-black text-amber-900 text-sm">{t.nearbyServices}</h4>
            </div>
            <p className="text-amber-800/80 text-xs leading-relaxed mb-4">{nearbyHighlights.text}</p>
            {nearbyHighlights.links.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{t.sources}</span>
                <div className="flex flex-wrap gap-2">
                  {nearbyHighlights.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-white px-3 py-1.5 rounded-full text-[10px] text-amber-600 border border-amber-100 flex items-center gap-1.5 font-bold shadow-sm">
                      {link.title || 'View on Maps'}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-px bg-gray-100" />

        <div>
          <h3 className="text-lg font-bold mb-3">{t.descriptionTitle}</h3>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {listing.description || t.noDescription}
          </p>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <img src={`https://picsum.photos/seed/${listing.userId || 'u2'}/100`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="" />
            <div>
              <p className="font-bold text-gray-800">{t.trustedSeller}</p>
              <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.verifiedIdentity}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current text-gray-200" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md border-t flex gap-4 z-[90]">
        <button onClick={onChat} className="flex-1 bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-emerald-100 active:scale-95 transition-transform">
          <MessageCircle className="w-5 h-5" />
          {t.contactSeller}
        </button>
        <button onClick={onAddToCart} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-transform">
          <ShoppingCart className="w-5 h-5" />
          {t.addToCart}
        </button>
      </div>
    </div>
  );
};

const AddListingScreen: React.FC<{ t: any; onAdd: (l: ExtendedListing) => void; onCancel: () => void; lang: string; userCountry: Country; userPreferredPayments?: PaymentMethod[]; showToast?: (message: string) => void }> = ({ t, onAdd, onCancel, lang, userCountry, userPreferredPayments, showToast }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('electronics');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [description, setDescription] = useState('');
  const [acceptedPayments, setAcceptedPayments] = useState<PaymentMethod[]>(userPreferredPayments || ['cash']);
  const [loadingAI, setLoadingAI] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [isAiEditing, setIsAiEditing] = useState(false);

  const startCamera = async (mode: 'photo' | 'video') => {
    try {
      setCameraMode(mode);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: mode === 'video'
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      alert(lang === 'ar' ? 'لم نتمكن من الوصول للكاميرا' : 'Could not access camera');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      setPreviewImage(canvas.toDataURL('image/jpeg'));
      setPreviewVideo(null);
      stopCamera();
    }
  };

  const startRecording = () => {
    if (streamRef.current) {
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setPreviewVideo(URL.createObjectURL(blob));
        setPreviewImage(null);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    stopCamera();
  };

  const handleAiEdit = async () => {
    if (!previewImage || !aiEditPrompt) return;
    setIsAiEditing(true);
    const result = await editListingImage(previewImage, aiEditPrompt);
    if (result) {
      setPreviewImage(result);
      setAiEditPrompt('');
      showToast?.(t.processing);
    } else {
      alert(lang === 'ar' ? 'فشل تعديل الصورة بالذكاء الاصطناعي' : 'AI image editing failed');
    }
    setIsAiEditing(false);
  };

  const handleAIHelp = async () => {
    if (!title) return alert(lang === 'ar' ? 'الرجاء كتابة عنوان أولاً' : 'Please write a title first');
    setLoadingAI(true);
    try {
      const desc = await generateListingDescription(title, category);
      setDescription(desc || '');
      const suggested = await suggestPrice(title);
      if (suggested && !price) setPrice(suggested.replace(/[^0-9]/g, ''));
    } finally {
      setLoadingAI(false);
    }
  };

  const togglePayment = (method: PaymentMethod) => {
    setAcceptedPayments(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  return (
    <div className="p-4 bg-white min-h-full">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-1"><ChevronRight className={`w-6 h-6 ${lang === 'en' ? 'rotate-180' : ''}`} /></button>
        <h2 className="text-xl font-bold">{t.addNewListing}</h2>
      </div>

      {isCameraActive ? (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <button onClick={stopCamera} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-10 flex items-center justify-center gap-8 bg-black/50 backdrop-blur-xl">
            {cameraMode === 'photo' ? (
              <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white active:scale-90 transition-transform" />
              </button>
            ) : (
              <button onClick={isRecording ? stopRecording : startRecording} className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center`}>
                {isRecording ? (
                   <div className="w-10 h-10 rounded-lg bg-red-600 animate-pulse" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-red-600 active:scale-90 transition-transform" />
                )}
              </button>
            )}
          </div>
        </div>
      ) : null}

      <div className="space-y-4 pb-20">
        <div>
          <label className="block text-sm font-bold mb-2">{t.listingPhoto}</label>
          {!previewImage && !previewVideo ? (
             <div className="grid grid-cols-2 gap-3 mb-4">
               <div onClick={() => startCamera('photo')} className="aspect-square border-2 border-dashed border-emerald-100 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/30 cursor-pointer overflow-hidden shadow-inner transition-all hover:bg-emerald-50">
                 <Camera className="w-8 h-8 text-emerald-600 mb-1" />
                 <span className="text-[10px] text-emerald-600 font-bold">{t.capturePhoto}</span>
               </div>
               <div onClick={() => startCamera('video')} className="aspect-square border-2 border-dashed border-red-100 rounded-2xl flex flex-col items-center justify-center bg-red-50/30 cursor-pointer overflow-hidden shadow-inner transition-all hover:bg-red-50">
                 <Video className="w-8 h-8 text-red-600 mb-1" />
                 <span className="text-[10px] text-red-600 font-bold">{t.captureVideo}</span>
               </div>
            </div>
          ) : (
            <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group animate-in zoom-in-95 duration-500">
              {previewImage ? (
                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <video src={previewVideo!} className="w-full h-full object-cover" controls />
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => { setPreviewImage(null); setPreviewVideo(null); }} className="p-2 bg-black/40 hover:bg-red-500 rounded-full text-white backdrop-blur-md transition-all shadow-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {previewImage && !isAiEditing && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl flex gap-2 items-center border border-white/50 animate-in slide-in-from-bottom duration-300">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Sparkles className="w-4 h-4" /></div>
                  <input 
                    type="text" 
                    placeholder={t.editPromptPlaceholder}
                    className="flex-1 bg-transparent border-none text-[11px] font-bold outline-none placeholder:text-gray-400"
                    value={aiEditPrompt}
                    onChange={e => setAiEditPrompt(e.target.value)}
                  />
                  <button 
                    onClick={handleAiEdit}
                    disabled={!aiEditPrompt}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-200 active:scale-90 transition-all disabled:opacity-30"
                  >
                    {t.aiEdit.split(' ')[1]}
                  </button>
                </div>
              )}
              {isAiEditing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-black tracking-widest uppercase">{t.processing}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setType('sale')} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${type === 'sale' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-gray-50 text-gray-400'}`}>{t.sale}</button>
          <button onClick={() => setType('rent')} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${type === 'rent' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-gray-50 text-gray-400'}`}>{t.rent}</button>
        </div>

        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">{lang === 'ar' ? 'سينشر هذا الإعلان في: ' : 'This ad will be posted in: '}{COUNTRIES.find(c => c.id === userCountry)?.[lang === 'ar' ? 'nameAr' : 'nameEn']}</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 mx-1">{t.whatSelling}</label>
          <input type="text" placeholder={t.whatSelling} className="border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner bg-gray-50/30" value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1"><label className="text-xs font-bold text-gray-500 mx-1">{t.category}</label><select className="w-full border rounded-xl p-3 text-sm mt-1 bg-white shadow-sm" value={category} onChange={e => setCategory(e.target.value as Category)}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{t.categories[c.id as keyof typeof t.categories]}</option>)}</select></div>
          <div className="w-1/3"><label className="text-xs font-bold text-gray-500 mx-1">{t.price}</label><input type="number" className="w-full border rounded-xl p-3 text-sm mt-1 bg-white shadow-sm" value={price} onChange={e => setPrice(e.target.value)} /></div>
        </div>

        {/* Accepted Payment Methods Section for Sellers */}
        <div>
          <label className="text-xs font-black text-gray-400 mx-1 block mb-3 uppercase tracking-widest">{t.paymentMethodsLabel}</label>
          <div className="flex gap-3">
            <button 
              onClick={() => togglePayment('visa')}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${acceptedPayments.includes('visa') ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-50' : 'border-gray-100 bg-white text-gray-400'}`}
            >
              <CreditCard className={`w-5 h-5 ${acceptedPayments.includes('visa') ? 'text-blue-600' : 'text-gray-300'}`} />
              <span className="text-xs font-bold">{t.visa}</span>
              {acceptedPayments.includes('visa') && <Check className="w-4 h-4 text-emerald-500" />}
            </button>
            <button 
              onClick={() => togglePayment('cash')}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${acceptedPayments.includes('cash') ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-50' : 'border-gray-100 bg-white text-gray-400'}`}
            >
              <Banknote className={`w-5 h-5 ${acceptedPayments.includes('cash') ? 'text-emerald-600' : 'text-gray-300'}`} />
              <span className="text-xs font-bold">{t.cash}</span>
              {acceptedPayments.includes('cash') && <Check className="w-4 h-4 text-emerald-500" />}
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1"><label className="text-xs font-bold text-gray-500 mx-1">{t.description}</label><button onClick={handleAIHelp} disabled={loadingAI} className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 active:scale-95 transition-all shadow-sm">{loadingAI ? <div className="h-3 w-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}{loadingAI ? t.thinking : t.aiHelp}</button></div>
          <textarea rows={4} placeholder={t.detailsPlaceholder} className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner bg-gray-50/30" value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button onClick={() => onAdd({ id: Math.random().toString(), title, description, price: Number(price), category, images: [previewImage || 'https://picsum.photos/800/600'], videoUrl: previewVideo || undefined, userId: 'u1', location: lang === 'ar' ? 'الموقع الحالي' : 'Current Location', country: userCountry, createdAt: lang === 'ar' ? 'الآن' : 'Now', type, sellerRating: 5.0, reviewCount: 0, acceptedPayments })} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-2xl shadow-emerald-100 mt-4 active:scale-95 transition-transform">{t.publish}</button>
      </div>
    </div>
  );
};

const ChatListScreen: React.FC<{ t: any; lang: 'ar' | 'en'; chats: Chat[]; onSelectChat: (c: Chat) => void }> = ({ t, lang, chats, onSelectChat }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t.chats}</h2>
      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400"><MessageCircle className="w-16 h-16 mb-2 opacity-20" /><p>{lang === 'ar' ? 'لا توجد رسائل حالياً' : 'No messages yet'}</p></div>
      ) : (
        <div className="space-y-3">{chats.map(chat => (<div key={chat.id} onClick={() => onSelectChat(chat)} className="bg-white p-3 rounded-2xl flex items-center gap-3 border shadow-sm cursor-pointer transition-all active:bg-gray-50"><img src="https://picsum.photos/seed/user2/50" className="w-12 h-12 rounded-full border-2 border-emerald-50 shadow-sm" alt="" /><div className="flex-1"><p className="font-bold text-sm">{t.trustedSeller}</p><p className="text-xs text-gray-400 line-clamp-1">{lang === 'ar' ? 'مرحباً، هل السعر قابل للتفاوض؟' : 'Hello, is the price negotiable?'}</p></div><ChevronRight className={`w-5 h-5 text-gray-300 ${lang === 'en' ? 'rotate-180' : ''}`} /></div>))}</div>
      )}
    </div>
  );
};

const ChatWindow: React.FC<{ t: any; lang: string; chat: Chat; onClose: () => void }> = ({ t, lang, chat, onClose }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ id: '1', senderId: 'seller', text: lang === 'ar' ? 'مرحباً، هل المنتج متاح؟' : 'Hello, is it available?', timestamp: '10:00 AM' }]);
  const send = () => { if (!msg) return; setMessages([...messages, { id: Date.now().toString(), senderId: 'u1', text: msg, timestamp: lang === 'ar' ? 'الآن' : 'Now' }]); setMsg(''); };
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-left duration-200">
      <div className="p-4 border-b flex items-center gap-3"><button onClick={onClose}><ChevronRight className={`w-6 h-6 ${lang === 'en' ? 'rotate-180' : ''}`} /></button><img src="https://picsum.photos/seed/seller/50" className="w-10 h-10 rounded-full border border-emerald-100 shadow-sm" alt="" /><div><p className="font-bold text-sm">{lang === 'ar' ? 'محمد السعدي' : 'Mohamed Al-Saadi'}</p><p className="text-[10px] text-emerald-500 font-bold">{lang === 'ar' ? 'متصل الآن' : 'Online'}</p></div></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-sm shadow-sm ${m.senderId === 'u1' ? 'bg-emerald-600 text-white rounded-tl-none' : 'bg-white border rounded-tr-none text-gray-700'}`}>
              {m.text}<p className={`text-[9px] mt-2 font-bold ${m.senderId === 'u1' ? 'text-emerald-200' : 'text-gray-400'}`}>{m.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white flex gap-2">
        <input type="text" placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'} className="flex-1 bg-gray-100 rounded-2xl px-5 py-3.5 text-sm outline-none shadow-inner" value={msg} onChange={e => setMsg(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} />
        <button onClick={send} className="bg-emerald-600 text-white p-4 rounded-2xl transition-all active:scale-90 shadow-lg shadow-emerald-100"><Send className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} /></button>
      </div>
    </div>
  );
};

const ProfileScreen: React.FC<{ t: any; lang: 'ar' | 'en'; user: UserType; onUpdateUser: (u: UserType) => void }> = ({ t, lang, user, onUpdateUser }) => {
  const togglePreferredPayment = (method: PaymentMethod) => {
    const current = user.preferredPaymentMethods || [];
    const updated = current.includes(method) 
      ? current.filter(m => m !== method) 
      : [...current, method];
    onUpdateUser({...user, preferredPaymentMethods: updated});
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="relative mb-3">
          <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-emerald-100 shadow-xl" alt="" />
          <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-400 text-sm font-bold">{user.phone}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-3xl border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-bold text-gray-400">{lang === 'ar' ? 'الاسم' : 'Name'}</span>
            <input type="text" value={user.name} onChange={e => onUpdateUser({...user, name: e.target.value})} className="text-left text-sm outline-none text-emerald-600 font-black" />
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <span className="text-sm font-bold text-gray-400">{lang === 'ar' ? 'رقم الجوال' : 'Phone'}</span>
            <input type="text" value={user.phone} onChange={e => onUpdateUser({...user, phone: e.target.value})} className="text-left text-sm outline-none text-emerald-600 font-black" />
          </div>
          
          <div className="py-2 border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-wider text-[10px]">{t.paymentMethodsLabel}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => togglePreferredPayment('visa')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${(user.preferredPaymentMethods || []).includes('visa') ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-50' : 'bg-white text-gray-400 border-gray-100'}`}
              >
                <CreditCard className="w-4 h-4" />
                {t.visa}
              </button>
              <button 
                onClick={() => togglePreferredPayment('cash')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${(user.preferredPaymentMethods || []).includes('cash') ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-50' : 'bg-white text-gray-400 border-gray-100'}`}
              >
                <Banknote className="w-4 h-4" />
                {t.cash}
              </button>
            </div>
          </div>

          <div className="py-2">
            <span className="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-wider text-[10px]">{t.country}</span>
            <div className="grid grid-cols-3 gap-2">
              {COUNTRIES.map(country => (
                <button 
                  key={country.id}
                  onClick={() => onUpdateUser({...user, country: country.id})}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${user.country === country.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-50 bg-white'}`}
                >
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <span className={`text-[10px] font-black tracking-tight ${user.country === country.id ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {lang === 'ar' ? country.nameAr : country.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-3xl border shadow-sm">
          <button className="w-full flex items-center justify-between p-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 rounded-2xl">
            <span>{lang === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</span>
            <ChevronRight className={`w-5 h-5 text-gray-300 ${lang === 'en' ? 'rotate-180' : ''}`} />
          </button>
          <button className="w-full flex items-center justify-between p-4 text-sm font-black text-red-500 transition-all hover:bg-red-50 rounded-2xl">
            <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            <ChevronRight className={`w-5 h-5 text-gray-300 ${lang === 'en' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className="mt-8 text-center pb-24">
        <p className="text-[10px] text-gray-400 font-bold">{t.appName} - v1.2.5</p>
        <p className="text-[10px] text-gray-300 px-10 leading-relaxed">{lang === 'ar' ? 'نحن نحفظ بياناتك محلياً لضمان الخصوصية والسرعة' : 'We save your data locally to ensure privacy and performance'}</p>
      </div>
    </div>
  );
};

export default App;
