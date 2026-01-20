/**
 * British National Curriculum - Geography Standards
 * Years 1-9 (Key Stages 1, 2, and 3)
 *
 * Source: GOV.UK National Curriculum in England
 * https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study/national-curriculum-in-england-geography-programmes-of-study
 *
 * VERIFIED: 2025-01-20 against official GOV.UK documentation
 *
 * Note: Geography is organised by Key Stage rather than individual year.
 * Standards are replicated across years within each Key Stage to maintain
 * consistency with the seeding system.
 *
 * Notation System: UK.KS{keyStage}.Y{year}.GEO.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1, 2, or 3)
 * - Y = Year (1-9)
 * - GEO = Geography
 * - Strand codes:
 *   All Key Stages:
 *   - LK = Locational Knowledge
 *   - PK = Place Knowledge
 *   - HPG = Human and Physical Geography
 *   - GS = Geographical Skills and Fieldwork
 *   KS3 Additional:
 *   - HPG.P = Physical Geography Processes
 *   - HPG.H = Human Geography Processes
 */

export interface BritishNCGeographyStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
}

export interface BritishNCGeographyYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCGeographyStandard[];
}

export interface BritishNCGeographyJurisdiction {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCGeographyYear[];
}

// =============================================================================
// KEY STAGE 1: YEARS 1-2 (Ages 5-7)
// Geography at KS1 inspires curiosity about the world and its people
// =============================================================================

const ks1Standards: BritishNCGeographyStandard[] = [
  // LOCATIONAL KNOWLEDGE
  {
    notation: 'UK.KS1.GEO.LK.1',
    strand: 'Locational Knowledge',
    description: 'name and locate the world\'s seven continents and five oceans',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.LK.2',
    strand: 'Locational Knowledge',
    description: 'name, locate and identify characteristics of the four countries and capital cities of the United Kingdom and its surrounding seas',
    isStatutory: true
  },

  // PLACE KNOWLEDGE
  {
    notation: 'UK.KS1.GEO.PK.1',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities and differences through studying the human and physical geography of a small area of the United Kingdom',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.PK.2',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities and differences through studying the human and physical geography of a small area in a contrasting non-European country',
    isStatutory: true
  },

  // HUMAN AND PHYSICAL GEOGRAPHY
  {
    notation: 'UK.KS1.GEO.HPG.1',
    strand: 'Human and Physical Geography',
    description: 'identify seasonal and daily weather patterns in the United Kingdom',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.HPG.2',
    strand: 'Human and Physical Geography',
    description: 'identify the location of hot and cold areas of the world in relation to the Equator and the North and South Poles',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.HPG.3',
    strand: 'Human and Physical Geography',
    description: 'use basic geographical vocabulary to refer to key physical features, including: beach, cliff, coast, forest, hill, mountain, sea, ocean, river, soil, valley, vegetation, season and weather',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.HPG.4',
    strand: 'Human and Physical Geography',
    description: 'use basic geographical vocabulary to refer to key human features, including: city, town, village, factory, farm, house, office, port, harbour and shop',
    isStatutory: true
  },

  // GEOGRAPHICAL SKILLS AND FIELDWORK
  {
    notation: 'UK.KS1.GEO.GS.1',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use world maps, atlases and globes to identify the United Kingdom and its countries, as well as the countries, continents and oceans studied at this key stage',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.GS.2',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use simple compass directions (North, South, East and West) and locational and directional language (e.g. near and far; left and right), to describe the location of features and routes on a map',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.GS.3',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use aerial photographs and plan perspectives to recognise landmarks and basic human and physical features',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.GS.4',
    strand: 'Geographical Skills and Fieldwork',
    description: 'devise a simple map; and use and construct basic symbols in a key',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.GEO.GS.5',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use simple fieldwork and observational skills to study the geography of their school and its grounds and the key human and physical features of its surrounding environment',
    isStatutory: true
  },

  // AIMS (applicable across all key stages)
  {
    notation: 'UK.KS1.GEO.AIM.1',
    strand: 'Aims',
    description: 'develop contextual knowledge of the location of globally significant places – both terrestrial and marine – including their defining physical and human characteristics and how these provide a geographical context for understanding the actions of processes',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS1.GEO.AIM.2',
    strand: 'Aims',
    description: 'understand the processes that give rise to key physical and human geographical features of the world, how these are interdependent and how they bring about spatial variation and change over time',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS1.GEO.AIM.3',
    strand: 'Aims',
    description: 'are competent in the geographical skills needed to: collect, analyse and communicate with a range of data gathered through experiences of fieldwork that deepen their understanding of geographical processes; interpret a range of sources of geographical information, including maps, diagrams, globes, aerial photographs and Geographical Information Systems (GIS); communicate geographical information in a variety of ways, including through maps, numerical and quantitative skills and writing at length',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  }
];

