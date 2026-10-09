import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        showToast('Message sent! We will reply soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Question',
          message: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. You can also chat with us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      
      {/* Header */}
      <section className="py-20 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            Contact VIVI Queens
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            Call, message, or visit us in Biogbolo, Yenagoa.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Details */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                OUR STUDIO
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1412] mt-1 uppercase">
                {settings.brandName || 'VIVI QUEENS'}
              </h2>
              <p className="text-xs text-[#1A1412]/70 mt-1">
                {settings.location || 'Biogbolo, Yenagoa, Bayelsa State, Nigeria'}
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#1A1412]/80 pt-2 border-t border-[#1A1412]/10">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1412]">Phone</p>
                  <a href={`tel:${settings.phone}`} className="hover:underline">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1412]">WhatsApp</p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-emerald-800 font-medium"
                  >
                    Chat with Us
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1412]">Email</p>
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1412]">Working Hours</p>
                  <p className="text-[#1A1412]/70">Monday to Saturday, 9:00 AM to 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 border border-[#1A1412]/10 shadow-xs">
            <h3 className="text-xl font-serif text-[#1A1412] mb-4 uppercase">
              Send Us A Message
            </h3>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#C5A880] mx-auto" />
                <h4 className="font-serif text-xl text-[#1A1412]">Thank You!</h4>
                <p className="text-xs sm:text-sm text-[#1A1412]/70 leading-relaxed">
                  We got your message. We will reply soon.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 px-5 py-2 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-2.5 bg-red-50 text-red-700 border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Grace Tari"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1A1412]/70 mb-1 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1412]/70 mb-1 font-medium">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. name@email.com"
                      className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Wedding dress inquiry"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1412]/70 mb-1 font-medium">Your Message *</label>
                  <textarea
                    name="message"
                    rows={3}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What would you like us to sew?"
                    className="w-full px-3 py-2 bg-white border border-[#1A1412]/15 focus:border-[#C5A880] focus:outline-hidden text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1A1412] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2D2420] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
