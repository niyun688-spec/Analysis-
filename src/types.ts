// Shared Types for the Apex Analysis Platform

export type UserRole = 'Admin' | 'Researcher' | 'Viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  role: UserRole;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

// Sports Types
export interface IPLTeam {
  id: string;
  name: string;
  shortName: string;
  winPercentage: number; // Historical win proportion
  primaryColor: string;
  secondaryColor: string;
  venue: string;
  titles: number;
}

export interface FootballMatch {
  id: string;
  homeTeam: string;
  homeFlag: string;
  homeElo: number;
  awayTeam: string;
  awayFlag: string;
  awayElo: number;
  group: string;
}

// Science Types
export interface PlanetInfo {
  id: string;
  name: string;
  type: string;
  distanceFromSun: string; // in AU
  diameter: string; // in km
  tempRange: string;
  moons: number;
  color: string;
  funFact: string;
}

export interface CosmicEvent {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
  category: 'origins' | 'evolution' | 'future';
}

export interface ChemicalElement {
  number: number;
  name: string;
  symbol: string;
  category: string;
  weight: number;
  group: number;
  period: number;
  summary: string;
  colorClass: string;
}

export interface EraMarker {
  id: string;
  yearsAgo: string;
  title: string;
  epoch: string;
  description: string;
  keyEvents: string[];
  imageUrl: string;
}

export interface EarthquakeItem {
  id: string;
  place: string;
  magnitude: number;
  time: string;
  depth: number;
  tsunami: boolean;
  url: string;
}

