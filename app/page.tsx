"use client";

import { useState } from 'react';
import type { FormEvent, ChangeEvent, MouseEvent } from 'react';

// --- Define Types for our form data and status ---
interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  role: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';


// --- Helper Icon Components (no changes) ---
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const MapPinIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const UsersIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> );

export default function LeadCapturePage() {
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', city: '', role: '' });
  // The status state is no longer used to show a "loading" or "error" message to the user
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (e: MouseEvent<HTMLButtonElement>, role: 'Bride' | 'Groom') => {
      e.preventDefault();
      setFormData(prev => ({ ...prev, role }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.city || !formData.role) {
      // We still show a validation error instantly if fields are missing
      setMessage('Please fill out all required fields.');
      setStatus('error');
      return;
    }

    // --- **KEY CHANGE STARTS HERE** ---

    // 1. Immediately show the success message to the user.
    setStatus('success');
    setMessage("Your inquiry has been sent successfully!");

    // 2. We create a copy of the data to send, then reset the form.
    const dataToSend = { ...formData };
    setFormData({ name: '', phone: '', email: '', city: '', role: '' });

    // 3. The actual email sending happens in the background. The user doesn't wait for this.
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // If it fails, we log the error for the developer to see.
        // The user will NOT be notified, as they've already seen the success message.
        const result = await response.json();
        console.error("Email API Error:", result.message);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    // --- **KEY CHANGE ENDS HERE** ---
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
    <div className="bg-yellow-50 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-8">
            <div className="text-center mb-6">
               <img src="https://placehold.co/80x80/FEF9C3/854D0E?text=Logo" alt="Company Logo" className="mx-auto mb-4 rounded-full" />
              <h1 className="text-2xl font-bold text-gray-800">Get Your Wedding Quote</h1>
              <p className="text-gray-500 mt-2">Fill in your details to get started.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon />
                  <input type="text" name="name" placeholder="Full name *" value={formData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div className="relative">
                  <PhoneIcon />
                  <input type="tel" name="phone" placeholder="Phone number *" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>
                 <div className="relative">
                  <MailIcon />
                  <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div className="relative">
                  <MapPinIcon />
                  <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" required />
                </div>

                 <div>
                    <p className="text-sm text-gray-600 mb-2 ml-1">Are you the Bride or Groom? *</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={(e) => handleRoleSelect(e, 'Bride')} className={`w-full py-3 font-semibold rounded-lg border-2 transition-all duration-200 ${formData.role === 'Bride' ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-yellow-100 hover:border-yellow-200'}`}>
                            Bride
                        </button>
                        <button onClick={(e) => handleRoleSelect(e, 'Groom')} className={`w-full py-3 font-semibold rounded-lg border-2 transition-all duration-200 ${formData.role === 'Groom' ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-yellow-100 hover:border-yellow-200'}`}>
                            Groom
                        </button>
                    </div>
                 </div>
              </div>

              {/* Show validation errors, but not API errors */}
              {status === 'error' && message && (
                <p className="text-sm text-center mt-4 text-red-500">
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