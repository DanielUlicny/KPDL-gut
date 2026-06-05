// Screens: PROJEKTY + PROFIL
function ProjektyScreen({ nav }) {
  const [tab, setTab] = useState('aktivne');
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('home')} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[34px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            {tab === 'aktivne' ? `${PROJECTS.length} projekt čaká` : `${USER.sent} hotových ciest`}
          </h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>
            {tab === 'aktivne' ? 'Cesty, na ktorých momentálne pracuješ.' : 'Cesty, ktoré si už zalez.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-5 flex items-center gap-2">
          <Chip active={tab === 'aktivne'} onClick={() => setTab('aktivne')}>Aktívne · {PROJECTS.length}</Chip>
          <Chip active={tab === 'hotove'} onClick={() => setTab('hotove')}>Hotové · {USER.sent}</Chip>
        </div>

        {tab === 'hotove' ? (
          <div className="px-4 mt-4 space-y-2">
            {LOGBOOK.map((l, i) => (
              <Card key={i} className="flex items-center gap-3" padding={false}>
                <div className="flex items-center gap-3 p-3 w-full">
                  <div className="w-9 h-9 rounded-full grid place-items-center shrink-0"
                    style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                    <Icon name="check" size={16} stroke={2.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{l.route}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{l.sektor} · {l.when} · {l.style}</div>
                  </div>
                  <GradeBadge grade={l.grade} size="sm" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
        /* Project cards */
        <div className="px-4 mt-4 space-y-4">
          {PROJECTS.map((p, i) => (
            <Card key={i} padding={false}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <NumDot n="P" color="var(--amber)" size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[17px] font-extrabold" style={{ color: 'var(--text)' }}>{p.route}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      <span className="font-semibold">{p.grade}</span> · {p.length} m · {p.bolts} expresiek
                    </div>
                  </div>
                  <GradeBadge grade={p.grade} size="md" />
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Pill tone="softer" size="sm">{p.attempts} pokusov</Pill>
                  <Pill tone="soft" size="sm">{p.sector}</Pill>
                  <Pill tone="softer" size="sm">{p.lokalita}</Pill>
                </div>

                {/* Attempt track */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>Pokusy</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-faint)' }}>0 / 5+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-2)' }} />
                    ))}
                  </div>
                </div>

                <button onClick={() => nav('route', { route: ROUTES_LOM_A[1], sektor: SEKTORY['tatranska-kotlina'][0], lokalita: LOKALITY.PK[0], region: REGIONS[4] })}
                  className="mt-4 h-11 px-5 rounded-full text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  Otvoriť projekt <Icon name="arrowRight" size={13} />
                </button>
              </div>

              {/* Notes section */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl"
                  style={{ background: 'var(--bg-2)', border: '1px dashed var(--border-2)' }}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1.5"
                    style={{ color: 'var(--text-faint)' }}>
                    <Icon name="edit" size={11} stroke={2.2} /> Poznámky k projektom
                  </div>
                  <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    {p.notes}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>

      <BottomNav active="projekty" onNav={nav} />
    </div>
  );
}

function ProfilScreen({ nav }) {
  const [units, setUnits] = useState('m');
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="px-5 pt-3 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full grid place-items-center text-[28px] font-extrabold shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            D
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
                {USER.name}
              </h1>
              <button onClick={() => nav('editProfile')}
                className="h-8 px-3.5 rounded-full text-[12px] font-bold active:scale-[0.97] transition"
                style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                Upraviť
              </button>
            </div>
            <div className="text-[12.5px] mt-1" style={{ color: 'var(--text-dim)' }}>
              {USER.handle}
            </div>
            <div className="mt-2">
              <Pill tone="soft" size="sm" icon="star">Najťažšia cesta 6+</Pill>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 mt-5 grid grid-cols-3 gap-2">
          <Card>
            <div className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>{USER.sent}</div>
            <div className="text-[11px] mt-1.5" style={{ color: 'var(--text-dim)' }}>Vylezených ciest</div>
          </Card>
          <Card>
            <div className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--text)' }}>
              {USER.totalLen}<span className="text-[14px] font-bold ml-0.5">m</span>
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: 'var(--text-dim)' }}>Celková dĺžka</div>
          </Card>
          <Card>
            <div className="text-[24px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>{USER.best}</div>
            <div className="text-[11px] mt-1.5" style={{ color: 'var(--text-dim)' }}>Najťažšia</div>
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
            <div className="flex-1">
              <div className="text-[14px] font-bold" style={{ color: 'var(--accent-deep)' }}>Máš 1 aktívne</div>
              <div className="text-[12px]" style={{ color: 'var(--text-dim)' }}>Brucho sprava · 6 · Lom A</div>
            </div>
            <span className="text-[13px] font-bold flex items-center gap-1" style={{ color: 'var(--accent-deep)' }}>
              Prejsť na Projekty <Icon name="arrowRight" size={14} />
            </span>
          </button>
        </div>

        {/* Badges */}
        <div className="px-4 mt-5">
          <SectionLabel right={<span>{BADGES.filter(b => b.earned).length} z {BADGES.length}</span>}>Odznaky</SectionLabel>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {BADGES.map(b => (
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
                <div className="text-[11px] font-bold leading-tight" style={{ color: b.earned ? 'var(--text)' : 'var(--text-faint)' }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pyramid */}
        <div className="px-4 mt-5">
          <SectionLabel right={<span>posledných 90 dní</span>}>Pyramída obtiažnosti</SectionLabel>
          <Card className="mt-2">
            <div className="space-y-1.5">
              {[
                { g: '7+', c: 0 }, { g: '7', c: 0 }, { g: '6+', c: 2 },
                { g: '6', c: 8 }, { g: '5+', c: 14 }, { g: '5', c: 18 }, { g: '4+', c: 5 },
              ].map((row, i) => {
                const max = 20;
                const pct = (row.c / max) * 100;
                const n = parseFloat(row.g);
                const color = n >= 7 ? 'var(--red)' : n >= 6.5 ? 'var(--amber)' : 'var(--accent)';
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
          </Card>
        </div>

        {/* Menu - logbook & visited */}
        <div className="px-4 mt-5 space-y-2">
          {[
            { icon: 'clipboard', label: 'Vylezené cesty', sub: 'Otvoriť logbook · filtre podľa obtiažnosti', badge: String(USER.sent), go: 'logbook' },
            { icon: 'map', label: 'Navštívené lokality', sub: `${VISITED.length} lokalít s prelezmi`, badge: null, go: 'visited' },
          ].map((m, i) => (
            <Card key={i} className="flex items-center gap-3" hover onClick={() => nav(m.go)}>
              <div className="w-9 h-9 rounded-full grid place-items-center shrink-0"
                style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name={m.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{m.label}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{m.sub}</div>
              </div>
              {m.badge && (
                <span className="text-[11px] font-bold px-2 h-6 inline-flex items-center rounded-full"
                  style={{ background: 'var(--bg-2)', color: 'var(--text-dim)' }}>{m.badge}</span>
              )}
              <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
            </Card>
          ))}
        </div>

        {/* Settings */}
        <div className="px-4 mt-5">
          <SectionLabel>Nastavenia</SectionLabel>
          <div className="mt-2 space-y-2">
            {/* Notifikácie */}
            <Card className="flex items-center gap-3" padding={false}>
              <div className="flex items-center gap-3 p-3 w-full">
                <Icon name="bell" size={17} stroke={2} style={{ color: 'var(--text-dim)' }} />
                <span className="flex-1 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Notifikácie</span>
                <span className="text-[12px] font-semibold" style={{ color: 'var(--text-faint)' }}>Zapnuté</span>
                <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
              </div>
            </Card>

            {/* Jednotky — toggle */}
            <Card className="flex items-center gap-3" padding={false}>
              <div className="flex items-center gap-3 p-3 w-full">
                <Icon name="compass" size={17} stroke={2} style={{ color: 'var(--text-dim)' }} />
                <span className="flex-1 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Jednotky</span>
                <div className="inline-flex p-0.5 rounded-full" style={{ background: 'var(--bg-2)' }}>
                  {[
                    { id: 'm', label: 'Metrické' },
                    { id: 'ft', label: 'Imperiálne (ft)' },
                  ].map(o => (
                    <button key={o.id} onClick={() => setUnits(o.id)}
                      className="h-7 px-3 rounded-full text-[11.5px] font-bold transition-colors"
                      style={units === o.id
                        ? { background: 'var(--accent)', color: '#fff' }
                        : { background: 'transparent', color: 'var(--text-dim)' }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Odhlásenie */}
            <Card className="flex items-center gap-3" padding={false}>
              <div className="flex items-center gap-3 p-3 w-full">
                <Icon name="logout" size={17} stroke={2} style={{ color: 'var(--red)' }} />
                <span className="flex-1 text-[14px] font-semibold" style={{ color: 'var(--red-deep)' }}>Odhlásenie</span>
                <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
              </div>
            </Card>
          </div>
        </div>

        <div className="px-5 mt-6 mb-2 text-center text-[11px] font-semibold"
          style={{ color: 'var(--text-faint)' }}>
          KPDL · v0.1.0 · Made for Slovensko 🇸🇰
        </div>
      </div>

      <BottomNav active="profil" onNav={nav} />
    </div>
  );
}

// Logbook — all logged ascents (expandable rows)
function LogbookScreen({ nav }) {
  const [filter, setFilter] = useState('vsetky');
  const [openIdx, setOpenIdx] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [notes, setNotes] = useState(() => LOGBOOK.map(l => l.note || ''));

  const list = LOGBOOK
    .map((l, i) => ({ ...l, _i: i }))
    .filter(l => {
      const n = parseFloat(l.grade);
      if (filter === 'zaciatocnici') return n < 6;
      if (filter === 'pokrocili') return n >= 6 && n < 7;
      if (filter === 'profesionali') return n >= 7;
      return true;
    });

  const openRoute = (l) => {
    const route = ROUTES_LOM_A.find(r => r.name === l.route) || ROUTES_LOM_A[0];
    nav('route', { route, sektor: SEKTORY['tatranska-kotlina'][0], lokalita: LOKALITY.PK[0], region: REGIONS[4] });
  };

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('profil')} />
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[32px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>Logbook</h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>{USER.sent} vylezených ciest · ťukni pre detail.</p>
        </div>
        <div className="px-4 mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <Chip active={filter === 'vsetky'} onClick={() => setFilter('vsetky')}>Všetky</Chip>
          <Chip active={filter === 'zaciatocnici'} onClick={() => setFilter('zaciatocnici')}>Začiatočníci</Chip>
          <Chip active={filter === 'pokrocili'} onClick={() => setFilter('pokrocili')}>Pokročilí</Chip>
          <Chip active={filter === 'profesionali'} onClick={() => setFilter('profesionali')}>Profesionáli</Chip>
        </div>
        <div className="px-4 mt-3 space-y-2">
          {list.map((l) => {
            const isFlash = l.style === 'flash' || l.style === 'onsight';
            const open = openIdx === l._i;
            const note = notes[l._i];
            return (
              <Card key={l._i} padding={false} className="overflow-hidden">
                {/* Row (tap to expand) */}
                <button onClick={() => setOpenIdx(open ? null : l._i)}
                  className="w-full flex items-center gap-3 p-3 text-left">
                  <div className="w-9 h-9 rounded-full grid place-items-center shrink-0"
                    style={{ background: isFlash ? 'var(--amber-soft)' : 'var(--green-soft)', color: isFlash ? 'var(--amber-deep)' : 'var(--accent-deep)' }}>
                    <Icon name={isFlash ? 'bolt' : 'check'} size={16} stroke={2.4} fill={isFlash ? 'currentColor' : 'none'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{l.route}</div>
                    <div className="text-[11.5px] mt-0.5 truncate" style={{ color: 'var(--text-dim)' }}>{l.lokalita} · {l.sektor} · {l.when}</div>
                  </div>
                  {note && !open && (
                    <Icon name="edit" size={13} stroke={2.2} style={{ color: 'var(--text-faint)' }} />
                  )}
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{l.style}</span>
                  <GradeBadge grade={l.grade} size="sm" />
                  <Icon name="chevronDown" size={16}
                    style={{ color: 'var(--text-faint)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Expanded panel */}
                {open && (
                  <div className="px-3 pb-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Note */}
                    <div className="mt-3 p-3 rounded-xl"
                      style={{ background: 'var(--bg-2)', border: '1px dashed var(--border-2)' }}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5"
                        style={{ color: 'var(--text-faint)' }}>
                        <Icon name="edit" size={11} stroke={2.2} /> Poznámka</div>
                      {note
                        ? <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text)' }}>{note}</p>
                        : <p className="text-[12.5px] italic" style={{ color: 'var(--text-faint)' }}>Zatiaľ žiadna poznámka — ťukni „Upraviť" a niečo si zapíš.</p>}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button onClick={() => setEditIdx(l._i)}
                        className="h-11 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                        style={{ background: 'transparent', border: '1.5px solid var(--border-2)', color: 'var(--text)' }}>
                        <Icon name="edit" size={14} stroke={2.2} /> {note ? 'Upraviť' : 'Pridať'} pozn.
                      </button>
                      <button onClick={() => openRoute(l)}
                        className="h-11 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                        style={{ background: 'var(--accent)', color: '#fff' }}>
                        Detail cesty <Icon name="arrowRight" size={14} stroke={2.4} /></button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav active="profil" onNav={nav} />

      {/* Edit note sheet */}
      {editIdx !== null && (
        <NoteSheet
          title="Upraviť poznámku"
          subtitle={LOGBOOK[editIdx].route}
          placeholder="Aké si mal problémy? Čo si skúšal..."
          initial={notes[editIdx]}
          secondaryLabel="Zrušiť"
          primaryLabel="Uložiť"
          onClose={() => setEditIdx(null)}
          onSecondary={() => setEditIdx(null)}
          onPrimary={(text) => { setNotes(ns => ns.map((n, i) => i === editIdx ? text : n)); setEditIdx(null); }}
        />
      )}
    </div>
  );
}

// Visited localities — places with logged ascents
function VisitedScreen({ nav }) {
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('profil')} />
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[32px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>Navštívené lokality</h1>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-dim)' }}>Miesta, kde máš zaznamenané prelezy.</p>
        </div>
        <div className="px-4 mt-4 space-y-2">
          {VISITED.map((v, i) => (
            <Card key={i} className="flex items-center gap-3" hover
              onClick={() => nav('lokalita', { lokalita: LOKALITY.PK[0], region: REGIONS[4] })}>
              <div className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
                style={{ background: 'var(--green-soft)', color: 'var(--accent-deep)' }}>
                <Icon name="mountain" size={20} stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-[15px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{v.name}</div>
                  {v.complete && <span className="text-[12px]">🏆</span>}
                </div>
                <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{v.region} · posledný · {v.lastVisit}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[18px] font-extrabold leading-none" style={{ color: 'var(--accent)' }}>{v.ascents}</div>
                <div className="text-[10px] font-semibold" style={{ color: 'var(--text-faint)' }}>prelezov</div>
              </div>
              <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
            </Card>
          ))}
        </div>
      </div>
      <BottomNav active="profil" onNav={nav} />
    </div>
  );
}

Object.assign(window, { ProjektyScreen, ProfilScreen, LogbookScreen, VisitedScreen });
