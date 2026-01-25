/**
 * CBSE (Central Board of Secondary Education) - Science Standards
 * Classes 1-12 (Primary through Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes
 * rather than specific textbook chapters.
 *
 * Classes 1-5: Environmental Studies (EVS) covering basic science concepts
 * Classes 6-8: Integrated Science (Physics, Chemistry, Biology)
 * Classes 9-10: Science (Physics, Chemistry, Biology) - Board Examination
 * Classes 11-12: Separate subjects - Physics, Chemistry, Biology (Science Stream)
 *
 * NOTE: Chapter mapping to NEP 2020 textbooks (2024-25 onwards) is pending.
 * New NCERT textbooks include "Curiosity" (Science) series.
 *
 * Notation System: IN.CBSE.C{class}.SC.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (1-12)
 * - SC = Science (Classes 1-10), PH/CH/BI for Classes 11-12
 * - Strand codes:
 *   Classes 1-5 (EVS):
 *   - LIV = Living World (Plants, Animals)
 *   - ENV = Environment and Surroundings
 *   - HEA = Health and Hygiene
 *   - FAM = Family and Community
 *   - FOD = Food
 *   - WAT = Water
 *   - SHL = Shelter
 *   - TRV = Travel and Transport
 *   - WRK = Work and Play
 *   Classes 6-10 (Science):
 *   - PHY = Physics
 *   - CHM = Chemistry
 *   - BIO = Biology
 *   Classes 11-12 (Separate Subjects):
 *   Physics (PH):
 *   - MCH = Mechanics
 *   - THR = Thermodynamics
 *   - ELC = Electricity & Magnetism
 *   - OPT = Optics
 *   - MDP = Modern Physics
 *   Chemistry (CH):
 *   - PHC = Physical Chemistry
 *   - INC = Inorganic Chemistry
 *   - ORC = Organic Chemistry
 *   Biology (BI):
 *   - BOT = Botany
 *   - ZOO = Zoology
 *   - GEN = Genetics
 *   - ECO = Ecology
 */

export interface CBSEScienceStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // Future: NEP 2020 NCERT chapter mapping
}

export interface CBSEScienceClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: CBSEScienceStandard[];
}

export interface CBSEScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: CBSEScienceClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7)
// NCERT: Rimjhim (EVS integrated with Hindi) / Environmental Studies
// =============================================================================

const class1Standards: CBSEScienceStandard[] = [
  // LIVING WORLD
  {
    notation: 'IN.CBSE.C1.SC.LIV.1',
    strand: 'Living World',
    description: 'identify common plants in the surroundings',
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.2',
    strand: 'Living World',
    description: 'identify common animals and their homes',
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.3',
    strand: 'Living World',
    description: 'recognize parts of a plant: root, stem, leaf, flower',
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.4',
    strand: 'Living World',
    description: 'understand that animals have different body coverings',
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.5',
    strand: 'Living World',
    description: 'classify animals as domestic and wild',
  },

  // FAMILY AND COMMUNITY
  {
    notation: 'IN.CBSE.C1.SC.FAM.1',
    strand: 'Family and Community',
    description: 'identify family members and their relationships',
  },
  {
    notation: 'IN.CBSE.C1.SC.FAM.2',
    strand: 'Family and Community',
    description: 'understand roles of family members',
  },

  // HEALTH AND HYGIENE
  {
    notation: 'IN.CBSE.C1.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand importance of cleanliness',
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'identify healthy habits: brushing teeth, bathing, washing hands',
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'identify body parts and their functions',
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.4',
    strand: 'Health and Hygiene',
    description: 'understand the five senses',
  },

  // FOOD
  {
    notation: 'IN.CBSE.C1.SC.FOD.1',
    strand: 'Food',
    description: 'identify different types of food: fruits, vegetables, grains',
  },
  {
    notation: 'IN.CBSE.C1.SC.FOD.2',
    strand: 'Food',
    description: 'understand that food gives us energy',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C1.SC.ENV.1',
    strand: 'Environment',
    description: 'observe changes in weather (hot, cold, rainy)',
  },
  {
    notation: 'IN.CBSE.C1.SC.ENV.2',
    strand: 'Environment',
    description: 'understand day and night',
  }
];

// =============================================================================
// CLASS 2 (Ages 7-8)
// NCERT: Environmental Studies
// =============================================================================

const class2Standards: CBSEScienceStandard[] = [
  // LIVING WORLD
  {
    notation: 'IN.CBSE.C2.SC.LIV.1',
    strand: 'Living World',
    description: 'identify plants that give us food',
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how plants grow from seeds',
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.3',
    strand: 'Living World',
    description: 'identify what animals eat and where they live',
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.4',
    strand: 'Living World',
    description: 'understand that animals have young ones',
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.5',
    strand: 'Living World',
    description: 'classify animals by what they eat: herbivores, carnivores',
  },

  // WATER
  {
    notation: 'IN.CBSE.C2.SC.WAT.1',
    strand: 'Water',
    description: 'understand uses of water in daily life',
  },
  {
    notation: 'IN.CBSE.C2.SC.WAT.2',
    strand: 'Water',
    description: 'identify sources of water',
  },
  {
    notation: 'IN.CBSE.C2.SC.WAT.3',
    strand: 'Water',
    description: 'understand importance of saving water',
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C2.SC.SHL.1',
    strand: 'Shelter',
    description: 'identify different types of houses',
  },
  {
    notation: 'IN.CBSE.C2.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand why we need shelter',
  },

  // HEALTH AND HYGIENE
  {
    notation: 'IN.CBSE.C2.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand importance of balanced diet',
  },
  {
    notation: 'IN.CBSE.C2.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'identify junk food and healthy food',
  },
  {
    notation: 'IN.CBSE.C2.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'understand need for exercise and rest',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C2.SC.ENV.1',
    strand: 'Environment',
    description: 'observe and describe the four seasons',
  },
  {
    notation: 'IN.CBSE.C2.SC.ENV.2',
    strand: 'Environment',
    description: 'understand how seasons affect our clothes and activities',
  },
  {
    notation: 'IN.CBSE.C2.SC.ENV.3',
    strand: 'Environment',
    description: 'understand importance of air',
  },

  // TRAVEL
  {
    notation: 'IN.CBSE.C2.SC.TRV.1',
    strand: 'Travel and Transport',
    description: 'identify different modes of transport',
  },
  {
    notation: 'IN.CBSE.C2.SC.TRV.2',
    strand: 'Travel and Transport',
    description: 'classify transport as land, water, and air',
  }
];

// =============================================================================
// CLASS 3 (Ages 8-9)
// NCERT: Looking Around (EVS)
// =============================================================================

