/**
 * CBSE (Central Board of Secondary Education) - Social Science Standards
 * Classes 3-8 (Primary and Middle School)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes.
 *
 * Structure:
 * - Classes 3-5: EVS (Environmental Studies) with social science components
 * - Classes 6-8: Full Social Science (History, Geography, Civics)
 *
 * Sources:
 * - NCERT Textbooks: Our Pasts (History), The Earth Our Habitat (Geography),
 *   Social and Political Life (Civics), Resources and Development
 * - CBSE Syllabus 2024-25
 *
 * Notation System: IN.CBSE.C{class}.SS.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (3-8)
 * - SS = Social Science
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
 *   - CIV = Civics/Political Science
 *   - ECO = Economics (Class 8)
 */

export interface CBSESocialScienceStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // Future: NCERT chapter mapping
}

export interface CBSESocialScienceClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: CBSESocialScienceStandard[];
}

export interface CBSESocialScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: CBSESocialScienceClass[];
}

// =============================================================================
// CLASS 3 (Ages 8-9)
// NCERT: Looking Around (EVS with Social Science components)
// =============================================================================

const class3Standards: CBSESocialScienceStandard[] = [
  // FAMILY AND COMMUNITY
  {
    notation: 'IN.CBSE.C3.SS.FAM.1',
    strand: 'Family and Community',
    description: 'identify relationships within a family and extended family'
  },
  {
    notation: 'IN.CBSE.C3.SS.FAM.2',
    strand: 'Family and Community',
    description: 'describe roles and responsibilities of family members'
  },
  {
    notation: 'IN.CBSE.C3.SS.FAM.3',
    strand: 'Family and Community',
    description: 'recognize different types of families in the community'
  },
  {
    notation: 'IN.CBSE.C3.SS.FAM.4',
    strand: 'Family and Community',
    description: 'identify different occupations in the neighborhood'
  },
  {
    notation: 'IN.CBSE.C3.SS.FAM.5',
    strand: 'Family and Community',
    description: 'explain how community helpers contribute to society'
  },

  // ENVIRONMENT AND RESOURCES
  {
    notation: 'IN.CBSE.C3.SS.ENV.1',
    strand: 'Environment and Resources',
    description: 'identify natural resources in the local environment'
  },
  {
    notation: 'IN.CBSE.C3.SS.ENV.2',
    strand: 'Environment and Resources',
    description: 'describe the importance of water as a resource'
  },
  {
    notation: 'IN.CBSE.C3.SS.ENV.3',
    strand: 'Environment and Resources',
    description: 'explain basic concepts of saving and conserving resources'
  },
  {
    notation: 'IN.CBSE.C3.SS.ENV.4',
    strand: 'Environment and Resources',
    description: 'identify sources of water in the community'
  },

  // SHELTER AND HOUSING
  {
    notation: 'IN.CBSE.C3.SS.SHL.1',
    strand: 'Shelter and Housing',
    description: 'describe different types of houses and their features'
  },
  {
    notation: 'IN.CBSE.C3.SS.SHL.2',
    strand: 'Shelter and Housing',
    description: 'explain why houses are built differently in different places'
  },
  {
    notation: 'IN.CBSE.C3.SS.SHL.3',
    strand: 'Shelter and Housing',
    description: 'identify materials used in building houses'
  },

  // TRAVEL AND COMMUNICATION
  {
    notation: 'IN.CBSE.C3.SS.TRV.1',
    strand: 'Travel and Communication',
    description: 'identify different modes of transport'
  },
  {
    notation: 'IN.CBSE.C3.SS.TRV.2',
    strand: 'Travel and Communication',
    description: 'compare old and new means of communication'
  },
  {
    notation: 'IN.CBSE.C3.SS.TRV.3',
    strand: 'Travel and Communication',
    description: 'understand the purpose of different types of vehicles'
  },

  // MAPS AND DIRECTIONS
  {
    notation: 'IN.CBSE.C3.SS.MAP.1',
    strand: 'Maps and Directions',
    description: 'identify cardinal directions (North, South, East, West)'
  },
  {
    notation: 'IN.CBSE.C3.SS.MAP.2',
    strand: 'Maps and Directions',
    description: 'read simple maps of the classroom and school'
  },
  {
    notation: 'IN.CBSE.C3.SS.MAP.3',
    strand: 'Maps and Directions',
    description: 'draw a simple map of familiar places'
  }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// NCERT: Looking Around (EVS with expanded Social Science)
// =============================================================================

const class4Standards: CBSESocialScienceStandard[] = [
  // FAMILY AND COMMUNITY
  {
    notation: 'IN.CBSE.C4.SS.FAM.1',
    strand: 'Family and Community',
    description: 'understand the concept of neighborhood and locality'
  },
  {
    notation: 'IN.CBSE.C4.SS.FAM.2',
    strand: 'Family and Community',
    description: 'identify different festivals celebrated in the community'
  },
  {
    notation: 'IN.CBSE.C4.SS.FAM.3',
    strand: 'Family and Community',
    description: 'describe the importance of cooperation in a community'
  },
  {
    notation: 'IN.CBSE.C4.SS.FAM.4',
    strand: 'Family and Community',
    description: 'recognize cultural diversity in India'
  },
  {
    notation: 'IN.CBSE.C4.SS.FAM.5',
    strand: 'Family and Community',
    description: 'understand the concept of a village and city'
  },

  // ENVIRONMENT AND RESOURCES
  {
    notation: 'IN.CBSE.C4.SS.ENV.1',
    strand: 'Environment and Resources',
    description: 'identify different types of soil and their uses'
  },
  {
    notation: 'IN.CBSE.C4.SS.ENV.2',
    strand: 'Environment and Resources',
    description: 'explain the importance of forests and wildlife'
  },
  {
    notation: 'IN.CBSE.C4.SS.ENV.3',
    strand: 'Environment and Resources',
    description: 'describe the water cycle and its importance'
  },
  {
    notation: 'IN.CBSE.C4.SS.ENV.4',
    strand: 'Environment and Resources',
    description: 'understand the need for conservation of resources'
  },
  {
    notation: 'IN.CBSE.C4.SS.ENV.5',
    strand: 'Environment and Resources',
    description: 'identify causes and effects of pollution'
  },

  // HISTORY AND HERITAGE
  {
    notation: 'IN.CBSE.C4.SS.HIS.1',
    strand: 'History and Heritage',
    description: 'understand the concept of past, present, and future'
  },
  {
    notation: 'IN.CBSE.C4.SS.HIS.2',
    strand: 'History and Heritage',
    description: 'identify important historical monuments in India'
  },
  {
    notation: 'IN.CBSE.C4.SS.HIS.3',
    strand: 'History and Heritage',
    description: 'describe the significance of national symbols'
  },
  {
    notation: 'IN.CBSE.C4.SS.HIS.4',
    strand: 'History and Heritage',
    description: 'learn about famous historical figures of India'
  },

  // TRAVEL AND COMMUNICATION
  {
    notation: 'IN.CBSE.C4.SS.TRV.1',
    strand: 'Travel and Communication',
    description: 'compare different modes of transportation across regions'
  },
  {
    notation: 'IN.CBSE.C4.SS.TRV.2',
    strand: 'Travel and Communication',
    description: 'understand the evolution of communication methods'
  },
  {
    notation: 'IN.CBSE.C4.SS.TRV.3',
    strand: 'Travel and Communication',
    description: 'identify major roads and railway networks in India'
  },

  // MAPS AND GEOGRAPHY
  {
    notation: 'IN.CBSE.C4.SS.MAP.1',
    strand: 'Maps and Geography',
    description: 'read and interpret simple maps with symbols'
  },
  {
    notation: 'IN.CBSE.C4.SS.MAP.2',
    strand: 'Maps and Geography',
    description: 'identify states and union territories of India on a map'
  },
  {
    notation: 'IN.CBSE.C4.SS.MAP.3',
    strand: 'Maps and Geography',
    description: 'locate major rivers and mountains of India'
  },
  {
    notation: 'IN.CBSE.C4.SS.MAP.4',
    strand: 'Maps and Geography',
    description: 'understand the concept of scale in maps'
  }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// NCERT: Looking Around (EVS - Final year before full Social Science)
// =============================================================================

const class5Standards: CBSESocialScienceStandard[] = [
  // FAMILY AND SOCIETY
  {
    notation: 'IN.CBSE.C5.SS.FAM.1',
    strand: 'Family and Society',
    description: 'understand the structure of the Indian government at village level'
  },
  {
    notation: 'IN.CBSE.C5.SS.FAM.2',
    strand: 'Family and Society',
    description: 'explain the role of Panchayati Raj in rural administration'
  },
  {
    notation: 'IN.CBSE.C5.SS.FAM.3',
    strand: 'Family and Society',
    description: 'identify the rights and duties of citizens'
  },
  {
    notation: 'IN.CBSE.C5.SS.FAM.4',
    strand: 'Family and Society',
    description: 'understand the importance of equality and justice'
  },
  {
    notation: 'IN.CBSE.C5.SS.FAM.5',
    strand: 'Family and Society',
    description: 'recognize the importance of respecting diversity'
  },

  // ENVIRONMENT AND RESOURCES
  {
    notation: 'IN.CBSE.C5.SS.ENV.1',
    strand: 'Environment and Resources',
    description: 'explain the importance of natural vegetation and wildlife'
  },
  {
    notation: 'IN.CBSE.C5.SS.ENV.2',
    strand: 'Environment and Resources',
    description: 'describe different climate zones of India'
  },
  {
    notation: 'IN.CBSE.C5.SS.ENV.3',
    strand: 'Environment and Resources',
    description: 'understand the concept of sustainable development'
  },
  {
    notation: 'IN.CBSE.C5.SS.ENV.4',
    strand: 'Environment and Resources',
    description: 'identify major crops grown in different parts of India'
  },
  {
    notation: 'IN.CBSE.C5.SS.ENV.5',
    strand: 'Environment and Resources',
    description: 'explain the impact of human activities on the environment'
  },

  // HISTORY AND HERITAGE
  {
    notation: 'IN.CBSE.C5.SS.HIS.1',
    strand: 'History and Heritage',
    description: 'understand the concept of historical sources'
  },
  {
    notation: 'IN.CBSE.C5.SS.HIS.2',
    strand: 'History and Heritage',
    description: 'learn about ancient civilizations in India'
  },
  {
    notation: 'IN.CBSE.C5.SS.HIS.3',
    strand: 'History and Heritage',
    description: 'describe the contributions of freedom fighters'
  },
  {
    notation: 'IN.CBSE.C5.SS.HIS.4',
    strand: 'History and Heritage',
    description: 'understand the significance of Independence Day and Republic Day'
  },
  {
    notation: 'IN.CBSE.C5.SS.HIS.5',
    strand: 'History and Heritage',
    description: 'identify important events in Indian history'
  },

  // GEOGRAPHY AND MAPS
  {
    notation: 'IN.CBSE.C5.SS.GEO.1',
    strand: 'Geography and Maps',
    description: 'understand the physical features of India (mountains, plains, plateaus)'
  },
  {
    notation: 'IN.CBSE.C5.SS.GEO.2',
    strand: 'Geography and Maps',
    description: 'identify neighboring countries of India on a map'
  },
  {
    notation: 'IN.CBSE.C5.SS.GEO.3',
    strand: 'Geography and Maps',
    description: 'read and interpret different types of maps'
  },
  {
    notation: 'IN.CBSE.C5.SS.GEO.4',
    strand: 'Geography and Maps',
    description: 'locate major water bodies and islands of India'
  },
  {
    notation: 'IN.CBSE.C5.SS.GEO.5',
    strand: 'Geography and Maps',
    description: 'understand latitude and longitude concepts'
  }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// NCERT: Our Pasts I (History), The Earth Our Habitat (Geography),
//        Social and Political Life I (Civics)
// =============================================================================

const class6Standards: CBSESocialScienceStandard[] = [
  // HISTORY - Our Pasts I
  {
    notation: 'IN.CBSE.C6.SS.HIS.1',
    strand: 'History',
    description: 'understand how we study the past using sources and evidence'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.2',
    strand: 'History',
    description: 'describe the life of hunter-gatherers and early farmers'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.3',
    strand: 'History',
    description: 'explain the development of earliest cities (Harappan Civilization)'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.4',
    strand: 'History',
    description: 'analyze what books and burials tell us about the past'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.5',
    strand: 'History',
    description: 'describe early kingdoms, kings, and republics in India'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.6',
    strand: 'History',
    description: 'understand new questions and ideas (Buddhism, Jainism)'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.7',
    strand: 'History',
    description: 'explain the rise of kingdoms to empires (Mauryan Empire)'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.8',
    strand: 'History',
    description: 'describe villages, towns, and trade in ancient India'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.9',
    strand: 'History',
    description: 'analyze new empires and kingdoms (Gupta Period)'
  },
  {
    notation: 'IN.CBSE.C6.SS.HIS.10',
    strand: 'History',
    description: 'understand buildings, paintings, and books of ancient India'
  },

  // GEOGRAPHY - The Earth Our Habitat
  {
    notation: 'IN.CBSE.C6.SS.GEO.1',
    strand: 'Geography',
    description: 'explain the position of Earth in the solar system'
  },
  {
    notation: 'IN.CBSE.C6.SS.GEO.2',
    strand: 'Geography',
    description: 'understand latitudes and longitudes on the globe'
  },
  {
    notation: 'IN.CBSE.C6.SS.GEO.3',
    strand: 'Geography',
    description: 'describe the motions of the Earth (rotation and revolution)'
  },
  {
    notation: 'IN.CBSE.C6.SS.GEO.4',
    strand: 'Geography',
    description: 'read and interpret different types of maps'
  },
  {
    notation: 'IN.CBSE.C6.SS.GEO.5',
    strand: 'Geography',
    description: 'identify major domains of the Earth (lithosphere, hydrosphere, atmosphere)'
  },
  {
    notation: 'IN.CBSE.C6.SS.GEO.6',
    strand: 'Geography',
    description: 'locate and describe the physical features of India'
  },

  // CIVICS - Social and Political Life I
  {
    notation: 'IN.CBSE.C6.SS.CIV.1',
    strand: 'Civics',
    description: 'understand diversity and its importance in India'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.2',
    strand: 'Civics',
    description: 'analyze diversity and discrimination in society'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.3',
    strand: 'Civics',
    description: 'explain what government is and its role'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.4',
    strand: 'Civics',
    description: 'describe key elements of a democratic government'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.5',
    strand: 'Civics',
    description: 'understand the Panchayati Raj system'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.6',
    strand: 'Civics',
    description: 'explain rural administration in India'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.7',
    strand: 'Civics',
    description: 'describe urban administration and municipalities'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.8',
    strand: 'Civics',
    description: 'understand rural livelihoods and occupations'
  },
  {
    notation: 'IN.CBSE.C6.SS.CIV.9',
    strand: 'Civics',
    description: 'analyze urban livelihoods and economic activities'
  }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// NCERT: Our Pasts II (History), Our Environment (Geography),
//        Social and Political Life II (Civics)
// =============================================================================

const class7Standards: CBSESocialScienceStandard[] = [
  // HISTORY - Our Pasts II
  {
    notation: 'IN.CBSE.C7.SS.HIS.1',
    strand: 'History',
    description: 'understand how to trace changes through a thousand years'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.2',
    strand: 'History',
    description: 'describe new kings and kingdoms in the medieval period'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.3',
    strand: 'History',
    description: 'explain the Delhi Sultanate and its administration'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.4',
    strand: 'History',
    description: 'analyze the Mughal Empire and its contributions'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.5',
    strand: 'History',
    description: 'describe rulers and buildings (architectural heritage)'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.6',
    strand: 'History',
    description: 'understand towns, traders, and craftspeople'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.7',
    strand: 'History',
    description: 'explain tribal societies and their way of life'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.8',
    strand: 'History',
    description: 'analyze devotional paths and religious movements (Bhakti-Sufi)'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.9',
    strand: 'History',
    description: 'understand the making of regional cultures'
  },
  {
    notation: 'IN.CBSE.C7.SS.HIS.10',
    strand: 'History',
    description: 'describe changes in social life during medieval period'
  },

  // GEOGRAPHY - Our Environment
  {
    notation: 'IN.CBSE.C7.SS.GEO.1',
    strand: 'Geography',
    description: 'explain the concept of environment and ecosystem'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.2',
    strand: 'Geography',
    description: 'describe the interior of the Earth (layers and structure)'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.3',
    strand: 'Geography',
    description: 'understand the atmosphere and its layers'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.4',
    strand: 'Geography',
    description: 'explain the water cycle and hydrosphere'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.5',
    strand: 'Geography',
    description: 'identify natural vegetation and wildlife of the world'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.6',
    strand: 'Geography',
    description: 'describe human-environment interactions'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.7',
    strand: 'Geography',
    description: 'analyze life in temperate and tropical regions'
  },
  {
    notation: 'IN.CBSE.C7.SS.GEO.8',
    strand: 'Geography',
    description: 'understand life in deserts (hot and cold)'
  },

  // CIVICS - Social and Political Life II
  {
    notation: 'IN.CBSE.C7.SS.CIV.1',
    strand: 'Civics',
    description: 'understand the concept of equality in Indian democracy'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.2',
    strand: 'Civics',
    description: 'explain the role of government in health and education'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.3',
    strand: 'Civics',
    description: 'describe how the state government works'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.4',
    strand: 'Civics',
    description: 'understand the role of the media in democracy'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.5',
    strand: 'Civics',
    description: 'analyze advertising and its impact on society'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.6',
    strand: 'Civics',
    description: 'explain markets and their functioning'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.7',
    strand: 'Civics',
    description: 'describe how a shirt is made (production chain)'
  },
  {
    notation: 'IN.CBSE.C7.SS.CIV.8',
    strand: 'Civics',
    description: 'understand struggles for equality and social movements'
  }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// NCERT: Our Pasts III (History), Resources and Development (Geography),
//        Social and Political Life III (Civics)
// =============================================================================

const class8Standards: CBSESocialScienceStandard[] = [
  // HISTORY - Our Pasts III
  {
    notation: 'IN.CBSE.C8.SS.HIS.1',
    strand: 'History',
    description: 'understand how, when, and where we study modern history'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.2',
    strand: 'History',
    description: 'explain how the East India Company established power in India'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.3',
    strand: 'History',
    description: 'describe ruling the countryside and agrarian policies'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.4',
    strand: 'History',
    description: 'analyze tribal societies and their resistance to colonial rule'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.5',
    strand: 'History',
    description: 'understand the Revolt of 1857 and its significance'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.6',
    strand: 'History',
    description: 'explain colonial education policies and their impact'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.7',
    strand: 'History',
    description: 'describe women, caste, and reform movements'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.8',
    strand: 'History',
    description: 'analyze the making of the National Movement (1870s-1947)'
  },
  {
    notation: 'IN.CBSE.C8.SS.HIS.9',
    strand: 'History',
    description: 'understand India after Independence and nation-building'
  },

  // GEOGRAPHY - Resources and Development
  {
    notation: 'IN.CBSE.C8.SS.GEO.1',
    strand: 'Geography',
    description: 'classify and explain different types of resources'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.2',
    strand: 'Geography',
    description: 'describe land, soil, water, and natural vegetation resources'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.3',
    strand: 'Geography',
    description: 'understand wildlife resources and conservation'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.4',
    strand: 'Geography',
    description: 'explain agriculture in India and its types'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.5',
    strand: 'Geography',
    description: 'describe industries and their classification'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.6',
    strand: 'Geography',
    description: 'understand human resources and population'
  },
  {
    notation: 'IN.CBSE.C8.SS.GEO.7',
    strand: 'Geography',
    description: 'analyze the distribution of industries in India'
  },

  // CIVICS - Social and Political Life III
  {
    notation: 'IN.CBSE.C8.SS.CIV.1',
    strand: 'Civics',
    description: 'explain the Indian Constitution and its significance'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.2',
    strand: 'Civics',
    description: 'understand secularism and its role in Indian democracy'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.3',
    strand: 'Civics',
    description: 'describe the Parliament and lawmaking process'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.4',
    strand: 'Civics',
    description: 'explain the judiciary and its role'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.5',
    strand: 'Civics',
    description: 'understand marginalisation and its forms'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.6',
    strand: 'Civics',
    description: 'analyze ways of confronting marginalisation'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.7',
    strand: 'Civics',
    description: 'describe public facilities and their importance'
  },
  {
    notation: 'IN.CBSE.C8.SS.CIV.8',
    strand: 'Civics',
    description: 'explain law and social justice'
  },

  // ECONOMICS (Introduction)
  {
    notation: 'IN.CBSE.C8.SS.ECO.1',
    strand: 'Economics',
    description: 'understand the role of government in economic development'
  },
  {
    notation: 'IN.CBSE.C8.SS.ECO.2',
    strand: 'Economics',
    description: 'explain the concept of economic activities and sectors'
  },
  {
    notation: 'IN.CBSE.C8.SS.ECO.3',
    strand: 'Economics',
    description: 'describe factors of production and their importance'
  }
];

// =============================================================================
// CBSE SOCIAL SCIENCE CURRICULUM EXPORT
// =============================================================================

export const cbseSocialScienceCurriculum: CBSESocialScienceCurriculum = {
  code: 'CBSE_INDIA',
  name: 'CBSE Social Science',
  country: 'IN',
  version: '2024-25',
  sourceUrl: 'https://ncert.nic.in/textbook.php',
  subject: 'SOCIAL_SCIENCE',
  classes: [
    { class: 3, ageRangeMin: 8, ageRangeMax: 9, standards: class3Standards },
    { class: 4, ageRangeMin: 9, ageRangeMax: 10, standards: class4Standards },
    { class: 5, ageRangeMin: 10, ageRangeMax: 11, standards: class5Standards },
    { class: 6, ageRangeMin: 11, ageRangeMax: 12, standards: class6Standards },
    { class: 7, ageRangeMin: 12, ageRangeMax: 13, standards: class7Standards },
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards }
  ]
};

// Helper functions
export function getCBSESocialScienceStandardsForClass(classNum: number): CBSESocialScienceStandard[] {
  const classData = cbseSocialScienceCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalCBSESocialScienceStandardsCount(): number {
  return cbseSocialScienceCurriculum.classes.reduce((sum, c) => sum + c.standards.length, 0);
}

export function getCBSESocialScienceStandardsByStrand(classNum: number, strand: string): CBSESocialScienceStandard[] {
  const standards = getCBSESocialScienceStandardsForClass(classNum);
  return standards.filter(s => s.strand === strand);
}

export default cbseSocialScienceCurriculum;
