export const REGIONS = [
  { code: 'BB', name: 'Banskobystrický kraj', lokalit: 12, sektorov: 38, ciest: 412, color: '#2a6f4a' },
  { code: 'BA', name: 'Bratislavský kraj',    lokalit: 6,  sektorov: 18, ciest: 187, color: '#1d5236' },
  { code: 'KK', name: 'Košický kraj',         lokalit: 9,  sektorov: 27, ciest: 298, color: '#c89234' },
  { code: 'NK', name: 'Nitriansky kraj',      lokalit: 4,  sektorov: 11, ciest: 96,  color: '#9bc7a5' },
  { code: 'PK', name: 'Prešovský kraj',       lokalit: 14, sektorov: 41, ciest: 503, color: '#f1ad77' },
  { code: 'TK', name: 'Trenčiansky kraj',     lokalit: 8,  sektorov: 22, ciest: 241, color: '#5d9270' },
  { code: 'TK', name: 'Trnavský kraj',        lokalit: 3,  sektorov: 8,  ciest: 64,  color: '#1d5236' },
  { code: 'ŽK', name: 'Žilinský kraj',        lokalit: 18, sektorov: 54, ciest: 687, color: '#2a6f4a' },
];

export const LOKALITY = {
  PK: [
    { id: 'tatranska-kotlina', name: 'Tatranská Kotlina', sektory: 2, ciest: 30, ar: true,
      desc: 'Starý lom pri Tatranskej Kotline. Ideálna lokalita pre začiatočníkov a kurzy. Výborná kvalita skaly, väčšina ciest na plachtách.',
      rock: 'Vápenec', orient: 'JV', sun: '08–14h', best: 'IV–X', img: 'crag-night' },
    { id: 'zadiel', name: 'Zádielska tiesňava', sektory: 6, ciest: 142, ar: false,
      desc: 'Hlboký kaňon s prevažujúcimi tvrdými cestami. Klasika východu.',
      rock: 'Vápenec', orient: 'JZ', sun: '12–18h', best: 'V–IX', img: 'crag-canyon' },
  ],
};

export const SEKTORY = {
  'tatranska-kotlina': [
    { id: 'lom-a', num: 1, name: 'Lom A', ciest: 15, prelezeno: 15 },
    { id: 'lom-b', num: 2, name: 'Lom B', ciest: 15, prelezeno: 3 },
  ],
};

export const ROUTES_LOM_A = [
  { num: 1, name: 'Brucho direkt', grade: '6+', length: 17, bolts: 7, style: 'Plotňa', liked: true, sent: true, project: false,
    beta: 'Štart cez prevísajúcu hranu, kľúč na 4. expreske — dlhý krok do platne.' },
  { num: 2, name: 'Brucho sprava', grade: '6', length: 18, bolts: 6, style: 'Plotňa', liked: false, sent: false, project: true,
    beta: 'Mierne vpravo od Brucho direkt, jednoduchší výlez.' },
  { num: 3, name: 'Brucho zľava', grade: '5+', length: 16, bolts: 6, style: 'Plotňa', liked: false, sent: true, project: false },
  { num: 4, name: 'Cez Platňu',   grade: '7+', length: 21, bolts: 9, style: 'Plotňa, technika', liked: false, sent: false, project: false },
  { num: 5, name: 'Mokrá cesta',  grade: '5+', length: 18, bolts: 7, style: 'Spár', liked: false, sent: true, project: false },
  { num: 6, name: 'Naklonená',    grade: '4-', length: 14, bolts: 5, style: 'Plotňa', liked: false, sent: true, project: false },
  { num: 7, name: 'Pekná cesta',  grade: '6-', length: 19, bolts: 7, style: 'Stena', liked: true,  sent: true, project: false },
  { num: 8, name: 'Hrana',        grade: '6',  length: 20, bolts: 8, style: 'Hrana', liked: false, sent: true, project: false },
  { num: 9, name: 'Mladá garda',  grade: '7-', length: 22, bolts: 9, style: 'Stena, prst', liked: false, sent: true, project: false },
  { num: 10, name: 'Pavúk',       grade: '6+', length: 17, bolts: 7, style: 'Stena', liked: false, sent: true, project: false },
];

