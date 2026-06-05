// Screen: HOME (Domov)
import React, { useEffect, useState } from 'react';
import { TopBar, BottomNav, Card, GradeBadge, NumDot, SectionLabel, Icon, skPlural } from '../components/ui.jsx';
import { useProjects, useLogbook, useStats } from '../hooks/useData.js';
import { fetchAllLokality } from '../lib/db.js';
import climberImg from '../assets/climber.png';

export function HomeScreen({ nav }) {
  const { projects } = useProjects();
  const { logbook } = useLogbook();
  const stats = useStats();
  const [nearbyLokality, setNearbyLokality] = useState([]);

  useEffect(() => {
    fetchAllLokality().then(setNearbyLokality).catch(console.error);
  }, []);

  const topProject = projects[0];
  const lastEntry = logbook[0];

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero with illustration */}
        <div className="relative mx-4 mt-3 rounded-3xl overflow-hidden" style={{ height: 440 }}>
          <img src={climberImg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 44%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)' }} />

          <div className="absolute top-6 left-5 right-5">
            <h1 className="display-condensed uppercase leading-[0.86]"
              style={{ fontSize: 56, color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.35)' }}>
              Kam pojdeš<br/><span style={{ display: 'inline-block', marginTop: '0.1em' }}>dnes liezť?</span>
            </h1>
          </div>

          {/* Active project card */}
          {topProject ? (
            <button
              onClick={() => nav('route', {
                route: topProject._cesta || { nazov: topProject.route, obtaznost: topProject.grade, dlzka_m: topProject.length, pocet_isteni: topProject.bolts },
                sektor: { id: topProject._cesta?.sektor_id, nazov: topProject.sektor },
                lokalita: { id: topProject._cesta?.sektory?.lokalita_id, nazov: topProject.lokalita },
                region: { nazov: '' },
              })}
              className="absolute bottom-4 left-4 right-4 rounded-2xl p-3.5 text-left transition hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-3">
                <NumDot n="P" color="var(--amber)" size={42} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--amber-deep)' }}>Tvoj projekt</div>
                  <div className="text-[15px] font-bold mt-0.5 truncate" style={{ color: 'var(--text)' }}>{topProject.route}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    {topProject.lokalita}{topProject.sektor ? ` · ${topProject.sektor}` : ''}
                    {topProject.attempts > 0 ? ` · ${topProject.attempts} pokusov` : ''}
                  </div>
                </div>
                <GradeBadge grade={topProject.grade} size="md" />
              </div>
            </button>
          ) : (
            <button onClick={() => nav('mapa')}
              className="absolute bottom-4 left-4 right-4 rounded-2xl p-3.5 text-left transition hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-3">
                <NumDot n="P" color="var(--amber)" size={42} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--amber-deep)' }}>Žiadny projekt</div>
                  <div className="text-[15px] font-bold mt-0.5" style={{ color: 'var(--text)' }}>Pridaj si cestu do projektov</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Otvor mapu a vyber cestu</div>
                </div>
                <Icon name="arrowRight" size={18} style={{ color: 'var(--accent)' }} />
              </div>
            </button>
          )}
        </div>

        {/* Nearby lokality */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>{nearbyLokality.length} v okolí</span>}>V blízkosti</SectionLabel>
          <div className="mt-3 flex gap-3 overflow-x-auto -mx-4 px-4 pb-2">
            {nearbyLokality.slice(0, 5).map((l, i) => (
              <button key={l.id || i}
                onClick={() => nav('lokalita', { lokalita: l, region: { nazov: '' } })}
                className="shrink-0 w-[180px] text-left rounded-2xl overflow-hidden transition hover:-translate-y-0.5"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="h-[90px] relative" style={{ background: i === 0 ? 'linear-gradient(135deg, #4a7a5e, #2a5840)' : i === 1 ? 'linear-gradient(135deg, #a87544, #6b4523)' : 'linear-gradient(135deg, #5d8d6f, #3a6a4b)' }}>
                  <svg viewBox="0 0 180 90" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <polyline points="0,75 30,40 60,55 100,30 140,50 180,35 180,90 0,90" fill="rgba(0,0,0,0.25)" />
                  </svg>
                </div>
                <div className="p-3">
                  <div className="text-[12px] font-bold leading-tight truncate" style={{ color: 'var(--text)' }}>{l.nazov}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{l.sektorov || 0} {skPlural(l.sektorov || 0, 'sektor', 'sektory', 'sektorov')}</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{l.ciest || 0} {skPlural(l.ciest || 0, 'cesta', 'cesty', 'ciest')}</span>
                  </div>
                </div>
              </button>
            ))}
            {nearbyLokality.length === 0 && (
              <div className="text-[13px] py-4" style={{ color: 'var(--text-faint)' }}>Načítavam lokality…</div>
            )}
          </div>
        </div>

        {/* Stats card */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>Tento týždeň</span>}>Pokračuj v lezení</SectionLabel>
          <Card className="mt-3" padding={false}>
            <div className="p-4 grid grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>{stats.thisWeek}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Sessiony</div>
              </div>
              <div className="flex flex-col items-start" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                <div className="flex items-baseline gap-1">
                  <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>{stats.streak}</div>
                  <Icon name="flame" size={14} style={{ color: 'var(--amber)' }} fill="currentColor" />
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Streak (dní)</div>
              </div>
              <div className="flex flex-col items-start" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>{stats.best}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Najťažšia</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Last ascent */}
        <div className="px-4 mt-6">
          <SectionLabel right={<button onClick={() => nav('logbook')} className="font-semibold" style={{ color: 'var(--accent)' }}>Logbook →</button>}>Posledný prelez</SectionLabel>
          {lastEntry ? (
            <Card className="mt-3 flex items-center gap-3" hover onClick={() => nav('logbook')}>
              <NumDot n={lastEntry.poradie || '✓'} color="var(--accent)" size={40} />
              <div className="flex-1">
                <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{lastEntry.route}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                  {lastEntry.sektor ? `${lastEntry.sektor} · ` : ''}{lastEntry.when} · {lastEntry.style}
                </div>
              </div>
              <GradeBadge grade={lastEntry.grade} size="md" />
            </Card>
          ) : (
            <Card className="mt-3 flex items-center gap-3">
              <div className="text-[13px]" style={{ color: 'var(--text-faint)' }}>Zatiaľ žiadne prelezy. Začni liezť!</div>
            </Card>
          )}
        </div>
      </div>

      <BottomNav active="home" onNav={nav} />
    </div>
  );
}
