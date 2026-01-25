/**
 * British National Curriculum - Science Standards
 * Years 1-13 (Key Stages 1, 2, 3, 4, and 5)
 *
 * Sources:
 * - KS1-3: GOV.UK National Curriculum in England
 *   https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study
 * - KS4 (GCSE): DfE GCSE Combined Science Subject Content (2015)
 *   https://www.gov.uk/government/publications/gcse-combined-science
 * - KS5 (A-Level): DfE GCE AS and A Level Subject Content (2014)
 *   https://www.gov.uk/government/publications/gce-as-and-a-level-for-science
 *
 * VERIFIED: 2025-01-15 against official GOV.UK documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.SC.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1, 2, 3, 4, or 5)
 * - Y = Year (1-13)
 * - SC = Science
 * - Strand codes:
 *   KS1/KS2:
 *   - WS = Working Scientifically
 *   - PLT = Plants
 *   - ANH = Animals, including humans
 *   - MAT = Everyday Materials / Uses of Everyday Materials / Properties and Changes of Materials
 *   - SC = Seasonal Changes
 *   - LTH = Living Things and their Habitats
 *   - RCK = Rocks
 *   - LGT = Light
 *   - FRC = Forces (and Magnets)
 *   - SOM = States of Matter
 *   - SND = Sound
 *   - ELC = Electricity
 *   - EAS = Earth and Space
 *   - EVI = Evolution and Inheritance
 *   KS3 Biology:
 *   - BIO.CO = Cells and Organisation
 *   - BIO.SM = Skeletal and Muscular Systems
 *   - BIO.ND = Nutrition and Digestion
 *   - BIO.GE = Gas Exchange Systems
 *   - BIO.RP = Reproduction
 *   - BIO.HE = Health
 *   - BIO.PS = Photosynthesis
 *   - BIO.CR = Cellular Respiration
 *   - BIO.EC = Ecosystems
 *   - BIO.GV = Genetics and Evolution
 *   KS3 Chemistry:
 *   - CHM.PM = Particulate Nature of Matter
 *   - CHM.AE = Atoms, Elements and Compounds
 *   - CHM.PI = Pure and Impure Substances
 *   - CHM.CR = Chemical Reactions
 *   - CHM.EN = Energetics
 *   - CHM.PT = Periodic Table
 *   - CHM.MT = Materials
 *   - CHM.EA = Earth and Atmosphere
 *   KS3 Physics:
 *   - PHY.EN = Energy
 *   - PHY.MF = Motion and Forces
 *   - PHY.WV = Waves
 *   - PHY.EM = Electricity and Magnetism
 *   - PHY.MA = Matter
 *   - PHY.SP = Space Physics
 *   KS3 Working Scientifically:
 *   - WS.SA = Scientific Attitudes
 *   - WS.EI = Experimental Skills and Investigations
 *   - WS.AE = Analysis and Evaluation
 *   - WS.ME = Measurement
 *   KS4 (GCSE Combined Science) Biology:
 *   - BIO.CB = Cell Biology
 *   - BIO.OR = Organisation
 *   - BIO.IN = Infection and Response
 *   - BIO.BI = Bioenergetics
 *   - BIO.HO = Homeostasis and Response
 *   - BIO.IH = Inheritance, Variation and Evolution
 *   - BIO.EC = Ecology
 *   KS4 (GCSE Combined Science) Chemistry:
 *   - CHM.AS = Atomic Structure and the Periodic Table
 *   - CHM.BS = Bonding, Structure and Properties of Matter
 *   - CHM.QC = Quantitative Chemistry
 *   - CHM.CC = Chemical Changes
 *   - CHM.ER = Energy Changes
 *   - CHM.RR = Rate and Extent of Chemical Change
 *   - CHM.OC = Organic Chemistry
 *   - CHM.CA = Chemical Analysis
 *   - CHM.CU = Chemistry of the Atmosphere
 *   - CHM.UR = Using Resources
 *   KS4 (GCSE Combined Science) Physics:
 *   - PHY.EN = Energy
 *   - PHY.EL = Electricity
 *   - PHY.PM = Particle Model of Matter
 *   - PHY.AS = Atomic Structure
 *   - PHY.FC = Forces
 *   - PHY.WV = Waves
 *   - PHY.MG = Magnetism and Electromagnetism
 *   KS4 Working Scientifically:
 *   - WS.DH = Development of Scientific Thinking
 *   - WS.ES = Experimental Skills and Strategies
 *   - WS.AE = Analysis and Evaluation
 *   - WS.VC = Vocabulary, Units, Symbols and Nomenclature
 *   KS5 (A-Level) Biology:
 *   - BIO.BM = Biological Molecules
 *   - BIO.CL = Cells
 *   - BIO.OE = Organisms Exchange Substances
 *   - BIO.GI = Genetic Information, Variation and Relationships
 *   - BIO.ET = Energy Transfers
 *   - BIO.RG = Response to Stimuli and Genes
 *   - BIO.GE = Genetics, Populations and Ecosystems
 *   - BIO.CN = Control of Gene Expression
 *   KS5 (A-Level) Chemistry:
 *   - CHM.PA = Physical Chemistry A (Atomic Structure, Bonding, Energetics, Kinetics, Equilibria)
 *   - CHM.PB = Physical Chemistry B (Thermodynamics, Rate Equations, Equilibrium Constants, Electrochemistry)
 *   - CHM.IA = Inorganic Chemistry A (Periodicity, Group 2, Group 17)
 *   - CHM.IB = Inorganic Chemistry B (Period 3, Transition Metals, Ion Reactions)
 *   - CHM.OA = Organic Chemistry A (Introduction, Alkanes, Halogenoalkanes, Alkenes, Alcohols)
 *   - CHM.OB = Organic Chemistry B (Optical Isomerism, Aldehydes/Ketones, Carboxylic Acids, Aromatics, Amines, Polymers)
 *   - CHM.AN = Analytical Techniques
 *   KS5 (A-Level) Physics:
 *   - PHY.MM = Measurements and their Errors
 *   - PHY.PM = Particles and Radiation
 *   - PHY.WO = Waves and Optics
 *   - PHY.ME = Mechanics and Materials
 *   - PHY.EL = Electricity
 *   - PHY.FM = Further Mechanics and Thermal Physics
 *   - PHY.FD = Fields and their Consequences
 *   - PHY.NP = Nuclear Physics
 *   - PHY.AP = Astrophysics (optional)
 *   - PHY.MP = Medical Physics (optional)
 *   - PHY.TP = Turning Points in Physics (optional)
 *   KS5 Practical Skills:
 *   - PS.DE = Development of Practical Skills
 *   - PS.ES = Experimental Skills
 *   - PS.AE = Analysis and Evaluation
 */

export interface BritishNCScienceStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
}

export interface BritishNCScienceYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCScienceStandard[];
}

export interface BritishNCScienceJurisdiction {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCScienceYear[];
}

// =============================================================================
// KEY STAGE 1: YEAR 1 (Ages 5-6)
// =============================================================================

