/**
 * US C3 Framework - Social Studies Standards
 * Grades K-8 (organized by grade bands: K-2, 3-5, 6-8)
 *
 * Official Source: https://www.socialstudies.org/standards/c3
 *
 * The College, Career, and Civic Life (C3) Framework for Social Studies
 * State Standards was developed through a three-year state-led collaborative
 * effort to provide guidance for enhancing the rigor of K-12 civics, economics,
 * geography, and history.
 *
 * Notation System: US.C3.{gradeBand}.SS.{discipline}.{number}
 * - US = United States
 * - C3 = C3 Framework
 * - Grade Bands: K2, 35, 68
 * - SS = Social Studies
 * - Disciplines:
 *   - D1 = Developing Questions and Planning Inquiries (Dimension 1)
 *   - CIV = Civics (Dimension 2)
 *   - ECO = Economics (Dimension 2)
 *   - GEO = Geography (Dimension 2)
 *   - HIS = History (Dimension 2)
 *   - D3 = Evaluating Sources and Using Evidence (Dimension 3)
 *   - D4 = Communicating Conclusions and Taking Informed Action (Dimension 4)
 *
 * Verified against official NCSS documentation: 2025-01-20
 */

export interface C3SocialStudiesStandard {
  notation: string;
  officialCode: string; // Original C3 code (e.g., D2.Civ.1.K-2)
  dimension: string;
  discipline: string;
  strand: string;
  description: string;
}

export interface C3SocialStudiesGradeBand {
  gradeBand: string; // K-2, 3-5, 6-8
  gradeLevel: number; // Representative grade: 0, 3, 6
  gradeLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: C3SocialStudiesStandard[];
}

export interface C3SocialStudiesCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  gradeBands: C3SocialStudiesGradeBand[];
}

// =============================================================================
// GRADES K-2 (Ages 5-8)
// =============================================================================

