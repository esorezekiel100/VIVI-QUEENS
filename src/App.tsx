import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AppointmentModal } from './components/AppointmentModal';
import { BespokeOrderModal } from './components/BespokeOrderModal';
import { LightboxModal } from './components/LightboxModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { NativeAttirePage } from './pages/NativeAttirePage';
import { BespokePage } from './pages/BespokePage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { JournalPage } from './pages/JournalPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Check } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentPath, toastMessage } = useApp();

  // Admin routing check
  const isAdminRoute = currentPath.startsWith('/admin');

  const renderCurrentView = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/native-attire':
        return <NativeAttirePage />;
      case '/collections':
        return <CollectionsPage />;
      case '/bespoke':
        return <BespokePage />;
      case '/services':
        return <ServicesPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/journal':
        return <JournalPage />;
      case '/contact':
        return <ContactPage />;
      case '/admin/login':
        return <AdminLoginPage />;
      case '/admin/dashboard':
      case '/admin':
        return <AdminDashboard />;
      default:
        // Default fallback to HomePage for unknown sub-paths
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1412] selection:bg-[#C5A880]/30 selection:text-[#1A1412]">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1A1412] text-[#FAF8F5] px-5 py-3.5 shadow-2xl border border-[#C5A880] flex items-center gap-3 animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Public Navbar (hidden on dedicated admin portal views) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Public Footer & Floating Widgets */}
      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppFloatingButton />
        </>
      )}

      {/* Global Interactive Modals */}
      <AppointmentModal />
      <BespokeOrderModal />
      <LightboxModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
