// Screens: MAPA + REGION DETAIL
import React, { useState, useEffect } from 'react';
import { TopBar, BottomNav, Card, Pill, Chip, RegionAvatar, SectionLabel, Icon, skPlural } from '../components/ui.jsx';
import { getKraje, getLokality } from '../lib/guidebook.js';

const REGION_COLORS = ['#2a6f4a', '#1d5236', '#c89234', '#9bc7a5', '#f1ad77', '#5d9270', '#1d5236', '#2a6f4a'];

export function MapaScreen({ nav }) {
  const [kraje, setKraje] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKraje()
      .then(data => { setKraje(data); setLoading(false); })
      .catch(err => { console.error('Error loading kraje:', err); setLoading(false); });
  }, []);

  const totalStats = kraje.reduce((a, r) => ({
    lokalit: a.lokalit + (r.lokalit || 0),
    sektorov: a.sektorov + (r.sektorov || 0),
    ciest: a.ciest + (r.ciest || 0),
  }), { lokalit: 0, sektorov: 0, ciest: 0 });

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('home')} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[32px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            Nájdi si skalu
          </h1>
          <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-dim)' }}>
            Objav lezecké lokality a vyber si kraj, ktorý ťa láka.
          </p>
        </div>

        {/* Highlight banner — Slovensko prehľad */}
        <div className="px-4 mt-5">
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)' }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Slovensko</div>
            <h2 className="display-condensed uppercase text-white leading-[0.92] mt-1.5" style={{ fontSize: 30 }}>
              {totalStats.lokalit} lokalít<br/>naprieč {kraje.length} krajmi
            </h2>
            <div className="flex items-stretch gap-5 mt-4">
              {[[totalStats.ciest.toString(), 'ciest'], [totalStats.sektorov.toString(), 'sektorov']].map(([v, l], i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[20px] font-extrabold text-white leading-none">{v}</span>
                  <span className="text-[11px] text-white/70 mt-1">{l}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12px] font-bold"
              style={{ background: '#fff', color: 'var(--accent-deep)' }}>
              <Icon name="navigation" size={13} stroke={2.4} /> Nájsť v okolí
            </button>
          </div>
        </div>

        <div className="px-5 mt-5 mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>Kraje</span>
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-faint)' }}>
            {loading ? 'Načítavam…' : `${kraje.length} krajov`}
          </span>
        </div>

        {/* Region list */}
        <div className="px-4 space-y-2.5">
          {kraje.map((r, idx) => (
            <Card key={r.kod || idx} onClick={() => nav('region', { region: r })}
              className="flex items-center gap-3" hover>
              <RegionAvatar code={r.kod} color={REGION_COLORS[idx % REGION_COLORS.length]} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{r.nazov} kraj</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {r.lokalit || 0} {skPlural(r.lokalit || 0, 'lokalita', 'lokality', 'lokalít')} · {r.ciest || 0} {skPlural(r.ciest || 0, 'cesta', 'cesty', 'ciest')}
                </div>
              </div>
              <Icon name="chevronRight" size={18} style={{ color: 'var(--text-faint)' }} />
            </Card>
          ))}
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />
    </div>
  );
}

export function RegionScreen({ nav, region }) {
  const [lokality, setLokality] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('vsetky');

  useEffect(() => {
    getLokality(region.kod)
      .then(data => { setLokality(data); setLoading(false); })
      .catch(err => { console.error('Error loading lokality:', err); setLoading(false); });
  }, [region.kod]);

  const filtered = lokality.filter(l => {
    if (filter === 'vsetky') return true;
    if (filter === 'ar') return l.ar === true;
    if (filter === 'zaciatocnici') return l.gradesMin !== null ? l.gradesMin < 6 : true;
    if (filter === 'pokrocili') return l.gradesMax !== null ? l.gradesMax >= 6 && (l.gradesMin || 0) < 7 : true;
    if (filter === 'profesionali') return l.gradesMax !== null ? l.gradesMax >= 7 : false;
    return true;
  });

  const totalCiest = lokality.reduce((s, l) => s + (l.ciest || 0), 0);
  const totalSektorov = lokality.reduce((s, l) => s + (l.sektorov || 0), 0);

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('mapa')} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[34px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            <span>{region.nazov}</span>{' '}
            <span style={{ color: 'var(--text-faint)', fontSize: '0.7em', fontWeight: 700 }}>kraj</span>
          </h1>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Pill size="md">{lokality.length} {skPlural(lokality.length, 'lokalita', 'lokality', 'lokalít')}</Pill>
            <Pill size="md">{totalSektorov} {skPlural(totalSektorov, 'sektor', 'sektory', 'sektorov')}</Pill>
            <Pill size="md">{totalCiest} {skPlural(totalCiest, 'cesta', 'cesty', 'ciest')}</Pill>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 px-4 w-max">
            <Chip active={filter === 'vsetky'} onClick={() => setFilter('vsetky')}>Všetky</Chip>
            <Chip active={filter === 'ar'} icon="cube" onClick={() => setFilter('ar')}>AR dostupné</Chip>
            <Chip active={filter === 'zaciatocnici'} onClick={() => setFilter('zaciatocnici')}>Začiatočníci</Chip>
            <Chip active={filter === 'pokrocili'} onClick={() => setFilter('pokrocili')}>Pokročilí</Chip>
            <Chip active={filter === 'profesionali'} onClick={() => setFilter('profesionali')}>Profesionáli</Chip>
          </div>
        </div>

        {/* Locality cards */}
        <div className="px-4 mt-4 space-y-3">
          {loading && (
            <div className="text-[13px] py-4 text-center" style={{ color: 'var(--text-faint)' }}>Načítavam lokality…</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>
                {lokality.length === 0 ? 'V tomto kraji zatiaľ nie sú žiadne lokality.' : 'Žiadne lokality nezodpovedajú filtru.'}
              </div>
            </div>
          )}
          {filtered.map(l => (
            <Card key={l.id} onClick={() => nav('lokalita', { lokalita: l, region })} padding={false} hover>
              <div className="flex">
                <div className="w-[110px] h-[110px] shrink-0 relative overflow-hidden rounded-l-2xl"
                  style={{ background: 'linear-gradient(135deg, #1a2e1f 0%, #0a1410 100%)' }}>
                  <svg viewBox="0 0 110 110" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const x = (i * 17) % 110, y = (i * 11) % 50;
                      return <circle key={i} cx={x} cy={y} r="0.6" fill="#fff" opacity="0.5" />;
                    })}
                    <path d="M0 90 L20 60 L40 70 L60 45 L80 65 L110 50 L110 110 L0 110 Z" fill="#0a1410" stroke="rgba(60,90,70,0.5)" strokeWidth="0.5" />
                  </svg>
                  <div className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white/80">
                    {l.nazov.split(' ')[0]}
                  </div>
                </div>
                <div className="flex-1 p-3.5 pr-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{l.nazov}</div>
                    <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
                  </div>
                  <p className="text-[12px] mt-1.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
                    {(l.popis || '').length > 78 ? (l.popis || '').slice(0, 78) + '…' : (l.popis || '')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Pill tone="softer" size="sm">{l.sektorov || 0} {skPlural(l.sektorov || 0, 'sektor', 'sektory', 'sektorov')}</Pill>
                    <Pill tone="softer" size="sm">{l.ciest || 0} {skPlural(l.ciest || 0, 'cesta', 'cesty', 'ciest')}</Pill>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />
    </div>
  );
}
