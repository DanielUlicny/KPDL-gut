// Screens: PROJEKTY + PROFIL + LOGBOOK + VISITED
import React, { useState, useMemo, useRef } from 'react';
import { TopBar, BottomNav, Card, Pill, Chip, GradeBadge, NumDot, SectionLabel, Icon, skPlural } from '../components/ui.jsx';
import { ROUTES_LOM_A, SEKTORY, LOKALITY, REGIONS } from '../data/mock.js';
import { NoteSheet, PrelezSheet } from './Route.jsx';
import { useProjects, useLogbook, useProfile, useBadges, useStats, useVisited, usePyramid } from '../hooks/useData.js';
import { useAuth } from '../contexts/auth.jsx';

// Grade rows for pyramid display (French/Slovak sport grades)
const PYRAMID_GRADES = ['8+', '8', '7+', '7', '7-', '6+', '6', '6-', '5+', '5', '5-', '4+', '4', '4-'];

const BADGES_PER_PAGE = 9;

function BadgeDetailSheet({ badge, onClose }) {
  const earned = badge.earned;
  const d = badge.earnedAt ? new Date(badge.earnedAt) : null;
  const dateStr = d ? d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="rounded-t-3xl px-5 pt-4 pb-8"
        style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border-2)' }} />
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full grid place-items-center mb-3"
            style={earned
              ? { background: 'var(--green-soft)', color: 'var(--accent-deep)' }
              : { background: 'var(--bg-2)', color: 'var(--text-faint)' }}>
            {earned
              ? (badge.icon && badge.icon.charCodeAt(0) > 127
                ? <span className="text-[32px] leading-none">{badge.icon}</span>
                : <Icon name={badge.icon || 'star'} size={32} stroke={1.8} />)
              : <Icon name="lock" size={32} stroke={2} />}
          </div>
          {earned && (
            <div className="inline-flex items-center gap-1.5 h-6 px-3 rounded-full text-[11px] font-bold mb-3"
              style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
              <Icon name="check" size={11} stroke={2.6} /> Získaný
            </div>
          )}
          <div className="text-[22px] font-extrabold mb-2" style={{ color: 'var(--text)' }}>{badge.name}</div>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            {badge.description || badge.desc || ''}
          </p>
          {dateStr && (
            <p className="text-[12px] mt-2" style={{ color: 'var(--text-faint)' }}>Získaný {dateStr}</p>
          )}
        </div>
        <button onClick={onClose}
          className="mt-6 w-full h-12 rounded-full text-[14px] font-bold"
          style={{ background: 'var(--bg-2)', color: 'var(--text)' }}>
          Zatvoriť
        </button>
      </div>
    </div>
  );
}

