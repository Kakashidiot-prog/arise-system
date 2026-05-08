import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, setToken } from '../api/axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(username, password);
      setToken(data.access_token);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-[400px] glass-panel p-10 relative z-10">
        <div className="sys-font-mono text-[10px] tracking-[3px] text-muted mb-2 animate-sys-blink uppercase">
          [ system access ]
        </div>
        
        <h1 className="sys-font-title text-3xl font-bold mb-1 glow-text tracking-wider">
          HUNTER'S LOG
        </h1>
        <p className="sys-font-mono text-[11px] tracking-[2px] text-purple2 mb-8 uppercase">
          Sign In
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
              className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text sys-font-body transition-all"
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
              className="w-full p-3 bg-[#080810] border border-border rounded focus:border-purple focus:outline-none text-text sys-font-body transition-all"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple text-white sys-font-mono text-[12px] tracking-[3px] font-bold rounded hover:bg-purple2 transition-all disabled:opacity-50 uppercase mt-4 shadow-[0_0_20px_rgba(122,95,255,0.3)]"
          >
            {loading ? 'Entering...' : 'Enter System'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="sys-font-mono text-[10px] tracking-[1px] text-muted uppercase">
            No account?{' '}
            <Link to="/register" className="text-purple2 hover:text-purple3 transition-colors ml-1">
              Register Here
            </Link>
          </p>
        </div>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple/20 m-8 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple/20 m-8 pointer-events-none"></div>
    </div>
  );
}