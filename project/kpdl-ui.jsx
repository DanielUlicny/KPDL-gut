// Playful shared UI — light theme, rounded, soft
const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Inline Lucide-style icons (stroke-2, 24px, currentColor)
// ─────────────────────────────────────────────────────────────
const ICON_PATHS = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  search: 'M11 4a7 7 0 1 0 4.9 12L20 20',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M5 12l5 5L20 7',
  checkCircle: 'M22 11.5V12a10 10 0 1 1-5.9-9.1M22 4 12 14.01l-3-3',
  heart: 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z',
  home: 'M3 11.5 12 4l9 7.5M5 10v10h14V10',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
  clipboard: 'M9 4h6v3H9zM7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM9.5 20a2.5 2.5 0 0 0 5 0',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  mountain: 'M3 20 9.5 8l3.5 6 2-3.5L21 20zM8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  triangle: 'M12 4L3 20h18z',
  camera: 'M3 9a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  ruler: 'M3 12 12 3l9 9-9 9zM7 12l2 2M11 8l2 2M15 4l2 2M11 16l2 2',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  flame: 'M12 22a6 6 0 0 0 6-6c0-4-3-4-3-9-2 1-5 3-5 7-2-1-3-2-3-4-2 2-3 4-3 6a8 8 0 0 0 8 6z',
  star: 'M12 3l2.6 5.6 6 .9-4.3 4.4 1 6.2L12 17.3l-5.3 2.8 1-6.2L3.3 9.5l6-.9z',
  bookmark: 'M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  plus: 'M12 5v14M5 12h14',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM16 8l-2 6-6 2 2-6z',
  cube: 'M21 8 12 3 3 8m18 0v8l-9 5-9-5V8m18 0-9 5M3 8l9 5',
  navigation: 'M3 11 22 2l-9 19-2-8z',
  layers: 'M12 2 2 7l10 5 10-5zM2 12l10 5 10-5M2 17l10 5 10-5',
  thermometer: 'M14 14V4a2 2 0 1 0-4 0v10a4 4 0 1 0 4 0z',
  wind: 'M3 8h12a3 3 0 1 0-3-3M3 16h17a3 3 0 1 1-3 3M3 12h9',
  share: 'M16 6l-4-4-4 4M12 2v14M5 12v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8',
  sparkle: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
};

