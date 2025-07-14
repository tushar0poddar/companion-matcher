import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Welcome, ${data.username}!`);
        localStorage.setItem('username', data.username);
        localStorage.setItem('auth_user_id', data.id); // Save ID to fetch profile

        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setMessage(`❌ ${data.error || 'Login failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white mt-12 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition w-full"
        >
          Login
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default Login;
