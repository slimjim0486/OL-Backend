/**
 * CBSE (Central Board of Secondary Education) - Social Science Standards
 * Classes 3-12 (Primary, Middle, Secondary, and Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes.
 *
 * Structure:
 * - Classes 3-5: EVS (Environmental Studies) with social science components
 * - Classes 6-8: Full Social Science (History, Geography, Civics)
 * - Classes 9-10: Board Examination pattern (History, Geography, Political Science, Economics)
 * - Classes 11-12: Humanities Stream subjects (History, Geography, Political Science, Economics)
 *
 * Sources:
 * - NCERT Textbooks: Our Pasts (History), The Earth Our Habitat (Geography),
 *   Social and Political Life (Civics), Resources and Development
 * - India and the Contemporary World (History 9-10)
 * - Contemporary India (Geography 9-10)
 * - Democratic Politics (Political Science 9-10)
 * - Understanding Economic Development (Economics 9-10)
 * - Themes in World History, Indian History (11-12)
 * - Fundamentals of Physical/Human Geography (11-12)
 * - Indian Constitution at Work, Political Theory (11-12)
 * - Indian Economic Development (11-12)
 * - CBSE Syllabus 2024-25
 *
 * Notation System: IN.CBSE.C{class}.SS.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (3-12)
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
 *   Classes 9-10:
 *   - HIS = History (India and the Contemporary World)
 *   - GEO = Geography (Contemporary India)
 *   - POL = Political Science (Democratic Politics)
 *   - ECO = Economics (Understanding Economic Development)
 *   Classes 11-12:
 *   - HIS = History (Themes in World History, Indian History)
 *   - GEO = Geography (Physical and Human Geography)
 *   - POL = Political Science (Constitution, Political Theory)
 *   - ECO = Economics (Indian Economic Development)
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
// CLASS 9 (Ages 14-15)
// NCERT: India and the Contemporary World I (History),
//        Contemporary India I (Geography), Democratic Politics I,
//        Economics (Understanding Economic Development concepts)
// =============================================================================

const class9Standards: CBSESocialScienceStandard[] = [
  // HISTORY - India and the Contemporary World I
  {
    notation: 'IN.CBSE.C9.SS.HIS.1',
    strand: 'History',
    description: 'analyze the French Revolution and its impact on Europe and the world'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.2',
    strand: 'History',
    description: 'explain the rise of socialism and the Russian Revolution'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.3',
    strand: 'History',
    description: 'understand Nazism and the rise of Hitler in Germany'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.4',
    strand: 'History',
    description: 'describe forest society and colonialism'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.5',
    strand: 'History',
    description: 'analyze pastoralists in the modern world'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.6',
    strand: 'History',
    description: 'explain peasants and farmers across different regions'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.7',
    strand: 'History',
    description: 'understand the history of cricket and its social significance'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.8',
    strand: 'History',
    description: 'describe clothing as a history of change and identity'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.9',
    strand: 'History',
    description: 'analyze how the French Revolution influenced democratic ideals globally'
  },
  {
    notation: 'IN.CBSE.C9.SS.HIS.10',
    strand: 'History',
    description: 'compare different forms of political and social revolutions'
  },

  // GEOGRAPHY - Contemporary India I
  {
    notation: 'IN.CBSE.C9.SS.GEO.1',
    strand: 'Geography',
    description: "describe India's size, location, and extent"
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.2',
    strand: 'Geography',
    description: 'explain the physical features of India (Himalayas, Plains, Plateaus, Coasts)'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.3',
    strand: 'Geography',
    description: 'analyze the drainage system of India (Himalayan and Peninsular rivers)'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.4',
    strand: 'Geography',
    description: 'describe the climate of India and factors affecting it'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.5',
    strand: 'Geography',
    description: 'understand the monsoon mechanism and its importance'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.6',
    strand: 'Geography',
    description: 'identify natural vegetation and wildlife of India'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.7',
    strand: 'Geography',
    description: 'explain population distribution, density, and growth in India'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.8',
    strand: 'Geography',
    description: 'analyze population composition (age, sex ratio, literacy)'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.9',
    strand: 'Geography',
    description: 'describe the concept of national population policy'
  },
  {
    notation: 'IN.CBSE.C9.SS.GEO.10',
    strand: 'Geography',
    description: 'locate and label physical features on the map of India'
  },

  // POLITICAL SCIENCE - Democratic Politics I
  {
    notation: 'IN.CBSE.C9.SS.POL.1',
    strand: 'Political Science',
    description: 'define democracy and identify its features'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.2',
    strand: 'Political Science',
    description: 'explain why democracy is considered the best form of government'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.3',
    strand: 'Political Science',
    description: 'understand constitutional design and the making of Indian Constitution'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.4',
    strand: 'Political Science',
    description: 'describe the guiding values of the Indian Constitution'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.5',
    strand: 'Political Science',
    description: 'explain electoral politics and the election process in India'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.6',
    strand: 'Political Science',
    description: 'analyze the role of Election Commission in ensuring free and fair elections'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.7',
    strand: 'Political Science',
    description: 'understand working of institutions (Parliament, Executive, Judiciary)'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.8',
    strand: 'Political Science',
    description: 'describe democratic rights and their importance'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.9',
    strand: 'Political Science',
    description: 'explain the Right to Constitutional Remedies'
  },
  {
    notation: 'IN.CBSE.C9.SS.POL.10',
    strand: 'Political Science',
    description: 'analyze the expansion of democratic rights in India'
  },

  // ECONOMICS
  {
    notation: 'IN.CBSE.C9.SS.ECO.1',
    strand: 'Economics',
    description: 'understand the story of village Palampur and economic activities'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.2',
    strand: 'Economics',
    description: 'explain factors of production (land, labour, capital, enterprise)'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.3',
    strand: 'Economics',
    description: 'describe people as resource and human capital formation'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.4',
    strand: 'Economics',
    description: 'analyze poverty as a challenge facing India'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.5',
    strand: 'Economics',
    description: 'understand the concept of poverty line and measurement'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.6',
    strand: 'Economics',
    description: 'explain food security in India and its dimensions'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.7',
    strand: 'Economics',
    description: 'describe the Public Distribution System and its role'
  },
  {
    notation: 'IN.CBSE.C9.SS.ECO.8',
    strand: 'Economics',
    description: 'analyze the importance of education and health in development'
  }
];

// =============================================================================
// CLASS 10 (Ages 15-16) - BOARD EXAMINATION YEAR
// NCERT: India and the Contemporary World II (History),
//        Contemporary India II (Geography), Democratic Politics II,
//        Understanding Economic Development
// =============================================================================

const class10Standards: CBSESocialScienceStandard[] = [
  // HISTORY - India and the Contemporary World II
  {
    notation: 'IN.CBSE.C10.SS.HIS.1',
    strand: 'History',
    description: 'analyze the rise of nationalism in Europe'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.2',
    strand: 'History',
    description: 'explain the making of Germany and Italy as nation states'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.3',
    strand: 'History',
    description: 'describe nationalism in India and the Indian National Movement'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.4',
    strand: 'History',
    description: 'analyze the Non-Cooperation and Civil Disobedience Movements'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.5',
    strand: 'History',
    description: 'understand the making of a global world (trade, migration, technology)'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.6',
    strand: 'History',
    description: 'explain the age of industrialization in Britain and India'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.7',
    strand: 'History',
    description: 'describe print culture and the modern world'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.8',
    strand: 'History',
    description: 'analyze the development of print in India and its impact on society'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.9',
    strand: 'History',
    description: 'compare nationalist movements in different countries'
  },
  {
    notation: 'IN.CBSE.C10.SS.HIS.10',
    strand: 'History',
    description: 'evaluate the role of mass movements in independence struggle'
  },

  // GEOGRAPHY - Contemporary India II
  {
    notation: 'IN.CBSE.C10.SS.GEO.1',
    strand: 'Geography',
    description: 'classify resources and explain sustainable development'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.2',
    strand: 'Geography',
    description: 'describe land resources, land use pattern, and conservation'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.3',
    strand: 'Geography',
    description: 'explain forest and wildlife resources and their conservation'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.4',
    strand: 'Geography',
    description: 'analyze water resources, multipurpose projects, and water scarcity'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.5',
    strand: 'Geography',
    description: 'describe agriculture in India, types of farming, and cropping patterns'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.6',
    strand: 'Geography',
    description: 'understand technological and institutional reforms in agriculture'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.7',
    strand: 'Geography',
    description: 'explain minerals and energy resources of India'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.8',
    strand: 'Geography',
    description: 'describe manufacturing industries and their classification'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.9',
    strand: 'Geography',
    description: 'analyze spatial distribution of industries and industrial pollution'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.10',
    strand: 'Geography',
    description: 'explain lifelines of national economy (transport and communication)'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.11',
    strand: 'Geography',
    description: 'describe international trade and its importance'
  },
  {
    notation: 'IN.CBSE.C10.SS.GEO.12',
    strand: 'Geography',
    description: 'locate and label economic features on the map of India'
  },

  // POLITICAL SCIENCE - Democratic Politics II
  {
    notation: 'IN.CBSE.C10.SS.POL.1',
    strand: 'Political Science',
    description: 'understand power sharing and its importance in democracy'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.2',
    strand: 'Political Science',
    description: 'describe forms of power sharing (horizontal and vertical)'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.3',
    strand: 'Political Science',
    description: 'explain federalism and the federal structure of India'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.4',
    strand: 'Political Science',
    description: 'analyze decentralization and local governments'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.5',
    strand: 'Political Science',
    description: 'understand democracy and diversity'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.6',
    strand: 'Political Science',
    description: 'describe gender, religion, and caste in politics'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.7',
    strand: 'Political Science',
    description: 'explain the role of political parties in democracy'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.8',
    strand: 'Political Science',
    description: 'analyze challenges to political parties and reforms'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.9',
    strand: 'Political Science',
    description: 'understand the outcomes of democracy'
  },
  {
    notation: 'IN.CBSE.C10.SS.POL.10',
    strand: 'Political Science',
    description: 'describe challenges to democracy and scope for reforms'
  },

  // ECONOMICS - Understanding Economic Development
  {
    notation: 'IN.CBSE.C10.SS.ECO.1',
    strand: 'Economics',
    description: 'understand the concept of development and national income'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.2',
    strand: 'Economics',
    description: 'compare development of different countries using indicators'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.3',
    strand: 'Economics',
    description: 'explain sectors of the Indian economy (primary, secondary, tertiary)'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.4',
    strand: 'Economics',
    description: 'analyze the contribution of different sectors to GDP and employment'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.5',
    strand: 'Economics',
    description: 'describe money and credit in the economy'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.6',
    strand: 'Economics',
    description: 'understand formal and informal sources of credit'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.7',
    strand: 'Economics',
    description: 'explain globalization and the Indian economy'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.8',
    strand: 'Economics',
    description: 'analyze the impact of globalization on India'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.9',
    strand: 'Economics',
    description: 'describe consumer rights and their protection'
  },
  {
    notation: 'IN.CBSE.C10.SS.ECO.10',
    strand: 'Economics',
    description: 'understand consumer awareness and redressal mechanisms'
  }
];

// =============================================================================
// CLASS 11 (Ages 16-17) - SENIOR SECONDARY (Humanities Stream)
// NCERT: Themes in World History,
//        Fundamentals of Physical Geography, India: Physical Environment,
//        Indian Constitution at Work, Political Theory,
//        Indian Economic Development
// =============================================================================

const class11Standards: CBSESocialScienceStandard[] = [
  // HISTORY - Themes in World History
  {
    notation: 'IN.CBSE.C11.SS.HIS.1',
    strand: 'History',
    description: 'analyze the development of early societies (from prehistory to complex societies)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.2',
    strand: 'History',
    description: 'describe writing and city life in Mesopotamia'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.3',
    strand: 'History',
    description: 'explain the empire-building experience (Roman, Chinese, Mongol empires)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.4',
    strand: 'History',
    description: 'understand the central Islamic lands and their contributions'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.5',
    strand: 'History',
    description: 'analyze nomadic empires and their significance in world history'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.6',
    strand: 'History',
    description: 'describe the three orders of feudal society in medieval Europe'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.7',
    strand: 'History',
    description: 'explain changing cultural traditions during the Renaissance'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.8',
    strand: 'History',
    description: 'understand encounters and exchanges (silk routes, trade networks)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.9',
    strand: 'History',
    description: 'analyze confrontation of cultures (colonialism and indigenous peoples)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.10',
    strand: 'History',
    description: 'describe the Industrial Revolution and its global impact'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.11',
    strand: 'History',
    description: 'explain displacing indigenous peoples (North America, Australia)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.12',
    strand: 'History',
    description: 'analyze paths to modernization (Japan, China, Russia)'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.13',
    strand: 'History',
    description: 'use historical evidence and sources critically'
  },
  {
    notation: 'IN.CBSE.C11.SS.HIS.14',
    strand: 'History',
    description: 'understand historical methods and historiography'
  },

  // GEOGRAPHY - Fundamentals of Physical Geography & India Physical Environment
  {
    notation: 'IN.CBSE.C11.SS.GEO.1',
    strand: 'Geography',
    description: 'explain geography as a discipline and its branches'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.2',
    strand: 'Geography',
    description: 'describe the origin and evolution of the Earth'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.3',
    strand: 'Geography',
    description: 'understand the interior of the Earth and its structure'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.4',
    strand: 'Geography',
    description: 'explain distribution of oceans and continents (plate tectonics)'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.5',
    strand: 'Geography',
    description: 'analyze landform development and geomorphic processes'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.6',
    strand: 'Geography',
    description: 'describe the composition and structure of the atmosphere'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.7',
    strand: 'Geography',
    description: 'explain solar radiation, heat balance, and temperature'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.8',
    strand: 'Geography',
    description: 'understand atmospheric circulation and weather systems'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.9',
    strand: 'Geography',
    description: 'analyze water in the atmosphere (humidity, precipitation)'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.10',
    strand: 'Geography',
    description: 'describe world climate and climate change'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.11',
    strand: 'Geography',
    description: 'explain the water (hydrological) cycle'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.12',
    strand: 'Geography',
    description: 'describe movements of ocean water (waves, tides, currents)'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.13',
    strand: 'Geography',
    description: 'understand life on Earth (biosphere, biodiversity)'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.14',
    strand: 'Geography',
    description: "analyze India's position in the world and physiographic divisions"
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.15',
    strand: 'Geography',
    description: 'describe the drainage systems of India in detail'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.16',
    strand: 'Geography',
    description: 'explain climate and weather patterns of India'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.17',
    strand: 'Geography',
    description: 'analyze natural vegetation and soil types of India'
  },
  {
    notation: 'IN.CBSE.C11.SS.GEO.18',
    strand: 'Geography',
    description: 'understand natural hazards and disasters in India'
  },

  // POLITICAL SCIENCE - Indian Constitution at Work & Political Theory
  {
    notation: 'IN.CBSE.C11.SS.POL.1',
    strand: 'Political Science',
    description: 'understand the philosophy and making of the Indian Constitution'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.2',
    strand: 'Political Science',
    description: 'explain fundamental rights and their significance'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.3',
    strand: 'Political Science',
    description: 'describe the Directive Principles of State Policy'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.4',
    strand: 'Political Science',
    description: 'analyze the structure and functioning of the Executive'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.5',
    strand: 'Political Science',
    description: 'explain the Legislature (Parliament) and its powers'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.6',
    strand: 'Political Science',
    description: 'describe the Judiciary and judicial review'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.7',
    strand: 'Political Science',
    description: 'understand federalism and Centre-State relations'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.8',
    strand: 'Political Science',
    description: 'analyze local governments and decentralization'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.9',
    strand: 'Political Science',
    description: 'explain the amendment process of the Constitution'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.10',
    strand: 'Political Science',
    description: 'define political theory and its relevance'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.11',
    strand: 'Political Science',
    description: 'understand the concepts of freedom and liberty'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.12',
    strand: 'Political Science',
    description: 'analyze the concept of equality and types of equality'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.13',
    strand: 'Political Science',
    description: 'explain social justice and its dimensions'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.14',
    strand: 'Political Science',
    description: 'describe rights and the relationship with duties'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.15',
    strand: 'Political Science',
    description: 'understand citizenship and its significance'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.16',
    strand: 'Political Science',
    description: 'analyze nationalism and its forms'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.17',
    strand: 'Political Science',
    description: 'explain secularism and its importance in Indian context'
  },
  {
    notation: 'IN.CBSE.C11.SS.POL.18',
    strand: 'Political Science',
    description: 'understand peace, development, and environmental concerns'
  },

  // ECONOMICS - Indian Economic Development
  {
    notation: 'IN.CBSE.C11.SS.ECO.1',
    strand: 'Economics',
    description: 'analyze the Indian economy on the eve of independence'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.2',
    strand: 'Economics',
    description: 'explain the Indian economy from 1950 to 1990 (planning era)'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.3',
    strand: 'Economics',
    description: 'describe liberalization, privatization, and globalization since 1991'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.4',
    strand: 'Economics',
    description: 'understand poverty and analyze anti-poverty measures'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.5',
    strand: 'Economics',
    description: 'analyze human capital formation in India'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.6',
    strand: 'Economics',
    description: 'explain rural development and programmes'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.7',
    strand: 'Economics',
    description: 'describe employment patterns and challenges'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.8',
    strand: 'Economics',
    description: 'understand infrastructure development (energy, health, education)'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.9',
    strand: 'Economics',
    description: 'analyze environment and sustainable development'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.10',
    strand: 'Economics',
    description: 'compare development experiences of India with China and Pakistan'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.11',
    strand: 'Economics',
    description: 'explain basic concepts of statistics for economics'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.12',
    strand: 'Economics',
    description: 'describe collection and organization of data'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.13',
    strand: 'Economics',
    description: 'understand measures of central tendency and dispersion'
  },
  {
    notation: 'IN.CBSE.C11.SS.ECO.14',
    strand: 'Economics',
    description: 'analyze correlation and index numbers'
  }
];

// =============================================================================
// CLASS 12 (Ages 17-18) - SENIOR SECONDARY BOARD YEAR (Humanities Stream)
// NCERT: Themes in Indian History I, II, III,
//        Fundamentals of Human Geography, India: People and Economy,
//        Contemporary World Politics, Politics in India since Independence,
//        Macroeconomics, Indian Economic Development
// =============================================================================

const class12Standards: CBSESocialScienceStandard[] = [
  // HISTORY - Themes in Indian History
  {
    notation: 'IN.CBSE.C12.SS.HIS.1',
    strand: 'History',
    description: 'analyze bricks, beads, and bones of the Harappan Civilization'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.2',
    strand: 'History',
    description: 'describe kings, farmers, and towns of early states and economies'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.3',
    strand: 'History',
    description: 'explain kinship, caste, and class in early societies'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.4',
    strand: 'History',
    description: 'understand thinkers, beliefs, and buildings (cultural developments)'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.5',
    strand: 'History',
    description: 'analyze through the eyes of travelers (accounts of foreign visitors)'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.6',
    strand: 'History',
    description: 'describe bhakti-sufi traditions and religious devotion'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.7',
    strand: 'History',
    description: 'explain an imperial capital (Vijayanagara)'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.8',
    strand: 'History',
    description: 'understand peasants, zamindars, and the state (Mughal India)'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.9',
    strand: 'History',
    description: 'analyze the Mughal court and administration'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.10',
    strand: 'History',
    description: 'describe colonialism and the countryside'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.11',
    strand: 'History',
    description: 'explain rebels and the Raj (1857 Revolt)'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.12',
    strand: 'History',
    description: 'understand colonial cities and urbanization'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.13',
    strand: 'History',
    description: 'analyze Mahatma Gandhi and the national movement'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.14',
    strand: 'History',
    description: 'describe the framing of the Constitution and founding of the nation'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.15',
    strand: 'History',
    description: 'understand partition and its aftermath'
  },
  {
    notation: 'IN.CBSE.C12.SS.HIS.16',
    strand: 'History',
    description: 'use historical sources, evidence, and interpretation skills'
  },

  // GEOGRAPHY - Fundamentals of Human Geography & India: People and Economy
  {
    notation: 'IN.CBSE.C12.SS.GEO.1',
    strand: 'Geography',
    description: 'explain human geography as nature and scope'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.2',
    strand: 'Geography',
    description: 'describe world population distribution, density, and growth'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.3',
    strand: 'Geography',
    description: 'analyze population composition and demographic transition'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.4',
    strand: 'Geography',
    description: 'explain human development and the HDI'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.5',
    strand: 'Geography',
    description: 'describe primary activities (agriculture, mining, forestry, fishing)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.6',
    strand: 'Geography',
    description: 'analyze secondary activities (manufacturing industries)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.7',
    strand: 'Geography',
    description: 'understand tertiary and quaternary activities (services)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.8',
    strand: 'Geography',
    description: 'explain transport and communication networks'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.9',
    strand: 'Geography',
    description: 'describe international trade and its patterns'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.10',
    strand: 'Geography',
    description: 'analyze human settlements (rural and urban)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.11',
    strand: 'Geography',
    description: 'explain population distribution and growth in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.12',
    strand: 'Geography',
    description: 'describe migration patterns (internal and international)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.13',
    strand: 'Geography',
    description: 'analyze human development in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.14',
    strand: 'Geography',
    description: 'explain human settlements in India (rural and urban)'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.15',
    strand: 'Geography',
    description: 'describe land resources and agriculture in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.16',
    strand: 'Geography',
    description: 'understand water resources and irrigation'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.17',
    strand: 'Geography',
    description: 'analyze mineral and energy resources in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.18',
    strand: 'Geography',
    description: 'explain manufacturing industries in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.19',
    strand: 'Geography',
    description: 'describe planning and sustainable development in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.20',
    strand: 'Geography',
    description: 'analyze transport and communication in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.21',
    strand: 'Geography',
    description: 'understand international trade of India'
  },
  {
    notation: 'IN.CBSE.C12.SS.GEO.22',
    strand: 'Geography',
    description: 'describe geographical perspective on selected issues and problems'
  },

  // POLITICAL SCIENCE - Politics in India since Independence & Contemporary World Politics
  {
    notation: 'IN.CBSE.C12.SS.POL.1',
    strand: 'Political Science',
    description: 'analyze the Cold War era and its impact on world politics'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.2',
    strand: 'Political Science',
    description: 'explain the disintegration of USSR and end of bipolarity'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.3',
    strand: 'Political Science',
    description: 'understand US hegemony in world politics'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.4',
    strand: 'Political Science',
    description: 'describe alternative centres of power (EU, ASEAN, China)'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.5',
    strand: 'Political Science',
    description: 'analyze contemporary South Asia'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.6',
    strand: 'Political Science',
    description: 'explain international organizations (UN, WTO, IMF, World Bank)'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.7',
    strand: 'Political Science',
    description: 'understand security in contemporary world'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.8',
    strand: 'Political Science',
    description: 'describe environment and natural resources in global politics'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.9',
    strand: 'Political Science',
    description: 'analyze globalization and its various dimensions'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.10',
    strand: 'Political Science',
    description: 'explain challenges of nation-building in India'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.11',
    strand: 'Political Science',
    description: 'understand era of one-party dominance'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.12',
    strand: 'Political Science',
    description: 'describe politics of planned development'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.13',
    strand: 'Political Science',
    description: "analyze India's external relations"
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.14',
    strand: 'Political Science',
    description: 'explain challenges to and restoration of Congress system'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.15',
    strand: 'Political Science',
    description: 'understand the crisis of democratic order (Emergency)'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.16',
    strand: 'Political Science',
    description: 'describe rise of popular movements'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.17',
    strand: 'Political Science',
    description: 'analyze regional aspirations and their accommodation'
  },
  {
    notation: 'IN.CBSE.C12.SS.POL.18',
    strand: 'Political Science',
    description: 'explain recent developments in Indian politics'
  },

  // ECONOMICS - Macroeconomics & Indian Economic Development
  {
    notation: 'IN.CBSE.C12.SS.ECO.1',
    strand: 'Economics',
    description: 'understand introduction to macroeconomics and national income accounting'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.2',
    strand: 'Economics',
    description: 'explain money and banking in the economy'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.3',
    strand: 'Economics',
    description: 'analyze determination of income and employment'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.4',
    strand: 'Economics',
    description: 'describe government budget and the economy'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.5',
    strand: 'Economics',
    description: 'understand balance of payments and exchange rate'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.6',
    strand: 'Economics',
    description: 'analyze economic reforms since 1991'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.7',
    strand: 'Economics',
    description: 'explain current challenges facing Indian economy'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.8',
    strand: 'Economics',
    description: 'describe development experience (India vs China, Pakistan)'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.9',
    strand: 'Economics',
    description: 'understand employment and unemployment'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.10',
    strand: 'Economics',
    description: 'analyze infrastructure development'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.11',
    strand: 'Economics',
    description: 'explain sustainable development and environment'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.12',
    strand: 'Economics',
    description: 'describe rural development'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.13',
    strand: 'Economics',
    description: 'analyze human capital formation'
  },
  {
    notation: 'IN.CBSE.C12.SS.ECO.14',
    strand: 'Economics',
    description: 'understand basic statistical tools for economic analysis'
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
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards },
    { class: 9, ageRangeMin: 14, ageRangeMax: 15, standards: class9Standards },
    { class: 10, ageRangeMin: 15, ageRangeMax: 16, standards: class10Standards },
    { class: 11, ageRangeMin: 16, ageRangeMax: 17, standards: class11Standards },
    { class: 12, ageRangeMin: 17, ageRangeMax: 18, standards: class12Standards }
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