// Realistic Static Initial Data
export const IPL_TEAMS: IPLTeam[] = [
  { id: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', winPercentage: 58.4, primaryColor: 'bg-yellow-500', secondaryColor: 'border-yellow-400', venue: 'M. A. Chidambaram Stadium', titles: 5 },
  { id: 'mi', name: 'Mumbai Indians', shortName: 'MI', winPercentage: 56.2, primaryColor: 'bg-blue-600', secondaryColor: 'border-blue-500', venue: 'Wankhede Stadium', titles: 5 },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', winPercentage: 48.1, primaryColor: 'bg-red-600', secondaryColor: 'border-red-500', venue: 'M. Chinnaswamy Stadium', titles: 0 },
  { id: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', winPercentage: 51.9, primaryColor: 'bg-purple-700', secondaryColor: 'border-purple-600', venue: 'Eden Gardens', titles: 3 },
  { id: 'dc', name: 'Delhi Capitals', shortName: 'DC', winPercentage: 45.8, primaryColor: 'bg-indigo-600', secondaryColor: 'border-indigo-500', venue: 'Arun Jaitley Stadium', titles: 0 },
  { id: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', winPercentage: 49.3, primaryColor: 'bg-orange-500', secondaryColor: 'border-orange-400', venue: 'Rajiv Gandhi Intl. Cricket Stadium', titles: 2 },
  { id: 'rr', name: 'Rajasthan Royals', shortName: 'RR', winPercentage: 50.2, primaryColor: 'bg-pink-600', secondaryColor: 'border-pink-500', venue: 'Sawai Mansingh Stadium', titles: 1 },
  { id: 'lsg', name: 'Lucknow Super Giants', shortName: 'LSG', winPercentage: 52.5, primaryColor: 'bg-cyan-600', secondaryColor: 'border-cyan-500', venue: 'Ekana Cricket Stadium', titles: 0 },
  { id: 'gt', name: 'Gujarat Titans', shortName: 'GT', winPercentage: 57.1, primaryColor: 'bg-slate-700', secondaryColor: 'border-slate-600', venue: 'Narendra Modi Stadium', titles: 1 },
  { id: 'pbks', name: 'Punjab Kings', shortName: 'PBKS', winPercentage: 44.2, primaryColor: 'bg-red-500', secondaryColor: 'border-red-400', venue: 'PCA Stadium, Mohali', titles: 0 }
];

export const FOOTBALL_MATCHES: FootballMatch[] = [
  { id: 'f1', homeTeam: 'Argentina', homeFlag: '🇦🇷', homeElo: 2145, awayTeam: 'France', awayFlag: '🇫🇷', awayElo: 2090, group: 'Group A' },
  { id: 'f2', homeTeam: 'Brazil', homeFlag: '🇧🇷', homeElo: 2110, awayTeam: 'Germany', awayFlag: '🇩🇪', awayElo: 1940, group: 'Group B' },
  { id: 'f3', homeTeam: 'Spain', homeFlag: '🇪🇸', homeElo: 2035, awayTeam: 'England', awayFlag: '🇬🇧', awayElo: 2010, group: 'Group C' },
  { id: 'f4', homeTeam: 'Japan', homeFlag: '🇯🇵', homeElo: 1890, awayTeam: 'Croatia', awayFlag: '🇭🇷', awayElo: 1875, group: 'Group D' },
  { id: 'f5', homeTeam: 'Portugal', homeFlag: '🇵🇹', homeElo: 1980, awayTeam: 'Morocco', awayFlag: '🇲🇦', awayElo: 1820, group: 'Group E' },
  { id: 'f6', homeTeam: 'Netherlands', homeFlag: '🇳🇱', homeElo: 1955, awayTeam: 'Senegal', awayFlag: '🇸🇳', awayElo: 1730, group: 'Group F' }
];

export const PLANETS: PlanetInfo[] = [
  { id: 'mercury', name: 'Mercury', type: 'Terrestrial', distanceFromSun: '0.39 AU', diameter: '4,879 km', tempRange: '-180°C to 430°C', moons: 0, color: 'bg-amber-700', funFact: 'Mercury has no atmosphere, meaning there is no wind or weather.' },
  { id: 'venus', name: 'Venus', type: 'Terrestrial', distanceFromSun: '0.72 AU', diameter: '12,104 km', tempRange: '460°C constant', moons: 0, color: 'bg-orange-400', funFact: 'Venus spins backward on its axis compared to most other planets.' },
  { id: 'earth', name: 'Earth', type: 'Terrestrial', distanceFromSun: '1.00 AU', diameter: '12,742 km', tempRange: '-88°C to 58°C', moons: 1, color: 'bg-emerald-500', funFact: 'Earth is the only planet not named after a mythological god or goddess.' },
  { id: 'mars', name: 'Mars', type: 'Terrestrial', distanceFromSun: '1.52 AU', diameter: '6,779 km', tempRange: '-140°C to 20°C', moons: 2, color: 'bg-rose-600', funFact: 'Mars is home to Olympus Mons, the tallest volcano in the solar system.' },
  { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant', distanceFromSun: '5.20 AU', diameter: '139,820 km', tempRange: '-110°C average', moons: 95, color: 'bg-amber-600', funFact: 'Jupiter’s Great Red Spot is a powerful storm that has raged for over 300 years.' },
  { id: 'saturn', name: 'Saturn', type: 'Gas Giant', distanceFromSun: '9.58 AU', diameter: '116,460 km', tempRange: '-140°C average', moons: 146, color: 'bg-yellow-600', funFact: 'Saturn is the least dense planet in our solar system and would float in water.' },
  { id: 'uranus', name: 'Uranus', type: 'Ice Giant', distanceFromSun: '19.18 AU', diameter: '50,724 km', tempRange: '-195°C average', moons: 28, color: 'bg-cyan-400', funFact: 'Uranus rotates almost completely on its side, virtually rolling around the Sun.' },
  { id: 'neptune', name: 'Neptune', type: 'Ice Giant', distanceFromSun: '30.07 AU', diameter: '49,244 km', tempRange: '-200°C average', moons: 16, color: 'bg-blue-500', funFact: 'Neptune has some of the strongest winds in the solar system, reaching 2,100 km/h.' }
];

export const COSMIC_EVENTS: CosmicEvent[] = [
  { id: 'e1', timeLabel: '13.8 Billion Years Ago', title: 'The Big Bang', description: 'The universe began from an extremely hot, dense point and rapidly expanded, giving rise to space, time, and matter.', category: 'origins' },
  { id: 'e2', timeLabel: '13.6 Billion Years Ago', title: 'First Cosmic Light', description: 'Cosmic Microwave Background (CMB) radiation emitted as the universe cooled enough for stable atoms to form.', category: 'origins' },
  { id: 'e3', timeLabel: '13.5 Billion Years Ago', title: 'The Stellar Dawn', description: 'Gravity pulls hydrogen and helium gases together to ignite the very first stars, ending the Cosmic Dark Ages.', category: 'origins' },
  { id: 'e4', timeLabel: '4.6 Billion Years Ago', title: 'Formation of the Sun', description: 'A massive molecular cloud collapse triggers the birth of our Sun and the protoplanetary disc surrounding it.', category: 'evolution' },
  { id: 'e5', timeLabel: '4.5 Billion Years Ago', title: 'Birth of our Planets', description: 'Accretion of dust and rocky debris forms Earth, Mars, Moon, and other planets inside the Solar System.', category: 'evolution' },
  { id: 'e6', timeLabel: '2.4 Billion Years Ago', title: 'Great Oxidation Event', description: 'Cyanobacteria evolve photosynthesis, producing oxygen that transformed Earth’s atmospheric composition.', category: 'evolution' },
  { id: 'e7', timeLabel: '66 Million Years Ago', title: 'Chicxulub Asteroid Impact', description: 'Massive asteroid impact leads to Cretaceous-Paleogene extinction, bringing an end to the Reign of the Dinosaurs.', category: 'evolution' },
  { id: 'e8', timeLabel: '5 Billion Years into Future', title: 'The Red Giant Era', description: 'The Sun exhausts hydrogen core fuel, expanding into a Red Giant, engulfing the orbits of Mercury, Venus, and possibly Earth.', category: 'future' },
  { id: 'e9', timeLabel: '100 Trillion Years into Future', title: 'The Stellar Death', description: 'Star formation ceases completely as gas supplies deplete, transitioning the cosmos into the degenerate black-hole and dark epochs.', category: 'future' }
];

export const ERAS: EraMarker[] = [
  {
    id: 'hadean',
    yearsAgo: '4.6 to 4.0 Billion',
    title: 'Hadean Eon',
    epoch: 'Origin of Earth',
    description: 'Earth is formed from swirling gas and nebular dust. Extremely hot, characterized by frequent asteroid bombardment, volcanism, and a molten surface. The moon is created via collision with proto-planet Theia.',
    keyEvents: ['Formation of Solar System', 'Theia Impact & Moon formation', 'Cooling crust and liquid water condensation'],
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'archean',
    yearsAgo: '4.0 to 2.5 Billion',
    title: 'Archean Eon',
    epoch: 'First Single-Cell Life',
    description: 'Earth cools further, forming continental plates and vast oceans. The atmosphere is mostly methane, ammonia, and CO2. Oldest microbial fossil remnants (microfossils and stromatolites) emerge in hydrothermal vents.',
    keyEvents: ['Origins of single-cell prokaryotes', 'Formation of first stable supercontinent', 'Stromatolites release early oxygen tracers'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'proterozoic',
    yearsAgo: '2.5 Billion to 541 Million',
    title: 'Proterozoic Eon',
    epoch: 'Oxygen Revolution',
    description: 'Characterized by the Great Oxidation Event which triggers global glaciation (Snowball Earth). Eukaryotes (complex nuclei-bearing cells) develop and early multicellular entities branch out towards the end of this eon.',
    keyEvents: ['Great Oxidation Event', 'Huronian Ice Age', 'Eukaryote cells evolve via endosymbiosis'],
    imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'paleozoic',
    yearsAgo: '541 to 252 Million',
    title: 'Paleozoic Era',
    epoch: 'Trilobites & Plants',
    description: 'Rapid diversification of structural life forms during the Cambrian Explosion. Colonization of land by vascular plants and early tetrapod amphibians. Concludes with the devastating Permian Extinction, wiping out 95% of marine life.',
    keyEvents: ['Cambrian Explosion of arthropods', 'First land plants and forest systems', 'Permian Great Dying Event'],
    imageUrl: 'https://images.unsplash.com/photo-1544300790-27578f12a21a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mesozoic',
    yearsAgo: '252 to 66 Million',
    title: 'Mesozoic Era',
    epoch: 'Reign of Dinosaurs',
    description: 'The Golden Age of Reptiles and Dinosaurs. Pangea splits into present continental masses. Conifers flourish and early birds and mammals appear, capped by the legendary KT Asteroid Extinction event.',
    keyEvents: ['Rise of Dinosaurs and Flying Pterosaurs', 'Breaking up of supercontinent Pangea', 'Cretaceous Chicxulub asteroid impact'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cenozoic',
    yearsAgo: '66 Million to Present',
    title: 'Cenozoic Era',
    epoch: 'Mammalian Dominance',
    description: 'The diversification and global expansion of mammals and hominids. Dramatic tectonic movements form the Himalayas. Advancements in atmospheric cycles and recurring Ice Ages shape human evolutionary origins.',
    keyEvents: ['Mammalian diversification', 'Evolution of early hominids', 'Rise of human civilization'],
    imageUrl: 'https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=400&q=80'
  }
];

export const PERIODIC_TABLE: ChemicalElement[] = [
  { number: 1, name: 'Hydrogen', symbol: 'H', category: 'Reactive Nonmetal', weight: 1.008, group: 1, period: 1, summary: 'Colorless, odorless, highly flammable gas; the most abundant chemical substance in the Universe.', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 2, name: 'Helium', symbol: 'He', category: 'Noble Gas', weight: 4.0026, group: 18, period: 1, summary: 'Colorless, odorless, tasteless, non-toxic, inert gas that heads the noble gas series.', colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' },
  { number: 3, name: 'Lithium', symbol: 'Li', category: 'Alkali Metal', weight: 6.94, group: 1, period: 2, summary: 'Soft, silvery-white alkali metal. Under standard conditions, it is the least dense solid element.', colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50' },
  { number: 4, name: 'Beryllium', symbol: 'Be', category: 'Alkaline Earth Metal', weight: 9.0122, group: 2, period: 2, summary: 'Relatively rare element in the universe, often forming into minerals with emerald crystals.', colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
  { number: 5, name: 'Boron', symbol: 'B', category: 'Metalloid', weight: 10.81, group: 13, period: 2, summary: 'Low-abundance metalloid commonly found concentrated in water-soluble borate mineral deposits.', colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/50' },
  { number: 6, name: 'Carbon', symbol: 'C', category: 'Reactive Nonmetal', weight: 12.011, group: 14, period: 2, summary: 'Tetravalent nonmetal that forms organic molecules, providing the molecular core of all active life.', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 7, name: 'Nitrogen', symbol: 'N', category: 'Reactive Nonmetal', weight: 14.007, group: 15, period: 2, summary: 'Makes up about 78% of Earth Atmosphere; crucial component of amino acids and DNA bases.', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 8, name: 'Oxygen', symbol: 'O', category: 'Reactive Nonmetal', weight: 15.999, group: 16, period: 2, summary: 'Highly reactive oxidizing nonmetal agent, essential for respiration of major aerobic organisms.', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 9, name: 'Fluorine', symbol: 'F', category: 'Halogen', weight: 18.998, group: 17, period: 2, summary: 'Extremely toxic halogen gas. The most chemically reactive and electronegative of all elements.', colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
  { number: 10, name: 'Neon', symbol: 'Ne', category: 'Noble Gas', weight: 20.180, group: 18, period: 2, summary: 'Colorless, inert gas that glows with a high-voltage reddish-orange light when ionized.', colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' },
  { number: 11, name: 'Sodium', symbol: 'Na', category: 'Alkali Metal', weight: 22.990, group: 1, period: 3, summary: 'Soft, silvery-reactive metal that burns intensely under wet atmospheric hydration.', colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50' },
  { number: 12, name: 'Magnesium', symbol: 'Mg', category: 'Alkaline Earth Metal', weight: 24.305, group: 2, period: 3, summary: 'Shiny gray metal, highly reactive, plays vital enzymatic and biological structural roles.', colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50' },
  { number: 13, name: 'Aluminium', symbol: 'Al', category: 'Post-Transition Metal', weight: 26.982, group: 13, period: 3, summary: 'Silvery-white, lightweight, highly malleable metal with excellent corrosion-resistant oxides.', colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
  { number: 14, name: 'Silicon', symbol: 'Si', category: 'Metalloid', weight: 28.085, group: 14, period: 3, summary: 'Hard, crystalline metalloid playing a profound function in modern computer semiconductor electronics.', colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/50' },
  { number: 15, name: 'Phosphorus', symbol: 'P', category: 'Reactive Nonmetal', weight: 30.974, group: 15, period: 3, summary: 'Highly reactive mineral element fundamental to structural cellular energy storing molecules (ATP).', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 16, name: 'Sulfur', symbol: 'S', category: 'Reactive Nonmetal', weight: 32.06, group: 16, period: 3, summary: 'Abundantly yellow, nonmetallic crystalline solid playing elemental duties in natural volcanic venting.', colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
  { number: 17, name: 'Chlorine', symbol: 'Cl', category: 'Halogen', weight: 35.45, group: 17, period: 3, summary: 'Pale green-yellow gas with a sharp odor, strongly active agent used extensively in water purification.', colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
  { number: 18, name: 'Argon', symbol: 'Ar', category: 'Noble Gas', weight: 39.948, group: 18, period: 3, summary: 'The third most abundant gas in the atmosphere, commonly deployed inside double-pane glass windows.', colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' }
];
