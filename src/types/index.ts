export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  collection: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string;
  isBespokeAvailable: boolean;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  itemCount: number;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  duration: string;
  pricingNote: string;
  steps: string[];
}

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  service: string;
  outfitType: string;
  occasion?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  productName: string;
  productId?: string;
  customMeasurements?: string;
  notes?: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  estimatedCompletion?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  measurements?: Record<string, string>;
  ordersCount: number;
  appointmentsCount: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Bespoke' | 'Occasion' | 'Traditional' | 'Corporate' | 'Behind the Scenes';
  image: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  location: string;
  rating: number;
  quote: string;
  status: 'published' | 'draft';
  isDemo?: boolean;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  publishedAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  subTagline: string;
  location: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  instagramHandle: string;
  facebookHandle: string;
  tiktokHandle: string;
  openingHours: string;
  aboutPhilosophy: string;
  aboutPromise: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