const year1Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (shared across KS1, included in each year)
  {
    notation: 'UK.KS1.Y1.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'asking simple questions and recognising that they can be answered in different ways',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'observing closely, using simple equipment',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'performing simple tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'identifying and classifying',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'using their observations and ideas to suggest answers to questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'gathering and recording data to help in answering questions',
    isStatutory: true
  },

  // PLANTS
  {
    notation: 'UK.KS1.Y1.SC.PLT.1',
    strand: 'Plants',
    description: 'identify and name a variety of common wild and garden plants, including deciduous and evergreen trees',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.PLT.2',
    strand: 'Plants',
    description: 'identify and describe the basic structure of a variety of common flowering plants, including trees',
    isStatutory: true
  },

  // ANIMALS, INCLUDING HUMANS
  {
    notation: 'UK.KS1.Y1.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'identify and name a variety of common animals including fish, amphibians, reptiles, birds and mammals',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.ANH.2',
    strand: 'Animals, including humans',
    description: 'identify and name a variety of common animals that are carnivores, herbivores and omnivores',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.ANH.3',
    strand: 'Animals, including humans',
    description: 'describe and compare the structure of a variety of common animals (fish, amphibians, reptiles, birds and mammals including pets)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.ANH.4',
    strand: 'Animals, including humans',
    description: 'identify, name, draw and label the basic parts of the human body and say which part of the body is associated with each sense',
    isStatutory: true
  },

  // EVERYDAY MATERIALS
  {
    notation: 'UK.KS1.Y1.SC.MAT.1',
    strand: 'Everyday Materials',
    description: 'distinguish between an object and the material from which it is made',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.MAT.2',
    strand: 'Everyday Materials',
    description: 'identify and name a variety of everyday materials, including wood, plastic, glass, metal, water, and rock',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.MAT.3',
    strand: 'Everyday Materials',
    description: 'describe the simple physical properties of a variety of everyday materials',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.MAT.4',
    strand: 'Everyday Materials',
    description: 'compare and group together a variety of everyday materials on the basis of their simple physical properties',
    isStatutory: true
  },

  // SEASONAL CHANGES
  {
    notation: 'UK.KS1.Y1.SC.SC.1',
    strand: 'Seasonal Changes',
    description: 'observe changes across the 4 seasons',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.SC.SC.2',
    strand: 'Seasonal Changes',
    description: 'observe and describe weather associated with the seasons and how day length varies',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 1: YEAR 2 (Ages 6-7)
// =============================================================================

const year2Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (shared across KS1)
  {
    notation: 'UK.KS1.Y2.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'asking simple questions and recognising that they can be answered in different ways',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'observing closely, using simple equipment',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'performing simple tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'identifying and classifying',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'using their observations and ideas to suggest answers to questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'gathering and recording data to help in answering questions',
    isStatutory: true
  },

  // LIVING THINGS AND THEIR HABITATS
  {
    notation: 'UK.KS1.Y2.SC.LTH.1',
    strand: 'Living Things and their Habitats',
    description: 'explore and compare the differences between things that are living, dead, and things that have never been alive',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.LTH.2',
    strand: 'Living Things and their Habitats',
    description: 'identify that most living things live in habitats to which they are suited and describe how different habitats provide for the basic needs of different kinds of animals and plants, and how they depend on each other',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.LTH.3',
    strand: 'Living Things and their Habitats',
    description: 'identify and name a variety of plants and animals in their habitats, including microhabitats',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.LTH.4',
    strand: 'Living Things and their Habitats',
    description: 'describe how animals obtain their food from plants and other animals, using the idea of a simple food chain, and identify and name different sources of food',
    isStatutory: true
  },

  // PLANTS
  {
    notation: 'UK.KS1.Y2.SC.PLT.1',
    strand: 'Plants',
    description: 'observe and describe how seeds and bulbs grow into mature plants',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.PLT.2',
    strand: 'Plants',
    description: 'find out and describe how plants need water, light and a suitable temperature to grow and stay healthy',
    isStatutory: true
  },

  // ANIMALS, INCLUDING HUMANS
  {
    notation: 'UK.KS1.Y2.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'notice that animals, including humans, have offspring which grow into adults',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.ANH.2',
    strand: 'Animals, including humans',
    description: 'find out about and describe the basic needs of animals, including humans, for survival (water, food and air)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.ANH.3',
    strand: 'Animals, including humans',
    description: 'describe the importance for humans of exercise, eating the right amounts of different types of food, and hygiene',
    isStatutory: true
  },

  // USES OF EVERYDAY MATERIALS
  {
    notation: 'UK.KS1.Y2.SC.MAT.1',
    strand: 'Uses of Everyday Materials',
    description: 'identify and compare the suitability of a variety of everyday materials, including wood, metal, plastic, glass, brick, rock, paper and cardboard for particular uses',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.SC.MAT.2',
    strand: 'Uses of Everyday Materials',
    description: 'find out how the shapes of solid objects made from some materials can be changed by squashing, bending, twisting and stretching',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 2 - LOWER: YEAR 3 (Ages 7-8)
// =============================================================================

const year3Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (Lower KS2)
  {
    notation: 'UK.KS2.Y3.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'asking relevant questions and using different types of scientific enquiries to answer them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'setting up simple practical enquiries, comparative and fair tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'making systematic and careful observations and, where appropriate, taking accurate measurements using standard units, using a range of equipment, including thermometers and data loggers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'gathering, recording, classifying and presenting data in a variety of ways to help in answering questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'recording findings using simple scientific language, drawings, labelled diagrams, keys, bar charts, and tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'reporting on findings from enquiries, including oral and written explanations, displays or presentations of results and conclusions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.7',
    strand: 'Working Scientifically',
    description: 'using results to draw simple conclusions, make predictions for new values, suggest improvements and raise further questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.8',
    strand: 'Working Scientifically',
    description: 'identifying differences, similarities or changes related to simple scientific ideas and processes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.WS.9',
    strand: 'Working Scientifically',
    description: 'using straightforward scientific evidence to answer questions or to support their findings',
    isStatutory: true
  },

  // PLANTS
  {
    notation: 'UK.KS2.Y3.SC.PLT.1',
    strand: 'Plants',
    description: 'identify and describe the functions of different parts of flowering plants: roots, stem/trunk, leaves and flowers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.PLT.2',
    strand: 'Plants',
    description: 'explore the requirements of plants for life and growth (air, light, water, nutrients from soil, and room to grow) and how they vary from plant to plant',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.PLT.3',
    strand: 'Plants',
    description: 'investigate the way in which water is transported within plants',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.PLT.4',
    strand: 'Plants',
    description: 'explore the part that flowers play in the life cycle of flowering plants, including pollination, seed formation and seed dispersal',
    isStatutory: true
  },

  // ANIMALS, INCLUDING HUMANS
  {
    notation: 'UK.KS2.Y3.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'identify that animals, including humans, need the right types and amount of nutrition, and that they cannot make their own food; they get nutrition from what they eat',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.ANH.2',
    strand: 'Animals, including humans',
    description: 'identify that humans and some other animals have skeletons and muscles for support, protection and movement',
    isStatutory: true
  },

  // ROCKS
  {
    notation: 'UK.KS2.Y3.SC.RCK.1',
    strand: 'Rocks',
    description: 'compare and group together different kinds of rocks on the basis of their appearance and simple physical properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.RCK.2',
    strand: 'Rocks',
    description: 'describe in simple terms how fossils are formed when things that have lived are trapped within rock',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.RCK.3',
    strand: 'Rocks',
    description: 'recognise that soils are made from rocks and organic matter',
    isStatutory: true
  },

  // LIGHT
  {
    notation: 'UK.KS2.Y3.SC.LGT.1',
    strand: 'Light',
    description: 'recognise that they need light in order to see things and that dark is the absence of light',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.LGT.2',
    strand: 'Light',
    description: 'notice that light is reflected from surfaces',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.LGT.3',
    strand: 'Light',
    description: 'recognise that light from the sun can be dangerous and that there are ways to protect their eyes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.LGT.4',
    strand: 'Light',
    description: 'recognise that shadows are formed when the light from a light source is blocked by an opaque object',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.LGT.5',
    strand: 'Light',
    description: 'find patterns in the way that the size of shadows change',
    isStatutory: true
  },

  // FORCES AND MAGNETS
  {
    notation: 'UK.KS2.Y3.SC.FRC.1',
    strand: 'Forces and Magnets',
    description: 'compare how things move on different surfaces',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.FRC.2',
    strand: 'Forces and Magnets',
    description: 'notice that some forces need contact between 2 objects, but magnetic forces can act at a distance',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.FRC.3',
    strand: 'Forces and Magnets',
    description: 'observe how magnets attract or repel each other and attract some materials and not others',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.FRC.4',
    strand: 'Forces and Magnets',
    description: 'compare and group together a variety of everyday materials on the basis of whether they are attracted to a magnet, and identify some magnetic materials',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.FRC.5',
    strand: 'Forces and Magnets',
    description: 'describe magnets as having 2 poles',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.SC.FRC.6',
    strand: 'Forces and Magnets',
    description: 'predict whether 2 magnets will attract or repel each other, depending on which poles are facing',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 2 - LOWER: YEAR 4 (Ages 8-9)
// =============================================================================

const year4Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (Lower KS2)
  {
    notation: 'UK.KS2.Y4.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'asking relevant questions and using different types of scientific enquiries to answer them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'setting up simple practical enquiries, comparative and fair tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'making systematic and careful observations and, where appropriate, taking accurate measurements using standard units, using a range of equipment, including thermometers and data loggers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'gathering, recording, classifying and presenting data in a variety of ways to help in answering questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'recording findings using simple scientific language, drawings, labelled diagrams, keys, bar charts, and tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'reporting on findings from enquiries, including oral and written explanations, displays or presentations of results and conclusions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.7',
    strand: 'Working Scientifically',
    description: 'using results to draw simple conclusions, make predictions for new values, suggest improvements and raise further questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.8',
    strand: 'Working Scientifically',
    description: 'identifying differences, similarities or changes related to simple scientific ideas and processes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.WS.9',
    strand: 'Working Scientifically',
    description: 'using straightforward scientific evidence to answer questions or to support their findings',
    isStatutory: true
  },

  // LIVING THINGS AND THEIR HABITATS
  {
    notation: 'UK.KS2.Y4.SC.LTH.1',
    strand: 'Living Things and their Habitats',
    description: 'recognise that living things can be grouped in a variety of ways',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.LTH.2',
    strand: 'Living Things and their Habitats',
    description: 'explore and use classification keys to help group, identify and name a variety of living things in their local and wider environment',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.LTH.3',
    strand: 'Living Things and their Habitats',
    description: 'recognise that environments can change and that this can sometimes pose dangers to living things',
    isStatutory: true
  },

  // ANIMALS, INCLUDING HUMANS
  {
    notation: 'UK.KS2.Y4.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'describe the simple functions of the basic parts of the digestive system in humans',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ANH.2',
    strand: 'Animals, including humans',
    description: 'identify the different types of teeth in humans and their simple functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ANH.3',
    strand: 'Animals, including humans',
    description: 'construct and interpret a variety of food chains, identifying producers, predators and prey',
    isStatutory: true
  },

  // STATES OF MATTER
  {
    notation: 'UK.KS2.Y4.SC.SOM.1',
    strand: 'States of Matter',
    description: 'compare and group materials together, according to whether they are solids, liquids or gases',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SOM.2',
    strand: 'States of Matter',
    description: 'observe that some materials change state when they are heated or cooled, and measure or research the temperature at which this happens in degrees Celsius (°C)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SOM.3',
    strand: 'States of Matter',
    description: 'identify the part played by evaporation and condensation in the water cycle and associate the rate of evaporation with temperature',
    isStatutory: true
  },

  // SOUND
  {
    notation: 'UK.KS2.Y4.SC.SND.1',
    strand: 'Sound',
    description: 'identify how sounds are made, associating some of them with something vibrating',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SND.2',
    strand: 'Sound',
    description: 'recognise that vibrations from sounds travel through a medium to the ear',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SND.3',
    strand: 'Sound',
    description: 'find patterns between the pitch of a sound and features of the object that produced it',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SND.4',
    strand: 'Sound',
    description: 'find patterns between the volume of a sound and the strength of the vibrations that produced it',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.SND.5',
    strand: 'Sound',
    description: 'recognise that sounds get fainter as the distance from the sound source increases',
    isStatutory: true
  },

  // ELECTRICITY
  {
    notation: 'UK.KS2.Y4.SC.ELC.1',
    strand: 'Electricity',
    description: 'identify common appliances that run on electricity',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ELC.2',
    strand: 'Electricity',
    description: 'construct a simple series electrical circuit, identifying and naming its basic parts, including cells, wires, bulbs, switches and buzzers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ELC.3',
    strand: 'Electricity',
    description: 'identify whether or not a lamp will light in a simple series circuit, based on whether or not the lamp is part of a complete loop with a battery',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ELC.4',
    strand: 'Electricity',
    description: 'recognise that a switch opens and closes a circuit and associate this with whether or not a lamp lights in a simple series circuit',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.SC.ELC.5',
    strand: 'Electricity',
    description: 'recognise some common conductors and insulators, and associate metals with being good conductors',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 2 - UPPER: YEAR 5 (Ages 9-10)
// =============================================================================

const year5Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (Upper KS2)
  {
    notation: 'UK.KS2.Y5.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'planning different types of scientific enquiries to answer questions, including recognising and controlling variables where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'taking measurements, using a range of scientific equipment, with increasing accuracy and precision, taking repeat readings when appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'recording data and results of increasing complexity using scientific diagrams and labels, classification keys, tables, scatter graphs, bar and line graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'using test results to make predictions to set up further comparative and fair tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'reporting and presenting findings from enquiries, including conclusions, causal relationships and explanations of and a degree of trust in results, in oral and written forms such as displays and other presentations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'identifying scientific evidence that has been used to support or refute ideas or arguments',
    isStatutory: true
  },

  // LIVING THINGS AND THEIR HABITATS
  {
    notation: 'UK.KS2.Y5.SC.LTH.1',
    strand: 'Living Things and their Habitats',
    description: 'describe the differences in the life cycles of a mammal, an amphibian, an insect and a bird',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.LTH.2',
    strand: 'Living Things and their Habitats',
    description: 'describe the life process of reproduction in some plants and animals',
    isStatutory: true
  },

  // ANIMALS, INCLUDING HUMANS
  {
    notation: 'UK.KS2.Y5.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'describe the changes as humans develop to old age',
    isStatutory: true
  },

  // PROPERTIES AND CHANGES OF MATERIALS
  {
    notation: 'UK.KS2.Y5.SC.MAT.1',
    strand: 'Properties and Changes of Materials',
    description: 'compare and group together everyday materials on the basis of their properties, including their hardness, solubility, transparency, conductivity (electrical and thermal), and response to magnets',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.MAT.2',
    strand: 'Properties and Changes of Materials',
    description: 'know that some materials will dissolve in liquid to form a solution, and describe how to recover a substance from a solution',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.MAT.3',
    strand: 'Properties and Changes of Materials',
    description: 'use knowledge of solids, liquids and gases to decide how mixtures might be separated, including through filtering, sieving and evaporating',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.MAT.4',
    strand: 'Properties and Changes of Materials',
    description: 'give reasons, based on evidence from comparative and fair tests, for the particular uses of everyday materials, including metals, wood and plastic',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.MAT.5',
    strand: 'Properties and Changes of Materials',
    description: 'demonstrate that dissolving, mixing and changes of state are reversible changes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.MAT.6',
    strand: 'Properties and Changes of Materials',
    description: 'explain that some changes result in the formation of new materials, and that this kind of change is not usually reversible, including changes associated with burning and the action of acid on bicarbonate of soda',
    isStatutory: true
  },

  // EARTH AND SPACE
  {
    notation: 'UK.KS2.Y5.SC.EAS.1',
    strand: 'Earth and Space',
    description: 'describe the movement of the Earth and other planets relative to the sun in the solar system',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.EAS.2',
    strand: 'Earth and Space',
    description: 'describe the movement of the moon relative to the Earth',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.EAS.3',
    strand: 'Earth and Space',
    description: 'describe the sun, Earth and moon as approximately spherical bodies',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.EAS.4',
    strand: 'Earth and Space',
    description: 'use the idea of the Earth\'s rotation to explain day and night and the apparent movement of the sun across the sky',
    isStatutory: true
  },

  // FORCES
  {
    notation: 'UK.KS2.Y5.SC.FRC.1',
    strand: 'Forces',
    description: 'explain that unsupported objects fall towards the Earth because of the force of gravity acting between the Earth and the falling object',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.FRC.2',
    strand: 'Forces',
    description: 'identify the effects of air resistance, water resistance and friction, that act between moving surfaces',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.SC.FRC.3',
    strand: 'Forces',
    description: 'recognise that some mechanisms including levers, pulleys and gears allow a smaller force to have a greater effect',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 2 - UPPER: YEAR 6 (Ages 10-11)
// =============================================================================

const year6Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY (Upper KS2)
  {
    notation: 'UK.KS2.Y6.SC.WS.1',
    strand: 'Working Scientifically',
    description: 'planning different types of scientific enquiries to answer questions, including recognising and controlling variables where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.WS.2',
    strand: 'Working Scientifically',
    description: 'taking measurements, using a range of scientific equipment, with increasing accuracy and precision, taking repeat readings when appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.WS.3',
    strand: 'Working Scientifically',
    description: 'recording data and results of increasing complexity using scientific diagrams and labels, classification keys, tables, scatter graphs, bar and line graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.WS.4',
    strand: 'Working Scientifically',
    description: 'using test results to make predictions to set up further comparative and fair tests',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.WS.5',
    strand: 'Working Scientifically',
    description: 'reporting and presenting findings from enquiries, including conclusions, causal relationships and explanations of and a degree of trust in results, in oral and written forms such as displays and other presentations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.WS.6',
    strand: 'Working Scientifically',
    description: 'identifying scientific evidence that has been used to support or refute ideas or arguments',
    isStatutory: true
  },

  // LIVING THINGS AND THEIR HABITATS
  {
    notation: 'UK.KS2.Y6.SC.LTH.1',
    strand: 'Living Things and their Habitats',
    description: 'describe how living things are classified into broad groups according to common observable characteristics and based on similarities and differences, including micro-organisms, plants and animals',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.LTH.2',
    strand: 'Living Things and their Habitats',
    description: 'give reasons for classifying plants and animals based on specific characteristics',
    isStatutory: true
  },

  // ANIMALS INCLUDING HUMANS
  {
    notation: 'UK.KS2.Y6.SC.ANH.1',
    strand: 'Animals, including humans',
    description: 'identify and name the main parts of the human circulatory system, and describe the functions of the heart, blood vessels and blood',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.ANH.2',
    strand: 'Animals, including humans',
    description: 'recognise the impact of diet, exercise, drugs and lifestyle on the way their bodies function',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.ANH.3',
    strand: 'Animals, including humans',
    description: 'describe the ways in which nutrients and water are transported within animals, including humans',
    isStatutory: true
  },

  // EVOLUTION AND INHERITANCE
  {
    notation: 'UK.KS2.Y6.SC.EVI.1',
    strand: 'Evolution and Inheritance',
    description: 'recognise that living things have changed over time and that fossils provide information about living things that inhabited the Earth millions of years ago',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.EVI.2',
    strand: 'Evolution and Inheritance',
    description: 'recognise that living things produce offspring of the same kind, but normally offspring vary and are not identical to their parents',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.EVI.3',
    strand: 'Evolution and Inheritance',
    description: 'identify how animals and plants are adapted to suit their environment in different ways and that adaptation may lead to evolution',
    isStatutory: true
  },

  // LIGHT
  {
    notation: 'UK.KS2.Y6.SC.LGT.1',
    strand: 'Light',
    description: 'recognise that light appears to travel in straight lines',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.LGT.2',
    strand: 'Light',
    description: 'use the idea that light travels in straight lines to explain that objects are seen because they give out or reflect light into the eye',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.LGT.3',
    strand: 'Light',
    description: 'explain that we see things because light travels from light sources to our eyes or from light sources to objects and then to our eyes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.LGT.4',
    strand: 'Light',
    description: 'use the idea that light travels in straight lines to explain why shadows have the same shape as the objects that cast them',
    isStatutory: true
  },

  // ELECTRICITY
  {
    notation: 'UK.KS2.Y6.SC.ELC.1',
    strand: 'Electricity',
    description: 'associate the brightness of a lamp or the volume of a buzzer with the number and voltage of cells used in the circuit',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.ELC.2',
    strand: 'Electricity',
    description: 'compare and give reasons for variations in how components function, including the brightness of bulbs, the loudness of buzzers and the on/off position of switches',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.SC.ELC.3',
    strand: 'Electricity',
    description: 'use recognised symbols when representing a simple circuit in a diagram',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 3: YEAR 7 (Ages 11-12)
// Focus: Foundational KS3 concepts - Introduction to all three science disciplines
// =============================================================================

const year7Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY - SCIENTIFIC ATTITUDES
  {
    notation: 'UK.KS3.Y7.SC.WS.SA.1',
    strand: 'Working Scientifically - Scientific Attitudes',
    description: 'pay attention to objectivity and concern for accuracy, precision, repeatability and reproducibility',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.WS.SA.2',
    strand: 'Working Scientifically - Scientific Attitudes',
    description: 'understand that scientific methods and theories develop as earlier explanations are modified to take account of new evidence and ideas, together with the importance of publishing results and peer review',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.WS.SA.3',
    strand: 'Working Scientifically - Scientific Attitudes',
    description: 'evaluate risks',
    isStatutory: true
  },

  // WORKING SCIENTIFICALLY - EXPERIMENTAL SKILLS
  {
    notation: 'UK.KS3.Y7.SC.WS.EI.1',
    strand: 'Working Scientifically - Experimental Skills',
    description: 'ask questions and develop a line of enquiry based on observations of the real world, alongside prior knowledge and experience',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.WS.EI.2',
    strand: 'Working Scientifically - Experimental Skills',
    description: 'make predictions using scientific knowledge and understanding',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.WS.EI.3',
    strand: 'Working Scientifically - Experimental Skills',
    description: 'select, plan and carry out the most appropriate types of scientific enquiries to test predictions, including identifying independent, dependent and control variables',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.WS.EI.4',
    strand: 'Working Scientifically - Experimental Skills',
    description: 'use appropriate techniques, apparatus, and materials during fieldwork and laboratory work, paying attention to health and safety',
    isStatutory: true
  },

  // BIOLOGY - CELLS AND ORGANISATION
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.1',
    strand: 'Biology - Cells and Organisation',
    description: 'cells as the fundamental unit of living organisms, including how to observe, interpret and record cell structure using a light microscope',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.2',
    strand: 'Biology - Cells and Organisation',
    description: 'the functions of the cell wall, cell membrane, cytoplasm, nucleus, vacuole, mitochondria and chloroplasts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.3',
    strand: 'Biology - Cells and Organisation',
    description: 'the similarities and differences between plant and animal cells',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.4',
    strand: 'Biology - Cells and Organisation',
    description: 'the role of diffusion in the movement of materials in and between cells',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.5',
    strand: 'Biology - Cells and Organisation',
    description: 'the structural adaptations of some unicellular organisms',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.CO.6',
    strand: 'Biology - Cells and Organisation',
    description: 'the hierarchical organisation of multicellular organisms: from cells to tissues to organs to systems to organisms',
    isStatutory: true
  },

  // BIOLOGY - SKELETAL AND MUSCULAR SYSTEMS
  {
    notation: 'UK.KS3.Y7.SC.BIO.SM.1',
    strand: 'Biology - Skeletal and Muscular Systems',
    description: 'the structure and functions of the human skeleton, to include support, protection, movement and making blood cells',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.SM.2',
    strand: 'Biology - Skeletal and Muscular Systems',
    description: 'biomechanics – the interaction between skeleton and muscles, including the measurement of force exerted by different muscles',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.BIO.SM.3',
    strand: 'Biology - Skeletal and Muscular Systems',
    description: 'the function of muscles and examples of antagonistic muscles',
    isStatutory: true
  },

  // CHEMISTRY - PARTICULATE NATURE OF MATTER
  {
    notation: 'UK.KS3.Y7.SC.CHM.PM.1',
    strand: 'Chemistry - Particulate Nature of Matter',
    description: 'the properties of the different states of matter (solid, liquid and gas) in terms of the particle model, including gas pressure',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.PM.2',
    strand: 'Chemistry - Particulate Nature of Matter',
    description: 'changes of state in terms of the particle model',
    isStatutory: true
  },

  // CHEMISTRY - ATOMS, ELEMENTS AND COMPOUNDS
  {
    notation: 'UK.KS3.Y7.SC.CHM.AE.1',
    strand: 'Chemistry - Atoms, Elements and Compounds',
    description: 'a simple (Dalton) atomic model',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.AE.2',
    strand: 'Chemistry - Atoms, Elements and Compounds',
    description: 'differences between atoms, elements and compounds',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.AE.3',
    strand: 'Chemistry - Atoms, Elements and Compounds',
    description: 'chemical symbols and formulae for elements and compounds',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.AE.4',
    strand: 'Chemistry - Atoms, Elements and Compounds',
    description: 'conservation of mass changes of state and chemical reactions',
    isStatutory: true
  },

  // CHEMISTRY - PURE AND IMPURE SUBSTANCES
  {
    notation: 'UK.KS3.Y7.SC.CHM.PI.1',
    strand: 'Chemistry - Pure and Impure Substances',
    description: 'the concept of a pure substance',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.PI.2',
    strand: 'Chemistry - Pure and Impure Substances',
    description: 'mixtures, including dissolving',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.PI.3',
    strand: 'Chemistry - Pure and Impure Substances',
    description: 'diffusion in terms of the particle model',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.CHM.PI.4',
    strand: 'Chemistry - Pure and Impure Substances',
    description: 'simple techniques for separating mixtures: filtration, evaporation, distillation and chromatography',
    isStatutory: true
  },

  // PHYSICS - ENERGY
  {
    notation: 'UK.KS3.Y7.SC.PHY.EN.1',
    strand: 'Physics - Energy',
    description: 'comparing energy values of different foods (from labels) (kJ)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.PHY.EN.2',
    strand: 'Physics - Energy',
    description: 'comparing power ratings of appliances in watts (W, kW)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.PHY.EN.3',
    strand: 'Physics - Energy',
    description: 'comparing amounts of energy transferred (J, kJ, kW hour)',
    isStatutory: true
  },

  // PHYSICS - FORCES
  {
    notation: 'UK.KS3.Y7.SC.PHY.MF.1',
    strand: 'Physics - Motion and Forces',
    description: 'speed and the quantitative relationship between average speed, distance and time (speed = distance ÷ time)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.PHY.MF.2',
    strand: 'Physics - Motion and Forces',
    description: 'forces as pushes or pulls, arising from the interaction between 2 objects',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.SC.PHY.MF.3',
    strand: 'Physics - Motion and Forces',
    description: 'using force arrows in diagrams, adding forces in 1 dimension, balanced and unbalanced forces',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 3: YEAR 8 (Ages 12-13)
// Focus: Intermediate KS3 concepts - Building on Year 7 foundations
// =============================================================================

const year8Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY - ANALYSIS AND EVALUATION
  {
    notation: 'UK.KS3.Y8.SC.WS.AE.1',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'apply mathematical concepts and calculate results',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.AE.2',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'present observations and data using appropriate methods, including tables and graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.AE.3',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'interpret observations and data, including identifying patterns and using observations, measurements and data to draw conclusions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.AE.4',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'present reasoned explanations, including explaining data in relation to predictions and hypotheses',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.AE.5',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'evaluate data, showing awareness of potential sources of random and systematic error',
    isStatutory: true
  },

  // WORKING SCIENTIFICALLY - MEASUREMENT
  {
    notation: 'UK.KS3.Y8.SC.WS.ME.1',
    strand: 'Working Scientifically - Measurement',
    description: 'understand and use SI units and IUPAC (International Union of Pure and Applied Chemistry) chemical nomenclature',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.ME.2',
    strand: 'Working Scientifically - Measurement',
    description: 'use and derive simple equations and carry out appropriate calculations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.WS.ME.3',
    strand: 'Working Scientifically - Measurement',
    description: 'undertake basic data analysis including simple statistical techniques',
    isStatutory: true
  },

  // BIOLOGY - NUTRITION AND DIGESTION
  {
    notation: 'UK.KS3.Y8.SC.BIO.ND.1',
    strand: 'Biology - Nutrition and Digestion',
    description: 'the content of a healthy human diet: carbohydrates, lipids (fats and oils), proteins, vitamins, minerals, dietary fibre and water, and why each is needed',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.ND.2',
    strand: 'Biology - Nutrition and Digestion',
    description: 'calculations of energy requirements in a healthy daily diet',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.ND.3',
    strand: 'Biology - Nutrition and Digestion',
    description: 'the consequences of imbalances in the diet, including obesity, starvation and deficiency diseases',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.ND.4',
    strand: 'Biology - Nutrition and Digestion',
    description: 'the tissues and organs of the human digestive system, including adaptations to function and how the digestive system digests food (enzymes simply as biological catalysts)',
    isStatutory: true
  },

  // BIOLOGY - GAS EXCHANGE
  {
    notation: 'UK.KS3.Y8.SC.BIO.GE.1',
    strand: 'Biology - Gas Exchange Systems',
    description: 'the structure and functions of the gas exchange system in humans, including adaptations to function',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.GE.2',
    strand: 'Biology - Gas Exchange Systems',
    description: 'the mechanism of breathing to move air in and out of the lungs, using a pressure model to explain the movement of gases, including simple measurements of lung volume',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.GE.3',
    strand: 'Biology - Gas Exchange Systems',
    description: 'the impact of exercise, asthma and smoking on the human gas exchange system',
    isStatutory: true
  },

  // BIOLOGY - PHOTOSYNTHESIS
  {
    notation: 'UK.KS3.Y8.SC.BIO.PS.1',
    strand: 'Biology - Photosynthesis',
    description: 'the reactants in, and products of, photosynthesis, and a word summary for photosynthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.PS.2',
    strand: 'Biology - Photosynthesis',
    description: 'the dependence of almost all life on Earth on the ability of photosynthetic organisms, such as plants and algae, to use sunlight in photosynthesis to build organic molecules that are an essential energy store',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.BIO.PS.3',
    strand: 'Biology - Photosynthesis',
    description: 'the adaptations of leaves for photosynthesis',
    isStatutory: true
  },

  // CHEMISTRY - CHEMICAL REACTIONS
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.1',
    strand: 'Chemistry - Chemical Reactions',
    description: 'chemical reactions as the rearrangement of atoms',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.2',
    strand: 'Chemistry - Chemical Reactions',
    description: 'representing chemical reactions using formulae and using equations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.3',
    strand: 'Chemistry - Chemical Reactions',
    description: 'combustion, thermal decomposition, oxidation and displacement reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.4',
    strand: 'Chemistry - Chemical Reactions',
    description: 'defining acids and alkalis in terms of neutralisation reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.5',
    strand: 'Chemistry - Chemical Reactions',
    description: 'the pH scale for measuring acidity/alkalinity; and indicators',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.6',
    strand: 'Chemistry - Chemical Reactions',
    description: 'reactions of acids with metals to produce a salt plus hydrogen',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.CR.7',
    strand: 'Chemistry - Chemical Reactions',
    description: 'reactions of acids with alkalis to produce a salt plus water',
    isStatutory: true
  },

  // CHEMISTRY - PERIODIC TABLE
  {
    notation: 'UK.KS3.Y8.SC.CHM.PT.1',
    strand: 'Chemistry - Periodic Table',
    description: 'the varying physical and chemical properties of different elements',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.PT.2',
    strand: 'Chemistry - Periodic Table',
    description: 'the principles underpinning the Mendeleev periodic table',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.PT.3',
    strand: 'Chemistry - Periodic Table',
    description: 'the periodic table: periods and groups; metals and non-metals',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.CHM.PT.4',
    strand: 'Chemistry - Periodic Table',
    description: 'how patterns in reactions can be predicted with reference to the periodic table',
    isStatutory: true
  },

  // PHYSICS - WAVES
  {
    notation: 'UK.KS3.Y8.SC.PHY.WV.1',
    strand: 'Physics - Waves',
    description: 'waves on water as undulations which travel through water with transverse motion; these waves can be reflected, and add or cancel – superposition',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.PHY.WV.2',
    strand: 'Physics - Waves',
    description: 'frequencies of sound waves, measured in hertz (Hz); echoes, reflection and absorption of sound',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.PHY.WV.3',
    strand: 'Physics - Waves',
    description: 'sound needs a medium to travel, the speed of sound in air, in water, in solids',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.PHY.WV.4',
    strand: 'Physics - Waves',
    description: 'sound produced by vibrations of objects, in loudspeakers, detected by their effects on microphone diaphragm and the ear drum; sound waves are longitudinal',
    isStatutory: true
  },

  // PHYSICS - ELECTRICITY
  {
    notation: 'UK.KS3.Y8.SC.PHY.EM.1',
    strand: 'Physics - Electricity and Magnetism',
    description: 'electric current, measured in amperes, in circuits, series and parallel circuits, currents add where branches meet and current as flow of charge',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.PHY.EM.2',
    strand: 'Physics - Electricity and Magnetism',
    description: 'potential difference, measured in volts, battery and bulb ratings; resistance, measured in ohms, as the ratio of potential difference (p.d.) to current',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.SC.PHY.EM.3',
    strand: 'Physics - Electricity and Magnetism',
    description: 'differences in resistance between conducting and insulating components (quantitative)',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 3: YEAR 9 (Ages 13-14)
// Focus: Advanced KS3 concepts - Preparing for GCSE
// =============================================================================

const year9Standards: BritishNCScienceStandard[] = [
  // BIOLOGY - REPRODUCTION
  {
    notation: 'UK.KS3.Y9.SC.BIO.RP.1',
    strand: 'Biology - Reproduction',
    description: 'reproduction in humans (as an example of a mammal), including the structure and function of the male and female reproductive systems, menstrual cycle (without details of hormones), gametes, fertilisation, gestation and birth',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.RP.2',
    strand: 'Biology - Reproduction',
    description: 'reproduction in plants, including flower structure, wind and insect pollination, fertilisation, seed and fruit formation and dispersal',
    isStatutory: true
  },

  // BIOLOGY - CELLULAR RESPIRATION
  {
    notation: 'UK.KS3.Y9.SC.BIO.CR.1',
    strand: 'Biology - Cellular Respiration',
    description: 'aerobic and anaerobic respiration in living organisms, including the breakdown of organic molecules to enable all the other chemical processes necessary for life',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.CR.2',
    strand: 'Biology - Cellular Respiration',
    description: 'a word summary for aerobic respiration',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.CR.3',
    strand: 'Biology - Cellular Respiration',
    description: 'the process of anaerobic respiration in humans and micro-organisms, including fermentation, and a word summary for anaerobic respiration',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.CR.4',
    strand: 'Biology - Cellular Respiration',
    description: 'the differences between aerobic and anaerobic respiration in terms of the reactants, the products formed and the implications for the organism',
    isStatutory: true
  },

  // BIOLOGY - ECOSYSTEMS
  {
    notation: 'UK.KS3.Y9.SC.BIO.EC.1',
    strand: 'Biology - Ecosystems',
    description: 'the interdependence of organisms in an ecosystem, including food webs and insect pollinated crops',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.EC.2',
    strand: 'Biology - Ecosystems',
    description: 'the importance of plant reproduction through insect pollination in human food security',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.EC.3',
    strand: 'Biology - Ecosystems',
    description: 'how organisms affect, and are affected by, their environment, including the accumulation of toxic materials',
    isStatutory: true
  },

  // BIOLOGY - GENETICS AND EVOLUTION
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.1',
    strand: 'Biology - Genetics and Evolution',
    description: 'heredity as the process by which genetic information is transmitted from one generation to the next',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.2',
    strand: 'Biology - Genetics and Evolution',
    description: 'a simple model of chromosomes, genes and DNA in heredity, including the part played by Watson, Crick, Wilkins and Franklin in the development of the DNA model',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.3',
    strand: 'Biology - Genetics and Evolution',
    description: 'the variation between individuals within a species being continuous or discontinuous, to include measurement and graphical representation of variation',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.4',
    strand: 'Biology - Genetics and Evolution',
    description: 'the variation between species and between individuals of the same species meaning some organisms compete more successfully, which can drive natural selection',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.5',
    strand: 'Biology - Genetics and Evolution',
    description: 'changes in the environment which may leave individuals within a species, and some entire species, less well adapted to compete successfully and reproduce, which in turn may lead to extinction',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.BIO.GV.6',
    strand: 'Biology - Genetics and Evolution',
    description: 'the importance of maintaining biodiversity and the use of gene banks to preserve hereditary material',
    isStatutory: true
  },

  // CHEMISTRY - ENERGETICS
  {
    notation: 'UK.KS3.Y9.SC.CHM.EN.1',
    strand: 'Chemistry - Energetics',
    description: 'energy changes on changes of state (qualitative)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EN.2',
    strand: 'Chemistry - Energetics',
    description: 'exothermic and endothermic chemical reactions (qualitative)',
    isStatutory: true
  },

  // CHEMISTRY - EARTH AND ATMOSPHERE
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.1',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'the composition of the Earth',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.2',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'the structure of the Earth',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.3',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'the rock cycle and the formation of igneous, sedimentary and metamorphic rocks',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.4',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'Earth as a source of limited resources and the efficacy of recycling',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.5',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'the composition of the atmosphere',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.CHM.EA.6',
    strand: 'Chemistry - Earth and Atmosphere',
    description: 'the production of carbon dioxide by human activity and the impact on climate',
    isStatutory: true
  },

  // PHYSICS - MAGNETISM
  {
    notation: 'UK.KS3.Y9.SC.PHY.EM.1',
    strand: 'Physics - Electricity and Magnetism',
    description: 'magnetic poles, attraction and repulsion',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.EM.2',
    strand: 'Physics - Electricity and Magnetism',
    description: 'magnetic fields by plotting with compass, representation by field lines',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.EM.3',
    strand: 'Physics - Electricity and Magnetism',
    description: 'Earth\'s magnetism, compass and navigation',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.EM.4',
    strand: 'Physics - Electricity and Magnetism',
    description: 'the magnetic effect of a current, electromagnets, DC motors (principles only)',
    isStatutory: true
  },

  // PHYSICS - SPACE
  {
    notation: 'UK.KS3.Y9.SC.PHY.SP.1',
    strand: 'Physics - Space Physics',
    description: 'gravity force, weight = mass x gravitational field strength (g), on Earth g=10 N/kg, different on other planets and stars; gravity forces between Earth and Moon, and between Earth and sun (qualitative only)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.SP.2',
    strand: 'Physics - Space Physics',
    description: 'our sun as a star, other stars in our galaxy, other galaxies',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.SP.3',
    strand: 'Physics - Space Physics',
    description: 'the seasons and the Earth\'s tilt, day length at different times of year, in different hemispheres',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.SP.4',
    strand: 'Physics - Space Physics',
    description: 'the light year as a unit of astronomical distance',
    isStatutory: true
  },

  // PHYSICS - MATTER
  {
    notation: 'UK.KS3.Y9.SC.PHY.MA.1',
    strand: 'Physics - Matter',
    description: 'conservation of material and of mass, and reversibility, in melting, freezing, evaporation, sublimation, condensation, dissolving',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.MA.2',
    strand: 'Physics - Matter',
    description: 'similarities and differences, including density differences, between solids, liquids and gases',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.MA.3',
    strand: 'Physics - Matter',
    description: 'the differences in arrangements, in motion and in closeness of particles explaining changes of state, shape and density',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.SC.PHY.MA.4',
    strand: 'Physics - Matter',
    description: 'internal energy stored in materials',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 4: YEAR 10 - GCSE Combined Science (Ages 14-15)
// =============================================================================

const year10Standards: BritishNCScienceStandard[] = [
  // WORKING SCIENTIFICALLY - Development of Scientific Thinking
  {
    notation: 'UK.KS4.Y10.SC.WS.DH.1',
    strand: 'Working Scientifically - Development of Scientific Thinking',
    description: 'understand how scientific methods and theories develop over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.DH.2',
    strand: 'Working Scientifically - Development of Scientific Thinking',
    description: 'use a variety of models such as representational, spatial, descriptive, computational and mathematical to solve problems, make predictions and to develop scientific explanations',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.DH.3',
    strand: 'Working Scientifically - Development of Scientific Thinking',
    description: 'appreciate the power and limitations of science and consider ethical issues which may arise',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.DH.4',
    strand: 'Working Scientifically - Development of Scientific Thinking',
    description: 'explain everyday and technological applications of science; evaluate associated personal, social, economic and environmental implications',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.DH.5',
    strand: 'Working Scientifically - Development of Scientific Thinking',
    description: 'evaluate risks both in practical science and the wider societal context, including perception of risk in relation to data and consequences',
    isStatutory: true
  },
  // WORKING SCIENTIFICALLY - Experimental Skills and Strategies
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.1',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'use scientific theories and explanations to develop hypotheses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.2',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'plan experiments or devise procedures to make observations, produce or characterise a substance, test hypotheses, check data or explore phenomena',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.3',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'apply a knowledge of a range of techniques, instruments, apparatus, and materials to select those appropriate to the experiment',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.4',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'carry out experiments appropriately having due regard for the correct manipulation of apparatus, the accuracy of measurements and health and safety considerations',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.5',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'recognise when to apply a knowledge of sampling techniques to ensure any samples collected are representative',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.ES.6',
    strand: 'Working Scientifically - Experimental Skills and Strategies',
    description: 'make and record observations and measurements using a range of apparatus and methods',
    isStatutory: true
  },
  // WORKING SCIENTIFICALLY - Analysis and Evaluation
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.1',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'apply the cycle of collecting, presenting and analysing data, including using mathematical and statistical analysis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.2',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'present observations and other data using appropriate methods',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.3',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'translate data from one form to another',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.4',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'carry out and represent mathematical and statistical analysis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.5',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'interpret observations and other data, including identifying patterns and trends, making inferences and drawing conclusions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.6',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'present reasoned explanations including relating data to hypotheses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.WS.AE.7',
    strand: 'Working Scientifically - Analysis and Evaluation',
    description: 'be objective, evaluating data in terms of accuracy, precision, repeatability and reproducibility and identifying potential sources of random and systematic error',
    isStatutory: true
  },
  // BIOLOGY - Cell Biology
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.1',
    strand: 'Biology - Cell Biology',
    description: 'explain how eukaryotic and prokaryotic cells can be distinguished on the basis of differences in their structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.2',
    strand: 'Biology - Cell Biology',
    description: 'describe the functions of subcellular structures including the nucleus, cell membrane, cell wall, chloroplasts, mitochondria, vacuole and ribosomes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.3',
    strand: 'Biology - Cell Biology',
    description: 'explain how the main sub-cellular structures of eukaryotic cells are related to their functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.4',
    strand: 'Biology - Cell Biology',
    description: 'describe the role of DNA in determining cell function and protein synthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.5',
    strand: 'Biology - Cell Biology',
    description: 'explain how cells differentiate to become specialised; describe the importance of cell differentiation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.6',
    strand: 'Biology - Cell Biology',
    description: 'describe how mitosis produces two daughter cells that are identical',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.7',
    strand: 'Biology - Cell Biology',
    description: 'describe the stages of the cell cycle, including mitosis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.8',
    strand: 'Biology - Cell Biology',
    description: 'explain the importance of stem cells in embryonic and adult animals and meristems in plants',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.9',
    strand: 'Biology - Cell Biology',
    description: 'evaluate the practical risks and benefits in the use of stem cells in medical research and treatments',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.10',
    strand: 'Biology - Cell Biology',
    description: 'explain how diffusion, osmosis and active transport are used to transport materials in and out of cells',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.CB.11',
    strand: 'Biology - Cell Biology',
    description: 'explain the need for exchange surfaces and transport systems in multicellular organisms',
    isStatutory: true
  },
  // BIOLOGY - Organisation
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.1',
    strand: 'Biology - Organisation',
    description: 'explain how cells are organised into tissues, organs and systems, with examples from the human body',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.2',
    strand: 'Biology - Organisation',
    description: 'describe the structure and function of the digestive system including enzymes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.3',
    strand: 'Biology - Organisation',
    description: 'explain the role of enzymes in digestion and describe how they work as biological catalysts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.4',
    strand: 'Biology - Organisation',
    description: 'describe the human circulatory system including the structure of the heart and blood vessels',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.5',
    strand: 'Biology - Organisation',
    description: 'explain how the heart is adapted to function as a pump',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.6',
    strand: 'Biology - Organisation',
    description: 'describe the composition of blood and the functions of its components',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.7',
    strand: 'Biology - Organisation',
    description: 'explain how the structure of blood vessels is adapted to their function',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.8',
    strand: 'Biology - Organisation',
    description: 'describe cardiovascular diseases and their treatment including coronary heart disease, statins and stents',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.9',
    strand: 'Biology - Organisation',
    description: 'describe the structure of plant tissue systems including transport tissues (xylem and phloem)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.OR.10',
    strand: 'Biology - Organisation',
    description: 'explain how substances are transported in plants via transpiration and translocation',
    isStatutory: true
  },
  // BIOLOGY - Infection and Response
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.1',
    strand: 'Biology - Infection and Response',
    description: 'describe how pathogens including bacteria, viruses, fungi and protists can cause communicable diseases in animals and plants',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.2',
    strand: 'Biology - Infection and Response',
    description: 'explain how spread of diseases can be reduced or prevented',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.3',
    strand: 'Biology - Infection and Response',
    description: 'describe the non-specific defence systems of the human body against pathogens',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.4',
    strand: 'Biology - Infection and Response',
    description: 'explain the role of the immune system in defence against disease',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.5',
    strand: 'Biology - Infection and Response',
    description: 'describe how vaccination prevents illness in an individual and contributes to herd immunity',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.6',
    strand: 'Biology - Infection and Response',
    description: 'explain how antibiotics and painkillers are used to treat disease; discuss antibiotic resistance',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.BIO.IN.7',
    strand: 'Biology - Infection and Response',
    description: 'describe the process of drug discovery, development and testing',
    isStatutory: true
  },
  // CHEMISTRY - Atomic Structure and the Periodic Table
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.1',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'describe the structure of the atom including protons, neutrons and electrons',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.2',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'explain the meaning of atomic number, mass number, isotopes and relative atomic mass',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.3',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'describe the development of the periodic table from Mendeleev to the modern form',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.4',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'explain why elements in the same group in the periodic table have similar properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.5',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'describe the properties and reactions of Group 1 (alkali metals) and Group 7 (halogens)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.6',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'describe the properties of Group 0 (noble gases) and explain trends within the group',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.AS.7',
    strand: 'Chemistry - Atomic Structure and the Periodic Table',
    description: 'describe the properties of transition metals and their compounds',
    isStatutory: true
  },
  // CHEMISTRY - Bonding, Structure and Properties of Matter
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.1',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'explain how ionic bonds are formed by the transfer of electrons',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.2',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'describe the structure of ionic compounds as a regular lattice and explain their properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.3',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'explain how covalent bonds are formed by the sharing of electrons',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.4',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'describe the properties of small molecules and explain them in terms of intermolecular forces',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.5',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'explain the properties of polymers and how their properties are related to their structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.6',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'describe the properties of giant covalent structures including diamond and graphite',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.7',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'describe the properties of metals and explain metallic bonding',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.BS.8',
    strand: 'Chemistry - Bonding, Structure and Properties of Matter',
    description: 'explain how the properties of alloys differ from pure metals',
    isStatutory: true
  },
  // CHEMISTRY - Quantitative Chemistry
  {
    notation: 'UK.KS4.Y10.SC.CHM.QC.1',
    strand: 'Chemistry - Quantitative Chemistry',
    description: 'apply the law of conservation of mass to chemical reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.QC.2',
    strand: 'Chemistry - Quantitative Chemistry',
    description: 'calculate relative formula mass from relative atomic masses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.QC.3',
    strand: 'Chemistry - Quantitative Chemistry',
    description: 'explain the mole concept and use it in calculations involving mass, Mr and amount',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.QC.4',
    strand: 'Chemistry - Quantitative Chemistry',
    description: 'calculate the percentage mass of an element in a compound',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.QC.5',
    strand: 'Chemistry - Quantitative Chemistry',
    description: 'calculate reacting masses using balanced equations',
    isStatutory: true
  },
  // CHEMISTRY - Chemical Changes
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.1',
    strand: 'Chemistry - Chemical Changes',
    description: 'describe the reactions of metals with oxygen, water and dilute acids',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.2',
    strand: 'Chemistry - Chemical Changes',
    description: 'explain the reactivity series of metals in terms of the tendency to form positive ions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.3',
    strand: 'Chemistry - Chemical Changes',
    description: 'explain oxidation and reduction in terms of oxygen and electron transfer',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.4',
    strand: 'Chemistry - Chemical Changes',
    description: 'describe methods of extracting metals from ores depending on reactivity',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.5',
    strand: 'Chemistry - Chemical Changes',
    description: 'explain electrolysis in terms of the movement and discharge of ions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.6',
    strand: 'Chemistry - Chemical Changes',
    description: 'describe the reactions of acids with metals, metal oxides and metal carbonates',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.7',
    strand: 'Chemistry - Chemical Changes',
    description: 'explain neutralisation reactions and the production of salts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.CHM.CC.8',
    strand: 'Chemistry - Chemical Changes',
    description: 'understand the pH scale and use indicators to determine pH',
    isStatutory: true
  },
  // PHYSICS - Energy
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.1',
    strand: 'Physics - Energy',
    description: 'describe energy stores including kinetic, gravitational potential, elastic potential, thermal, chemical, magnetic, electrostatic and nuclear',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.2',
    strand: 'Physics - Energy',
    description: 'explain how energy is transferred between stores by heating, work done by forces, electrical work and wave transfers',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.3',
    strand: 'Physics - Energy',
    description: 'apply the conservation of energy principle to energy transfers',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.4',
    strand: 'Physics - Energy',
    description: 'calculate kinetic energy using Ek = ½mv² and gravitational potential energy using Ep = mgh',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.5',
    strand: 'Physics - Energy',
    description: 'describe power as the rate of energy transfer and calculate using P = E/t and P = W/t',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.6',
    strand: 'Physics - Energy',
    description: 'calculate efficiency of energy transfers and describe ways to reduce unwanted energy transfers',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.7',
    strand: 'Physics - Energy',
    description: 'describe the main energy resources including fossil fuels, nuclear fuel, bio-fuel, wind, hydroelectricity, geothermal, the tides, the Sun and water waves',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EN.8',
    strand: 'Physics - Energy',
    description: 'distinguish between renewable and non-renewable energy resources',
    isStatutory: true
  },
  // PHYSICS - Electricity
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.1',
    strand: 'Physics - Electricity',
    description: 'describe electric current as the rate of flow of charge and calculate using Q = It',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.2',
    strand: 'Physics - Electricity',
    description: 'explain potential difference as the energy transferred per unit charge and calculate using V = W/Q',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.3',
    strand: 'Physics - Electricity',
    description: 'describe resistance and calculate using V = IR',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.4',
    strand: 'Physics - Electricity',
    description: 'investigate the relationship between current and potential difference for different components',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.5',
    strand: 'Physics - Electricity',
    description: 'explain how current and resistance are affected in series and parallel circuits',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.6',
    strand: 'Physics - Electricity',
    description: 'describe the use of thermistors and LDRs in sensing circuits',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.7',
    strand: 'Physics - Electricity',
    description: 'calculate electrical power using P = IV and P = I²R',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.8',
    strand: 'Physics - Electricity',
    description: 'calculate energy transferred using E = Pt and E = QV',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.9',
    strand: 'Physics - Electricity',
    description: 'explain the functions of the live, neutral and earth wires in the domestic supply',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.EL.10',
    strand: 'Physics - Electricity',
    description: 'describe the difference between direct and alternating current',
    isStatutory: true
  },
  // PHYSICS - Particle Model of Matter
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.1',
    strand: 'Physics - Particle Model of Matter',
    description: 'describe the three states of matter in terms of the arrangement, movement and energy of the particles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.2',
    strand: 'Physics - Particle Model of Matter',
    description: 'explain changes of state in terms of kinetic theory and energy changes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.3',
    strand: 'Physics - Particle Model of Matter',
    description: 'explain internal energy as the total kinetic and potential energy of all particles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.4',
    strand: 'Physics - Particle Model of Matter',
    description: 'use the equation for specific heat capacity: E = mcΔθ',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.5',
    strand: 'Physics - Particle Model of Matter',
    description: 'use the equation for specific latent heat: E = mL',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.PM.6',
    strand: 'Physics - Particle Model of Matter',
    description: 'explain how the pressure of a gas is related to temperature and volume',
    isStatutory: true
  },
  // PHYSICS - Atomic Structure
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.1',
    strand: 'Physics - Atomic Structure',
    description: 'describe the structure of the atom and how the model developed over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.2',
    strand: 'Physics - Atomic Structure',
    description: 'explain radioactive decay as the emission of radiation from unstable nuclei',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.3',
    strand: 'Physics - Atomic Structure',
    description: 'describe the properties and uses of alpha, beta and gamma radiation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.4',
    strand: 'Physics - Atomic Structure',
    description: 'explain activity and half-life of radioactive substances',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.5',
    strand: 'Physics - Atomic Structure',
    description: 'describe nuclear fission and nuclear fusion',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.SC.PHY.AS.6',
    strand: 'Physics - Atomic Structure',
    description: 'explain the hazards of ionising radiation and evaluate the risks and benefits of its uses',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 4: YEAR 11 - GCSE Combined Science (Ages 15-16)
