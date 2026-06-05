// Screens: LOKALITA detail + SEKTOR detail
import React, { useState, useEffect, useMemo } from 'react';
import { TopBar, BottomNav, Card, Pill, Chip, GradeBadge, NumDot, ProgressRing, SectionLabel, Icon, skPlural } from '../components/ui.jsx';
import { getSektory, getCesty } from '../lib/guidebook.js';
import { useLogbook } from '../hooks/useData.js';
import { PrelezSheet } from './Route.jsx';

export function LokalitaScreen({ nav, lokalita, region }) {
  const [sektory, setSektory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSektory(lokalita.id)
      .then(data => { setSektory(data); setLoading(false); })
      .catch(err => { console.error('Error loading sektory:', err); setLoading(false); });
  }, [lokalita.id]);

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => region?.kod ? nav('region', { region }) : nav('mapa')} />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero */}
        <div className="relative mx-4 mt-3 rounded-3xl overflow-hidden" style={{ height: 220 }}>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, #142319 0%, #0a1410 60%, #050a07 100%)',
          }}>
            <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="milky" cx="60%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#a8c595" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#a8c595" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="220" fill="url(#milky)" />
              {Array.from({ length: 70 }).map((_, i) => {
                const x = (i * 41 + 7) % 400, y = ((i * 23 + 3) % 130);
                const r = (i % 7 === 0) ? 1.4 : (i % 3 === 0) ? 0.9 : 0.5;
                return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.4 + (i % 5) * 0.12} />;
              })}
              <path d="M0 170 L30 130 L60 145 L100 110 L150 140 L180 100 L230 130 L280 95 L330 125 L380 105 L400 115 L400 220 L0 220 Z"
                fill="#020503" />
              <path d="M0 170 L30 130 L60 145 L100 110 L150 140 L180 100 L230 130 L280 95 L330 125 L380 105 L400 115"
                fill="none" stroke="rgba(168,197,149,0.18)" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#a7d4b3' }}>
              {region?.nazov || ''} · 760 m
            </div>
            <h1 className="display-condensed uppercase leading-[0.88]" style={{ fontSize: 38, color: '#fff' }}>
              {lokalita.nazov || lokalita.name}
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 mt-5">
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text)' }}>
            {lokalita.popis || lokalita.desc || 'Popis nie je dostupný.'}
          </p>
        </div>

        {/* Quick spec pills */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-2">
          {[
            { label: 'Skala', value: lokalita.typ_skaly || lokalita.rock || 'N/A', icon: 'mountain' },
            { label: 'Sezóna', value: lokalita.sezona || lokalita.best || 'N/A', icon: 'wind' },
          ].map(s => (
            <Card key={s.label} padding={false}>
              <div className="p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                  style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                  <Icon name={s.icon} size={17} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--text-faint)' }}>{s.label}</div>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{s.value}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Photos card */}
        <div className="px-4 mt-6">
          <SectionLabel>Fotky sektorov</SectionLabel>
          <Card className="mt-3" padding={false}>
            <div className="p-5 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full grid place-items-center"
                style={{ background: 'var(--bg-2)', border: '1.5px dashed var(--border-2)', color: 'var(--text-faint)' }}>
                <Icon name="camera" size={24} stroke={1.5} />
              </div>
              <div>
                <div className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>Fotky sektorov</div>
                <p className="text-[12.5px] mt-1 leading-snug" style={{ color: 'var(--text-dim)' }}>
                  Tu budú fotky jednotlivých sektorov, aby si vedel rýchlo spoznať stenu.
                </p>
              </div>
              <button className="h-9 px-5 rounded-full text-[13px] font-bold transition active:scale-[0.97]"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                Pridať fotku
              </button>
            </div>
          </Card>
        </div>

        {/* Sektory section */}
        <div className="mt-6">
          <div className="px-4">
            <SectionLabel right={<span>{sektory.length} {skPlural(sektory.length, 'sektor', 'sektory', 'sektorov')}</span>}>Sektory</SectionLabel>
          </div>
          <div className="mt-3 px-4 space-y-2">
            {loading && (
              <div className="text-[13px] py-4 text-center" style={{ color: 'var(--text-faint)' }}>Načítavam sektory…</div>
            )}
            {sektory.map(s => (
              <Card key={s.id} onClick={() => nav('sektor', { sektor: s, lokalita, region })}
                className="flex items-center gap-4" hover padding={false} style={{ padding: '15px 16px' }}>
                <NumDot n={s.poradie || 1} color="var(--accent)" size={50} />
                <div className="flex-1 min-w-0">
                  <div className="text-[17px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{s.nazov}</div>
                  <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    {s.ciest || 0} {skPlural(s.ciest || 0, 'cesta', 'cesty', 'ciest')}
                  </div>
                </div>
                <Icon name="chevronRight" size={19} style={{ color: 'var(--text-faint)' }} />
              </Card>
            ))}
            {!loading && sektory.length === 0 && (
              <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>Zatiaľ žiadne sektory.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />
    </div>
  );
}

export function SektorScreen({ nav, sektor, lokalita, region }) {
  const [filter, setFilter] = useState('vsetky');
  const [expanded, setExpanded] = useState(null);
  const [cesty, setCesty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(new Set());
  const [sendTypes, setSendTypes] = useState({});
  const [sheetRoute, setSheetRoute] = useState(null);
  const { logbook, addEntry } = useLogbook();

  useEffect(() => {
    getCesty(sektor.id)
      .then(data => { setCesty(data); setLoading(false); })
      .catch(err => { console.error('Error loading cesty:', err); setLoading(false); });
  }, [sektor.id]);

  const filtered = cesty.filter(r => {
    const n = parseFloat(r.obtaznost);
    if (filter === 'projekty') return false;
    if (filter === 'zaciatocnici') return n < 6;
    if (filter === 'pokrocili') return n >= 6 && n < 7;
    if (filter === 'profesionali') return n >= 7;
    return true;
  });

  const logbookRouteIds = useMemo(
    () => new Set(logbook.map(e => e.route_id).filter(Boolean)),
    [logbook]
  );

  const allSent = useMemo(() => {
    const combined = new Set(sent);
    for (const c of cesty) {
      if (logbookRouteIds.has(c.id)) combined.add(c.id);
    }
    return combined;
  }, [cesty, logbookRouteIds, sent]);

  const sentCount = allSent.size;
  const totalCount = cesty.length;
  const progressFraction = totalCount > 0 ? sentCount / totalCount : 0;

  const handlePrelez = async (type, note) => {
    if (!sheetRoute) return;
    const id = sheetRoute.id;
    setSent(prev => { const n = new Set(prev); n.add(id); return n; });
    setSendTypes(prev => ({ ...prev, [id]: type }));
    setSheetRoute(null);
    if (sheetRoute.id && addEntry) {
      try {
        await addEntry({ route_id: sheetRoute.id, style: type, note,
          route: sheetRoute.nazov, grade: sheetRoute.obtaznost });
      } catch (e) {
        console.error('Failed to save ascent:', e);
      }
    }
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('lokalita', { lokalita, region })} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            {lokalita?.nazov || lokalita?.name || ''}
          </div>
          <h1 className="text-[42px] font-extrabold leading-tight mt-1" style={{ color: 'var(--text)' }}>
            {sektor.nazov || sektor.name}
          </h1>
        </div>

        {/* Progress card */}
        <div className="px-4 mt-4">
          <Card className="flex items-center gap-4" padding={false} style={{ padding: '20px 20px' }}>
            <div className="flex-1">
              <div className="text-[36px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
                {cesty.length}
                <span className="text-[17px] font-bold ml-2" style={{ color: 'var(--text-dim)' }}>{skPlural(cesty.length, 'cesta', 'cesty', 'ciest')}</span>
              </div>
              <div className="text-[15px] font-semibold mt-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
                <Icon name="check" size={15} stroke={2.4} />
                {sentCount} {skPlural(sentCount, 'prelezená', 'prelezené', 'prelezených')}
              </div>
            </div>
            <ProgressRing value={progressFraction} size={82} stroke={7} />
          </Card>
        </div>

        {/* Filters */}
        <div className="mt-5 px-4 flex items-center gap-2 overflow-x-auto pb-1">
          <Chip active={filter === 'vsetky'} onClick={() => setFilter('vsetky')}>Všetky</Chip>
          <Chip active={filter === 'zaciatocnici'} onClick={() => setFilter('zaciatocnici')}>Začiatočníci</Chip>
          <Chip active={filter === 'pokrocili'} onClick={() => setFilter('pokrocili')}>Pokročilí</Chip>
          <Chip active={filter === 'profesionali'} onClick={() => setFilter('profesionali')}>Profesionáli</Chip>
        </div>

        {/* Route list */}
        <div className="px-4 mt-3 space-y-2">
          {loading && (
            <div className="text-[13px] py-4 text-center" style={{ color: 'var(--text-faint)' }}>Načítavam cesty…</div>
          )}
          {filtered.map(r => {
            const isExpanded = expanded === r.id;
            const isSent = allSent.has(r.id);
            return (
              <Card key={r.id} padding={false}>
                <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="w-full flex items-center gap-3.5 p-4 text-left">
                  <NumDot n={r.poradie || 1} color={isSent ? 'var(--accent)' : 'var(--text-faint)'} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>{r.nazov}</div>
                    {isExpanded && (
                      <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-dim)' }}>
                        Dĺžka {r.dlzka_m || '?'} m · {r.pocet_isteni || '?'} expresiek
                      </div>
                    )}
                  </div>
                  <GradeBadge grade={r.obtaznost} size="md" />
                  {isSent && !isExpanded && (
                    <div className="w-6 h-6 rounded-full grid place-items-center"
                      style={{ background: 'var(--green-soft)', color: 'var(--accent)' }}>
                      <Icon name="check" size={13} stroke={2.8} />
                    </div>
                  )}
                  {!isExpanded && !isSent && (
                    <Icon name="chevronRight" size={18} style={{ color: 'var(--text-faint)' }} />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 flex gap-2 items-center">
                    <button onClick={() => nav('route', { route: r, sektor, lokalita, region })}
                      className="flex-1 h-10 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      Detail cesty
                    </button>
                    <button onClick={() => {
                      if (isSent && !logbookRouteIds.has(r.id)) {
                        setSent(prev => { const n = new Set(prev); n.delete(r.id); return n; });
                      } else if (!isSent) {
                        setSheetRoute(r);
                      }
                    }}
                      className="w-10 h-10 rounded-full grid place-items-center"
                      style={{
                        background: isSent ? 'var(--green-soft)' : 'var(--bg-2)',
                        color: isSent ? 'var(--accent)' : 'var(--text-faint)',
                      }}>
                      <Icon name="check" size={16} stroke={2.6} />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>Žiadne cesty pre zvolený filter.</div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />

      {sheetRoute && (
        <PrelezSheet
          onClose={() => setSheetRoute(null)}
          onDone={handlePrelez}
        />
      )}
    </div>
  );
}