export const PROJECTS = [
  { route: 'Brucho sprava', grade: '6', length: 18, bolts: 6, attempts: 0, sector: 'Lom A', lokalita: 'Tatranská Kotlina',
    notes: 'Tu môže byť krátka osobná poznámka: čo si skúšal, kde bol problém a čo chceš skúsiť nabudúce.' },
];

export const USER = {
  name: 'Daniel', handle: '@daniel_lezie',
  best: '6+', sent: 47, totalLen: 783, streak: 4, thisWeek: 3,
};

export const LOGBOOK = [
  { route: 'Pavúk',        grade: '6+', dlzka_m: 17, pocet_isteni: 7, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred 2 dňami',   style: 'flash',
    note: 'Konečne flash! Pravá noha na malom stupe pred kľúčom, potom dlhý doskok do dierky. Sucho drží super.' },
  { route: 'Hrana',        grade: '6',  dlzka_m: 20, pocet_isteni: 8, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred 2 dňami',   style: '2. pokus',
    note: 'Prvý pokus padák na hrane, druhý raz čisto. Treba viac dôverovať tým malým stupom.' },
  { route: 'Mladá garda',  grade: '7-', dlzka_m: 22, pocet_isteni: 9, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred 5 dňami',   style: '4. pokus',
    note: 'Ťažký kríženec v polovici. Lepšie odšlapnutie ľavou a ide to.' },
  { route: 'Brucho direkt',grade: '6+', dlzka_m: 17, pocet_isteni: 7, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred týždňom',   style: 'flash', note: '' },
  { route: 'Pekná cesta',  grade: '6-', dlzka_m: 19, pocet_isteni: 7, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred týždňom',   style: 'onsight', note: '' },
  { route: 'Mokrá cesta',  grade: '5+', dlzka_m: 18, pocet_isteni: 7, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred 2 týž.',    style: '2. pokus',
    note: 'Po daždi naozaj mokrá, spodná časť klzká.' },
  { route: 'Naklonená',    grade: '4-', dlzka_m: 14, pocet_isteni: 5, sektor: 'Lom A', lokalita: 'Tatranská Kotlina', when: 'pred 2 týž.',    style: 'onsight', note: '' },
  { route: 'Diretissima',  grade: '6',  dlzka_m: 21, pocet_isteni: 8, sektor: 'Lom B', lokalita: 'Zádielska tiesňava', when: 'pred mesiacom', style: '3. pokus', note: '' },
];

export const VISITED = [
  { name: 'Tatranská Kotlina',    region: 'Prešovský kraj',       ascents: 15, lastVisit: 'pred 2 dňami',  complete: true },
  { name: 'Zádielska tiesňava',   region: 'Košický kraj',          ascents: 6,  lastVisit: 'pred mesiacom', complete: false },
  { name: 'Skalka pri Kremnici',  region: 'Banskobystrický kraj',  ascents: 3,  lastVisit: 'pred 3 mes.',   complete: false },
];

export const BADGES = [
  { id: 'prvy-vylez',  name: 'Prvý výlez',          icon: 'mountain', earned: true,  desc: 'Zalez si svoju prvú cestu' },
  { id: 'prvy-flash',  name: 'Prvý flash',           icon: 'bolt',     earned: true,  desc: 'Cesta odlezená na prvý pokus' },
  { id: '10-ciest',    name: '10 ciest',             icon: 'check',    earned: true,  desc: 'Zalez 10 ciest' },
  { id: '50-ciest',    name: '50 ciest',             icon: 'flame',    earned: false, desc: 'Ešte 3 cesty (47/50)' },
  { id: 'sektor',      name: 'Sektor kompletný',     icon: 'star',     earned: true,  desc: 'Zalez všetky cesty v sektore' },
  { id: 'lokalita',   name: 'Lokalita kompletná',   icon: 'map',      earned: false, desc: 'Zalez celú lokalitu' },
];