// Create year-specific standards with proper notation
const year1Standards: BritishNCGeographyStandard[] = ks1Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS1.GEO', 'UK.KS1.Y1.GEO')
}));

const year2Standards: BritishNCGeographyStandard[] = ks1Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS1.GEO', 'UK.KS1.Y2.GEO')
}));

// =============================================================================
// KEY STAGE 2: YEARS 3-6 (Ages 7-11)
// Geography at KS2 extends knowledge and understanding beyond the local area
// =============================================================================

const ks2Standards: BritishNCGeographyStandard[] = [
  // LOCATIONAL KNOWLEDGE
  {
    notation: 'UK.KS2.GEO.LK.1',
    strand: 'Locational Knowledge',
    description: 'locate the world\'s countries, using maps to focus on Europe (including the location of Russia) and North and South America, concentrating on their environmental regions, key physical and human characteristics, countries, and major cities',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.LK.2',
    strand: 'Locational Knowledge',
    description: 'name and locate counties and cities of the United Kingdom',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.LK.3',
    strand: 'Locational Knowledge',
    description: 'name and locate geographical regions and their identifying human and physical characteristics, key topographical features (including hills, mountains, coasts and rivers), and land-use patterns; and understand how some of these aspects have changed over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.LK.4',
    strand: 'Locational Knowledge',
    description: 'identify the position and significance of latitude, longitude, Equator, Northern Hemisphere, Southern Hemisphere, the Tropics of Cancer and Capricorn, Arctic and Antarctic Circle, the Prime/Greenwich Meridian and time zones (including day and night)',
    isStatutory: true
  },

  // PLACE KNOWLEDGE
  {
    notation: 'UK.KS2.GEO.PK.1',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities and differences through the study of human and physical geography of a region of the United Kingdom',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.PK.2',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities and differences through the study of human and physical geography of a region in a European country',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.PK.3',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities and differences through the study of human and physical geography of a region within North or South America',
    isStatutory: true
  },

  // HUMAN AND PHYSICAL GEOGRAPHY
  {
    notation: 'UK.KS2.GEO.HPG.1',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of physical geography, including: climate zones, biomes and vegetation belts',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.HPG.2',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of physical geography, including: rivers, mountains, volcanoes and earthquakes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.HPG.3',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of physical geography, including: the water cycle',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.HPG.4',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of human geography, including: types of settlement and land use',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.HPG.5',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of human geography, including: economic activity including trade links',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.HPG.6',
    strand: 'Human and Physical Geography',
    description: 'describe and understand key aspects of human geography, including: the distribution of natural resources including energy, food, minerals and water',
    isStatutory: true
  },

  // GEOGRAPHICAL SKILLS AND FIELDWORK
  {
    notation: 'UK.KS2.GEO.GS.1',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use maps, atlases, globes and digital/computer mapping to locate countries and describe features studied',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.GS.2',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use the eight points of a compass, four and six-figure grid references, symbols and key (including the use of Ordnance Survey maps) to build their knowledge of the United Kingdom and the wider world',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.GEO.GS.3',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use fieldwork to observe, measure, record and present the human and physical features in the local area using a range of methods, including sketch maps, plans and graphs, and digital technologies',
    isStatutory: true
  },

  // AIMS (applicable across all key stages)
  {
    notation: 'UK.KS2.GEO.AIM.1',
    strand: 'Aims',
    description: 'develop contextual knowledge of the location of globally significant places – both terrestrial and marine – including their defining physical and human characteristics and how these provide a geographical context for understanding the actions of processes',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS2.GEO.AIM.2',
    strand: 'Aims',
    description: 'understand the processes that give rise to key physical and human geographical features of the world, how these are interdependent and how they bring about spatial variation and change over time',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS2.GEO.AIM.3',
    strand: 'Aims',
    description: 'are competent in the geographical skills needed to: collect, analyse and communicate with a range of data gathered through experiences of fieldwork that deepen their understanding of geographical processes; interpret a range of sources of geographical information, including maps, diagrams, globes, aerial photographs and Geographical Information Systems (GIS); communicate geographical information in a variety of ways, including through maps, numerical and quantitative skills and writing at length',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  }
];

