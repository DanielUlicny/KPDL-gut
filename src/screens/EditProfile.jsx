// "Upraviť profil" — edit profile screen (functional, persists via Supabase)
import React, { useState } from 'react';
import { SectionLabel, Chip, ImgSlot, Icon } from '../components/ui.jsx';
import { useProfile } from '../hooks/useData.js';

function FieldLabel({ children, optional }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <span className="text-[11.5px] font-bold uppercase tracking-[0.1em]"
        style={{ color: 'var(--text-dim)' }}>
        {children}
      </span>
      {optional &&
        <span className="text-[9.5px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-md"
          style={{ background: 'var(--bg-2)', color: 'var(--text-faint)' }}>
          voliteľné
        </span>
      }
    </div>
  );
}

function Field({ value, onChange, placeholder, prefix, unit, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="w-full h-[52px] px-4 rounded-2xl flex items-center text-[15px]"
      style={{
        background: 'var(--card)',
        border: focused ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
        boxShadow: focused ? '0 0 0 3px var(--green-soft)' : 'none',
      }}>
      {prefix && <span className="mr-0.5" style={{ color: 'var(--text-faint)', fontWeight: 600 }}>{prefix}</span>}
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        className="flex-1 min-w-0 bg-transparent outline-none"
        style={{ color: 'var(--text)', fontWeight: 600 }} />
      {unit && <span className="ml-2 text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>{unit}</span>}
    </div>
  );
}

const ALL_STYLES = ['Sport', 'Trad', 'Boulder', 'Via ferrata'];

export function EditProfileScreen({ nav }) {
  const { profile, update } = useProfile();
  const back = () => nav && nav('profil');

  const getInitialForm = () => {
    const p = profile || {};
    const [first = '', ...rest] = (p.name || '').split(' ');
    return {
      first,
      last: rest.join(' '),
      handle: (p.handle || '').replace(/^@/, ''),
      bio: p.bio || '',
      age: p.age ?? '',
      apeIndex: p.apeIndex ?? '',
      since: p.since ?? 2015,
      styles: p.styles?.length ? p.styles : ['Sport', 'Boulder'],
    };
  };

  const [form, setForm] = useState(getInitialForm());

  React.useEffect(() => {
    if (profile) setForm(getInitialForm());
  }, [profile]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleStyle = (s) =>
    setForm(f => ({ ...f, styles: f.styles.includes(s) ? f.styles.filter(x => x !== s) : [...f.styles, s] }));

  const save = async () => {
    const name = [form.first, form.last].filter(Boolean).join(' ').trim();
    try {
      await update({
        name,
        handle: '@' + form.handle,
        bio: form.bio,
        age: form.age === '' ? null : form.age,
        ape_index: form.apeIndex === '' ? null : form.apeIndex,
        climbing_since: form.since,
        styles: form.styles,
      });
    } catch (e) {
      console.error('Profile save failed:', e);
    }
    back();
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <div className="relative z-10 shrink-0" style={{ background: 'var(--bg)' }}>
        <div className="relative flex items-center px-4 pb-3" style={{ paddingTop: 58 }}>
          <button onClick={back} className="text-[15px] font-semibold active:opacity-60 transition" style={{ color: 'var(--text-dim)' }}>
            Zrušiť
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-extrabold"
            style={{ color: 'var(--text)' }}>
            Upraviť profil
          </h1>
          <button onClick={save} className="ml-auto h-9 px-4 rounded-full text-[13.5px] font-bold flex items-center gap-1.5 active:scale-[0.97] transition"
            style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px color-mix(in oklab, var(--accent) 35%, transparent)' }}>
            <Icon name="check" size={15} stroke={2.6} />
            Uložiť
          </button>
        </div>
        <div className="h-px mx-4" style={{ background: 'var(--border)' }} />
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        {/* Photo header */}
        <div className="flex flex-col items-center pt-6 pb-1">
          <div className="relative">
            <div className="w-[104px] h-[104px] rounded-full overflow-hidden"
              style={{ border: '2px solid var(--border)' }}>
              <ImgSlot light label="foto" className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full grid place-items-center"
              style={{ background: 'var(--accent)', color: '#fff', border: '3px solid var(--bg)' }}>
              <Icon name="camera" size={16} stroke={2} />
            </div>
          </div>
          <button className="mt-3 text-[13.5px] font-bold" style={{ color: 'var(--accent)' }}>
            Zmeniť fotku
          </button>
        </div>

        {/* OSOBNÉ */}
        <div className="px-5 mt-5">
          <SectionLabel>Osobné</SectionLabel>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Meno</FieldLabel>
              <Field value={form.first} onChange={(v) => set('first', v)} placeholder="Meno" />
            </div>
            <div>
              <FieldLabel>Priezvisko</FieldLabel>
              <Field value={form.last} onChange={(v) => set('last', v)} placeholder="Priezvisko" />
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Používateľské meno</FieldLabel>
            <Field prefix="@" value={form.handle} onChange={(v) => set('handle', v)} placeholder="meno" />
          </div>

          <div className="mt-4">
            <FieldLabel>Bio</FieldLabel>
            <div className="rounded-2xl px-4 py-3.5"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
              <textarea
                value={form.bio}
                maxLength={100}
                onChange={(e) => set('bio', e.target.value)}
                rows={3}
                className="w-full bg-transparent outline-none resize-none text-[14.5px] leading-relaxed"
                style={{ color: 'var(--text)' }} />
            </div>
            <div className="flex justify-end mt-1.5 px-1">
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: 'var(--text-faint)' }}>
                {form.bio.length} / 100
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel optional>Vek</FieldLabel>
              <Field type="number" value={form.age} onChange={(v) => set('age', v)} placeholder="napr. 28" unit="rokov" />
            </div>
            <div>
              <FieldLabel optional>Rozpätie rúk</FieldLabel>
              <Field type="number" value={form.apeIndex} onChange={(v) => set('apeIndex', v)} placeholder="napr. 185" unit="cm" />
            </div>
          </div>
        </div>

        {/* LEZENIE */}
        <div className="px-5 mt-7">
          <SectionLabel>Lezenie</SectionLabel>

          <div className="mt-3">
            <FieldLabel>Leziem od roku</FieldLabel>
            <Field type="number" value={form.since} onChange={(v) => set('since', v)} placeholder="napr. 2015" />
          </div>

          <div className="mt-4">
            <FieldLabel>Lezecký štýl</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ALL_STYLES.map((s) => {
                const active = form.styles.includes(s);
                return (
                  <Chip key={s} active={active} icon={active ? 'check' : null} onClick={() => toggleStyle(s)}>
                    {s}
                  </Chip>
                );
              })}
            </div>
            <p className="text-[12px] mt-2.5 px-1" style={{ color: 'var(--text-faint)' }}>
              Vyber všetky štýly, ktorým sa venuješ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