function Icon({ name, size = 22, stroke = 2, className = '', style = {}, fill = 'none' }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>
      {d.split('M').filter(Boolean).map((p, i) => <path key={i} d={'M' + p} />)}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Top bar — pill search
// ─────────────────────────────────────────────────────────────
function TopBar({ canBack = false, onBack, searchPlaceholder = 'Hľadaj skaly...' }) {
  return (
    <div className="relative z-10" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center gap-2 px-4 pb-3" style={{ paddingTop: 58 }}>
        {canBack && (
          <button onClick={onBack}
            className="w-10 h-10 grid place-items-center rounded-full shrink-0 hover:bg-black/5 transition"
            style={{ color: 'var(--text)' }}>
            <Icon name="arrowLeft" size={20} stroke={2.2} />
          </button>
        )}
        <div className="flex-1 flex items-center gap-2 h-11 pl-4 pr-2 rounded-full"
          style={{ background: 'var(--bg-2)' }}>
          <Icon name="search" size={17} stroke={2.2} style={{ color: 'var(--text-faint)' }} />
          <span className="text-[14px] flex-1 truncate" style={{ color: 'var(--text-faint)' }}>{searchPlaceholder}</span>
          <button className="w-8 h-8 grid place-items-center rounded-full shrink-0 hover:bg-black/5 transition"
            style={{ color: 'var(--text)' }}>
            <Icon name="filter" size={18} stroke={2} />
          </button>
        </div>
      </div>
      <div className="h-px mx-4" style={{ background: 'var(--border)' }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom nav — clean, label below icon
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  const tabs = [
    { id: 'home', label: 'Domov', icon: 'home' },
    { id: 'mapa', label: 'Mapa', icon: 'map' },
    { id: 'projekty', label: 'Projekty', icon: 'clipboard' },
    { id: 'profil', label: 'Profil', icon: 'user' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30"
      style={{ background: 'var(--bg)', paddingBottom: 30 }}>
      <div className="h-px mx-4" style={{ background: 'var(--border)' }} />
      <div className="flex items-stretch justify-around px-2 pt-2">
        {tabs.map(t => {
          const a = active === t.id;
          return (
            <button key={t.id} onClick={() => onNav(t.id)}
              className="flex flex-col items-center justify-end gap-1 flex-1 py-1.5"
              style={{ color: a ? 'var(--accent)' : 'var(--text-faint)' }}>
              <Icon name={t.icon} size={22} stroke={a ? 2.2 : 1.8} fill={a ? 'currentColor' : 'none'}
                style={a ? { fillOpacity: 0.12 } : {}} />
              <span className="text-[11px]" style={{ fontWeight: a ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card — white rounded with subtle border
// ─────────────────────────────────────────────────────────────
function Card({ children, className = '', style = {}, onClick, padding = true, hover = false }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick}
      className={`rounded-2xl text-left transition-all ${onClick ? 'w-full' : ''} ${padding ? 'p-4' : ''} ${hover ? 'hover:shadow-md hover:-translate-y-0.5' : ''} ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)', ...style }}>
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────
// Pill — rounded soft tag
// ─────────────────────────────────────────────────────────────
function Pill({ children, tone = 'soft', size = 'md', icon = null }) {
  const tones = {
    soft:   { bg: 'var(--green-soft)', fg: 'var(--accent-deep)' },
    softer: { bg: 'var(--bg-2)',       fg: 'var(--text-dim)' },
    amber:  { bg: 'var(--amber-soft)', fg: 'var(--amber-deep)' },
    red:    { bg: 'var(--red-soft)',   fg: 'var(--red-deep)' },
    solid:  { bg: 'var(--accent)',     fg: '#fff' },
  };
  const c = tones[tone];
  const sizes = { sm: 'h-6 px-2 text-[11px]', md: 'h-7 px-3 text-[12px]', lg: 'h-9 px-3.5 text-[13px]' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${sizes[size]}`}
      style={{ background: c.bg, color: c.fg }}>
      {icon && <Icon name={icon} size={12} stroke={2.4} />}
      {children}
    </span>
  );
}

// Filter chip (clickable pill)
function Chip({ children, active = false, onClick, icon = null }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0"
      style={active
        ? { background: 'var(--accent)', color: '#fff' }
        : { background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
      {icon && <Icon name={icon} size={13} stroke={2.4} />}
      {children}
    </button>
  );
}

// Grade pill — colored by difficulty
function GradeBadge({ grade, size = 'md' }) {
  const n = parseFloat(grade);
  let bg, fg;
  if (n <= 5.5) { bg = 'var(--green-soft)'; fg = 'var(--accent-deep)'; }
  else if (n <= 6.5) { bg = 'var(--green-soft)'; fg = 'var(--accent-deep)'; }
  else if (n <= 7.5) { bg = 'var(--amber-soft)'; fg = 'var(--amber-deep)'; }
  else { bg = 'var(--red-soft)'; fg = 'var(--red-deep)'; }
  const sizes = {
    sm: 'h-6 min-w-[34px] px-2 text-[11px]',
    md: 'h-7 min-w-[40px] px-2.5 text-[12px]',
    lg: 'h-10 min-w-[54px] px-3 text-[16px]',
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold ${sizes[size]}`}
      style={{ background: bg, color: fg }}>
      {grade}
    </span>
  );
}

// Numbered solid circle
function NumDot({ n, color = 'var(--accent)', size = 36 }) {
  return (
    <span className="rounded-full grid place-items-center font-bold shrink-0"
      style={{ width: size, height: size, background: color, color: '#fff', fontSize: size * 0.42 }}>
      {n}
    </span>
  );
}

// 2-letter region avatar
function RegionAvatar({ code, color, size = 40 }) {
  return (
    <div className="rounded-full grid place-items-center shrink-0 font-bold"
      style={{ width: size, height: size, background: color, color: '#fff', fontSize: size * 0.32 }}>
      {code}
    </div>
  );
}

// Progress ring
function ProgressRing({ value, size = 64, stroke = 6, label = null, color = 'var(--accent)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - value);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--bg-2)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={dash} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-bold text-[12px]"
        style={{ color: 'var(--text)' }}>
        {label ?? `${Math.round(value * 100)}%`}
      </div>
    </div>
  );
}

// Image slot
function ImgSlot({ label = 'photo', children, className = '', style = {}, light = false }) {
  return (
    <div className={`relative overflow-hidden ${className}`}
      style={{
        background: light
          ? 'repeating-linear-gradient(135deg, #e8e6df 0 10px, #ddd9cd 10px 11px)'
          : 'repeating-linear-gradient(135deg, #2a3a32 0 10px, #1f2c25 10px 11px)',
        ...style,
      }}>
      {children}
      <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
        style={{ color: light ? '#6a6a5e' : '#9aa39c', background: light ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }}>
        {label}
      </div>
    </div>
  );
}

// Section header
function SectionLabel({ children, right = null, className = '' }) {
  return (
    <div className={`flex items-end justify-between ${className}`}>
      <h3 className="text-[11px] uppercase tracking-[0.14em] font-bold"
        style={{ color: 'var(--accent-deep)' }}>
        {children}
      </h3>
      {right && <div className="text-[12px]" style={{ color: 'var(--text-faint)' }}>{right}</div>}
    </div>
  );
}

Object.assign(window, {
  Icon, TopBar, BottomNav, Card, Pill, Chip, GradeBadge, NumDot, RegionAvatar,
  ProgressRing, ImgSlot, SectionLabel,
});
