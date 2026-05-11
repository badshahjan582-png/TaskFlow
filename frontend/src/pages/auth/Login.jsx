import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { CheckSquare } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] fade-up">

        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-9 h-9 rounded-[8px] bg-[#2383E2] flex items-center justify-center mb-4 shadow-md shadow-blue-500/25">
            <CheckSquare size={19} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[20px] font-semibold text-gray-900 dark:text-white tracking-[-0.3px]">
            Sign in to TaskFlow
          </h1>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            New here?{' '}
            <Link to="/register" className="text-[#2383E2] hover:underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#242424] rounded-xl border border-gray-200 dark:border-white/[0.09] shadow-sm p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-[13px] text-red-600 dark:text-red-400">
              <span className="shrink-0">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full mt-1" isLoading={loading} size="md">
              Continue with email
            </Button>
          </form>
        </div>

        <p className="text-center text-[11.5px] text-gray-400 dark:text-gray-600 mt-5">
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
