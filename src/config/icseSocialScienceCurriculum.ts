/**
 * ICSE (Indian Certificate of Secondary Education) - Social Science Standards
 * Classes 3-12 (Primary, Middle, Secondary, and Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CISCE curriculum
 * framework. Standards focus on measurable learning outcomes.
 *
 * Structure:
 *   Classes 3-5: Social Studies (integrated: History, Civics, Geography)
 *   Classes 6-8: Full Social Studies (History, Civics, Geography as three strands)
 *   Classes 9-10 (ICSE): H.C.G. subject with two papers:
 *     - Paper 1: History and Civics
 *     - Paper 2: Geography
 *   Classes 11-12 (ISC Humanities): History, Geography, Political Science,
 *     and Economics as separate subjects (only the most commonly-taught ones
 *     are covered here).
 *
 * Sourcing:
 *   Classes 3-8: Selina/Frank CISCE-aligned primary Social Studies textbooks
 *     (the de facto ICSE primary curriculum).
 *   Classes 9-10: CISCE ICSE 2028 H.C.G. syllabi:
 *     https://cisce.org/wp-content/uploads/2026/01/5.-History-Civics.pdf
 *     https://cisce.org/wp-content/uploads/2026/01/6.-Geography.pdf
 *   Classes 11-12: CISCE ISC 2028 History, Geography, Political Science, Economics.
 *
 * Subject: Mapped to Prisma Subject enum "SOCIAL_STUDIES".
 *
 * Notation System: IN.ICSE.C{class}.SS.{strand}.{number}
 * - Strand codes:
 *   Classes 3-5:
 *   - FAM = Family and Community
 *   - ENV = Environment and Resources
 *   - TRV = Travel and Communication
 *   - HIS = History and Heritage
 *   - MAP = Maps and Directions
 *   Classes 6-8:
 *   - HIS = History
 *   - GEO = Geography
 *   - CIV = Civics
 *   Classes 9-10:
 *   - HIS = History (HCG Paper 1 Part 1)
 *   - CIV = Civics (HCG Paper 1 Part 2)
 *   - GEO = Geography (HCG Paper 2)
 *   Classes 11-12:
 *   - HIS = History
 *   - GEO = Geography
 *   - POL = Political Science
 *   - ECO = Economics
 */

export interface ICSESocialScienceStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string;
}

export interface ICSESocialScienceClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: ICSESocialScienceStandard[];
}

export interface ICSESocialScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: ICSESocialScienceClass[];
}

// =============================================================================
// CLASS 3 (Ages 8-9)
// =============================================================================

