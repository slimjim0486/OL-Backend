/**
 * ICSE (Indian Certificate of Secondary Education) - Science Standards
 * Classes 1-12 (Primary through Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CISCE curriculum
 * framework.
 *
 * Subject structure decision:
 *   Classes 1-5 (Primary): Environmental Studies (EVS) covering basic science
 *     concepts (living world, materials, my body, weather, simple machines).
 *   Classes 6-8 (Middle): Integrated Science covering Physics, Chemistry,
 *     Biology as a unified subject.
 *   Classes 9-10 (ICSE Secondary): Science (52) as one paper but split
 *     internally into Paper 1 (Physics), Paper 2 (Chemistry), Paper 3
 *     (Biology) with distinct strand codes.
 *   Classes 11-12 (ISC): Physics, Chemistry, and Biology are formally
 *     separate subjects in the Science stream. We keep them under the
 *     SCIENCE subject (matching Prisma enum) and distinguish them via strand
 *     codes (PHY_*, CHM_*, BIO_*). This mirrors how CBSE is structured and
 *     keeps the curriculumAdapterService's subject-based grouping simple.
 *
 * Sourcing:
 *   Classes 1-8: CISCE-aligned Selina/Frank primary Science publishers
 *     (the de facto ICSE primary curriculum), cross-referenced with
 *     Shaalaa.com CISCE primary syllabus pages.
 *   Classes 9-10: CISCE "ICSE Regulations and Syllabuses 2028" PDFs for
 *     Physics (10), Chemistry (11), and Biology (12):
 *     https://cisce.org/wp-content/uploads/2026/01/10.-Physics.pdf
 *     https://cisce.org/wp-content/uploads/2026/01/11.-Chemistry.pdf
 *     https://cisce.org/wp-content/uploads/2026/01/12.-Biology.pdf
 *   Classes 11-12: CISCE ISC 2028 Physics (861), Chemistry (862), Biology (863).
 *
 * Notation System: IN.ICSE.C{class}.SC.{strand}.{number}
 * - IN = India
 * - ICSE = Indian Certificate of Secondary Education
 * - C = Class (1-12)
 * - SC = Science
 * - Strand codes:
 *   Classes 1-5 (EVS):
 *   - LIV = Living World (Plants, Animals, Human body)
 *   - MAT = Materials and Their Properties
 *   - ENV = Environment and Surroundings
 *   - HEA = Health and Hygiene
 *   - WEA = Weather, Air, and Water
 *   - ENG = Energy and Simple Machines
 *   Classes 6-8 (Integrated Science):
 *   - PHY = Physics concepts
 *   - CHM = Chemistry concepts
 *   - BIO = Biology concepts
 *   Classes 9-10 (ICSE):
 *   - PHY = Physics (Paper 1)
 *   - CHM = Chemistry (Paper 2)
 *   - BIO = Biology (Paper 3)
 *   Classes 11-12 (ISC, separate subjects):
 *   - PH_MCH = Physics: Mechanics
 *   - PH_THR = Physics: Thermodynamics and Heat
 *   - PH_ELE = Physics: Electricity and Magnetism
 *   - PH_OPT = Physics: Optics and Waves
 *   - PH_MDP = Physics: Modern Physics
 *   - CH_PHC = Chemistry: Physical Chemistry
 *   - CH_INC = Chemistry: Inorganic Chemistry
 *   - CH_ORC = Chemistry: Organic Chemistry
 *   - BI_BOT = Biology: Botany
 *   - BI_ZOO = Biology: Zoology
 *   - BI_GEN = Biology: Genetics and Evolution
 *   - BI_ECO = Biology: Ecology and Environment
 */

export interface ICSEScienceStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string;
}

export interface ICSEScienceClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: ICSEScienceStandard[];
}

export interface ICSEScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: ICSEScienceClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7) - EVS
// =============================================================================

const class1Standards: ICSEScienceStandard[] = [
  // LIVING WORLD
  { notation: 'IN.ICSE.C1.SC.LIV.1', strand: 'Living World', description: 'identify common plants in the surroundings and name their parts' },
  { notation: 'IN.ICSE.C1.SC.LIV.2', strand: 'Living World', description: 'identify common animals and classify them as domestic, wild, and farm animals' },
  { notation: 'IN.ICSE.C1.SC.LIV.3', strand: 'Living World', description: 'recognize that plants and animals need water and food to live' },
  { notation: 'IN.ICSE.C1.SC.LIV.4', strand: 'Living World', description: 'name the main parts of the human body: head, arms, legs, eyes, ears, nose, mouth' },
  { notation: 'IN.ICSE.C1.SC.LIV.5', strand: 'Living World', description: 'identify the five sense organs and their functions' },

  // MATERIALS
  { notation: 'IN.ICSE.C1.SC.MAT.1', strand: 'Materials', description: 'classify materials as hard and soft, rough and smooth' },
  { notation: 'IN.ICSE.C1.SC.MAT.2', strand: 'Materials', description: 'identify things we use every day and what they are made of' },

  // ENVIRONMENT
  { notation: 'IN.ICSE.C1.SC.ENV.1', strand: 'Environment', description: 'identify things seen in our surroundings: land, sky, trees, houses, vehicles' },
  { notation: 'IN.ICSE.C1.SC.ENV.2', strand: 'Environment', description: 'name different types of homes: pucca, kutcha, huts' },
  { notation: 'IN.ICSE.C1.SC.ENV.3', strand: 'Environment', description: 'identify common means of transport: land, water, air' },

  // HEALTH AND HYGIENE
  { notation: 'IN.ICSE.C1.SC.HEA.1', strand: 'Health and Hygiene', description: 'describe good habits for personal cleanliness: brushing, bathing, washing hands' },
  { notation: 'IN.ICSE.C1.SC.HEA.2', strand: 'Health and Hygiene', description: 'identify healthy and unhealthy foods' },
  { notation: 'IN.ICSE.C1.SC.HEA.3', strand: 'Health and Hygiene', description: 'describe the importance of eating, sleeping, and exercising regularly' },

  // WEATHER
  { notation: 'IN.ICSE.C1.SC.WEA.1', strand: 'Weather, Air and Water', description: 'describe different types of weather: hot, cold, sunny, rainy, cloudy, windy' },
  { notation: 'IN.ICSE.C1.SC.WEA.2', strand: 'Weather, Air and Water', description: 'identify the need for air and water in daily life' }
];

// =============================================================================
// CLASS 2 (Ages 7-8) - EVS
// =============================================================================

const class2Standards: ICSEScienceStandard[] = [
  { notation: 'IN.ICSE.C2.SC.LIV.1', strand: 'Living World', description: 'classify plants as trees, shrubs, herbs, climbers, and creepers' },
  { notation: 'IN.ICSE.C2.SC.LIV.2', strand: 'Living World', description: 'identify the uses of plants to humans and animals' },
  { notation: 'IN.ICSE.C2.SC.LIV.3', strand: 'Living World', description: 'classify animals by their habitats: land, water, air, both land and water' },
  { notation: 'IN.ICSE.C2.SC.LIV.4', strand: 'Living World', description: 'describe how different animals move and what they eat' },
  { notation: 'IN.ICSE.C2.SC.LIV.5', strand: 'Living World', description: 'describe the importance of keeping the body clean' },
  { notation: 'IN.ICSE.C2.SC.LIV.6', strand: 'Living World', description: 'identify different types of clothes for different seasons' },
  { notation: 'IN.ICSE.C2.SC.MAT.1', strand: 'Materials', description: 'identify natural and man-made materials' },
  { notation: 'IN.ICSE.C2.SC.MAT.2', strand: 'Materials', description: 'describe water as an essential need for all living things' },
  { notation: 'IN.ICSE.C2.SC.ENV.1', strand: 'Environment', description: 'identify places and people in the neighbourhood' },
  { notation: 'IN.ICSE.C2.SC.ENV.2', strand: 'Environment', description: 'describe common community helpers and their roles' },
  { notation: 'IN.ICSE.C2.SC.ENV.3', strand: 'Environment', description: 'identify safety rules on roads and at home' },
  { notation: 'IN.ICSE.C2.SC.HEA.1', strand: 'Health and Hygiene', description: 'describe food groups that help us grow and stay healthy' },
  { notation: 'IN.ICSE.C2.SC.HEA.2', strand: 'Health and Hygiene', description: 'identify common illnesses and basic first aid' },
  { notation: 'IN.ICSE.C2.SC.WEA.1', strand: 'Weather, Air and Water', description: 'name the seasons and describe what happens in each' },
  { notation: 'IN.ICSE.C2.SC.WEA.2', strand: 'Weather, Air and Water', description: 'identify sources of water in our surroundings' }
];

// =============================================================================
// CLASS 3 (Ages 8-9) - EVS
// =============================================================================