// Create year-specific standards with proper notation
const year3Standards: BritishNCGeographyStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.GEO', 'UK.KS2.Y3.GEO')
}));

const year4Standards: BritishNCGeographyStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.GEO', 'UK.KS2.Y4.GEO')
}));

const year5Standards: BritishNCGeographyStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.GEO', 'UK.KS2.Y5.GEO')
}));

const year6Standards: BritishNCGeographyStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.GEO', 'UK.KS2.Y6.GEO')
}));

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// Geography at KS3 builds on KS2 with deeper understanding of processes
// =============================================================================

const ks3Standards: BritishNCGeographyStandard[] = [
  // LOCATIONAL KNOWLEDGE
  {
    notation: 'UK.KS3.GEO.LK.1',
    strand: 'Locational Knowledge',
    description: 'extend their locational knowledge and deepen their spatial awareness of the world\'s countries using maps of the world to focus on Africa, Russia, Asia (including China and India), and the Middle East, focusing on their environmental regions, including polar and hot deserts, key physical and human characteristics, countries and major cities',
    isStatutory: true
  },

  // PLACE KNOWLEDGE
  {
    notation: 'UK.KS3.GEO.PK.1',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities, differences and links between places through the study of human and physical geography of a region within Africa',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.PK.2',
    strand: 'Place Knowledge',
    description: 'understand geographical similarities, differences and links between places through the study of human and physical geography of a region within Asia',
    isStatutory: true
  },

  // HUMAN AND PHYSICAL GEOGRAPHY - PHYSICAL PROCESSES
  {
    notation: 'UK.KS3.GEO.HPG.P.1',
    strand: 'Physical Geography - Geological Timescales',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: geological timescales and plate tectonics; rocks, weathering and soils',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.2',
    strand: 'Physical Geography - Plate Tectonics',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: plate tectonics',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.3',
    strand: 'Physical Geography - Rocks and Weathering',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: rocks, weathering and soils',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.4',
    strand: 'Physical Geography - Weather and Climate',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: weather and climate, including the change in climate from the Ice Age to the present',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.5',
    strand: 'Physical Geography - Glaciation',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: glaciation, hydrology and coasts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.6',
    strand: 'Physical Geography - Hydrology',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: hydrology and coasts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.P.7',
    strand: 'Physical Geography - Coasts',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in physical geography relating to: coasts',
    isStatutory: true
  },

  // HUMAN AND PHYSICAL GEOGRAPHY - HUMAN PROCESSES
  {
    notation: 'UK.KS3.GEO.HPG.H.1',
    strand: 'Human Geography - Population and Urbanisation',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in human geography relating to: population and urbanisation',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.H.2',
    strand: 'Human Geography - International Development',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in human geography relating to: international development',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.H.3',
    strand: 'Human Geography - Economic Activity',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in human geography relating to: economic activity in the primary, secondary, tertiary and quaternary sectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.HPG.H.4',
    strand: 'Human Geography - Resource Use',
    description: 'understand, through the use of detailed place-based exemplars at a variety of scales, the key processes in human geography relating to: the use of natural resources',
    isStatutory: true
  },

  // PHYSICAL-HUMAN INTERACTIONS
  {
    notation: 'UK.KS3.GEO.INT.1',
    strand: 'Physical-Human Interactions',
    description: 'understand how human and physical processes interact, and how they create distinctive human and physical landscapes, and how these can change over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.INT.2',
    strand: 'Physical-Human Interactions',
    description: 'understand how human activity relies on the effective functioning of natural systems',
    isStatutory: true
  },

  // GEOGRAPHICAL SKILLS AND FIELDWORK
  {
    notation: 'UK.KS3.GEO.GS.1',
    strand: 'Geographical Skills and Fieldwork',
    description: 'build on their knowledge of globes, maps and atlases, and apply and develop this knowledge routinely in the classroom and in the field',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.GS.2',
    strand: 'Geographical Skills and Fieldwork',
    description: 'interpret Ordnance Survey maps in the classroom and the field, including using grid references and scale, topographical and other thematic mapping, and aerial and satellite photographs',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.GS.3',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use Geographical Information Systems (GIS) to view, analyse and interpret places and data',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.GEO.GS.4',
    strand: 'Geographical Skills and Fieldwork',
    description: 'use fieldwork in contrasting locations to collect, analyse and draw conclusions from geographical data, using multiple sources of increasingly complex information',
    isStatutory: true
  },

  // AIMS (applicable across all key stages)
  {
    notation: 'UK.KS3.GEO.AIM.1',
    strand: 'Aims',
    description: 'develop contextual knowledge of the location of globally significant places – both terrestrial and marine – including their defining physical and human characteristics and how these provide a geographical context for understanding the actions of processes',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS3.GEO.AIM.2',
    strand: 'Aims',
    description: 'understand the processes that give rise to key physical and human geographical features of the world, how these are interdependent and how they bring about spatial variation and change over time',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  },
  {
    notation: 'UK.KS3.GEO.AIM.3',
    strand: 'Aims',
    description: 'are competent in the geographical skills needed to: collect, analyse and communicate with a range of data gathered through experiences of fieldwork that deepen their understanding of geographical processes; interpret a range of sources of geographical information, including maps, diagrams, globes, aerial photographs and Geographical Information Systems (GIS); communicate geographical information in a variety of ways, including through maps, numerical and quantitative skills and writing at length',
    isStatutory: true,
    guidance: 'Aim from NC Programme of Study'
  }
];

