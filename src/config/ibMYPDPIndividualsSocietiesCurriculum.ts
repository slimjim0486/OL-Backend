/**
 * IB Middle Years Programme (MYP) & Diploma Programme (DP) - Individuals and Societies
 * Grades 6-12 (Ages 11-18)
 *
 * Official Sources:
 * - IB MYP Individuals and Societies Guide (2014/2020)
 * - IB DP History Guide (2020)
 * - IB DP Geography Guide (2019)
 * - IB DP Economics Guide (2020)
 * - IB DP Global Politics Guide (2024)
 *
 * Structure:
 * - MYP Years 1-5 (Grades 6-10, Ages 11-16): Integrated humanities with 4 assessment criteria
 * - DP Years 1-2 (Grades 11-12, Ages 16-18): Specialized subjects (History, Geography, Economics, etc.)
 *
 * MYP Assessment Criteria:
 * - Criterion A: Knowing and understanding
 * - Criterion B: Investigating
 * - Criterion C: Communicating
 * - Criterion D: Thinking critically
 *
 * MYP Key Concepts: Change, Global Interactions, Time/Place/Space, Systems
 * MYP Related Concepts: Causality, Civilization, Culture, Equity, Globalization,
 *                       Identity, Innovation, Perspective, Power, Resources, Sustainability
 *
 * Notation System: IB.{programme}.{year/level}.IS.{strand}.{number}
 * - Programme: MYP or DP
 * - Year: M1-M5 for MYP, DP1-DP2 for Diploma
 * - Subject: IS (Individuals and Societies)
 * - Strand codes:
 *   MYP:
 *   - HIS = History
 *   - GEO = Geography
 *   - ECO = Economics
 *   - SOC = Sociology/Culture
 *   - POL = Politics/Governance
 *   - INV = Investigation Skills
 *   - THK = Critical Thinking
 *   DP History:
 *   - WH = World History
 *   - HL = HL Extension
 *   - IA = Internal Assessment
 *   DP Geography:
 *   - PHY = Physical Geography
 *   - HUM = Human Geography
 *   - GLO = Global Interactions (HL)
 *   DP Economics:
 *   - MIC = Microeconomics
 *   - MAC = Macroeconomics
 *   - INT = International Economics
 *   - DEV = Development Economics
 */

export interface IBIndividualsSocietiesStandard {
  notation: string;
  strand: string;
  description: string;
  assessmentCriterion?: 'A' | 'B' | 'C' | 'D';
  keyConcept?: string;
  relatedConcept?: string;
  globalContext?: string;
  isHL?: boolean;
}

export interface IBIndividualsSocietiesYear {
  year: string;
  yearLabel: string;
  gradeEquivalent: string;
  ageRangeMin: number;
  ageRangeMax: number;
  programme: 'MYP' | 'DP';
  standards: IBIndividualsSocietiesStandard[];
}

