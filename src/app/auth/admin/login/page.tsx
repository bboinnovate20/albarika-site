'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import PrimaryBtn from '@/components/custom-ui/primary-btn';
import FormInput from '@/components/custom-ui/input';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
    
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(response.ok, data.success)
      if (response.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data?.details?.errors[0]?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.log("error info", err);
      setError('An error occurred. Please try again.');
    } finally {
      toast.success("Successfully Logged in, redirecting");
      router.push('/admin');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <Lock className='text-center w-full h-11 text-primary mb-5'/>
          <h2 className="text-3xl font-bold text-gray-900">Albarika Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                id="username"
                label="Username"
                type="username"
                value={username}
                placeholder="admin@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <FormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}

            <PrimaryBtn
            className='w-full'
            isLoading={loading}
            > Sign In </PrimaryBtn>

          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500">
          Protected by security protocols.
        </p>
      </div>
    </div>
  );
}