const class3Standards: ICSEScienceStandard[] = [
  { notation: 'IN.ICSE.C3.SC.LIV.1', strand: 'Plants', description: 'identify the parts of a plant: root, stem, leaves, flower, fruit, seed' },
  { notation: 'IN.ICSE.C3.SC.LIV.2', strand: 'Plants', description: 'describe the functions of each part of a plant' },
  { notation: 'IN.ICSE.C3.SC.LIV.3', strand: 'Plants', description: 'identify plants as sources of food, medicine, wood, and clothing' },
  { notation: 'IN.ICSE.C3.SC.LIV.4', strand: 'Animals', description: 'classify animals based on what they eat: herbivore, carnivore, omnivore' },
  { notation: 'IN.ICSE.C3.SC.LIV.5', strand: 'Animals', description: 'describe how different animals reproduce and care for their young' },
  { notation: 'IN.ICSE.C3.SC.LIV.6', strand: 'Human Body', description: 'identify the internal organs: brain, heart, lungs, stomach' },
  { notation: 'IN.ICSE.C3.SC.LIV.7', strand: 'Human Body', description: 'identify the skeleton and describe its function' },
  { notation: 'IN.ICSE.C3.SC.MAT.1', strand: 'Materials', description: 'identify different materials and sort them by properties' },
  { notation: 'IN.ICSE.C3.SC.MAT.2', strand: 'Materials', description: 'distinguish between objects that float and sink in water' },
  { notation: 'IN.ICSE.C3.SC.WEA.1', strand: 'Water', description: 'describe the uses of water in daily life' },
  { notation: 'IN.ICSE.C3.SC.WEA.2', strand: 'Water', description: 'identify ways to save water and prevent water wastage' },
  { notation: 'IN.ICSE.C3.SC.WEA.3', strand: 'Air', description: 'identify air as being all around us and describe its presence' },
  { notation: 'IN.ICSE.C3.SC.HEA.1', strand: 'Food and Health', description: 'identify a balanced diet with proteins, carbohydrates, fats, vitamins' },
  { notation: 'IN.ICSE.C3.SC.HEA.2', strand: 'Food and Health', description: 'describe sources of different nutrients' },
  { notation: 'IN.ICSE.C3.SC.ENV.1', strand: 'Travel and Communication', description: 'identify different means of communication: post, telephone, internet' },
  { notation: 'IN.ICSE.C3.SC.ENV.2', strand: 'Travel and Communication', description: 'describe modern means of transport and their uses' }
];

// =============================================================================
// CLASS 4 (Ages 9-10) - EVS
// =============================================================================

const class4Standards: ICSEScienceStandard[] = [
  { notation: 'IN.ICSE.C4.SC.LIV.1', strand: 'Plants', description: 'describe photosynthesis as the process by which plants make food' },
  { notation: 'IN.ICSE.C4.SC.LIV.2', strand: 'Plants', description: 'describe how plants reproduce through seeds and other methods' },
  { notation: 'IN.ICSE.C4.SC.LIV.3', strand: 'Plants', description: 'describe how seeds are dispersed by wind, water, and animals' },
  { notation: 'IN.ICSE.C4.SC.LIV.4', strand: 'Animals', description: 'describe adaptation of animals to their habitats' },
  { notation: 'IN.ICSE.C4.SC.LIV.5', strand: 'Animals', description: 'classify animals by body features: vertebrates and invertebrates' },
  { notation: 'IN.ICSE.C4.SC.LIV.6', strand: 'Human Body', description: 'describe the digestive system and its main parts' },
  { notation: 'IN.ICSE.C4.SC.LIV.7', strand: 'Human Body', description: 'describe the function of teeth and types of teeth' },
  { notation: 'IN.ICSE.C4.SC.LIV.8', strand: 'Human Body', description: 'identify common diseases and their causes' },
  { notation: 'IN.ICSE.C4.SC.MAT.1', strand: 'Materials', description: 'describe properties of matter: solid, liquid, and gas' },
  { notation: 'IN.ICSE.C4.SC.MAT.2', strand: 'Materials', description: 'describe changes of state: melting, freezing, evaporation, condensation' },
  { notation: 'IN.ICSE.C4.SC.WEA.1', strand: 'Weather and Climate', description: 'describe the water cycle' },
  { notation: 'IN.ICSE.C4.SC.WEA.2', strand: 'Weather and Climate', description: 'measure temperature using a thermometer' },
  { notation: 'IN.ICSE.C4.SC.WEA.3', strand: 'Weather and Climate', description: 'describe different climates and how they affect people' },
  { notation: 'IN.ICSE.C4.SC.ENG.1', strand: 'Energy and Machines', description: 'identify simple machines: lever, pulley, wheel, inclined plane' },
  { notation: 'IN.ICSE.C4.SC.ENG.2', strand: 'Energy and Machines', description: 'identify sources of light, heat, and sound in daily life' },
  { notation: 'IN.ICSE.C4.SC.ENV.1', strand: 'Our Earth', description: 'describe the Earth as a planet with land, water, and air' },
  { notation: 'IN.ICSE.C4.SC.ENV.2', strand: 'Our Earth', description: 'identify the Sun, Moon, stars, and planets' }
];

// =============================================================================
// CLASS 5 (Ages 10-11) - EVS / Introduction to Science
// =============================================================================

const class5Standards: ICSEScienceStandard[] = [
  { notation: 'IN.ICSE.C5.SC.LIV.1', strand: 'Plants', description: 'describe the transport of water and nutrients in plants' },
  { notation: 'IN.ICSE.C5.SC.LIV.2', strand: 'Plants', description: 'describe flowers as the reproductive organs of plants' },
  { notation: 'IN.ICSE.C5.SC.LIV.3', strand: 'Plants', description: 'describe germination of seeds and conditions needed' },
  { notation: 'IN.ICSE.C5.SC.LIV.4', strand: 'Animals', description: 'describe life cycles of animals such as butterfly, frog, and mosquito' },
  { notation: 'IN.ICSE.C5.SC.LIV.5', strand: 'Animals', description: 'identify endangered animals and the need for conservation' },
  { notation: 'IN.ICSE.C5.SC.LIV.6', strand: 'Human Body', description: 'describe the respiratory system and how breathing works' },
  { notation: 'IN.ICSE.C5.SC.LIV.7', strand: 'Human Body', description: 'describe the circulatory system and the role of the heart' },
  { notation: 'IN.ICSE.C5.SC.LIV.8', strand: 'Human Body', description: 'identify diseases caused by germs, insects, and contaminated food' },
  { notation: 'IN.ICSE.C5.SC.MAT.1', strand: 'Matter', description: 'explain differences between solids, liquids, and gases at the particle level' },
  { notation: 'IN.ICSE.C5.SC.MAT.2', strand: 'Matter', description: 'distinguish between reversible and irreversible changes' },
  { notation: 'IN.ICSE.C5.SC.ENG.1', strand: 'Energy and Force', description: 'identify forms of energy: light, sound, heat, electrical, mechanical' },
  { notation: 'IN.ICSE.C5.SC.ENG.2', strand: 'Energy and Force', description: 'describe push and pull as forces' },
  { notation: 'IN.ICSE.C5.SC.ENG.3', strand: 'Energy and Force', description: 'describe uses of simple machines in daily life' },
  { notation: 'IN.ICSE.C5.SC.WEA.1', strand: 'Earth and Space', description: 'describe the solar system and names of the planets' },
  { notation: 'IN.ICSE.C5.SC.WEA.2', strand: 'Earth and Space', description: 'describe rotation and revolution of the Earth causing day-night and seasons' },
  { notation: 'IN.ICSE.C5.SC.ENV.1', strand: 'Environment', description: 'identify natural resources and the need for conservation' },
  { notation: 'IN.ICSE.C5.SC.ENV.2', strand: 'Environment', description: 'describe pollution of air, water, and land and its effects' }
];

// =============================================================================
// CLASS 6 (Ages 11-12) - Integrated Science
// =============================================================================