// ============================================================================
// MYP YEAR 1 (Grade 6, Ages 11-12)
// ============================================================================
const mypYear1Standards: IBIndividualsSocietiesStandard[] = [
  // Criterion A: Knowing and Understanding - History
  { notation: 'IB.MYP.M1.IS.HIS.1', strand: 'History', description: 'Identify significant events in ancient civilizations and their chronological order', assessmentCriterion: 'A', keyConcept: 'Time, Place and Space' },
  { notation: 'IB.MYP.M1.IS.HIS.2', strand: 'History', description: 'Describe the characteristics of early human settlements and communities', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M1.IS.HIS.3', strand: 'History', description: 'Explain how geographical factors influenced the development of early civilizations', assessmentCriterion: 'A', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M1.IS.HIS.4', strand: 'History', description: 'Identify primary and secondary sources used by historians', assessmentCriterion: 'A', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M1.IS.HIS.5', strand: 'History', description: 'Describe the social structures of ancient societies', assessmentCriterion: 'A', relatedConcept: 'Culture' },

  // Criterion A: Knowing and Understanding - Geography
  { notation: 'IB.MYP.M1.IS.GEO.1', strand: 'Geography', description: 'Identify major physical features of Earth (mountains, rivers, oceans, continents)', assessmentCriterion: 'A', keyConcept: 'Time, Place and Space' },
  { notation: 'IB.MYP.M1.IS.GEO.2', strand: 'Geography', description: 'Explain the relationship between climate and human activities', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M1.IS.GEO.3', strand: 'Geography', description: 'Use maps and globes to locate places and understand spatial relationships', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.IS.GEO.4', strand: 'Geography', description: 'Describe different types of settlements (rural, urban) and their characteristics', assessmentCriterion: 'A', relatedConcept: 'Resources' },
  { notation: 'IB.MYP.M1.IS.GEO.5', strand: 'Geography', description: 'Identify natural resources and explain their importance to communities', assessmentCriterion: 'A', relatedConcept: 'Resources' },

  // Criterion A: Knowing and Understanding - Economics/Society
  { notation: 'IB.MYP.M1.IS.ECO.1', strand: 'Economics', description: 'Explain the concept of needs versus wants and scarcity', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M1.IS.ECO.2', strand: 'Economics', description: 'Describe how goods and services are exchanged in communities', assessmentCriterion: 'A', relatedConcept: 'Globalization' },
  { notation: 'IB.MYP.M1.IS.SOC.1', strand: 'Society/Culture', description: 'Identify cultural practices and traditions of different communities', assessmentCriterion: 'A', relatedConcept: 'Culture' },
  { notation: 'IB.MYP.M1.IS.SOC.2', strand: 'Society/Culture', description: 'Explain how communities organize themselves and make decisions', assessmentCriterion: 'A', keyConcept: 'Systems' },

  // Criterion B: Investigating
  { notation: 'IB.MYP.M1.IS.INV.1', strand: 'Investigation', description: 'Formulate simple research questions about historical or geographical topics', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.IS.INV.2', strand: 'Investigation', description: 'Follow a structured research process with guidance', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.IS.INV.3', strand: 'Investigation', description: 'Collect information from a variety of sources (books, websites, images)', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.IS.INV.4', strand: 'Investigation', description: 'Record findings using appropriate methods (notes, tables, diagrams)', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.IS.INV.5', strand: 'Investigation', description: 'Acknowledge sources of information used in research', assessmentCriterion: 'B' },

  // Criterion C: Communicating
  { notation: 'IB.MYP.M1.IS.COM.1', strand: 'Communication', description: 'Present information clearly using appropriate formats (written, visual, oral)', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.IS.COM.2', strand: 'Communication', description: 'Use subject-specific terminology correctly', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.IS.COM.3', strand: 'Communication', description: 'Organize information logically with introduction, body, and conclusion', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.IS.COM.4', strand: 'Communication', description: 'Create and interpret simple maps, charts, and timelines', assessmentCriterion: 'C' },

  // Criterion D: Thinking Critically
  { notation: 'IB.MYP.M1.IS.THK.1', strand: 'Critical Thinking', description: 'Identify different perspectives on historical events', assessmentCriterion: 'D', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M1.IS.THK.2', strand: 'Critical Thinking', description: 'Distinguish between facts and opinions in sources', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.IS.THK.3', strand: 'Critical Thinking', description: 'Make simple connections between causes and effects', assessmentCriterion: 'D', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M1.IS.THK.4', strand: 'Critical Thinking', description: 'Reflect on own learning and identify areas for improvement', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 2 (Grade 7, Ages 12-13)
// ============================================================================
const mypYear2Standards: IBIndividualsSocietiesStandard[] = [
  // History - Medieval and Early Modern World
  { notation: 'IB.MYP.M2.IS.HIS.1', strand: 'History', description: 'Analyze the rise and fall of empires and their impact on different regions', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Power' },
  { notation: 'IB.MYP.M2.IS.HIS.2', strand: 'History', description: 'Explain the causes and consequences of major migrations and invasions', assessmentCriterion: 'A', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M2.IS.HIS.3', strand: 'History', description: 'Compare political systems in different medieval societies', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M2.IS.HIS.4', strand: 'History', description: 'Evaluate the reliability and usefulness of historical sources', assessmentCriterion: 'A', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M2.IS.HIS.5', strand: 'History', description: 'Describe the role of religion in shaping medieval societies', assessmentCriterion: 'A', relatedConcept: 'Culture' },
  { notation: 'IB.MYP.M2.IS.HIS.6', strand: 'History', description: 'Analyze the development of trade routes and their impact on cultural exchange', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },

  // Geography - Population and Resources
  { notation: 'IB.MYP.M2.IS.GEO.1', strand: 'Geography', description: 'Analyze population distribution patterns and factors affecting them', assessmentCriterion: 'A', keyConcept: 'Time, Place and Space' },
  { notation: 'IB.MYP.M2.IS.GEO.2', strand: 'Geography', description: 'Explain the causes and effects of human migration', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M2.IS.GEO.3', strand: 'Geography', description: 'Describe the relationship between natural resources and economic development', assessmentCriterion: 'A', relatedConcept: 'Resources' },
  { notation: 'IB.MYP.M2.IS.GEO.4', strand: 'Geography', description: 'Analyze the impact of human activities on the environment', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M2.IS.GEO.5', strand: 'Geography', description: 'Use different types of maps and interpret data from them', assessmentCriterion: 'A' },

  // Economics and Governance
  { notation: 'IB.MYP.M2.IS.ECO.1', strand: 'Economics', description: 'Explain how markets work and the role of supply and demand', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M2.IS.ECO.2', strand: 'Economics', description: 'Describe different economic systems and their characteristics', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M2.IS.POL.1', strand: 'Politics/Governance', description: 'Compare different forms of government and leadership', assessmentCriterion: 'A', relatedConcept: 'Power' },
  { notation: 'IB.MYP.M2.IS.POL.2', strand: 'Politics/Governance', description: 'Explain the concept of rights and responsibilities in society', assessmentCriterion: 'A', relatedConcept: 'Equity' },

  // Investigation Skills
  { notation: 'IB.MYP.M2.IS.INV.1', strand: 'Investigation', description: 'Develop focused research questions that can be investigated', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.IS.INV.2', strand: 'Investigation', description: 'Plan a research methodology using primary and secondary sources', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.IS.INV.3', strand: 'Investigation', description: 'Evaluate the reliability and credibility of sources', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.IS.INV.4', strand: 'Investigation', description: 'Organize and analyze data using appropriate methods', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.IS.INV.5', strand: 'Investigation', description: 'Draw conclusions supported by evidence', assessmentCriterion: 'B' },

  // Communication
  { notation: 'IB.MYP.M2.IS.COM.1', strand: 'Communication', description: 'Present arguments and findings in a structured and coherent manner', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.IS.COM.2', strand: 'Communication', description: 'Use appropriate conventions for academic writing', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.IS.COM.3', strand: 'Communication', description: 'Create and interpret complex maps, graphs, and data visualizations', assessmentCriterion: 'C' },

  // Critical Thinking
  { notation: 'IB.MYP.M2.IS.THK.1', strand: 'Critical Thinking', description: 'Analyze multiple perspectives on historical and contemporary issues', assessmentCriterion: 'D', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M2.IS.THK.2', strand: 'Critical Thinking', description: 'Identify bias and limitations in sources and arguments', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.IS.THK.3', strand: 'Critical Thinking', description: 'Evaluate the significance of events and developments', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.IS.THK.4', strand: 'Critical Thinking', description: 'Propose solutions to local and global challenges', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 3 (Grade 8, Ages 13-14)
// ============================================================================
const mypYear3Standards: IBIndividualsSocietiesStandard[] = [
  // History - Age of Revolutions and Industrialization
  { notation: 'IB.MYP.M3.IS.HIS.1', strand: 'History', description: 'Analyze the causes and consequences of political revolutions', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M3.IS.HIS.2', strand: 'History', description: 'Evaluate the impact of the Industrial Revolution on society and environment', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Innovation' },
  { notation: 'IB.MYP.M3.IS.HIS.3', strand: 'History', description: 'Analyze the development of nationalism and nation-states', assessmentCriterion: 'A', relatedConcept: 'Identity' },
  { notation: 'IB.MYP.M3.IS.HIS.4', strand: 'History', description: 'Explain the causes and effects of imperialism and colonialism', assessmentCriterion: 'A', keyConcept: 'Global Interactions', relatedConcept: 'Power' },
  { notation: 'IB.MYP.M3.IS.HIS.5', strand: 'History', description: 'Compare historiographical interpretations of significant events', assessmentCriterion: 'A', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M3.IS.HIS.6', strand: 'History', description: 'Analyze social movements and their impact on rights and equality', assessmentCriterion: 'A', relatedConcept: 'Equity' },

  // Geography - Urbanization and Development
  { notation: 'IB.MYP.M3.IS.GEO.1', strand: 'Geography', description: 'Analyze patterns and processes of urbanization', assessmentCriterion: 'A', keyConcept: 'Change' },
  { notation: 'IB.MYP.M3.IS.GEO.2', strand: 'Geography', description: 'Evaluate the challenges and opportunities of urban growth', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M3.IS.GEO.3', strand: 'Geography', description: 'Explain global inequalities in development and quality of life', assessmentCriterion: 'A', relatedConcept: 'Equity' },
  { notation: 'IB.MYP.M3.IS.GEO.4', strand: 'Geography', description: 'Analyze the causes and impacts of climate change', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M3.IS.GEO.5', strand: 'Geography', description: 'Evaluate strategies for sustainable development', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },

  // Economics
  { notation: 'IB.MYP.M3.IS.ECO.1', strand: 'Economics', description: 'Analyze the role of government in the economy', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M3.IS.ECO.2', strand: 'Economics', description: 'Explain the causes and consequences of economic growth and recession', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M3.IS.ECO.3', strand: 'Economics', description: 'Analyze global trade patterns and their impact on different countries', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M3.IS.ECO.4', strand: 'Economics', description: 'Evaluate the impact of globalization on economies and cultures', assessmentCriterion: 'A', relatedConcept: 'Globalization' },

  // Politics and Governance
  { notation: 'IB.MYP.M3.IS.POL.1', strand: 'Politics/Governance', description: 'Analyze the development and function of international organizations', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M3.IS.POL.2', strand: 'Politics/Governance', description: 'Evaluate different approaches to conflict resolution and peacekeeping', assessmentCriterion: 'A', relatedConcept: 'Power' },

  // Investigation Skills
  { notation: 'IB.MYP.M3.IS.INV.1', strand: 'Investigation', description: 'Design and conduct independent research investigations', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.IS.INV.2', strand: 'Investigation', description: 'Formulate and justify hypotheses based on prior knowledge', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.IS.INV.3', strand: 'Investigation', description: 'Select and apply appropriate research methods', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.IS.INV.4', strand: 'Investigation', description: 'Analyze quantitative and qualitative data systematically', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.IS.INV.5', strand: 'Investigation', description: 'Evaluate the validity and reliability of research findings', assessmentCriterion: 'B' },

  // Communication
  { notation: 'IB.MYP.M3.IS.COM.1', strand: 'Communication', description: 'Construct well-reasoned arguments supported by evidence', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.IS.COM.2', strand: 'Communication', description: 'Document sources accurately using standard citation formats', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.IS.COM.3', strand: 'Communication', description: 'Use geographic information systems (GIS) and digital tools effectively', assessmentCriterion: 'C' },

  // Critical Thinking
  { notation: 'IB.MYP.M3.IS.THK.1', strand: 'Critical Thinking', description: 'Synthesize information from multiple perspectives to form judgments', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.IS.THK.2', strand: 'Critical Thinking', description: 'Evaluate the long-term consequences of historical decisions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.IS.THK.3', strand: 'Critical Thinking', description: 'Assess the impact of individual and collective actions on global issues', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.IS.THK.4', strand: 'Critical Thinking', description: 'Develop informed positions on contemporary issues', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 4 (Grade 9, Ages 14-15)
// ============================================================================
const mypYear4Standards: IBIndividualsSocietiesStandard[] = [
  // History - 20th Century World
  { notation: 'IB.MYP.M4.IS.HIS.1', strand: 'History', description: 'Analyze the causes, course, and consequences of World War I', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Causality' },
  { notation: 'IB.MYP.M4.IS.HIS.2', strand: 'History', description: 'Evaluate the impact of totalitarian regimes in the 20th century', assessmentCriterion: 'A', relatedConcept: 'Power' },
  { notation: 'IB.MYP.M4.IS.HIS.3', strand: 'History', description: 'Analyze the causes, course, and consequences of World War II', assessmentCriterion: 'A', keyConcept: 'Change' },
  { notation: 'IB.MYP.M4.IS.HIS.4', strand: 'History', description: 'Explain the origins and development of the Cold War', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M4.IS.HIS.5', strand: 'History', description: 'Analyze decolonization movements and their impact', assessmentCriterion: 'A', keyConcept: 'Change', relatedConcept: 'Identity' },
  { notation: 'IB.MYP.M4.IS.HIS.6', strand: 'History', description: 'Evaluate the development of human rights frameworks after WWII', assessmentCriterion: 'A', relatedConcept: 'Equity' },
  { notation: 'IB.MYP.M4.IS.HIS.7', strand: 'History', description: 'Apply historical thinking skills: continuity and change, cause and consequence', assessmentCriterion: 'A' },

  // Geography - Global Issues
  { notation: 'IB.MYP.M4.IS.GEO.1', strand: 'Geography', description: 'Analyze global patterns of resource consumption and distribution', assessmentCriterion: 'A', relatedConcept: 'Resources' },
  { notation: 'IB.MYP.M4.IS.GEO.2', strand: 'Geography', description: 'Evaluate the environmental and social impacts of energy production', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M4.IS.GEO.3', strand: 'Geography', description: 'Analyze global food security challenges and solutions', assessmentCriterion: 'A', relatedConcept: 'Resources' },
  { notation: 'IB.MYP.M4.IS.GEO.4', strand: 'Geography', description: 'Evaluate responses to natural hazards at different scales', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M4.IS.GEO.5', strand: 'Geography', description: 'Analyze the geography of health and disease', assessmentCriterion: 'A' },

  // Economics
  { notation: 'IB.MYP.M4.IS.ECO.1', strand: 'Economics', description: 'Analyze market structures and their effects on consumers and producers', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M4.IS.ECO.2', strand: 'Economics', description: 'Evaluate fiscal and monetary policies and their impacts', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M4.IS.ECO.3', strand: 'Economics', description: 'Analyze causes and consequences of income inequality', assessmentCriterion: 'A', relatedConcept: 'Equity' },
  { notation: 'IB.MYP.M4.IS.ECO.4', strand: 'Economics', description: 'Evaluate the economic impacts of international trade agreements', assessmentCriterion: 'A', relatedConcept: 'Globalization' },

  // Politics and Global Issues
  { notation: 'IB.MYP.M4.IS.POL.1', strand: 'Politics/Governance', description: 'Analyze the structure and function of the United Nations', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M4.IS.POL.2', strand: 'Politics/Governance', description: 'Evaluate responses to global challenges: terrorism, migration, climate change', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.IS.POL.3', strand: 'Politics/Governance', description: 'Analyze the role of media and technology in political processes', assessmentCriterion: 'A', relatedConcept: 'Innovation' },

  // Investigation Skills
  { notation: 'IB.MYP.M4.IS.INV.1', strand: 'Investigation', description: 'Design complex research investigations with clear methodology', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.IS.INV.2', strand: 'Investigation', description: 'Evaluate sources critically for origin, purpose, and limitations', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.IS.INV.3', strand: 'Investigation', description: 'Apply appropriate analytical frameworks to data', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.IS.INV.4', strand: 'Investigation', description: 'Synthesize findings to draw well-supported conclusions', assessmentCriterion: 'B' },

  // Communication
  { notation: 'IB.MYP.M4.IS.COM.1', strand: 'Communication', description: 'Construct sophisticated arguments with nuanced analysis', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.IS.COM.2', strand: 'Communication', description: 'Integrate visual and textual evidence effectively', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.IS.COM.3', strand: 'Communication', description: 'Adapt communication style for different audiences and purposes', assessmentCriterion: 'C' },

  // Critical Thinking
  { notation: 'IB.MYP.M4.IS.THK.1', strand: 'Critical Thinking', description: 'Evaluate competing interpretations and historiographical debates', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.IS.THK.2', strand: 'Critical Thinking', description: 'Assess the ethical dimensions of historical and contemporary issues', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.IS.THK.3', strand: 'Critical Thinking', description: 'Formulate evidence-based predictions about future developments', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.IS.THK.4', strand: 'Critical Thinking', description: 'Propose and justify solutions to complex global problems', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 5 (Grade 10, Ages 15-16) - Preparation for DP/eAssessment
// ============================================================================
const mypYear5Standards: IBIndividualsSocietiesStandard[] = [
  // History - Contemporary World History
  { notation: 'IB.MYP.M5.IS.HIS.1', strand: 'History', description: 'Analyze the end of the Cold War and emergence of new world order', assessmentCriterion: 'A', keyConcept: 'Change' },
  { notation: 'IB.MYP.M5.IS.HIS.2', strand: 'History', description: 'Evaluate the impact of globalization on identities and cultures', assessmentCriterion: 'A', relatedConcept: 'Globalization' },
  { notation: 'IB.MYP.M5.IS.HIS.3', strand: 'History', description: 'Analyze contemporary conflicts and peace processes', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M5.IS.HIS.4', strand: 'History', description: 'Evaluate the effectiveness of historical methodology in understanding the past', assessmentCriterion: 'A', relatedConcept: 'Perspective' },
  { notation: 'IB.MYP.M5.IS.HIS.5', strand: 'History', description: 'Synthesize multiple sources to construct historical arguments', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.IS.HIS.6', strand: 'History', description: 'Analyze the role of significant individuals in shaping history', assessmentCriterion: 'A', relatedConcept: 'Power' },

  // Geography - Global Systems and Sustainability
  { notation: 'IB.MYP.M5.IS.GEO.1', strand: 'Geography', description: 'Analyze the interconnections within global environmental systems', assessmentCriterion: 'A', keyConcept: 'Systems' },
  { notation: 'IB.MYP.M5.IS.GEO.2', strand: 'Geography', description: 'Evaluate international responses to environmental challenges', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M5.IS.GEO.3', strand: 'Geography', description: 'Analyze patterns of global inequality and development', assessmentCriterion: 'A', relatedConcept: 'Equity' },
  { notation: 'IB.MYP.M5.IS.GEO.4', strand: 'Geography', description: 'Evaluate the Sustainable Development Goals and progress toward them', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M5.IS.GEO.5', strand: 'Geography', description: 'Apply geographic concepts and tools to analyze complex spatial problems', assessmentCriterion: 'A' },

  // Economics - Global Economics
  { notation: 'IB.MYP.M5.IS.ECO.1', strand: 'Economics', description: 'Analyze the causes and effects of economic crises', assessmentCriterion: 'A', keyConcept: 'Change' },
  { notation: 'IB.MYP.M5.IS.ECO.2', strand: 'Economics', description: 'Evaluate the role of international economic institutions (IMF, World Bank, WTO)', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M5.IS.ECO.3', strand: 'Economics', description: 'Analyze the economics of sustainable development', assessmentCriterion: 'A', relatedConcept: 'Sustainability' },
  { notation: 'IB.MYP.M5.IS.ECO.4', strand: 'Economics', description: 'Evaluate different economic models and their effectiveness', assessmentCriterion: 'A', keyConcept: 'Systems' },

  // Politics and Global Governance
  { notation: 'IB.MYP.M5.IS.POL.1', strand: 'Politics/Governance', description: 'Analyze challenges to global governance in the 21st century', assessmentCriterion: 'A', keyConcept: 'Global Interactions' },
  { notation: 'IB.MYP.M5.IS.POL.2', strand: 'Politics/Governance', description: 'Evaluate the effectiveness of international law and human rights frameworks', assessmentCriterion: 'A', relatedConcept: 'Equity' },
  { notation: 'IB.MYP.M5.IS.POL.3', strand: 'Politics/Governance', description: 'Analyze the impact of non-state actors on global politics', assessmentCriterion: 'A', relatedConcept: 'Power' },

  // Investigation Skills - Advanced
  { notation: 'IB.MYP.M5.IS.INV.1', strand: 'Investigation', description: 'Design and conduct extended research investigations independently', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.IS.INV.2', strand: 'Investigation', description: 'Critically evaluate research methodologies and their limitations', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.IS.INV.3', strand: 'Investigation', description: 'Apply interdisciplinary approaches to complex investigations', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.IS.INV.4', strand: 'Investigation', description: 'Reflect on the process and validity of research findings', assessmentCriterion: 'B' },

  // Communication - Academic Level
  { notation: 'IB.MYP.M5.IS.COM.1', strand: 'Communication', description: 'Construct extended academic arguments meeting disciplinary standards', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.IS.COM.2', strand: 'Communication', description: 'Synthesize information from diverse sources coherently', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.IS.COM.3', strand: 'Communication', description: 'Use discipline-specific formats and conventions accurately', assessmentCriterion: 'C' },

  // Critical Thinking - Advanced
  { notation: 'IB.MYP.M5.IS.THK.1', strand: 'Critical Thinking', description: 'Evaluate the limitations of knowledge in individuals and societies', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.IS.THK.2', strand: 'Critical Thinking', description: 'Analyze the relationship between knowledge and power', assessmentCriterion: 'D', relatedConcept: 'Power' },
  { notation: 'IB.MYP.M5.IS.THK.3', strand: 'Critical Thinking', description: 'Formulate and defend positions on controversial issues', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.IS.THK.4', strand: 'Critical Thinking', description: 'Evaluate own thinking processes and biases', assessmentCriterion: 'D', relatedConcept: 'Perspective' },
];

// ============================================================================
// DP YEAR 1 (Grade 11, Ages 16-17) - History, Geography, Economics
// ============================================================================
const dpYear1Standards: IBIndividualsSocietiesStandard[] = [
  // DP History - Prescribed Subjects and World History Topics
  { notation: 'IB.DP.DP1.IS.HIS.1', strand: 'History - Methods', description: 'Apply the historical concepts of causation, consequence, continuity, and change', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.HIS.2', strand: 'History - Methods', description: 'Evaluate the value and limitations of sources for historians', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.HIS.3', strand: 'History - Methods', description: 'Analyze perspectives and interpretations in historical sources', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.HIS.4', strand: 'History - Methods', description: 'Understand and apply historiographical concepts and debates', assessmentCriterion: 'A' },

  // World History Topics
  { notation: 'IB.DP.DP1.IS.WH.1', strand: 'World History', description: 'Analyze the causes, practices, and effects of 20th century wars', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.WH.2', strand: 'World History', description: 'Evaluate the rise and rule of authoritarian states', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.WH.3', strand: 'World History', description: 'Analyze independence movements and their impact', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.WH.4', strand: 'World History', description: 'Evaluate the Cold War: superpower tensions and their effects', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.WH.5', strand: 'World History', description: 'Analyze rights and protest movements in the 20th century', assessmentCriterion: 'A' },

  // DP Geography - Core Themes
  { notation: 'IB.DP.DP1.IS.GEO.1', strand: 'Geography - Population', description: 'Analyze population dynamics and demographic transitions', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.GEO.2', strand: 'Geography - Population', description: 'Evaluate the causes and consequences of migration', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.GEO.3', strand: 'Geography - Disparities', description: 'Analyze the nature and measurement of global disparities', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.GEO.4', strand: 'Geography - Disparities', description: 'Evaluate strategies to reduce disparities', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.GEO.5', strand: 'Geography - Freshwater', description: 'Analyze freshwater drainage basin hydrology and water scarcity', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.GEO.6', strand: 'Geography - Freshwater', description: 'Evaluate water management strategies', assessmentCriterion: 'A' },

  // DP Economics - Microeconomics
  { notation: 'IB.DP.DP1.IS.MIC.1', strand: 'Microeconomics', description: 'Analyze the nature and operation of competitive markets', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MIC.2', strand: 'Microeconomics', description: 'Apply elasticity concepts to analyze market behavior', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MIC.3', strand: 'Microeconomics', description: 'Analyze government intervention in markets', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MIC.4', strand: 'Microeconomics', description: 'Evaluate market failure and government responses', assessmentCriterion: 'A' },

  // DP Economics - Macroeconomics
  { notation: 'IB.DP.DP1.IS.MAC.1', strand: 'Macroeconomics', description: 'Analyze the measurement of economic activity', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MAC.2', strand: 'Macroeconomics', description: 'Explain aggregate demand and aggregate supply', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MAC.3', strand: 'Macroeconomics', description: 'Analyze macroeconomic objectives and conflicts', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP1.IS.MAC.4', strand: 'Macroeconomics', description: 'Evaluate fiscal and monetary policies', assessmentCriterion: 'A' },

  // Internal Assessment Skills
  { notation: 'IB.DP.DP1.IS.IA.1', strand: 'Internal Assessment', description: 'Identify and plan historical investigations meeting IA requirements', assessmentCriterion: 'B' },
  { notation: 'IB.DP.DP1.IS.IA.2', strand: 'Internal Assessment', description: 'Conduct geographic fieldwork using appropriate methodologies', assessmentCriterion: 'B' },
  { notation: 'IB.DP.DP1.IS.IA.3', strand: 'Internal Assessment', description: 'Apply economic theory to real-world case studies', assessmentCriterion: 'B' },
  { notation: 'IB.DP.DP1.IS.IA.4', strand: 'Internal Assessment', description: 'Document research processes and maintain academic integrity', assessmentCriterion: 'B' },
];

// ============================================================================
// DP YEAR 2 (Grade 12, Ages 17-18) - History, Geography, Economics + HL
// ============================================================================
const dpYear2Standards: IBIndividualsSocietiesStandard[] = [
  // DP History - Depth Studies and HL
  { notation: 'IB.DP.DP2.IS.HIS.1', strand: 'History - Depth Study', description: 'Conduct in-depth analysis of regional or thematic historical topics', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.HIS.2', strand: 'History - Depth Study', description: 'Integrate primary and secondary sources in historical analysis', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.HIS.3', strand: 'History - HL', description: 'Analyze themes in world history across different regions and time periods', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.HIS.4', strand: 'History - HL', description: 'Evaluate historiographical debates on major historical questions', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.HIS.5', strand: 'History - HL', description: 'Construct extended historical arguments with sophisticated analysis', assessmentCriterion: 'A', isHL: true },

  // World History - Additional Topics
  { notation: 'IB.DP.DP2.IS.WH.1', strand: 'World History', description: 'Analyze society and economy in different historical periods', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.WH.2', strand: 'World History', description: 'Evaluate technology and industrialization as drivers of change', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.WH.3', strand: 'World History', description: 'Analyze evolution of political systems across regions', assessmentCriterion: 'A' },

  // DP Geography - Optional Themes and HL
  { notation: 'IB.DP.DP2.IS.GEO.1', strand: 'Geography - Oceans', description: 'Analyze ocean-atmosphere interactions and their global impacts', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.GEO.2', strand: 'Geography - Leisure', description: 'Evaluate the geography of tourism and leisure', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.GEO.3', strand: 'Geography - Food', description: 'Analyze global food production systems and food security', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.GEO.4', strand: 'Geography - Urban', description: 'Evaluate urban environments and sustainable urban development', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.GLO.1', strand: 'Geography - HL Global Interactions', description: 'Analyze power, places, and networks in global interactions', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.GLO.2', strand: 'Geography - HL Global Interactions', description: 'Evaluate human development and diversity at global scale', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.GLO.3', strand: 'Geography - HL Global Interactions', description: 'Analyze global risks and resilience', assessmentCriterion: 'A', isHL: true },

  // DP Economics - International and Development
  { notation: 'IB.DP.DP2.IS.INT.1', strand: 'International Economics', description: 'Analyze free trade, protectionism, and trade agreements', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.INT.2', strand: 'International Economics', description: 'Evaluate exchange rates and the balance of payments', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.INT.3', strand: 'International Economics', description: 'Analyze economic integration and trading blocs', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.DEV.1', strand: 'Development Economics', description: 'Analyze economic development and its measurement', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.DEV.2', strand: 'Development Economics', description: 'Evaluate barriers to and strategies for development', assessmentCriterion: 'A' },
  { notation: 'IB.DP.DP2.IS.DEV.3', strand: 'Development Economics', description: 'Analyze the role of international institutions in development', assessmentCriterion: 'A' },

  // DP Economics - HL Extensions
  { notation: 'IB.DP.DP2.IS.ECO.HL1', strand: 'Economics - HL', description: 'Apply quantitative techniques in economic analysis', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.ECO.HL2', strand: 'Economics - HL', description: 'Analyze theory of the firm and market structures', assessmentCriterion: 'A', isHL: true },
  { notation: 'IB.DP.DP2.IS.ECO.HL3', strand: 'Economics - HL', description: 'Evaluate macroeconomic models using quantitative data', assessmentCriterion: 'A', isHL: true },

  // Internal Assessment - Final
  { notation: 'IB.DP.DP2.IS.IA.1', strand: 'Internal Assessment', description: 'Complete historical investigation (2,200 words) demonstrating source evaluation', assessmentCriterion: 'B' },
  { notation: 'IB.DP.DP2.IS.IA.2', strand: 'Internal Assessment', description: 'Complete geographic fieldwork report (2,500 words) with data analysis', assessmentCriterion: 'B' },
  { notation: 'IB.DP.DP2.IS.IA.3', strand: 'Internal Assessment', description: 'Complete economics portfolio (3 commentaries, 750 words each)', assessmentCriterion: 'B' },

  // Extended Essay (if choosing Group 3)
  { notation: 'IB.DP.DP2.IS.EE.1', strand: 'Extended Essay', description: 'Formulate focused research questions for extended essay in Group 3 subjects', assessmentCriterion: 'C' },
  { notation: 'IB.DP.DP2.IS.EE.2', strand: 'Extended Essay', description: 'Conduct independent research meeting academic standards (4,000 words)', assessmentCriterion: 'C' },
];

// ============================================================================
// EXPORT YEAR DATA
// ============================================================================
export const ibIndividualsSocietiesYears: IBIndividualsSocietiesYear[] = [
  {
    year: 'M1',
    yearLabel: 'MYP Year 1',
    gradeEquivalent: 'Grade 6',
    ageRangeMin: 11,
    ageRangeMax: 12,
    programme: 'MYP',
    standards: mypYear1Standards,
  },
  {
    year: 'M2',
    yearLabel: 'MYP Year 2',
    gradeEquivalent: 'Grade 7',
    ageRangeMin: 12,
    ageRangeMax: 13,
    programme: 'MYP',
    standards: mypYear2Standards,
  },
  {
    year: 'M3',
    yearLabel: 'MYP Year 3',
    gradeEquivalent: 'Grade 8',
    ageRangeMin: 13,
    ageRangeMax: 14,
    programme: 'MYP',
    standards: mypYear3Standards,
  },
  {
    year: 'M4',
    yearLabel: 'MYP Year 4',
    gradeEquivalent: 'Grade 9',
    ageRangeMin: 14,
    ageRangeMax: 15,
    programme: 'MYP',
    standards: mypYear4Standards,
  },
  {
    year: 'M5',
    yearLabel: 'MYP Year 5',
    gradeEquivalent: 'Grade 10',
    ageRangeMin: 15,
    ageRangeMax: 16,
    programme: 'MYP',
    standards: mypYear5Standards,
  },
  {
    year: 'DP1',
    yearLabel: 'DP Year 1',
    gradeEquivalent: 'Grade 11',
    ageRangeMin: 16,
    ageRangeMax: 17,
    programme: 'DP',
    standards: dpYear1Standards,
  },
  {
    year: 'DP2',
    yearLabel: 'DP Year 2',
    gradeEquivalent: 'Grade 12',
    ageRangeMin: 17,
    ageRangeMax: 18,
    programme: 'DP',
    standards: dpYear2Standards,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all standards for a specific year
 */
export function getIndividualsSocietiesStandardsByYear(year: string): IBIndividualsSocietiesStandard[] {
  const yearData = ibIndividualsSocietiesYears.find(y => y.year === year);
  return yearData?.standards || [];
}

/**
 * Get all standards across all years
 */
export function getAllIndividualsSocietiesStandards(): IBIndividualsSocietiesStandard[] {
  return ibIndividualsSocietiesYears.flatMap(y => y.standards);
}

/**
 * Get standards by programme (MYP or DP)
 */
export function getIndividualsSocietiesStandardsByProgramme(programme: 'MYP' | 'DP'): IBIndividualsSocietiesStandard[] {
  return ibIndividualsSocietiesYears
    .filter(y => y.programme === programme)
    .flatMap(y => y.standards);
}

/**
 * Get standards by strand (History, Geography, Economics, etc.)
 */
export function getIndividualsSocietiesStandardsByStrand(strand: string): IBIndividualsSocietiesStandard[] {
  return getAllIndividualsSocietiesStandards().filter(s =>
    s.strand.toLowerCase().includes(strand.toLowerCase())
  );
}

/**
 * Get HL-only standards
 */
export function getIndividualsSocietiesHLStandards(): IBIndividualsSocietiesStandard[] {
  return getAllIndividualsSocietiesStandards().filter(s => s.isHL);
}

/**
 * Get standards by assessment criterion
 */
export function getIndividualsSocietiesStandardsByCriterion(criterion: 'A' | 'B' | 'C' | 'D'): IBIndividualsSocietiesStandard[] {
  return getAllIndividualsSocietiesStandards().filter(s => s.assessmentCriterion === criterion);
}

/**
 * Get total count of standards
 */
export function getIndividualsSocietiesStandardsCount(): number {
  return getAllIndividualsSocietiesStandards().length;
}

/**
 * Export for curriculum system
 */
export default {
  years: ibIndividualsSocietiesYears,
  getStandardsByYear: getIndividualsSocietiesStandardsByYear,
  getAllStandards: getAllIndividualsSocietiesStandards,
  getStandardsByProgramme: getIndividualsSocietiesStandardsByProgramme,
  getStandardsByStrand: getIndividualsSocietiesStandardsByStrand,
  getHLStandards: getIndividualsSocietiesHLStandards,
  getStandardsByCriterion: getIndividualsSocietiesStandardsByCriterion,
  getStandardsCount: getIndividualsSocietiesStandardsCount,
};
