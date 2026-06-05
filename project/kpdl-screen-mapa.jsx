// Screens: MAPA + REGION DETAIL
function MapaScreen({ nav }) {
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
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
              Slovensko
            </div>
            <h2 className="display-condensed uppercase text-white leading-[0.92] mt-1.5"
              style={{ fontSize: 30 }}>
              74 lokalít<br/>naprieč 8 krajmi
            </h2>

            <div className="flex items-stretch gap-5 mt-4">
              {[['2 488', 'ciest'], ['219', 'sektorov'], ['12', 's AR']].map(([v, l], i) => (
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
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text-faint)' }}>podľa aktivity</span>
        </div>

        {/* Region list */}
        <div className="px-4 space-y-2.5">
          {REGIONS.map(r => (
            <Card key={r.code + r.name} onClick={() => nav('region', { region: r })}
              className="flex items-center gap-3" hover>
              <RegionAvatar code={r.code} color={r.color} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{r.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {r.lokalit} lokalít · {r.ciest} ciest
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

function RegionScreen({ nav, region }) {
  const lokality = LOKALITY[region.code] || LOKALITY.PK;
  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <TopBar canBack onBack={() => nav('mapa')} />

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-5 pt-3">
          <h1 className="text-[34px] font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            <span>{region.name.replace(' kraj', '')}</span>{' '}
            <span style={{ color: 'var(--text-faint)', fontSize: '0.7em', fontWeight: 700 }}>kraj</span>
          </h1>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Pill size="md">{region.lokalit} lokalít</Pill>
            <Pill size="md">{region.sektorov} sektorov</Pill>
            <Pill size="md">{region.ciest} ciest</Pill>
          </div>
        </div>

        {/* Filters — horizontally scrollable */}
        <div className="mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 px-4 w-max">
            <Chip active>Všetky</Chip>
            <Chip icon="cube">AR dostupné</Chip>
            <Chip>Začiatočníci</Chip>
            <Chip>Pokročilí</Chip>
            <Chip>Profesionáli</Chip>
          </div>
        </div>

        {/* Locality cards */}
        <div className="px-4 mt-4 space-y-3">
          {lokality.map(l => (
            <Card key={l.id} onClick={() => nav('lokalita', { lokalita: l, region })} padding={false} hover>
              <div className="flex">
                <div className="w-[110px] h-[110px] shrink-0 relative overflow-hidden rounded-l-2xl"
                  style={{ background: 'linear-gradient(135deg, #1a2e1f 0%, #0a1410 100%)' }}>
                  <svg viewBox="0 0 110 110" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {/* stars */}
                    {Array.from({ length: 14 }).map((_, i) => {
                      const x = (i * 17) % 110, y = (i * 11) % 50;
                      return <circle key={i} cx={x} cy={y} r="0.6" fill="#fff" opacity="0.5" />;
                    })}
                    <path d="M0 90 L20 60 L40 70 L60 45 L80 65 L110 50 L110 110 L0 110 Z" fill="#0a1410" stroke="rgba(60,90,70,0.5)" strokeWidth="0.5" />
                  </svg>
                  <div className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white/80">
                    {l.name.split(' ')[0]}
                  </div>
                </div>
                <div className="flex-1 p-3.5 pr-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text)' }}>{l.name}</div>
                    <Icon name="chevronRight" size={16} style={{ color: 'var(--text-faint)' }} />
                  </div>
                  <p className="text-[12px] mt-1.5 leading-snug" style={{ color: 'var(--text-dim)' }}
                    title={l.desc}>
                    {l.desc.length > 78 ? l.desc.slice(0, 78) + '…' : l.desc}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {l.ar && <Pill tone="soft" size="sm" icon="cube">AR dostupné</Pill>}
                    <Pill tone="softer" size="sm">{l.ciest} ciest</Pill>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="rounded-2xl p-4 text-center"
            style={{ background: 'transparent', border: '1px dashed var(--border-2)' }}>
            <div className="text-[12px] font-semibold" style={{ color: 'var(--text-faint)' }}>
              + {region.lokalit - lokality.length} ďalších lokalít čaká
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="mapa" onNav={nav} />
    </div>
  );
}

Object.assign(window, { MapaScreen, RegionScreen });
