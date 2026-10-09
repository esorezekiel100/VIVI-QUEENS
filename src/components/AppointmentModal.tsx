import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';

export const AppointmentModal: React.FC = () => {
  const { isAppointmentModalOpen, closeAppointmentModal, prefilledService, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '10:00 AM – 12:00 PM',
    service: prefilledService || 'Bespoke Tailoring',
    outfitType: 'Gown / Dress',
    occasion: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAppointmentModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        showToast('Appointment request received! We will contact you shortly.');
      } else {
        setErrorMessage(data.error || 'Please fill in required fields.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. You can also contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    closeAppointmentModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] text-[#1A1412] p-6 sm:p-8 shadow-2xl border border-[#C5A880]/30 my-8">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#1A1412]/60 hover:text-[#1A1412] p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-medium">
              Appointment Received
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1412]/80 max-w-sm mx-auto leading-relaxed">
              We got your request. We will contact you to confirm the date.
            </p>
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420]"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                STUDIO VISIT
              </span>
              <h2 className="text-2xl font-serif text-[#1A1412] mt-0.5">
                Book An Appointment
              </h2>
              <p className="text-xs text-[#1A1412]/65 mt-0.5">
                Choose a date to visit our studio for a fitting or style advice.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Tariere Ebikake"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0814 892 0145"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. name@email.com"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  >
                    <option value="Bespoke Tailoring">Custom Tailoring</option>
                    <option value="Occasion Wear">Wedding & Party Wear</option>
                    <option value="Traditional & Contemporary">Nigerian Native Attire</option>
                    <option value="Corporate Wear">Office & Work Wear</option>
                    <option value="Alterations">Alterations & Adjustments</option>
                    <option value="Personal Styling">Style Advice</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  >
                    <option value="10:00 AM – 12:00 PM">Morning (10:00 AM to 12:00 PM)</option>
                    <option value="12:00 PM – 02:00 PM">Midday (12:00 PM to 2:00 PM)</option>
                    <option value="02:00 PM – 04:00 PM">Afternoon (2:00 PM to 4:00 PM)</option>
                    <option value="04:00 PM – 06:00 PM">Late afternoon (4:00 PM to 6:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1A1412]/70 mb-1 font-medium">
                  What outfit do you want to sew?
                </label>
                <input
                  type="text"
                  name="outfitType"
                  value={formData.outfitType}
                  onChange={handleChange}
                  placeholder="e.g. George wrapper or wedding dress"
                  className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-[#1A1412]/70 mb-1 font-medium">
                  Any note or question? (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add your event date or tell us if you have fabric"
                  className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Book Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
