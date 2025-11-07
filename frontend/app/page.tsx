/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', userId: '' });
  const [status, setStatus] = useState('');

  // Hardcoded event details
  const eventDetails = {
    eventName: 'Tech Innovators Summit 2025',
    location: 'Techno India University, Kolkata',
    date: '2025-12-10',
    time: '10:00 AM',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const res = await axios.post('http://localhost:4000/api/register', {
        ...form,
        ...eventDetails, // merge hardcoded event details
      });
      setStatus(res.data.message || 'Registered successfully!');
      setForm({ name: '', email: '', userId: '' });
    } catch (error: any) {
      setStatus(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          🎟️ Event Registration
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={form.userId}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Register
        </button>

        {status && (
          <p className="text-center text-sm text-gray-700 mt-3">{status}</p>
        )}
      </form>
    </div>
  );
}
