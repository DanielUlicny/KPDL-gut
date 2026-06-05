// Screens 1: HOME (Domov)
function HomeScreen({ nav }) {
  const next = ROUTES_LOM_A[1]; // Brucho sprava = active project
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero with illustration */}
        <div className="relative mx-4 mt-3 rounded-3xl overflow-hidden" style={{ height: 440 }}>
          <img src="assets/climber.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 44%' }} />
          {/* gradient overlay for legibility */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)' }} />

          {/* title */}
          <div className="absolute top-6 left-5 right-5">
            <h1 className="display-condensed uppercase leading-[0.86]"
              style={{ fontSize: 56, color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.35)' }}>
              Kam pojdeš<br/><span style={{ display: 'inline-block', marginTop: '0.1em' }}>dnes liezť?</span>
            </h1>
          </div>

          {/* floating "next session" card */}
          <button onClick={() => nav('route', { route: next, sektor: SEKTORY['tatranska-kotlina'][0], lokalita: LOKALITY.PK[0], region: REGIONS[4] })}
            className="absolute bottom-4 left-4 right-4 rounded-2xl p-3.5 text-left transition hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-3">
              <NumDot n="P" color="var(--amber)" size={42} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--amber-deep)' }}>Tvoj projekt</div>
                <div className="text-[15px] font-bold mt-0.5" style={{ color: 'var(--text)' }}>{next.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Tatranská Kotlina · Lom A · 12 km</div>
              </div>
              <GradeBadge grade={next.grade} size="md" />
            </div>
          </button>
        </div>

        {/* Nearby cards */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>3 v okolí</span>}>V blízkosti</SectionLabel>
          <div className="mt-3 flex gap-3 overflow-x-auto -mx-4 px-4 pb-2">
            {[
              { name: 'Tatranská Kotlina', km: '12 km', grade: '4–7', n: 30, ar: true },
              { name: 'Zádielska tieseň', km: '47 km', grade: '5–9', n: 142, ar: false },
              { name: 'Skalka pri Kremnici', km: '63 km', grade: '4–6', n: 38, ar: false },
            ].map((c, i) => (
              <button key={i} onClick={() => nav('lokalita', { lokalita: LOKALITY.PK[0], region: REGIONS[4] })}
                className="shrink-0 w-[180px] text-left rounded-2xl overflow-hidden transition hover:-translate-y-0.5"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="h-[90px] relative" style={{ background: i === 0 ? 'linear-gradient(135deg, #4a7a5e, #2a5840)' : i === 1 ? 'linear-gradient(135deg, #a87544, #6b4523)' : 'linear-gradient(135deg, #5d8d6f, #3a6a4b)' }}>
                  <svg viewBox="0 0 180 90" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <polyline points="0,75 30,40 60,55 100,30 140,50 180,35 180,90 0,90" fill="rgba(0,0,0,0.25)" />
                  </svg>
                  {c.ar && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 h-5 px-1.5 rounded-md text-[9px] font-bold uppercase"
                      style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--amber-deep)' }}>
                      <Icon name="cube" size={10} /> AR
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[12px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{c.name}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{c.km} · {c.grade}</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{c.n} c.</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats card */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>Tento týždeň</span>}>Pokračuj v lezení</SectionLabel>
          <Card className="mt-3" padding={false}>
            <div className="p-4 grid grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>{USER.thisWeek}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Sessiony</div>
              </div>
              <div className="flex flex-col items-start" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                <div className="flex items-baseline gap-1">
                  <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>{USER.streak}</div>
                  <Icon name="flame" size={14} style={{ color: 'var(--amber)' }} fill="currentColor" />
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Streak (dní)</div>
              </div>
              <div className="flex flex-col items-start" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
                <div className="text-[28px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>6+</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>Najťažšia</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent prelez */}
        <div className="px-4 mt-6">
          <SectionLabel right={<button onClick={() => nav('profil')} className="font-semibold" style={{ color: 'var(--accent)' }}>Logbook →</button>}>Posledný prelez</SectionLabel>
          <Card className="mt-3 flex items-center gap-3" hover>
            <NumDot n={10} color="var(--accent)" size={40} />
            <div className="flex-1">
              <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Pavúk</div>
              <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Lom A · pred 2 dňami · flash</div>
            </div>
            <GradeBadge grade="6+" size="md" />
          </Card>
        </div>
      </div>

      <BottomNav active="home" onNav={nav} />
    </div>
  );
}

window.HomeScreen = HomeScreen;