const class6Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C6.SC.PHY.1', strand: 'Physics - Matter', description: 'classify matter as solid, liquid, and gas based on properties' },
  { notation: 'IN.ICSE.C6.SC.PHY.2', strand: 'Physics - Matter', description: 'identify physical properties of substances: hardness, elasticity, solubility' },
  { notation: 'IN.ICSE.C6.SC.PHY.3', strand: 'Physics - Physical Quantities', description: 'identify physical quantities and SI units of length, mass, time' },
  { notation: 'IN.ICSE.C6.SC.PHY.4', strand: 'Physics - Physical Quantities', description: 'measure length, mass, and time using appropriate instruments' },
  { notation: 'IN.ICSE.C6.SC.PHY.5', strand: 'Physics - Force and Energy', description: 'identify types of motion: linear, circular, oscillatory' },
  { notation: 'IN.ICSE.C6.SC.PHY.6', strand: 'Physics - Force and Energy', description: 'identify force as a push or pull and its effects' },
  { notation: 'IN.ICSE.C6.SC.PHY.7', strand: 'Physics - Light and Sound', description: 'describe how light travels in a straight line' },
  { notation: 'IN.ICSE.C6.SC.PHY.8', strand: 'Physics - Light and Sound', description: 'explain formation of shadow and its relation to light' },
  { notation: 'IN.ICSE.C6.SC.PHY.9', strand: 'Physics - Magnetism', description: 'identify magnetic and non-magnetic materials' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C6.SC.CHM.1', strand: 'Chemistry - Matter', description: 'distinguish between pure substances and mixtures' },
  { notation: 'IN.ICSE.C6.SC.CHM.2', strand: 'Chemistry - Matter', description: 'separate mixtures using filtration, evaporation, and sedimentation' },
  { notation: 'IN.ICSE.C6.SC.CHM.3', strand: 'Chemistry - Elements and Compounds', description: 'describe elements and compounds using everyday examples' },
  { notation: 'IN.ICSE.C6.SC.CHM.4', strand: 'Chemistry - Water', description: 'describe properties of water and its importance to life' },
  { notation: 'IN.ICSE.C6.SC.CHM.5', strand: 'Chemistry - Air', description: 'identify the composition of air and role of its gases' },

  // BIOLOGY
  { notation: 'IN.ICSE.C6.SC.BIO.1', strand: 'Biology - Living World', description: 'identify characteristics of living things: growth, movement, reproduction, respiration' },
  { notation: 'IN.ICSE.C6.SC.BIO.2', strand: 'Biology - Plants', description: 'classify plants based on habitat: aquatic, terrestrial, desert, mountain' },
  { notation: 'IN.ICSE.C6.SC.BIO.3', strand: 'Biology - Plants', description: 'describe the structure and function of root, stem, leaves, flowers' },
  { notation: 'IN.ICSE.C6.SC.BIO.4', strand: 'Biology - Animals', description: 'classify animals based on body structures' },
  { notation: 'IN.ICSE.C6.SC.BIO.5', strand: 'Biology - Animals', description: 'describe adaptations in animals for different habitats' },
  { notation: 'IN.ICSE.C6.SC.BIO.6', strand: 'Biology - Human Body', description: 'identify major organ systems of the human body' },
  { notation: 'IN.ICSE.C6.SC.BIO.7', strand: 'Biology - Human Body', description: 'describe skeletal system and types of joints' },
  { notation: 'IN.ICSE.C6.SC.BIO.8', strand: 'Biology - Health', description: 'identify balanced diet, deficiency diseases, and healthy habits' },
  { notation: 'IN.ICSE.C6.SC.BIO.9', strand: 'Biology - Environment', description: 'describe common biotic and abiotic components of an ecosystem' }
];

// =============================================================================
// CLASS 7 (Ages 12-13) - Integrated Science
// =============================================================================

const class7Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C7.SC.PHY.1', strand: 'Physics - Matter', description: 'describe structure of matter in terms of molecules and atoms' },
  { notation: 'IN.ICSE.C7.SC.PHY.2', strand: 'Physics - Matter', description: 'describe interparticle forces in solids, liquids, and gases' },
  { notation: 'IN.ICSE.C7.SC.PHY.3', strand: 'Physics - Heat', description: 'distinguish heat from temperature and describe units of each' },
  { notation: 'IN.ICSE.C7.SC.PHY.4', strand: 'Physics - Heat', description: 'describe expansion of solids, liquids, and gases on heating' },
  { notation: 'IN.ICSE.C7.SC.PHY.5', strand: 'Physics - Heat', description: 'describe heat transfer by conduction, convection, and radiation' },
  { notation: 'IN.ICSE.C7.SC.PHY.6', strand: 'Physics - Light', description: 'describe reflection of light and the law of reflection' },
  { notation: 'IN.ICSE.C7.SC.PHY.7', strand: 'Physics - Light', description: 'describe image formation by a plane mirror' },
  { notation: 'IN.ICSE.C7.SC.PHY.8', strand: 'Physics - Sound', description: 'describe sound as a form of energy produced by vibrating objects' },
  { notation: 'IN.ICSE.C7.SC.PHY.9', strand: 'Physics - Sound', description: 'describe medium required for sound propagation' },
  { notation: 'IN.ICSE.C7.SC.PHY.10', strand: 'Physics - Electricity', description: 'identify components of a simple electric circuit' },
  { notation: 'IN.ICSE.C7.SC.PHY.11', strand: 'Physics - Magnetism', description: 'identify poles of a magnet and magnetic field' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C7.SC.CHM.1', strand: 'Chemistry - Matter', description: 'describe changes as physical and chemical with examples' },
  { notation: 'IN.ICSE.C7.SC.CHM.2', strand: 'Chemistry - Matter', description: 'describe methods of separating mixtures: filtration, distillation, crystallization, chromatography' },
  { notation: 'IN.ICSE.C7.SC.CHM.3', strand: 'Chemistry - Atomic Structure', description: 'describe atoms and molecules as building blocks of matter' },
  { notation: 'IN.ICSE.C7.SC.CHM.4', strand: 'Chemistry - Elements', description: 'identify symbols of common elements' },
  { notation: 'IN.ICSE.C7.SC.CHM.5', strand: 'Chemistry - Acids and Bases', description: 'identify acids, bases, and neutral substances using indicators' },
  { notation: 'IN.ICSE.C7.SC.CHM.6', strand: 'Chemistry - Air and Atmosphere', description: 'describe composition of air and the role of oxygen' },

  // BIOLOGY
  { notation: 'IN.ICSE.C7.SC.BIO.1', strand: 'Biology - Plant Life', description: 'describe photosynthesis and factors affecting it' },
  { notation: 'IN.ICSE.C7.SC.BIO.2', strand: 'Biology - Plant Life', description: 'describe respiration and transpiration in plants' },
  { notation: 'IN.ICSE.C7.SC.BIO.3', strand: 'Biology - Plant Life', description: 'describe sexual and asexual reproduction in plants' },
  { notation: 'IN.ICSE.C7.SC.BIO.4', strand: 'Biology - Animal Life', description: 'describe nutrition in animals and types of teeth' },
  { notation: 'IN.ICSE.C7.SC.BIO.5', strand: 'Biology - Animal Life', description: 'describe respiration in different animals' },
  { notation: 'IN.ICSE.C7.SC.BIO.6', strand: 'Biology - Human Body', description: 'describe the digestive system and its organs' },
  { notation: 'IN.ICSE.C7.SC.BIO.7', strand: 'Biology - Human Body', description: 'describe the respiratory system and role of lungs' },
  { notation: 'IN.ICSE.C7.SC.BIO.8', strand: 'Biology - Human Body', description: 'describe the circulatory system and role of the heart' },
  { notation: 'IN.ICSE.C7.SC.BIO.9', strand: 'Biology - Ecosystem', description: 'describe food chains and food webs' },
  { notation: 'IN.ICSE.C7.SC.BIO.10', strand: 'Biology - Ecosystem', description: 'describe interdependence of organisms in an ecosystem' }
];

// =============================================================================
// CLASS 8 (Ages 13-14) - Integrated Science
// =============================================================================

