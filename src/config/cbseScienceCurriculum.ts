/**
 * CBSE (Central Board of Secondary Education) - Science Standards
 * Classes 1-8 (Primary and Middle School)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes
 * rather than specific textbook chapters.
 *
 * Classes 1-5: Environmental Studies (EVS) covering basic science concepts
 * Classes 6-8: Integrated Science (Physics, Chemistry, Biology)
 *
 * NOTE: Chapter mapping to NEP 2020 textbooks (2024-25 onwards) is pending.
 * New NCERT textbooks include "Curiosity" (Science) series.
 *
 * Notation System: IN.CBSE.C{class}.SC.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (1-8)
 * - SC = Science
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
 *   Classes 6-8 (Science):
 *   - PHY = Physics
 *   - CHM = Chemistry
 *   - BIO = Biology
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
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards }
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