// Create year-specific standards with proper notation
const year7Standards: BritishNCGeographyStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.GEO', 'UK.KS3.Y7.GEO')
}));

const year8Standards: BritishNCGeographyStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.GEO', 'UK.KS3.Y8.GEO')
}));

const year9Standards: BritishNCGeographyStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.GEO', 'UK.KS3.Y9.GEO')
}));

// =============================================================================
// BRITISH NATIONAL CURRICULUM GEOGRAPHY DATA EXPORT
// =============================================================================

export const britishNCGeography: BritishNCGeographyJurisdiction = {
  code: 'UK_NATIONAL_CURRICULUM',
  name: 'British National Curriculum - Geography',
  country: 'GB',
  version: '2014 (verified January 2025)',
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-geography-programmes-of-study/national-curriculum-in-england-geography-programmes-of-study',
  years: [
    { year: 1, keyStage: 1, ageRangeMin: 5, ageRangeMax: 6, standards: year1Standards },
    { year: 2, keyStage: 1, ageRangeMin: 6, ageRangeMax: 7, standards: year2Standards },
    { year: 3, keyStage: 2, ageRangeMin: 7, ageRangeMax: 8, standards: year3Standards },
    { year: 4, keyStage: 2, ageRangeMin: 8, ageRangeMax: 9, standards: year4Standards },
    { year: 5, keyStage: 2, ageRangeMin: 9, ageRangeMax: 10, standards: year5Standards },
    { year: 6, keyStage: 2, ageRangeMin: 10, ageRangeMax: 11, standards: year6Standards },
    { year: 7, keyStage: 3, ageRangeMin: 11, ageRangeMax: 12, standards: year7Standards },
    { year: 8, keyStage: 3, ageRangeMin: 12, ageRangeMax: 13, standards: year8Standards },
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards }
  ]
};

// Helper functions
export function getGeographyStandardsForYear(year: number): BritishNCGeographyStandard[] {
  const yearData = britishNCGeography.years.find(y => y.year === year);
  return yearData?.standards || [];
}

export function getGeographyStandardsForKeyStage(keyStage: number): BritishNCGeographyStandard[] {
  return britishNCGeography.years
    .filter(y => y.keyStage === keyStage)
    .flatMap(y => y.standards);
}

export function getTotalGeographyStandardsCount(): number {
  return britishNCGeography.years.reduce((sum, y) => sum + y.standards.length, 0);
}

export default britishNCGeography;