const class8Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C8.SC.PHY.1', strand: 'Physics - Matter', description: 'describe pressure in solids, liquids, and gases' },
  { notation: 'IN.ICSE.C8.SC.PHY.2', strand: 'Physics - Matter', description: 'describe atmospheric pressure and its measurement' },
  { notation: 'IN.ICSE.C8.SC.PHY.3', strand: 'Physics - Force and Motion', description: 'distinguish contact and non-contact forces' },
  { notation: 'IN.ICSE.C8.SC.PHY.4', strand: 'Physics - Force and Motion', description: 'describe friction and its advantages and disadvantages' },
  { notation: 'IN.ICSE.C8.SC.PHY.5', strand: 'Physics - Force and Motion', description: 'describe gravity and weight' },
  { notation: 'IN.ICSE.C8.SC.PHY.6', strand: 'Physics - Light', description: 'describe refraction of light through transparent media' },
  { notation: 'IN.ICSE.C8.SC.PHY.7', strand: 'Physics - Light', description: 'describe dispersion of white light into the spectrum' },
  { notation: 'IN.ICSE.C8.SC.PHY.8', strand: 'Physics - Light', description: 'describe the human eye and defects of vision' },
  { notation: 'IN.ICSE.C8.SC.PHY.9', strand: 'Physics - Sound', description: 'describe loudness, pitch, and quality of sound' },
  { notation: 'IN.ICSE.C8.SC.PHY.10', strand: 'Physics - Electricity', description: 'describe conductors and insulators of electricity' },
  { notation: 'IN.ICSE.C8.SC.PHY.11', strand: 'Physics - Electricity', description: 'describe chemical effects of electric current' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C8.SC.CHM.1', strand: 'Chemistry - Atomic Structure', description: 'describe structure of an atom: protons, neutrons, and electrons' },
  { notation: 'IN.ICSE.C8.SC.CHM.2', strand: 'Chemistry - Atomic Structure', description: 'describe atomic number and mass number' },
  { notation: 'IN.ICSE.C8.SC.CHM.3', strand: 'Chemistry - Elements', description: 'describe language of chemistry: formulas and equations' },
  { notation: 'IN.ICSE.C8.SC.CHM.4', strand: 'Chemistry - Matter', description: 'describe chemical reactions and balance simple equations' },
  { notation: 'IN.ICSE.C8.SC.CHM.5', strand: 'Chemistry - Metals and Non-metals', description: 'distinguish metals from non-metals by physical and chemical properties' },
  { notation: 'IN.ICSE.C8.SC.CHM.6', strand: 'Chemistry - Metals and Non-metals', description: 'describe common uses of metals like iron, copper, aluminium' },
  { notation: 'IN.ICSE.C8.SC.CHM.7', strand: 'Chemistry - Carbon and its Compounds', description: 'describe carbon and its allotropes' },
  { notation: 'IN.ICSE.C8.SC.CHM.8', strand: 'Chemistry - Fuels', description: 'describe fuels, combustion, and flame structure' },

  // BIOLOGY
  { notation: 'IN.ICSE.C8.SC.BIO.1', strand: 'Biology - Cell Structure', description: 'describe cell as basic unit of life with plant and animal cells' },
  { notation: 'IN.ICSE.C8.SC.BIO.2', strand: 'Biology - Cell Structure', description: 'identify cell parts: cell wall, cell membrane, nucleus, cytoplasm, mitochondria' },
  { notation: 'IN.ICSE.C8.SC.BIO.3', strand: 'Biology - Classification', description: 'describe five kingdoms of classification of living organisms' },
  { notation: 'IN.ICSE.C8.SC.BIO.4', strand: 'Biology - Microorganisms', description: 'identify types of microorganisms: bacteria, fungi, protozoa, viruses' },
  { notation: 'IN.ICSE.C8.SC.BIO.5', strand: 'Biology - Microorganisms', description: 'describe useful and harmful effects of microorganisms' },
  { notation: 'IN.ICSE.C8.SC.BIO.6', strand: 'Biology - Human Body', description: 'describe nervous system and sense organs' },
  { notation: 'IN.ICSE.C8.SC.BIO.7', strand: 'Biology - Human Body', description: 'describe endocrine system and common hormones' },
  { notation: 'IN.ICSE.C8.SC.BIO.8', strand: 'Biology - Reproduction', description: 'describe reproduction in humans and related health' },
  { notation: 'IN.ICSE.C8.SC.BIO.9', strand: 'Biology - Environment', description: 'describe deforestation and conservation of natural resources' },
  { notation: 'IN.ICSE.C8.SC.BIO.10', strand: 'Biology - Food Production', description: 'describe crop production and management practices' }
];

// =============================================================================
// CLASS 9 (Ages 14-15) - ICSE Science (52)
// Source: CISCE ICSE 2028 Physics, Chemistry, Biology syllabi
// =============================================================================

const class9Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C9.SC.PHY.1', strand: 'Physics - Measurements', description: 'distinguish between fundamental and derived physical quantities' },
  { notation: 'IN.ICSE.C9.SC.PHY.2', strand: 'Physics - Measurements', description: 'describe SI units of length, mass, time, and temperature' },
  { notation: 'IN.ICSE.C9.SC.PHY.3', strand: 'Physics - Measurements', description: 'measure length using vernier callipers and screw gauge' },
  { notation: 'IN.ICSE.C9.SC.PHY.4', strand: 'Physics - Motion', description: 'distinguish distance from displacement and speed from velocity' },
  { notation: 'IN.ICSE.C9.SC.PHY.5', strand: 'Physics - Motion', description: 'describe uniform and non-uniform motion' },
  { notation: 'IN.ICSE.C9.SC.PHY.6', strand: 'Physics - Motion', description: 'apply equations of motion for uniformly accelerated motion' },
  { notation: 'IN.ICSE.C9.SC.PHY.7', strand: 'Physics - Motion', description: 'interpret distance-time and velocity-time graphs' },
  { notation: 'IN.ICSE.C9.SC.PHY.8', strand: 'Physics - Laws of Motion', description: 'state and apply Newton\'s first, second, and third laws of motion' },
  { notation: 'IN.ICSE.C9.SC.PHY.9', strand: 'Physics - Laws of Motion', description: 'describe linear momentum and conservation of momentum' },
  { notation: 'IN.ICSE.C9.SC.PHY.10', strand: 'Physics - Pressure in Fluids', description: 'describe pressure in fluids and apply P = hρg for liquid columns' },
  { notation: 'IN.ICSE.C9.SC.PHY.11', strand: 'Physics - Pressure in Fluids', description: 'describe atmospheric pressure and measurement using barometer' },
  { notation: 'IN.ICSE.C9.SC.PHY.12', strand: 'Physics - Upthrust and Archimedes', description: 'describe upthrust and state Archimedes principle' },
  { notation: 'IN.ICSE.C9.SC.PHY.13', strand: 'Physics - Upthrust and Archimedes', description: 'apply the principle of flotation and compute relative density' },
  { notation: 'IN.ICSE.C9.SC.PHY.14', strand: 'Physics - Heat and Energy', description: 'describe anomalous expansion of water and its consequences' },
  { notation: 'IN.ICSE.C9.SC.PHY.15', strand: 'Physics - Heat and Energy', description: 'describe specific heat capacity and its applications' },
  { notation: 'IN.ICSE.C9.SC.PHY.16', strand: 'Physics - Heat and Energy', description: 'describe energy transformations and conservation of energy' },
  { notation: 'IN.ICSE.C9.SC.PHY.17', strand: 'Physics - Light', description: 'describe reflection at plane surfaces and formation of multiple images' },
  { notation: 'IN.ICSE.C9.SC.PHY.18', strand: 'Physics - Sound', description: 'describe propagation of sound waves and need for a medium' },
  { notation: 'IN.ICSE.C9.SC.PHY.19', strand: 'Physics - Sound', description: 'describe echo, reverberation, and ultrasonics' },
  { notation: 'IN.ICSE.C9.SC.PHY.20', strand: 'Physics - Current Electricity', description: 'identify open and closed circuits and components' },
  { notation: 'IN.ICSE.C9.SC.PHY.21', strand: 'Physics - Current Electricity', description: 'describe conductors, insulators, and electrical safety' },
  { notation: 'IN.ICSE.C9.SC.PHY.22', strand: 'Physics - Magnetism', description: 'describe magnetic field lines and induced magnetism' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C9.SC.CHM.1', strand: 'Chemistry - Language of Chemistry', description: 'write chemical symbols and formulas for common elements and compounds' },
  { notation: 'IN.ICSE.C9.SC.CHM.2', strand: 'Chemistry - Language of Chemistry', description: 'balance chemical equations by inspection method' },
  { notation: 'IN.ICSE.C9.SC.CHM.3', strand: 'Chemistry - Language of Chemistry', description: 'calculate valency of elements from positions in the periodic table' },
  { notation: 'IN.ICSE.C9.SC.CHM.4', strand: 'Chemistry - Chemical Changes', description: 'classify chemical changes: combination, decomposition, displacement, double displacement' },
  { notation: 'IN.ICSE.C9.SC.CHM.5', strand: 'Chemistry - Chemical Changes', description: 'describe types of reactions by heat: exothermic and endothermic' },
  { notation: 'IN.ICSE.C9.SC.CHM.6', strand: 'Chemistry - Water', description: 'describe solubility of substances in water and crystal water' },
  { notation: 'IN.ICSE.C9.SC.CHM.7', strand: 'Chemistry - Water', description: 'describe water as a universal solvent and its pure/impure forms' },
  { notation: 'IN.ICSE.C9.SC.CHM.8', strand: 'Chemistry - Atomic Structure', description: 'describe atomic models of Dalton, Thomson, Rutherford, and Bohr' },
  { notation: 'IN.ICSE.C9.SC.CHM.9', strand: 'Chemistry - Atomic Structure', description: 'describe atomic number, mass number, isotopes, and isobars' },
  { notation: 'IN.ICSE.C9.SC.CHM.10', strand: 'Chemistry - Atomic Structure', description: 'describe electronic configuration of first 20 elements' },
  { notation: 'IN.ICSE.C9.SC.CHM.11', strand: 'Chemistry - Chemical Bonding', description: 'describe ionic (electrovalent) bonds with examples' },
  { notation: 'IN.ICSE.C9.SC.CHM.12', strand: 'Chemistry - Chemical Bonding', description: 'describe covalent bonds with examples' },
  { notation: 'IN.ICSE.C9.SC.CHM.13', strand: 'Chemistry - Periodic Table', description: 'describe Mendeleev\'s and modern periodic tables' },
  { notation: 'IN.ICSE.C9.SC.CHM.14', strand: 'Chemistry - Periodic Table', description: 'identify periodic trends in atomic size, ionization energy, and metallic character' },
  { notation: 'IN.ICSE.C9.SC.CHM.15', strand: 'Chemistry - Study of Elements', description: 'describe occurrence, preparation, and uses of hydrogen' },
  { notation: 'IN.ICSE.C9.SC.CHM.16', strand: 'Chemistry - Study of Elements', description: 'describe alkali metals (Group IA) and their reactivity' },
  { notation: 'IN.ICSE.C9.SC.CHM.17', strand: 'Chemistry - Practical Work', description: 'identify laboratory apparatus and demonstrate basic techniques' },

  // BIOLOGY
  { notation: 'IN.ICSE.C9.SC.BIO.1', strand: 'Biology - Cell', description: 'describe basic unit of life: structure of plant and animal cells' },
  { notation: 'IN.ICSE.C9.SC.BIO.2', strand: 'Biology - Cell', description: 'identify cell organelles and their functions: nucleus, mitochondria, ribosomes, ER, Golgi, lysosomes' },
  { notation: 'IN.ICSE.C9.SC.BIO.3', strand: 'Biology - Cell', description: 'describe cell division: mitosis and meiosis' },
  { notation: 'IN.ICSE.C9.SC.BIO.4', strand: 'Biology - Tissues', description: 'classify plant tissues: meristematic and permanent' },
  { notation: 'IN.ICSE.C9.SC.BIO.5', strand: 'Biology - Tissues', description: 'classify animal tissues: epithelial, connective, muscular, nervous' },
  { notation: 'IN.ICSE.C9.SC.BIO.6', strand: 'Biology - Classification', description: 'describe five kingdom classification and basis of classification' },
  { notation: 'IN.ICSE.C9.SC.BIO.7', strand: 'Biology - Plant Structure', description: 'describe structure of flower and the reproductive parts' },
  { notation: 'IN.ICSE.C9.SC.BIO.8', strand: 'Biology - Plant Physiology', description: 'describe photosynthesis, raw materials, products, and factors affecting it' },
  { notation: 'IN.ICSE.C9.SC.BIO.9', strand: 'Biology - Plant Physiology', description: 'describe transpiration and its significance' },
  { notation: 'IN.ICSE.C9.SC.BIO.10', strand: 'Biology - Human Body', description: 'describe skeletal system and types of joints' },
  { notation: 'IN.ICSE.C9.SC.BIO.11', strand: 'Biology - Human Body', description: 'describe skin as a sense organ and its functions' },
  { notation: 'IN.ICSE.C9.SC.BIO.12', strand: 'Biology - Health and Hygiene', description: 'describe communicable diseases and methods of prevention' },
  { notation: 'IN.ICSE.C9.SC.BIO.13', strand: 'Biology - Health and Hygiene', description: 'describe sources of water pollution and water-borne diseases' },
  { notation: 'IN.ICSE.C9.SC.BIO.14', strand: 'Biology - Economic Importance', description: 'describe economic importance of bacteria and fungi to humans' },
  { notation: 'IN.ICSE.C9.SC.BIO.15', strand: 'Biology - Nutrition', description: 'describe nutrients, balanced diet, and deficiency diseases' }
];

