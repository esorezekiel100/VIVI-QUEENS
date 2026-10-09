import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Shirt,
  Calendar,
  ShoppingBag,
  Users,
  Image,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  ExternalLink,
  BookOpen,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  Clock,
  Scissors
} from 'lucide-react';
import {
  Product,
  Appointment,
  Order,
  Customer,
  GalleryItem,
  Testimonial,
  ContactMessage,
  SiteSettings,
  Service
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const { adminUser, setAdminUser, navigate, showToast, settings: publicSettings, updateSettingsState } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'appointments' | 'orders' | 'customers' | 'gallery' | 'testimonials' | 'messages' | 'services' | 'settings'>('overview');

  // Dashboard Data
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editableSettings, setEditableSettings] = useState<SiteSettings>(publicSettings);

  const [loading, setLoading] = useState(true);

  // Product Form State (Add/Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Occasion Wear',
    collection: 'The Bespoke Edit',
    price: 150000,
    fabric: '',
    description: '',
    images: ['/src/assets/images/hero_nigerian_fashion_1791459700947.jpg'],
    colors: ['Emerald Green', 'Gold'],
    sizes: ['Custom Bespoke', 'UK 10', 'UK 12', 'UK 14'],
    status: 'published' as 'published' | 'draft',
  });

  // Gallery Form State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Bespoke' as 'All' | 'Bespoke' | 'Occasion' | 'Traditional' | 'Corporate' | 'Behind the Scenes',
    image: '/src/assets/images/bespoke_gown_showcase_1791459725159.jpg',
    caption: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('vivi_admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadAllData = () => {
    setLoading(true);
    const headers = getAuthHeaders();

    Promise.all([
      fetch('/api/analytics', { headers }).then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/appointments', { headers }).then(r => r.json()),
      fetch('/api/orders', { headers }).then(r => r.json()),
      fetch('/api/customers', { headers }).then(r => r.json()),
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/testimonials').then(r => r.json()),
      fetch('/api/messages', { headers }).then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ])
      .then(([anData, prodData, aptData, ordData, custData, galData, testData, msgData, srvData, settData]) => {
        if (anData.success) setAnalytics(anData.analytics);
        if (prodData.success) setProducts(prodData.products);
        if (aptData.success) setAppointments(aptData.appointments);
        if (ordData.success) setOrders(ordData.orders);
        if (custData.success) setCustomers(custData.customers);
        if (galData.success) setGallery(galData.gallery);
        if (testData.success) setTestimonials(testData.testimonials);
        if (msgData.success) setMessages(msgData.messages);
        if (srvData.success) setServices(srvData.services);
        if (settData.success) {
          setEditableSettings(settData.settings);
          updateSettingsState(settData.settings);
        }
      })
      .catch(err => console.error('Error fetching admin data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('vivi_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('vivi_admin_token');
    setAdminUser(null);
    showToast('Logged out of admin portal');
    navigate('/admin/login');
  };

  // Appointment status updates
  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Appointment status updated to ${status}`);
        loadAllData();
      }
    } catch (e) {
      showToast('Failed to update appointment');
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Appointment removed');
        loadAllData();
      }
    } catch (e) {
      showToast('Error deleting appointment');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (id: string, fulfillmentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ fulfillmentStatus })
      });
      if (res.ok) {
        showToast(`Order updated to: ${fulfillmentStatus}`);
        loadAllData();
      }
    } catch (e) {
      showToast('Error updating order');
    }
  };

  // Message read & delete
  const handleMarkMessageRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      loadAllData();
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      showToast('Message deleted');
      loadAllData();
    } catch (e) {
      showToast('Error deleting message');
    }
  };

  // Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        showToast(editingProduct ? 'Product updated' : 'Product created');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadAllData();
      }
    } catch (e) {
      showToast('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product from catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Product removed');
        loadAllData();
      }
    } catch (e) {
      showToast('Error removing product');
    }
  };

  // Gallery Save & Delete
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(galleryForm)
      });
      if (res.ok) {
        showToast('Image added to gallery');
        setIsGalleryModalOpen(false);
        loadAllData();
      }
    } catch (e) {
      showToast('Error adding gallery image');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Remove image from gallery?')) return;
    try {
      await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      showToast('Gallery image removed');
      loadAllData();
    } catch (e) {
      showToast('Error removing image');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editableSettings)
      });
      if (res.ok) {
        showToast('Atelier business settings saved!');
        updateSettingsState(editableSettings);
      }
    } catch (e) {
      showToast('Error updating settings');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1412] text-[#FAF8F5] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#211A18] border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-2xl tracking-[0.15em] uppercase text-white font-medium">
              VIVI QUEENS
            </h1>
            <p className="text-[11px] text-[#C5A880] tracking-wider uppercase font-sans mt-0.5">
              Atelier Management
            </p>
          </div>

          <nav className="space-y-1 text-xs uppercase tracking-wider font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'overview' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'products' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'appointments' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'orders' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'customers' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'gallery' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'messages' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'services' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Services ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 transition-colors cursor-pointer text-left ${
                activeTab === 'settings' ? 'bg-[#C5A880] text-[#1A1412] font-semibold' : 'text-[#FAF8F5]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="text-[11px] text-[#FAF8F5]/60 font-sans">
            Logged in as <strong className="text-white">{adminUser?.name || 'Administrator'}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#C5A880] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen bg-[#1E1715]">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Executive Overview
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl uppercase text-white mt-1">
                Atelier Performance & Activity
              </h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#FAF8F5]/60 block">Total Revenue</span>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  ₦{(analytics?.totalRevenue || 0).toLocaleString()}
                </p>
                <span className="text-[11px] text-[#C5A880]">Bespoke Commissions</span>
              </div>

              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#FAF8F5]/60 block">Appointments</span>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {analytics?.totalAppointments || appointments.length}
                </p>
                <span className="text-[11px] text-amber-300">
                  {analytics?.pendingAppointments || appointments.filter(a => a.status === 'pending').length} Pending Confirmation
                </span>
              </div>

              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#FAF8F5]/60 block">Bespoke Orders</span>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {analytics?.totalOrders || orders.length}
                </p>
                <span className="text-[11px] text-emerald-400">Active Commissions</span>
              </div>

              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#FAF8F5]/60 block">Client Base</span>
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  {analytics?.totalCustomers || customers.length}
                </p>
                <span className="text-[11px] text-[#C5A880]">Profiles in Bayelsa</span>
              </div>
            </div>

            {/* Recent Appointments & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Upcoming Appointments */}
              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-serif text-lg uppercase text-white">Recent Appointments</h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs text-[#C5A880] uppercase tracking-wider hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {appointments.slice(0, 4).map((apt) => (
                    <div key={apt.id} className="p-3 bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{apt.fullName}</p>
                        <p className="text-[#FAF8F5]/60 mt-0.5">{apt.service} · {apt.preferredDate} ({apt.preferredTime})</p>
                      </div>
                      <span className={`px-2 py-0.5 uppercase tracking-widest text-[10px] font-mono ${
                        apt.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300' :
                        apt.status === 'pending' ? 'bg-amber-950 text-amber-300' : 'bg-white/10 text-white/70'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="bg-[#261E1C] p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-serif text-lg uppercase text-white">Recent Client Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs text-[#C5A880] uppercase tracking-wider hover:underline"
                  >
                    Inbox →
                  </button>
                </div>

                <div className="space-y-3">
                  {messages.slice(0, 4).map((msg) => (
                    <div key={msg.id} className="p-3 bg-white/5 border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{msg.name}</p>
                        <span className="text-[10px] text-[#C5A880]">{msg.phone}</span>
                      </div>
                      <p className="text-[#FAF8F5]/70 line-clamp-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Catalog Inventory
                </span>
                <h2 className="font-serif text-3xl uppercase text-white mt-1">
                  Product Management
                </h2>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'Occasion Wear',
                    collection: 'The Bespoke Edit',
                    price: 150000,
                    fabric: 'Silk-Crepe & French Lace',
                    description: '',
                    images: ['/src/assets/images/hero_nigerian_fashion_1791459700947.jpg'],
                    colors: ['Emerald Green', 'Muted Gold'],
                    sizes: ['Custom Bespoke', 'UK 10', 'UK 12', 'UK 14'],
                    status: 'published',
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#D4AF37] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Design</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-[#241E1C] border border-white/10 flex flex-col justify-between">
                  <div>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-48 object-cover border-b border-white/10"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#C5A880]">
                        <span className="uppercase">{p.category}</span>
                        <span className="font-mono text-white">₦{p.price.toLocaleString()}</span>
                      </div>
                      <h3 className="font-serif text-lg text-white font-medium">{p.name}</h3>
                      <p className="text-xs text-[#FAF8F5]/60 line-clamp-2">{p.description}</p>
                      <p className="text-[11px] text-[#FAF8F5]/70 pt-1">
                        <strong>Fabric:</strong> {p.fabric}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProductForm({
                          name: p.name,
                          category: p.category,
                          collection: p.collection,
                          price: p.price,
                          fabric: p.fabric,
                          description: p.description,
                          images: p.images,
                          colors: p.colors || [],
                          sizes: p.sizes || [],
                          status: p.status,
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Client Schedule
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Fittings & Consultations
              </h2>
            </div>

            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-[#241E1C] p-6 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl text-white">{apt.fullName}</h3>
                      <span className={`px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest ${
                        apt.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        apt.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        apt.status === 'completed' ? 'bg-blue-950 text-blue-300' : 'bg-white/10 text-white/60'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#C5A880] font-sans">
                      {apt.service} • {apt.outfitType || 'Bespoke commission'}
                    </p>
                    <p className="text-xs text-[#FAF8F5]/80">
                      <strong>Scheduled:</strong> {apt.preferredDate} ({apt.preferredTime})
                    </p>
                    <p className="text-xs text-[#FAF8F5]/60">
                      <strong>Contact:</strong> {apt.phone} {apt.email && `· ${apt.email}`}
                    </p>
                    {apt.notes && (
                      <p className="text-xs text-[#FAF8F5]/70 italic pt-1 bg-white/5 p-2 rounded-xs">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${apt.fullName}, this is VIVI Queens Atelier regarding your appointment on ${apt.preferredDate}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/50 text-emerald-300 text-xs flex items-center gap-1 hover:bg-[#25D366]/30"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    <select
                      value={apt.status}
                      onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                      className="px-3 py-1.5 bg-[#1A1412] border border-white/20 text-xs text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm Appointment</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="p-1.5 text-red-400 hover:text-red-300"
                      aria-label="Delete appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & COMMISSIONS */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Bespoke Commissions
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Order Inquiries & Production
              </h2>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-[#241E1C] p-6 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl text-white">{ord.productName}</h3>
                      <span className="font-mono text-xs text-[#C5A880]">₦{ord.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#FAF8F5]/80">
                      <strong>Client:</strong> {ord.customerName} ({ord.customerPhone})
                    </p>
                    <p className="text-xs text-[#FAF8F5]/70">
                      <strong>Measurements:</strong> {ord.customMeasurements}
                    </p>
                    {ord.notes && (
                      <p className="text-xs text-[#FAF8F5]/60 italic bg-white/5 p-2">
                        Notes: {ord.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ord.customerName}, regarding your bespoke order for ${ord.productName} at VIVI Queens...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/40 text-emerald-300 text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Client</span>
                    </a>

                    <select
                      value={ord.fulfillmentStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 bg-[#1A1412] border border-white/20 text-xs text-white"
                    >
                      <option value="inquiry_received">Inquiry Received</option>
                      <option value="measurement_booked">Measurement Booked</option>
                      <option value="in_crafting">In Crafting</option>
                      <option value="fitting_stage">Fitting Stage</option>
                      <option value="completed_delivered">Completed & Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER DATABASE */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Client Directory
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Customer Profiles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers.map((c) => (
                <div key={c.id} className="bg-[#241E1C] p-6 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-white">{c.name}</h3>
                    <span className="text-xs text-[#C5A880] font-mono">{c.phone}</span>
                  </div>
                  <p className="text-xs text-[#FAF8F5]/60">{c.email || 'No email provided'}</p>
                  <p className="text-xs text-[#FAF8F5]/70">
                    <strong>Address:</strong> {c.address || 'Bayelsa State, Nigeria'}
                  </p>

                  <div className="pt-2 border-t border-white/10 text-xs text-[#FAF8F5]/80 grid grid-cols-2 gap-2">
                    <div>Appointments: <strong>{c.appointmentsCount}</strong></div>
                    <div>Orders: <strong>{c.ordersCount}</strong></div>
                  </div>

                  {c.measurements && Object.keys(c.measurements).length > 0 && (
                    <div className="pt-2 border-t border-white/10 text-xs">
                      <p className="font-semibold text-[#C5A880] mb-1">Recorded Measurements:</p>
                      <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-[#FAF8F5]/70">
                        {Object.entries(c.measurements).map(([k, v]) => (
                          <div key={k}>{k}: {v}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  Visual Media
                </span>
                <h2 className="font-serif text-3xl uppercase text-white mt-1">
                  Gallery & Lookbook Management
                </h2>
              </div>
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-4 py-2 bg-[#C5A880] text-[#1A1412] text-xs uppercase font-semibold tracking-wider flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((g) => (
                <div key={g.id} className="bg-[#241E1C] border border-white/10 overflow-hidden group">
                  <img
                    src={g.image}
                    alt={g.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block">{g.category}</span>
                    <p className="font-serif text-sm text-white font-medium truncate">{g.title}</p>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="mt-2 text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Communications
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Contact Form Inquiries
              </h2>
            </div>

            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 border ${m.isRead ? 'bg-[#241E1C] border-white/10' : 'bg-[#2D2420] border-[#C5A880]/50'} space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-white font-medium">{m.name}</h3>
                      <p className="text-xs text-[#C5A880] font-sans">
                        {m.email} {m.phone && `• ${m.phone}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!m.isRead && (
                        <button
                          onClick={() => handleMarkMessageRead(m.id)}
                          className="px-2.5 py-1 bg-white/10 text-xs text-white hover:bg-white/20"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-white/50">{m.subject}</p>
                  <p className="text-xs sm:text-sm text-[#FAF8F5]/85 bg-black/20 p-3 rounded-xs font-sans leading-relaxed">
                    {m.message}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs">
                    {m.phone && (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${m.name}, regarding your inquiry to VIVI Queens Atelier...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                      className="text-[#C5A880] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply by Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Offerings
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Atelier Tailoring Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s) => (
                <div key={s.id} className="bg-[#241E1C] p-6 border border-white/10 space-y-3">
                  <h3 className="font-serif text-xl text-white">{s.title}</h3>
                  <p className="text-xs text-[#FAF8F5]/70">{s.shortDescription}</p>
                  <div className="text-xs text-[#C5A880] font-mono pt-1">
                    Investment: {s.pricingNote}
                  </div>
                  <div className="text-xs text-white/60">
                    Duration: {s.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS & CONTENT */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Brand Configuration
              </span>
              <h2 className="font-serif text-3xl uppercase text-white mt-1">
                Atelier Settings & Details
              </h2>
              <p className="text-xs text-[#FAF8F5]/60 mt-1">
                Update phone numbers, WhatsApp concierge, Biogbolo address, and philosophy statements.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-[#241E1C] p-8 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={editableSettings.brandName}
                    onChange={(e) => setEditableSettings({ ...editableSettings, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editableSettings.tagline}
                    onChange={(e) => setEditableSettings({ ...editableSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                  Physical Studio Location (Yenagoa, Bayelsa)
                </label>
                <input
                  type="text"
                  value={editableSettings.location}
                  onChange={(e) => setEditableSettings({ ...editableSettings, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editableSettings.phone}
                    onChange={(e) => setEditableSettings({ ...editableSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    WhatsApp Number (Digits only, e.g. 2348148920145)
                  </label>
                  <input
                    type="text"
                    value={editableSettings.whatsappNumber}
                    onChange={(e) => setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                  Pre-filled WhatsApp Inbound Message
                </label>
                <input
                  type="text"
                  value={editableSettings.whatsappMessage}
                  onChange={(e) => setEditableSettings({ ...editableSettings, whatsappMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={editableSettings.instagramHandle}
                    onChange={(e) => setEditableSettings({ ...editableSettings, instagramHandle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    Facebook Handle
                  </label>
                  <input
                    type="text"
                    value={editableSettings.facebookHandle}
                    onChange={(e) => setEditableSettings({ ...editableSettings, facebookHandle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    value={editableSettings.tiktokHandle}
                    onChange={(e) => setEditableSettings({ ...editableSettings, tiktokHandle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1">
                  Atelier Philosophy Statement
                </label>
                <textarea
                  rows={3}
                  value={editableSettings.aboutPhilosophy}
                  onChange={(e) => setEditableSettings({ ...editableSettings, aboutPhilosophy: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37]"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
          <div className="bg-[#241E1C] border border-white/20 p-8 w-full max-w-xl text-white my-8">
            <h3 className="font-serif text-2xl uppercase mb-6">
              {editingProduct ? 'Edit Catalog Design' : 'Add New Couture Design'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Design Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  >
                    <option value="Occasion Wear">Occasion Wear</option>
                    <option value="Traditional & Contemporary">Traditional & Contemporary</option>
                    <option value="Corporate Wear">Corporate Wear</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Ready-to-Wear">Ready-to-Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-white/70 mb-1">Guide Price (NGN)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Fabric & Textiles</label>
                <input
                  type="text"
                  required
                  value={productForm.fabric}
                  onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                  placeholder="e.g. Pure Silk-Crepe & French Lace"
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  value={productForm.images[0]}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C5A880] text-[#1A1412] text-xs uppercase font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#241E1C] border border-white/20 p-8 w-full max-w-md text-white">
            <h3 className="font-serif text-xl uppercase mb-4">Add Image to Gallery</h3>
            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Royal Brocade Gown at Yenagoa Reception"
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                >
                  <option value="Bespoke">Bespoke</option>
                  <option value="Occasion">Occasion</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  required
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Caption</label>
                <input
                  type="text"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1A1412] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C5A880] text-[#1A1412] text-xs uppercase font-semibold"
                >
                  Upload Look
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