const class3Standards: CBSEScienceStandard[] = [
  // LIVING WORLD - PLANTS
  {
    notation: 'IN.CBSE.C3.SC.LIV.1',
    strand: 'Living World',
    description: 'understand different parts of plants and their functions',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.2',
    strand: 'Living World',
    description: 'understand that plants need water, air, sunlight to grow',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.3',
    strand: 'Living World',
    description: 'identify plants that grow in water and on land',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.4',
    strand: 'Living World',
    description: 'understand how seeds spread and grow',
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C3.SC.LIV.5',
    strand: 'Living World',
    description: 'identify animals by their body coverings: fur, feathers, scales',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.6',
    strand: 'Living World',
    description: 'understand different ways animals move',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.7',
    strand: 'Living World',
    description: 'understand animals breathe in different ways',
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.8',
    strand: 'Living World',
    description: 'identify birds and their special features',
  },

  // FOOD
  {
    notation: 'IN.CBSE.C3.SC.FOD.1',
    strand: 'Food',
    description: 'identify food from plants: roots, stems, leaves, fruits, seeds',
  },
  {
    notation: 'IN.CBSE.C3.SC.FOD.2',
    strand: 'Food',
    description: 'understand food from animals: milk, eggs, honey',
  },
  {
    notation: 'IN.CBSE.C3.SC.FOD.3',
    strand: 'Food',
    description: 'understand how food is cooked and preserved',
  },

  // WATER
  {
    notation: 'IN.CBSE.C3.SC.WAT.1',
    strand: 'Water',
    description: 'understand the water cycle (basic)',
  },
  {
    notation: 'IN.CBSE.C3.SC.WAT.2',
    strand: 'Water',
    description: 'understand importance of clean water',
  },
  {
    notation: 'IN.CBSE.C3.SC.WAT.3',
    strand: 'Water',
    description: 'identify water-borne diseases and prevention',
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C3.SC.SHL.1',
    strand: 'Shelter',
    description: 'understand houses are made of different materials',
  },
  {
    notation: 'IN.CBSE.C3.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand why houses are designed differently in different places',
  },

  // HEALTH
  {
    notation: 'IN.CBSE.C3.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand need for safe drinking water',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C3.SC.ENV.1',
    strand: 'Environment',
    description: 'understand relationship between living things',
  },
  {
    notation: 'IN.CBSE.C3.SC.ENV.2',
    strand: 'Environment',
    description: 'understand importance of trees',
  },

  // FAMILY
  {
    notation: 'IN.CBSE.C3.SC.FAM.1',
    strand: 'Family and Community',
    description: 'understand how families are different yet similar',
  }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// NCERT: Looking Around (EVS)
// =============================================================================

const class4Standards: CBSEScienceStandard[] = [
  // LIVING WORLD - PLANTS
  {
    notation: 'IN.CBSE.C4.SC.LIV.1',
    strand: 'Living World',
    description: 'understand plants have flowers, fruits, and seeds',
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how new plants grow from different parts',
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.3',
    strand: 'Living World',
    description: 'identify trees that grow in different climates',
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C4.SC.LIV.4',
    strand: 'Living World',
    description: 'understand different animals have different teeth for different food',
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.5',
    strand: 'Living World',
    description: 'understand food chain in nature',
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.6',
    strand: 'Living World',
    description: 'understand how animals protect themselves',
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.7',
    strand: 'Living World',
    description: 'identify endangered animals and need for conservation',
  },

  // FOOD
  {
    notation: 'IN.CBSE.C4.SC.FOD.1',
    strand: 'Food',
    description: 'understand digestion of food (basic)',
  },
  {
    notation: 'IN.CBSE.C4.SC.FOD.2',
    strand: 'Food',
    description: 'understand importance of different nutrients',
  },
  {
    notation: 'IN.CBSE.C4.SC.FOD.3',
    strand: 'Food',
    description: 'understand how food spoils and can be preserved',
  },

  // WATER
  {
    notation: 'IN.CBSE.C4.SC.WAT.1',
    strand: 'Water',
    description: 'understand scarcity of water in some regions',
  },
  {
    notation: 'IN.CBSE.C4.SC.WAT.2',
    strand: 'Water',
    description: 'understand methods of rainwater harvesting',
  },
  {
    notation: 'IN.CBSE.C4.SC.WAT.3',
    strand: 'Water',
    description: 'understand effects of floods and droughts',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C4.SC.ENV.1',
    strand: 'Environment',
    description: 'understand how garbage is created and disposed',
  },
  {
    notation: 'IN.CBSE.C4.SC.ENV.2',
    strand: 'Environment',
    description: 'understand water pollution and its effects',
  },
  {
    notation: 'IN.CBSE.C4.SC.ENV.3',
    strand: 'Environment',
    description: 'understand deforestation and its effects',
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C4.SC.SHL.1',
    strand: 'Shelter',
    description: 'understand houses in different regions of India',
  },
  {
    notation: 'IN.CBSE.C4.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand how animals build their homes',
  },

  // WORK AND PLAY
  {
    notation: 'IN.CBSE.C4.SC.WRK.1',
    strand: 'Work and Play',
    description: 'understand different occupations in the community',
  },

  // TRAVEL
  {
    notation: 'IN.CBSE.C4.SC.TRV.1',
    strand: 'Travel and Transport',
    description: 'understand how goods are transported',
  },
  {
    notation: 'IN.CBSE.C4.SC.TRV.2',
    strand: 'Travel and Transport',
    description: 'understand reading maps and directions',
  }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// NCERT: Looking Around (EVS)
// =============================================================================

const class5Standards: CBSEScienceStandard[] = [
  // LIVING WORLD - PLANTS
  {
    notation: 'IN.CBSE.C5.SC.LIV.1',
    strand: 'Living World',
    description: 'understand germination and growth of seeds',
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how plants make food through photosynthesis (basic)',
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.3',
    strand: 'Living World',
    description: 'identify different types of roots and their functions',
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C5.SC.LIV.4',
    strand: 'Living World',
    description: 'understand how animals adapt to their environment',
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.5',
    strand: 'Living World',
    description: 'understand life cycle of animals: egg, larva, pupa, adult',
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.6',
    strand: 'Living World',
    description: 'identify different habitats and animals that live there',
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.7',
    strand: 'Living World',
    description: 'understand migration of birds',
  },

  // FOOD
  {
    notation: 'IN.CBSE.C5.SC.FOD.1',
    strand: 'Food',
    description: 'understand food chain and food web',
  },
  {
    notation: 'IN.CBSE.C5.SC.FOD.2',
    strand: 'Food',
    description: 'understand how food travels from farm to plate',
  },
  {
    notation: 'IN.CBSE.C5.SC.FOD.3',
    strand: 'Food',
    description: 'understand importance of agriculture and farming',
  },

  // HEALTH
  {
    notation: 'IN.CBSE.C5.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand diseases spread by mosquitoes: malaria, dengue',
  },
  {
    notation: 'IN.CBSE.C5.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'understand prevention of mosquito-borne diseases',
  },
  {
    notation: 'IN.CBSE.C5.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'understand first aid (basic)',
  },

  // WATER
  {
    notation: 'IN.CBSE.C5.SC.WAT.1',
    strand: 'Water',
    description: 'understand water cycle in detail',
  },
  {
    notation: 'IN.CBSE.C5.SC.WAT.2',
    strand: 'Water',
    description: 'understand water conservation methods',
  },
  {
    notation: 'IN.CBSE.C5.SC.WAT.3',
    strand: 'Water',
    description: 'understand role of forests in water cycle',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C5.SC.ENV.1',
    strand: 'Environment',
    description: 'understand natural disasters: earthquakes',
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.2',
    strand: 'Environment',
    description: 'understand natural disasters: floods',
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.3',
    strand: 'Environment',
    description: 'understand importance of biodiversity',
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.4',
    strand: 'Environment',
    description: 'understand how humans affect the environment',
  },

  // EARTH AND SPACE
  {
    notation: 'IN.CBSE.C5.SC.EAS.1',
    strand: 'Earth and Space',
    description: 'understand the earth has layers',
  },
  {
    notation: 'IN.CBSE.C5.SC.EAS.2',
    strand: 'Earth and Space',
    description: 'understand what causes earthquakes (basic)',
  }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// NCERT: Science Textbook for Class VI
// =============================================================================

const class6Standards: CBSEScienceStandard[] = [
  // FOOD
  {
    notation: 'IN.CBSE.C6.SC.FOD.1',
    strand: 'Food',
    description: 'identify different sources of food',
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.2',
    strand: 'Food',
    description: 'understand components of food: carbohydrates, proteins, fats, vitamins',
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.3',
    strand: 'Food',
    description: 'test for presence of starch and protein in food',
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.4',
    strand: 'Food',
    description: 'understand balanced diet and deficiency diseases',
  },

  // BIOLOGY - PLANTS
  {
    notation: 'IN.CBSE.C6.SC.BIO.1',
    strand: 'Biology',
    description: 'understand the process of photosynthesis',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.2',
    strand: 'Biology',
    description: 'identify different types of plants: herbs, shrubs, trees',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.3',
    strand: 'Biology',
    description: 'understand functions of roots, stems, and leaves',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.4',
    strand: 'Biology',
    description: 'understand structure and function of flower parts',
  },

  // BIOLOGY - ANIMALS AND HUMANS
  {
    notation: 'IN.CBSE.C6.SC.BIO.5',
    strand: 'Biology',
    description: 'understand different body movements in animals',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.6',
    strand: 'Biology',
    description: 'understand human skeleton and joints',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.7',
    strand: 'Biology',
    description: 'understand types of joints: ball and socket, hinge, pivot',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.8',
    strand: 'Biology',
    description: 'classify organisms into groups',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.9',
    strand: 'Biology',
    description: 'understand habitat and adaptation',
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.10',
    strand: 'Biology',
    description: 'understand characteristics of living things',
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C6.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand fibre to fabric: natural and synthetic fibres',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand how yarn is made from fibres',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.3',
    strand: 'Chemistry',
    description: 'distinguish between materials based on appearance and solubility',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand solubility and transparency of materials',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand changes in materials: reversible and irreversible',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.6',
    strand: 'Chemistry',
    description: 'understand methods of separation: filtration, evaporation, decantation',
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.7',
    strand: 'Chemistry',
    description: 'understand saturated solutions',
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C6.SC.PHY.1',
    strand: 'Physics',
    description: 'understand different types of motion: rectilinear, circular, periodic',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.2',
    strand: 'Physics',
    description: 'measure length, time using appropriate instruments',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.3',
    strand: 'Physics',
    description: 'understand properties of light: rectilinear propagation, shadows',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.4',
    strand: 'Physics',
    description: 'understand reflection from plane and curved surfaces',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.5',
    strand: 'Physics',
    description: 'understand electric circuits and components',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.6',
    strand: 'Physics',
    description: 'understand conductors and insulators',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.7',
    strand: 'Physics',
    description: 'understand magnets: properties and uses',
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.8',
    strand: 'Physics',
    description: 'identify magnetic and non-magnetic materials',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C6.SC.ENV.1',
    strand: 'Environment',
    description: 'understand water cycle and its importance',
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.2',
    strand: 'Environment',
    description: 'understand sources and conservation of water',
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.3',
    strand: 'Environment',
    description: 'understand air composition and its importance',
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.4',
    strand: 'Environment',
    description: 'understand garbage management: composting, recycling',
  }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// NCERT: Science Textbook for Class VII
// =============================================================================

const class7Standards: CBSEScienceStandard[] = [
  // BIOLOGY
  {
    notation: 'IN.CBSE.C7.SC.BIO.1',
    strand: 'Biology',
    description: 'understand nutrition in plants: photosynthesis in detail',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.2',
    strand: 'Biology',
    description: 'understand modes of nutrition: autotrophic and heterotrophic',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.3',
    strand: 'Biology',
    description: 'understand human digestive system',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.4',
    strand: 'Biology',
    description: 'understand digestion in grass-eating animals',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.5',
    strand: 'Biology',
    description: 'understand respiration in organisms',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.6',
    strand: 'Biology',
    description: 'understand breathing and cellular respiration',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.7',
    strand: 'Biology',
    description: 'understand transportation in plants and animals',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.8',
    strand: 'Biology',
    description: 'understand circulatory system: heart, blood, blood vessels',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.9',
    strand: 'Biology',
    description: 'understand excretion in humans',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.10',
    strand: 'Biology',
    description: 'understand reproduction in plants: vegetative, sexual',
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.11',
    strand: 'Biology',
    description: 'understand pollination and fertilization in plants',
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C7.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand wool and silk: animal fibres',
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand physical and chemical changes',
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.3',
    strand: 'Chemistry',
    description: 'understand acids, bases, and salts',
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand neutralization reaction',
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand indicators: natural and synthetic',
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C7.SC.PHY.1',
    strand: 'Physics',
    description: 'understand heat transfer: conduction, convection, radiation',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.2',
    strand: 'Physics',
    description: 'understand temperature measurement',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.3',
    strand: 'Physics',
    description: 'understand speed, distance, and time relationship',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.4',
    strand: 'Physics',
    description: 'understand uniform and non-uniform motion',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.5',
    strand: 'Physics',
    description: 'understand distance-time graphs',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.6',
    strand: 'Physics',
    description: 'understand electric current and its effects',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.7',
    strand: 'Physics',
    description: 'understand electromagnets and their applications',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.8',
    strand: 'Physics',
    description: 'understand light: reflection, formation of images',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.9',
    strand: 'Physics',
    description: 'understand spherical mirrors and lenses',
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.10',
    strand: 'Physics',
    description: 'understand wind: causes and effects',
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C7.SC.ENV.1',
    strand: 'Environment',
    description: 'understand soil: types and formation',
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.2',
    strand: 'Environment',
    description: 'understand soil erosion and conservation',
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.3',
    strand: 'Environment',
    description: 'understand water: importance and sewage treatment',
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.4',
    strand: 'Environment',
    description: 'understand forests: importance and conservation',
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.5',
    strand: 'Environment',
    description: 'understand wastewater management',
  }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// NCERT: Science Textbook for Class VIII
// =============================================================================

const class8Standards: CBSEScienceStandard[] = [
  // BIOLOGY
  {
    notation: 'IN.CBSE.C8.SC.BIO.1',
    strand: 'Biology',
    description: 'understand crop production and management',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.2',
    strand: 'Biology',
    description: 'understand cell: structure and functions',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.3',
    strand: 'Biology',
    description: 'compare plant and animal cells',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.4',
    strand: 'Biology',
    description: 'understand microorganisms: types and uses',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.5',
    strand: 'Biology',
    description: 'understand communicable diseases and prevention',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.6',
    strand: 'Biology',
    description: 'understand food preservation methods',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.7',
    strand: 'Biology',
    description: 'understand reproduction in animals: sexual and asexual',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.8',
    strand: 'Biology',
    description: 'understand human reproductive system',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.9',
    strand: 'Biology',
    description: 'understand puberty and adolescence',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.10',
    strand: 'Biology',
    description: 'understand conservation of plants and animals',
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.11',
    strand: 'Biology',
    description: 'understand biodiversity and its importance',
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C8.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand synthetic fibres and plastics',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand properties and uses of plastics',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.3',
    strand: 'Chemistry',
    description: 'understand metals and non-metals: properties',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand reactions of metals with air, water, acids',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand coal and petroleum: formation and uses',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.6',
    strand: 'Chemistry',
    description: 'understand natural resources: exhaustible and inexhaustible',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.7',
    strand: 'Chemistry',
    description: 'understand combustion and flame',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.8',
    strand: 'Chemistry',
    description: 'understand types of combustion and fire safety',
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.9',
    strand: 'Chemistry',
    description: 'understand chemical effects of electric current',
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C8.SC.PHY.1',
    strand: 'Physics',
    description: 'understand force: types and effects',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.2',
    strand: 'Physics',
    description: 'understand pressure in liquids and gases',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.3',
    strand: 'Physics',
    description: 'understand atmospheric pressure',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.4',
    strand: 'Physics',
    description: 'understand friction: causes, types, advantages, disadvantages',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.5',
    strand: 'Physics',
    description: 'understand ways to reduce friction',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.6',
    strand: 'Physics',
    description: 'understand sound: production and propagation',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.7',
    strand: 'Physics',
    description: 'understand characteristics of sound: pitch, loudness',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.8',
    strand: 'Physics',
    description: 'understand human ear structure and hearing',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.9',
    strand: 'Physics',
    description: 'understand reflection of light: laws and mirrors',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.10',
    strand: 'Physics',
    description: 'understand human eye: structure and defects',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.11',
    strand: 'Physics',
    description: 'understand earthquakes and seismic waves',
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.12',
    strand: 'Physics',
    description: 'understand lightning and static electricity',
  },

  // ENVIRONMENT / EARTH SCIENCE
  {
    notation: 'IN.CBSE.C8.SC.ENV.1',
    strand: 'Environment',
    description: 'understand air pollution and its effects',
  },
  {
    notation: 'IN.CBSE.C8.SC.ENV.2',
    strand: 'Environment',
    description: 'understand water pollution and purification',
  },
  {
    notation: 'IN.CBSE.C8.SC.ENV.3',
    strand: 'Environment',
    description: 'understand greenhouse effect and global warming',
  },

  // ASTRONOMY
  {
    notation: 'IN.CBSE.C8.SC.AST.1',
    strand: 'Astronomy',
    description: 'understand stars, constellations, and solar system',
  },
  {
    notation: 'IN.CBSE.C8.SC.AST.2',
    strand: 'Astronomy',
    description: 'understand moon phases and eclipses',
  },
  {
    notation: 'IN.CBSE.C8.SC.AST.3',
    strand: 'Astronomy',
    description: 'understand artificial satellites and their uses',
  }
];

// =============================================================================
// CLASS 9 (Ages 14-15)
// NCERT: Science Textbook for Class IX
// Secondary Education - Board Exam Preparation
// =============================================================================

const class9Standards: CBSEScienceStandard[] = [
  // PHYSICS - MOTION
  {
    notation: 'IN.CBSE.C9.SC.PHY.1',
    strand: 'Physics',
    description: 'describe motion in terms of distance and displacement',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.2',
    strand: 'Physics',
    description: 'calculate speed, velocity, and acceleration',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.3',
    strand: 'Physics',
    description: 'interpret distance-time and velocity-time graphs',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.4',
    strand: 'Physics',
    description: 'apply equations of uniformly accelerated motion',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.5',
    strand: 'Physics',
    description: 'understand uniform circular motion',
  },

  // PHYSICS - FORCE AND LAWS OF MOTION
  {
    notation: 'IN.CBSE.C9.SC.PHY.6',
    strand: 'Physics',
    description: 'state and apply Newton\'s first law of motion',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.7',
    strand: 'Physics',
    description: 'understand inertia and its types',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.8',
    strand: 'Physics',
    description: 'state and apply Newton\'s second law: F = ma',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.9',
    strand: 'Physics',
    description: 'state and apply Newton\'s third law of motion',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.10',
    strand: 'Physics',
    description: 'understand conservation of momentum',
  },

  // PHYSICS - GRAVITATION
  {
    notation: 'IN.CBSE.C9.SC.PHY.11',
    strand: 'Physics',
    description: 'state Newton\'s law of universal gravitation',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.12',
    strand: 'Physics',
    description: 'calculate acceleration due to gravity',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.13',
    strand: 'Physics',
    description: 'differentiate between mass and weight',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.14',
    strand: 'Physics',
    description: 'understand thrust and pressure',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.15',
    strand: 'Physics',
    description: 'understand buoyancy and Archimedes\' principle',
  },

  // PHYSICS - WORK AND ENERGY
  {
    notation: 'IN.CBSE.C9.SC.PHY.16',
    strand: 'Physics',
    description: 'define work and calculate work done',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.17',
    strand: 'Physics',
    description: 'understand kinetic and potential energy',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.18',
    strand: 'Physics',
    description: 'apply law of conservation of energy',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.19',
    strand: 'Physics',
    description: 'calculate power and efficiency',
  },

  // PHYSICS - SOUND
  {
    notation: 'IN.CBSE.C9.SC.PHY.20',
    strand: 'Physics',
    description: 'understand production and propagation of sound',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.21',
    strand: 'Physics',
    description: 'identify characteristics of sound: pitch, loudness, quality',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.22',
    strand: 'Physics',
    description: 'understand reflection of sound and echo',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.23',
    strand: 'Physics',
    description: 'understand applications of ultrasound and SONAR',
  },
  {
    notation: 'IN.CBSE.C9.SC.PHY.24',
    strand: 'Physics',
    description: 'understand structure and function of human ear',
  },

  // CHEMISTRY - MATTER
  {
    notation: 'IN.CBSE.C9.SC.CHM.1',
    strand: 'Chemistry',
    description: 'classify matter based on physical and chemical properties',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand particle nature of matter',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.3',
    strand: 'Chemistry',
    description: 'explain changes of state: melting, boiling, sublimation',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand effect of temperature and pressure on states',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.5',
    strand: 'Chemistry',
    description: 'explain evaporation and factors affecting it',
  },

  // CHEMISTRY - IS MATTER AROUND US PURE
  {
    notation: 'IN.CBSE.C9.SC.CHM.6',
    strand: 'Chemistry',
    description: 'differentiate between pure substances and mixtures',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.7',
    strand: 'Chemistry',
    description: 'classify mixtures as homogeneous and heterogeneous',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.8',
    strand: 'Chemistry',
    description: 'understand solutions, suspensions, and colloids',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.9',
    strand: 'Chemistry',
    description: 'apply separation techniques: filtration, distillation, chromatography',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.10',
    strand: 'Chemistry',
    description: 'differentiate between elements and compounds',
  },

  // CHEMISTRY - ATOMS AND MOLECULES
  {
    notation: 'IN.CBSE.C9.SC.CHM.11',
    strand: 'Chemistry',
    description: 'state Dalton\'s atomic theory and its postulates',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.12',
    strand: 'Chemistry',
    description: 'understand atomic and molecular masses',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.13',
    strand: 'Chemistry',
    description: 'write chemical formulae of compounds',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.14',
    strand: 'Chemistry',
    description: 'understand mole concept and molar mass',
  },

  // CHEMISTRY - STRUCTURE OF THE ATOM
  {
    notation: 'IN.CBSE.C9.SC.CHM.15',
    strand: 'Chemistry',
    description: 'describe Thomson\'s and Rutherford\'s atomic models',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.16',
    strand: 'Chemistry',
    description: 'understand Bohr\'s model of atom',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.17',
    strand: 'Chemistry',
    description: 'calculate number of electrons, protons, neutrons',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.18',
    strand: 'Chemistry',
    description: 'write electronic configuration of elements',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.19',
    strand: 'Chemistry',
    description: 'understand valency and its determination',
  },
  {
    notation: 'IN.CBSE.C9.SC.CHM.20',
    strand: 'Chemistry',
    description: 'understand isotopes and isobars',
  },

  // BIOLOGY - FUNDAMENTAL UNIT OF LIFE
  {
    notation: 'IN.CBSE.C9.SC.BIO.1',
    strand: 'Biology',
    description: 'understand cell theory and types of cells',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.2',
    strand: 'Biology',
    description: 'differentiate between prokaryotic and eukaryotic cells',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.3',
    strand: 'Biology',
    description: 'describe structure and function of cell membrane',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.4',
    strand: 'Biology',
    description: 'describe structure and function of nucleus',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.5',
    strand: 'Biology',
    description: 'describe structure and function of cytoplasmic organelles',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.6',
    strand: 'Biology',
    description: 'differentiate between plant and animal cells',
  },

  // BIOLOGY - TISSUES
  {
    notation: 'IN.CBSE.C9.SC.BIO.7',
    strand: 'Biology',
    description: 'classify plant tissues: meristematic and permanent',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.8',
    strand: 'Biology',
    description: 'describe types of simple and complex plant tissues',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.9',
    strand: 'Biology',
    description: 'classify animal tissues: epithelial, connective, muscular, nervous',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.10',
    strand: 'Biology',
    description: 'relate structure of tissues to their functions',
  },

  // BIOLOGY - DIVERSITY IN LIVING ORGANISMS
  {
    notation: 'IN.CBSE.C9.SC.BIO.11',
    strand: 'Biology',
    description: 'understand need for classification of organisms',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.12',
    strand: 'Biology',
    description: 'explain Whittaker\'s five kingdom classification',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.13',
    strand: 'Biology',
    description: 'classify organisms into kingdoms: Monera to Animalia',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.14',
    strand: 'Biology',
    description: 'understand hierarchy of classification levels',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.15',
    strand: 'Biology',
    description: 'understand binomial nomenclature',
  },

  // BIOLOGY - WHY DO WE FALL ILL
  {
    notation: 'IN.CBSE.C9.SC.BIO.16',
    strand: 'Biology',
    description: 'differentiate between health and disease',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.17',
    strand: 'Biology',
    description: 'classify diseases: acute, chronic, infectious, non-infectious',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.18',
    strand: 'Biology',
    description: 'understand causes and transmission of infectious diseases',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.19',
    strand: 'Biology',
    description: 'understand principles of treatment and prevention',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.20',
    strand: 'Biology',
    description: 'explain immunization and vaccines',
  },

  // BIOLOGY - NATURAL RESOURCES
  {
    notation: 'IN.CBSE.C9.SC.BIO.21',
    strand: 'Biology',
    description: 'understand biogeochemical cycles: water, nitrogen, carbon, oxygen',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.22',
    strand: 'Biology',
    description: 'explain causes and effects of air pollution',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.23',
    strand: 'Biology',
    description: 'explain causes and effects of water pollution',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.24',
    strand: 'Biology',
    description: 'understand soil formation and erosion',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.25',
    strand: 'Biology',
    description: 'understand ozone layer depletion and its effects',
  },

  // BIOLOGY - IMPROVEMENT IN FOOD RESOURCES
  {
    notation: 'IN.CBSE.C9.SC.BIO.26',
    strand: 'Biology',
    description: 'understand crop variety improvement methods',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.27',
    strand: 'Biology',
    description: 'explain crop production and protection management',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.28',
    strand: 'Biology',
    description: 'understand animal husbandry practices',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.29',
    strand: 'Biology',
    description: 'explain poultry farming and fish production',
  },
  {
    notation: 'IN.CBSE.C9.SC.BIO.30',
    strand: 'Biology',
    description: 'understand bee-keeping and its products',
  }
];

// =============================================================================
// CLASS 10 (Ages 15-16)
// NCERT: Science Textbook for Class X
// Secondary Education - Board Examination Year
// =============================================================================

const class10Standards: CBSEScienceStandard[] = [
  // CHEMISTRY - CHEMICAL REACTIONS AND EQUATIONS
  {
    notation: 'IN.CBSE.C10.SC.CHM.1',
    strand: 'Chemistry',
    description: 'identify types of chemical reactions',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.2',
    strand: 'Chemistry',
    description: 'write and balance chemical equations',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.3',
    strand: 'Chemistry',
    description: 'understand combination and decomposition reactions',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand displacement and double displacement reactions',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.5',
    strand: 'Chemistry',
    description: 'explain oxidation and reduction reactions',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.6',
    strand: 'Chemistry',
    description: 'understand effects of oxidation in everyday life: corrosion, rancidity',
  },

  // CHEMISTRY - ACIDS, BASES AND SALTS
  {
    notation: 'IN.CBSE.C10.SC.CHM.7',
    strand: 'Chemistry',
    description: 'understand chemical properties of acids and bases',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.8',
    strand: 'Chemistry',
    description: 'explain reactions of acids and bases with metals',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.9',
    strand: 'Chemistry',
    description: 'understand neutralization reaction',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.10',
    strand: 'Chemistry',
    description: 'understand pH scale and its importance',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.11',
    strand: 'Chemistry',
    description: 'explain preparation of common salts',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.12',
    strand: 'Chemistry',
    description: 'understand water of crystallization',
  },

  // CHEMISTRY - METALS AND NON-METALS
  {
    notation: 'IN.CBSE.C10.SC.CHM.13',
    strand: 'Chemistry',
    description: 'compare physical properties of metals and non-metals',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.14',
    strand: 'Chemistry',
    description: 'compare chemical properties of metals and non-metals',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.15',
    strand: 'Chemistry',
    description: 'understand reactivity series of metals',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.16',
    strand: 'Chemistry',
    description: 'explain ionic bond formation',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.17',
    strand: 'Chemistry',
    description: 'understand extraction of metals from ores',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.18',
    strand: 'Chemistry',
    description: 'explain corrosion and its prevention',
  },

  // CHEMISTRY - CARBON AND ITS COMPOUNDS
  {
    notation: 'IN.CBSE.C10.SC.CHM.19',
    strand: 'Chemistry',
    description: 'understand covalent bonding in carbon compounds',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.20',
    strand: 'Chemistry',
    description: 'understand versatile nature of carbon',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.21',
    strand: 'Chemistry',
    description: 'classify hydrocarbons: alkanes, alkenes, alkynes',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.22',
    strand: 'Chemistry',
    description: 'understand homologous series',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.23',
    strand: 'Chemistry',
    description: 'understand IUPAC nomenclature of carbon compounds',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.24',
    strand: 'Chemistry',
    description: 'identify functional groups: alcohol, aldehyde, ketone, carboxylic acid',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.25',
    strand: 'Chemistry',
    description: 'explain chemical properties of carbon compounds',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.26',
    strand: 'Chemistry',
    description: 'understand properties of ethanol and ethanoic acid',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.27',
    strand: 'Chemistry',
    description: 'explain saponification and cleansing action of soaps',
  },

  // CHEMISTRY - PERIODIC CLASSIFICATION
  {
    notation: 'IN.CBSE.C10.SC.CHM.28',
    strand: 'Chemistry',
    description: 'understand early attempts at classification of elements',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.29',
    strand: 'Chemistry',
    description: 'understand Mendeleev\'s periodic table',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.30',
    strand: 'Chemistry',
    description: 'understand modern periodic table and periodic law',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.31',
    strand: 'Chemistry',
    description: 'explain trends in periodic properties: atomic size, valency',
  },
  {
    notation: 'IN.CBSE.C10.SC.CHM.32',
    strand: 'Chemistry',
    description: 'understand metallic and non-metallic character trends',
  },

  // PHYSICS - LIGHT - REFLECTION AND REFRACTION
  {
    notation: 'IN.CBSE.C10.SC.PHY.1',
    strand: 'Physics',
    description: 'understand reflection of light and laws of reflection',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.2',
    strand: 'Physics',
    description: 'understand image formation by plane mirrors',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.3',
    strand: 'Physics',
    description: 'understand spherical mirrors: concave and convex',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.4',
    strand: 'Physics',
    description: 'draw ray diagrams for image formation by mirrors',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.5',
    strand: 'Physics',
    description: 'apply mirror formula and magnification',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.6',
    strand: 'Physics',
    description: 'understand refraction of light and laws of refraction',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.7',
    strand: 'Physics',
    description: 'understand refraction through glass slab',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.8',
    strand: 'Physics',
    description: 'understand spherical lenses: convex and concave',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.9',
    strand: 'Physics',
    description: 'draw ray diagrams for image formation by lenses',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.10',
    strand: 'Physics',
    description: 'apply lens formula and magnification',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.11',
    strand: 'Physics',
    description: 'calculate power of a lens',
  },

  // PHYSICS - HUMAN EYE AND COLOURFUL WORLD
  {
    notation: 'IN.CBSE.C10.SC.PHY.12',
    strand: 'Physics',
    description: 'understand structure and working of human eye',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.13',
    strand: 'Physics',
    description: 'understand defects of vision: myopia, hypermetropia, presbyopia',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.14',
    strand: 'Physics',
    description: 'explain correction of vision defects using lenses',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.15',
    strand: 'Physics',
    description: 'understand refraction through prism and dispersion',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.16',
    strand: 'Physics',
    description: 'explain formation of rainbow',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.17',
    strand: 'Physics',
    description: 'explain atmospheric refraction and scattering of light',
  },

  // PHYSICS - ELECTRICITY
  {
    notation: 'IN.CBSE.C10.SC.PHY.18',
    strand: 'Physics',
    description: 'understand electric current and circuit',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.19',
    strand: 'Physics',
    description: 'understand electric potential and potential difference',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.20',
    strand: 'Physics',
    description: 'state and apply Ohm\'s law',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.21',
    strand: 'Physics',
    description: 'understand factors affecting resistance',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.22',
    strand: 'Physics',
    description: 'calculate resistance in series and parallel circuits',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.23',
    strand: 'Physics',
    description: 'understand heating effect of electric current',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.24',
    strand: 'Physics',
    description: 'calculate electric power and energy',
  },

  // PHYSICS - MAGNETIC EFFECTS OF CURRENT
  {
    notation: 'IN.CBSE.C10.SC.PHY.25',
    strand: 'Physics',
    description: 'understand magnetic field and field lines',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.26',
    strand: 'Physics',
    description: 'understand magnetic field due to current-carrying conductor',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.27',
    strand: 'Physics',
    description: 'apply right-hand thumb rule',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.28',
    strand: 'Physics',
    description: 'understand force on current-carrying conductor in magnetic field',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.29',
    strand: 'Physics',
    description: 'explain working of electric motor',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.30',
    strand: 'Physics',
    description: 'understand electromagnetic induction',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.31',
    strand: 'Physics',
    description: 'explain working of electric generator',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.32',
    strand: 'Physics',
    description: 'understand domestic electric circuits and safety measures',
  },

  // PHYSICS - SOURCES OF ENERGY
  {
    notation: 'IN.CBSE.C10.SC.PHY.33',
    strand: 'Physics',
    description: 'classify energy sources: conventional and non-conventional',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.34',
    strand: 'Physics',
    description: 'understand fossil fuels and thermal power plants',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.35',
    strand: 'Physics',
    description: 'understand hydro power plants',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.36',
    strand: 'Physics',
    description: 'understand solar energy devices: solar cells, solar cooker',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.37',
    strand: 'Physics',
    description: 'understand wind energy and biogas',
  },
  {
    notation: 'IN.CBSE.C10.SC.PHY.38',
    strand: 'Physics',
    description: 'understand nuclear energy: fission and fusion',
  },

  // BIOLOGY - LIFE PROCESSES
  {
    notation: 'IN.CBSE.C10.SC.BIO.1',
    strand: 'Biology',
    description: 'understand nutrition in plants: autotrophic nutrition',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.2',
    strand: 'Biology',
    description: 'explain photosynthesis and its mechanism',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.3',
    strand: 'Biology',
    description: 'understand nutrition in animals: heterotrophic nutrition',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.4',
    strand: 'Biology',
    description: 'explain human digestive system and digestion process',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.5',
    strand: 'Biology',
    description: 'understand respiration: aerobic and anaerobic',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.6',
    strand: 'Biology',
    description: 'explain human respiratory system',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.7',
    strand: 'Biology',
    description: 'understand transportation in plants: xylem and phloem',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.8',
    strand: 'Biology',
    description: 'explain human circulatory system: heart and blood vessels',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.9',
    strand: 'Biology',
    description: 'understand blood and its components',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.10',
    strand: 'Biology',
    description: 'explain excretion in humans: urinary system',
  },

  // BIOLOGY - CONTROL AND COORDINATION
  {
    notation: 'IN.CBSE.C10.SC.BIO.11',
    strand: 'Biology',
    description: 'understand nervous system in animals',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.12',
    strand: 'Biology',
    description: 'explain structure and function of neuron',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.13',
    strand: 'Biology',
    description: 'understand reflex action and reflex arc',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.14',
    strand: 'Biology',
    description: 'explain human brain structure and functions',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.15',
    strand: 'Biology',
    description: 'understand coordination in plants: tropic movements',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.16',
    strand: 'Biology',
    description: 'understand hormones in animals and endocrine glands',
  },

  // BIOLOGY - HOW DO ORGANISMS REPRODUCE
  {
    notation: 'IN.CBSE.C10.SC.BIO.17',
    strand: 'Biology',
    description: 'understand modes of asexual reproduction',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.18',
    strand: 'Biology',
    description: 'understand sexual reproduction in flowering plants',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.19',
    strand: 'Biology',
    description: 'explain pollination and fertilization in plants',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.20',
    strand: 'Biology',
    description: 'understand human reproductive system',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.21',
    strand: 'Biology',
    description: 'explain fertilization, pregnancy, and birth',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.22',
    strand: 'Biology',
    description: 'understand reproductive health and contraception',
  },

  // BIOLOGY - HEREDITY AND EVOLUTION
  {
    notation: 'IN.CBSE.C10.SC.BIO.23',
    strand: 'Biology',
    description: 'understand accumulation of variation during reproduction',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.24',
    strand: 'Biology',
    description: 'understand Mendel\'s laws of inheritance',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.25',
    strand: 'Biology',
    description: 'explain sex determination in humans',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.26',
    strand: 'Biology',
    description: 'understand acquired and inherited traits',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.27',
    strand: 'Biology',
    description: 'explain speciation and evolution',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.28',
    strand: 'Biology',
    description: 'understand evidence of evolution: homologous and analogous organs',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.29',
    strand: 'Biology',
    description: 'explain human evolution',
  },

  // BIOLOGY - OUR ENVIRONMENT
  {
    notation: 'IN.CBSE.C10.SC.BIO.30',
    strand: 'Biology',
    description: 'understand ecosystem and its components',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.31',
    strand: 'Biology',
    description: 'explain food chains and food webs',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.32',
    strand: 'Biology',
    description: 'understand trophic levels and energy flow',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.33',
    strand: 'Biology',
    description: 'understand biological magnification',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.34',
    strand: 'Biology',
    description: 'explain ozone layer and its depletion',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.35',
    strand: 'Biology',
    description: 'understand waste management and biodegradable substances',
  },

  // BIOLOGY - MANAGEMENT OF NATURAL RESOURCES
  {
    notation: 'IN.CBSE.C10.SC.BIO.36',
    strand: 'Biology',
    description: 'understand sustainable management of natural resources',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.37',
    strand: 'Biology',
    description: 'explain forest management and stakeholder involvement',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.38',
    strand: 'Biology',
    description: 'understand water harvesting and watershed management',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.39',
    strand: 'Biology',
    description: 'understand coal and petroleum conservation',
  },
  {
    notation: 'IN.CBSE.C10.SC.BIO.40',
    strand: 'Biology',
    description: 'explain 3Rs: Reduce, Reuse, Recycle',
  }
];

// =============================================================================
// CLASS 11 (Ages 16-17)
// NCERT: Physics, Chemistry, Biology Textbooks for Class XI
// Senior Secondary Education - Science Stream
// =============================================================================

const class11Standards: CBSEScienceStandard[] = [
  // PHYSICS - UNITS AND MEASUREMENT
  {
    notation: 'IN.CBSE.C11.PH.MCH.1',
    strand: 'Physics - Mechanics',
    description: 'understand SI units and derived units',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.2',
    strand: 'Physics - Mechanics',
    description: 'apply dimensional analysis',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.3',
    strand: 'Physics - Mechanics',
    description: 'understand significant figures and errors in measurement',
  },

  // PHYSICS - MOTION IN A STRAIGHT LINE
  {
    notation: 'IN.CBSE.C11.PH.MCH.4',
    strand: 'Physics - Mechanics',
    description: 'understand position, displacement, and distance',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.5',
    strand: 'Physics - Mechanics',
    description: 'differentiate between average and instantaneous velocity',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.6',
    strand: 'Physics - Mechanics',
    description: 'apply kinematic equations for uniformly accelerated motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.7',
    strand: 'Physics - Mechanics',
    description: 'understand motion under gravity: free fall',
  },

  // PHYSICS - MOTION IN A PLANE
  {
    notation: 'IN.CBSE.C11.PH.MCH.8',
    strand: 'Physics - Mechanics',
    description: 'represent vectors and perform vector operations',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.9',
    strand: 'Physics - Mechanics',
    description: 'resolve vectors into components',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.10',
    strand: 'Physics - Mechanics',
    description: 'analyze projectile motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.11',
    strand: 'Physics - Mechanics',
    description: 'understand uniform circular motion and centripetal acceleration',
  },

  // PHYSICS - LAWS OF MOTION
  {
    notation: 'IN.CBSE.C11.PH.MCH.12',
    strand: 'Physics - Mechanics',
    description: 'state and apply Newton\'s laws of motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.13',
    strand: 'Physics - Mechanics',
    description: 'understand momentum and impulse',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.14',
    strand: 'Physics - Mechanics',
    description: 'apply law of conservation of momentum',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.15',
    strand: 'Physics - Mechanics',
    description: 'analyze equilibrium of forces',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.16',
    strand: 'Physics - Mechanics',
    description: 'understand friction: static and kinetic',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.17',
    strand: 'Physics - Mechanics',
    description: 'understand circular motion dynamics',
  },

  // PHYSICS - WORK, ENERGY AND POWER
  {
    notation: 'IN.CBSE.C11.PH.MCH.18',
    strand: 'Physics - Mechanics',
    description: 'calculate work done by constant and variable forces',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.19',
    strand: 'Physics - Mechanics',
    description: 'understand kinetic energy and work-energy theorem',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.20',
    strand: 'Physics - Mechanics',
    description: 'understand potential energy and mechanical energy conservation',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.21',
    strand: 'Physics - Mechanics',
    description: 'differentiate between conservative and non-conservative forces',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.22',
    strand: 'Physics - Mechanics',
    description: 'analyze collisions: elastic and inelastic',
  },

  // PHYSICS - SYSTEM OF PARTICLES AND ROTATIONAL MOTION
  {
    notation: 'IN.CBSE.C11.PH.MCH.23',
    strand: 'Physics - Mechanics',
    description: 'understand center of mass of a system',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.24',
    strand: 'Physics - Mechanics',
    description: 'understand torque and angular momentum',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.25',
    strand: 'Physics - Mechanics',
    description: 'apply conservation of angular momentum',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.26',
    strand: 'Physics - Mechanics',
    description: 'understand moment of inertia',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.27',
    strand: 'Physics - Mechanics',
    description: 'analyze rolling motion',
  },

  // PHYSICS - GRAVITATION
  {
    notation: 'IN.CBSE.C11.PH.MCH.28',
    strand: 'Physics - Mechanics',
    description: 'understand Kepler\'s laws of planetary motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.29',
    strand: 'Physics - Mechanics',
    description: 'apply Newton\'s law of universal gravitation',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.30',
    strand: 'Physics - Mechanics',
    description: 'understand gravitational potential energy and escape velocity',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.31',
    strand: 'Physics - Mechanics',
    description: 'understand orbital motion of satellites',
  },

  // PHYSICS - MECHANICAL PROPERTIES OF SOLIDS
  {
    notation: 'IN.CBSE.C11.PH.MCH.32',
    strand: 'Physics - Mechanics',
    description: 'understand stress, strain, and elastic moduli',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.33',
    strand: 'Physics - Mechanics',
    description: 'apply Hooke\'s law and understand elastic behavior',
  },

  // PHYSICS - MECHANICAL PROPERTIES OF FLUIDS
  {
    notation: 'IN.CBSE.C11.PH.MCH.34',
    strand: 'Physics - Mechanics',
    description: 'understand pressure in fluids and Pascal\'s law',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.35',
    strand: 'Physics - Mechanics',
    description: 'understand buoyancy and Archimedes\' principle',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.36',
    strand: 'Physics - Mechanics',
    description: 'apply Bernoulli\'s principle',
  },
  {
    notation: 'IN.CBSE.C11.PH.MCH.37',
    strand: 'Physics - Mechanics',
    description: 'understand viscosity and surface tension',
  },

  // PHYSICS - THERMODYNAMICS
  {
    notation: 'IN.CBSE.C11.PH.THR.1',
    strand: 'Physics - Thermodynamics',
    description: 'understand thermal equilibrium and zeroth law',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.2',
    strand: 'Physics - Thermodynamics',
    description: 'understand heat, work, and internal energy',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.3',
    strand: 'Physics - Thermodynamics',
    description: 'apply first law of thermodynamics',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.4',
    strand: 'Physics - Thermodynamics',
    description: 'analyze thermodynamic processes: isothermal, adiabatic, isobaric',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.5',
    strand: 'Physics - Thermodynamics',
    description: 'understand second law of thermodynamics and heat engines',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.6',
    strand: 'Physics - Thermodynamics',
    description: 'understand refrigerators and heat pumps',
  },

  // PHYSICS - KINETIC THEORY
  {
    notation: 'IN.CBSE.C11.PH.THR.7',
    strand: 'Physics - Thermodynamics',
    description: 'understand kinetic theory assumptions and ideal gas equation',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.8',
    strand: 'Physics - Thermodynamics',
    description: 'relate pressure and temperature to molecular motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.9',
    strand: 'Physics - Thermodynamics',
    description: 'understand specific heat capacity and degrees of freedom',
  },
  {
    notation: 'IN.CBSE.C11.PH.THR.10',
    strand: 'Physics - Thermodynamics',
    description: 'understand mean free path',
  },

  // PHYSICS - OSCILLATIONS AND WAVES
  {
    notation: 'IN.CBSE.C11.PH.WAV.1',
    strand: 'Physics - Waves',
    description: 'understand periodic and oscillatory motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.2',
    strand: 'Physics - Waves',
    description: 'analyze simple harmonic motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.3',
    strand: 'Physics - Waves',
    description: 'understand energy in simple harmonic motion',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.4',
    strand: 'Physics - Waves',
    description: 'understand simple pendulum and spring oscillator',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.5',
    strand: 'Physics - Waves',
    description: 'understand transverse and longitudinal waves',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.6',
    strand: 'Physics - Waves',
    description: 'analyze wave motion: displacement, amplitude, frequency',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.7',
    strand: 'Physics - Waves',
    description: 'understand principle of superposition and interference',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.8',
    strand: 'Physics - Waves',
    description: 'understand standing waves and resonance',
  },
  {
    notation: 'IN.CBSE.C11.PH.WAV.9',
    strand: 'Physics - Waves',
    description: 'understand Doppler effect',
  },

  // CHEMISTRY - STRUCTURE OF ATOM
  {
    notation: 'IN.CBSE.C11.CH.PHC.1',
    strand: 'Chemistry - Physical',
    description: 'understand atomic models: Thomson, Rutherford, Bohr',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.2',
    strand: 'Chemistry - Physical',
    description: 'understand quantum mechanical model of atom',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.3',
    strand: 'Chemistry - Physical',
    description: 'apply quantum numbers to describe orbitals',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.4',
    strand: 'Chemistry - Physical',
    description: 'write electronic configuration using aufbau principle',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.5',
    strand: 'Chemistry - Physical',
    description: 'understand de Broglie wavelength and Heisenberg principle',
  },

  // CHEMISTRY - CLASSIFICATION OF ELEMENTS
  {
    notation: 'IN.CBSE.C11.CH.INC.1',
    strand: 'Chemistry - Inorganic',
    description: 'understand modern periodic table structure',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.2',
    strand: 'Chemistry - Inorganic',
    description: 'explain periodic trends: atomic radius, ionization energy',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.3',
    strand: 'Chemistry - Inorganic',
    description: 'explain periodic trends: electronegativity, electron affinity',
  },

  // CHEMISTRY - CHEMICAL BONDING
  {
    notation: 'IN.CBSE.C11.CH.PHC.6',
    strand: 'Chemistry - Physical',
    description: 'understand ionic and covalent bonding',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.7',
    strand: 'Chemistry - Physical',
    description: 'draw Lewis structures and apply VSEPR theory',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.8',
    strand: 'Chemistry - Physical',
    description: 'understand hybridization: sp, sp², sp³',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.9',
    strand: 'Chemistry - Physical',
    description: 'understand molecular orbital theory',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.10',
    strand: 'Chemistry - Physical',
    description: 'understand hydrogen bonding and van der Waals forces',
  },

  // CHEMISTRY - STATES OF MATTER
  {
    notation: 'IN.CBSE.C11.CH.PHC.11',
    strand: 'Chemistry - Physical',
    description: 'apply gas laws: Boyle\'s, Charles\'s, Avogadro\'s',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.12',
    strand: 'Chemistry - Physical',
    description: 'understand ideal gas equation and Dalton\'s law',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.13',
    strand: 'Chemistry - Physical',
    description: 'understand kinetic molecular theory of gases',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.14',
    strand: 'Chemistry - Physical',
    description: 'understand liquids: vapor pressure and viscosity',
  },

  // CHEMISTRY - THERMODYNAMICS
  {
    notation: 'IN.CBSE.C11.CH.PHC.15',
    strand: 'Chemistry - Physical',
    description: 'understand thermodynamic terms: system, surroundings, state functions',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.16',
    strand: 'Chemistry - Physical',
    description: 'apply first law of thermodynamics and internal energy',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.17',
    strand: 'Chemistry - Physical',
    description: 'apply Hess\'s law and calculate enthalpy changes',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.18',
    strand: 'Chemistry - Physical',
    description: 'understand entropy and second law of thermodynamics',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.19',
    strand: 'Chemistry - Physical',
    description: 'calculate Gibbs free energy and predict spontaneity',
  },

  // CHEMISTRY - EQUILIBRIUM
  {
    notation: 'IN.CBSE.C11.CH.PHC.20',
    strand: 'Chemistry - Physical',
    description: 'understand chemical equilibrium and equilibrium constant',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.21',
    strand: 'Chemistry - Physical',
    description: 'apply Le Chatelier\'s principle',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.22',
    strand: 'Chemistry - Physical',
    description: 'understand ionic equilibrium in aqueous solutions',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.23',
    strand: 'Chemistry - Physical',
    description: 'calculate pH of acids and bases',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.24',
    strand: 'Chemistry - Physical',
    description: 'understand buffer solutions and common ion effect',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.25',
    strand: 'Chemistry - Physical',
    description: 'understand solubility product and precipitation',
  },

  // CHEMISTRY - REDOX REACTIONS
  {
    notation: 'IN.CBSE.C11.CH.PHC.26',
    strand: 'Chemistry - Physical',
    description: 'understand oxidation number and redox reactions',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.27',
    strand: 'Chemistry - Physical',
    description: 'balance redox equations using oxidation number method',
  },
  {
    notation: 'IN.CBSE.C11.CH.PHC.28',
    strand: 'Chemistry - Physical',
    description: 'balance redox equations using half-reaction method',
  },

  // CHEMISTRY - HYDROGEN AND S-BLOCK ELEMENTS
  {
    notation: 'IN.CBSE.C11.CH.INC.4',
    strand: 'Chemistry - Inorganic',
    description: 'understand position of hydrogen and its isotopes',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.5',
    strand: 'Chemistry - Inorganic',
    description: 'understand preparation and properties of hydrogen',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.6',
    strand: 'Chemistry - Inorganic',
    description: 'understand alkali metals: properties and compounds',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.7',
    strand: 'Chemistry - Inorganic',
    description: 'understand alkaline earth metals: properties and compounds',
  },

  // CHEMISTRY - P-BLOCK ELEMENTS (GROUP 13 AND 14)
  {
    notation: 'IN.CBSE.C11.CH.INC.8',
    strand: 'Chemistry - Inorganic',
    description: 'understand general properties of group 13 elements',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.9',
    strand: 'Chemistry - Inorganic',
    description: 'understand boron and its compounds',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.10',
    strand: 'Chemistry - Inorganic',
    description: 'understand general properties of group 14 elements',
  },
  {
    notation: 'IN.CBSE.C11.CH.INC.11',
    strand: 'Chemistry - Inorganic',
    description: 'understand carbon and silicon: allotropes and compounds',
  },

  // CHEMISTRY - ORGANIC CHEMISTRY BASICS
  {
    notation: 'IN.CBSE.C11.CH.ORC.1',
    strand: 'Chemistry - Organic',
    description: 'understand classification of organic compounds',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.2',
    strand: 'Chemistry - Organic',
    description: 'apply IUPAC nomenclature to organic compounds',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.3',
    strand: 'Chemistry - Organic',
    description: 'understand isomerism: structural and stereoisomerism',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.4',
    strand: 'Chemistry - Organic',
    description: 'understand reaction intermediates: carbocations, carbanions, free radicals',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.5',
    strand: 'Chemistry - Organic',
    description: 'understand inductive and resonance effects',
  },

  // CHEMISTRY - HYDROCARBONS
  {
    notation: 'IN.CBSE.C11.CH.ORC.6',
    strand: 'Chemistry - Organic',
    description: 'understand alkanes: preparation and reactions',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.7',
    strand: 'Chemistry - Organic',
    description: 'understand alkenes: preparation and reactions',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.8',
    strand: 'Chemistry - Organic',
    description: 'understand alkynes: preparation and reactions',
  },
  {
    notation: 'IN.CBSE.C11.CH.ORC.9',
    strand: 'Chemistry - Organic',
    description: 'understand aromatic hydrocarbons: benzene structure and reactions',
  },

  // CHEMISTRY - ENVIRONMENTAL CHEMISTRY
  {
    notation: 'IN.CBSE.C11.CH.ENV.1',
    strand: 'Chemistry - Environmental',
    description: 'understand environmental pollution: air, water, soil',
  },
  {
    notation: 'IN.CBSE.C11.CH.ENV.2',
    strand: 'Chemistry - Environmental',
    description: 'understand greenhouse effect and global warming',
  },
  {
    notation: 'IN.CBSE.C11.CH.ENV.3',
    strand: 'Chemistry - Environmental',
    description: 'understand ozone layer depletion',
  },
  {
    notation: 'IN.CBSE.C11.CH.ENV.4',
    strand: 'Chemistry - Environmental',
    description: 'understand strategies for pollution control',
  },

  // BIOLOGY - DIVERSITY OF LIFE
  {
    notation: 'IN.CBSE.C11.BI.BOT.1',
    strand: 'Biology - Botany',
    description: 'understand need for classification and taxonomic categories',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.2',
    strand: 'Biology - Botany',
    description: 'understand botanical nomenclature and species concept',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.1',
    strand: 'Biology - Zoology',
    description: 'understand kingdom Monera: bacteria and cyanobacteria',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.2',
    strand: 'Biology - Zoology',
    description: 'understand kingdom Protista: protozoans and algae',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.3',
    strand: 'Biology - Zoology',
    description: 'understand kingdom Fungi: structure and reproduction',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.3',
    strand: 'Biology - Botany',
    description: 'understand kingdom Plantae: divisions and characteristics',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.4',
    strand: 'Biology - Zoology',
    description: 'understand kingdom Animalia: phyla and characteristics',
  },

  // BIOLOGY - PLANT MORPHOLOGY AND ANATOMY
  {
    notation: 'IN.CBSE.C11.BI.BOT.4',
    strand: 'Biology - Botany',
    description: 'understand morphology of root, stem, and leaf',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.5',
    strand: 'Biology - Botany',
    description: 'understand flower structure and types of inflorescence',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.6',
    strand: 'Biology - Botany',
    description: 'understand fruit and seed structure',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.7',
    strand: 'Biology - Botany',
    description: 'understand anatomy of dicot and monocot plants',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.8',
    strand: 'Biology - Botany',
    description: 'understand secondary growth in plants',
  },

  // BIOLOGY - ANIMAL STRUCTURE
  {
    notation: 'IN.CBSE.C11.BI.ZOO.5',
    strand: 'Biology - Zoology',
    description: 'understand animal tissues: epithelial, connective, muscle, neural',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.6',
    strand: 'Biology - Zoology',
    description: 'understand cockroach morphology and anatomy',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.7',
    strand: 'Biology - Zoology',
    description: 'understand frog morphology and anatomy',
  },

  // BIOLOGY - CELL STRUCTURE AND FUNCTION
  {
    notation: 'IN.CBSE.C11.BI.GEN.1',
    strand: 'Biology - Genetics',
    description: 'understand cell theory and cell as unit of life',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.2',
    strand: 'Biology - Genetics',
    description: 'understand ultrastructure of prokaryotic and eukaryotic cells',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.3',
    strand: 'Biology - Genetics',
    description: 'understand structure and function of cell organelles',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.4',
    strand: 'Biology - Genetics',
    description: 'understand cell membrane: structure and functions',
  },

  // BIOLOGY - BIOMOLECULES
  {
    notation: 'IN.CBSE.C11.BI.GEN.5',
    strand: 'Biology - Genetics',
    description: 'understand carbohydrates: structure and function',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.6',
    strand: 'Biology - Genetics',
    description: 'understand proteins: structure and function',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.7',
    strand: 'Biology - Genetics',
    description: 'understand lipids: structure and function',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.8',
    strand: 'Biology - Genetics',
    description: 'understand nucleic acids: DNA and RNA structure',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.9',
    strand: 'Biology - Genetics',
    description: 'understand enzymes: properties and mechanism of action',
  },

  // BIOLOGY - CELL CYCLE AND DIVISION
  {
    notation: 'IN.CBSE.C11.BI.GEN.10',
    strand: 'Biology - Genetics',
    description: 'understand cell cycle phases',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.11',
    strand: 'Biology - Genetics',
    description: 'understand mitosis: stages and significance',
  },
  {
    notation: 'IN.CBSE.C11.BI.GEN.12',
    strand: 'Biology - Genetics',
    description: 'understand meiosis: stages and significance',
  },

  // BIOLOGY - PLANT PHYSIOLOGY
  {
    notation: 'IN.CBSE.C11.BI.BOT.9',
    strand: 'Biology - Botany',
    description: 'understand transport in plants: absorption and movement of water',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.10',
    strand: 'Biology - Botany',
    description: 'understand transpiration and stomatal mechanism',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.11',
    strand: 'Biology - Botany',
    description: 'understand mineral nutrition and essential elements',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.12',
    strand: 'Biology - Botany',
    description: 'understand photosynthesis: light and dark reactions',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.13',
    strand: 'Biology - Botany',
    description: 'understand C3 and C4 pathways',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.14',
    strand: 'Biology - Botany',
    description: 'understand respiration: glycolysis, Krebs cycle, ETC',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.15',
    strand: 'Biology - Botany',
    description: 'understand plant growth and development',
  },
  {
    notation: 'IN.CBSE.C11.BI.BOT.16',
    strand: 'Biology - Botany',
    description: 'understand plant hormones and photoperiodism',
  },

  // BIOLOGY - ANIMAL PHYSIOLOGY
  {
    notation: 'IN.CBSE.C11.BI.ZOO.8',
    strand: 'Biology - Zoology',
    description: 'understand digestion and absorption in humans',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.9',
    strand: 'Biology - Zoology',
    description: 'understand breathing and exchange of gases',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.10',
    strand: 'Biology - Zoology',
    description: 'understand body fluids and circulation',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.11',
    strand: 'Biology - Zoology',
    description: 'understand excretory products and elimination',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.12',
    strand: 'Biology - Zoology',
    description: 'understand locomotion and movement',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.13',
    strand: 'Biology - Zoology',
    description: 'understand neural control and coordination',
  },
  {
    notation: 'IN.CBSE.C11.BI.ZOO.14',
    strand: 'Biology - Zoology',
    description: 'understand chemical coordination: endocrine system',
  }
];

// =============================================================================
// CLASS 12 (Ages 17-18)
// NCERT: Physics, Chemistry, Biology Textbooks for Class XII
// Senior Secondary Education - Board Examination Year
// =============================================================================

const class12Standards: CBSEScienceStandard[] = [
  // PHYSICS - ELECTROSTATICS
  {
    notation: 'IN.CBSE.C12.PH.ELC.1',
    strand: 'Physics - Electricity',
    description: 'understand Coulomb\'s law and electric field',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.2',
    strand: 'Physics - Electricity',
    description: 'calculate electric potential and potential energy',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.3',
    strand: 'Physics - Electricity',
    description: 'understand capacitors and capacitance',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.4',
    strand: 'Physics - Electricity',
    description: 'apply Gauss\'s law',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.5',
    strand: 'Physics - Electricity',
    description: 'understand electric dipole and its field',
  },

  // PHYSICS - CURRENT ELECTRICITY
  {
    notation: 'IN.CBSE.C12.PH.ELC.6',
    strand: 'Physics - Electricity',
    description: 'understand electric current and Ohm\'s law',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.7',
    strand: 'Physics - Electricity',
    description: 'understand resistivity and conductivity',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.8',
    strand: 'Physics - Electricity',
    description: 'analyze series and parallel combinations of resistors',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.9',
    strand: 'Physics - Electricity',
    description: 'apply Kirchhoff\'s laws',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.10',
    strand: 'Physics - Electricity',
    description: 'understand Wheatstone bridge and potentiometer',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.11',
    strand: 'Physics - Electricity',
    description: 'understand EMF and internal resistance of cells',
  },

  // PHYSICS - MAGNETIC EFFECTS OF CURRENT
  {
    notation: 'IN.CBSE.C12.PH.ELC.12',
    strand: 'Physics - Electricity',
    description: 'understand Biot-Savart law',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.13',
    strand: 'Physics - Electricity',
    description: 'apply Ampere\'s circuital law',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.14',
    strand: 'Physics - Electricity',
    description: 'understand force on a current-carrying conductor in magnetic field',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.15',
    strand: 'Physics - Electricity',
    description: 'understand force between two parallel current-carrying conductors',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.16',
    strand: 'Physics - Electricity',
    description: 'understand torque on a current loop and magnetic dipole',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.17',
    strand: 'Physics - Electricity',
    description: 'understand moving coil galvanometer',
  },

  // PHYSICS - MAGNETISM AND MATTER
  {
    notation: 'IN.CBSE.C12.PH.ELC.18',
    strand: 'Physics - Electricity',
    description: 'understand magnetic properties of materials',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.19',
    strand: 'Physics - Electricity',
    description: 'classify materials: diamagnetic, paramagnetic, ferromagnetic',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.20',
    strand: 'Physics - Electricity',
    description: 'understand hysteresis and its applications',
  },

  // PHYSICS - ELECTROMAGNETIC INDUCTION
  {
    notation: 'IN.CBSE.C12.PH.ELC.21',
    strand: 'Physics - Electricity',
    description: 'understand Faraday\'s laws of electromagnetic induction',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.22',
    strand: 'Physics - Electricity',
    description: 'apply Lenz\'s law',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.23',
    strand: 'Physics - Electricity',
    description: 'understand motional EMF',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.24',
    strand: 'Physics - Electricity',
    description: 'understand self and mutual inductance',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.25',
    strand: 'Physics - Electricity',
    description: 'understand AC generator',
  },

  // PHYSICS - ALTERNATING CURRENT
  {
    notation: 'IN.CBSE.C12.PH.ELC.26',
    strand: 'Physics - Electricity',
    description: 'understand AC voltage and current',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.27',
    strand: 'Physics - Electricity',
    description: 'understand impedance in LCR circuits',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.28',
    strand: 'Physics - Electricity',
    description: 'understand resonance in AC circuits',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.29',
    strand: 'Physics - Electricity',
    description: 'calculate power in AC circuits',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.30',
    strand: 'Physics - Electricity',
    description: 'understand transformers',
  },

  // PHYSICS - ELECTROMAGNETIC WAVES
  {
    notation: 'IN.CBSE.C12.PH.ELC.31',
    strand: 'Physics - Electricity',
    description: 'understand electromagnetic waves and their properties',
  },
  {
    notation: 'IN.CBSE.C12.PH.ELC.32',
    strand: 'Physics - Electricity',
    description: 'understand electromagnetic spectrum and applications',
  },

  // PHYSICS - RAY OPTICS
  {
    notation: 'IN.CBSE.C12.PH.OPT.1',
    strand: 'Physics - Optics',
    description: 'understand reflection and refraction of light',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.2',
    strand: 'Physics - Optics',
    description: 'understand total internal reflection and optical fibers',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.3',
    strand: 'Physics - Optics',
    description: 'understand spherical mirrors: curved surfaces',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.4',
    strand: 'Physics - Optics',
    description: 'understand refraction through prism and dispersion',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.5',
    strand: 'Physics - Optics',
    description: 'understand lenses and lens formula',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.6',
    strand: 'Physics - Optics',
    description: 'understand optical instruments: microscope, telescope',
  },

  // PHYSICS - WAVE OPTICS
  {
    notation: 'IN.CBSE.C12.PH.OPT.7',
    strand: 'Physics - Optics',
    description: 'understand Huygens\' principle',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.8',
    strand: 'Physics - Optics',
    description: 'understand interference of light: Young\'s double slit',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.9',
    strand: 'Physics - Optics',
    description: 'understand diffraction of light',
  },
  {
    notation: 'IN.CBSE.C12.PH.OPT.10',
    strand: 'Physics - Optics',
    description: 'understand polarization of light',
  },

  // PHYSICS - DUAL NATURE OF RADIATION AND MATTER
  {
    notation: 'IN.CBSE.C12.PH.MDP.1',
    strand: 'Physics - Modern',
    description: 'understand photoelectric effect',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.2',
    strand: 'Physics - Modern',
    description: 'understand Einstein\'s photoelectric equation',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.3',
    strand: 'Physics - Modern',
    description: 'understand wave nature of matter: de Broglie hypothesis',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.4',
    strand: 'Physics - Modern',
    description: 'understand Davisson-Germer experiment',
  },

  // PHYSICS - ATOMS
  {
    notation: 'IN.CBSE.C12.PH.MDP.5',
    strand: 'Physics - Modern',
    description: 'understand Rutherford\'s alpha particle scattering',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.6',
    strand: 'Physics - Modern',
    description: 'understand Bohr\'s model of hydrogen atom',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.7',
    strand: 'Physics - Modern',
    description: 'explain atomic spectra: hydrogen spectrum',
  },

  // PHYSICS - NUCLEI
  {
    notation: 'IN.CBSE.C12.PH.MDP.8',
    strand: 'Physics - Modern',
    description: 'understand nuclear size, mass, and binding energy',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.9',
    strand: 'Physics - Modern',
    description: 'understand radioactivity and decay law',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.10',
    strand: 'Physics - Modern',
    description: 'understand nuclear fission and fusion',
  },

  // PHYSICS - SEMICONDUCTOR ELECTRONICS
  {
    notation: 'IN.CBSE.C12.PH.MDP.11',
    strand: 'Physics - Modern',
    description: 'understand semiconductors: intrinsic and extrinsic',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.12',
    strand: 'Physics - Modern',
    description: 'understand p-n junction diode and its applications',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.13',
    strand: 'Physics - Modern',
    description: 'understand special purpose diodes: LED, photodiode, solar cell',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.14',
    strand: 'Physics - Modern',
    description: 'understand transistors and their applications',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.15',
    strand: 'Physics - Modern',
    description: 'understand logic gates and Boolean algebra',
  },

  // PHYSICS - COMMUNICATION SYSTEMS
  {
    notation: 'IN.CBSE.C12.PH.MDP.16',
    strand: 'Physics - Modern',
    description: 'understand elements of communication system',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.17',
    strand: 'Physics - Modern',
    description: 'understand modulation and its types',
  },
  {
    notation: 'IN.CBSE.C12.PH.MDP.18',
    strand: 'Physics - Modern',
    description: 'understand satellite communication',
  },

  // CHEMISTRY - SOLID STATE
  {
    notation: 'IN.CBSE.C12.CH.PHC.1',
    strand: 'Chemistry - Physical',
    description: 'understand classification of solids based on bonding',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.2',
    strand: 'Chemistry - Physical',
    description: 'understand crystal lattices and unit cells',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.3',
    strand: 'Chemistry - Physical',
    description: 'calculate packing efficiency in different structures',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.4',
    strand: 'Chemistry - Physical',
    description: 'understand imperfections in solids: point defects',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.5',
    strand: 'Chemistry - Physical',
    description: 'understand electrical and magnetic properties of solids',
  },

  // CHEMISTRY - SOLUTIONS
  {
    notation: 'IN.CBSE.C12.CH.PHC.6',
    strand: 'Chemistry - Physical',
    description: 'express concentration of solutions in various units',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.7',
    strand: 'Chemistry - Physical',
    description: 'understand solubility and Henry\'s law',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.8',
    strand: 'Chemistry - Physical',
    description: 'understand colligative properties: vapor pressure lowering',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.9',
    strand: 'Chemistry - Physical',
    description: 'understand colligative properties: boiling point elevation',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.10',
    strand: 'Chemistry - Physical',
    description: 'understand colligative properties: freezing point depression',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.11',
    strand: 'Chemistry - Physical',
    description: 'understand osmosis and osmotic pressure',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.12',
    strand: 'Chemistry - Physical',
    description: 'calculate molar mass using colligative properties',
  },

  // CHEMISTRY - ELECTROCHEMISTRY
  {
    notation: 'IN.CBSE.C12.CH.PHC.13',
    strand: 'Chemistry - Physical',
    description: 'understand electrolytic and metallic conductance',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.14',
    strand: 'Chemistry - Physical',
    description: 'understand galvanic cells and cell EMF',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.15',
    strand: 'Chemistry - Physical',
    description: 'apply Nernst equation',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.16',
    strand: 'Chemistry - Physical',
    description: 'understand electrolysis and Faraday\'s laws',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.17',
    strand: 'Chemistry - Physical',
    description: 'understand batteries and fuel cells',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.18',
    strand: 'Chemistry - Physical',
    description: 'understand corrosion and its prevention',
  },

  // CHEMISTRY - CHEMICAL KINETICS
  {
    notation: 'IN.CBSE.C12.CH.PHC.19',
    strand: 'Chemistry - Physical',
    description: 'understand rate of reaction and rate law',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.20',
    strand: 'Chemistry - Physical',
    description: 'understand order of reaction and molecularity',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.21',
    strand: 'Chemistry - Physical',
    description: 'derive and apply integrated rate equations',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.22',
    strand: 'Chemistry - Physical',
    description: 'understand effect of temperature: Arrhenius equation',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.23',
    strand: 'Chemistry - Physical',
    description: 'understand collision theory and activation energy',
  },

  // CHEMISTRY - SURFACE CHEMISTRY
  {
    notation: 'IN.CBSE.C12.CH.PHC.24',
    strand: 'Chemistry - Physical',
    description: 'understand adsorption: physisorption and chemisorption',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.25',
    strand: 'Chemistry - Physical',
    description: 'understand colloidal solutions and their properties',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.26',
    strand: 'Chemistry - Physical',
    description: 'understand catalysis: homogeneous and heterogeneous',
  },
  {
    notation: 'IN.CBSE.C12.CH.PHC.27',
    strand: 'Chemistry - Physical',
    description: 'understand emulsions and their applications',
  },

  // CHEMISTRY - P-BLOCK ELEMENTS
  {
    notation: 'IN.CBSE.C12.CH.INC.1',
    strand: 'Chemistry - Inorganic',
    description: 'understand group 15 elements: properties and compounds',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.2',
    strand: 'Chemistry - Inorganic',
    description: 'understand preparation and properties of ammonia and nitric acid',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.3',
    strand: 'Chemistry - Inorganic',
    description: 'understand group 16 elements: properties and compounds',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.4',
    strand: 'Chemistry - Inorganic',
    description: 'understand preparation of sulphuric acid: Contact process',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.5',
    strand: 'Chemistry - Inorganic',
    description: 'understand group 17 elements: halogens and their compounds',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.6',
    strand: 'Chemistry - Inorganic',
    description: 'understand group 18 elements: noble gases',
  },

  // CHEMISTRY - D AND F BLOCK ELEMENTS
  {
    notation: 'IN.CBSE.C12.CH.INC.7',
    strand: 'Chemistry - Inorganic',
    description: 'understand general properties of d-block elements',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.8',
    strand: 'Chemistry - Inorganic',
    description: 'understand important compounds of d-block elements',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.9',
    strand: 'Chemistry - Inorganic',
    description: 'understand lanthanoids and their properties',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.10',
    strand: 'Chemistry - Inorganic',
    description: 'understand actinoids and their properties',
  },

  // CHEMISTRY - COORDINATION COMPOUNDS
  {
    notation: 'IN.CBSE.C12.CH.INC.11',
    strand: 'Chemistry - Inorganic',
    description: 'understand coordination compounds: terminology',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.12',
    strand: 'Chemistry - Inorganic',
    description: 'write IUPAC nomenclature of coordination compounds',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.13',
    strand: 'Chemistry - Inorganic',
    description: 'understand isomerism in coordination compounds',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.14',
    strand: 'Chemistry - Inorganic',
    description: 'understand bonding in coordination compounds: VBT and CFT',
  },
  {
    notation: 'IN.CBSE.C12.CH.INC.15',
    strand: 'Chemistry - Inorganic',
    description: 'understand applications of coordination compounds',
  },

  // CHEMISTRY - HALOALKANES AND HALOARENES
  {
    notation: 'IN.CBSE.C12.CH.ORC.1',
    strand: 'Chemistry - Organic',
    description: 'understand classification and nomenclature of haloalkanes',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.2',
    strand: 'Chemistry - Organic',
    description: 'understand SN1 and SN2 reactions',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.3',
    strand: 'Chemistry - Organic',
    description: 'understand elimination reactions',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.4',
    strand: 'Chemistry - Organic',
    description: 'understand haloarenes: preparation and reactions',
  },

  // CHEMISTRY - ALCOHOLS, PHENOLS AND ETHERS
  {
    notation: 'IN.CBSE.C12.CH.ORC.5',
    strand: 'Chemistry - Organic',
    description: 'understand classification and nomenclature of alcohols',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.6',
    strand: 'Chemistry - Organic',
    description: 'understand preparation and reactions of alcohols',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.7',
    strand: 'Chemistry - Organic',
    description: 'understand preparation and reactions of phenols',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.8',
    strand: 'Chemistry - Organic',
    description: 'understand preparation and reactions of ethers',
  },

  // CHEMISTRY - ALDEHYDES, KETONES AND CARBOXYLIC ACIDS
  {
    notation: 'IN.CBSE.C12.CH.ORC.9',
    strand: 'Chemistry - Organic',
    description: 'understand nomenclature of aldehydes and ketones',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.10',
    strand: 'Chemistry - Organic',
    description: 'understand nucleophilic addition reactions',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.11',
    strand: 'Chemistry - Organic',
    description: 'understand aldol and Cannizzaro reactions',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.12',
    strand: 'Chemistry - Organic',
    description: 'understand preparation and reactions of carboxylic acids',
  },

  // CHEMISTRY - AMINES
  {
    notation: 'IN.CBSE.C12.CH.ORC.13',
    strand: 'Chemistry - Organic',
    description: 'understand classification and nomenclature of amines',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.14',
    strand: 'Chemistry - Organic',
    description: 'understand preparation and reactions of amines',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.15',
    strand: 'Chemistry - Organic',
    description: 'understand diazonium salts and their reactions',
  },

  // CHEMISTRY - BIOMOLECULES
  {
    notation: 'IN.CBSE.C12.CH.ORC.16',
    strand: 'Chemistry - Organic',
    description: 'understand carbohydrates: classification and structure',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.17',
    strand: 'Chemistry - Organic',
    description: 'understand proteins: amino acids and peptide bonds',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.18',
    strand: 'Chemistry - Organic',
    description: 'understand nucleic acids: DNA and RNA structure',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.19',
    strand: 'Chemistry - Organic',
    description: 'understand enzymes and vitamins',
  },

  // CHEMISTRY - POLYMERS
  {
    notation: 'IN.CBSE.C12.CH.ORC.20',
    strand: 'Chemistry - Organic',
    description: 'understand classification of polymers',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.21',
    strand: 'Chemistry - Organic',
    description: 'understand polymerization reactions: addition and condensation',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.22',
    strand: 'Chemistry - Organic',
    description: 'understand important polymers and their uses',
  },

  // CHEMISTRY - CHEMISTRY IN EVERYDAY LIFE
  {
    notation: 'IN.CBSE.C12.CH.ORC.23',
    strand: 'Chemistry - Organic',
    description: 'understand drugs and their classification',
  },
  {
    notation: 'IN.CBSE.C12.CH.ORC.24',
    strand: 'Chemistry - Organic',
    description: 'understand soaps and detergents',
  },

  // BIOLOGY - REPRODUCTION
  {
    notation: 'IN.CBSE.C12.BI.ZOO.1',
    strand: 'Biology - Zoology',
    description: 'understand asexual and sexual reproduction in organisms',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.1',
    strand: 'Biology - Botany',
    description: 'understand sexual reproduction in flowering plants',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.2',
    strand: 'Biology - Botany',
    description: 'understand structure of flower and microsporogenesis',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.3',
    strand: 'Biology - Botany',
    description: 'understand megasporogenesis and embryo sac development',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.4',
    strand: 'Biology - Botany',
    description: 'understand pollination mechanisms',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.5',
    strand: 'Biology - Botany',
    description: 'understand double fertilization and post-fertilization events',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.2',
    strand: 'Biology - Zoology',
    description: 'understand human male reproductive system',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.3',
    strand: 'Biology - Zoology',
    description: 'understand human female reproductive system',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.4',
    strand: 'Biology - Zoology',
    description: 'understand gametogenesis: spermatogenesis and oogenesis',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.5',
    strand: 'Biology - Zoology',
    description: 'understand fertilization and embryonic development',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.6',
    strand: 'Biology - Zoology',
    description: 'understand pregnancy and parturition',
  },

  // BIOLOGY - REPRODUCTIVE HEALTH
  {
    notation: 'IN.CBSE.C12.BI.ZOO.7',
    strand: 'Biology - Zoology',
    description: 'understand reproductive health and population control',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.8',
    strand: 'Biology - Zoology',
    description: 'understand contraception methods',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.9',
    strand: 'Biology - Zoology',
    description: 'understand infertility and assisted reproductive technologies',
  },

  // BIOLOGY - GENETICS AND EVOLUTION
  {
    notation: 'IN.CBSE.C12.BI.GEN.1',
    strand: 'Biology - Genetics',
    description: 'understand Mendel\'s laws of inheritance',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.2',
    strand: 'Biology - Genetics',
    description: 'understand inheritance patterns: incomplete dominance, codominance',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.3',
    strand: 'Biology - Genetics',
    description: 'understand multiple alleles: ABO blood group',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.4',
    strand: 'Biology - Genetics',
    description: 'understand linkage and crossing over',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.5',
    strand: 'Biology - Genetics',
    description: 'understand sex determination mechanisms',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.6',
    strand: 'Biology - Genetics',
    description: 'understand sex-linked inheritance',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.7',
    strand: 'Biology - Genetics',
    description: 'understand mutations and genetic disorders',
  },

  // BIOLOGY - MOLECULAR BASIS OF INHERITANCE
  {
    notation: 'IN.CBSE.C12.BI.GEN.8',
    strand: 'Biology - Genetics',
    description: 'understand DNA as genetic material',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.9',
    strand: 'Biology - Genetics',
    description: 'understand DNA replication',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.10',
    strand: 'Biology - Genetics',
    description: 'understand transcription and processing',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.11',
    strand: 'Biology - Genetics',
    description: 'understand genetic code and translation',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.12',
    strand: 'Biology - Genetics',
    description: 'understand regulation of gene expression',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.13',
    strand: 'Biology - Genetics',
    description: 'understand human genome project',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.14',
    strand: 'Biology - Genetics',
    description: 'understand DNA fingerprinting',
  },

  // BIOLOGY - EVOLUTION
  {
    notation: 'IN.CBSE.C12.BI.GEN.15',
    strand: 'Biology - Genetics',
    description: 'understand origin of life and biological evolution',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.16',
    strand: 'Biology - Genetics',
    description: 'understand evidences of evolution',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.17',
    strand: 'Biology - Genetics',
    description: 'understand mechanisms of evolution: natural selection',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.18',
    strand: 'Biology - Genetics',
    description: 'understand Hardy-Weinberg principle',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.19',
    strand: 'Biology - Genetics',
    description: 'understand human evolution',
  },

  // BIOLOGY - BIOLOGY AND HUMAN WELFARE
  {
    notation: 'IN.CBSE.C12.BI.ZOO.10',
    strand: 'Biology - Zoology',
    description: 'understand human health and diseases',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.11',
    strand: 'Biology - Zoology',
    description: 'understand immunity: innate and acquired',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.12',
    strand: 'Biology - Zoology',
    description: 'understand AIDS and cancer',
  },
  {
    notation: 'IN.CBSE.C12.BI.ZOO.13',
    strand: 'Biology - Zoology',
    description: 'understand drugs and alcohol abuse',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.6',
    strand: 'Biology - Botany',
    description: 'understand microbes in household products and medicine',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.7',
    strand: 'Biology - Botany',
    description: 'understand microbes in industrial production',
  },
  {
    notation: 'IN.CBSE.C12.BI.BOT.8',
    strand: 'Biology - Botany',
    description: 'understand microbes in sewage treatment and biogas',
  },

  // BIOLOGY - BIOTECHNOLOGY
  {
    notation: 'IN.CBSE.C12.BI.GEN.20',
    strand: 'Biology - Genetics',
    description: 'understand principles and tools of biotechnology',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.21',
    strand: 'Biology - Genetics',
    description: 'understand recombinant DNA technology',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.22',
    strand: 'Biology - Genetics',
    description: 'understand PCR and gel electrophoresis',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.23',
    strand: 'Biology - Genetics',
    description: 'understand transgenic organisms',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.24',
    strand: 'Biology - Genetics',
    description: 'understand applications of biotechnology in medicine',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.25',
    strand: 'Biology - Genetics',
    description: 'understand applications of biotechnology in agriculture',
  },
  {
    notation: 'IN.CBSE.C12.BI.GEN.26',
    strand: 'Biology - Genetics',
    description: 'understand bioethics and biosafety issues',
  },

  // BIOLOGY - ECOLOGY
  {
    notation: 'IN.CBSE.C12.BI.ECO.1',
    strand: 'Biology - Ecology',
    description: 'understand organisms and populations',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.2',
    strand: 'Biology - Ecology',
    description: 'understand population attributes and growth models',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.3',
    strand: 'Biology - Ecology',
    description: 'understand population interactions',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.4',
    strand: 'Biology - Ecology',
    description: 'understand ecosystem structure and function',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.5',
    strand: 'Biology - Ecology',
    description: 'understand productivity and energy flow',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.6',
    strand: 'Biology - Ecology',
    description: 'understand nutrient cycling',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.7',
    strand: 'Biology - Ecology',
    description: 'understand ecological succession',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.8',
    strand: 'Biology - Ecology',
    description: 'understand biodiversity and its conservation',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.9',
    strand: 'Biology - Ecology',
    description: 'understand causes of biodiversity loss',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.10',
    strand: 'Biology - Ecology',
    description: 'understand in-situ and ex-situ conservation',
  },
  {
    notation: 'IN.CBSE.C12.BI.ECO.11',
    strand: 'Biology - Ecology',
    description: 'understand environmental issues: pollution and global warming',
  }
];

// =============================================================================
// EXPORT CBSE SCIENCE CURRICULUM
// =============================================================================

export const cbseScienceCurriculum: CBSEScienceCurriculum = {
  code: 'INDIAN_CBSE',
  name: 'Central Board of Secondary Education',
  country: 'IN',
  version: '2024-25',
  sourceUrl: 'https://ncert.nic.in/textbook.php',
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

// Helper functions
export function getCBSEScienceStandardsForClass(classNum: number): CBSEScienceStandard[] {
  const classData = cbseScienceCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalCBSEScienceStandardsCount(): number {
  return cbseScienceCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default cbseScienceCurriculum;
