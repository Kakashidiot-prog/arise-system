import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, setToken } from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(username, password);
      setToken(data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(', '));
      } else if (typeof backendMessage === 'string') {
        setError(backendMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden animate-fade-in">
      <div className="w-full max-w-[400px] glass-panel p-10 relative z-10 border-gold/30">
        <div className="sys-font-mono text-[10px] tracking-[3px] text-muted mb-2 animate-sys-blink uppercase">
          [ system initialization ]
        </div>
        
        <h1 className="sys-font-title text-3xl font-bold mb-1 text-gold glow-text tracking-wider" style={{ textShadow: '0 0 40px rgba(245, 200, 66, 0.4)' }}>
          JOIN THE HUNT
        </h1>
        <p className="sys-font-mono text-[11px] tracking-[2px] text-gold2 mb-8 uppercase">
          Create Account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-[11px] sys-font-mono uppercase tracking-wider">
              {error}
            </div>
          )}

          <div>
            <label className="sys-font-mono text-[10px] tracking-[2px] text-muted uppercase mb-2 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#080810] border border-border rounded focus:border-gold focus:outline-none text-text sys-font-body transition-all"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="sys-font-mono text-[10px] tracking-[2px] text-muted uppercase mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#080810] border border-border rounded focus:border-gold focus:outline-none text-text sys-font-body transition-all"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-bg font-bold sys-font-mono text-[12px] tracking-[3px] rounded hover:bg-gold2 transition-all disabled:opacity-50 uppercase mt-4 shadow-[0_0_20px_rgba(245,200,66,0.3)]"
          >
            {loading ? 'Creating...' : 'Become a Hunter'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="sys-font-mono text-[10px] tracking-[1px] text-muted uppercase">
            Already a hunter?{' '}
            <Link to="/login" className="text-gold2 hover:text-gold transition-colors ml-1">
              Login Here
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold/20 m-8 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold/20 m-8 pointer-events-none"></div>
    </div>
  );
}