// =============================================================================

const year11Standards: BritishNCScienceStandard[] = [
  // BIOLOGY - Bioenergetics
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.1',
    strand: 'Biology - Bioenergetics',
    description: 'describe photosynthesis as an endothermic reaction and write the word and symbol equations',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.2',
    strand: 'Biology - Bioenergetics',
    description: 'explain the effects of light intensity, carbon dioxide concentration and temperature on the rate of photosynthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.3',
    strand: 'Biology - Bioenergetics',
    description: 'describe limiting factors affecting photosynthesis and interpret graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.4',
    strand: 'Biology - Bioenergetics',
    description: 'describe aerobic and anaerobic respiration and compare their products',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.5',
    strand: 'Biology - Bioenergetics',
    description: 'explain why the body needs to supply muscles with extra oxygen during exercise',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.BI.6',
    strand: 'Biology - Bioenergetics',
    description: 'explain the concept of oxygen debt and recovery after exercise',
    isStatutory: true
  },
  // BIOLOGY - Homeostasis and Response
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.1',
    strand: 'Biology - Homeostasis and Response',
    description: 'explain the importance of homeostasis in maintaining optimal conditions for enzyme action',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.2',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe the structure and function of the nervous system including receptors, coordinators and effectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.3',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe the reflex arc and explain its importance in rapid responses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.4',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe the structure and function of the brain and spinal cord',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.5',
    strand: 'Biology - Homeostasis and Response',
    description: 'explain how hormones control metabolic processes and maintain homeostasis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.6',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe the control of blood glucose concentration by insulin and glucagon',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.7',
    strand: 'Biology - Homeostasis and Response',
    description: 'explain Type 1 and Type 2 diabetes and how they can be treated',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.8',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe the role of the kidneys in osmoregulation and excretion',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.9',
    strand: 'Biology - Homeostasis and Response',
    description: 'describe hormonal control of the menstrual cycle and fertility',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.HO.10',
    strand: 'Biology - Homeostasis and Response',
    description: 'explain how plant hormones control and coordinate growth and responses to light and gravity',
    isStatutory: true
  },
  // BIOLOGY - Inheritance, Variation and Evolution
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.1',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe sexual and asexual reproduction and their advantages',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.2',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'explain DNA structure and its role in coding for proteins',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.3',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe meiosis and how it produces gametes with half the chromosome number',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.4',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'use genetic diagrams to predict the outcomes of monohybrid crosses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.5',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe inherited disorders including cystic fibrosis and polydactyly',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.6',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'explain how sex is determined in humans and use genetic diagrams',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.7',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe variation as the result of genetic and environmental causes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.8',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'explain Darwin\'s theory of evolution by natural selection',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.9',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe the development of antibiotic-resistant bacteria as evidence for evolution',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.10',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe selective breeding and genetic engineering and evaluate their implications',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.11',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe the evidence for evolution including fossils and the development of antibiotic resistance',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.IH.12',
    strand: 'Biology - Inheritance, Variation and Evolution',
    description: 'describe classification systems and explain how they have changed over time',
    isStatutory: true
  },
  // BIOLOGY - Ecology
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.1',
    strand: 'Biology - Ecology',
    description: 'describe the levels of organisation within an ecosystem from organism to ecosystem',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.2',
    strand: 'Biology - Ecology',
    description: 'explain how communities are affected by abiotic and biotic factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.3',
    strand: 'Biology - Ecology',
    description: 'describe adaptations of organisms to their environment',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.4',
    strand: 'Biology - Ecology',
    description: 'explain how organisms are interdependent within food chains and food webs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.5',
    strand: 'Biology - Ecology',
    description: 'describe the cycling of materials including carbon and water cycles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.6',
    strand: 'Biology - Ecology',
    description: 'explain the role of microorganisms in decomposition',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.7',
    strand: 'Biology - Ecology',
    description: 'describe human impacts on biodiversity and ecosystems',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.BIO.EC.8',
    strand: 'Biology - Ecology',
    description: 'describe the importance of biodiversity and methods to maintain it',
    isStatutory: true
  },
  // CHEMISTRY - Energy Changes
  {
    notation: 'UK.KS4.Y11.SC.CHM.ER.1',
    strand: 'Chemistry - Energy Changes',
    description: 'describe exothermic and endothermic reactions in terms of energy transfer',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.ER.2',
    strand: 'Chemistry - Energy Changes',
    description: 'explain reaction profiles for exothermic and endothermic reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.ER.3',
    strand: 'Chemistry - Energy Changes',
    description: 'describe the energy changes during bond breaking and bond making',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.ER.4',
    strand: 'Chemistry - Energy Changes',
    description: 'calculate energy changes using bond energies',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.ER.5',
    strand: 'Chemistry - Energy Changes',
    description: 'describe cells and batteries as energy sources and explain how they work',
    isStatutory: true
  },
  // CHEMISTRY - Rate and Extent of Chemical Change
  {
    notation: 'UK.KS4.Y11.SC.CHM.RR.1',
    strand: 'Chemistry - Rate and Extent of Chemical Change',
    description: 'describe factors affecting the rate of chemical reactions including temperature, concentration, pressure and catalysts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.RR.2',
    strand: 'Chemistry - Rate and Extent of Chemical Change',
    description: 'explain collision theory and activation energy',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.RR.3',
    strand: 'Chemistry - Rate and Extent of Chemical Change',
    description: 'calculate rates of reaction from graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.RR.4',
    strand: 'Chemistry - Rate and Extent of Chemical Change',
    description: 'explain reversible reactions and dynamic equilibrium',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.RR.5',
    strand: 'Chemistry - Rate and Extent of Chemical Change',
    description: 'predict the effect of changing conditions on equilibrium position',
    isStatutory: true
  },
  // CHEMISTRY - Organic Chemistry
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.1',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe crude oil as a finite resource and the process of fractional distillation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.2',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe the structure and properties of alkanes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.3',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe cracking and the production of alkenes and hydrogen',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.4',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe the structure and reactions of alkenes including combustion and addition reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.5',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe alcohols and their reactions including combustion and oxidation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.OC.6',
    strand: 'Chemistry - Organic Chemistry',
    description: 'describe carboxylic acids and their reactions',
    isStatutory: true
  },
  // CHEMISTRY - Chemical Analysis
  {
    notation: 'UK.KS4.Y11.SC.CHM.CA.1',
    strand: 'Chemistry - Chemical Analysis',
    description: 'describe the difference between pure substances and mixtures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CA.2',
    strand: 'Chemistry - Chemical Analysis',
    description: 'describe methods of separation including chromatography, filtration, crystallisation and distillation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CA.3',
    strand: 'Chemistry - Chemical Analysis',
    description: 'interpret chromatograms and calculate Rf values',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CA.4',
    strand: 'Chemistry - Chemical Analysis',
    description: 'describe tests for gases including hydrogen, oxygen, carbon dioxide and chlorine',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CA.5',
    strand: 'Chemistry - Chemical Analysis',
    description: 'describe flame tests and tests for carbonates, halides and sulfates',
    isStatutory: true
  },
  // CHEMISTRY - Chemistry of the Atmosphere
  {
    notation: 'UK.KS4.Y11.SC.CHM.CU.1',
    strand: 'Chemistry - Chemistry of the Atmosphere',
    description: 'describe the proportions of gases in the atmosphere and how they have changed over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CU.2',
    strand: 'Chemistry - Chemistry of the Atmosphere',
    description: 'describe theories about how the atmosphere was formed',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CU.3',
    strand: 'Chemistry - Chemistry of the Atmosphere',
    description: 'explain the greenhouse effect and the impact of human activities on climate',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CU.4',
    strand: 'Chemistry - Chemistry of the Atmosphere',
    description: 'describe the carbon footprint and ways to reduce it',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.CU.5',
    strand: 'Chemistry - Chemistry of the Atmosphere',
    description: 'describe atmospheric pollutants from fuels and their effects',
    isStatutory: true
  },
  // CHEMISTRY - Using Resources
  {
    notation: 'UK.KS4.Y11.SC.CHM.UR.1',
    strand: 'Chemistry - Using Resources',
    description: 'describe the use of Earth\'s resources and sustainable development',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.UR.2',
    strand: 'Chemistry - Using Resources',
    description: 'describe potable water and how it is produced from ground water and salt water',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.UR.3',
    strand: 'Chemistry - Using Resources',
    description: 'describe waste water treatment',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.UR.4',
    strand: 'Chemistry - Using Resources',
    description: 'describe the life cycle assessment of products and their environmental impacts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.CHM.UR.5',
    strand: 'Chemistry - Using Resources',
    description: 'describe ways of reducing the use of resources including reduce, reuse and recycle',
    isStatutory: true
  },
  // PHYSICS - Forces
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.1',
    strand: 'Physics - Forces',
    description: 'describe scalar and vector quantities and give examples',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.2',
    strand: 'Physics - Forces',
    description: 'calculate the resultant of two forces acting in one dimension',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.3',
    strand: 'Physics - Forces',
    description: 'describe work done when a force causes an object to move and calculate using W = Fs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.4',
    strand: 'Physics - Forces',
    description: 'describe the relationship between force, spring constant and extension using F = ke',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.5',
    strand: 'Physics - Forces',
    description: 'explain the relationship between distance, speed, velocity and acceleration',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.6',
    strand: 'Physics - Forces',
    description: 'interpret and draw distance-time and velocity-time graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.7',
    strand: 'Physics - Forces',
    description: 'apply Newton\'s first law to explain forces and motion',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.8',
    strand: 'Physics - Forces',
    description: 'apply Newton\'s second law and calculate using F = ma',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.9',
    strand: 'Physics - Forces',
    description: 'explain inertia and Newton\'s third law',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.10',
    strand: 'Physics - Forces',
    description: 'describe stopping distance and factors affecting it',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.11',
    strand: 'Physics - Forces',
    description: 'explain momentum and calculate using p = mv',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.FC.12',
    strand: 'Physics - Forces',
    description: 'apply conservation of momentum to collisions and explosions',
    isStatutory: true
  },
  // PHYSICS - Waves
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.1',
    strand: 'Physics - Waves',
    description: 'describe waves in terms of amplitude, wavelength, frequency and period',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.2',
    strand: 'Physics - Waves',
    description: 'calculate wave speed using v = fλ',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.3',
    strand: 'Physics - Waves',
    description: 'describe the difference between transverse and longitudinal waves',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.4',
    strand: 'Physics - Waves',
    description: 'explain reflection, refraction and transmission of waves at boundaries',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.5',
    strand: 'Physics - Waves',
    description: 'describe the electromagnetic spectrum and its applications',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.6',
    strand: 'Physics - Waves',
    description: 'explain the hazards of electromagnetic radiation and how they depend on frequency',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.7',
    strand: 'Physics - Waves',
    description: 'describe properties and uses of sound waves including ultrasound',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.WV.8',
    strand: 'Physics - Waves',
    description: 'describe seismic waves and what they tell us about Earth\'s structure',
    isStatutory: true
  },
  // PHYSICS - Magnetism and Electromagnetism
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.1',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'describe the properties of magnets and magnetic materials',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.2',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'describe magnetic fields and represent them using field lines',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.3',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'explain how a current-carrying wire produces a magnetic field',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.4',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'describe electromagnets and their uses',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.5',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'explain the motor effect and calculate force using F = BIl',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.6',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'describe how a simple dc motor works',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.7',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'explain electromagnetic induction and how it is used in generators and transformers',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.SC.PHY.MG.8',
    strand: 'Physics - Magnetism and Electromagnetism',
    description: 'describe the structure and function of a transformer and calculate voltage ratios',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 5: YEAR 12 - A-Level Sciences (Ages 16-17)
