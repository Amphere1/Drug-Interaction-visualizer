import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
      const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to dashboard or home
      navigate('/hero');
    } catch (err) {

      console.log(err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-lg bg-white p-10 shadow-2xl rounded-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-700">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;