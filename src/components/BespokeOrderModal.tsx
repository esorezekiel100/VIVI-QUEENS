import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, MessageSquare } from 'lucide-react';

export const BespokeOrderModal: React.FC = () => {
  const { selectedProductForOrder, closeBespokeOrderModal, settings, showToast } = useApp();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customMeasurements: 'Measure at Biogbolo studio',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!selectedProductForOrder) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productName: selectedProductForOrder.name,
          productId: selectedProductForOrder.id,
          amount: selectedProductForOrder.price,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        showToast('Request received! We will call or WhatsApp you soon.');
      } else {
        setErrorMessage(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      setErrorMessage('Network error. You can also chat with us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello VIVI Queens, I want to order this outfit: "${selectedProductForOrder.name}". My name is ${formData.customerName || 'a customer'}.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] text-[#1A1412] p-6 sm:p-8 shadow-2xl border border-[#C5A880]/30 my-8">
        
        <button
          onClick={closeBespokeOrderModal}
          className="absolute top-4 right-4 text-[#1A1412]/60 hover:text-[#1A1412] p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium">
              Order Request Received
            </h3>
            <p className="text-xs text-[#1A1412]/75 leading-relaxed max-w-sm mx-auto">
              We got your request for <strong>{selectedProductForOrder.name}</strong>. We will contact you about your size and delivery date.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleWhatsAppDirect}
                className="px-5 py-2 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat On WhatsApp</span>
              </button>
              <button
                onClick={closeBespokeOrderModal}
                className="px-5 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3.5 pb-4 mb-4 border-b border-[#1A1412]/10">
              <img
                src={selectedProductForOrder.images[0]}
                alt={selectedProductForOrder.name}
                referrerPolicy="no-referrer"
                className="w-16 h-20 object-cover border border-[#1A1412]/10 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                  ORDER THIS DESIGN
                </span>
                <h3 className="font-serif text-lg font-medium text-[#1A1412] leading-snug">
                  {selectedProductForOrder.name}
                </h3>
                <p className="text-xs text-[#1A1412]/60">
                  {selectedProductForOrder.fabric}
                </p>
                <p className="font-mono text-sm font-semibold text-[#1A1412] pt-0.5">
                  ₦{selectedProductForOrder.price.toLocaleString()}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#1A1412]/70 mb-1 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Tariere Amgbare"
                  className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="e.g. 0814 000 0000"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="e.g. name@email.com"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1412]/70 mb-1 font-medium">
                  Size & Measurement
                </label>
                <select
                  name="customMeasurements"
                  value={formData.customMeasurements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                >
                  <option value="Measure at Biogbolo studio">
                    Measure me at the studio
                  </option>
                  <option value="Standard UK 8">Standard UK 8 / Small</option>
                  <option value="Standard UK 10">Standard UK 10 / Medium</option>
                  <option value="Standard UK 12">Standard UK 12 / Large</option>
                  <option value="Standard UK 14">Standard UK 14 / XL</option>
                  <option value="Standard UK 16">Standard UK 16 / XXL</option>
                  <option value="Will send measurements on WhatsApp">I will send my size on WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A1412]/70 mb-1 font-medium">
                  Preferred Color or Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Green, needed before December 15"
                  className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Submit Order'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full py-2 bg-white border border-[#1A1412]/20 text-[#1A1412] text-xs font-medium uppercase tracking-wider hover:border-[#1A1412] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
