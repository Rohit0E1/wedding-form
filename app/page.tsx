"use client";

import { useState } from 'react';
import type { FormEvent, ChangeEvent, MouseEvent } from 'react';

// --- Define Types for our form data and status ---
interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  marriageDate: string;
  role: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
// Updated role type to include 'Both'
type UserRole = 'Bride' | 'Groom' | 'Both';


// --- Helper Icon Components (Added CalendarIcon) ---
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const MapPinIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const CalendarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> );

export default function LeadCapturePage() {
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', city: '', marriageDate: '', role: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (e: MouseEvent<HTMLButtonElement>, role: UserRole) => {
      e.preventDefault();
      setFormData(prev => ({ ...prev, role }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.city || !formData.marriageDate || !formData.role) {
      setMessage('Please fill out all required fields.');
      setStatus('error');
      return;
    }
    setStatus('success');
    setMessage("Your inquiry has been sent successfully!");
    const dataToSend = { ...formData };
    setFormData({ name: '', phone: '', email: '', city: '', marriageDate: '', role: '' });
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const result = await response.json();
        console.error("Email API Error:", result.message);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-yellow-50 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523438885262-e6252c869607?q=80&w=2574&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 md:px-8">
            <div className="text-center mb-6">
               <img src="https://placehold.co/80x80/FEF9C3/854D0E?text=Logo" alt="Company Logo" className="mx-auto mb-4 rounded-full border-4 border-white shadow-md" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Get Your Wedding Quote</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Fill in your details to get started.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon />
                  <input type="text" name="name" placeholder="Full name *" value={formData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-900/70 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div className="relative">
                  <PhoneIcon />
                  <input type="tel" name="phone" placeholder="Phone number *" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-900/70 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>
                 <div className="relative">
                  <MailIcon />
                  <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-900/70 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div className="relative">
                  <MapPinIcon />
                  <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-900/70 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>

                {/* --- NEW MARRIAGE DATE FIELD --- */}
                <div className="relative">
                  <CalendarIcon />
                  <input
                    type="text"
                    name="marriageDate"
                    placeholder="Wedding Date *"
                    value={formData.marriageDate}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {if(!e.target.value) {e.target.type = 'text'}}}
                    className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-900/70 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                 <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold mb-2 ml-1">Who is this for? *</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={(e) => handleRoleSelect(e, 'Bride')}
                            className={`w-full py-3 font-semibold rounded-lg border-2 transition-all duration-200 text-sm ${formData.role === 'Bride' ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:border-yellow-200 dark:hover:border-yellow-700'}`}
                        >
                            Bride
                        </button>
                        <button
                            onClick={(e) => handleRoleSelect(e, 'Groom')}
                            className={`w-full py-3 font-semibold rounded-lg border-2 transition-all duration-200 text-sm ${formData.role === 'Groom' ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:border-yellow-200 dark:hover:border-yellow-700'}`}
                        >
                            Groom
                        </button>
                        <button
                            onClick={(e) => handleRoleSelect(e, 'Both')}
                            className={`w-full py-3 font-semibold rounded-lg border-2 transition-all duration-200 text-sm ${formData.role === 'Both' ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:border-yellow-200 dark:hover:border-yellow-700'}`}
                        >
                            Both
                        </button>
                    </div>
                 </div>
              </div>

              {status === 'error' && message && (
                <p className="text-sm text-center mt-4 text-red-500 font-semibold">
                  {message}
                </p>
              )}

              <button type="submit" className="w-full bg-yellow-500 text-yellow-900 font-bold py-3 px-4 rounded-lg mt-6 hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

