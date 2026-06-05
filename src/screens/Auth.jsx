// Auth screen — Supabase email/password login + signup
import React, { useState } from 'react';
import { Icon } from '../components/ui.jsx';
import { useAuth } from '../contexts/auth.jsx';
import climberImg from '../assets/climber.png';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(email, password, name);
    } catch (e) {
      setErr(e.message || 'Niečo sa pokazilo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="relative" style={{ height: 300 }}>
        <img src={climberImg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, var(--bg) 100%)' }} />
        <div className="absolute bottom-6 left-5 right-5">
          <h1 className="display-condensed uppercase leading-[0.86]"
            style={{ fontSize: 48, color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
            Kam pojdeš<br/>dnes liezť?
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10">
        <div className="text-[20px] font-extrabold" style={{ color: 'var(--text)' }}>
          {mode === 'login' ? 'Prihlásenie' : 'Registrácia'}
        </div>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-dim)' }}>
          {mode === 'login' ? 'Vitaj späť, lezče!' : 'Vytvor si účet a začni logovať prelezy.'}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === 'signup' && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Meno"
              className="w-full h-[52px] px-4 rounded-2xl text-[15px] outline-none"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autoComplete="email"
            className="w-full h-[52px] px-4 rounded-2xl text-[15px] outline-none"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Heslo" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full h-[52px] px-4 rounded-2xl text-[15px] outline-none"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />

          {err && (
            <div className="text-[12.5px] font-semibold px-1" style={{ color: 'var(--red-deep)' }}>{err}</div>
          )}

          <button type="submit" disabled={busy}
            className="w-full h-[52px] rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {busy ? '...' : (mode === 'login' ? 'Prihlásiť sa' : 'Zaregistrovať sa')}
            {!busy && <Icon name="arrowRight" size={16} stroke={2.4} />}
          </button>
        </form>

        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); }}
          className="w-full mt-4 text-[13.5px] font-semibold" style={{ color: 'var(--accent)' }}>
          {mode === 'login' ? 'Nemáš účet? Zaregistruj sa' : 'Už máš účet? Prihlás sa'}
        </button>
      </div>
    </div>
  );
}
