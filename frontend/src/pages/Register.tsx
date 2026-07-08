import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, setToken } from '../api/axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          AWAKEN
        </h1>
        <p className="sys-font-mono text-[11px] tracking-[2px] text-gold2 mb-8 uppercase">
          Initialize Player
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#080810] border border-border rounded focus:border-gold focus:outline-none text-text sys-font-body transition-all pr-10"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-bg font-bold sys-font-mono text-[12px] tracking-[3px] rounded hover:bg-gold2 transition-all disabled:opacity-50 uppercase mt-4 shadow-[0_0_20px_rgba(245,200,66,0.3)]"
          >
            {loading ? 'Awakening...' : 'Become a Player'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="sys-font-mono text-[10px] tracking-[1px] text-muted uppercase">
            Already awakened?{' '}
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