// =============================================================================

const year12Standards: BritishNCScienceStandard[] = [
  // PRACTICAL SKILLS
  {
    notation: 'UK.KS5.Y12.SC.PS.DE.1',
    strand: 'Practical Skills - Development',
    description: 'independently apply investigative approaches and methods to practical work',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.DE.2',
    strand: 'Practical Skills - Development',
    description: 'safely and correctly use a range of practical equipment and materials',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.DE.3',
    strand: 'Practical Skills - Development',
    description: 'follow written procedures and evaluate them critically',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.ES.1',
    strand: 'Practical Skills - Experimental',
    description: 'make and record observations and measurements with appropriate precision and accuracy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.ES.2',
    strand: 'Practical Skills - Experimental',
    description: 'keep appropriate records of experimental activities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.ES.3',
    strand: 'Practical Skills - Experimental',
    description: 'present data in appropriate ways including using graphs and tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.AE.1',
    strand: 'Practical Skills - Analysis and Evaluation',
    description: 'process, analyse and interpret qualitative and quantitative experimental results',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.AE.2',
    strand: 'Practical Skills - Analysis and Evaluation',
    description: 'use scientific knowledge and understanding to draw conclusions from data',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PS.AE.3',
    strand: 'Practical Skills - Analysis and Evaluation',
    description: 'identify anomalous results and evaluate the reliability of data',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Biological Molecules
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.1',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the structure and properties of monomers and polymers',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.2',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the structure and functions of carbohydrates including monosaccharides, disaccharides and polysaccharides',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.3',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the structure and properties of lipids including triglycerides and phospholipids',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.4',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the structure and function of proteins including amino acids and polypeptides',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.5',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'explain the relationship between protein structure and function',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.6',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe enzyme action and factors affecting enzyme activity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.7',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the structure of DNA and RNA nucleotides',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.8',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe DNA replication and the role of ATP in cellular processes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.BM.9',
    strand: 'A-Level Biology - Biological Molecules',
    description: 'describe the role of water and inorganic ions in biological processes',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Cells
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.1',
    strand: 'A-Level Biology - Cells',
    description: 'describe cell structure using light microscopy and electron microscopy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.2',
    strand: 'A-Level Biology - Cells',
    description: 'explain the structure and function of organelles including nucleus, mitochondria, chloroplasts and ribosomes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.3',
    strand: 'A-Level Biology - Cells',
    description: 'describe the fluid mosaic model of membrane structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.4',
    strand: 'A-Level Biology - Cells',
    description: 'explain cell transport mechanisms including diffusion, facilitated diffusion, osmosis and active transport',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.5',
    strand: 'A-Level Biology - Cells',
    description: 'describe the cell cycle and its regulation including mitosis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.6',
    strand: 'A-Level Biology - Cells',
    description: 'explain the immune response including phagocytosis and the role of T and B lymphocytes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.CL.7',
    strand: 'A-Level Biology - Cells',
    description: 'describe the principles of vaccination and the ethical issues surrounding it',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Organisms Exchange Substances
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.1',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'explain surface area to volume ratio and its importance in gas exchange',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.2',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe gas exchange in fish and insects',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.3',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe the structure and function of the mammalian gas exchange system',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.4',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'explain oxygen dissociation curves and factors affecting oxygen affinity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.5',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe the structure and function of the mammalian heart',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.6',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe the cardiac cycle and its control',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.7',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe the structure and function of blood vessels',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.OE.8',
    strand: 'A-Level Biology - Organisms Exchange Substances',
    description: 'describe mass transport in plants including transpiration and translocation',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Genetic Information
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.1',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe the relationship between genes, DNA and chromosomes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.2',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe the genetic code and its features',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.3',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe transcription and translation in protein synthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.4',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe meiosis and the sources of genetic variation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.5',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe genetic diversity within and between species',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.6',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe investigation of genetic diversity using DNA technology',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.7',
    strand: 'A-Level Biology - Genetic Information',
    description: 'explain natural selection and speciation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.BIO.GI.8',
    strand: 'A-Level Biology - Genetic Information',
    description: 'describe biodiversity within communities and methods of measuring it',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Physical Chemistry A
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.1',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe atomic structure including isotopes and mass spectrometry',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.2',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'explain electron configuration and ionisation energy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.3',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'calculate amounts of substance using moles, molar mass and Avogadro constant',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.4',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'use the ideal gas equation pV = nRT',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.5',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe ionic, covalent and metallic bonding and their properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.6',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'explain shapes of molecules using VSEPR theory',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.7',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe intermolecular forces including van der Waals, dipole-dipole and hydrogen bonding',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.8',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe enthalpy changes and calculate enthalpy using Hess\'s Law',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.9',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'explain collision theory and the effect of conditions on reaction rate',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.10',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe chemical equilibrium and Le Chatelier\'s principle',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.PA.11',
    strand: 'A-Level Chemistry - Physical Chemistry A',
    description: 'describe oxidation states and redox equations',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Inorganic Chemistry A
  {
    notation: 'UK.KS5.Y12.SC.CHM.IA.1',
    strand: 'A-Level Chemistry - Inorganic Chemistry A',
    description: 'describe periodicity and trends in the periodic table',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.IA.2',
    strand: 'A-Level Chemistry - Inorganic Chemistry A',
    description: 'describe the properties and reactions of Group 2 elements',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.IA.3',
    strand: 'A-Level Chemistry - Inorganic Chemistry A',
    description: 'describe the properties and reactions of Group 17 (halogens)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.IA.4',
    strand: 'A-Level Chemistry - Inorganic Chemistry A',
    description: 'describe reactions of halide ions and displacement reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.IA.5',
    strand: 'A-Level Chemistry - Inorganic Chemistry A',
    description: 'describe tests for halide ions using silver nitrate',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Organic Chemistry A
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.1',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe IUPAC nomenclature for organic compounds',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.2',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe reaction mechanisms using curly arrows',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.3',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe the structure and reactions of alkanes including combustion and halogenation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.4',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe the structure and reactions of halogenoalkanes including nucleophilic substitution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.5',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe the structure and reactions of alkenes including electrophilic addition',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.6',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe the structure and reactions of alcohols including oxidation and dehydration',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.CHM.OA.7',
    strand: 'A-Level Chemistry - Organic Chemistry A',
    description: 'describe organic analysis including mass spectrometry and infrared spectroscopy',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Measurements and Errors
  {
    notation: 'UK.KS5.Y12.SC.PHY.MM.1',
    strand: 'A-Level Physics - Measurements and Errors',
    description: 'use SI units and their prefixes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.MM.2',
    strand: 'A-Level Physics - Measurements and Errors',
    description: 'understand limitations of physical measurements',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.MM.3',
    strand: 'A-Level Physics - Measurements and Errors',
    description: 'estimate physical quantities using orders of magnitude',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.MM.4',
    strand: 'A-Level Physics - Measurements and Errors',
    description: 'calculate percentage uncertainty and combine uncertainties',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Particles and Radiation
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.1',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'describe constituents of the atom and the standard model of particle physics',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.2',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'describe stable and unstable nuclei and nuclear reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.3',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'describe particles, antiparticles and photon interactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.4',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'explain particle interactions and exchange particles',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.5',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'classify hadrons and leptons and describe their properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.6',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'describe quarks and the quark model of hadrons',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.7',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'explain the photoelectric effect and photon energy E = hf',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.PM.8',
    strand: 'A-Level Physics - Particles and Radiation',
    description: 'describe wave-particle duality and the de Broglie wavelength',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Waves and Optics
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.1',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'describe progressive waves and their properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.2',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'distinguish between longitudinal and transverse waves',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.3',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'describe and explain polarisation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.4',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'explain refraction, reflection and total internal reflection',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.5',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'describe superposition and stationary waves',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.6',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'explain interference and diffraction',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.7',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'describe Young\'s double-slit experiment and calculate fringe spacing',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.WO.8',
    strand: 'A-Level Physics - Waves and Optics',
    description: 'describe diffraction gratings and their applications',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Mechanics and Materials
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.1',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe scalars and vectors and resolve vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.2',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe moments and couples and apply conditions for equilibrium',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.3',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe motion using equations of uniform acceleration (SUVAT)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.4',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe projectile motion',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.5',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'explain Newton\'s laws of motion and apply to problems',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.6',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'explain momentum and impulse and apply conservation of momentum',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.7',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe work, energy and power and apply the principle of conservation of energy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.8',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe stress, strain and Young modulus',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.ME.9',
    strand: 'A-Level Physics - Mechanics and Materials',
    description: 'describe elastic and plastic deformation',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Electricity
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.1',
    strand: 'A-Level Physics - Electricity',
    description: 'describe current, charge and potential difference',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.2',
    strand: 'A-Level Physics - Electricity',
    description: 'describe resistance and resistivity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.3',
    strand: 'A-Level Physics - Electricity',
    description: 'describe circuits in series and parallel and apply Kirchhoff\'s laws',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.4',
    strand: 'A-Level Physics - Electricity',
    description: 'describe internal resistance and EMF',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.5',
    strand: 'A-Level Physics - Electricity',
    description: 'describe potential dividers and their applications',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.SC.PHY.EL.6',
    strand: 'A-Level Physics - Electricity',
    description: 'explain the use of oscilloscopes to display waveforms',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 5: YEAR 13 - A-Level Sciences (Ages 17-18)
// =============================================================================

const year13Standards: BritishNCScienceStandard[] = [
  // A-LEVEL BIOLOGY - Energy Transfers
  {
    notation: 'UK.KS5.Y13.SC.BIO.ET.1',
    strand: 'A-Level Biology - Energy Transfers',
    description: 'describe photosynthesis including light-dependent and light-independent reactions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.ET.2',
    strand: 'A-Level Biology - Energy Transfers',
    description: 'describe respiration including glycolysis, Krebs cycle and oxidative phosphorylation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.ET.3',
    strand: 'A-Level Biology - Energy Transfers',
    description: 'explain energy transfer through ecosystems',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.ET.4',
    strand: 'A-Level Biology - Energy Transfers',
    description: 'describe the nitrogen cycle and the role of microorganisms',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.ET.5',
    strand: 'A-Level Biology - Energy Transfers',
    description: 'describe nutrient cycles and their importance',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Response to Stimuli and Genes
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.1',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'describe stimuli, receptors and effectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.2',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'describe the nerve impulse and its transmission across synapses',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.3',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'describe skeletal muscle structure and sliding filament theory',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.4',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'describe homeostatic control including negative feedback',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.5',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'describe hormonal communication and the endocrine system',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.RG.6',
    strand: 'A-Level Biology - Response to Stimuli and Genes',
    description: 'explain the control of blood glucose concentration',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Genetics, Populations and Ecosystems
  {
    notation: 'UK.KS5.Y13.SC.BIO.GE.1',
    strand: 'A-Level Biology - Genetics, Populations and Ecosystems',
    description: 'describe inheritance patterns including dihybrid crosses and epistasis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.GE.2',
    strand: 'A-Level Biology - Genetics, Populations and Ecosystems',
    description: 'explain population genetics and the Hardy-Weinberg principle',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.GE.3',
    strand: 'A-Level Biology - Genetics, Populations and Ecosystems',
    description: 'describe the effects of selection on allele frequencies',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.GE.4',
    strand: 'A-Level Biology - Genetics, Populations and Ecosystems',
    description: 'describe succession and the development of climax communities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.GE.5',
    strand: 'A-Level Biology - Genetics, Populations and Ecosystems',
    description: 'describe conservation of species and ecosystems',
    isStatutory: true
  },
  // A-LEVEL BIOLOGY - Control of Gene Expression
  {
    notation: 'UK.KS5.Y13.SC.BIO.CN.1',
    strand: 'A-Level Biology - Control of Gene Expression',
    description: 'describe mutations and their effects on gene expression',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.CN.2',
    strand: 'A-Level Biology - Control of Gene Expression',
    description: 'describe gene expression control in prokaryotes and eukaryotes',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.CN.3',
    strand: 'A-Level Biology - Control of Gene Expression',
    description: 'describe epigenetics and its role in gene expression',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.CN.4',
    strand: 'A-Level Biology - Control of Gene Expression',
    description: 'describe recombinant DNA technology and its applications',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.BIO.CN.5',
    strand: 'A-Level Biology - Control of Gene Expression',
    description: 'describe gene therapy and evaluate ethical issues',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Physical Chemistry B
  {
    notation: 'UK.KS5.Y13.SC.CHM.PB.1',
    strand: 'A-Level Chemistry - Physical Chemistry B',
    description: 'describe thermodynamics including entropy and Gibbs free energy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.PB.2',
    strand: 'A-Level Chemistry - Physical Chemistry B',
    description: 'describe rate equations and determine order of reaction',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.PB.3',
    strand: 'A-Level Chemistry - Physical Chemistry B',
    description: 'calculate and use equilibrium constants Kp and Kc',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.PB.4',
    strand: 'A-Level Chemistry - Physical Chemistry B',
    description: 'describe acids, bases and buffers including pH calculations',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.PB.5',
    strand: 'A-Level Chemistry - Physical Chemistry B',
    description: 'describe electrochemistry including electrode potentials and electrochemical cells',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Inorganic Chemistry B
  {
    notation: 'UK.KS5.Y13.SC.CHM.IB.1',
    strand: 'A-Level Chemistry - Inorganic Chemistry B',
    description: 'describe properties of Period 3 elements and their oxides',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.IB.2',
    strand: 'A-Level Chemistry - Inorganic Chemistry B',
    description: 'describe properties and reactions of transition metals',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.IB.3',
    strand: 'A-Level Chemistry - Inorganic Chemistry B',
    description: 'explain complex ion formation and ligand substitution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.IB.4',
    strand: 'A-Level Chemistry - Inorganic Chemistry B',
    description: 'describe reactions of metal aqua ions',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Organic Chemistry B
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.1',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe optical isomerism and stereochemistry',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.2',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe the chemistry of aldehydes and ketones',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.3',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe the chemistry of carboxylic acids and their derivatives',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.4',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe the chemistry of aromatics including electrophilic substitution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.5',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe the chemistry of amines',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.6',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe polymers including condensation polymers and their properties',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.7',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe amino acids, proteins and DNA structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.OB.8',
    strand: 'A-Level Chemistry - Organic Chemistry B',
    description: 'describe organic synthesis pathways and retrosynthetic analysis',
    isStatutory: true
  },
  // A-LEVEL CHEMISTRY - Analytical Techniques
  {
    notation: 'UK.KS5.Y13.SC.CHM.AN.1',
    strand: 'A-Level Chemistry - Analytical Techniques',
    description: 'describe NMR spectroscopy including chemical shift and spin-spin coupling',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.AN.2',
    strand: 'A-Level Chemistry - Analytical Techniques',
    description: 'interpret spectra to deduce molecular structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.CHM.AN.3',
    strand: 'A-Level Chemistry - Analytical Techniques',
    description: 'describe chromatographic techniques including gas chromatography',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Further Mechanics and Thermal Physics
  {
    notation: 'UK.KS5.Y13.SC.PHY.FM.1',
    strand: 'A-Level Physics - Further Mechanics and Thermal Physics',
    description: 'describe circular motion and calculate centripetal force and acceleration',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FM.2',
    strand: 'A-Level Physics - Further Mechanics and Thermal Physics',
    description: 'describe simple harmonic motion and its characteristics',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FM.3',
    strand: 'A-Level Physics - Further Mechanics and Thermal Physics',
    description: 'describe forced vibrations and resonance',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FM.4',
    strand: 'A-Level Physics - Further Mechanics and Thermal Physics',
    description: 'describe thermal energy transfer and specific heat capacity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FM.5',
    strand: 'A-Level Physics - Further Mechanics and Thermal Physics',
    description: 'describe the ideal gas laws and molecular kinetic theory',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Fields and their Consequences
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.1',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe gravitational fields and calculate gravitational field strength',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.2',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe gravitational potential and calculate orbital mechanics',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.3',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe electric fields and calculate electric field strength',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.4',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe electric potential and capacitance',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.5',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe magnetic fields and calculate magnetic flux density',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.6',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'explain electromagnetic induction and Faraday\'s law',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.FD.7',
    strand: 'A-Level Physics - Fields and their Consequences',
    description: 'describe alternating currents and transformers',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Nuclear Physics
  {
    notation: 'UK.KS5.Y13.SC.PHY.NP.1',
    strand: 'A-Level Physics - Nuclear Physics',
    description: 'describe radioactive decay and calculate activity and half-life',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.NP.2',
    strand: 'A-Level Physics - Nuclear Physics',
    description: 'describe nuclear instability and binding energy',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.NP.3',
    strand: 'A-Level Physics - Nuclear Physics',
    description: 'describe nuclear fission and fusion',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.NP.4',
    strand: 'A-Level Physics - Nuclear Physics',
    description: 'explain mass-energy equivalence using E = mc²',
    isStatutory: true
  },
  // A-LEVEL PHYSICS - Optional: Astrophysics
  {
    notation: 'UK.KS5.Y13.SC.PHY.AP.1',
    strand: 'A-Level Physics - Astrophysics (optional)',
    description: 'describe telescopes and their properties',
    isStatutory: false,
    guidance: 'Optional topic - Astrophysics'
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.AP.2',
    strand: 'A-Level Physics - Astrophysics (optional)',
    description: 'describe stellar classification and Hertzsprung-Russell diagrams',
    isStatutory: false,
    guidance: 'Optional topic - Astrophysics'
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.AP.3',
    strand: 'A-Level Physics - Astrophysics (optional)',
    description: 'describe cosmology including the Big Bang and evidence for it',
    isStatutory: false,
    guidance: 'Optional topic - Astrophysics'
  },
  {
    notation: 'UK.KS5.Y13.SC.PHY.AP.4',
    strand: 'A-Level Physics - Astrophysics (optional)',
    description: 'describe Hubble\'s law and the expansion of the universe',
    isStatutory: false,
    guidance: 'Optional topic - Astrophysics'
  }
];

// =============================================================================
// BRITISH NATIONAL CURRICULUM SCIENCE DATA EXPORT
// =============================================================================

export const britishNCScience: BritishNCScienceJurisdiction = {
  code: 'UK_NATIONAL_CURRICULUM',
  name: 'British National Curriculum',
  country: 'GB',
  version: '2014 (verified 2025)',
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',
  years: [
    { year: 1, keyStage: 1, ageRangeMin: 5, ageRangeMax: 6, standards: year1Standards },
    { year: 2, keyStage: 1, ageRangeMin: 6, ageRangeMax: 7, standards: year2Standards },
    { year: 3, keyStage: 2, ageRangeMin: 7, ageRangeMax: 8, standards: year3Standards },
    { year: 4, keyStage: 2, ageRangeMin: 8, ageRangeMax: 9, standards: year4Standards },
    { year: 5, keyStage: 2, ageRangeMin: 9, ageRangeMax: 10, standards: year5Standards },
    { year: 6, keyStage: 2, ageRangeMin: 10, ageRangeMax: 11, standards: year6Standards },
    { year: 7, keyStage: 3, ageRangeMin: 11, ageRangeMax: 12, standards: year7Standards },
    { year: 8, keyStage: 3, ageRangeMin: 12, ageRangeMax: 13, standards: year8Standards },
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards },
    { year: 10, keyStage: 4, ageRangeMin: 14, ageRangeMax: 15, standards: year10Standards },
    { year: 11, keyStage: 4, ageRangeMin: 15, ageRangeMax: 16, standards: year11Standards },
    { year: 12, keyStage: 5, ageRangeMin: 16, ageRangeMax: 17, standards: year12Standards },
    { year: 13, keyStage: 5, ageRangeMin: 17, ageRangeMax: 18, standards: year13Standards }
  ]
};

// Helper functions
export function getScienceStandardsForYear(year: number): BritishNCScienceStandard[] {
  const yearData = britishNCScience.years.find(y => y.year === year);
  return yearData?.standards || [];
}

export function getScienceStandardsForKeyStage(keyStage: number): BritishNCScienceStandard[] {
  return britishNCScience.years
    .filter(y => y.keyStage === keyStage)
    .flatMap(y => y.standards);
}

export function getTotalScienceStandardsCount(): number {
  return britishNCScience.years.reduce((sum, y) => sum + y.standards.length, 0);
}

export default britishNCScience;
