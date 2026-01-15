/**
 * CBSE (Central Board of Secondary Education) - Science Standards
 * Classes 1-8 (Primary and Middle School)
 *
 * Source: NCERT Curriculum Framework and Textbooks
 * https://ncert.nic.in/textbook.php
 * https://cbseacademic.nic.in/curriculum.html
 *
 * Based on NCERT Environmental Studies (Classes 1-5) and Science (Classes 6-8)
 * Note: Classes 1-5 study "Environmental Studies" (EVS) which covers basic science concepts
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
  chapter?: string; // NCERT chapter reference
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
    chapter: 'Plants Around Us'
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.2',
    strand: 'Living World',
    description: 'identify common animals and their homes',
    chapter: 'Animals Around Us'
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.3',
    strand: 'Living World',
    description: 'recognize parts of a plant: root, stem, leaf, flower',
    chapter: 'Plants Around Us'
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.4',
    strand: 'Living World',
    description: 'understand that animals have different body coverings',
    chapter: 'Animals Around Us'
  },
  {
    notation: 'IN.CBSE.C1.SC.LIV.5',
    strand: 'Living World',
    description: 'classify animals as domestic and wild',
    chapter: 'Animals Around Us'
  },

  // FAMILY AND COMMUNITY
  {
    notation: 'IN.CBSE.C1.SC.FAM.1',
    strand: 'Family and Community',
    description: 'identify family members and their relationships',
    chapter: 'My Family'
  },
  {
    notation: 'IN.CBSE.C1.SC.FAM.2',
    strand: 'Family and Community',
    description: 'understand roles of family members',
    chapter: 'My Family'
  },

  // HEALTH AND HYGIENE
  {
    notation: 'IN.CBSE.C1.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand importance of cleanliness',
    chapter: 'Good Habits'
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'identify healthy habits: brushing teeth, bathing, washing hands',
    chapter: 'Good Habits'
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'identify body parts and their functions',
    chapter: 'My Body'
  },
  {
    notation: 'IN.CBSE.C1.SC.HEA.4',
    strand: 'Health and Hygiene',
    description: 'understand the five senses',
    chapter: 'My Body'
  },

  // FOOD
  {
    notation: 'IN.CBSE.C1.SC.FOD.1',
    strand: 'Food',
    description: 'identify different types of food: fruits, vegetables, grains',
    chapter: 'Food We Eat'
  },
  {
    notation: 'IN.CBSE.C1.SC.FOD.2',
    strand: 'Food',
    description: 'understand that food gives us energy',
    chapter: 'Food We Eat'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C1.SC.ENV.1',
    strand: 'Environment',
    description: 'observe changes in weather (hot, cold, rainy)',
    chapter: 'Weather and Seasons'
  },
  {
    notation: 'IN.CBSE.C1.SC.ENV.2',
    strand: 'Environment',
    description: 'understand day and night',
    chapter: 'Day and Night'
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
    chapter: 'Plants Give Us Food'
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how plants grow from seeds',
    chapter: 'Plants Grow from Seeds'
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.3',
    strand: 'Living World',
    description: 'identify what animals eat and where they live',
    chapter: 'Animals and Their Homes'
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.4',
    strand: 'Living World',
    description: 'understand that animals have young ones',
    chapter: 'Baby Animals'
  },
  {
    notation: 'IN.CBSE.C2.SC.LIV.5',
    strand: 'Living World',
    description: 'classify animals by what they eat: herbivores, carnivores',
    chapter: 'Animals and Their Food'
  },

  // WATER
  {
    notation: 'IN.CBSE.C2.SC.WAT.1',
    strand: 'Water',
    description: 'understand uses of water in daily life',
    chapter: 'Water'
  },
  {
    notation: 'IN.CBSE.C2.SC.WAT.2',
    strand: 'Water',
    description: 'identify sources of water',
    chapter: 'Water'
  },
  {
    notation: 'IN.CBSE.C2.SC.WAT.3',
    strand: 'Water',
    description: 'understand importance of saving water',
    chapter: 'Water'
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C2.SC.SHL.1',
    strand: 'Shelter',
    description: 'identify different types of houses',
    chapter: 'Our Homes'
  },
  {
    notation: 'IN.CBSE.C2.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand why we need shelter',
    chapter: 'Our Homes'
  },

  // HEALTH AND HYGIENE
  {
    notation: 'IN.CBSE.C2.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand importance of balanced diet',
    chapter: 'Healthy Food'
  },
  {
    notation: 'IN.CBSE.C2.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'identify junk food and healthy food',
    chapter: 'Healthy Food'
  },
  {
    notation: 'IN.CBSE.C2.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'understand need for exercise and rest',
    chapter: 'Exercise and Play'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C2.SC.ENV.1',
    strand: 'Environment',
    description: 'observe and describe the four seasons',
    chapter: 'Seasons'
  },
  {
    notation: 'IN.CBSE.C2.SC.ENV.2',
    strand: 'Environment',
    description: 'understand how seasons affect our clothes and activities',
    chapter: 'Seasons'
  },
  {
    notation: 'IN.CBSE.C2.SC.ENV.3',
    strand: 'Environment',
    description: 'understand importance of air',
    chapter: 'Air Around Us'
  },

  // TRAVEL
  {
    notation: 'IN.CBSE.C2.SC.TRV.1',
    strand: 'Travel and Transport',
    description: 'identify different modes of transport',
    chapter: 'Means of Transport'
  },
  {
    notation: 'IN.CBSE.C2.SC.TRV.2',
    strand: 'Travel and Transport',
    description: 'classify transport as land, water, and air',
    chapter: 'Means of Transport'
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
    chapter: 'Plant Fairy'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.2',
    strand: 'Living World',
    description: 'understand that plants need water, air, sunlight to grow',
    chapter: 'The Plant Fairy'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.3',
    strand: 'Living World',
    description: 'identify plants that grow in water and on land',
    chapter: 'Water O Water'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.4',
    strand: 'Living World',
    description: 'understand how seeds spread and grow',
    chapter: 'Seeds and Seeds'
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C3.SC.LIV.5',
    strand: 'Living World',
    description: 'identify animals by their body coverings: fur, feathers, scales',
    chapter: 'Poonam\'s Day Out'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.6',
    strand: 'Living World',
    description: 'understand different ways animals move',
    chapter: 'Poonam\'s Day Out'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.7',
    strand: 'Living World',
    description: 'understand animals breathe in different ways',
    chapter: 'Flying High'
  },
  {
    notation: 'IN.CBSE.C3.SC.LIV.8',
    strand: 'Living World',
    description: 'identify birds and their special features',
    chapter: 'Flying High'
  },

  // FOOD
  {
    notation: 'IN.CBSE.C3.SC.FOD.1',
    strand: 'Food',
    description: 'identify food from plants: roots, stems, leaves, fruits, seeds',
    chapter: 'Food That Plants Give Us'
  },
  {
    notation: 'IN.CBSE.C3.SC.FOD.2',
    strand: 'Food',
    description: 'understand food from animals: milk, eggs, honey',
    chapter: 'Food That Animals Give Us'
  },
  {
    notation: 'IN.CBSE.C3.SC.FOD.3',
    strand: 'Food',
    description: 'understand how food is cooked and preserved',
    chapter: 'What is Cooking?'
  },

  // WATER
  {
    notation: 'IN.CBSE.C3.SC.WAT.1',
    strand: 'Water',
    description: 'understand the water cycle (basic)',
    chapter: 'Water O Water'
  },
  {
    notation: 'IN.CBSE.C3.SC.WAT.2',
    strand: 'Water',
    description: 'understand importance of clean water',
    chapter: 'Water O Water'
  },
  {
    notation: 'IN.CBSE.C3.SC.WAT.3',
    strand: 'Water',
    description: 'identify water-borne diseases and prevention',
    chapter: 'Water O Water'
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C3.SC.SHL.1',
    strand: 'Shelter',
    description: 'understand houses are made of different materials',
    chapter: 'A House Like This!'
  },
  {
    notation: 'IN.CBSE.C3.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand why houses are designed differently in different places',
    chapter: 'A House Like This!'
  },

  // HEALTH
  {
    notation: 'IN.CBSE.C3.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand need for safe drinking water',
    chapter: 'Don\'t Be Afraid of the Dark'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C3.SC.ENV.1',
    strand: 'Environment',
    description: 'understand relationship between living things',
    chapter: 'Beautiful Eyes'
  },
  {
    notation: 'IN.CBSE.C3.SC.ENV.2',
    strand: 'Environment',
    description: 'understand importance of trees',
    chapter: 'The Story of Food'
  },

  // FAMILY
  {
    notation: 'IN.CBSE.C3.SC.FAM.1',
    strand: 'Family and Community',
    description: 'understand how families are different yet similar',
    chapter: 'The World in My Home'
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
    chapter: 'A Day with Nandu'
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how new plants grow from different parts',
    chapter: 'The Valley of Flowers'
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.3',
    strand: 'Living World',
    description: 'identify trees that grow in different climates',
    chapter: 'The Valley of Flowers'
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C4.SC.LIV.4',
    strand: 'Living World',
    description: 'understand different animals have different teeth for different food',
    chapter: 'Eat it Up'
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.5',
    strand: 'Living World',
    description: 'understand food chain in nature',
    chapter: 'Reaching Grandmother\'s House'
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.6',
    strand: 'Living World',
    description: 'understand how animals protect themselves',
    chapter: 'A Day with Nandu'
  },
  {
    notation: 'IN.CBSE.C4.SC.LIV.7',
    strand: 'Living World',
    description: 'identify endangered animals and need for conservation',
    chapter: 'A Day with Nandu'
  },

  // FOOD
  {
    notation: 'IN.CBSE.C4.SC.FOD.1',
    strand: 'Food',
    description: 'understand digestion of food (basic)',
    chapter: 'Eat it Up'
  },
  {
    notation: 'IN.CBSE.C4.SC.FOD.2',
    strand: 'Food',
    description: 'understand importance of different nutrients',
    chapter: 'Eat it Up'
  },
  {
    notation: 'IN.CBSE.C4.SC.FOD.3',
    strand: 'Food',
    description: 'understand how food spoils and can be preserved',
    chapter: 'News of the World'
  },

  // WATER
  {
    notation: 'IN.CBSE.C4.SC.WAT.1',
    strand: 'Water',
    description: 'understand scarcity of water in some regions',
    chapter: 'Abdul in the Garden'
  },
  {
    notation: 'IN.CBSE.C4.SC.WAT.2',
    strand: 'Water',
    description: 'understand methods of rainwater harvesting',
    chapter: 'Too Much Water, Too Little Water'
  },
  {
    notation: 'IN.CBSE.C4.SC.WAT.3',
    strand: 'Water',
    description: 'understand effects of floods and droughts',
    chapter: 'Too Much Water, Too Little Water'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C4.SC.ENV.1',
    strand: 'Environment',
    description: 'understand how garbage is created and disposed',
    chapter: 'A River\'s Tale'
  },
  {
    notation: 'IN.CBSE.C4.SC.ENV.2',
    strand: 'Environment',
    description: 'understand water pollution and its effects',
    chapter: 'A River\'s Tale'
  },
  {
    notation: 'IN.CBSE.C4.SC.ENV.3',
    strand: 'Environment',
    description: 'understand deforestation and its effects',
    chapter: 'The World in My Home'
  },

  // SHELTER
  {
    notation: 'IN.CBSE.C4.SC.SHL.1',
    strand: 'Shelter',
    description: 'understand houses in different regions of India',
    chapter: 'Pochampalli'
  },
  {
    notation: 'IN.CBSE.C4.SC.SHL.2',
    strand: 'Shelter',
    description: 'understand how animals build their homes',
    chapter: 'A Day with Nandu'
  },

  // WORK AND PLAY
  {
    notation: 'IN.CBSE.C4.SC.WRK.1',
    strand: 'Work and Play',
    description: 'understand different occupations in the community',
    chapter: 'From the Window'
  },

  // TRAVEL
  {
    notation: 'IN.CBSE.C4.SC.TRV.1',
    strand: 'Travel and Transport',
    description: 'understand how goods are transported',
    chapter: 'Reaching Grandmother\'s House'
  },
  {
    notation: 'IN.CBSE.C4.SC.TRV.2',
    strand: 'Travel and Transport',
    description: 'understand reading maps and directions',
    chapter: 'Reaching Grandmother\'s House'
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
    chapter: 'Seeds and Seeds'
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.2',
    strand: 'Living World',
    description: 'understand how plants make food through photosynthesis (basic)',
    chapter: 'The Green Plants'
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.3',
    strand: 'Living World',
    description: 'identify different types of roots and their functions',
    chapter: 'Seeds and Seeds'
  },

  // LIVING WORLD - ANIMALS
  {
    notation: 'IN.CBSE.C5.SC.LIV.4',
    strand: 'Living World',
    description: 'understand how animals adapt to their environment',
    chapter: 'Across the Wall'
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.5',
    strand: 'Living World',
    description: 'understand life cycle of animals: egg, larva, pupa, adult',
    chapter: 'A Treat for Mosquitoes'
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.6',
    strand: 'Living World',
    description: 'identify different habitats and animals that live there',
    chapter: 'Across the Wall'
  },
  {
    notation: 'IN.CBSE.C5.SC.LIV.7',
    strand: 'Living World',
    description: 'understand migration of birds',
    chapter: 'When the Earth Shook'
  },

  // FOOD
  {
    notation: 'IN.CBSE.C5.SC.FOD.1',
    strand: 'Food',
    description: 'understand food chain and food web',
    chapter: 'Seeds and Seeds'
  },
  {
    notation: 'IN.CBSE.C5.SC.FOD.2',
    strand: 'Food',
    description: 'understand how food travels from farm to plate',
    chapter: 'What If It Finishes?'
  },
  {
    notation: 'IN.CBSE.C5.SC.FOD.3',
    strand: 'Food',
    description: 'understand importance of agriculture and farming',
    chapter: 'Super Senses'
  },

  // HEALTH
  {
    notation: 'IN.CBSE.C5.SC.HEA.1',
    strand: 'Health and Hygiene',
    description: 'understand diseases spread by mosquitoes: malaria, dengue',
    chapter: 'A Treat for Mosquitoes'
  },
  {
    notation: 'IN.CBSE.C5.SC.HEA.2',
    strand: 'Health and Hygiene',
    description: 'understand prevention of mosquito-borne diseases',
    chapter: 'A Treat for Mosquitoes'
  },
  {
    notation: 'IN.CBSE.C5.SC.HEA.3',
    strand: 'Health and Hygiene',
    description: 'understand first aid (basic)',
    chapter: 'No Place for Us?'
  },

  // WATER
  {
    notation: 'IN.CBSE.C5.SC.WAT.1',
    strand: 'Water',
    description: 'understand water cycle in detail',
    chapter: 'Every Drop Counts'
  },
  {
    notation: 'IN.CBSE.C5.SC.WAT.2',
    strand: 'Water',
    description: 'understand water conservation methods',
    chapter: 'Every Drop Counts'
  },
  {
    notation: 'IN.CBSE.C5.SC.WAT.3',
    strand: 'Water',
    description: 'understand role of forests in water cycle',
    chapter: 'Every Drop Counts'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C5.SC.ENV.1',
    strand: 'Environment',
    description: 'understand natural disasters: earthquakes',
    chapter: 'When the Earth Shook'
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.2',
    strand: 'Environment',
    description: 'understand natural disasters: floods',
    chapter: 'When the Earth Shook'
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.3',
    strand: 'Environment',
    description: 'understand importance of biodiversity',
    chapter: 'Across the Wall'
  },
  {
    notation: 'IN.CBSE.C5.SC.ENV.4',
    strand: 'Environment',
    description: 'understand how humans affect the environment',
    chapter: 'No Place for Us?'
  },

  // EARTH AND SPACE
  {
    notation: 'IN.CBSE.C5.SC.EAS.1',
    strand: 'Earth and Space',
    description: 'understand the earth has layers',
    chapter: 'When the Earth Shook'
  },
  {
    notation: 'IN.CBSE.C5.SC.EAS.2',
    strand: 'Earth and Space',
    description: 'understand what causes earthquakes (basic)',
    chapter: 'When the Earth Shook'
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
    chapter: 'Food: Where Does It Come From?'
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.2',
    strand: 'Food',
    description: 'understand components of food: carbohydrates, proteins, fats, vitamins',
    chapter: 'Components of Food'
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.3',
    strand: 'Food',
    description: 'test for presence of starch and protein in food',
    chapter: 'Components of Food'
  },
  {
    notation: 'IN.CBSE.C6.SC.FOD.4',
    strand: 'Food',
    description: 'understand balanced diet and deficiency diseases',
    chapter: 'Components of Food'
  },

  // BIOLOGY - PLANTS
  {
    notation: 'IN.CBSE.C6.SC.BIO.1',
    strand: 'Biology',
    description: 'understand the process of photosynthesis',
    chapter: 'Getting to Know Plants'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.2',
    strand: 'Biology',
    description: 'identify different types of plants: herbs, shrubs, trees',
    chapter: 'Getting to Know Plants'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.3',
    strand: 'Biology',
    description: 'understand functions of roots, stems, and leaves',
    chapter: 'Getting to Know Plants'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.4',
    strand: 'Biology',
    description: 'understand structure and function of flower parts',
    chapter: 'Getting to Know Plants'
  },

  // BIOLOGY - ANIMALS AND HUMANS
  {
    notation: 'IN.CBSE.C6.SC.BIO.5',
    strand: 'Biology',
    description: 'understand different body movements in animals',
    chapter: 'Body Movements'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.6',
    strand: 'Biology',
    description: 'understand human skeleton and joints',
    chapter: 'Body Movements'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.7',
    strand: 'Biology',
    description: 'understand types of joints: ball and socket, hinge, pivot',
    chapter: 'Body Movements'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.8',
    strand: 'Biology',
    description: 'classify organisms into groups',
    chapter: 'The Living Organisms and Their Surroundings'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.9',
    strand: 'Biology',
    description: 'understand habitat and adaptation',
    chapter: 'The Living Organisms and Their Surroundings'
  },
  {
    notation: 'IN.CBSE.C6.SC.BIO.10',
    strand: 'Biology',
    description: 'understand characteristics of living things',
    chapter: 'The Living Organisms and Their Surroundings'
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C6.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand fibre to fabric: natural and synthetic fibres',
    chapter: 'Fibre to Fabric'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand how yarn is made from fibres',
    chapter: 'Fibre to Fabric'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.3',
    strand: 'Chemistry',
    description: 'distinguish between materials based on appearance and solubility',
    chapter: 'Sorting Materials into Groups'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand solubility and transparency of materials',
    chapter: 'Sorting Materials into Groups'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand changes in materials: reversible and irreversible',
    chapter: 'Changes Around Us'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.6',
    strand: 'Chemistry',
    description: 'understand methods of separation: filtration, evaporation, decantation',
    chapter: 'Separation of Substances'
  },
  {
    notation: 'IN.CBSE.C6.SC.CHM.7',
    strand: 'Chemistry',
    description: 'understand saturated solutions',
    chapter: 'Separation of Substances'
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C6.SC.PHY.1',
    strand: 'Physics',
    description: 'understand different types of motion: rectilinear, circular, periodic',
    chapter: 'Motion and Measurement of Distances'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.2',
    strand: 'Physics',
    description: 'measure length, time using appropriate instruments',
    chapter: 'Motion and Measurement of Distances'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.3',
    strand: 'Physics',
    description: 'understand properties of light: rectilinear propagation, shadows',
    chapter: 'Light, Shadows and Reflections'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.4',
    strand: 'Physics',
    description: 'understand reflection from plane and curved surfaces',
    chapter: 'Light, Shadows and Reflections'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.5',
    strand: 'Physics',
    description: 'understand electric circuits and components',
    chapter: 'Electricity and Circuits'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.6',
    strand: 'Physics',
    description: 'understand conductors and insulators',
    chapter: 'Electricity and Circuits'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.7',
    strand: 'Physics',
    description: 'understand magnets: properties and uses',
    chapter: 'Fun with Magnets'
  },
  {
    notation: 'IN.CBSE.C6.SC.PHY.8',
    strand: 'Physics',
    description: 'identify magnetic and non-magnetic materials',
    chapter: 'Fun with Magnets'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C6.SC.ENV.1',
    strand: 'Environment',
    description: 'understand water cycle and its importance',
    chapter: 'Water'
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.2',
    strand: 'Environment',
    description: 'understand sources and conservation of water',
    chapter: 'Water'
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.3',
    strand: 'Environment',
    description: 'understand air composition and its importance',
    chapter: 'Air Around Us'
  },
  {
    notation: 'IN.CBSE.C6.SC.ENV.4',
    strand: 'Environment',
    description: 'understand garbage management: composting, recycling',
    chapter: 'Garbage In, Garbage Out'
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
    chapter: 'Nutrition in Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.2',
    strand: 'Biology',
    description: 'understand modes of nutrition: autotrophic and heterotrophic',
    chapter: 'Nutrition in Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.3',
    strand: 'Biology',
    description: 'understand human digestive system',
    chapter: 'Nutrition in Animals'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.4',
    strand: 'Biology',
    description: 'understand digestion in grass-eating animals',
    chapter: 'Nutrition in Animals'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.5',
    strand: 'Biology',
    description: 'understand respiration in organisms',
    chapter: 'Respiration in Organisms'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.6',
    strand: 'Biology',
    description: 'understand breathing and cellular respiration',
    chapter: 'Respiration in Organisms'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.7',
    strand: 'Biology',
    description: 'understand transportation in plants and animals',
    chapter: 'Transportation in Animals and Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.8',
    strand: 'Biology',
    description: 'understand circulatory system: heart, blood, blood vessels',
    chapter: 'Transportation in Animals and Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.9',
    strand: 'Biology',
    description: 'understand excretion in humans',
    chapter: 'Transportation in Animals and Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.10',
    strand: 'Biology',
    description: 'understand reproduction in plants: vegetative, sexual',
    chapter: 'Reproduction in Plants'
  },
  {
    notation: 'IN.CBSE.C7.SC.BIO.11',
    strand: 'Biology',
    description: 'understand pollination and fertilization in plants',
    chapter: 'Reproduction in Plants'
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C7.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand wool and silk: animal fibres',
    chapter: 'Fibre to Fabric'
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand physical and chemical changes',
    chapter: 'Physical and Chemical Changes'
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.3',
    strand: 'Chemistry',
    description: 'understand acids, bases, and salts',
    chapter: 'Acids, Bases and Salts'
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand neutralization reaction',
    chapter: 'Acids, Bases and Salts'
  },
  {
    notation: 'IN.CBSE.C7.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand indicators: natural and synthetic',
    chapter: 'Acids, Bases and Salts'
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C7.SC.PHY.1',
    strand: 'Physics',
    description: 'understand heat transfer: conduction, convection, radiation',
    chapter: 'Heat'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.2',
    strand: 'Physics',
    description: 'understand temperature measurement',
    chapter: 'Heat'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.3',
    strand: 'Physics',
    description: 'understand speed, distance, and time relationship',
    chapter: 'Motion and Time'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.4',
    strand: 'Physics',
    description: 'understand uniform and non-uniform motion',
    chapter: 'Motion and Time'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.5',
    strand: 'Physics',
    description: 'understand distance-time graphs',
    chapter: 'Motion and Time'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.6',
    strand: 'Physics',
    description: 'understand electric current and its effects',
    chapter: 'Electric Current and Its Effects'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.7',
    strand: 'Physics',
    description: 'understand electromagnets and their applications',
    chapter: 'Electric Current and Its Effects'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.8',
    strand: 'Physics',
    description: 'understand light: reflection, formation of images',
    chapter: 'Light'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.9',
    strand: 'Physics',
    description: 'understand spherical mirrors and lenses',
    chapter: 'Light'
  },
  {
    notation: 'IN.CBSE.C7.SC.PHY.10',
    strand: 'Physics',
    description: 'understand wind: causes and effects',
    chapter: 'Winds, Storms and Cyclones'
  },

  // ENVIRONMENT
  {
    notation: 'IN.CBSE.C7.SC.ENV.1',
    strand: 'Environment',
    description: 'understand soil: types and formation',
    chapter: 'Soil'
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.2',
    strand: 'Environment',
    description: 'understand soil erosion and conservation',
    chapter: 'Soil'
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.3',
    strand: 'Environment',
    description: 'understand water: importance and sewage treatment',
    chapter: 'Water: A Precious Resource'
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.4',
    strand: 'Environment',
    description: 'understand forests: importance and conservation',
    chapter: 'Forests: Our Lifeline'
  },
  {
    notation: 'IN.CBSE.C7.SC.ENV.5',
    strand: 'Environment',
    description: 'understand wastewater management',
    chapter: 'Wastewater Story'
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
    chapter: 'Crop Production and Management'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.2',
    strand: 'Biology',
    description: 'understand cell: structure and functions',
    chapter: 'Cell — Structure and Functions'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.3',
    strand: 'Biology',
    description: 'compare plant and animal cells',
    chapter: 'Cell — Structure and Functions'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.4',
    strand: 'Biology',
    description: 'understand microorganisms: types and uses',
    chapter: 'Microorganisms: Friend and Foe'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.5',
    strand: 'Biology',
    description: 'understand communicable diseases and prevention',
    chapter: 'Microorganisms: Friend and Foe'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.6',
    strand: 'Biology',
    description: 'understand food preservation methods',
    chapter: 'Microorganisms: Friend and Foe'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.7',
    strand: 'Biology',
    description: 'understand reproduction in animals: sexual and asexual',
    chapter: 'Reproduction in Animals'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.8',
    strand: 'Biology',
    description: 'understand human reproductive system',
    chapter: 'Reaching the Age of Adolescence'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.9',
    strand: 'Biology',
    description: 'understand puberty and adolescence',
    chapter: 'Reaching the Age of Adolescence'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.10',
    strand: 'Biology',
    description: 'understand conservation of plants and animals',
    chapter: 'Conservation of Plants and Animals'
  },
  {
    notation: 'IN.CBSE.C8.SC.BIO.11',
    strand: 'Biology',
    description: 'understand biodiversity and its importance',
    chapter: 'Conservation of Plants and Animals'
  },

  // CHEMISTRY
  {
    notation: 'IN.CBSE.C8.SC.CHM.1',
    strand: 'Chemistry',
    description: 'understand synthetic fibres and plastics',
    chapter: 'Synthetic Fibres and Plastics'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.2',
    strand: 'Chemistry',
    description: 'understand properties and uses of plastics',
    chapter: 'Synthetic Fibres and Plastics'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.3',
    strand: 'Chemistry',
    description: 'understand metals and non-metals: properties',
    chapter: 'Metals and Non-metals'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.4',
    strand: 'Chemistry',
    description: 'understand reactions of metals with air, water, acids',
    chapter: 'Metals and Non-metals'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.5',
    strand: 'Chemistry',
    description: 'understand coal and petroleum: formation and uses',
    chapter: 'Coal and Petroleum'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.6',
    strand: 'Chemistry',
    description: 'understand natural resources: exhaustible and inexhaustible',
    chapter: 'Coal and Petroleum'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.7',
    strand: 'Chemistry',
    description: 'understand combustion and flame',
    chapter: 'Combustion and Flame'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.8',
    strand: 'Chemistry',
    description: 'understand types of combustion and fire safety',
    chapter: 'Combustion and Flame'
  },
  {
    notation: 'IN.CBSE.C8.SC.CHM.9',
    strand: 'Chemistry',
    description: 'understand chemical effects of electric current',
    chapter: 'Chemical Effects of Electric Current'
  },

  // PHYSICS
  {
    notation: 'IN.CBSE.C8.SC.PHY.1',
    strand: 'Physics',
    description: 'understand force: types and effects',
    chapter: 'Force and Pressure'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.2',
    strand: 'Physics',
    description: 'understand pressure in liquids and gases',
    chapter: 'Force and Pressure'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.3',
    strand: 'Physics',
    description: 'understand atmospheric pressure',
    chapter: 'Force and Pressure'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.4',
    strand: 'Physics',
    description: 'understand friction: causes, types, advantages, disadvantages',
    chapter: 'Friction'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.5',
    strand: 'Physics',
    description: 'understand ways to reduce friction',
    chapter: 'Friction'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.6',
    strand: 'Physics',
    description: 'understand sound: production and propagation',
    chapter: 'Sound'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.7',
    strand: 'Physics',
    description: 'understand characteristics of sound: pitch, loudness',
    chapter: 'Sound'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.8',
    strand: 'Physics',
    description: 'understand human ear structure and hearing',
    chapter: 'Sound'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.9',
    strand: 'Physics',
    description: 'understand reflection of light: laws and mirrors',
    chapter: 'Light'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.10',
    strand: 'Physics',
    description: 'understand human eye: structure and defects',
    chapter: 'Light'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.11',
    strand: 'Physics',
    description: 'understand earthquakes and seismic waves',
    chapter: 'Some Natural Phenomena'
  },
  {
    notation: 'IN.CBSE.C8.SC.PHY.12',
    strand: 'Physics',
    description: 'understand lightning and static electricity',
    chapter: 'Some Natural Phenomena'
  },

  // ENVIRONMENT / EARTH SCIENCE
  {
    notation: 'IN.CBSE.C8.SC.ENV.1',
    strand: 'Environment',
    description: 'understand air pollution and its effects',
    chapter: 'Pollution of Air and Water'
  },
  {
    notation: 'IN.CBSE.C8.SC.ENV.2',
    strand: 'Environment',
    description: 'understand water pollution and purification',
    chapter: 'Pollution of Air and Water'
  },
  {
    notation: 'IN.CBSE.C8.SC.ENV.3',
    strand: 'Environment',
    description: 'understand greenhouse effect and global warming',
    chapter: 'Pollution of Air and Water'
  },

  // ASTRONOMY
  {
    notation: 'IN.CBSE.C8.SC.AST.1',
    strand: 'Astronomy',
    description: 'understand stars, constellations, and solar system',
    chapter: 'Stars and the Solar System'
  },
  {
    notation: 'IN.CBSE.C8.SC.AST.2',
    strand: 'Astronomy',
    description: 'understand moon phases and eclipses',
    chapter: 'Stars and the Solar System'
  },
  {
    notation: 'IN.CBSE.C8.SC.AST.3',
    strand: 'Astronomy',
    description: 'understand artificial satellites and their uses',
    chapter: 'Stars and the Solar System'
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
