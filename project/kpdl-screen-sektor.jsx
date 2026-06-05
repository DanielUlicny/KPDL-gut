// Screens: LOKALITA detail + SEKTOR detail

function LokalitaScreen({ nav, lokalita, region }) {
  const sektory = SEKTORY[lokalita.id] || [];
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('region', { region })} />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero with title overlay */}
        <div className="relative mx-4 mt-3 rounded-3xl overflow-hidden" style={{ height: 220 }}>
          {/* Night-sky illustration */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, #142319 0%, #0a1410 60%, #050a07 100%)',
          }}>
            <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* milky way swirl */}
              <defs>
                <radialGradient id="milky" cx="60%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#a8c595" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#a8c595" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="220" fill="url(#milky)" />
              {/* stars */}
              {Array.from({ length: 70 }).map((_, i) => {
                const x = (i * 41 + 7) % 400;
                const y = ((i * 23 + 3) % 130);
                const r = (i % 7 === 0) ? 1.4 : (i % 3 === 0) ? 0.9 : 0.5;
                return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.4 + (i % 5) * 0.12} />;
              })}
              {/* foreground silhouette - quarry walls */}
              <path d="M0 170 L30 130 L60 145 L100 110 L150 140 L180 100 L230 130 L280 95 L330 125 L380 105 L400 115 L400 220 L0 220 Z"
                fill="#020503" />
              <path d="M0 170 L30 130 L60 145 L100 110 L150 140 L180 100 L230 130 L280 95 L330 125 L380 105 L400 115"
                fill="none" stroke="rgba(168,197,149,0.18)" strokeWidth="1" />
              {/* wooden fence in foreground */}
              <g opacity="0.85">
                {[20, 50, 80, 110, 140].map(x => (
                  <rect key={x} x={x} y={160} width="8" height="60" fill="#3a2a1a" />
                ))}
                <rect x={15} y={175} width="135" height="3" fill="#3a2a1a" />
              </g>
            </svg>
          </div>

          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />

          <div className="absolute bottom-4 left-5 right-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
              style={{ color: '#a7d4b3' }}>
              {region.name.replace(' kraj', '')} · 760 m
            </div>
            <h1 className="display-condensed uppercase leading-[0.88]"
              style={{ fontSize: 38, color: '#fff' }}>
              {lokalita.name}
            </h1>
          </div>

          {/* AR badge */}
          {lokalita.ar && (
            <div className="absolute top-4 right-4">
              <Pill tone="amber" size="md" icon="cube">AR</Pill>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="px-5 mt-5">
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text)' }}>
            {lokalita.desc}
          </p>
        </div>

        {/* Quick spec pills — only the essentials */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-2">
          {[
            { label: 'Skala', value: lokalita.rock, icon: 'mountain' },
            { label: 'Sezóna', value: lokalita.best, icon: 'wind' },
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

        {/* Sector photos placeholder */}
        <div className="px-4 mt-5">
          <Card padding={false}>
            <div className="p-5 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--bg-2)', borderRadius: 14, margin: 4 }}>
              <div className="w-12 h-12 rounded-full grid place-items-center mb-2"
                style={{ background: 'var(--card)', color: 'var(--accent)' }}>
                <Icon name="triangle" size={20} stroke={2} />
              </div>
              <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Fotky sektorov</div>
              <p className="text-[12px] mt-1 max-w-[220px]" style={{ color: 'var(--text-dim)' }}>
                Tu budú fotky jednotlivých sektorov, aby si vedel rýchlo spoznať stenu.
              </p>
              <button className="mt-3 h-8 px-3.5 rounded-full text-[11px] font-bold"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                Pridať fotku
              </button>
            </div>
          </Card>
        </div>

        {/* Sektory section — full-bleed wide cards */}
        <div className="mt-6">
          <div className="px-4">
            <SectionLabel right={<span>{sektory.length} sektorov</span>}>Sektory</SectionLabel>
          </div>
          <div className="mt-3 px-4 space-y-2">
            {sektory.map(s => {
              const prog = s.prelezeno / s.ciest;
              return (
                <Card key={s.id} onClick={() => nav('sektor', { sektor: s, lokalita, region })}
                  className="flex items-center gap-4" hover padding={false} style={{ padding: '14px 16px' }}>
                  <NumDot n={s.num} color="var(--accent)" size={46} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[17px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{s.name}</div>
                    <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      {s.prelezeno} / {s.ciest} prelezených
                    </div>
                  </div>
                  <ProgressRing value={prog} size={44} stroke={5} label={`${Math.round(prog*100)}`} />
                  <Icon name="chevronRight" size={18} style={{ color: 'var(--text-faint)' }} />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />
    </div>
  );
}

function SektorScreen({ nav, sektor, lokalita, region }) {
  const [filter, setFilter] = useState('vsetky');
  const [expanded, setExpanded] = useState(1);
  const [sent, setSent] = useState(() => new Set(ROUTES_LOM_A.filter(r => r.sent).map(r => r.num)));
  const [sendTypes, setSendTypes] = useState({});
  const [sheetRoute, setSheetRoute] = useState(null);
  const routes = ROUTES_LOM_A;
  const filtered = routes.filter(r => {
    const n = parseFloat(r.grade);
    if (filter === 'projekty') return r.project;
    if (filter === 'zaciatocnici') return n < 6;
    if (filter === 'pokrocili') return n >= 6 && n < 7;
    if (filter === 'profesionali') return n >= 7;
    return true;
  });
  const prog = sektor.prelezeno / sektor.ciest;
  const complete = prog >= 1;

  const toggle = (set, setSet, num) => {
    const n = new Set(set);
    if (n.has(num)) n.delete(num); else n.add(num);
    setSet(n);
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('lokalita', { lokalita, region })} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            {lokalita.name}
          </div>
          <h1 className="text-[32px] font-extrabold leading-tight mt-1" style={{ color: 'var(--text)' }}>
            Sektor {sektor.name}
          </h1>
        </div>

        {/* Completion badge overlay */}
        {complete && (
          <div className="px-4 mt-3">
            <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <div className="w-11 h-11 rounded-full grid place-items-center text-[22px] shrink-0"
                style={{ background: 'rgba(255,255,255,0.18)' }}>
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-extrabold leading-tight">Sektor kompletný 🏆</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Zalez si všetky cesty v tomto sektore!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress card */}
        <div className="px-4 mt-3">
          <Card className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[26px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
                {sektor.prelezeno}/{sektor.ciest}
                <span className="text-[14px] font-bold ml-1.5" style={{ color: 'var(--text-dim)' }}>prelezených</span>
              </div>
              {complete ? (
                <div className="text-[13px] font-semibold mt-2 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                  <Icon name="checkCircle" size={13} stroke={2.4} /> Hotovo — všetko prelezené!
                </div>
              ) : (
                <div className="text-[13px] font-semibold mt-2 flex items-center gap-1.5" style={{ color: 'var(--red-deep)' }}>
                  <Icon name="flame" size={13} fill="currentColor" stroke={0} /> Pokračuj v lezení!
                </div>
              )}
            </div>
            <ProgressRing value={prog} size={66} stroke={6} />
          </Card>
        </div>

        {/* Filters */}
        <div className="mt-4 -mx-0">
          <div className="px-4 flex items-center gap-2 overflow-x-auto pb-1">
            <Chip active={filter === 'vsetky'} onClick={() => setFilter('vsetky')}>Všetky</Chip>
            <Chip active={filter === 'projekty'} onClick={() => setFilter('projekty')}>Projekty</Chip>
            <Chip active={filter === 'zaciatocnici'} onClick={() => setFilter('zaciatocnici')}>Začiatočníci</Chip>
            <Chip active={filter === 'pokrocili'} onClick={() => setFilter('pokrocili')}>Pokročilí</Chip>
            <Chip active={filter === 'profesionali'} onClick={() => setFilter('profesionali')}>Profesionáli</Chip>
          </div>
        </div>

        {/* Route list */}
        <div className="px-4 mt-3 space-y-2">
          {filtered.map(r => {
            const isExpanded = expanded === r.num;
            const isSent = sent.has(r.num);
            return (
              <Card key={r.num} padding={false}>
                <button onClick={() => setExpanded(isExpanded ? null : r.num)}
                  className="w-full flex items-center gap-3 p-3 text-left">
                  <NumDot n={r.num} color="var(--accent)" size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{r.name}</div>
                    {isExpanded && (
                      <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        Dĺžka {r.length} m · {r.bolts} expresiek
                      </div>
                    )}
                  </div>
                  <GradeBadge grade={r.grade} size="sm" />
                  {!isExpanded && (
                    <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 flex gap-2 items-center">
                    <button onClick={() => nav('route', { route: r, sektor, lokalita, region })}
                      className="flex-1 h-10 rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5"
                      style={{ background: 'var(--accent)', color: '#fff' }}>
                      Detail cesty
                    </button>
                    <button onClick={() => {
                      if (isSent) { toggle(sent, setSent, r.num); }
                      else { setSheetRoute(r); }
                    }}
                      className="w-10 h-10 rounded-full grid place-items-center"
                      style={{ background: isSent ? 'var(--green-soft)' : 'var(--bg-2)', color: isSent ? 'var(--accent)' : 'var(--text-faint)' }}>
                      <Icon name="check" size={16} stroke={2.6} />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />

      {/* Prelez picker — same flow as Detail cesty */}
      {sheetRoute && (
        <PrelezSheet
          onClose={() => setSheetRoute(null)}
          onDone={(type, note) => {
            const n = new Set(sent); n.add(sheetRoute.num); setSent(n);
            setSendTypes(prev => ({ ...prev, [sheetRoute.num]: type }));
            setSheetRoute(null);
          }}
        />
      )}
    </div>
  );
}

Object.assign(window, { LokalitaScreen, SektorScreen });