const gradesK2Standards: C3SocialStudiesStandard[] = [
  // DIMENSION 1: DEVELOPING QUESTIONS AND PLANNING INQUIRIES
  {
    notation: 'US.C3.K2.SS.D1.1',
    officialCode: 'D1.1.K-2',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Explain why the compelling question is important to the student.',
  },
  {
    notation: 'US.C3.K2.SS.D1.2',
    officialCode: 'D1.2.K-2',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Identify disciplinary ideas associated with a compelling question.',
  },
  {
    notation: 'US.C3.K2.SS.D1.3',
    officialCode: 'D1.3.K-2',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Identify facts and concepts associated with a supporting question.',
  },
  {
    notation: 'US.C3.K2.SS.D1.4',
    officialCode: 'D1.4.K-2',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Make connections between supporting questions and compelling questions.',
  },
  {
    notation: 'US.C3.K2.SS.D1.5',
    officialCode: 'D1.5.K-2',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Determining Helpful Sources',
    description: 'Determine the kinds of sources that will be helpful in answering compelling and supporting questions.',
  },

  // DIMENSION 2: CIVICS
  {
    notation: 'US.C3.K2.SS.CIV.1',
    officialCode: 'D2.Civ.1.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Describe roles and responsibilities of people in authority.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.2',
    officialCode: 'D2.Civ.2.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain how all people, not just official leaders, play important roles in a community.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.3',
    officialCode: 'D2.Civ.3.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain the need for and purposes of rules in various settings inside and outside of school.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.5',
    officialCode: 'D2.Civ.5.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain what governments are and some of their functions.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.6',
    officialCode: 'D2.Civ.6.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Describe how communities work to accomplish common tasks, establish responsibilities, and fulfill roles of authority.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.7',
    officialCode: 'D2.Civ.7.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Apply civic virtues when participating in school settings.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.8',
    officialCode: 'D2.Civ.8.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Describe democratic principles such as equality, fairness, and respect for legitimate authority and rules.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.9',
    officialCode: 'D2.Civ.9.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Follow agreed-upon rules for discussions while responding attentively to others when addressing ideas and making decisions as a group.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.10',
    officialCode: 'D2.Civ.10.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: "Compare their own point of view with others' perspectives.",
  },
  {
    notation: 'US.C3.K2.SS.CIV.11',
    officialCode: 'D2.Civ.11.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Explain how people can work together to make decisions in the classroom.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.12',
    officialCode: 'D2.Civ.12.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Identify and explain how rules function in public (classroom and school) settings.',
  },
  {
    notation: 'US.C3.K2.SS.CIV.14',
    officialCode: 'D2.Civ.14.K-2',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Describe how people have tried to improve their communities over time.',
  },

  // DIMENSION 2: ECONOMICS
  {
    notation: 'US.C3.K2.SS.ECO.1',
    officialCode: 'D2.Eco.1.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Explain how scarcity necessitates decision making.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.2',
    officialCode: 'D2.Eco.2.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Identify the benefits and costs of making various personal decisions.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.3',
    officialCode: 'D2.Eco.3.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the skills and knowledge required to produce certain goods and services.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.4',
    officialCode: 'D2.Eco.4.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the goods and services that people in the local community produce and those that are produced in other communities.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.5',
    officialCode: 'D2.Eco.5.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Identify prices of products in a local market.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.6',
    officialCode: 'D2.Eco.6.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain how people earn income.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.7',
    officialCode: 'D2.Eco.7.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe examples of costs of production.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.9',
    officialCode: 'D2.Eco.9.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the role of banks in an economy.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.10',
    officialCode: 'D2.Eco.10.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain why people save.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.12',
    officialCode: 'D2.Eco.12.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Describe examples of the goods and services that governments provide.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.13',
    officialCode: 'D2.Eco.13.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Describe examples of capital goods and human capital.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.14',
    officialCode: 'D2.Eco.14.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The Global Economy',
    description: 'Describe why people in one country trade goods and services with people in other countries.',
  },
  {
    notation: 'US.C3.K2.SS.ECO.15',
    officialCode: 'D2.Eco.15.K-2',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The Global Economy',
    description: 'Describe products that are produced abroad and sold domestically and products that are produced domestically and sold abroad.',
  },

  // DIMENSION 2: GEOGRAPHY
  {
    notation: 'US.C3.K2.SS.GEO.1',
    officialCode: 'D2.Geo.1.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Construct maps, graphs, and other representations of familiar places.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.2',
    officialCode: 'D2.Geo.2.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use maps, graphs, photographs and other representations to describe places and the relationships and interactions that shape them.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.3',
    officialCode: 'D2.Geo.3.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use maps, globes, and other simple geographic models to identify cultural and environmental characteristics of places.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.4',
    officialCode: 'D2.Geo.4.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: "Explain how weather, climate, and other environmental characteristics affect people's lives in a place or region.",
  },
  {
    notation: 'US.C3.K2.SS.GEO.5',
    officialCode: 'D2.Geo.5.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Describe how human activities affect the cultural and environmental characteristics of places or regions.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.6',
    officialCode: 'D2.Geo.6.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Identify some cultural and environmental characteristics of specific places.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.7',
    officialCode: 'D2.Geo.7.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Explain why and how people, goods, and ideas move from place to place.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.8',
    officialCode: 'D2.Geo.8.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Compare how people in different types of communities use local and distant environments to meet their daily needs.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.9',
    officialCode: 'D2.Geo.9.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Describe the connections between the physical environment of a place and the economic activities found there.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.10',
    officialCode: 'D2.Geo.10.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Describe changes in the physical and cultural characteristics of various world regions.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.11',
    officialCode: 'D2.Geo.11.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Explain how the consumption of products connects people to distant places.',
  },
  {
    notation: 'US.C3.K2.SS.GEO.12',
    officialCode: 'D2.Geo.12.K-2',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Identify ways that a catastrophic disaster may affect people living in a place.',
  },

  // DIMENSION 2: HISTORY
  {
    notation: 'US.C3.K2.SS.HIS.1',
    officialCode: 'D2.His.1.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Create a chronological sequence of multiple events.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.2',
    officialCode: 'D2.His.2.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Compare life in the past to life today.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.3',
    officialCode: 'D2.His.3.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Generate questions about individuals and groups who have shaped a significant historical change.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.4',
    officialCode: 'D2.His.4.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: 'Compare perspectives of people in the past to those of people in the present.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.6',
    officialCode: 'D2.His.6.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: 'Compare different accounts of the same historical event.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.9',
    officialCode: 'D2.His.9.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Identify different kinds of historical sources.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.10',
    officialCode: 'D2.His.10.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Explain how historical sources can be used to study the past.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.11',
    officialCode: 'D2.His.11.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Identify the maker, date, and place of origin for a historical source from information within the source itself.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.12',
    officialCode: 'D2.His.12.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Generate questions about a particular historical source as it relates to a particular historical event or development.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.14',
    officialCode: 'D2.His.14.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Generate possible reasons for an event or development in the past.',
  },
  {
    notation: 'US.C3.K2.SS.HIS.16',
    officialCode: 'D2.His.16.K-2',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Select which reasons might be more likely than others to explain a historical event or development.',
  },

  // DIMENSION 3: EVALUATING SOURCES AND USING EVIDENCE
  {
    notation: 'US.C3.K2.SS.D3.1',
    officialCode: 'D3.1.K-2',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Gather relevant information from one or two sources while using the origin and structure to guide the selection.',
  },
  {
    notation: 'US.C3.K2.SS.D3.2',
    officialCode: 'D3.2.K-2',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Evaluate a source by distinguishing between fact and opinion.',
  },

  // DIMENSION 4: COMMUNICATING CONCLUSIONS AND TAKING INFORMED ACTION
  {
    notation: 'US.C3.K2.SS.D4.1',
    officialCode: 'D4.1.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct an argument with reasons.',
  },
  {
    notation: 'US.C3.K2.SS.D4.2',
    officialCode: 'D4.2.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct explanations using correct sequence and relevant information.',
  },
  {
    notation: 'US.C3.K2.SS.D4.3',
    officialCode: 'D4.3.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Present a summary of an argument using print, oral, and digital technologies.',
  },
  {
    notation: 'US.C3.K2.SS.D4.4',
    officialCode: 'D4.4.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Ask and answer questions about arguments.',
  },
  {
    notation: 'US.C3.K2.SS.D4.5',
    officialCode: 'D4.5.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Ask and answer questions about explanations.',
  },
  {
    notation: 'US.C3.K2.SS.D4.6',
    officialCode: 'D4.6.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Identify and explain a range of local, regional, and global problems, and some ways in which people are trying to address these problems.',
  },
  {
    notation: 'US.C3.K2.SS.D4.7',
    officialCode: 'D4.7.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Identify ways to take action to help address local, regional, and global problems.',
  },
  {
    notation: 'US.C3.K2.SS.D4.8',
    officialCode: 'D4.8.K-2',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Use listening, consensus-building, and voting procedures to decide on and take action in their classrooms.',
  },
];

// =============================================================================
// GRADES 3-5 (Ages 8-11)
// =============================================================================