function BadgesCarousel({ badges, earnedBadges }) {
  const scrollRef = useRef(null);
  const [page, setPage] = useState(0);
  const [openBadge, setOpenBadge] = useState(null);

  const pages = [];
  for (let i = 0; i < badges.length; i += BADGES_PER_PAGE) {
    pages.push(badges.slice(i, i + BADGES_PER_PAGE));
  }

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.offsetWidth));
  };

  return (
    <div className="mt-5">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Odznaky</span>
        <span className="text-[12px] font-semibold" style={{ color: 'var(--text-faint)' }}>{earnedBadges} z {badges.length}</span>
      </div>
      <div ref={scrollRef} onScroll={handleScroll}
        className="overflow-x-auto"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex" style={{ width: `${pages.length * 100}%` }}>
          {pages.map((pg, pi) => (
            <div key={pi} className="px-4 shrink-0"
              style={{ width: `${100 / pages.length}%`, scrollSnapAlign: 'start' }}>
              <div className="grid grid-cols-3 gap-2">
                {pg.map(b => (
                  <button key={b.id} onClick={() => setOpenBadge(b)}
                    className="rounded-2xl p-3 flex flex-col items-center text-center transition active:scale-[0.97]"
                    style={b.earned
                      ? { background: 'var(--card)', border: '1px solid var(--border)' }
                      : { background: 'var(--bg-2)', border: '1px dashed var(--border-2)', opacity: 0.55 }}>
                    <div className="w-11 h-11 rounded-full grid place-items-center mb-2"
                      style={b.earned
                        ? { background: 'var(--green-soft)', color: 'var(--accent-deep)' }
                        : { background: 'var(--card)', color: 'var(--text-faint)' }}>
                      {!b.earned
                        ? <Icon name="lock" size={19} stroke={2} />
                        : (b.icon && b.icon.charCodeAt(0) > 127)
                          ? <span className="text-[18px] leading-none">{b.icon}</span>
                          : <Icon name={b.icon || 'star'} size={19} stroke={2} />}
                    </div>
                    <div className="text-[11px] font-bold leading-tight" style={{ color: b.earned ? 'var(--text)' : 'var(--text-faint)' }}>
                      {b.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {pages.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {pages.map((_, i) => (
            <div key={i} className="rounded-full transition-all"
              style={{ width: page === i ? 20 : 8, height: 8, background: page === i ? 'var(--accent)' : 'var(--border-2)' }} />
          ))}
        </div>
      )}
      {openBadge && <BadgeDetailSheet badge={openBadge} onClose={() => setOpenBadge(null)} />}
    </div>
  );
}

export function ProjektyScreen({ nav, back }) {
  const [tab, setTab] = useState('aktivne');
  const [markingIdx, setMarkingIdx] = useState(null);
  const [editNoteIdx, setEditNoteIdx] = useState(null);
  const { projects, remove, updateNotes } = useProjects();
  const { logbook, addEntry } = useLogbook();
  const stats = useStats();

  const sentCount = stats.sent;

  const handleMarkSent = async (type, note) => {
    const p = projects[markingIdx];
    await addEntry({ route_id: p.route_id, style: type, note, route: p.route, grade: p.grade });
    await remove(markingIdx);
    setMarkingIdx(null);
  };

  const handleOpenProject = (p) => {
    const route = p._cesta || { id: p.route_id, nazov: p.route, obtaznost: p.grade, dlzka_m: p.length, pocet_isteni: p.bolts };
    const sektor = p._cesta?.sektory
      ? { id: p._cesta.sektory.id, nazov: p._cesta.sektory.nazov }
      : { nazov: p.sektor };
    const lokalita = p._cesta?.sektory?.lokality
      ? { id: p._cesta.sektory.lokality.id, nazov: p._cesta.sektory.lokality.nazov }
      : { nazov: p.lokalita };
    nav('route', { route, sektor, lokalita, region: { nazov: '' } });
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={back || (() => nav('home'))} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[34px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            {tab === 'aktivne'
              ? `${projects.length} ${skPlural(projects.length, 'projekt čaká', 'projekty čakajú', 'projektov čaká')}`
              : `${sentCount} ${skPlural(sentCount, 'prelezená cesta', 'prelezené cesty', 'prelezených ciest')}`}
          </h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>
            {tab === 'aktivne' ? 'Cesty, na ktorých momentálne pracuješ.' : 'Cesty, ktoré si už zalez.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-5 flex items-center gap-2">
          <Chip active={tab === 'aktivne'} onClick={() => setTab('aktivne')}>Aktívne · {projects.length} {skPlural(projects.length, 'projekt', 'projekty', 'projektov')}</Chip>
          <Chip active={tab === 'hotove'} onClick={() => setTab('hotove')}>Hotové · {sentCount} {skPlural(sentCount, 'cesta', 'cesty', 'ciest')}</Chip>
        </div>

        {tab === 'hotove' ? (
          <div className="px-4 mt-4 space-y-2.5">
            {logbook.length === 0 && (
              <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>
                  Zatiaľ žiadne prelezené cesty.
                </div>
              </div>
            )}
            {logbook.map((l, i) => (
              <Card key={l.id || i} className="flex items-center gap-3" padding={false}>
                <div className="flex items-center gap-3.5 p-4 w-full">
                  <div className="w-11 h-11 rounded-full grid place-items-center shrink-0"
                    style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                    <Icon name="check" size={19} stroke={2.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-bold leading-tight truncate" style={{ color: 'var(--text)' }}>{l.route}</div>
                    <div className="text-[12.5px] mt-0.5 truncate" style={{ color: 'var(--text-dim)' }}>
                      {l.sektor ? `${l.sektor} · ` : ''}{l.when} · {l.style}
                    </div>
                  </div>
                  <GradeBadge grade={l.grade} size="md" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="px-4 mt-4 space-y-4">
            {projects.map((p, i) => (
              <Card key={p.id || i} padding={false}>
                <div className="p-5">
                  <div className="flex items-start gap-3.5">
                    <NumDot n="P" color="var(--amber)" size={50} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[19px] font-extrabold truncate" style={{ color: 'var(--text)' }}>{p.route}</div>
                      <div className="text-[13px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        <span className="font-semibold">{p.grade}</span>
                        {p.length ? ` · ${p.length} m` : ''}
                        {p.bolts ? ` · ${p.bolts} expresiek` : ''}
                      </div>
                    </div>
                    <GradeBadge grade={p.grade} size="lg" />
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Pill tone="softer" size="sm">{p.attempts} {skPlural(p.attempts, 'pokus', 'pokusy', 'pokusov')}</Pill>
                    {p.sektor && <Pill tone="soft" size="sm">{p.sektor}</Pill>}
                    {p.lokalita && <Pill tone="softer" size="sm">{p.lokalita}</Pill>}
                  </div>

                  {p.attempts > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>Pokusy</span>
                        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-faint)' }}>{p.attempts} / 5+</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="flex-1 h-2 rounded-full"
                            style={{ background: j < Math.min(p.attempts, 5) ? 'var(--accent)' : 'var(--bg-2)' }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => handleOpenProject(p)}
                      className="flex-1 h-11 px-3 rounded-full text-[12.5px] font-bold flex items-center justify-center gap-1.5"
                      style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                      Detail <Icon name="arrowRight" size={13} />
                    </button>
                    <button onClick={() => setEditNoteIdx(i)}
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'transparent', border: '1.5px solid var(--border-2)', color: 'var(--text-dim)' }}>
                      <Icon name="edit" size={15} stroke={2.2} />
                    </button>
                    <button onClick={() => setMarkingIdx(i)}
                      className="flex-1 h-11 px-3 rounded-full text-[12.5px] font-bold flex items-center justify-center gap-1.5"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      <Icon name="check" size={14} stroke={2.6} /> Vylezené!
                    </button>
                  </div>
                </div>

                {p.notes ? (
                  <div className="px-4 pb-4">
                    <div className="p-3 rounded-xl"
                      style={{ background: 'var(--bg-2)', border: '1px dashed var(--border-2)' }}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1.5"
                        style={{ color: 'var(--text-faint)' }}>
                        <Icon name="edit" size={11} stroke={2.2} /> Poznámky
                      </div>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                        {p.notes}
                      </p>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
            {projects.length === 0 && (
              <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>
                  Zatiaľ žiadne projekty. Pridaj cestu z jej detailu.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="projekty" onNav={nav} />

      {markingIdx !== null && (
        <PrelezSheet
          onClose={() => setMarkingIdx(null)}
          onDone={handleMarkSent}
          initialNote={projects[markingIdx]?.notes || ''}
        />
      )}

      {editNoteIdx !== null && (
        <NoteSheet
          title="Poznámka k projektu"
          subtitle={projects[editNoteIdx]?.route || ''}
          placeholder="Kde bol problém? Čo skúsiť nabudúce..."
          initial={projects[editNoteIdx]?.notes || ''}
          secondaryLabel="Zrušiť"
          primaryLabel="Uložiť"
          onClose={() => setEditNoteIdx(null)}
          onSecondary={() => setEditNoteIdx(null)}
          onPrimary={(text) => { updateNotes(editNoteIdx, text); setEditNoteIdx(null); }}
        />
      )}
    </div>
  );
}

export function ProfilScreen({ nav }) {
  const { profile } = useProfile();
  const badges = useBadges();
  const stats = useStats();
  const { projects } = useProjects();
  const { logbook } = useLogbook();
  const { signOut, isDemo } = useAuth();
  const visited = useVisited(logbook);
  const pyramid = usePyramid(logbook);

  const u = profile || { name: 'Climber', handle: '@climber', bio: '' };
  const earnedBadges = badges.filter(b => b.earned).length;

  // Pyramid: show top grades that have any counts
  const pyramidRows = PYRAMID_GRADES
    .map(g => ({ g, c: pyramid[g] || 0 }))
    .filter((row, _, arr) => {
      const firstNonZero = arr.findIndex(r => r.c > 0);
      return firstNonZero !== -1 ? arr.indexOf(row) >= firstNonZero - 1 : true;
    })
    .slice(0, 8);
  const pyramidMax = Math.max(...pyramidRows.map(r => r.c), 1);

  const topProject = projects[0];

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="px-5 pt-3 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full grid place-items-center text-[28px] font-extrabold shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {u.name?.[0] || 'D'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
                {u.name}
              </h1>
              <button onClick={() => nav('editProfile')}
                className="h-8 px-3.5 rounded-full text-[12px] font-bold active:scale-[0.97] transition"
                style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                Upraviť
              </button>
            </div>
            <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-dim)' }}>{u.handle}</div>
            <div className="mt-2">
              <Pill tone="soft" size="sm" icon="star">Najťažšia cesta {stats.best}</Pill>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 mt-5 grid grid-cols-3 gap-2">
          <Card>
            <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>{stats.sent}</div>
            <div className="text-[12px] mt-2" style={{ color: 'var(--text-dim)' }}>{skPlural(stats.sent, 'Prelezená cesta', 'Prelezené cesty', 'Prelezených ciest')}</div>
          </Card>
          <Card>
            <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
              {stats.totalLen}
              <span className="text-[15px] font-bold ml-0.5">m</span>
            </div>
            <div className="text-[12px] mt-2" style={{ color: 'var(--text-dim)' }}>Celková dĺžka</div>
          </Card>
          <Card>
            <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>{stats.best}</div>
            <div className="text-[12px] mt-2" style={{ color: 'var(--text-dim)' }}>Najťažšia</div>
          </Card>
        </div>

        {/* Active project banner */}
        <div className="px-4 mt-4">
          <button onClick={() => nav('projekty')}
            className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition hover:-translate-y-0.5"
            style={{ background: 'var(--green-soft)' }}>
            <span className="relative grid place-items-center w-3.5 h-3.5 shrink-0">
              <span className="absolute inline-flex w-3.5 h-3.5 rounded-full animate-ping" style={{ background: 'var(--accent)', opacity: 0.55 }} />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
            </span>
            <div className="flex-1 min-w-0">
              {topProject ? (
                <>
                  <div className="text-[16px] font-bold" style={{ color: 'var(--accent-deep)' }}>
                    Máš {projects.length} aktívn{projects.length === 1 ? 'ý projekt' : 'é projekty'}
                  </div>
                  <div className="text-[13px] truncate" style={{ color: 'var(--text-dim)' }}>
                    {topProject.route} · {topProject.grade}{topProject.sektor ? ` · ${topProject.sektor}` : ''}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[16px] font-bold" style={{ color: 'var(--accent-deep)' }}>Žiadne aktívne projekty</div>
                  <div className="text-[13px]" style={{ color: 'var(--text-dim)' }}>Pridaj cestu do projektov</div>
                </>
              )}
            </div>
            <span className="text-[13px] font-bold flex items-center gap-1" style={{ color: 'var(--accent-deep)' }}>
              Projekty <Icon name="arrowRight" size={14} />
            </span>
          </button>
        </div>

        {/* Badges carousel */}
        {badges.length > 0 && (
          <BadgesCarousel badges={badges} earnedBadges={earnedBadges} />
        )}

        {/* Difficulty Pyramid */}
        <div className="px-4 mt-5">
          <SectionLabel right={<span>všetky prelezy</span>}>Pyramída obtiažnosti</SectionLabel>
          <Card className="mt-2">
            {stats.sent === 0 ? (
              <div className="text-center py-4 text-[13px]" style={{ color: 'var(--text-faint)' }}>
                Zatiaľ žiadne prelezy.
              </div>
            ) : (
              <div className="space-y-1.5">
                {pyramidRows.map((row, i) => {
                  const pct = (row.c / pyramidMax) * 100;
                  const isHard = row.g.startsWith('7') || row.g.startsWith('8') || row.g.startsWith('9');
                  const isMid = row.g.startsWith('6');
                  const color = isHard ? 'var(--red)' : isMid ? 'var(--amber)' : 'var(--accent)';
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] w-7 text-right font-bold" style={{ color: 'var(--text-dim)' }}>{row.g}</span>
                      <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--bg-2)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-[11px] w-6 font-semibold" style={{ color: 'var(--text-faint)' }}>{row.c}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Menu - logbook & visited */}
        <div className="px-4 mt-5 space-y-2">
          {[
            { icon: 'clipboard', label: 'Vylezené cesty', sub: `${stats.sent} ${skPlural(stats.sent, 'záznam', 'záznamy', 'záznamov')} · filtre podľa obtiažnosti`, badge: stats.sent > 0 ? String(stats.sent) : null, go: 'logbook' },
            { icon: 'map', label: 'Navštívené lokality', sub: `${visited.length} lokalít s prelezmi`, badge: visited.length > 0 ? String(visited.length) : null, go: 'visited' },
          ].map((m, i) => (
            <Card key={i} className="flex items-center gap-3.5" hover onClick={() => nav(m.go)} padding={false} style={{ padding: '14px 16px' }}>
              <div className="w-11 h-11 rounded-full grid place-items-center shrink-0"
                style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name={m.icon} size={19} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>{m.label}</div>
                <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{m.sub}</div>
              </div>
              {m.badge && (
                <span className="text-[12px] font-bold px-2.5 h-7 inline-flex items-center rounded-full"
                  style={{ background: 'var(--bg-2)', color: 'var(--text-dim)' }}>{m.badge}</span>
              )}
              <Icon name="chevronRight" size={18} style={{ color: 'var(--text-faint)' }} />
            </Card>
          ))}
        </div>

        {/* Settings */}
        <div className="px-4 mt-5">
          <SectionLabel>Nastavenia</SectionLabel>
          <div className="mt-2 space-y-2">
            <Card className="flex items-center gap-3" padding={false}>
              <div className="flex items-center gap-3.5 p-4 w-full">
                <Icon name="bell" size={19} stroke={2} style={{ color: 'var(--text-dim)' }} />
                <span className="flex-1 text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Notifikácie</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>Zapnuté</span>
                <Icon name="chevronRight" size={17} style={{ color: 'var(--text-faint)' }} />
              </div>
            </Card>

            <Card className="flex items-center gap-3" padding={false} onClick={isDemo ? undefined : signOut}>
              <div className="flex items-center gap-3.5 p-4 w-full">
                <Icon name="logout" size={19} stroke={2} style={{ color: 'var(--red)' }} />
                <span className="flex-1 text-[15px] font-semibold" style={{ color: 'var(--red-deep)' }}>
                  {isDemo ? 'Odhlásenie (demo)' : 'Odhlásenie'}
                </span>
                <Icon name="chevronRight" size={17} style={{ color: 'var(--text-faint)' }} />
              </div>
            </Card>
          </div>
        </div>

        <div className="px-5 mt-6 mb-2 text-center text-[11px] font-semibold" style={{ color: 'var(--text-faint)' }}>
          KPDL · v0.1.0 · Made for Slovensko 🇸🇰
        </div>
      </div>

      <BottomNav active="profil" onNav={nav} />
    </div>
  );
}

const STYLE_PRIORITY = ['onsight', 'flash', '2_pokus', '3_pokus', '4_pokus', '5plus_pokusov'];

function bestStyleOf(ascents) {
  return ascents.reduce((best, a) => {
    const bi = STYLE_PRIORITY.indexOf(best);
    const ai = STYLE_PRIORITY.indexOf(a.style);
    return ai !== -1 && (bi === -1 || ai < bi) ? a.style : best;
  }, ascents[0]?.style || '');
}

export function LogbookScreen({ nav, back }) {
  const [filter, setFilter] = useState('vsetky');
  const [openKey, setOpenKey] = useState(null);
  const [editEntry, setEditEntry] = useState(null); // { _i, route }
  const { logbook, updateNote } = useLogbook();
  const stats = useStats();

  const grouped = useMemo(() => {
    const filtered = logbook
      .map((l, i) => ({ ...l, _i: i }))
      .filter(l => {
        const n = parseFloat(l.grade);
        if (filter === 'zaciatocnici') return n < 6;
        if (filter === 'pokrocili') return n >= 6 && n < 7;
        if (filter === 'profesionali') return n >= 7;
        return true;
      });

    const map = new Map();
    filtered.forEach(l => {
      const key = l.route_id || l.route;
      if (!map.has(key)) {
        map.set(key, { key, route: l.route, grade: l.grade, sektor: l.sektor, lokalita: l.lokalita, route_id: l.route_id, dlzka_m: l.dlzka_m, pocet_isteni: l.pocet_isteni, ascents: [] });
      }
      map.get(key).ascents.push(l);
    });

    map.forEach(g => {
      g.ascents.sort((a, b) => new Date(b.ascended_at || 0) - new Date(a.ascended_at || 0));
      g.bestStyle = bestStyleOf(g.ascents);
      g.count = g.ascents.length;
    });

    return Array.from(map.values());
  }, [logbook, filter]);

  const uniqueRoutes = grouped.length;

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={back || (() => nav('profil'))} />
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[32px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>Logbook</h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>
            {uniqueRoutes} {skPlural(uniqueRoutes, 'jedinečná cesta', 'jedinečné cesty', 'jedinečných ciest')} · {stats.sent} {skPlural(stats.sent, 'prelezenie', 'prelezenia', 'prelezení')} celkovo
          </p>
        </div>
        <div className="px-4 mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <Chip active={filter === 'vsetky'} onClick={() => setFilter('vsetky')}>Všetky</Chip>
          <Chip active={filter === 'zaciatocnici'} onClick={() => setFilter('zaciatocnici')}>Začiatočníci</Chip>
          <Chip active={filter === 'pokrocili'} onClick={() => setFilter('pokrocili')}>Pokročilí</Chip>
          <Chip active={filter === 'profesionali'} onClick={() => setFilter('profesionali')}>Profesionáli</Chip>
        </div>
        <div className="px-4 mt-3 space-y-2">
          {grouped.length === 0 && (
            <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>
                {logbook.length === 0 ? 'Zatiaľ žiadne prelezy.' : 'Žiadne záznamy pre zvolený filter.'}
              </div>
            </div>
          )}
          {grouped.map((g) => {
            const isFlash = g.bestStyle === 'flash' || g.bestStyle === 'onsight';
            const open = openKey === g.key;
            const lastAscent = g.ascents[0];
            return (
              <Card key={g.key} padding={false} className="overflow-hidden">
                <button onClick={() => setOpenKey(open ? null : g.key)}
                  className="w-full flex items-center gap-3.5 p-4 text-left">
                  <div className="w-11 h-11 rounded-full grid place-items-center shrink-0"
                    style={{ background: isFlash ? 'var(--amber-soft)' : 'var(--green-soft)', color: isFlash ? 'var(--amber-deep)' : 'var(--accent-deep)' }}>
                    <Icon name={isFlash ? 'bolt' : 'check'} size={19} stroke={2.4} fill={isFlash ? 'currentColor' : 'none'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{g.route}</div>
                    <div className="text-[12.5px] mt-0.5 truncate" style={{ color: 'var(--text-dim)' }}>
                      {g.lokalita ? `${g.lokalita} · ` : ''}{g.sektor ? `${g.sektor} · ` : ''}{lastAscent.when}
                      {g.count > 1 && <span className="ml-1" style={{ color: 'var(--accent)' }}>+{g.count - 1}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{g.bestStyle}</span>
                  <GradeBadge grade={g.grade} size="md" />
                  <Icon name="chevronDown" size={16}
                    style={{ color: 'var(--text-faint)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
                </button>

                {open && (
                  <div className="px-3 pb-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* All ascents list */}
                    <div className="mt-3 space-y-2">
                      {g.ascents.map((a) => (
                        <div key={a._i} className="rounded-xl p-3" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{a.when}</span>
                            <span className="text-[11px] font-semibold px-2 h-5 rounded-full inline-flex items-center"
                              style={{ background: 'var(--card)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                              {a.style}
                            </span>
                            <button onClick={() => setEditEntry({ _i: a._i, route: a.route })}
                              className="ml-auto h-7 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1"
                              style={{ background: 'transparent', border: '1.5px solid var(--border-2)', color: 'var(--text-dim)' }}>
                              <Icon name="edit" size={11} stroke={2.2} /> {a.note ? 'Pozn.' : 'Pridať'}
                            </button>
                          </div>
                          {a.note && (
                            <p className="text-[12px] mt-2 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{a.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => nav('route', {
                        route: { id: g.route_id, nazov: g.route, obtaznost: g.grade, dlzka_m: g.dlzka_m, pocet_isteni: g.pocet_isteni },
                        sektor: { nazov: g.sektor },
                        lokalita: { nazov: g.lokalita },
                        region: { nazov: '' },
                        ascent: { style: lastAscent.style, when: lastAscent.when, ascended_at: lastAscent.ascended_at, note: lastAscent.note },
                      })}
                      className="mt-3 w-full h-11 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      Detail cesty <Icon name="arrowRight" size={14} stroke={2.4} />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav active="profil" onNav={nav} />

      {editEntry !== null && (
        <NoteSheet
          title="Upraviť poznámku"
          subtitle={editEntry.route || ''}
          placeholder="Aké si mal problémy? Čo si skúšal..."
          initial={logbook[editEntry._i]?.note || ''}
          secondaryLabel="Zrušiť"
          primaryLabel="Uložiť"
          onClose={() => setEditEntry(null)}
          onSecondary={() => setEditEntry(null)}
          onPrimary={(text) => { updateNote(editEntry._i, text); setEditEntry(null); }}
        />
      )}
    </div>
  );
}

const STAMP_COLORS = [
  ['#2a6f4a', '#1d5236'],
  ['#1d5472', '#133d54'],
  ['#7a4a1d', '#5c3712'],
  ['#5d2a6f', '#3f1d52'],
  ['#6f4a2a', '#523512'],
  ['#2a4a6f', '#1d3554'],
];

export function VisitedScreen({ nav, back }) {
  const { logbook } = useLogbook();
  const visited = useVisited(logbook);

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={back || (() => nav('profil'))} />
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[32px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>Navštívené lokality</h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>
            {visited.length > 0 ? `${visited.length} lokalít s prelezmi.` : 'Zatiaľ žiadne navštívené lokality.'}
          </p>
        </div>

        {visited.length === 0 ? (
          <div className="px-4 mt-4">
            <div className="rounded-2xl p-6 text-center" style={{ border: '1px dashed var(--border-2)' }}>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>
                Zalez prvú cestu v nejakej lokalite a objaví sa tu.
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            {visited.map((v, i) => {
              const [c1, c2] = STAMP_COLORS[i % STAMP_COLORS.length];
              const initials = v.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
              return (
                <div key={i} className="rounded-3xl overflow-hidden flex flex-col"
                  style={{ border: '2px solid var(--border)', background: 'var(--card)' }}>
                  {/* Stamp header */}
                  <div className="relative flex flex-col items-center justify-center pt-5 pb-4"
                    style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, minHeight: 110 }}>
                    {/* Dashed border inset */}
                    <div className="absolute inset-[6px] rounded-2xl pointer-events-none"
                      style={{ border: '1.5px dashed rgba(255,255,255,0.25)' }} />
                    <div className="text-[28px] font-black tracking-tight text-white/90 leading-none">{initials}</div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mt-1.5">Slovensko</div>
                    {/* Ascent count bubble */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex flex-col items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
                      <span className="text-[13px] font-black text-white leading-none">{v.ascents}</span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="px-3 py-3 flex-1 flex flex-col justify-between">
                    <div className="text-[13px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{v.name}</div>
                    {v.lastVisit && (
                      <div className="text-[10.5px] mt-1.5 font-semibold" style={{ color: 'var(--text-faint)' }}>
                        {v.lastVisit}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
                        {v.ascents} {v.ascents === 1 ? 'prelezenie' : v.ascents < 5 ? 'prelezenia' : 'prelezení'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav active="profil" onNav={nav} />
    </div>
  );
}
