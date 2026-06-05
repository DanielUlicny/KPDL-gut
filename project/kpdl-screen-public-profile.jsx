// Public, read-only climber profile.
// Opened by tapping a name in "Posledné prelezy" on a route detail screen.
// No pyramid, no logbook, no projects — just who they are + headline stats + badges.

// ── Mock person (would be passed in via nav props in the live app) ──
const VIEWED = {
  name: 'Marek H.',          // first name + last-name initial (privacy)
  handle: '@marek_h',
  since: 2019,               // "Lezie od …"
  age: 31,                   // optional — only shown if set
  apeIndex: 186,             // rozpätie rúk in cm — optional
  styles: ['Sport', 'Boulder'],
  ascents: 84,               // total logged ascents (count only — log itself is private)
  hardest: '7+',
};

// Public badges — earned ones in colour, locked ones greyed + lock glyph.
const VIEWED_BADGES = [
  { id: 'prvy-vylez', name: 'Prvý výlez',      icon: 'mountain', earned: true },
  { id: 'prvy-flash', name: 'Prvý flash',      icon: 'bolt',     earned: true },
  { id: '50-ciest',   name: '50 ciest',        icon: 'flame',    earned: true },
  { id: 'sektor',     name: 'Sektor kompletný', icon: 'star',    earned: true },
  { id: '100-ciest',  name: '100 ciest',       icon: 'check',    earned: false },
  { id: 'lokalita',   name: 'Lokalita kompletná', icon: 'map',   earned: false },
];

function PublicProfileScreen({ nav, back, person }) {
  const u = person && person.name
    ? { ...VIEWED, name: person.name, handle: '@' + person.name.toLowerCase().replace(/[^a-z]+/g, '_').replace(/_$/, '') }
    : VIEWED;
  const goBack = () => (back ? back() : nav && nav('route'));
  const earnedCount = VIEWED_BADGES.filter(b => b.earned).length;

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>

      {/* ── Nav: back + share ───────────────────────────── */}
      <div className="relative z-10 shrink-0" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center px-4 pb-3" style={{ paddingTop: 58 }}>
          <button onClick={goBack}
            className="w-10 h-10 -ml-1 grid place-items-center rounded-full hover:bg-black/5 transition shrink-0"
            style={{ color: 'var(--text)' }}>
            <Icon name="arrowLeft" size={20} stroke={2.2} />
          </button>
          <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ color: 'var(--text-faint)' }}>
            Profil lezca
          </span>
          <button
            className="ml-auto w-10 h-10 grid place-items-center rounded-full hover:bg-black/5 transition shrink-0"
            style={{ color: 'var(--text-dim)' }}>
            <Icon name="share" size={18} stroke={2.2} />
          </button>
        </div>
        <div className="h-px mx-4" style={{ background: 'var(--border)' }} />
      </div>

      <div className="flex-1 overflow-y-auto pb-10">

        {/* ── Identity header ───────────────────────────── */}
        <div className="px-5 pt-5 flex items-start gap-4">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0"
            style={{ border: '2px solid var(--border)' }}>
            <ImgSlot light label="foto" className="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
              {u.name}
            </h1>
            <div className="text-[13px] mt-1.5" style={{ color: 'var(--text-dim)' }}>
              {u.handle}
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-[12.5px] font-semibold"
              style={{ color: 'var(--text-dim)' }}>
              <Icon name="mountain" size={13} stroke={2} style={{ color: 'var(--accent)' }} />
              Lezie od {u.since}
            </div>
          </div>
        </div>

        {/* ── Style chips ───────────────────────────────── */}
        <div className="px-5 mt-4 flex items-center gap-2 flex-wrap">
          {u.styles.map(s => (
            <Pill key={s} tone="soft" size="md">{s}</Pill>
          ))}
        </div>

        {/* ── Headline stats ────────────────────────────── */}
        <div className="px-4 mt-5 grid grid-cols-2 gap-2">
          <Card>
            <div className="text-[26px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
              {u.ascents}
            </div>
            <div className="text-[11.5px] mt-1.5" style={{ color: 'var(--text-dim)' }}>Vylezených ciest</div>
          </Card>
          <Card>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[26px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>
                {u.hardest}
              </span>
            </div>
            <div className="text-[11.5px] mt-1.5" style={{ color: 'var(--text-dim)' }}>Najťažšia cesta</div>
          </Card>
        </div>

        {/* ── Parameters (only render the ones that are set) ── */}
        {(u.age || u.apeIndex) && (
          <div className="px-4 mt-6">
            <SectionLabel>Parametre</SectionLabel>
            <Card className="mt-2.5" padding={false}>
              <div className="flex items-stretch">
                {u.age && (
                  <div className="flex-1 px-4 py-3.5">
                    <div className="text-[11px] font-semibold" style={{ color: 'var(--text-faint)' }}>Vek</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[18px] font-extrabold" style={{ color: 'var(--text)' }}>{u.age}</span>
                      <span className="text-[12px] font-semibold" style={{ color: 'var(--text-dim)' }}>rokov</span>
                    </div>
                  </div>
                )}
                {u.age && u.apeIndex && (
                  <div className="w-px my-3" style={{ background: 'var(--border)' }} />
                )}
                {u.apeIndex && (
                  <div className="flex-1 px-4 py-3.5">
                    <div className="text-[11px] font-semibold" style={{ color: 'var(--text-faint)' }}>Rozpätie rúk</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[18px] font-extrabold" style={{ color: 'var(--text)' }}>{u.apeIndex}</span>
                      <span className="text-[12px] font-semibold" style={{ color: 'var(--text-dim)' }}>cm</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ── Badges ────────────────────────────────────── */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>{earnedCount} z {VIEWED_BADGES.length}</span>}>Odznaky</SectionLabel>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {VIEWED_BADGES.map(b => (
              <div key={b.id} className="rounded-2xl p-3 flex flex-col items-center text-center"
                style={b.earned
                  ? { background: 'var(--card)', border: '1px solid var(--border)' }
                  : { background: 'var(--bg-2)', border: '1px dashed var(--border-2)', opacity: 0.55 }}>
                <div className="w-11 h-11 rounded-full grid place-items-center mb-2"
                  style={b.earned
                    ? { background: 'var(--green-soft)', color: 'var(--accent-deep)' }
                    : { background: 'var(--card)', color: 'var(--text-faint)' }}>
                  <Icon name={b.earned ? b.icon : 'lock'} size={19} stroke={2} />
                </div>
                <div className="text-[11px] font-bold leading-tight"
                  style={{ color: b.earned ? 'var(--text)' : 'var(--text-faint)' }}>
                  {b.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { PublicProfileScreen });