// =============================================================================
// CLASS 10 (Ages 15-16) - ICSE Science (52) - Board Examination
// =============================================================================

const class10Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C10.SC.PHY.1', strand: 'Physics - Force', description: 'define force and its turning effect (moment of force)' },
  { notation: 'IN.ICSE.C10.SC.PHY.2', strand: 'Physics - Force', description: 'apply principle of moments to a beam in equilibrium' },
  { notation: 'IN.ICSE.C10.SC.PHY.3', strand: 'Physics - Force', description: 'compute centre of gravity of regular and irregular bodies' },
  { notation: 'IN.ICSE.C10.SC.PHY.4', strand: 'Physics - Force', description: 'describe uniform circular motion and centripetal force' },
  { notation: 'IN.ICSE.C10.SC.PHY.5', strand: 'Physics - Work Energy Power', description: 'compute work done by a force and its SI unit' },
  { notation: 'IN.ICSE.C10.SC.PHY.6', strand: 'Physics - Work Energy Power', description: 'compute kinetic and potential energy using K=½mv² and U=mgh' },
  { notation: 'IN.ICSE.C10.SC.PHY.7', strand: 'Physics - Work Energy Power', description: 'apply conservation of mechanical energy and describe power' },
  { notation: 'IN.ICSE.C10.SC.PHY.8', strand: 'Physics - Machines', description: 'define mechanical advantage, velocity ratio, and efficiency of machines' },
  { notation: 'IN.ICSE.C10.SC.PHY.9', strand: 'Physics - Machines', description: 'analyze lever as a simple machine: classes and examples' },
  { notation: 'IN.ICSE.C10.SC.PHY.10', strand: 'Physics - Machines', description: 'describe inclined plane, pulleys, and their mechanical advantage' },
  { notation: 'IN.ICSE.C10.SC.PHY.11', strand: 'Physics - Refraction', description: 'describe refraction of light at plane surfaces and Snell\'s law' },
  { notation: 'IN.ICSE.C10.SC.PHY.12', strand: 'Physics - Refraction', description: 'describe total internal reflection and its applications' },
  { notation: 'IN.ICSE.C10.SC.PHY.13', strand: 'Physics - Refraction', description: 'describe refraction of light through a rectangular glass slab and prism' },
  { notation: 'IN.ICSE.C10.SC.PHY.14', strand: 'Physics - Lenses', description: 'describe refraction through lenses and identify converging and diverging lenses' },
  { notation: 'IN.ICSE.C10.SC.PHY.15', strand: 'Physics - Lenses', description: 'describe images formed by convex and concave lenses for various object positions' },
  { notation: 'IN.ICSE.C10.SC.PHY.16', strand: 'Physics - Lenses', description: 'describe power of a lens and its SI unit' },
  { notation: 'IN.ICSE.C10.SC.PHY.17', strand: 'Physics - Spectrum', description: 'describe dispersion of light through a prism and formation of spectrum' },
  { notation: 'IN.ICSE.C10.SC.PHY.18', strand: 'Physics - Spectrum', description: 'describe electromagnetic spectrum and its regions: radio, microwave, IR, visible, UV, X-rays, gamma' },
  { notation: 'IN.ICSE.C10.SC.PHY.19', strand: 'Physics - Sound', description: 'describe natural vibrations, damped vibrations, and forced vibrations' },
  { notation: 'IN.ICSE.C10.SC.PHY.20', strand: 'Physics - Sound', description: 'describe resonance and its applications with examples' },
  { notation: 'IN.ICSE.C10.SC.PHY.21', strand: 'Physics - Current Electricity', description: 'state and apply Ohm\'s law in circuit problems' },
  { notation: 'IN.ICSE.C10.SC.PHY.22', strand: 'Physics - Current Electricity', description: 'compute resistance in series and parallel combinations' },
  { notation: 'IN.ICSE.C10.SC.PHY.23', strand: 'Physics - Current Electricity', description: 'describe electrical energy and power in circuits' },
  { notation: 'IN.ICSE.C10.SC.PHY.24', strand: 'Physics - Electromagnetism', description: 'describe magnetic effects of electric current' },
  { notation: 'IN.ICSE.C10.SC.PHY.25', strand: 'Physics - Electromagnetism', description: 'describe electromagnetic induction and basic generator principles' },
  { notation: 'IN.ICSE.C10.SC.PHY.26', strand: 'Physics - Nuclear Physics', description: 'describe atomic nucleus, isotopes, and radioactivity' },
  { notation: 'IN.ICSE.C10.SC.PHY.27', strand: 'Physics - Nuclear Physics', description: 'describe alpha, beta, and gamma radiations and their properties' },
  { notation: 'IN.ICSE.C10.SC.PHY.28', strand: 'Physics - Nuclear Physics', description: 'describe uses and hazards of nuclear radiation' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C10.SC.CHM.1', strand: 'Chemistry - Periodic Properties', description: 'describe periodic properties: atomic size, ionization energy, electron affinity, electronegativity' },
  { notation: 'IN.ICSE.C10.SC.CHM.2', strand: 'Chemistry - Chemical Bonding', description: 'describe ionic bond formation with electron transfer' },
  { notation: 'IN.ICSE.C10.SC.CHM.3', strand: 'Chemistry - Chemical Bonding', description: 'describe covalent bond formation with electron sharing' },
  { notation: 'IN.ICSE.C10.SC.CHM.4', strand: 'Chemistry - Chemical Bonding', description: 'describe coordinate (dative) bond with examples' },
  { notation: 'IN.ICSE.C10.SC.CHM.5', strand: 'Chemistry - Acids Bases Salts', description: 'describe Arrhenius concept of acids and bases' },
  { notation: 'IN.ICSE.C10.SC.CHM.6', strand: 'Chemistry - Acids Bases Salts', description: 'describe pH scale and indicators' },
  { notation: 'IN.ICSE.C10.SC.CHM.7', strand: 'Chemistry - Acids Bases Salts', description: 'describe preparation of salts and their types: acid, normal, basic, mixed, double' },
  { notation: 'IN.ICSE.C10.SC.CHM.8', strand: 'Chemistry - Analytical Chemistry', description: 'identify common cations and anions using qualitative analysis' },
  { notation: 'IN.ICSE.C10.SC.CHM.9', strand: 'Chemistry - Mole Concept', description: 'apply the mole concept to compute moles, mass, and particles' },
  { notation: 'IN.ICSE.C10.SC.CHM.10', strand: 'Chemistry - Mole Concept', description: 'compute empirical formula and molecular formula from percentage composition' },
  { notation: 'IN.ICSE.C10.SC.CHM.11', strand: 'Chemistry - Mole Concept', description: 'apply Avogadro\'s law and compute molar volume of gases at STP' },
  { notation: 'IN.ICSE.C10.SC.CHM.12', strand: 'Chemistry - Electrolysis', description: 'describe electrolysis and differentiate electrolytes from non-electrolytes' },
  { notation: 'IN.ICSE.C10.SC.CHM.13', strand: 'Chemistry - Electrolysis', description: 'describe electrolysis of molten lead bromide and acidified water' },
  { notation: 'IN.ICSE.C10.SC.CHM.14', strand: 'Chemistry - Electrolysis', description: 'describe electroplating of metals' },
  { notation: 'IN.ICSE.C10.SC.CHM.15', strand: 'Chemistry - Metallurgy', description: 'describe metallurgy of aluminium and extraction steps' },
  { notation: 'IN.ICSE.C10.SC.CHM.16', strand: 'Chemistry - Metallurgy', description: 'describe alloys and their uses' },
  { notation: 'IN.ICSE.C10.SC.CHM.17', strand: 'Chemistry - Study of Compounds', description: 'describe preparation, properties, and uses of hydrogen chloride' },
  { notation: 'IN.ICSE.C10.SC.CHM.18', strand: 'Chemistry - Study of Compounds', description: 'describe preparation, properties, and uses of ammonia' },
  { notation: 'IN.ICSE.C10.SC.CHM.19', strand: 'Chemistry - Study of Compounds', description: 'describe preparation, properties, and uses of nitric acid' },
  { notation: 'IN.ICSE.C10.SC.CHM.20', strand: 'Chemistry - Study of Compounds', description: 'describe preparation, properties, and uses of sulphuric acid' },
  { notation: 'IN.ICSE.C10.SC.CHM.21', strand: 'Chemistry - Organic Chemistry', description: 'describe tetravalency of carbon and catenation property' },
  { notation: 'IN.ICSE.C10.SC.CHM.22', strand: 'Chemistry - Organic Chemistry', description: 'classify hydrocarbons into alkanes, alkenes, and alkynes' },
  { notation: 'IN.ICSE.C10.SC.CHM.23', strand: 'Chemistry - Organic Chemistry', description: 'apply IUPAC nomenclature for simple organic compounds' },
  { notation: 'IN.ICSE.C10.SC.CHM.24', strand: 'Chemistry - Organic Chemistry', description: 'describe homologous series and functional groups' },

  // BIOLOGY
  { notation: 'IN.ICSE.C10.SC.BIO.1', strand: 'Biology - Basic Biology', description: 'describe cell cycle and mitosis with phases' },
  { notation: 'IN.ICSE.C10.SC.BIO.2', strand: 'Biology - Basic Biology', description: 'describe meiosis and its significance in reproduction' },
  { notation: 'IN.ICSE.C10.SC.BIO.3', strand: 'Biology - Basic Biology', description: 'describe structure of a chromosome, genes, and DNA' },
  { notation: 'IN.ICSE.C10.SC.BIO.4', strand: 'Biology - Plant Physiology', description: 'describe absorption by roots: imbibition, diffusion, and osmosis' },
  { notation: 'IN.ICSE.C10.SC.BIO.5', strand: 'Biology - Plant Physiology', description: 'describe transpiration in plants: types and factors' },
  { notation: 'IN.ICSE.C10.SC.BIO.6', strand: 'Biology - Plant Physiology', description: 'describe photosynthesis: raw materials, light and dark reactions, products' },
  { notation: 'IN.ICSE.C10.SC.BIO.7', strand: 'Biology - Plant Physiology', description: 'describe respiration in plants: aerobic and anaerobic' },
  { notation: 'IN.ICSE.C10.SC.BIO.8', strand: 'Biology - Human Anatomy', description: 'describe circulatory system: structure of heart and blood vessels' },
  { notation: 'IN.ICSE.C10.SC.BIO.9', strand: 'Biology - Human Anatomy', description: 'describe composition of blood and its functions' },
  { notation: 'IN.ICSE.C10.SC.BIO.10', strand: 'Biology - Human Anatomy', description: 'describe excretory system with emphasis on kidneys and urine formation' },
  { notation: 'IN.ICSE.C10.SC.BIO.11', strand: 'Biology - Human Anatomy', description: 'describe nervous system: structure of brain, spinal cord, and reflex action' },
  { notation: 'IN.ICSE.C10.SC.BIO.12', strand: 'Biology - Human Anatomy', description: 'describe sense organs: eye and ear structure and function' },
  { notation: 'IN.ICSE.C10.SC.BIO.13', strand: 'Biology - Human Anatomy', description: 'describe endocrine system: location and hormones of major glands' },
  { notation: 'IN.ICSE.C10.SC.BIO.14', strand: 'Biology - Human Reproduction', description: 'describe reproductive systems: male and female reproductive organs' },
  { notation: 'IN.ICSE.C10.SC.BIO.15', strand: 'Biology - Human Reproduction', description: 'describe menstrual cycle and pregnancy' },
  { notation: 'IN.ICSE.C10.SC.BIO.16', strand: 'Biology - Health and Disease', description: 'describe immunity, vaccination, and common infectious diseases' },
  { notation: 'IN.ICSE.C10.SC.BIO.17', strand: 'Biology - Environment', description: 'describe air pollution and its effects on human health' },
  { notation: 'IN.ICSE.C10.SC.BIO.18', strand: 'Biology - Environment', description: 'describe water pollution and its effects' },
  { notation: 'IN.ICSE.C10.SC.BIO.19', strand: 'Biology - Environment', description: 'describe greenhouse effect and global warming' },
  { notation: 'IN.ICSE.C10.SC.BIO.20', strand: 'Biology - Environment', description: 'describe ozone layer depletion and its consequences' }
];