const grades35Standards: C3SocialStudiesStandard[] = [
  // DIMENSION 1: DEVELOPING QUESTIONS AND PLANNING INQUIRIES
  {
    notation: 'US.C3.35.SS.D1.1',
    officialCode: 'D1.1.3-5',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Explain why the compelling questions are important to others (e.g., peers, adults).',
  },
  {
    notation: 'US.C3.35.SS.D1.2',
    officialCode: 'D1.2.3-5',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Identify disciplinary concepts and ideas associated with a compelling question that are open to different interpretations.',
  },
  {
    notation: 'US.C3.35.SS.D1.3',
    officialCode: 'D1.3.3-5',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Identify the disciplinary concepts and ideas associated with a supporting question that are open to interpretation.',
  },
  {
    notation: 'US.C3.35.SS.D1.4',
    officialCode: 'D1.4.3-5',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Explain how supporting questions help answer compelling questions in an inquiry.',
  },
  {
    notation: 'US.C3.35.SS.D1.5',
    officialCode: 'D1.5.3-5',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Determining Helpful Sources',
    description: 'Determine the kinds of sources that will be helpful in answering compelling and supporting questions, taking into consideration the different opinions people have about how to answer the questions.',
  },

  // DIMENSION 2: CIVICS
  {
    notation: 'US.C3.35.SS.CIV.1',
    officialCode: 'D2.Civ.1.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Distinguish the responsibilities and powers of government officials at various levels and branches of government and in different times and places.',
  },
  {
    notation: 'US.C3.35.SS.CIV.2',
    officialCode: 'D2.Civ.2.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: "Explain how a democracy relies on people's responsible participation, and draw implications for how individuals should participate.",
  },
  {
    notation: 'US.C3.35.SS.CIV.3',
    officialCode: 'D2.Civ.3.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Examine the origins and purposes of rules, laws, and key U.S. constitutional provisions.',
  },
  {
    notation: 'US.C3.35.SS.CIV.4',
    officialCode: 'D2.Civ.4.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain how groups of people make rules to create responsibilities and protect freedoms.',
  },
  {
    notation: 'US.C3.35.SS.CIV.5',
    officialCode: 'D2.Civ.5.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain the origins, functions, and structure of different systems of government, including those created by the U.S. and state constitutions.',
  },
  {
    notation: 'US.C3.35.SS.CIV.6',
    officialCode: 'D2.Civ.6.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Describe ways in which people benefit from and are challenged by working together, including through government, workplaces, voluntary organizations, and families.',
  },
  {
    notation: 'US.C3.35.SS.CIV.7',
    officialCode: 'D2.Civ.7.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Apply civic virtues and democratic principles in school settings.',
  },
  {
    notation: 'US.C3.35.SS.CIV.8',
    officialCode: 'D2.Civ.8.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Identify core civic virtues and democratic principles that guide government, society, and communities.',
  },
  {
    notation: 'US.C3.35.SS.CIV.9',
    officialCode: 'D2.Civ.9.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Use deliberative processes when making decisions or reaching judgments as a group.',
  },
  {
    notation: 'US.C3.35.SS.CIV.10',
    officialCode: 'D2.Civ.10.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: "Identify the beliefs, experiences, perspectives, and values that underlie their own and others' points of view about civic issues.",
  },
  {
    notation: 'US.C3.35.SS.CIV.11',
    officialCode: 'D2.Civ.11.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Compare procedures for making decisions in a variety of settings, including classroom, school, government, and/or society.',
  },
  {
    notation: 'US.C3.35.SS.CIV.12',
    officialCode: 'D2.Civ.12.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Explain how rules and laws change society and how people change rules and laws.',
  },
  {
    notation: 'US.C3.35.SS.CIV.13',
    officialCode: 'D2.Civ.13.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Explain how policies are developed to address public problems.',
  },
  {
    notation: 'US.C3.35.SS.CIV.14',
    officialCode: 'D2.Civ.14.3-5',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Illustrate historical and contemporary means of changing society.',
  },

  // DIMENSION 2: ECONOMICS
  {
    notation: 'US.C3.35.SS.ECO.1',
    officialCode: 'D2.Eco.1.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Compare the benefits and costs of individual choices.',
  },
  {
    notation: 'US.C3.35.SS.ECO.2',
    officialCode: 'D2.Eco.2.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Identify positive and negative incentives that influence the decisions people make.',
  },
  {
    notation: 'US.C3.35.SS.ECO.3',
    officialCode: 'D2.Eco.3.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Identify examples of the variety of resources (human capital, physical capital, and natural resources) that are used to produce goods and services.',
  },
  {
    notation: 'US.C3.35.SS.ECO.4',
    officialCode: 'D2.Eco.4.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain why individuals and businesses specialize and trade.',
  },
  {
    notation: 'US.C3.35.SS.ECO.5',
    officialCode: 'D2.Eco.5.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain the role of money in making exchange easier.',
  },
  {
    notation: 'US.C3.35.SS.ECO.6',
    officialCode: 'D2.Eco.6.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain the relationship between investment in human capital, productivity, and future incomes.',
  },
  {
    notation: 'US.C3.35.SS.ECO.7',
    officialCode: 'D2.Eco.7.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain how profits influence sellers in markets.',
  },
  {
    notation: 'US.C3.35.SS.ECO.8',
    officialCode: 'D2.Eco.8.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Identify examples of external benefits and costs.',
  },
  {
    notation: 'US.C3.35.SS.ECO.9',
    officialCode: 'D2.Eco.9.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the role of other financial institutions in an economy.',
  },
  {
    notation: 'US.C3.35.SS.ECO.10',
    officialCode: 'D2.Eco.10.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain the ways in which the government pays for the goods and services it provides.',
  },
  {
    notation: 'US.C3.35.SS.ECO.11',
    officialCode: 'D2.Eco.11.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Describe ways in which increasing economic interdependence affects different groups within participating nations.',
  },
  {
    notation: 'US.C3.35.SS.ECO.12',
    officialCode: 'D2.Eco.12.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain the ways in which the government pays for the goods and services it provides.',
  },
  {
    notation: 'US.C3.35.SS.ECO.13',
    officialCode: 'D2.Eco.13.3-5',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Describe ways people can increase productivity by using improved capital goods and improving their human capital.',
  },

  // DIMENSION 2: GEOGRAPHY
  {
    notation: 'US.C3.35.SS.GEO.1',
    officialCode: 'D2.Geo.1.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Construct maps and other graphic representations of both familiar and unfamiliar places.',
  },
  {
    notation: 'US.C3.35.SS.GEO.2',
    officialCode: 'D2.Geo.2.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use maps, satellite images, photographs, and other representations to explain relationships between the locations of places and regions and their environmental characteristics.',
  },
  {
    notation: 'US.C3.35.SS.GEO.3',
    officialCode: 'D2.Geo.3.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use maps of different scales to describe the locations of cultural and environmental characteristics.',
  },
  {
    notation: 'US.C3.35.SS.GEO.4',
    officialCode: 'D2.Geo.4.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Explain how culture influences the way people modify and adapt to their environments.',
  },
  {
    notation: 'US.C3.35.SS.GEO.5',
    officialCode: 'D2.Geo.5.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Explain how the cultural and environmental characteristics of places change over time.',
  },
  {
    notation: 'US.C3.35.SS.GEO.6',
    officialCode: 'D2.Geo.6.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Describe how environmental and cultural characteristics influence population distribution in specific places or regions.',
  },
  {
    notation: 'US.C3.35.SS.GEO.7',
    officialCode: 'D2.Geo.7.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Explain how cultural and environmental characteristics affect the distribution and movement of people, goods, and ideas.',
  },
  {
    notation: 'US.C3.35.SS.GEO.8',
    officialCode: 'D2.Geo.8.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Explain how human settlements and movements relate to the locations and use of various natural resources.',
  },
  {
    notation: 'US.C3.35.SS.GEO.9',
    officialCode: 'D2.Geo.9.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Analyze the effects of catastrophic environmental and technological events on human settlements and migration.',
  },
  {
    notation: 'US.C3.35.SS.GEO.10',
    officialCode: 'D2.Geo.10.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Explain why environmental characteristics vary among different world regions.',
  },
  {
    notation: 'US.C3.35.SS.GEO.11',
    officialCode: 'D2.Geo.11.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Describe how the spatial patterns of economic activities in a place change over time because of interactions with nearby and distant places.',
  },
  {
    notation: 'US.C3.35.SS.GEO.12',
    officialCode: 'D2.Geo.12.3-5',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Explain how natural and human-made catastrophic events in one place affect people living in other places.',
  },

  // DIMENSION 2: HISTORY
  {
    notation: 'US.C3.35.SS.HIS.1',
    officialCode: 'D2.His.1.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Create and use a chronological sequence of related events to compare developments that happened at the same time.',
  },
  {
    notation: 'US.C3.35.SS.HIS.2',
    officialCode: 'D2.His.2.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Compare life in specific historical time periods to life today.',
  },
  {
    notation: 'US.C3.35.SS.HIS.3',
    officialCode: 'D2.His.3.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Generate questions about individuals and groups who have shaped significant historical changes and continuities.',
  },
  {
    notation: 'US.C3.35.SS.HIS.4',
    officialCode: 'D2.His.4.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: 'Explain why individuals and groups during the same historical period differed in their perspectives.',
  },
  {
    notation: 'US.C3.35.SS.HIS.5',
    officialCode: 'D2.His.5.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: "Explain connections among historical contexts and people's perspectives at the time.",
  },
  {
    notation: 'US.C3.35.SS.HIS.6',
    officialCode: 'D2.His.6.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: "Describe how people's perspectives shaped the historical sources they created.",
  },
  {
    notation: 'US.C3.35.SS.HIS.9',
    officialCode: 'D2.His.9.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Summarize how different kinds of historical sources are used to explain events in the past.',
  },
  {
    notation: 'US.C3.35.SS.HIS.10',
    officialCode: 'D2.His.10.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Compare information provided by different historical sources about the past.',
  },
  {
    notation: 'US.C3.35.SS.HIS.11',
    officialCode: 'D2.His.11.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Infer the intended audience and purpose of a historical source from information within the source itself.',
  },
  {
    notation: 'US.C3.35.SS.HIS.12',
    officialCode: 'D2.His.12.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Generate questions about multiple historical sources and their relationships to particular historical events and developments.',
  },
  {
    notation: 'US.C3.35.SS.HIS.13',
    officialCode: 'D2.His.13.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Use information about a historical source, including the maker, date, place of origin, intended audience, and purpose to judge the extent to which the source is useful for studying a particular topic.',
  },
  {
    notation: 'US.C3.35.SS.HIS.14',
    officialCode: 'D2.His.14.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Explain probable causes and effects of events and developments.',
  },
  {
    notation: 'US.C3.35.SS.HIS.16',
    officialCode: 'D2.His.16.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Use evidence to develop a claim about the past.',
  },
  {
    notation: 'US.C3.35.SS.HIS.17',
    officialCode: 'D2.His.17.3-5',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Summarize the central claim in a secondary work of history.',
  },

  // DIMENSION 3: EVALUATING SOURCES AND USING EVIDENCE
  {
    notation: 'US.C3.35.SS.D3.1',
    officialCode: 'D3.1.3-5',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Gather relevant information from multiple sources while using the origin, structure, and context to guide the selection.',
  },
  {
    notation: 'US.C3.35.SS.D3.2',
    officialCode: 'D3.2.3-5',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Use distinctions among fact and opinion to determine the credibility of multiple sources.',
  },
  {
    notation: 'US.C3.35.SS.D3.3',
    officialCode: 'D3.3.3-5',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Developing Claims and Using Evidence',
    description: 'Identify evidence that draws information from multiple sources in response to compelling questions.',
  },
  {
    notation: 'US.C3.35.SS.D3.4',
    officialCode: 'D3.4.3-5',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Developing Claims and Using Evidence',
    description: 'Use evidence to develop claims in response to compelling questions.',
  },

  // DIMENSION 4: COMMUNICATING CONCLUSIONS AND TAKING INFORMED ACTION
  {
    notation: 'US.C3.35.SS.D4.1',
    officialCode: 'D4.1.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct arguments using claims and evidence from multiple sources.',
  },
  {
    notation: 'US.C3.35.SS.D4.2',
    officialCode: 'D4.2.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct explanations using reasoning, correct sequence, examples, and details with relevant information and data.',
  },
  {
    notation: 'US.C3.35.SS.D4.3',
    officialCode: 'D4.3.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Present a summary of arguments and explanations to others outside the classroom using print and oral technologies (e.g., posters, essays, letters, debates, speeches, and reports) and digital technologies (e.g., Internet, social media, and digital documentary).',
  },
  {
    notation: 'US.C3.35.SS.D4.4',
    officialCode: 'D4.4.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Critique arguments.',
  },
  {
    notation: 'US.C3.35.SS.D4.5',
    officialCode: 'D4.5.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Critique explanations.',
  },
  {
    notation: 'US.C3.35.SS.D4.6',
    officialCode: 'D4.6.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Draw on disciplinary concepts to explain the challenges people have faced and opportunities they have created, in addressing local, regional, and global problems at various times and places.',
  },
  {
    notation: 'US.C3.35.SS.D4.7',
    officialCode: 'D4.7.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Explain different strategies and approaches students and others could take in working alone and together to address local, regional, and global problems, and predict possible results of their actions.',
  },
  {
    notation: 'US.C3.35.SS.D4.8',
    officialCode: 'D4.8.3-5',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Use a range of deliberative and democratic procedures to make decisions about and act on civic problems in their classrooms and schools.',
  },
];

