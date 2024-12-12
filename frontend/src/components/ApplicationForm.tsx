import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

export function ApplicationForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    background: '',
    linkedinUrl: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      experience: '',
      background: '',
      linkedinUrl: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log('Form submitted. Current formData:', formData);

    try {
      // Step 1: Send data to the backend
      console.log('Attempting to POST to backend at http://localhost:5000/api/users');
      const backendResponse = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Received backendResponse object:', backendResponse);

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        console.log('Backend response data:', backendData);
        toast.success('Data saved to the backend successfully!');
      } else {
        // If not ok, try to parse error message
        try {
          const backendError = await backendResponse.json();
          console.error('Backend error response:', backendError);
          toast.error(backendError.message || 'Failed to save data to the backend.');
        } catch (parseError) {
          console.error('Failed to parse backend error response.', parseError);
          toast.error('Failed to save data to the backend.');
        }
      }

      // Step 2: Send data to EmailJS
      console.log('Attempting to send email via EmailJS...');
      const emailResponse = await emailjs.send(
        'service_w9pl4b8', // Replace with your EmailJS service ID
        'template_c20s99h', // Replace with your EmailJS template ID
        {
          to_name: 'DevOps Pro Team',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.background,
          phone: formData.phone,
          location: formData.location,
          experience: formData.experience,
          linkedin_url: formData.linkedinUrl,
        },
        'ex7mfQLof436hR0Xa' // Replace with your EmailJS public key
      );

      console.log('EmailJS response:', emailResponse);

      if (emailResponse.status === 200) {
        console.log('Email sent successfully!');
        toast.success('Email sent successfully!');
        resetForm();
      } else {
        console.error('EmailJS error:', emailResponse);
        toast.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      console.log('Form submission process finished.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (123) 456-7890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="City, Country"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Profile URL
        </label>
        <input
          type="url"
          value={formData.linkedinUrl}
          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://linkedin.com/in/your-profile"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          DevOps Experience Level *
        </label>
        <select
          required
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner (0-1 years)</option>
          <option value="intermediate">Intermediate (1-3 years)</option>
          <option value="advanced">Advanced (3+ years)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tell us about yourself *
        </label>
        <textarea
          required
          value={formData.background}
          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Tell us about your programming experience, relevant projects, and what interests you in DevOps..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
