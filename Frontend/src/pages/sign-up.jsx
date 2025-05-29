import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }
      // Save JWT token (if returned)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to login or dashboard
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-lg bg-white p-10 shadow-2xl rounded-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 placeholder-blue-300 shadow-sm"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 placeholder-blue-300 shadow-sm"
              type="email"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 placeholder-blue-300 shadow-sm"
              type="password"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