// =============================================================================
// CLASS 11 (Ages 16-17) - ISC Science stream (Physics 861, Chemistry 862, Biology 863)
// =============================================================================

const class11Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C11.SC.PH_MCH.1', strand: 'Physics - Units and Measurement', description: 'describe physical quantities, units, and dimensional analysis' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.2', strand: 'Physics - Units and Measurement', description: 'apply dimensional analysis to check correctness of equations' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.3', strand: 'Physics - Kinematics', description: 'describe motion in a straight line with equations of motion' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.4', strand: 'Physics - Kinematics', description: 'analyze motion in a plane using vectors and projectile motion' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.5', strand: 'Physics - Laws of Motion', description: 'apply Newton\'s laws of motion with free body diagrams' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.6', strand: 'Physics - Laws of Motion', description: 'describe friction: static, kinetic, and rolling' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.7', strand: 'Physics - Work Energy Power', description: 'compute work done by constant and variable forces' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.8', strand: 'Physics - Work Energy Power', description: 'apply work-energy theorem and conservation of energy' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.9', strand: 'Physics - System of Particles', description: 'describe centre of mass and motion of system of particles' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.10', strand: 'Physics - System of Particles', description: 'describe rotational motion: torque, angular momentum, moment of inertia' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.11', strand: 'Physics - Gravitation', description: 'state Newton\'s law of gravitation and compute gravitational force' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.12', strand: 'Physics - Gravitation', description: 'describe orbital velocity, escape velocity, and Kepler\'s laws' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.13', strand: 'Physics - Properties of Matter', description: 'describe elasticity: stress, strain, and Young\'s modulus' },
  { notation: 'IN.ICSE.C11.SC.PH_MCH.14', strand: 'Physics - Properties of Matter', description: 'describe fluid mechanics: pressure, Pascal\'s law, and Bernoulli\'s theorem' },
  { notation: 'IN.ICSE.C11.SC.PH_THR.1', strand: 'Physics - Thermodynamics', description: 'describe thermal properties of matter and heat transfer' },
  { notation: 'IN.ICSE.C11.SC.PH_THR.2', strand: 'Physics - Thermodynamics', description: 'state first law of thermodynamics and apply to thermodynamic processes' },
  { notation: 'IN.ICSE.C11.SC.PH_THR.3', strand: 'Physics - Thermodynamics', description: 'state second law of thermodynamics and describe heat engines' },
  { notation: 'IN.ICSE.C11.SC.PH_THR.4', strand: 'Physics - Kinetic Theory', description: 'describe kinetic theory of gases and gas laws' },
  { notation: 'IN.ICSE.C11.SC.PH_OPT.1', strand: 'Physics - Oscillations', description: 'describe simple harmonic motion and its equations' },
  { notation: 'IN.ICSE.C11.SC.PH_OPT.2', strand: 'Physics - Oscillations', description: 'describe energy in simple harmonic motion and pendulum' },
  { notation: 'IN.ICSE.C11.SC.PH_OPT.3', strand: 'Physics - Waves', description: 'describe transverse and longitudinal wave properties' },
  { notation: 'IN.ICSE.C11.SC.PH_OPT.4', strand: 'Physics - Waves', description: 'describe superposition, interference, and beats in waves' },
  { notation: 'IN.ICSE.C11.SC.PH_OPT.5', strand: 'Physics - Waves', description: 'describe Doppler effect in sound waves' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C11.SC.CH_PHC.1', strand: 'Chemistry - Basic Concepts', description: 'apply the mole concept and stoichiometric calculations' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.2', strand: 'Chemistry - Basic Concepts', description: 'describe laws of chemical combination and empirical/molecular formulas' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.3', strand: 'Chemistry - Atomic Structure', description: 'describe Bohr\'s model and quantum mechanical model of atom' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.4', strand: 'Chemistry - Atomic Structure', description: 'describe electronic configuration using quantum numbers and rules' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.5', strand: 'Chemistry - Periodic Table', description: 'describe classification of elements and periodicity in properties' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.6', strand: 'Chemistry - Chemical Bonding', description: 'describe ionic, covalent, and coordinate bonds using VSEPR theory' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.7', strand: 'Chemistry - Chemical Bonding', description: 'describe hybridization and molecular geometry of simple molecules' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.8', strand: 'Chemistry - States of Matter', description: 'describe properties of gases, liquids, and solids' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.9', strand: 'Chemistry - States of Matter', description: 'apply gas laws and ideal gas equation' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.10', strand: 'Chemistry - Thermodynamics', description: 'describe first law of thermodynamics and enthalpy changes' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.11', strand: 'Chemistry - Thermodynamics', description: 'describe entropy, Gibbs free energy, and spontaneity' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.12', strand: 'Chemistry - Equilibrium', description: 'describe chemical equilibrium and Le Chatelier\'s principle' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.13', strand: 'Chemistry - Equilibrium', description: 'apply Ka, Kb, Kw, and pH calculations for acids and bases' },
  { notation: 'IN.ICSE.C11.SC.CH_PHC.14', strand: 'Chemistry - Redox Reactions', description: 'describe oxidation-reduction reactions and balance redox equations' },
  { notation: 'IN.ICSE.C11.SC.CH_INC.1', strand: 'Chemistry - Hydrogen', description: 'describe position of hydrogen, isotopes, and its compounds' },
  { notation: 'IN.ICSE.C11.SC.CH_INC.2', strand: 'Chemistry - s-Block Elements', description: 'describe properties, compounds, and uses of alkali and alkaline earth metals' },
  { notation: 'IN.ICSE.C11.SC.CH_INC.3', strand: 'Chemistry - p-Block Elements', description: 'describe Group 13 and Group 14 elements and their important compounds' },
  { notation: 'IN.ICSE.C11.SC.CH_ORC.1', strand: 'Chemistry - Organic Basics', description: 'describe nomenclature, isomerism, and classification of organic compounds' },
  { notation: 'IN.ICSE.C11.SC.CH_ORC.2', strand: 'Chemistry - Organic Basics', description: 'describe electronic displacement effects and reaction mechanisms' },
  { notation: 'IN.ICSE.C11.SC.CH_ORC.3', strand: 'Chemistry - Hydrocarbons', description: 'describe preparation, properties, and reactions of alkanes, alkenes, alkynes' },
  { notation: 'IN.ICSE.C11.SC.CH_ORC.4', strand: 'Chemistry - Hydrocarbons', description: 'describe aromatic hydrocarbons: benzene and its derivatives' },
  { notation: 'IN.ICSE.C11.SC.CH_ORC.5', strand: 'Chemistry - Environmental Chemistry', description: 'describe environmental pollution and green chemistry' },

  // BIOLOGY
  { notation: 'IN.ICSE.C11.SC.BI_BOT.1', strand: 'Biology - Diversity of Life', description: 'describe taxonomy, nomenclature, and classification systems' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.2', strand: 'Biology - Plant Kingdom', description: 'classify plants into algae, bryophytes, pteridophytes, gymnosperms, angiosperms' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.3', strand: 'Biology - Plant Morphology', description: 'describe morphology of flowering plants: root, stem, leaf, flower' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.4', strand: 'Biology - Plant Anatomy', description: 'describe anatomy of dicot and monocot plants' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.5', strand: 'Biology - Plant Physiology', description: 'describe transport in plants: water, minerals, and phloem translocation' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.6', strand: 'Biology - Plant Physiology', description: 'describe mineral nutrition and role of macro and micro nutrients' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.7', strand: 'Biology - Plant Physiology', description: 'describe photosynthesis in higher plants in detail' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.8', strand: 'Biology - Plant Physiology', description: 'describe respiration in plants: glycolysis, Krebs cycle, electron transport' },
  { notation: 'IN.ICSE.C11.SC.BI_BOT.9', strand: 'Biology - Plant Physiology', description: 'describe plant growth and development with hormones' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.1', strand: 'Biology - Animal Kingdom', description: 'classify animals from Porifera to Chordata with examples' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.2', strand: 'Biology - Structural Organisation', description: 'describe structural organization in animals: tissues, organs, organ systems' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.3', strand: 'Biology - Digestion', description: 'describe digestion and absorption in humans' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.4', strand: 'Biology - Respiration', description: 'describe breathing and exchange of gases in humans' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.5', strand: 'Biology - Circulation', description: 'describe body fluids and circulation including heart and blood vessels' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.6', strand: 'Biology - Excretion', description: 'describe excretory products and their elimination' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.7', strand: 'Biology - Control and Coordination', description: 'describe neural control and coordination: nervous system' },
  { notation: 'IN.ICSE.C11.SC.BI_ZOO.8', strand: 'Biology - Control and Coordination', description: 'describe chemical coordination: endocrine glands and hormones' },
  { notation: 'IN.ICSE.C11.SC.BI_GEN.1', strand: 'Biology - Cell Biology', description: 'describe cell as unit of life and cell theory' },
  { notation: 'IN.ICSE.C11.SC.BI_GEN.2', strand: 'Biology - Cell Biology', description: 'describe biomolecules: carbohydrates, lipids, proteins, nucleic acids' },
  { notation: 'IN.ICSE.C11.SC.BI_GEN.3', strand: 'Biology - Cell Biology', description: 'describe cell cycle and cell division: mitosis and meiosis in detail' }
];

// =============================================================================
// CLASS 12 (Ages 17-18) - ISC Science (Physics 861, Chemistry 862, Biology 863)
// =============================================================================

const class12Standards: ICSEScienceStandard[] = [
  // PHYSICS
  { notation: 'IN.ICSE.C12.SC.PH_ELE.1', strand: 'Physics - Electrostatics', description: 'state Coulomb\'s law and compute electric field and potential' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.2', strand: 'Physics - Electrostatics', description: 'apply Gauss\'s law to find electric fields of simple charge distributions' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.3', strand: 'Physics - Electrostatics', description: 'describe capacitors and their combinations' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.4', strand: 'Physics - Current Electricity', description: 'apply Ohm\'s law, Kirchhoff\'s laws, and Wheatstone bridge in circuits' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.5', strand: 'Physics - Current Electricity', description: 'describe internal resistance, EMF, and potentiometer' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.6', strand: 'Physics - Magnetic Effects', description: 'describe magnetic effects of current: Biot-Savart law and Ampere\'s law' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.7', strand: 'Physics - Magnetic Effects', description: 'describe force on moving charges in magnetic field and cyclotron' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.8', strand: 'Physics - Magnetism', description: 'describe magnetism and magnetic properties of materials' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.9', strand: 'Physics - Electromagnetic Induction', description: 'describe Faraday\'s laws of electromagnetic induction and Lenz\'s law' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.10', strand: 'Physics - Electromagnetic Induction', description: 'describe self and mutual inductance' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.11', strand: 'Physics - AC', description: 'describe alternating current circuits: RLC circuits, resonance, power factor' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.12', strand: 'Physics - AC', description: 'describe transformer principle and its working' },
  { notation: 'IN.ICSE.C12.SC.PH_ELE.13', strand: 'Physics - EM Waves', description: 'describe electromagnetic waves and electromagnetic spectrum' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.1', strand: 'Physics - Ray Optics', description: 'describe reflection and refraction of light at spherical surfaces' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.2', strand: 'Physics - Ray Optics', description: 'describe lens formula, lens maker\'s formula, and combinations of lenses' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.3', strand: 'Physics - Ray Optics', description: 'describe optical instruments: microscope and telescope' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.4', strand: 'Physics - Wave Optics', description: 'describe wavefront, Huygens\' principle, and interference of light' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.5', strand: 'Physics - Wave Optics', description: 'describe Young\'s double slit experiment and fringe width' },
  { notation: 'IN.ICSE.C12.SC.PH_OPT.6', strand: 'Physics - Wave Optics', description: 'describe diffraction of light and polarisation' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.1', strand: 'Physics - Dual Nature', description: 'describe photoelectric effect and Einstein\'s equation' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.2', strand: 'Physics - Dual Nature', description: 'describe de Broglie hypothesis and wave nature of matter' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.3', strand: 'Physics - Atoms', description: 'describe Bohr\'s model of hydrogen atom and its spectrum' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.4', strand: 'Physics - Nuclei', description: 'describe nuclear binding energy, fission, and fusion' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.5', strand: 'Physics - Nuclei', description: 'describe radioactivity and decay laws' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.6', strand: 'Physics - Semiconductors', description: 'describe semiconductor electronics: p-n junction, diode, and transistor' },
  { notation: 'IN.ICSE.C12.SC.PH_MDP.7', strand: 'Physics - Semiconductors', description: 'describe logic gates: AND, OR, NOT, NAND, NOR' },

  // CHEMISTRY
  { notation: 'IN.ICSE.C12.SC.CH_PHC.1', strand: 'Chemistry - Solid State', description: 'describe types of solids, crystal lattice, and unit cells' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.2', strand: 'Chemistry - Solid State', description: 'describe packing efficiency and imperfections in solids' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.3', strand: 'Chemistry - Solutions', description: 'describe types of solutions, concentration terms, and solubility' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.4', strand: 'Chemistry - Solutions', description: 'describe colligative properties: Raoult\'s law, osmotic pressure, boiling/freezing point' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.5', strand: 'Chemistry - Electrochemistry', description: 'describe electrochemical cells, electrode potentials, and Nernst equation' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.6', strand: 'Chemistry - Electrochemistry', description: 'describe conductance in electrolytic solutions and Kohlrausch\'s law' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.7', strand: 'Chemistry - Chemical Kinetics', description: 'describe rate of reaction, rate law, and order of reaction' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.8', strand: 'Chemistry - Chemical Kinetics', description: 'describe first order reactions and half-life' },
  { notation: 'IN.ICSE.C12.SC.CH_PHC.9', strand: 'Chemistry - Surface Chemistry', description: 'describe adsorption, colloids, and emulsions' },
  { notation: 'IN.ICSE.C12.SC.CH_INC.1', strand: 'Chemistry - p-Block Elements', description: 'describe Group 15 elements: properties and compounds of nitrogen and phosphorus' },
  { notation: 'IN.ICSE.C12.SC.CH_INC.2', strand: 'Chemistry - p-Block Elements', description: 'describe Group 16, 17, 18 elements and their important compounds' },
  { notation: 'IN.ICSE.C12.SC.CH_INC.3', strand: 'Chemistry - d and f Block', description: 'describe d-block elements: general characteristics and compounds' },
  { notation: 'IN.ICSE.C12.SC.CH_INC.4', strand: 'Chemistry - d and f Block', description: 'describe f-block elements: lanthanoids and actinoids' },
  { notation: 'IN.ICSE.C12.SC.CH_INC.5', strand: 'Chemistry - Coordination Compounds', description: 'describe coordination compounds: nomenclature, bonding, and isomerism' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.1', strand: 'Chemistry - Haloalkanes', description: 'describe preparation, properties, and uses of haloalkanes and haloarenes' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.2', strand: 'Chemistry - Alcohols Phenols Ethers', description: 'describe preparation, properties, and uses of alcohols, phenols, and ethers' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.3', strand: 'Chemistry - Aldehydes Ketones', description: 'describe preparation, properties, and reactions of aldehydes and ketones' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.4', strand: 'Chemistry - Carboxylic Acids', description: 'describe preparation, properties, and reactions of carboxylic acids' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.5', strand: 'Chemistry - Nitrogen Compounds', description: 'describe amines and diazonium salts: preparation and reactions' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.6', strand: 'Chemistry - Biomolecules', description: 'describe carbohydrates, proteins, nucleic acids, and vitamins' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.7', strand: 'Chemistry - Polymers', description: 'describe polymers: classification, polymerization, and common examples' },
  { notation: 'IN.ICSE.C12.SC.CH_ORC.8', strand: 'Chemistry - Chemistry in Everyday Life', description: 'describe drugs, food additives, and cleansing agents' },

  // BIOLOGY
  { notation: 'IN.ICSE.C12.SC.BI_BOT.1', strand: 'Biology - Reproduction in Plants', description: 'describe sexual reproduction in flowering plants: pre-fertilization events' },
  { notation: 'IN.ICSE.C12.SC.BI_BOT.2', strand: 'Biology - Reproduction in Plants', description: 'describe double fertilization in angiosperms and post-fertilization events' },
  { notation: 'IN.ICSE.C12.SC.BI_BOT.3', strand: 'Biology - Reproduction in Plants', description: 'describe apomixis, polyembryony, and seed dispersal' },
  { notation: 'IN.ICSE.C12.SC.BI_ZOO.1', strand: 'Biology - Human Reproduction', description: 'describe male and female reproductive systems' },
  { notation: 'IN.ICSE.C12.SC.BI_ZOO.2', strand: 'Biology - Human Reproduction', description: 'describe gametogenesis, menstrual cycle, fertilization, and embryonic development' },
  { notation: 'IN.ICSE.C12.SC.BI_ZOO.3', strand: 'Biology - Reproductive Health', description: 'describe reproductive health, contraception, and STDs' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.1', strand: 'Biology - Genetics', description: 'describe Mendelian inheritance and laws of inheritance' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.2', strand: 'Biology - Genetics', description: 'describe chromosomal theory of inheritance and sex determination' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.3', strand: 'Biology - Genetics', description: 'describe genetic disorders: Mendelian and chromosomal' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.4', strand: 'Biology - Molecular Biology', description: 'describe DNA structure and Watson-Crick model' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.5', strand: 'Biology - Molecular Biology', description: 'describe DNA replication, transcription, and translation' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.6', strand: 'Biology - Molecular Biology', description: 'describe genetic code, regulation of gene expression, and human genome project' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.7', strand: 'Biology - Evolution', description: 'describe theories of evolution: Lamarck, Darwin, modern synthesis' },
  { notation: 'IN.ICSE.C12.SC.BI_GEN.8', strand: 'Biology - Evolution', description: 'describe evidence for evolution and Hardy-Weinberg principle' },
  { notation: 'IN.ICSE.C12.SC.BI_ZOO.4', strand: 'Biology - Human Health', description: 'describe common diseases in humans and immunity' },
  { notation: 'IN.ICSE.C12.SC.BI_ZOO.5', strand: 'Biology - Human Health', description: 'describe AIDS, cancer, and drug/alcohol abuse' },
  { notation: 'IN.ICSE.C12.SC.BI_BOT.4', strand: 'Biology - Biotechnology', description: 'describe principles of biotechnology and genetic engineering' },
  { notation: 'IN.ICSE.C12.SC.BI_BOT.5', strand: 'Biology - Biotechnology', description: 'describe applications of biotechnology in agriculture, medicine, and industry' },
  { notation: 'IN.ICSE.C12.SC.BI_ECO.1', strand: 'Biology - Ecology', description: 'describe organisms and populations: population growth and interactions' },
  { notation: 'IN.ICSE.C12.SC.BI_ECO.2', strand: 'Biology - Ecology', description: 'describe ecosystems: structure, function, productivity, and energy flow' },
  { notation: 'IN.ICSE.C12.SC.BI_ECO.3', strand: 'Biology - Ecology', description: 'describe biogeochemical cycles: carbon, nitrogen, water' },
  { notation: 'IN.ICSE.C12.SC.BI_ECO.4', strand: 'Biology - Ecology', description: 'describe biodiversity, conservation, and environmental issues' }
];

// =============================================================================
// EXPORT ICSE SCIENCE CURRICULUM
// =============================================================================

export const icseScienceCurriculum: ICSEScienceCurriculum = {
  code: 'INDIAN_ICSE',
  name: 'Indian Certificate of Secondary Education (CISCE)',
  country: 'IN',
  version: '2027-28',
  sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
  subject: 'SCIENCE',
  classes: [
    { class: 1, ageRangeMin: 6, ageRangeMax: 7, standards: class1Standards },
    { class: 2, ageRangeMin: 7, ageRangeMax: 8, standards: class2Standards },
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

export function getICSEScienceStandardsForClass(classNum: number): ICSEScienceStandard[] {
  const classData = icseScienceCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalICSEScienceStandardsCount(): number {
  return icseScienceCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default icseScienceCurriculum;
