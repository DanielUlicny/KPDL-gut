// "Upraviť profil" — edit profile screen (static design mockup)

// ── Field label row ───────────────────────────────────────────
function FieldLabel({ children, optional }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <span className="text-[11.5px] font-bold uppercase tracking-[0.1em]"
      style={{ color: 'var(--text-dim)' }}>
        {children}
      </span>
      {optional &&
      <span className="text-[9.5px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-md"
      style={{ background: 'var(--bg-2)', color: 'var(--text-faint)' }}>
          voliteľné
        </span>
      }
    </div>);

}

// ── Input-styled box (filled or placeholder) ──────────────────
function Box({ value, placeholder, prefix, unit, focused }) {
  const empty = value === undefined || value === '' || value === null;
  return (
    <div className="w-full h-[52px] px-4 rounded-2xl flex items-center text-[15px]"
    style={{
      background: 'var(--card)',
      border: focused ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
      boxShadow: focused ? '0 0 0 3px var(--green-soft)' : 'none'
    }}>
      {prefix && <span className="mr-0.5" style={{ color: 'var(--text-faint)', fontWeight: 600 }}>{prefix}</span>}
      <span className="flex-1 truncate"
      style={{ color: empty ? 'var(--text-faint)' : 'var(--text)', fontWeight: empty ? 500 : 600 }}>
        {empty ? placeholder : value}
      </span>
      {unit && <span className="ml-2 text-[13px] font-semibold" style={{ color: 'var(--text-faint)' }}>{unit}</span>}
    </div>);

}

// ── Nav bar — cream, Uložiť primary on the right ──────────────
function EditNavBar({ onCancel, onSave }) {
  return (
    <div className="relative z-10 shrink-0" style={{ background: 'var(--bg)' }}>
      <div className="relative flex items-center px-4 pb-3" style={{ paddingTop: 58 }}>
        <button onClick={onCancel} className="text-[15px] font-semibold active:opacity-60 transition" style={{ color: 'var(--text-dim)' }}>
          Zrušiť
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-extrabold"
        style={{ color: 'var(--text)' }}>
          Upraviť profil
        </h1>
        <button onClick={onSave} className="ml-auto h-9 px-4 rounded-full text-[13.5px] font-bold flex items-center gap-1.5 active:scale-[0.97] transition"
        style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 2px 8px color-mix(in oklab, var(--accent) 35%, transparent)' }}>
          <Icon name="check" size={15} stroke={2.6} />
          Uložiť
        </button>
      </div>
      <div className="h-px mx-4" style={{ background: 'var(--border)' }} />
    </div>);

}

// ── Screen ────────────────────────────────────────────────────
function EditProfileScreen({ nav }) {
  const styles = ['Sport', 'Trad', 'Boulder', 'Via ferrata'];
  const activeStyles = ['Sport', 'Boulder'];
  const back = () => nav && nav('profil');

  return (
    <div className="relative flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <EditNavBar onCancel={back} onSave={back} />

      <div className="flex-1 overflow-y-auto pb-12">
        {/* Photo header */}
        <div className="flex flex-col items-center pt-6 pb-1">
          <div className="relative">
            <div className="w-[104px] h-[104px] rounded-full overflow-hidden"
            style={{ border: '2px solid var(--border)' }}>
              <ImgSlot light label="foto" className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full grid place-items-center"
            style={{ background: 'var(--accent)', color: '#fff', border: '3px solid var(--bg)' }}>
              <Icon name="camera" size={16} stroke={2} />
            </div>
          </div>
          <button className="mt-3 text-[13.5px] font-bold" style={{ color: 'var(--accent)' }}>
            Zmeniť fotku
          </button>
        </div>

        {/* OSOBNÉ */}
        <div className="px-5 mt-5">
          <SectionLabel>Osobné</SectionLabel>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Meno</FieldLabel>
              <Box value="Daniel" />
            </div>
            <div>
              <FieldLabel>Priezvisko</FieldLabel>
              <Box value="Horský" />
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Používateľské meno</FieldLabel>
            <Box prefix="@" value="danielhorsky" />
          </div>

          <div className="mt-4">
            <FieldLabel>Bio</FieldLabel>
            <div className="rounded-2xl px-4 py-3.5"
            style={{ background: 'var(--card)', border: '1.5px solid var(--accent)', boxShadow: '0 0 0 3px var(--green-soft)' }}>
              <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
                Tatry a vápenec. Víkendy v Kotline, projekty v 6+. Hľadám parťáka na multipitch.
              </p>
            </div>
            <div className="flex justify-end mt-1.5 px-1">
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: 'var(--text-faint)' }}>
                80 / 100
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div style={{ margin: "15px 0px 0px" }}>
              <FieldLabel optional>Vek</FieldLabel>
              <Box value="28" unit="rokov" />
            </div>
            <div>
              <FieldLabel optional>Rozpätie rúk</FieldLabel>
              <Box placeholder="napr. 185" unit="cm" />
            </div>
          </div>
        </div>

        {/* LEZENIE */}
        <div className="px-5 mt-7">
          <SectionLabel>Lezenie</SectionLabel>

          <div className="mt-3">
            <FieldLabel>Leziem od roku</FieldLabel>
            <button className="w-full h-[52px] px-4 rounded-2xl flex items-center justify-between text-[15px] font-semibold"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
              <span>2015</span>
              <Icon name="chevronDown" size={18} stroke={2.2} style={{ color: 'var(--text-faint)' }} />
            </button>
          </div>

          <div className="mt-4">
            <FieldLabel>Lezecký štýl</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => {
                const active = activeStyles.includes(s);
                return (
                  <Chip key={s} active={active} icon={active ? 'check' : null}>
                    {s}
                  </Chip>);

              })}
            </div>
            <p className="text-[12px] mt-2.5 px-1" style={{ color: 'var(--text-faint)' }}>
              Vyber všetky štýly, ktorým sa venuješ.
            </p>
          </div>
        </div>
      </div>
    </div>);

}

Object.assign(window, { EditProfileScreen });