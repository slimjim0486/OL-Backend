/**
 * IB Middle Years Programme (MYP) & Diploma Programme (DP) - Sciences
 * Grades 6-12 (Ages 11-18)
 *
 * Official Source: IB MYP Sciences Guide (2014) & DP Sciences Guides (2023)
 * https://www.ibo.org/programmes/middle-years-programme/curriculum/science/
 * https://www.ibo.org/programmes/diploma-programme/curriculum/sciences/
 *
 * Structure:
 * - MYP Years 1-5 (Grades 6-10, Ages 11-16): Integrated sciences or discrete courses
 * - DP Years 1-2 (Grades 11-12, Ages 16-18): Biology, Chemistry, Physics (SL/HL)
 *
 * Notation System: IB.{programme}.{year}.SC.{discipline}.{number}
 * - Programme: MYP or DP
 * - Year: Y1-Y5 for MYP, Y1-Y2 for DP
 * - SC = Science
 * - Discipline codes: BIO (Biology), CHM (Chemistry), PHY (Physics), INT (Integrated)
 */

export interface IBMYPDPScienceStandard {
  notation: string;
  discipline: string;
  topic: string;
  level?: 'standard' | 'SL' | 'HL';
  description: string;
  assessmentCriteria?: string[];
}

export interface IBMYPDPScienceYear {
  year: number;
  grade: number;
  programme: 'MYP' | 'DP';
  yearLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: IBMYPDPScienceStandard[];
}

export interface IBMYPDPScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  years: IBMYPDPScienceYear[];
}

// =============================================================================
// MYP ASSESSMENT CRITERIA
// =============================================================================
// Criterion A: Knowing and understanding
// Criterion B: Inquiring and designing
// Criterion C: Processing and evaluating
// Criterion D: Reflecting on the impacts of science

// =============================================================================
// MYP YEAR 4 (Grade 9, Ages 14-15)
// =============================================================================

