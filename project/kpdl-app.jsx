// Main app — playful theme, navigation, tweaks

const ACCENT_BY_HEX = {
  '#2a6f4a': { deep: '#1d5236', soft: '#d9ecdc', label: 'Sage' },
  '#1d6e89': { deep: '#14516b', soft: '#d4e8f0', label: 'Lake' },
  '#c25444': { deep: '#962f23', soft: '#f5dcd6', label: 'Clay' },
  '#7a5cc4': { deep: '#4f3a8a', soft: '#e4dcf2', label: 'Plum' },
};

const PALETTE_OPTIONS = {
  cream: {
    bg: '#faf8f2', card: '#ffffff', bg2: '#f1ede3', border: '#e8e4d8', border2: '#d6d0bf',
    text: '#1a221c', dim: '#5a6258', faint: '#8e9489',
    amber: '#d49a3a', amberDeep: '#a8731f', amberSoft: '#fbe9c5',
    red: '#e35a47', redDeep: '#a82d1d', redSoft: '#fbdcd6',
    label: 'Cream',
  },
  paper: {
    bg: '#ffffff', card: '#ffffff', bg2: '#f4f5f3', border: '#e8e9e5', border2: '#cfd2cb',
    text: '#15211a', dim: '#5e6a62', faint: '#9aa39c',
    amber: '#d49a3a', amberDeep: '#a8731f', amberSoft: '#fbeac8',
    red: '#e15947', redDeep: '#a82d1d', redSoft: '#fbdcd6',
    label: 'Paper',
  },
  forest: {
    bg: '#0f1612', card: '#1a2520', bg2: '#243029', border: '#2f4439', border2: '#3d574a',
    text: '#f0eee5', dim: '#a3afa7', faint: '#6e7a72',
    amber: '#e8b04d', amberDeep: '#f0c074', amberSoft: 'rgba(232,176,77,0.18)',
    red: '#e88a73', redDeep: '#f0a594', redSoft: 'rgba(232,138,115,0.18)',
    label: 'Forest (dark)',
  },
};

