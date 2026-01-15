/**
 * British National Curriculum - Science Standards
 * Years 1-9 (Key Stages 1, 2, and 3)
 *
 * Source: GOV.UK National Curriculum in England
 * https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study
 *
 * VERIFIED: 2025-01-15 against official GOV.UK documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.SC.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1, 2, or 3)
 * - Y = Year (1-9)
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
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards }
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