const mypYear4ScienceStandards: IBMYPDPScienceStandard[] = [
  // BIOLOGY
  {
    notation: 'IB.MYP.Y4.SC.BIO.1',
    discipline: 'Biology',
    topic: 'Cells and Organization',
    description: 'Analyze cell structure and function, including specialized cells and tissues',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.BIO.2',
    discipline: 'Biology',
    topic: 'Cell Division',
    description: 'Understand mitosis and meiosis and their significance for growth and reproduction',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.SC.BIO.3',
    discipline: 'Biology',
    topic: 'Genetics and Inheritance',
    description: 'Apply Mendelian genetics to predict inheritance patterns',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.BIO.4',
    discipline: 'Biology',
    topic: 'DNA and Protein Synthesis',
    description: 'Understand DNA structure and the process of protein synthesis',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.BIO.5',
    discipline: 'Biology',
    topic: 'Evolution',
    description: 'Explain natural selection and evidence for evolution',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.SC.BIO.6',
    discipline: 'Biology',
    topic: 'Ecosystems',
    description: 'Analyze energy flow and nutrient cycling in ecosystems',
    assessmentCriteria: ['A', 'D'],
  },

  // CHEMISTRY
  {
    notation: 'IB.MYP.Y4.SC.CHM.1',
    discipline: 'Chemistry',
    topic: 'Atomic Structure',
    description: 'Describe atomic structure including electron configuration',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.CHM.2',
    discipline: 'Chemistry',
    topic: 'Periodic Table',
    description: 'Use the periodic table to predict element properties and trends',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.CHM.3',
    discipline: 'Chemistry',
    topic: 'Chemical Bonding',
    description: 'Explain ionic, covalent, and metallic bonding',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.CHM.4',
    discipline: 'Chemistry',
    topic: 'Chemical Reactions',
    description: 'Balance chemical equations and identify reaction types',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.CHM.5',
    discipline: 'Chemistry',
    topic: 'Stoichiometry',
    description: 'Perform stoichiometric calculations using moles',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.CHM.6',
    discipline: 'Chemistry',
    topic: 'Acids and Bases',
    description: 'Understand pH scale and neutralization reactions',
    assessmentCriteria: ['A', 'B'],
  },

  // PHYSICS
  {
    notation: 'IB.MYP.Y4.SC.PHY.1',
    discipline: 'Physics',
    topic: 'Motion and Forces',
    description: 'Apply Newton\'s laws to analyze motion and forces',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.PHY.2',
    discipline: 'Physics',
    topic: 'Energy',
    description: 'Calculate kinetic, potential, and thermal energy and energy transfers',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.PHY.3',
    discipline: 'Physics',
    topic: 'Waves',
    description: 'Describe wave properties and behavior including reflection and refraction',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.PHY.4',
    discipline: 'Physics',
    topic: 'Electricity',
    description: 'Analyze electric circuits using Ohm\'s law and circuit diagrams',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.SC.PHY.5',
    discipline: 'Physics',
    topic: 'Magnetism',
    description: 'Understand magnetic fields and electromagnetism',
    assessmentCriteria: ['A', 'D'],
  },

  // INTEGRATED INQUIRY
  {
    notation: 'IB.MYP.Y4.SC.INT.1',
    discipline: 'Integrated Sciences',
    topic: 'Scientific Investigation',
    description: 'Design and conduct controlled experiments with appropriate variables',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.INT.2',
    discipline: 'Integrated Sciences',
    topic: 'Data Analysis',
    description: 'Process data using appropriate statistical methods and graphing',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y4.SC.INT.3',
    discipline: 'Integrated Sciences',
    topic: 'Science and Society',
    description: 'Evaluate the ethical and social implications of scientific developments',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// MYP YEAR 5 (Grade 10, Ages 15-16)
// =============================================================================

const mypYear5ScienceStandards: IBMYPDPScienceStandard[] = [
  // BIOLOGY
  {
    notation: 'IB.MYP.Y5.SC.BIO.1',
    discipline: 'Biology',
    topic: 'Metabolism',
    description: 'Explain photosynthesis and cellular respiration as metabolic processes',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.SC.BIO.2',
    discipline: 'Biology',
    topic: 'Human Physiology',
    description: 'Analyze the structure and function of human organ systems',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.BIO.3',
    discipline: 'Biology',
    topic: 'Homeostasis',
    description: 'Understand feedback mechanisms that maintain internal balance',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.SC.BIO.4',
    discipline: 'Biology',
    topic: 'Biotechnology',
    description: 'Evaluate applications of genetic engineering and biotechnology',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.SC.BIO.5',
    discipline: 'Biology',
    topic: 'Ecology and Conservation',
    description: 'Analyze human impacts on ecosystems and conservation strategies',
    assessmentCriteria: ['C', 'D'],
  },

  // CHEMISTRY
  {
    notation: 'IB.MYP.Y5.SC.CHM.1',
    discipline: 'Chemistry',
    topic: 'Reaction Rates',
    description: 'Investigate factors affecting reaction rates and collision theory',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.SC.CHM.2',
    discipline: 'Chemistry',
    topic: 'Equilibrium',
    description: 'Understand chemical equilibrium and Le Chatelier\'s principle',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.CHM.3',
    discipline: 'Chemistry',
    topic: 'Organic Chemistry',
    description: 'Identify functional groups and name organic compounds',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.CHM.4',
    discipline: 'Chemistry',
    topic: 'Redox Reactions',
    description: 'Identify oxidation and reduction in chemical reactions',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.SC.CHM.5',
    discipline: 'Chemistry',
    topic: 'Thermochemistry',
    description: 'Calculate enthalpy changes in chemical reactions',
    assessmentCriteria: ['A', 'C'],
  },

  // PHYSICS
  {
    notation: 'IB.MYP.Y5.SC.PHY.1',
    discipline: 'Physics',
    topic: 'Kinematics',
    description: 'Analyze motion using displacement, velocity, and acceleration',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.SC.PHY.2',
    discipline: 'Physics',
    topic: 'Momentum',
    description: 'Apply conservation of momentum to collisions and explosions',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.PHY.3',
    discipline: 'Physics',
    topic: 'Thermal Physics',
    description: 'Understand heat transfer and thermodynamic processes',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.SC.PHY.4',
    discipline: 'Physics',
    topic: 'Nuclear Physics',
    description: 'Describe radioactive decay and nuclear reactions',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.SC.PHY.5',
    discipline: 'Physics',
    topic: 'Electromagnetic Spectrum',
    description: 'Analyze properties and applications of electromagnetic radiation',
    assessmentCriteria: ['A', 'D'],
  },

  // INTEGRATED INQUIRY
  {
    notation: 'IB.MYP.Y5.SC.INT.1',
    discipline: 'Integrated Sciences',
    topic: 'Extended Investigation',
    description: 'Plan and execute a comprehensive scientific investigation',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.INT.2',
    discipline: 'Integrated Sciences',
    topic: 'Scientific Communication',
    description: 'Communicate scientific findings using appropriate conventions',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y5.SC.INT.3',
    discipline: 'Integrated Sciences',
    topic: 'Global Scientific Issues',
    description: 'Evaluate global challenges through a scientific lens',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// DP YEAR 1 (Grade 11, Ages 16-17)
// =============================================================================

const dpYear1ScienceStandards: IBMYPDPScienceStandard[] = [
  // BIOLOGY SL/HL
  {
    notation: 'IB.DP.Y1.SC.BIO.1',
    discipline: 'Biology',
    topic: 'Cell Biology',
    level: 'SL',
    description: 'Analyze cell structure, membrane transport, and cell division',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.2',
    discipline: 'Biology',
    topic: 'Molecular Biology',
    level: 'SL',
    description: 'Understand DNA replication, transcription, and translation',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.3',
    discipline: 'Biology',
    topic: 'Genetics',
    level: 'SL',
    description: 'Apply Mendelian genetics and understand chromosomal inheritance',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.4',
    discipline: 'Biology',
    topic: 'Ecology',
    level: 'SL',
    description: 'Analyze species interactions, energy flow, and carbon cycling',
    assessmentCriteria: ['Knowledge', 'Evaluation'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.5',
    discipline: 'Biology',
    topic: 'Evolution and Biodiversity',
    level: 'SL',
    description: 'Explain mechanisms of evolution and classification of organisms',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.6',
    discipline: 'Biology',
    topic: 'Nucleic Acids (HL)',
    level: 'HL',
    description: 'Analyze advanced DNA structure and gene expression regulation',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.BIO.7',
    discipline: 'Biology',
    topic: 'Metabolism (HL)',
    level: 'HL',
    description: 'Understand detailed pathways of photosynthesis and respiration',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },

  // CHEMISTRY SL/HL
  {
    notation: 'IB.DP.Y1.SC.CHM.1',
    discipline: 'Chemistry',
    topic: 'Stoichiometric Relationships',
    level: 'SL',
    description: 'Apply mole concept and perform stoichiometric calculations',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.2',
    discipline: 'Chemistry',
    topic: 'Atomic Structure',
    level: 'SL',
    description: 'Describe atomic structure and electron configuration',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.3',
    discipline: 'Chemistry',
    topic: 'Periodicity',
    level: 'SL',
    description: 'Explain periodic trends in physical and chemical properties',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.4',
    discipline: 'Chemistry',
    topic: 'Chemical Bonding',
    level: 'SL',
    description: 'Analyze bonding and molecular structure using VSEPR theory',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.5',
    discipline: 'Chemistry',
    topic: 'Energetics',
    level: 'SL',
    description: 'Calculate enthalpy changes and apply Hess\'s law',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.6',
    discipline: 'Chemistry',
    topic: 'Chemical Kinetics',
    level: 'SL',
    description: 'Analyze factors affecting reaction rates',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.CHM.7',
    discipline: 'Chemistry',
    topic: 'Atomic Structure (HL)',
    level: 'HL',
    description: 'Analyze quantum mechanics and orbital theory in detail',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },

  // PHYSICS SL/HL
  {
    notation: 'IB.DP.Y1.SC.PHY.1',
    discipline: 'Physics',
    topic: 'Measurements and Uncertainties',
    level: 'SL',
    description: 'Apply significant figures, uncertainties, and error analysis',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.PHY.2',
    discipline: 'Physics',
    topic: 'Mechanics',
    level: 'SL',
    description: 'Analyze motion, forces, and energy using kinematics and dynamics',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.PHY.3',
    discipline: 'Physics',
    topic: 'Thermal Physics',
    level: 'SL',
    description: 'Apply thermal concepts and the kinetic model of gases',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y1.SC.PHY.4',
    discipline: 'Physics',
    topic: 'Waves',
    level: 'SL',
    description: 'Analyze wave behavior, sound, and light',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.PHY.5',
    discipline: 'Physics',
    topic: 'Electricity and Magnetism',
    level: 'SL',
    description: 'Analyze electric circuits and magnetic fields',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y1.SC.PHY.6',
    discipline: 'Physics',
    topic: 'Mechanics (HL)',
    level: 'HL',
    description: 'Analyze circular motion, gravitation, and rotational dynamics',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
];

// =============================================================================
// DP YEAR 2 (Grade 12, Ages 17-18)
// =============================================================================

const dpYear2ScienceStandards: IBMYPDPScienceStandard[] = [
  // BIOLOGY SL/HL
  {
    notation: 'IB.DP.Y2.SC.BIO.1',
    discipline: 'Biology',
    topic: 'Human Physiology',
    level: 'SL',
    description: 'Analyze digestion, circulatory, immune, and nervous systems',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.BIO.2',
    discipline: 'Biology',
    topic: 'Plant Biology (HL)',
    level: 'HL',
    description: 'Analyze plant structure, transport, and reproduction',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y2.SC.BIO.3',
    discipline: 'Biology',
    topic: 'Genetics (HL)',
    level: 'HL',
    description: 'Analyze gene pools, evolution, and human genetic conditions',
    assessmentCriteria: ['Knowledge', 'Evaluation'],
  },
  {
    notation: 'IB.DP.Y2.SC.BIO.4',
    discipline: 'Biology',
    topic: 'Animal Physiology (HL)',
    level: 'HL',
    description: 'Analyze antibody production, movement, and neural function',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },

  // CHEMISTRY SL/HL
  {
    notation: 'IB.DP.Y2.SC.CHM.1',
    discipline: 'Chemistry',
    topic: 'Equilibrium',
    level: 'SL',
    description: 'Apply equilibrium concepts and Le Chatelier\'s principle',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.CHM.2',
    discipline: 'Chemistry',
    topic: 'Acids and Bases',
    level: 'SL',
    description: 'Analyze acid-base equilibria and buffer solutions',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.CHM.3',
    discipline: 'Chemistry',
    topic: 'Redox Processes',
    level: 'SL',
    description: 'Analyze electrochemical cells and electrode potentials',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y2.SC.CHM.4',
    discipline: 'Chemistry',
    topic: 'Organic Chemistry',
    level: 'SL',
    description: 'Analyze organic molecules, reactions, and reaction mechanisms',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.CHM.5',
    discipline: 'Chemistry',
    topic: 'Spectroscopy (HL)',
    level: 'HL',
    description: 'Apply spectroscopic techniques to identify organic compounds',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y2.SC.CHM.6',
    discipline: 'Chemistry',
    topic: 'Acids and Bases (HL)',
    level: 'HL',
    description: 'Calculate pH using Ka and Kb and analyze buffer capacity',
    assessmentCriteria: ['Knowledge', 'Application'],
  },

  // PHYSICS SL/HL
  {
    notation: 'IB.DP.Y2.SC.PHY.1',
    discipline: 'Physics',
    topic: 'Circular Motion',
    level: 'SL',
    description: 'Analyze circular motion and gravitation',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.PHY.2',
    discipline: 'Physics',
    topic: 'Atomic and Nuclear Physics',
    level: 'SL',
    description: 'Analyze atomic structure, radioactivity, and nuclear reactions',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y2.SC.PHY.3',
    discipline: 'Physics',
    topic: 'Energy Production',
    level: 'SL',
    description: 'Analyze energy sources and thermal energy transfer',
    assessmentCriteria: ['Knowledge', 'Evaluation'],
  },
  {
    notation: 'IB.DP.Y2.SC.PHY.4',
    discipline: 'Physics',
    topic: 'Wave Phenomena (HL)',
    level: 'HL',
    description: 'Analyze interference, diffraction, and resolution',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },
  {
    notation: 'IB.DP.Y2.SC.PHY.5',
    discipline: 'Physics',
    topic: 'Electromagnetic Induction (HL)',
    level: 'HL',
    description: 'Analyze electromagnetic induction and alternating current',
    assessmentCriteria: ['Knowledge', 'Application'],
  },
  {
    notation: 'IB.DP.Y2.SC.PHY.6',
    discipline: 'Physics',
    topic: 'Quantum Physics (HL)',
    level: 'HL',
    description: 'Analyze photoelectric effect, wave-particle duality, and atomic spectra',
    assessmentCriteria: ['Knowledge', 'Analysis'],
  },

  // INTERNAL ASSESSMENT
  {
    notation: 'IB.DP.Y2.SC.INT.1',
    discipline: 'All Sciences',
    topic: 'Internal Assessment',
    level: 'SL',
    description: 'Complete an independent scientific investigation',
    assessmentCriteria: ['Exploration', 'Analysis', 'Evaluation', 'Communication'],
  },
  {
    notation: 'IB.DP.Y2.SC.INT.2',
    discipline: 'All Sciences',
    topic: 'Group 4 Project',
    level: 'SL',
    description: 'Collaborate on an interdisciplinary scientific project',
    assessmentCriteria: ['Collaboration', 'Communication'],
  },
];

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const ibMYPDPScienceCurriculum: IBMYPDPScienceCurriculum = {
  code: 'IB_MYP_DP',
  name: 'International Baccalaureate MYP & DP Sciences',
  country: 'International',
  version: '2014/2023',
  sourceUrl: 'https://www.ibo.org/programmes/',
  subject: 'Sciences',
  years: [
    {
      year: 4,
      grade: 9,
      programme: 'MYP',
      yearLabel: 'MYP Year 4 (Grade 9)',
      ageRangeMin: 14,
      ageRangeMax: 15,
      standards: mypYear4ScienceStandards,
    },
    {
      year: 5,
      grade: 10,
      programme: 'MYP',
      yearLabel: 'MYP Year 5 (Grade 10)',
      ageRangeMin: 15,
      ageRangeMax: 16,
      standards: mypYear5ScienceStandards,
    },
    {
      year: 1,
      grade: 11,
      programme: 'DP',
      yearLabel: 'DP Year 1 (Grade 11)',
      ageRangeMin: 16,
      ageRangeMax: 17,
      standards: dpYear1ScienceStandards,
    },
    {
      year: 2,
      grade: 12,
      programme: 'DP',
      yearLabel: 'DP Year 2 (Grade 12)',
      ageRangeMin: 17,
      ageRangeMax: 18,
      standards: dpYear2ScienceStandards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getIBScienceStandardsForGrade(grade: number): IBMYPDPScienceStandard[] {
  const yearData = ibMYPDPScienceCurriculum.years.find((y) => y.grade === grade);
  return yearData?.standards || [];
}

export function getIBMYPScienceStandards(): IBMYPDPScienceStandard[] {
  return ibMYPDPScienceCurriculum.years
    .filter((y) => y.programme === 'MYP')
    .flatMap((y) => y.standards);
}

export function getIBDPScienceStandards(): IBMYPDPScienceStandard[] {
  return ibMYPDPScienceCurriculum.years
    .filter((y) => y.programme === 'DP')
    .flatMap((y) => y.standards);
}

export function getIBScienceStandardsCount(): number {
  return ibMYPDPScienceCurriculum.years.reduce((total, year) => total + year.standards.length, 0);
}
