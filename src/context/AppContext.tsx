import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, Product, GalleryItem, AdminUser } from '../types';

interface AppContextType {
  settings: SiteSettings;
  updateSettingsState: (newSettings: SiteSettings) => void;
  isAppointmentModalOpen: boolean;
  prefilledService: string;
  openAppointmentModal: (service?: string) => void;
  closeAppointmentModal: () => void;
  selectedProductForOrder: Product | null;
  openBespokeOrderModal: (product: Product) => void;
  closeBespokeOrderModal: () => void;
  lightboxItem: GalleryItem | null;
  openLightbox: (item: GalleryItem) => void;
  closeLightbox: () => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  currentPath: string;
  navigate: (path: string) => void;
}

const defaultSettings: SiteSettings = {
  brandName: 'VIVI QUEENS',
  tagline: 'Made to fit you.',
  subTagline: 'Custom clothes, sewn with care.',
  location: 'Biogbolo, Yenagoa, Bayelsa State, Nigeria',
  phone: '+234 814 892 0145',
  whatsappNumber: '2348148920145',
  whatsappMessage: 'Hello VIVI Queens, I would like to ask about an outfit.',
  email: 'atelier@viviqueens.com',
  instagramHandle: '@viviqueens',
  facebookHandle: '@viviqueenscouture',
  tiktokHandle: '@viviqueens',
  openingHours: 'Monday to Saturday, 9:00 AM to 6:00 PM',
  aboutPhilosophy: 'We make clothes that fit well and suit your style.',
  aboutPromise: 'We make quality clothes with care and skill.'
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState('Bespoke Tailoring');
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Sync route changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Load public settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));

    // Check if admin is currently authenticated
    const token = localStorage.getItem('vivi_admin_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.admin) {
            setAdminUser(data.admin);
          } else {
            localStorage.removeItem('vivi_admin_token');
          }
        })
        .catch(() => localStorage.removeItem('vivi_admin_token'));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const openAppointmentModal = (service = 'Bespoke Tailoring') => {
    setPrefilledService(service);
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
  };

  const openBespokeOrderModal = (product: Product) => {
    setSelectedProductForOrder(product);
  };

  const closeBespokeOrderModal = () => {
    setSelectedProductForOrder(null);
  };

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  const updateSettingsState = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettingsState,
        isAppointmentModalOpen,
        prefilledService,
        openAppointmentModal,
        closeAppointmentModal,
        selectedProductForOrder,
        openBespokeOrderModal,
        closeBespokeOrderModal,
        lightboxItem,
        openLightbox,
        closeLightbox,
        adminUser,
        setAdminUser,
        toastMessage,
        showToast,
        currentPath,
        navigate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
