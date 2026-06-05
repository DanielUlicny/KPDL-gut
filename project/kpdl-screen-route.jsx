// Screens: ROUTE detail + AR overlay

function RouteScreen({ nav, route, sektor, lokalita, region }) {
  const [arOpen, setArOpen] = useState(false);
  const [sent, setSent] = useState(route.sent);
  const [sendType, setSendType] = useState(route.sent ? 'flash' : null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inProject, setInProject] = useState(route.project);
  const r = route;

  const wp = useMemo(() => {
    const n = r.bolts;
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = 200 + Math.sin(t * Math.PI * 1.4 + 1) * 24;
      const y = 35 + t * 230;
      out.push({ x, y });
    }
    return out;
  }, [r.bolts]);

  if (arOpen) return <ARScreen onClose={() => setArOpen(false)} route={r} lokalita={lokalita} sektor={sektor} />;

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('sektor', { sektor, lokalita, region })} />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Topo image */}
        <div className="relative mx-4 mt-3 rounded-3xl overflow-hidden" style={{ height: 300, background: 'linear-gradient(180deg, #1a2520 0%, #0a1410 100%)' }}>
          <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="rock1" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 25 Q12 22 25 26 T50 25" stroke="#1f2a24" strokeWidth="0.5" fill="none" />
                <path d="M25 0 Q28 12 22 25 T25 50" stroke="#1f2a24" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#rock1)" />
            {/* mountain silhouette hint */}
            <path d="M50 290 L200 70 L350 290 Z" fill="none" stroke="rgba(80,120,90,0.15)" strokeWidth="1" />
            {/* Route line */}
            <path d={`M${wp[0].x},${wp[0].y - 15} ` + wp.map(p => `L${p.x},${p.y}`).join(' ') + ` L${wp[wp.length-1].x},${wp[wp.length-1].y + 10}`}
              stroke="#7bbf91" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
            {/* bolts */}
            {wp.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#0a1410" stroke="#fff" strokeWidth="1.6" />
                <circle cx={p.x} cy={p.y} r="1.6" fill="#fff" />
              </g>
            ))}
            {/* top anchor */}
            <circle cx={wp[0].x} cy={wp[0].y - 15} r="8" fill="#7bbf91" />
            <path d={`M${wp[0].x - 4},${wp[0].y - 19} L${wp[0].x + 4},${wp[0].y - 19}`} stroke="#0a1410" strokeWidth="2" />
            {/* start */}
            <circle cx={wp[wp.length-1].x} cy={wp[wp.length-1].y + 10} r="6" fill="#fff" />
          </svg>

          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.7) 100%)' }} />

          <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#a7d4b3' }}>
                {lokalita.name} · {sektor.name}
              </div>
              <h1 className="display-condensed uppercase leading-[0.9] mt-1"
                style={{ fontSize: 32, color: '#fff' }}>
                {r.name}
              </h1>
            </div>
            <GradeBadge grade={r.grade} size="lg" />
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 mt-4 flex items-center gap-2 flex-wrap">
          <Pill tone="softer" size="sm">{r.style}</Pill>
          <Pill tone="softer" size="sm">Šport</Pill>
          <Pill tone="amber" size="sm" icon="cube">AR dostupné</Pill>
        </div>

        {/* Topo description card */}
        <div className="px-4 mt-4">
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full grid place-items-center shrink-0"
                style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name="map" size={16} />
              </div>
              <div>
                <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Topo náhľad</div>
                <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  Fotka ukazuje smer cesty, nástup aj dolezanie.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* AR card */}
        <div className="px-4 mt-2.5">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                style={{ background: 'var(--amber-soft)', color: 'var(--amber-deep)' }}>
                <Icon name="cube" size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold leading-tight" style={{ color: 'var(--text)' }}>AR dostupné</div>
                <p className="text-[12px] mt-0.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
                  Otvor kameru a zarovnaj cestu cez značku lokality.
                </p>
              </div>
              <button onClick={() => setArOpen(true)}
                className="h-10 px-4 rounded-full text-[12.5px] font-bold shrink-0 self-center"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                Otvoriť AR
              </button>
            </div>
          </Card>
        </div>

        {/* Specs grid */}
        <div className="px-4 mt-4 grid grid-cols-3 gap-2">
          {[
            { v: r.length, u: 'm', l: 'Dĺžka' },
            { v: r.bolts, u: 'ks', l: 'Expresky' },
            { v: r.style.split(',')[0], u: '', l: 'Štýl' },
          ].map((s, i) => (
            <Card key={i}>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-extrabold" style={{ color: 'var(--text)' }}>{s.v}</span>
                {s.u && <span className="text-[12px] font-semibold" style={{ color: 'var(--text-dim)' }}>{s.u}</span>}
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-faint)' }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Beta */}
        {r.beta && (
          <div className="px-4 mt-4">
            <SectionLabel>Beta</SectionLabel>
            <Card className="mt-2">
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
                {r.beta}
              </p>
            </Card>
          </div>
        )}

        {/* Action row — Projekt + Prelezené */}
        <div className="px-4 mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => setInProject(v => !v)}
            className="h-12 rounded-full flex items-center justify-center gap-1.5 text-[12.5px] font-bold px-2"
            style={inProject
              ? { background: 'var(--accent)', color: '#fff' }
              : { background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
            <Icon name={inProject ? 'check' : 'clipboard'} size={15} stroke={2.4} />
            {inProject ? 'V projektoch' : 'Pridať do projektov'}
          </button>
          <button onClick={() => { if (sent) { setSent(false); setSendType(null); } else { setSheetOpen(true); } }}
            className="h-12 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-bold"
            style={sent
              ? { background: 'var(--accent)', color: '#fff' }
              : { background: 'var(--card)', border: '1.5px solid var(--green-soft)', color: 'var(--accent)' }}>
            <Icon name="check" size={15} stroke={2.6} />
            {sent ? `Prelezené · ${sendType}` : 'Označiť prelez'}
          </button>
        </div>

        {/* Recent ascents */}
        <div className="px-4 mt-6">
          <SectionLabel right={<span>12 záznamov</span>}>Posledné prelezy</SectionLabel>
          <div className="mt-2.5 space-y-2">
            {[
              { name: 'Marek H.', when: 'pred 2 dňami', tries: 'flash' },
              { name: 'Eva K.', when: 'pred 5 dňami', tries: '3. pokus' },
              { name: 'Daniel', when: 'pred týždňom', tries: '2. pokus' },
            ].map((a, i) => (
              <Card key={i} className="flex items-center gap-3" padding={false}>
                <button onClick={() => nav('publicProfile', { person: a })}
                  className="flex items-center gap-3 p-2.5 w-full text-left active:scale-[0.99] transition-transform">
                  <div className="w-9 h-9 rounded-full grid place-items-center font-bold text-[13px]"
                    style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                    {a.name[0]}
                  </div>
                  <span className="text-[13px] flex-1 font-semibold" style={{ color: 'var(--text)' }}>{a.name}</span>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{a.tries}</span>
                  <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>{a.when}</span>
                  <Icon name="chevronRight" size={15} style={{ color: 'var(--text-faint)' }} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />

      {/* Prelez selection sheet → note */}
      {sheetOpen && (
        <PrelezSheet
          onClose={() => setSheetOpen(false)}
          onDone={(type, note) => { setSendType(type); setSent(true); setSheetOpen(false); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Prelez sheet — 2 steps: pick send style → optional note
// ─────────────────────────────────────────────────────────────
const PRELEZ_OPTIONS = [
  { id: 'onsight',    title: 'Onsight',    desc: 'Na prvý pokus, bez akýchkoľvek info', icon: 'bolt',  tone: 'amber' },
  { id: 'flash',      title: 'Flash',      desc: 'Na prvý pokus, s betou / informáciami', icon: 'bolt',  tone: 'amber' },
  { id: '2. pokus',   title: '2. pokus',   desc: null, icon: 'check', tone: 'soft' },
  { id: '3. pokus',   title: '3. pokus',   desc: null, icon: 'check', tone: 'soft' },
  { id: '4. pokus',   title: '4. pokus',   desc: null, icon: 'check', tone: 'soft' },
  { id: '5+ pokusov', title: '5+ pokusov', desc: 'Pracoval/a som na nej dlhšie', icon: 'check', tone: 'soft' },
];

function PrelezSheet({ onClose, onDone }) {
  const [step, setStep] = useState(1);
  const [pick, setPick] = useState(null);

  if (step === 2) {
    const opt = PRELEZ_OPTIONS.find(o => o.id === pick);
    return (
      <NoteSheet
        title="Poznámka k výlezu"
        subtitle="Voliteľné"
        placeholder="Aké si mal problémy? Čo si skúšal..."
        secondaryLabel="Preskočiť"
        primaryLabel="Uložiť"
        context={opt}
        onClose={onClose}
        onBack={() => setStep(1)}
        onSecondary={() => onDone(pick, '')}
        onPrimary={(text) => onDone(pick, text)}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="rounded-t-3xl px-5 pt-3 pb-8"
        style={{ background: 'var(--card)' }} onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border-2)' }} />
        <div className="flex items-center justify-between mb-4">
          <div className="text-[20px] font-extrabold whitespace-nowrap" style={{ color: 'var(--text)' }}>Ako si to preliezol?</div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full"
            style={{ background: 'var(--bg-2)', color: 'var(--text-dim)' }}>
            <Icon name="x" size={16} stroke={2.4} />
          </button>
        </div>
        <div className="space-y-1.5">
          {PRELEZ_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { setPick(o.id); setStep(2); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-colors active:scale-[0.99]"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                style={o.tone === 'amber'
                  ? { background: 'var(--amber-soft)', color: 'var(--amber-deep)' }
                  : { background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name={o.icon} size={18} stroke={2.4}
                  fill={o.tone === 'amber' ? 'currentColor' : 'none'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{o.title}</div>
                {o.desc && <div className="text-[12px] mt-0.5 leading-snug" style={{ color: 'var(--text-dim)' }}>{o.desc}</div>}
              </div>
              <Icon name="chevronRight" size={17} style={{ color: 'var(--text-faint)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NoteSheet — multiline note input over an iOS keyboard.
// Reused for: prelez step 2, and editing a logbook note.
// ─────────────────────────────────────────────────────────────
function NoteSheet({
  title, subtitle, placeholder, initial = '', context = null,
  secondaryLabel, primaryLabel, onClose, onBack, onSecondary, onPrimary,
}) {
  const [text, setText] = useState(initial);
  const ref = useRef(null);
  const dark = document.documentElement.dataset.dark === 'true';

  useEffect(() => {
    const t = setTimeout(() => { try { ref.current?.focus(); } catch (e) {} }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="rounded-t-3xl flex flex-col overflow-hidden"
        style={{ background: 'var(--card)' }} onClick={(e) => e.stopPropagation()}>
        <div className="px-5 pt-3 pb-3">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border-2)' }} />

          <div className="flex items-center gap-2 mb-3">
            {onBack && (
              <button onClick={onBack} className="w-9 h-9 grid place-items-center rounded-full shrink-0 -ml-1"
                style={{ background: 'var(--bg-2)', color: 'var(--text-dim)' }}>
                <Icon name="arrowLeft" size={17} stroke={2.4} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[19px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{title}</div>
              {subtitle && <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{subtitle}</div>}
            </div>
            {context && (
              <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-bold shrink-0"
                style={context.tone === 'amber'
                  ? { background: 'var(--amber-soft)', color: 'var(--amber-deep)' }
                  : { background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name={context.icon} size={13} stroke={2.4} fill={context.tone === 'amber' ? 'currentColor' : 'none'} />
                {context.title}
              </span>
            )}
            <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full shrink-0"
              style={{ background: 'var(--bg-2)', color: 'var(--text-dim)' }}>
              <Icon name="x" size={16} stroke={2.4} />
            </button>
          </div>

          <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)}
            rows={3} placeholder={placeholder}
            className="w-full rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed resize-none outline-none"
            style={{
              background: 'var(--bg-2)', border: '1.5px solid var(--border)',
              color: 'var(--text)', minHeight: 104, caretColor: 'var(--accent)',
            }} />

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={onSecondary}
              className="h-12 rounded-full text-[14px] font-bold transition-colors"
              style={{ background: 'transparent', border: '1.5px solid var(--border-2)', color: 'var(--text)' }}>
              {secondaryLabel}
            </button>
            <button onClick={() => onPrimary(text)}
              className="h-12 rounded-full text-[14px] font-bold flex items-center justify-center gap-1.5"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <Icon name="check" size={15} stroke={2.6} /> {primaryLabel}
            </button>
          </div>
        </div>

        {/* keyboard tray */}
        <div style={{ background: 'var(--bg-2)' }}>
          <IOSKeyboard dark={dark} />
        </div>
      </div>
    </div>
  );
}

// AR camera overlay
function ARScreen({ onClose, route, lokalita, sektor }) {
  const wp = useMemo(() => {
    const n = route.bolts;
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = 200 + Math.sin(t * Math.PI * 1.4 + 1) * 22;
      const y = 80 + t * 380;
      out.push({ x, y });
    }
    return out;
  }, [route.bolts]);

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#000' }}>
      {/* Faux camera feed */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #3a3528 0%, #0d0a05 75%, #000 100%)',
      }}>
        <svg viewBox="0 0 400 740" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="ar-rock" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 Q15 25 30 30 T60 30" stroke="rgba(255,255,255,0.04)" fill="none" />
              <path d="M30 0 Q35 15 25 30 T30 60" stroke="rgba(255,255,255,0.04)" fill="none" />
              <circle cx="20" cy="15" r="1" fill="rgba(255,255,255,0.03)" />
            </pattern>
          </defs>
          <rect width="400" height="740" fill="url(#ar-rock)" />
          {/* lower shadow */}
          <path d="M0 100 L60 80 L100 60 L160 50 L200 30 L260 50 L300 60 L340 75 L400 95 L400 740 L0 740 Z"
            fill="rgba(0,0,0,0.5)" />
        </svg>
      </div>

      {/* AR projected route */}
      <svg viewBox="0 0 400 740" className="absolute inset-0 w-full h-full pointer-events-none">
        <path d={`M${wp[0].x},${wp[0].y - 25} ` + wp.map(p => `L${p.x},${p.y}`).join(' ') + ` L${wp[wp.length-1].x},${wp[wp.length-1].y + 20}`}
          stroke="#7bbf91" strokeWidth="3" strokeDasharray="9 5" fill="none" opacity="0.95">
          <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="0.8s" repeatCount="indefinite" />
        </path>
        {wp.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="14" fill="rgba(123,191,145,0.18)" />
            <circle cx={p.x} cy={p.y} r="6" fill="#0a1410" stroke="#7bbf91" strokeWidth="2" />
            <text x={p.x + 16} y={p.y + 4} fill="#7bbf91" fontSize="11" fontWeight="700">{i + 1}</text>
          </g>
        ))}
        {/* labels */}
        <g>
          <rect x={wp[0].x - 40} y={wp[0].y - 55} width="80" height="22" rx="11" fill="#7bbf91" />
          <text x={wp[0].x} y={wp[0].y - 40} textAnchor="middle" fill="#0a1410" fontSize="11" fontWeight="800">DOLEZANIE</text>
        </g>
        <g>
          <rect x={wp[wp.length-1].x - 30} y={wp[wp.length-1].y + 35} width="60" height="22" rx="11" fill="#fff" />
          <text x={wp[wp.length-1].x} y={wp[wp.length-1].y + 50} textAnchor="middle" fill="#0a1410" fontSize="11" fontWeight="800">ŠTART</text>
        </g>
      </svg>

      {/* HUD top */}
      <div className="relative z-10 flex items-center justify-between px-4" style={{ paddingTop: 58 }}>
        <button onClick={onClose} className="w-11 h-11 rounded-full grid place-items-center backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          <Icon name="x" size={20} stroke={2.4} />
        </button>
        <div className="px-3.5 h-11 rounded-full flex items-center gap-2 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#7bbf91' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Zarovnávam stenu</span>
        </div>
        <button className="w-11 h-11 rounded-full grid place-items-center backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
          <Icon name="layers" size={20} />
        </button>
      </div>

      {/* corner crosshairs */}
      <div className="absolute inset-x-10 top-32 bottom-44 pointer-events-none">
        {[
          'top-0 left-0 border-t-2 border-l-2',
          'top-0 right-0 border-t-2 border-r-2',
          'bottom-0 left-0 border-b-2 border-l-2',
          'bottom-0 right-0 border-b-2 border-r-2',
        ].map((c, i) => <div key={i} className={`absolute w-7 h-7 ${c}`} style={{ borderColor: 'rgba(123,191,145,0.7)' }} />)}
      </div>

      {/* bottom card */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-8">
        <div className="rounded-2xl p-4 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.96)' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
                {lokalita.name} · {sektor.name}
              </div>
              <div className="text-[20px] font-extrabold leading-tight mt-1" style={{ color: 'var(--text)' }}>
                {route.name}
              </div>
              <div className="flex items-center gap-2.5 mt-1.5 text-[12px]" style={{ color: 'var(--text-dim)' }}>
                <span className="font-semibold">{route.length} m</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span className="font-semibold">{route.bolts} expresiek</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span className="font-semibold">{route.style}</span>
              </div>
            </div>
            <GradeBadge grade={route.grade} size="lg" />
          </div>
          <div className="mt-3 pt-3 flex items-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex-1 flex items-center gap-2">
              <Icon name="checkCircle" size={16} style={{ color: 'var(--accent)' }} />
              <span className="text-[11.5px] font-semibold" style={{ color: 'var(--accent-deep)' }}>
                Značka rozpoznaná · 96%
              </span>
            </div>
            <button className="h-9 px-4 rounded-full text-[12px] font-bold flex items-center gap-1.5"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <Icon name="camera" size={13} stroke={2.4} /> Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RouteScreen, ARScreen, PrelezSheet, NoteSheet });