const class3Standards: ICSESocialScienceStandard[] = [
  { notation: 'IN.ICSE.C3.SS.FAM.1', strand: 'Family and Community', description: 'identify members of a nuclear and joint family' },
  { notation: 'IN.ICSE.C3.SS.FAM.2', strand: 'Family and Community', description: 'describe roles of different family members' },
  { notation: 'IN.ICSE.C3.SS.FAM.3', strand: 'Family and Community', description: 'identify common community helpers and their contributions' },
  { notation: 'IN.ICSE.C3.SS.FAM.4', strand: 'Family and Community', description: 'describe festivals celebrated in India and by different communities' },
  { notation: 'IN.ICSE.C3.SS.ENV.1', strand: 'Environment and Resources', description: 'identify natural resources: air, water, soil, minerals' },
  { notation: 'IN.ICSE.C3.SS.ENV.2', strand: 'Environment and Resources', description: 'describe the importance of trees and forests' },
  { notation: 'IN.ICSE.C3.SS.ENV.3', strand: 'Environment and Resources', description: 'describe different types of homes in urban and rural areas' },
  { notation: 'IN.ICSE.C3.SS.TRV.1', strand: 'Travel and Communication', description: 'identify various means of transport by land, water, and air' },
  { notation: 'IN.ICSE.C3.SS.TRV.2', strand: 'Travel and Communication', description: 'identify means of communication: post, telephone, radio, TV' },
  { notation: 'IN.ICSE.C3.SS.HIS.1', strand: 'History and Heritage', description: 'describe the concept of past, present, and future' },
  { notation: 'IN.ICSE.C3.SS.HIS.2', strand: 'History and Heritage', description: 'identify famous historical monuments in India' },
  { notation: 'IN.ICSE.C3.SS.MAP.1', strand: 'Maps and Directions', description: 'identify the four main directions: north, south, east, west' },
  { notation: 'IN.ICSE.C3.SS.MAP.2', strand: 'Maps and Directions', description: 'read simple maps using symbols and a legend' }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// =============================================================================

const class4Standards: ICSESocialScienceStandard[] = [
  { notation: 'IN.ICSE.C4.SS.FAM.1', strand: 'Our Country', description: 'identify India as a country and name its capital' },
  { notation: 'IN.ICSE.C4.SS.FAM.2', strand: 'Our Country', description: 'identify national symbols: flag, emblem, anthem, song, animal, bird' },
  { notation: 'IN.ICSE.C4.SS.FAM.3', strand: 'Our Country', description: 'identify states and union territories of India on a political map' },
  { notation: 'IN.ICSE.C4.SS.ENV.1', strand: 'Physical Features', description: 'describe the main physical features of India: mountains, plains, plateaus, deserts, coasts' },
  { notation: 'IN.ICSE.C4.SS.ENV.2', strand: 'Physical Features', description: 'name the major rivers of India' },
  { notation: 'IN.ICSE.C4.SS.ENV.3', strand: 'Physical Features', description: 'describe seasons in India and their effect on daily life' },
  { notation: 'IN.ICSE.C4.SS.HIS.1', strand: 'Our Heritage', description: 'identify ancient civilizations of India: Harappa and Mohenjo-Daro' },
  { notation: 'IN.ICSE.C4.SS.HIS.2', strand: 'Our Heritage', description: 'identify famous kings and empires of India: Ashoka, Akbar' },
  { notation: 'IN.ICSE.C4.SS.HIS.3', strand: 'Our Heritage', description: 'describe freedom fighters and the Indian independence movement' },
  { notation: 'IN.ICSE.C4.SS.MAP.1', strand: 'Maps and Globe', description: 'distinguish between a map and a globe' },
  { notation: 'IN.ICSE.C4.SS.MAP.2', strand: 'Maps and Globe', description: 'identify continents and oceans on a world map' },
  { notation: 'IN.ICSE.C4.SS.MAP.3', strand: 'Maps and Globe', description: 'identify the equator, tropics, and poles on a globe' },
  { notation: 'IN.ICSE.C4.SS.TRV.1', strand: 'Transport and Communication', description: 'describe modern means of communication: email, mobile phones, internet' },
  { notation: 'IN.ICSE.C4.SS.TRV.2', strand: 'Transport and Communication', description: 'describe how communication has evolved over time' },
  { notation: 'IN.ICSE.C4.SS.FAM.4', strand: 'Occupations', description: 'identify different occupations in rural and urban India' }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// =============================================================================

const class5Standards: ICSESocialScienceStandard[] = [
  { notation: 'IN.ICSE.C5.SS.MAP.1', strand: 'Earth and Maps', description: 'describe the shape and motions of the Earth' },
  { notation: 'IN.ICSE.C5.SS.MAP.2', strand: 'Earth and Maps', description: 'identify latitudes, longitudes, and time zones' },
  { notation: 'IN.ICSE.C5.SS.MAP.3', strand: 'Earth and Maps', description: 'explain day and night, and changes of seasons' },
  { notation: 'IN.ICSE.C5.SS.ENV.1', strand: 'Continents', description: 'describe physical features and climate of each continent' },
  { notation: 'IN.ICSE.C5.SS.ENV.2', strand: 'Continents', description: 'identify major countries, rivers, and mountains on each continent' },
  { notation: 'IN.ICSE.C5.SS.ENV.3', strand: 'Natural Resources', description: 'describe water, air, land, and minerals as natural resources' },
  { notation: 'IN.ICSE.C5.SS.ENV.4', strand: 'Natural Resources', description: 'describe conservation of natural resources' },
  { notation: 'IN.ICSE.C5.SS.HIS.1', strand: 'Early Civilizations', description: 'describe early civilizations: Egyptian, Mesopotamian, Chinese, Indus Valley' },
  { notation: 'IN.ICSE.C5.SS.HIS.2', strand: 'Early Civilizations', description: 'describe contributions of ancient civilizations to modern life' },
  { notation: 'IN.ICSE.C5.SS.HIS.3', strand: 'India Through the Ages', description: 'describe major periods of Indian history' },
  { notation: 'IN.ICSE.C5.SS.HIS.4', strand: 'India Through the Ages', description: 'describe rulers and dynasties that shaped India' },
  { notation: 'IN.ICSE.C5.SS.FAM.1', strand: 'Government and Citizenship', description: 'describe the concept of government and why it is needed' },
  { notation: 'IN.ICSE.C5.SS.FAM.2', strand: 'Government and Citizenship', description: 'identify rights and duties of a citizen' },
  { notation: 'IN.ICSE.C5.SS.FAM.3', strand: 'Government and Citizenship', description: 'describe the role of elections and voting' },
  { notation: 'IN.ICSE.C5.SS.FAM.4', strand: 'United Nations', description: 'describe the United Nations and its role in world peace' }
];

// =============================================================================
// CLASS 6 (Ages 11-12) - History, Civics, Geography
// =============================================================================

const class6Standards: ICSESocialScienceStandard[] = [
  // HISTORY
  { notation: 'IN.ICSE.C6.SS.HIS.1', strand: 'History - The Study of the Past', description: 'describe sources of history: archaeological, literary, and oral' },
  { notation: 'IN.ICSE.C6.SS.HIS.2', strand: 'History - The Study of the Past', description: 'describe chronology and how historians measure time' },
  { notation: 'IN.ICSE.C6.SS.HIS.3', strand: 'History - Early Man', description: 'describe life of early humans: hunter-gatherers, food producers' },
  { notation: 'IN.ICSE.C6.SS.HIS.4', strand: 'History - Indus Valley Civilisation', description: 'describe features of the Indus Valley Civilization' },
  { notation: 'IN.ICSE.C6.SS.HIS.5', strand: 'History - Vedic Period', description: 'describe Vedic Age: society, religion, and daily life' },
  { notation: 'IN.ICSE.C6.SS.HIS.6', strand: 'History - Ancient India', description: 'describe Jainism and Buddhism: founders, teachings, and spread' },
  { notation: 'IN.ICSE.C6.SS.HIS.7', strand: 'History - Ancient India', description: 'describe the Mauryan Empire and Ashoka\'s dhamma' },
  { notation: 'IN.ICSE.C6.SS.HIS.8', strand: 'History - Ancient India', description: 'describe the Gupta period as the Golden Age of India' },

  // CIVICS
  { notation: 'IN.ICSE.C6.SS.CIV.1', strand: 'Civics - Rural Local Self-Government', description: 'describe Panchayati Raj institutions: Gram Panchayat, Panchayat Samiti, Zila Parishad' },
  { notation: 'IN.ICSE.C6.SS.CIV.2', strand: 'Civics - Rural Local Self-Government', description: 'describe functions of village panchayats' },
  { notation: 'IN.ICSE.C6.SS.CIV.3', strand: 'Civics - Urban Local Self-Government', description: 'describe urban local bodies: municipalities and municipal corporations' },
  { notation: 'IN.ICSE.C6.SS.CIV.4', strand: 'Civics - Urban Local Self-Government', description: 'describe functions of urban local bodies' },

  // GEOGRAPHY
  { notation: 'IN.ICSE.C6.SS.GEO.1', strand: 'Geography - Earth', description: 'describe the Earth as a planet and its position in the solar system' },
  { notation: 'IN.ICSE.C6.SS.GEO.2', strand: 'Geography - Earth', description: 'describe the structure of the Earth: crust, mantle, core' },
  { notation: 'IN.ICSE.C6.SS.GEO.3', strand: 'Geography - Earth', description: 'describe latitudes and longitudes and locate places' },
  { notation: 'IN.ICSE.C6.SS.GEO.4', strand: 'Geography - Earth', description: 'describe rotation and revolution of Earth and their effects' },
  { notation: 'IN.ICSE.C6.SS.GEO.5', strand: 'Geography - Landforms', description: 'describe landforms: mountains, plateaus, plains, deserts' },
  { notation: 'IN.ICSE.C6.SS.GEO.6', strand: 'Geography - Landforms', description: 'describe formation of landforms by internal and external forces' },
  { notation: 'IN.ICSE.C6.SS.GEO.7', strand: 'Geography - Water Bodies', description: 'describe oceans, seas, rivers, and lakes' },
  { notation: 'IN.ICSE.C6.SS.GEO.8', strand: 'Geography - Atmosphere', description: 'describe composition and layers of the atmosphere' },
  { notation: 'IN.ICSE.C6.SS.GEO.9', strand: 'Geography - Maps', description: 'read different types of maps: physical, political, thematic' },
  { notation: 'IN.ICSE.C6.SS.GEO.10', strand: 'Geography - Maps', description: 'use scale, direction, and symbols on maps' }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// =============================================================================

const class7Standards: ICSESocialScienceStandard[] = [
  // HISTORY
  { notation: 'IN.ICSE.C7.SS.HIS.1', strand: 'History - Medieval India', description: 'describe sources of medieval Indian history' },
  { notation: 'IN.ICSE.C7.SS.HIS.2', strand: 'History - Medieval India', description: 'describe the Delhi Sultanate: rulers and administration' },
  { notation: 'IN.ICSE.C7.SS.HIS.3', strand: 'History - Medieval India', description: 'describe the Vijayanagar and Bahmani kingdoms' },
  { notation: 'IN.ICSE.C7.SS.HIS.4', strand: 'History - Mughal Empire', description: 'describe the founding of the Mughal Empire by Babur' },
  { notation: 'IN.ICSE.C7.SS.HIS.5', strand: 'History - Mughal Empire', description: 'describe the reigns of Akbar, Shah Jahan, and Aurangzeb' },
  { notation: 'IN.ICSE.C7.SS.HIS.6', strand: 'History - Mughal Empire', description: 'describe Mughal administration, culture, and architecture' },
  { notation: 'IN.ICSE.C7.SS.HIS.7', strand: 'History - Bhakti and Sufi Movements', description: 'describe bhakti and sufi movements and their contributions' },
  { notation: 'IN.ICSE.C7.SS.HIS.8', strand: 'History - Marathas', description: 'describe rise of the Marathas under Shivaji' },

  // CIVICS
  { notation: 'IN.ICSE.C7.SS.CIV.1', strand: 'Civics - State Government', description: 'describe structure of state legislature: Legislative Assembly and Council' },
  { notation: 'IN.ICSE.C7.SS.CIV.2', strand: 'Civics - State Government', description: 'describe functions of Chief Minister and Council of Ministers' },
  { notation: 'IN.ICSE.C7.SS.CIV.3', strand: 'Civics - State Government', description: 'describe the role of the Governor in a state' },
  { notation: 'IN.ICSE.C7.SS.CIV.4', strand: 'Civics - State Judiciary', description: 'describe the state judiciary: High Court and subordinate courts' },

  // GEOGRAPHY
  { notation: 'IN.ICSE.C7.SS.GEO.1', strand: 'Geography - Atmosphere and Climate', description: 'describe weather, climate, and factors influencing climate' },
  { notation: 'IN.ICSE.C7.SS.GEO.2', strand: 'Geography - Atmosphere and Climate', description: 'describe temperature, pressure, winds, and rainfall patterns' },
  { notation: 'IN.ICSE.C7.SS.GEO.3', strand: 'Geography - Natural Vegetation', description: 'classify natural vegetation types: forests, grasslands, deserts, tundra' },
  { notation: 'IN.ICSE.C7.SS.GEO.4', strand: 'Geography - Wildlife', description: 'describe wildlife in different climatic regions' },
  { notation: 'IN.ICSE.C7.SS.GEO.5', strand: 'Geography - Continents', description: 'describe physical features of Africa, Europe, and Asia' },
  { notation: 'IN.ICSE.C7.SS.GEO.6', strand: 'Geography - Continents', description: 'describe major countries and cultural regions of the continents' },
  { notation: 'IN.ICSE.C7.SS.GEO.7', strand: 'Geography - Human Environment', description: 'describe human adaptation to different environments' },
  { notation: 'IN.ICSE.C7.SS.GEO.8', strand: 'Geography - Rocks and Minerals', description: 'classify rocks as igneous, sedimentary, and metamorphic' },
  { notation: 'IN.ICSE.C7.SS.GEO.9', strand: 'Geography - Pollution', description: 'describe types of pollution and their effects on environment' }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// =============================================================================

const class8Standards: ICSESocialScienceStandard[] = [
  // HISTORY
  { notation: 'IN.ICSE.C8.SS.HIS.1', strand: 'History - Modern India', description: 'describe decline of the Mughal Empire and rise of regional powers' },
  { notation: 'IN.ICSE.C8.SS.HIS.2', strand: 'History - Modern India', description: 'describe the coming of the Europeans: Portuguese, Dutch, French, British' },
  { notation: 'IN.ICSE.C8.SS.HIS.3', strand: 'History - Modern India', description: 'describe the establishment of British rule: Battles of Plassey and Buxar' },
  { notation: 'IN.ICSE.C8.SS.HIS.4', strand: 'History - Modern India', description: 'describe British economic policies and their impact on India' },
  { notation: 'IN.ICSE.C8.SS.HIS.5', strand: 'History - Revolt of 1857', description: 'describe causes, course, and effects of the Revolt of 1857' },
  { notation: 'IN.ICSE.C8.SS.HIS.6', strand: 'History - Freedom Movement', description: 'describe rise of Indian nationalism and the Indian National Congress' },
  { notation: 'IN.ICSE.C8.SS.HIS.7', strand: 'History - Freedom Movement', description: 'describe moderate and extremist phases of the freedom movement' },
  { notation: 'IN.ICSE.C8.SS.HIS.8', strand: 'History - Freedom Movement', description: 'describe Mahatma Gandhi and his role in the freedom movement' },
  { notation: 'IN.ICSE.C8.SS.HIS.9', strand: 'History - Freedom Movement', description: 'describe Non-Cooperation, Civil Disobedience, and Quit India movements' },
  { notation: 'IN.ICSE.C8.SS.HIS.10', strand: 'History - Independence', description: 'describe events leading to independence and partition of India' },

  // CIVICS
  { notation: 'IN.ICSE.C8.SS.CIV.1', strand: 'Civics - Indian Constitution', description: 'describe the making of the Indian Constitution' },
  { notation: 'IN.ICSE.C8.SS.CIV.2', strand: 'Civics - Indian Constitution', description: 'describe the Preamble and salient features of the Constitution' },
  { notation: 'IN.ICSE.C8.SS.CIV.3', strand: 'Civics - Indian Constitution', description: 'list and describe Fundamental Rights' },
  { notation: 'IN.ICSE.C8.SS.CIV.4', strand: 'Civics - Indian Constitution', description: 'describe Fundamental Duties and Directive Principles' },
  { notation: 'IN.ICSE.C8.SS.CIV.5', strand: 'Civics - Union Government', description: 'describe the structure of the Union Legislature: Lok Sabha and Rajya Sabha' },
  { notation: 'IN.ICSE.C8.SS.CIV.6', strand: 'Civics - Union Government', description: 'describe the role of the President and Prime Minister' },
  { notation: 'IN.ICSE.C8.SS.CIV.7', strand: 'Civics - Union Government', description: 'describe the Union Judiciary: Supreme Court and its functions' },

  // GEOGRAPHY
  { notation: 'IN.ICSE.C8.SS.GEO.1', strand: 'Geography - Resources', description: 'classify resources as renewable and non-renewable' },
  { notation: 'IN.ICSE.C8.SS.GEO.2', strand: 'Geography - Agriculture', description: 'describe types of agriculture and major crops of India' },
  { notation: 'IN.ICSE.C8.SS.GEO.3', strand: 'Geography - Industries', description: 'classify industries by raw materials, size, and ownership' },
  { notation: 'IN.ICSE.C8.SS.GEO.4', strand: 'Geography - Industries', description: 'describe major industries of India: iron, steel, cotton, textile' },
  { notation: 'IN.ICSE.C8.SS.GEO.5', strand: 'Geography - Human Resources', description: 'describe population distribution, density, and growth' },
  { notation: 'IN.ICSE.C8.SS.GEO.6', strand: 'Geography - Human Resources', description: 'describe factors affecting population distribution' },
  { notation: 'IN.ICSE.C8.SS.GEO.7', strand: 'Geography - Natural Disasters', description: 'describe types of natural disasters: earthquakes, floods, droughts, cyclones' },
  { notation: 'IN.ICSE.C8.SS.GEO.8', strand: 'Geography - Natural Disasters', description: 'describe preparation and management during natural disasters' },
  { notation: 'IN.ICSE.C8.SS.GEO.9', strand: 'Geography - Environment', description: 'describe environmental issues: deforestation, pollution, climate change' }
];

// =============================================================================
// CLASS 9 (Ages 14-15) - H.C.G. (History, Civics, Geography)
// Source: CISCE ICSE 2028 H.C.G. syllabi
// =============================================================================

const class9Standards: ICSESocialScienceStandard[] = [
  // HISTORY (Paper 1)
  { notation: 'IN.ICSE.C9.SS.HIS.1', strand: 'History - Indus Valley', description: 'describe the Indus Valley Civilisation: city planning, economy, religion, and decline' },
  { notation: 'IN.ICSE.C9.SS.HIS.2', strand: 'History - Vedic Period', description: 'describe Vedic Age: early and later Vedic society, polity, and religion' },
  { notation: 'IN.ICSE.C9.SS.HIS.3', strand: 'History - Jainism and Buddhism', description: 'describe rise of Jainism and Buddhism: causes, teachings, and spread' },
  { notation: 'IN.ICSE.C9.SS.HIS.4', strand: 'History - Mauryan Empire', description: 'describe the Mauryan Empire under Chandragupta and Ashoka' },
  { notation: 'IN.ICSE.C9.SS.HIS.5', strand: 'History - Mauryan Empire', description: 'describe Mauryan administration, economy, and contribution to art and literature' },
  { notation: 'IN.ICSE.C9.SS.HIS.6', strand: 'History - Gupta Empire', description: 'describe the Gupta Empire as a classical age: rulers and achievements' },
  { notation: 'IN.ICSE.C9.SS.HIS.7', strand: 'History - Gupta Empire', description: 'describe contributions of Gupta period to art, literature, and science' },
  { notation: 'IN.ICSE.C9.SS.HIS.8', strand: 'History - Delhi Sultanate', description: 'describe the founding of the Delhi Sultanate' },
  { notation: 'IN.ICSE.C9.SS.HIS.9', strand: 'History - Mughal Empire', description: 'describe the Mughal Empire under Akbar\'s administration and religious policy' },
  { notation: 'IN.ICSE.C9.SS.HIS.10', strand: 'History - Mughal Empire', description: 'describe the cultural contribution of the Mughals including architecture' },

  // CIVICS (Paper 1)
  { notation: 'IN.ICSE.C9.SS.CIV.1', strand: 'Civics - Constitution', description: 'describe our Constitution, its preamble, and basic features' },
  { notation: 'IN.ICSE.C9.SS.CIV.2', strand: 'Civics - Constitution', description: 'list Fundamental Rights and Fundamental Duties of citizens' },
  { notation: 'IN.ICSE.C9.SS.CIV.3', strand: 'Civics - Constitution', description: 'describe Directive Principles of State Policy' },
  { notation: 'IN.ICSE.C9.SS.CIV.4', strand: 'Civics - Elections', description: 'describe the electoral process in India and role of Election Commission' },
  { notation: 'IN.ICSE.C9.SS.CIV.5', strand: 'Civics - Local Self Government', description: 'describe rural local government: Panchayati Raj' },
  { notation: 'IN.ICSE.C9.SS.CIV.6', strand: 'Civics - Local Self Government', description: 'describe urban local government: municipalities and municipal corporations' },

  // GEOGRAPHY (Paper 2)
  { notation: 'IN.ICSE.C9.SS.GEO.1', strand: 'Geography - Earth as a Planet', description: 'describe the shape, size, and movements of the Earth' },
  { notation: 'IN.ICSE.C9.SS.GEO.2', strand: 'Geography - Earth as a Planet', description: 'describe latitudes, longitudes, and time zones' },
  { notation: 'IN.ICSE.C9.SS.GEO.3', strand: 'Geography - Lithosphere', description: 'describe structure of the Earth: crust, mantle, core' },
  { notation: 'IN.ICSE.C9.SS.GEO.4', strand: 'Geography - Lithosphere', description: 'describe rocks, minerals, and weathering processes' },
  { notation: 'IN.ICSE.C9.SS.GEO.5', strand: 'Geography - Lithosphere', description: 'describe plate tectonics, earthquakes, and volcanoes' },
  { notation: 'IN.ICSE.C9.SS.GEO.6', strand: 'Geography - Lithosphere', description: 'describe landforms created by rivers, glaciers, wind, and waves' },
  { notation: 'IN.ICSE.C9.SS.GEO.7', strand: 'Geography - Hydrosphere', description: 'describe the water cycle and distribution of water on Earth' },
  { notation: 'IN.ICSE.C9.SS.GEO.8', strand: 'Geography - Hydrosphere', description: 'describe ocean currents, tides, and their effects' },
  { notation: 'IN.ICSE.C9.SS.GEO.9', strand: 'Geography - Atmosphere', description: 'describe composition and layers of the atmosphere' },
  { notation: 'IN.ICSE.C9.SS.GEO.10', strand: 'Geography - Atmosphere', description: 'describe insolation, temperature, pressure, and wind systems' },
  { notation: 'IN.ICSE.C9.SS.GEO.11', strand: 'Geography - Atmosphere', description: 'describe humidity, condensation, and types of precipitation' },
  { notation: 'IN.ICSE.C9.SS.GEO.12', strand: 'Geography - Atmosphere', description: 'describe pollution of the atmosphere and its impact' },
  { notation: 'IN.ICSE.C9.SS.GEO.13', strand: 'Geography - Natural Regions', description: 'identify and describe the world\'s natural regions and their characteristics' },
  { notation: 'IN.ICSE.C9.SS.GEO.14', strand: 'Geography - Map Work', description: 'interpret and complete map-work exercises on the world map' }
];

// =============================================================================
// CLASS 10 (Ages 15-16) - H.C.G. Board Examination
// =============================================================================

const class10Standards: ICSESocialScienceStandard[] = [
  // HISTORY (Paper 1 Part 1) - Modern India and Contemporary World
  { notation: 'IN.ICSE.C10.SS.HIS.1', strand: 'History - First War of Independence 1857', description: 'describe causes of the First War of Independence 1857' },
  { notation: 'IN.ICSE.C10.SS.HIS.2', strand: 'History - First War of Independence 1857', description: 'describe the course and failure of the 1857 Revolt' },
  { notation: 'IN.ICSE.C10.SS.HIS.3', strand: 'History - First War of Independence 1857', description: 'describe consequences of the revolt and change in British policy' },
  { notation: 'IN.ICSE.C10.SS.HIS.4', strand: 'History - Growth of Nationalism', description: 'describe factors leading to the rise of Indian nationalism' },
  { notation: 'IN.ICSE.C10.SS.HIS.5', strand: 'History - Growth of Nationalism', description: 'describe the founding and early phase of the Indian National Congress' },
  { notation: 'IN.ICSE.C10.SS.HIS.6', strand: 'History - Growth of Nationalism', description: 'describe moderate and extremist phases of the nationalist movement' },
  { notation: 'IN.ICSE.C10.SS.HIS.7', strand: 'History - Partition of Bengal', description: 'describe the Partition of Bengal and the Swadeshi Movement' },
  { notation: 'IN.ICSE.C10.SS.HIS.8', strand: 'History - Revolutionary Movement', description: 'describe the revolutionary movement in India and abroad' },
  { notation: 'IN.ICSE.C10.SS.HIS.9', strand: 'History - Muslim League', description: 'describe the formation of the Muslim League and its early objectives' },
  { notation: 'IN.ICSE.C10.SS.HIS.10', strand: 'History - Mass Phase', description: 'describe Gandhi\'s principles and the Non-Cooperation Movement' },
  { notation: 'IN.ICSE.C10.SS.HIS.11', strand: 'History - Mass Phase', description: 'describe the Civil Disobedience Movement and the Salt Satyagraha' },
  { notation: 'IN.ICSE.C10.SS.HIS.12', strand: 'History - Mass Phase', description: 'describe the Quit India Movement and the role of INA' },
  { notation: 'IN.ICSE.C10.SS.HIS.13', strand: 'History - Independence and Partition', description: 'describe the events leading to Indian independence and partition' },
  { notation: 'IN.ICSE.C10.SS.HIS.14', strand: 'History - Contemporary World', description: 'describe the rise of dictatorships: Nazism and Fascism' },
  { notation: 'IN.ICSE.C10.SS.HIS.15', strand: 'History - Contemporary World', description: 'describe causes and consequences of the First World War' },
  { notation: 'IN.ICSE.C10.SS.HIS.16', strand: 'History - Contemporary World', description: 'describe causes and consequences of the Second World War' },
  { notation: 'IN.ICSE.C10.SS.HIS.17', strand: 'History - Contemporary World', description: 'describe the United Nations: agencies and functions' },
  { notation: 'IN.ICSE.C10.SS.HIS.18', strand: 'History - Contemporary World', description: 'describe the Cold War and non-aligned movement' },

  // CIVICS (Paper 1 Part 2) - Union and State Legislature
  { notation: 'IN.ICSE.C10.SS.CIV.1', strand: 'Civics - Union Legislature', description: 'describe the composition and powers of Lok Sabha' },
  { notation: 'IN.ICSE.C10.SS.CIV.2', strand: 'Civics - Union Legislature', description: 'describe the composition and powers of Rajya Sabha' },
  { notation: 'IN.ICSE.C10.SS.CIV.3', strand: 'Civics - Union Legislature', description: 'describe legislative procedures in Parliament including bill passing' },
  { notation: 'IN.ICSE.C10.SS.CIV.4', strand: 'Civics - Union Executive', description: 'describe powers and functions of the President of India' },
  { notation: 'IN.ICSE.C10.SS.CIV.5', strand: 'Civics - Union Executive', description: 'describe powers and functions of the Prime Minister and Council of Ministers' },
  { notation: 'IN.ICSE.C10.SS.CIV.6', strand: 'Civics - State Government', description: 'describe structure and functions of the State Legislature' },
  { notation: 'IN.ICSE.C10.SS.CIV.7', strand: 'Civics - State Government', description: 'describe powers and functions of the Governor and Chief Minister' },
  { notation: 'IN.ICSE.C10.SS.CIV.8', strand: 'Civics - Judiciary', description: 'describe structure of the Indian judiciary: Supreme Court, High Courts, subordinate courts' },
  { notation: 'IN.ICSE.C10.SS.CIV.9', strand: 'Civics - Judiciary', description: 'describe powers and functions of the Supreme Court' },

  // GEOGRAPHY (Paper 2)
  { notation: 'IN.ICSE.C10.SS.GEO.1', strand: 'Geography - Location and Physical Features', description: 'describe the location, size, and physical divisions of India' },
  { notation: 'IN.ICSE.C10.SS.GEO.2', strand: 'Geography - Climate', description: 'describe factors affecting the climate of India' },
  { notation: 'IN.ICSE.C10.SS.GEO.3', strand: 'Geography - Climate', description: 'describe the Indian monsoon mechanism and its importance' },
  { notation: 'IN.ICSE.C10.SS.GEO.4', strand: 'Geography - Climate', description: 'describe seasons of India and their characteristics' },
  { notation: 'IN.ICSE.C10.SS.GEO.5', strand: 'Geography - Soil', description: 'classify types of soils in India and their characteristics' },
  { notation: 'IN.ICSE.C10.SS.GEO.6', strand: 'Geography - Soil', description: 'describe soil erosion, causes, and conservation methods' },
  { notation: 'IN.ICSE.C10.SS.GEO.7', strand: 'Geography - Natural Vegetation', description: 'classify natural vegetation of India' },
  { notation: 'IN.ICSE.C10.SS.GEO.8', strand: 'Geography - Water Resources', description: 'describe water resources and need for their conservation' },
  { notation: 'IN.ICSE.C10.SS.GEO.9', strand: 'Geography - Water Resources', description: 'describe irrigation: types and methods in India' },
  { notation: 'IN.ICSE.C10.SS.GEO.10', strand: 'Geography - Minerals and Energy', description: 'describe mineral resources of India and their distribution' },
  { notation: 'IN.ICSE.C10.SS.GEO.11', strand: 'Geography - Minerals and Energy', description: 'describe conventional and non-conventional energy sources' },
  { notation: 'IN.ICSE.C10.SS.GEO.12', strand: 'Geography - Agriculture', description: 'describe types of farming and major crops of India: rice, wheat, cotton, tea, coffee' },
  { notation: 'IN.ICSE.C10.SS.GEO.13', strand: 'Geography - Agriculture', description: 'describe agricultural problems and solutions in India' },
  { notation: 'IN.ICSE.C10.SS.GEO.14', strand: 'Geography - Industries', description: 'describe industrial development and major industries in India' },
  { notation: 'IN.ICSE.C10.SS.GEO.15', strand: 'Geography - Transport and Communication', description: 'describe transport systems: rail, road, water, air' },
  { notation: 'IN.ICSE.C10.SS.GEO.16', strand: 'Geography - Waste Management', description: 'describe waste management and environmental concerns' },
  { notation: 'IN.ICSE.C10.SS.GEO.17', strand: 'Geography - Map Work', description: 'interpret and complete map-work exercises on the map of India' }
];

// =============================================================================
// CLASS 11 (Ages 16-17) - ISC Humanities stream
// =============================================================================

const class11Standards: ICSESocialScienceStandard[] = [
  // HISTORY
  { notation: 'IN.ICSE.C11.SS.HIS.1', strand: 'History - Indian History', description: 'describe the historiography and sources of ancient Indian history' },
  { notation: 'IN.ICSE.C11.SS.HIS.2', strand: 'History - Indian History', description: 'analyze the Harappan Civilisation: urban planning, economy, and decline' },
  { notation: 'IN.ICSE.C11.SS.HIS.3', strand: 'History - Indian History', description: 'analyze Vedic society and the emergence of second urbanisation' },
  { notation: 'IN.ICSE.C11.SS.HIS.4', strand: 'History - Indian History', description: 'analyze the Mauryan Empire and Ashoka\'s policies' },
  { notation: 'IN.ICSE.C11.SS.HIS.5', strand: 'History - Indian History', description: 'describe the Gupta period and cultural developments' },
  { notation: 'IN.ICSE.C11.SS.HIS.6', strand: 'History - Medieval India', description: 'analyze the Delhi Sultanate: administration, economy, and society' },
  { notation: 'IN.ICSE.C11.SS.HIS.7', strand: 'History - Medieval India', description: 'analyze the Mughal Empire and its administrative structure' },
  { notation: 'IN.ICSE.C11.SS.HIS.8', strand: 'History - Medieval India', description: 'describe bhakti and sufi movements and their impact on society' },
  { notation: 'IN.ICSE.C11.SS.HIS.9', strand: 'History - World History', description: 'describe the Renaissance in Europe and its impact' },
  { notation: 'IN.ICSE.C11.SS.HIS.10', strand: 'History - World History', description: 'describe the Industrial Revolution: causes, course, and consequences' },
  { notation: 'IN.ICSE.C11.SS.HIS.11', strand: 'History - World History', description: 'describe American and French Revolutions: causes and significance' },

  // GEOGRAPHY
  { notation: 'IN.ICSE.C11.SS.GEO.1', strand: 'Geography - Physical Geography', description: 'describe the Earth\'s interior and plate tectonics' },
  { notation: 'IN.ICSE.C11.SS.GEO.2', strand: 'Geography - Physical Geography', description: 'describe geomorphic processes and landforms' },
  { notation: 'IN.ICSE.C11.SS.GEO.3', strand: 'Geography - Climatology', description: 'describe atmospheric circulation and climatic classification' },
  { notation: 'IN.ICSE.C11.SS.GEO.4', strand: 'Geography - Climatology', description: 'describe weather phenomena and climate change' },
  { notation: 'IN.ICSE.C11.SS.GEO.5', strand: 'Geography - Oceanography', description: 'describe ocean relief, currents, and marine resources' },
  { notation: 'IN.ICSE.C11.SS.GEO.6', strand: 'Geography - Biogeography', description: 'describe distribution of biomes and biodiversity' },
  { notation: 'IN.ICSE.C11.SS.GEO.7', strand: 'Geography - Environmental Geography', description: 'describe environmental issues: pollution and degradation' },
  { notation: 'IN.ICSE.C11.SS.GEO.8', strand: 'Geography - Practical Work', description: 'interpret topographical maps and weather charts' },

  // POLITICAL SCIENCE
  { notation: 'IN.ICSE.C11.SS.POL.1', strand: 'Political Science - Political Theory', description: 'define political science and major concepts: state, sovereignty, power' },
  { notation: 'IN.ICSE.C11.SS.POL.2', strand: 'Political Science - Political Theory', description: 'analyze theories of state and government' },
  { notation: 'IN.ICSE.C11.SS.POL.3', strand: 'Political Science - Political Theory', description: 'describe concepts of rights, liberty, equality, and justice' },
  { notation: 'IN.ICSE.C11.SS.POL.4', strand: 'Political Science - Political Theory', description: 'describe democracy: meaning, types, and features' },
  { notation: 'IN.ICSE.C11.SS.POL.5', strand: 'Political Science - Constitution', description: 'describe the making of the Indian Constitution' },
  { notation: 'IN.ICSE.C11.SS.POL.6', strand: 'Political Science - Constitution', description: 'analyze Preamble and basic structure of the Indian Constitution' },

  // ECONOMICS
  { notation: 'IN.ICSE.C11.SS.ECO.1', strand: 'Economics - Introduction', description: 'define economics, economic problems, and their classification' },
  { notation: 'IN.ICSE.C11.SS.ECO.2', strand: 'Economics - Indian Economy', description: 'describe the structure and features of the Indian economy' },
  { notation: 'IN.ICSE.C11.SS.ECO.3', strand: 'Economics - Indian Economy', description: 'describe changes in Indian economy since independence' },
  { notation: 'IN.ICSE.C11.SS.ECO.4', strand: 'Economics - Statistics', description: 'collect, organize, and present statistical data' },
  { notation: 'IN.ICSE.C11.SS.ECO.5', strand: 'Economics - Statistics', description: 'compute measures of central tendency and dispersion' },
  { notation: 'IN.ICSE.C11.SS.ECO.6', strand: 'Economics - Development', description: 'describe problems of poverty, unemployment, and inequality' },
  { notation: 'IN.ICSE.C11.SS.ECO.7', strand: 'Economics - Development', description: 'describe agricultural and industrial development in India' }
];

// =============================================================================
// CLASS 12 (Ages 17-18) - ISC Humanities stream (Board Examination)
// =============================================================================

const class12Standards: ICSESocialScienceStandard[] = [
  // HISTORY
  { notation: 'IN.ICSE.C12.SS.HIS.1', strand: 'History - Modern India', description: 'analyze British economic policies and their impact on Indian economy' },
  { notation: 'IN.ICSE.C12.SS.HIS.2', strand: 'History - Modern India', description: 'describe impact of British rule on Indian society and culture' },
  { notation: 'IN.ICSE.C12.SS.HIS.3', strand: 'History - Modern India', description: 'analyze causes, course, and consequences of the Revolt of 1857' },
  { notation: 'IN.ICSE.C12.SS.HIS.4', strand: 'History - Modern India', description: 'describe socio-religious reform movements in 19th-century India' },
  { notation: 'IN.ICSE.C12.SS.HIS.5', strand: 'History - Modern India', description: 'analyze the rise of Indian nationalism: causes and phases' },
  { notation: 'IN.ICSE.C12.SS.HIS.6', strand: 'History - Modern India', description: 'describe Gandhi\'s techniques and mass movements' },
  { notation: 'IN.ICSE.C12.SS.HIS.7', strand: 'History - Modern India', description: 'analyze events leading to India\'s independence and partition' },
  { notation: 'IN.ICSE.C12.SS.HIS.8', strand: 'History - Modern India', description: 'describe integration of princely states and adoption of Constitution' },
  { notation: 'IN.ICSE.C12.SS.HIS.9', strand: 'History - World History', description: 'describe causes and consequences of the First World War' },
  { notation: 'IN.ICSE.C12.SS.HIS.10', strand: 'History - World History', description: 'describe the Russian Revolution and rise of communism' },
  { notation: 'IN.ICSE.C12.SS.HIS.11', strand: 'History - World History', description: 'describe the rise of dictatorships in Europe: Nazism, Fascism' },
  { notation: 'IN.ICSE.C12.SS.HIS.12', strand: 'History - World History', description: 'describe causes and consequences of the Second World War' },
  { notation: 'IN.ICSE.C12.SS.HIS.13', strand: 'History - World History', description: 'describe decolonisation and the Cold War' },
  { notation: 'IN.ICSE.C12.SS.HIS.14', strand: 'History - World History', description: 'describe the United Nations and international organizations' },

  // GEOGRAPHY
  { notation: 'IN.ICSE.C12.SS.GEO.1', strand: 'Geography - Human Geography', description: 'describe nature and scope of human geography' },
  { notation: 'IN.ICSE.C12.SS.GEO.2', strand: 'Geography - Population', description: 'describe distribution, density, and growth of world population' },
  { notation: 'IN.ICSE.C12.SS.GEO.3', strand: 'Geography - Population', description: 'describe demographic transition and migration patterns' },
  { notation: 'IN.ICSE.C12.SS.GEO.4', strand: 'Geography - Human Activities', description: 'describe primary, secondary, tertiary, and quaternary activities' },
  { notation: 'IN.ICSE.C12.SS.GEO.5', strand: 'Geography - Transport and Communication', description: 'describe modes of transport and communication networks' },
  { notation: 'IN.ICSE.C12.SS.GEO.6', strand: 'Geography - Trade', description: 'describe international trade and its patterns' },
  { notation: 'IN.ICSE.C12.SS.GEO.7', strand: 'Geography - India', description: 'describe population and settlement patterns of India' },
  { notation: 'IN.ICSE.C12.SS.GEO.8', strand: 'Geography - India', description: 'describe agriculture, industries, and trade in India' },
  { notation: 'IN.ICSE.C12.SS.GEO.9', strand: 'Geography - Environment', description: 'analyze environmental issues and sustainable development' },
  { notation: 'IN.ICSE.C12.SS.GEO.10', strand: 'Geography - Practical Work', description: 'interpret topographical maps, statistical data, and satellite imagery' },

  // POLITICAL SCIENCE
  { notation: 'IN.ICSE.C12.SS.POL.1', strand: 'Political Science - Indian Political System', description: 'describe the Union Government: Parliament, President, Prime Minister' },
  { notation: 'IN.ICSE.C12.SS.POL.2', strand: 'Political Science - Indian Political System', description: 'describe the State Government structure and functions' },
  { notation: 'IN.ICSE.C12.SS.POL.3', strand: 'Political Science - Indian Political System', description: 'describe the Indian Judiciary and judicial review' },
  { notation: 'IN.ICSE.C12.SS.POL.4', strand: 'Political Science - Indian Political System', description: 'describe federalism and centre-state relations' },
  { notation: 'IN.ICSE.C12.SS.POL.5', strand: 'Political Science - Political Parties', description: 'describe political parties and party system in India' },
  { notation: 'IN.ICSE.C12.SS.POL.6', strand: 'Political Science - Political Parties', description: 'describe electoral process and role of Election Commission' },
  { notation: 'IN.ICSE.C12.SS.POL.7', strand: 'Political Science - International Relations', description: 'describe India\'s foreign policy and non-alignment' },
  { notation: 'IN.ICSE.C12.SS.POL.8', strand: 'Political Science - International Relations', description: 'describe the United Nations and its specialised agencies' },
  { notation: 'IN.ICSE.C12.SS.POL.9', strand: 'Political Science - International Relations', description: 'describe regional organizations: SAARC, ASEAN, EU' },

  // ECONOMICS
  { notation: 'IN.ICSE.C12.SS.ECO.1', strand: 'Economics - Microeconomics', description: 'define demand, supply, and market equilibrium' },
  { notation: 'IN.ICSE.C12.SS.ECO.2', strand: 'Economics - Microeconomics', description: 'describe theory of consumer behaviour and utility' },
  { notation: 'IN.ICSE.C12.SS.ECO.3', strand: 'Economics - Microeconomics', description: 'describe theory of production and cost' },
  { notation: 'IN.ICSE.C12.SS.ECO.4', strand: 'Economics - Microeconomics', description: 'describe market structures: perfect competition, monopoly, oligopoly' },
  { notation: 'IN.ICSE.C12.SS.ECO.5', strand: 'Economics - Macroeconomics', description: 'define national income, GDP, GNP, NDP, NNP' },
  { notation: 'IN.ICSE.C12.SS.ECO.6', strand: 'Economics - Macroeconomics', description: 'describe measurement of national income and economic welfare' },
  { notation: 'IN.ICSE.C12.SS.ECO.7', strand: 'Economics - Macroeconomics', description: 'describe money, banking, and central bank functions' },
  { notation: 'IN.ICSE.C12.SS.ECO.8', strand: 'Economics - Macroeconomics', description: 'describe inflation, its causes, and effects' },
  { notation: 'IN.ICSE.C12.SS.ECO.9', strand: 'Economics - Public Finance', description: 'describe government budgets, fiscal policy, and taxation' },
  { notation: 'IN.ICSE.C12.SS.ECO.10', strand: 'Economics - International Economics', description: 'describe international trade, balance of payments, and exchange rates' }
];

// =============================================================================
// EXPORT
// =============================================================================

export const icseSocialScienceCurriculum: ICSESocialScienceCurriculum = {
  code: 'INDIAN_ICSE',
  name: 'Indian Certificate of Secondary Education (CISCE)',
  country: 'IN',
  version: '2027-28',
  sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
  subject: 'SOCIAL_SCIENCE',
  classes: [
    { class: 3, ageRangeMin: 8, ageRangeMax: 9, standards: class3Standards },
    { class: 4, ageRangeMin: 9, ageRangeMax: 10, standards: class4Standards },
    { class: 5, ageRangeMin: 10, ageRangeMax: 11, standards: class5Standards },
    { class: 6, ageRangeMin: 11, ageRangeMax: 12, standards: class6Standards },
    { class: 7, ageRangeMin: 12, ageRangeMax: 13, standards: class7Standards },
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards },
    { class: 9, ageRangeMin: 14, ageRangeMax: 15, standards: class9Standards },
    { class: 10, ageRangeMin: 15, ageRangeMax: 16, standards: class10Standards },
    { class: 11, ageRangeMin: 16, ageRangeMax: 17, standards: class11Standards },
    { class: 12, ageRangeMin: 17, ageRangeMax: 18, standards: class12Standards }
  ]
};

export function getICSESocialScienceStandardsForClass(classNum: number): ICSESocialScienceStandard[] {
  const classData = icseSocialScienceCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalICSESocialScienceStandardsCount(): number {
  return icseSocialScienceCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default icseSocialScienceCurriculum;