// =============================================================================
// GRADES 6-8 (Ages 11-14)
// =============================================================================

const grades68Standards: C3SocialStudiesStandard[] = [
  // DIMENSION 1: DEVELOPING QUESTIONS AND PLANNING INQUIRIES
  {
    notation: 'US.C3.68.SS.D1.1',
    officialCode: 'D1.1.6-8',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Explain how a question represents key ideas in the field.',
  },
  {
    notation: 'US.C3.68.SS.D1.2',
    officialCode: 'D1.2.6-8',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Compelling Questions',
    description: 'Explain points of agreement experts have about interpretations and applications of disciplinary concepts and ideas associated with a compelling question.',
  },
  {
    notation: 'US.C3.68.SS.D1.3',
    officialCode: 'D1.3.6-8',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Explain points of agreement experts have about interpretations and applications of disciplinary concepts and ideas associated with a supporting question.',
  },
  {
    notation: 'US.C3.68.SS.D1.4',
    officialCode: 'D1.4.6-8',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Constructing Supporting Questions',
    description: 'Explain how the relationship between supporting questions and compelling questions is mutually reinforcing.',
  },
  {
    notation: 'US.C3.68.SS.D1.5',
    officialCode: 'D1.5.6-8',
    dimension: 'Dimension 1',
    discipline: 'Inquiry',
    strand: 'Determining Helpful Sources',
    description: 'Determine the kinds of sources that will be helpful in answering compelling and supporting questions, taking into consideration multiple points of views represented in the sources.',
  },

  // DIMENSION 2: CIVICS
  {
    notation: 'US.C3.68.SS.CIV.1',
    officialCode: 'D2.Civ.1.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Distinguish the powers and responsibilities of citizens, political parties, interest groups, and the media in a variety of governmental and nongovernmental contexts.',
  },
  {
    notation: 'US.C3.68.SS.CIV.2',
    officialCode: 'D2.Civ.2.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain specific roles played by citizens (such as voters, jurors, taxpayers, members of the armed forces, petitioners, protesters, and office-holders).',
  },
  {
    notation: 'US.C3.68.SS.CIV.3',
    officialCode: 'D2.Civ.3.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Examine the origins, purposes, and impact of constitutions, laws, treaties, and international agreements.',
  },
  {
    notation: 'US.C3.68.SS.CIV.4',
    officialCode: 'D2.Civ.4.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain the powers and limits of the three branches of government, public officials, and bureaucracies at different levels in the United States and in other countries.',
  },
  {
    notation: 'US.C3.68.SS.CIV.5',
    officialCode: 'D2.Civ.5.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: 'Explain the origins, functions, and structure of government with reference to the U.S. Constitution, state constitutions, and selected other systems of government.',
  },
  {
    notation: 'US.C3.68.SS.CIV.6',
    officialCode: 'D2.Civ.6.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Civic and Political Institutions',
    description: "Describe the roles of political, civil, and economic organizations in shaping people's lives.",
  },
  {
    notation: 'US.C3.68.SS.CIV.7',
    officialCode: 'D2.Civ.7.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Apply civic virtues and democratic principles in school and community settings.',
  },
  {
    notation: 'US.C3.68.SS.CIV.8',
    officialCode: 'D2.Civ.8.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Analyze ideas and principles contained in the founding documents of the United States, and explain how they influence the social and political system.',
  },
  {
    notation: 'US.C3.68.SS.CIV.9',
    officialCode: 'D2.Civ.9.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Compare deliberative processes used by a wide variety of groups in various settings.',
  },
  {
    notation: 'US.C3.68.SS.CIV.10',
    officialCode: 'D2.Civ.10.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Participation and Deliberation',
    description: 'Explain the relevance of personal interests and perspectives, civic virtues, and democratic principles when people address issues and problems in government and civil society.',
  },
  {
    notation: 'US.C3.68.SS.CIV.11',
    officialCode: 'D2.Civ.11.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Differentiate among procedures for making decisions in the classroom, school, civil society, and local, state, and national government in terms of how civic purposes are intended.',
  },
  {
    notation: 'US.C3.68.SS.CIV.12',
    officialCode: 'D2.Civ.12.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Assess specific rules and laws (both actual and proposed) as means of addressing public problems.',
  },
  {
    notation: 'US.C3.68.SS.CIV.13',
    officialCode: 'D2.Civ.13.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Analyze the purposes, implementation, and consequences of public policies in multiple settings.',
  },
  {
    notation: 'US.C3.68.SS.CIV.14',
    officialCode: 'D2.Civ.14.6-8',
    dimension: 'Dimension 2',
    discipline: 'Civics',
    strand: 'Processes, Rules, and Laws',
    description: 'Compare historical and contemporary means of changing societies, and promoting the common good.',
  },

  // DIMENSION 2: ECONOMICS
  {
    notation: 'US.C3.68.SS.ECO.1',
    officialCode: 'D2.Eco.1.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Explain how economic decisions affect the well-being of individuals, businesses, and society.',
  },
  {
    notation: 'US.C3.68.SS.ECO.2',
    officialCode: 'D2.Eco.2.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Economic Decision Making',
    description: 'Evaluate alternative approaches or solutions to current economic issues in terms of benefits and costs for different groups and society as a whole.',
  },
  {
    notation: 'US.C3.68.SS.ECO.3',
    officialCode: 'D2.Eco.3.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain the roles of buyers and sellers in product, labor, and financial markets.',
  },
  {
    notation: 'US.C3.68.SS.ECO.4',
    officialCode: 'D2.Eco.4.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the role of competition in the determination of prices and wages in a market economy.',
  },
  {
    notation: 'US.C3.68.SS.ECO.5',
    officialCode: 'D2.Eco.5.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain ways in which money facilitates exchange by reducing transactional costs.',
  },
  {
    notation: 'US.C3.68.SS.ECO.6',
    officialCode: 'D2.Eco.6.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain how changes in supply and demand cause changes in prices and quantities of goods and services, labor, credit, and foreign currencies.',
  },
  {
    notation: 'US.C3.68.SS.ECO.7',
    officialCode: 'D2.Eco.7.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Analyze the role of innovation and entrepreneurship in a market economy.',
  },
  {
    notation: 'US.C3.68.SS.ECO.8',
    officialCode: 'D2.Eco.8.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Explain how external benefits and costs influence market outcomes.',
  },
  {
    notation: 'US.C3.68.SS.ECO.9',
    officialCode: 'D2.Eco.9.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'Exchange and Markets',
    description: 'Describe the roles of institutions such as corporations, non-profits, and labor unions in a market economy.',
  },
  {
    notation: 'US.C3.68.SS.ECO.10',
    officialCode: 'D2.Eco.10.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain the influence of changes in interest rates on borrowing and investing.',
  },
  {
    notation: 'US.C3.68.SS.ECO.11',
    officialCode: 'D2.Eco.11.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Use appropriate data to evaluate the state of employment, unemployment, inflation, total production, income, and economic growth in the economy.',
  },
  {
    notation: 'US.C3.68.SS.ECO.12',
    officialCode: 'D2.Eco.12.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain how inflation, deflation, and unemployment affect different groups.',
  },
  {
    notation: 'US.C3.68.SS.ECO.13',
    officialCode: 'D2.Eco.13.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The National Economy',
    description: 'Explain why standards of living increase as productivity improves.',
  },
  {
    notation: 'US.C3.68.SS.ECO.14',
    officialCode: 'D2.Eco.14.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The Global Economy',
    description: 'Explain barriers to trade and how those barriers influence trade among nations.',
  },
  {
    notation: 'US.C3.68.SS.ECO.15',
    officialCode: 'D2.Eco.15.6-8',
    dimension: 'Dimension 2',
    discipline: 'Economics',
    strand: 'The Global Economy',
    description: 'Explain the benefits and the costs of trade policies to individuals, businesses, and society.',
  },

  // DIMENSION 2: GEOGRAPHY
  {
    notation: 'US.C3.68.SS.GEO.1',
    officialCode: 'D2.Geo.1.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Construct maps to represent and explain the spatial patterns of cultural and environmental characteristics.',
  },
  {
    notation: 'US.C3.68.SS.GEO.2',
    officialCode: 'D2.Geo.2.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use maps, satellite images, photographs, and other representations to explain relationships between the locations of places and regions, and changes in their environmental characteristics.',
  },
  {
    notation: 'US.C3.68.SS.GEO.3',
    officialCode: 'D2.Geo.3.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Geographic Representations',
    description: 'Use paper based and electronic mapping and graphing techniques to represent and analyze spatial patterns of different environmental and cultural characteristics.',
  },
  {
    notation: 'US.C3.68.SS.GEO.4',
    officialCode: 'D2.Geo.4.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Explain how cultural patterns and economic decisions influence environments and the daily lives of people in both nearby and distant places.',
  },
  {
    notation: 'US.C3.68.SS.GEO.5',
    officialCode: 'D2.Geo.5.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Analyze the combinations of cultural and environmental characteristics that make places both similar to and different from other places.',
  },
  {
    notation: 'US.C3.68.SS.GEO.6',
    officialCode: 'D2.Geo.6.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human-Environment Interaction',
    description: 'Explain how the physical and human characteristics of places and regions are connected to human identities and cultures.',
  },
  {
    notation: 'US.C3.68.SS.GEO.7',
    officialCode: 'D2.Geo.7.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Explain how changes in transportation and communication technology influence the spatial connections among human settlements and affect the diffusion of ideas and cultural practices.',
  },
  {
    notation: 'US.C3.68.SS.GEO.8',
    officialCode: 'D2.Geo.8.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Analyze how relationships between humans and environments extend or contract spatial patterns of settlement and movement.',
  },
  {
    notation: 'US.C3.68.SS.GEO.9',
    officialCode: 'D2.Geo.9.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Human Population',
    description: 'Evaluate the influences of long-term human-induced environmental change on spatial patterns of conflict and cooperation.',
  },
  {
    notation: 'US.C3.68.SS.GEO.10',
    officialCode: 'D2.Geo.10.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Analyze the ways in which cultural and environmental characteristics vary among various regions of the world.',
  },
  {
    notation: 'US.C3.68.SS.GEO.11',
    officialCode: 'D2.Geo.11.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Explain how the relationship between the environmental characteristics of places and production of goods influences the spatial patterns of world trade.',
  },
  {
    notation: 'US.C3.68.SS.GEO.12',
    officialCode: 'D2.Geo.12.6-8',
    dimension: 'Dimension 2',
    discipline: 'Geography',
    strand: 'Global Interconnections',
    description: 'Explain how global changes in population distribution patterns affect changes in land use in particular places.',
  },

  // DIMENSION 2: HISTORY
  {
    notation: 'US.C3.68.SS.HIS.1',
    officialCode: 'D2.His.1.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Analyze connections among events and developments in broader historical contexts.',
  },
  {
    notation: 'US.C3.68.SS.HIS.2',
    officialCode: 'D2.His.2.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Classify series of historical events and developments as examples of change and/or continuity.',
  },
  {
    notation: 'US.C3.68.SS.HIS.3',
    officialCode: 'D2.His.3.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Change, Continuity, and Context',
    description: 'Use questions generated about individuals and groups to analyze why they, and the developments they shaped, are seen as historically significant.',
  },
  {
    notation: 'US.C3.68.SS.HIS.4',
    officialCode: 'D2.His.4.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: 'Analyze multiple factors that influenced the perspectives of people during different historical eras.',
  },
  {
    notation: 'US.C3.68.SS.HIS.5',
    officialCode: 'D2.His.5.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: 'Explain how and why perspectives of people have changed over time.',
  },
  {
    notation: 'US.C3.68.SS.HIS.6',
    officialCode: 'D2.His.6.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Perspectives',
    description: "Analyze how people's perspectives influenced what information is available in the historical sources they created.",
  },
  {
    notation: 'US.C3.68.SS.HIS.9',
    officialCode: 'D2.His.9.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Classify the kinds of historical sources used in a secondary interpretation.',
  },
  {
    notation: 'US.C3.68.SS.HIS.10',
    officialCode: 'D2.His.10.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Detect possible limitations in the historical record based on evidence collected from different kinds of historical sources.',
  },
  {
    notation: 'US.C3.68.SS.HIS.11',
    officialCode: 'D2.His.11.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Use other historical sources to infer a plausible maker, date, place of origin, and intended audience for historical sources where this information is not easily identified.',
  },
  {
    notation: 'US.C3.68.SS.HIS.12',
    officialCode: 'D2.His.12.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Use questions generated about multiple historical sources to identify further areas of inquiry and additional sources.',
  },
  {
    notation: 'US.C3.68.SS.HIS.13',
    officialCode: 'D2.His.13.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Historical Sources and Evidence',
    description: 'Evaluate the relevancy and utility of a historical source based on information such as maker, date, place of origin, intended audience, and purpose.',
  },
  {
    notation: 'US.C3.68.SS.HIS.14',
    officialCode: 'D2.His.14.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Explain multiple causes and effects of events and developments in the past.',
  },
  {
    notation: 'US.C3.68.SS.HIS.15',
    officialCode: 'D2.His.15.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Evaluate the relative influence of various causes of events and developments in the past.',
  },
  {
    notation: 'US.C3.68.SS.HIS.16',
    officialCode: 'D2.His.16.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Organize applicable evidence into a coherent argument about the past.',
  },
  {
    notation: 'US.C3.68.SS.HIS.17',
    officialCode: 'D2.His.17.6-8',
    dimension: 'Dimension 2',
    discipline: 'History',
    strand: 'Causation and Argumentation',
    description: 'Compare the central arguments in secondary works of history on related topics in multiple media.',
  },

  // DIMENSION 3: EVALUATING SOURCES AND USING EVIDENCE
  {
    notation: 'US.C3.68.SS.D3.1',
    officialCode: 'D3.1.6-8',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Gather relevant information from multiple sources while using the origin, authority, structure, context, and corroborative value of the sources to guide the selection.',
  },
  {
    notation: 'US.C3.68.SS.D3.2',
    officialCode: 'D3.2.6-8',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Gathering and Evaluating Sources',
    description: 'Evaluate the credibility of a source by determining its relevance and intended use.',
  },
  {
    notation: 'US.C3.68.SS.D3.3',
    officialCode: 'D3.3.6-8',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Developing Claims and Using Evidence',
    description: 'Identify evidence that draws information from multiple sources to support claims, noting evidentiary limitations.',
  },
  {
    notation: 'US.C3.68.SS.D3.4',
    officialCode: 'D3.4.6-8',
    dimension: 'Dimension 3',
    discipline: 'Sources and Evidence',
    strand: 'Developing Claims and Using Evidence',
    description: 'Develop claims and counterclaims while pointing out the strengths and limitations of both.',
  },

  // DIMENSION 4: COMMUNICATING CONCLUSIONS AND TAKING INFORMED ACTION
  {
    notation: 'US.C3.68.SS.D4.1',
    officialCode: 'D4.1.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct arguments using claims and evidence from multiple sources, while acknowledging the strengths and limitations of the arguments.',
  },
  {
    notation: 'US.C3.68.SS.D4.2',
    officialCode: 'D4.2.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Construct explanations using reasoning, correct sequence, examples, and details with relevant information and data, while acknowledging the strengths and weaknesses of the explanations.',
  },
  {
    notation: 'US.C3.68.SS.D4.3',
    officialCode: 'D4.3.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Communicating Conclusions',
    description: 'Present adaptations of arguments and explanations on topics of interest to others to reach audiences and venues outside the classroom using print and oral technologies (e.g., posters, essays, letters, debates, speeches, reports, and maps) and digital technologies (e.g., Internet, social media, and digital documentary).',
  },
  {
    notation: 'US.C3.68.SS.D4.4',
    officialCode: 'D4.4.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Critique arguments for credibility.',
  },
  {
    notation: 'US.C3.68.SS.D4.5',
    officialCode: 'D4.5.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Critiquing Conclusions',
    description: 'Critique the structure of explanations.',
  },
  {
    notation: 'US.C3.68.SS.D4.6',
    officialCode: 'D4.6.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Draw on multiple disciplinary lenses to analyze how a specific problem can manifest itself at local, regional, and global levels over time, identifying its characteristics and causes, and the challenges and opportunities faced by those trying to address the problem.',
  },
  {
    notation: 'US.C3.68.SS.D4.7',
    officialCode: 'D4.7.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Assess their individual and collective capacities to take action to address local, regional, and global problems, taking into account a range of possible levers of power, strategies, and potential outcomes.',
  },
  {
    notation: 'US.C3.68.SS.D4.8',
    officialCode: 'D4.8.6-8',
    dimension: 'Dimension 4',
    discipline: 'Communication and Action',
    strand: 'Taking Informed Action',
    description: 'Apply a range of deliberative and democratic procedures to make decisions and take action in their classrooms and schools, and in out-of-school civic contexts.',
  },
];

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const c3SocialStudiesCurriculum: C3SocialStudiesCurriculum = {
  code: 'US_C3',
  name: 'C3 Framework for Social Studies',
  country: 'US',
  version: '2013',
  sourceUrl: 'https://www.socialstudies.org/standards/c3',
  subject: 'SOCIAL_STUDIES',
  gradeBands: [
    {
      gradeBand: 'K-2',
      gradeLevel: 0,
      gradeLabel: 'Grades K-2',
      ageRangeMin: 5,
      ageRangeMax: 8,
      standards: gradesK2Standards,
    },
    {
      gradeBand: '3-5',
      gradeLevel: 3,
      gradeLabel: 'Grades 3-5',
      ageRangeMin: 8,
      ageRangeMax: 11,
      standards: grades35Standards,
    },
    {
      gradeBand: '6-8',
      gradeLevel: 6,
      gradeLabel: 'Grades 6-8',
      ageRangeMin: 11,
      ageRangeMax: 14,
      standards: grades68Standards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getStandardsForGradeBand(gradeBand: string): C3SocialStudiesStandard[] {
  const band = c3SocialStudiesCurriculum.gradeBands.find(
    (b) => b.gradeBand === gradeBand
  );
  return band?.standards || [];
}

export function getTotalC3StandardsCount(): number {
  return c3SocialStudiesCurriculum.gradeBands.reduce(
    (total, band) => total + band.standards.length,
    0
  );
}

export function getStandardsByDiscipline(
  gradeBand: string,
  discipline: string
): C3SocialStudiesStandard[] {
  const standards = getStandardsForGradeBand(gradeBand);
  return standards.filter((s) => s.discipline === discipline);
}

export function getStandardsByDimension(
  gradeBand: string,
  dimension: string
): C3SocialStudiesStandard[] {
  const standards = getStandardsForGradeBand(gradeBand);
  return standards.filter((s) => s.dimension === dimension);
}

export function getStandardsByStrand(
  gradeBand: string,
  strand: string
): C3SocialStudiesStandard[] {
  const standards = getStandardsForGradeBand(gradeBand);
  return standards.filter((s) => s.strand === strand);
}