const FONT_OPTIONS = {
  jakarta:  { display: '"Big Shoulders Display", "Bebas Neue", Impact, sans-serif', body: '"Plus Jakarta Sans", system-ui, sans-serif', label: 'Big Shoulders + Jakarta' },
  geist:    { display: '"Big Shoulders Display", "Bebas Neue", Impact, sans-serif', body: '"Geist", system-ui, sans-serif', label: 'Big Shoulders + Geist' },
  anton:    { display: '"Anton", Impact, sans-serif', body: '"DM Sans", system-ui, sans-serif', label: 'Anton + DM Sans' },
  archivo:  { display: '"Archivo Black", sans-serif', body: '"Archivo", system-ui, sans-serif', label: 'Archivo Black + Archivo' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "cream",
  "accent": "#2a6f4a",
  "font": "jakarta",
  "screen": "route"
}/*EDITMODE-END*/;

function applyTheme(t) {
  const root = document.documentElement;
  const pal = PALETTE_OPTIONS[t.palette] || PALETTE_OPTIONS.cream;
  const ac = ACCENT_BY_HEX[t.accent] || ACCENT_BY_HEX['#2a6f4a'];
  const accentHex = ACCENT_BY_HEX[t.accent] ? t.accent : '#2a6f4a';
  const fnt = FONT_OPTIONS[t.font] || FONT_OPTIONS.jakarta;

  // For forest (dark) palette, adapt the soft accent token to be a translucent version
  const isDark = t.palette === 'forest';
  root.dataset.dark = isDark ? 'true' : 'false';
  const softAccent = isDark
    ? `color-mix(in oklab, ${accentHex} 22%, transparent)`
    : ac.soft;

  root.style.setProperty('--bg', pal.bg);
  root.style.setProperty('--card', pal.card);
  root.style.setProperty('--bg-2', pal.bg2);
  root.style.setProperty('--border', pal.border);
  root.style.setProperty('--border-2', pal.border2);
  root.style.setProperty('--text', pal.text);
  root.style.setProperty('--text-dim', pal.dim);
  root.style.setProperty('--text-faint', pal.faint);

  root.style.setProperty('--accent', accentHex);
  root.style.setProperty('--accent-deep', isDark ? '#a7d4b3' : ac.deep);
  root.style.setProperty('--green-soft', softAccent);

  root.style.setProperty('--amber', pal.amber);
  root.style.setProperty('--amber-deep', pal.amberDeep);
  root.style.setProperty('--amber-soft', pal.amberSoft);
  root.style.setProperty('--red', pal.red);
  root.style.setProperty('--red-deep', pal.redDeep);
  root.style.setProperty('--red-soft', pal.redSoft);

  root.style.setProperty('--font-display', fnt.display);
  root.style.setProperty('--font-body', fnt.body);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stack, setStack] = React.useState(() => [{ screen: 'home', props: {} }]);
  const cur = stack[stack.length - 1];

  React.useEffect(() => { applyTheme(t); }, [t]);

  React.useEffect(() => {
    if (cur.screen !== t.screen && ['home','mapa','projekty','profil','region','lokalita','sektor','route','logbook'].includes(t.screen)) {
      // Build a proper stack with parent context for deep screens
      let s;
      switch (t.screen) {
        case 'region':   s = [{ screen: 'region', props: { region: REGIONS[4] } }]; break;
        case 'lokalita': s = [{ screen: 'lokalita', props: { lokalita: LOKALITY.PK[0], region: REGIONS[4] } }]; break;
        case 'sektor':   s = [{ screen: 'sektor', props: { sektor: SEKTORY['tatranska-kotlina'][0], lokalita: LOKALITY.PK[0], region: REGIONS[4] } }]; break;
        case 'route':    s = [{ screen: 'route', props: { route: ROUTES_LOM_A[0], sektor: SEKTORY['tatranska-kotlina'][0], lokalita: LOKALITY.PK[0], region: REGIONS[4] } }]; break;
        default:         s = [{ screen: t.screen, props: {} }];
      }
      setStack(s);
    }
  }, [t.screen]);

  const nav = (screen, props = {}) => {
    if (['home','mapa','projekty','profil'].includes(screen)) {
      setStack([{ screen, props }]);
      setTweak('screen', screen);
    } else {
      setStack(s => [...s, { screen, props }]);
    }
  };

  const goBack = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));

  let content;
  const props = cur.props || {};
  switch (cur.screen) {
    case 'home':     content = <HomeScreen nav={nav} />; break;
    case 'mapa':     content = <MapaScreen nav={nav} />; break;
    case 'region':   content = <RegionScreen nav={nav} region={props.region || REGIONS[4]} />; break;
    case 'lokalita': content = <LokalitaScreen nav={nav} lokalita={props.lokalita || LOKALITY.PK[0]} region={props.region || REGIONS[4]} />; break;
    case 'sektor':   content = <SektorScreen nav={nav} sektor={props.sektor || SEKTORY['tatranska-kotlina'][0]} lokalita={props.lokalita || LOKALITY.PK[0]} region={props.region || REGIONS[4]} />; break;
    case 'route':    content = <RouteScreen nav={nav} route={props.route || ROUTES_LOM_A[0]} sektor={props.sektor || SEKTORY['tatranska-kotlina'][0]} lokalita={props.lokalita || LOKALITY.PK[0]} region={props.region || REGIONS[4]} />; break;
    case 'publicProfile': content = <PublicProfileScreen nav={nav} back={goBack} person={props.person} />; break;
    case 'projekty': content = <ProjektyScreen nav={nav} />; break;
    case 'profil':   content = <ProfilScreen nav={nav} />; break;
    case 'editProfile': content = <EditProfileScreen nav={nav} />; break;
    case 'logbook':  content = <LogbookScreen nav={nav} />; break;
    case 'visited':  content = <VisitedScreen nav={nav} />; break;
    default:         content = <HomeScreen nav={nav} />;
  }

  return (
    <div className="min-h-screen w-full grid place-items-center py-6"
      style={{ background: '#e8e6df', fontFamily: 'var(--font-body)' }}>
      <IOSDevice width={402} height={874} dark={t.palette === 'forest'}>
        <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--bg)' }}>
          {content}
        </div>
      </IOSDevice>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Obrazovka">
          <TweakSelect label="Show" value={t.screen} onChange={v => setTweak('screen', v)}
            options={[
              { value: 'home',     label: 'Domov' },
              { value: 'mapa',     label: 'Mapa · regióny' },
              { value: 'region',   label: 'Región (Prešov)' },
              { value: 'lokalita', label: 'Lokalita (T. Kotlina)' },
              { value: 'sektor',   label: 'Sektor (Lom A)' },
              { value: 'route',    label: 'Cesta (Brucho direkt)' },
              { value: 'projekty', label: 'Projekty' },
              { value: 'logbook',  label: 'Logbook (záznamy)' },
              { value: 'profil',   label: 'Profil' },
            ]} />
        </TweakSection>

        <TweakSection label="Téma">
          <TweakRadio label="Pozadie" value={t.palette} onChange={v => setTweak('palette', v)}
            options={[
              { value: 'cream',  label: 'Cream' },
              { value: 'paper',  label: 'Paper' },
              { value: 'forest', label: 'Dark' },
            ]} />
          <TweakColor label="Accent" value={t.accent} onChange={v => setTweak('accent', v)}
            options={Object.keys(ACCENT_BY_HEX)} />
        </TweakSection>

        <TweakSection label="Typografia">
          <TweakSelect label="Display + body" value={t.font} onChange={v => setTweak('font', v)}
            options={Object.entries(FONT_OPTIONS).map(([k, v]) => ({ value: k, label: v.label }))} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
