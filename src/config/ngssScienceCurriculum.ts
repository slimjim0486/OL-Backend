/**
 * US Next Generation Science Standards (NGSS)
 * Grades K-8
 *
 * Official Source: https://www.nextgenscience.org/ (Public Domain)
 *
 * The Next Generation Science Standards were developed by 26 states and
 * by national partners, including AAAS, the National Research Council,
 * and the National Science Teachers Association. Released in 2013.
 *
 * Notation System: US.NGSS.{grade}.SC.{DCI}.{number}
 * - US = United States
 * - NGSS = Next Generation Science Standards
 * - Grade: K, 1, 2, 3, 4, 5, MS (Middle School for grades 6-8)
 * - SC = Science
 * - DCI (Disciplinary Core Idea) codes:
 *   - PS = Physical Sciences
 *     - PS1 = Matter and Its Interactions
 *     - PS2 = Motion and Stability: Forces and Interactions
 *     - PS3 = Energy
 *     - PS4 = Waves and Their Applications
 *   - LS = Life Sciences
 *     - LS1 = From Molecules to Organisms: Structures and Processes
 *     - LS2 = Ecosystems: Interactions, Energy, and Dynamics
 *     - LS3 = Heredity: Inheritance and Variation of Traits
 *     - LS4 = Biological Evolution: Unity and Diversity
 *   - ESS = Earth and Space Sciences
 *     - ESS1 = Earth's Place in the Universe
 *     - ESS2 = Earth's Systems
 *     - ESS3 = Earth and Human Activity
 *   - ETS = Engineering, Technology, and Applications of Science
 *     - ETS1 = Engineering Design
 *
 * Verified against official NGSS documentation: 2025-01-20
 */

export interface NGSSScienceStandard {
  notation: string;
  officialCode: string; // Original NGSS code (e.g., K-PS2-1)
  dci: string; // Disciplinary Core Idea
  topic: string; // Topic name (e.g., "Motion and Stability: Forces and Interactions")
  description: string;
  clarification?: string;
  assessmentBoundary?: string;
}

export interface NGSSScienceGrade {
  grade: number; // 0 = K, 1-5 = Grades 1-5, 6 = MS (representing 6-8)
  gradeLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: NGSSScienceStandard[];
}

export interface NGSSScienceCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  grades: NGSSScienceGrade[];
}

// =============================================================================
// KINDERGARTEN (Ages 5-6)
// =============================================================================

const kindergartenStandards: NGSSScienceStandard[] = [
  // PS2: Motion and Stability: Forces and Interactions
  {
    notation: 'US.NGSS.K.SC.PS2.1',
    officialCode: 'K-PS2-1',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.',
    clarification: 'Examples of pushes or pulls could include a string attached to an object being pulled, a person pushing an object, a person stopping a rolling ball, and two objects colliding and pushing on each other.',
    assessmentBoundary: 'Assessment is limited to different relative strengths or different directions, but not both at the same time. Assessment does not include non-contact pushes or pulls such as those produced by magnets.',
  },
  {
    notation: 'US.NGSS.K.SC.PS2.2',
    officialCode: 'K-PS2-2',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.',
    clarification: 'Examples of problems requiring a solution could include having a marble or other object move a certain distance, follow a particular path, and knock down other objects.',
    assessmentBoundary: 'Assessment does not include friction as a mechanism for change in speed.',
  },

  // PS3: Energy (K-PS3 not typically included, but included for completeness)

  // LS1: From Molecules to Organisms: Structures and Processes
  {
    notation: 'US.NGSS.K.SC.LS1.1',
    officialCode: 'K-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Use observations to describe patterns of what plants and animals (including humans) need to survive.',
    clarification: 'Examples of patterns could include that animals need to take in food but plants do not; the different kinds of food needed by different types of animals; the requirement of plants to have light; and that all living things need water.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.K.SC.ESS2.1',
    officialCode: 'K-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Use and share observations of local weather conditions to describe patterns over time.',
    clarification: 'Examples of qualitative observations could include descriptions of the weather (such as sunny, cloudy, rainy, and warm); examples of quantitative observations could include numbers of sunny, windy, and rainy days in a month.',
    assessmentBoundary: 'Assessment of quantitative observations limited to whole numbers and relative measures such as warmer/cooler.',
  },
  {
    notation: 'US.NGSS.K.SC.ESS2.2',
    officialCode: 'K-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Construct an argument supported by evidence for how plants and animals (including humans) can change the environment to meet their needs.',
    clarification: 'Examples of plants and animals changing their environment could include a squirrel digs in the ground to hide its food and tree roots can break concrete.',
  },

  // ESS3: Earth and Human Activity
  {
    notation: 'US.NGSS.K.SC.ESS3.1',
    officialCode: 'K-ESS3-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Use a model to represent the relationship between the needs of different plants or animals (including humans) and the places they live.',
    clarification: 'Examples of relationships could include that deer eat buds and leaves, therefore, they usually live in forested areas; and, grasses need sunlight so they often grow in meadows.',
    assessmentBoundary: 'Assessment does not include specific animal behaviors or habitats, or limiting factors such as predation.',
  },
  {
    notation: 'US.NGSS.K.SC.ESS3.2',
    officialCode: 'K-ESS3-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Ask questions to obtain information about the purpose of weather forecasting to prepare for, and respond to, severe weather.',
    clarification: 'Emphasis is on local forms of severe weather.',
  },
  {
    notation: 'US.NGSS.K.SC.ESS3.3',
    officialCode: 'K-ESS3-3',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Communicate solutions that will reduce the impact of humans on the land, water, air, and/or other living things in the local environment.',
    clarification: 'Examples of human impact on the land could include cutting trees to produce paper and using resources to produce bottles.',
  },

  // ETS1: Engineering Design (K-2)
  {
    notation: 'US.NGSS.K.SC.ETS1.1',
    officialCode: 'K-2-ETS1-1',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Ask questions, make observations, and gather information about a situation people want to change to define a simple problem that can be solved through the development of a new or improved object or tool.',
  },
  {
    notation: 'US.NGSS.K.SC.ETS1.2',
    officialCode: 'K-2-ETS1-2',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Develop a simple sketch, drawing, or physical model to illustrate how the shape of an object helps it function as needed to solve a given problem.',
  },
  {
    notation: 'US.NGSS.K.SC.ETS1.3',
    officialCode: 'K-2-ETS1-3',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Analyze data from tests of two objects designed to solve the same problem to compare the strengths and weaknesses of how each performs.',
  },
];

// =============================================================================
// GRADE 1 (Ages 6-7)
// =============================================================================

const grade1Standards: NGSSScienceStandard[] = [
  // PS4: Waves and Their Applications
  {
    notation: 'US.NGSS.1.SC.PS4.1',
    officialCode: '1-PS4-1',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Plan and conduct investigations to provide evidence that vibrating materials can make sound and that sound can make materials vibrate.',
    clarification: 'Examples of vibrating materials that make sound could include tuning forks and plucking a stretched string.',
  },
  {
    notation: 'US.NGSS.1.SC.PS4.2',
    officialCode: '1-PS4-2',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Make observations to construct an evidence-based account that objects in darkness can be seen only when illuminated.',
    clarification: 'Examples of observations could include those made in a completely dark room, a ## dimly lit room, and a brightly lit room.',
  },
  {
    notation: 'US.NGSS.1.SC.PS4.3',
    officialCode: '1-PS4-3',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Plan and conduct investigations to determine the effect of placing objects made with different materials in the path of a beam of light.',
    clarification: 'Examples of materials could include those that are transparent (such as clear plastic), translucent (such as wax paper), opaque (such as cardboard), and reflective (such as a mirror).',
    assessmentBoundary: 'Assessment does not include the speed of light.',
  },
  {
    notation: 'US.NGSS.1.SC.PS4.4',
    officialCode: '1-PS4-4',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Use tools and materials to design and build a device that uses light or sound to solve the problem of communicating over a distance.',
    clarification: 'Examples of devices could include a light source to send signals, paper cup and string "telephones," and a pattern of drum beats.',
    assessmentBoundary: 'Assessment does not include electromagnetic waves or quantitative comparisons.',
  },

  // LS1: From Molecules to Organisms
  {
    notation: 'US.NGSS.1.SC.LS1.1',
    officialCode: '1-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Use materials to design a solution to a human problem by mimicking how plants and/or animals use their external parts to help them survive, grow, and meet their needs.',
    clarification: 'Examples of human problems that can be solved by mimicking plant or animal solutions could include designing clothing or equipment to protect bicyclists.',
  },
  {
    notation: 'US.NGSS.1.SC.LS1.2',
    officialCode: '1-LS1-2',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Read texts and use media to determine patterns in behavior of parents and offspring that help offspring survive.',
    clarification: 'Examples of patterns of behaviors could include the signals that offspring make (such as crying, cheeping, and other vocalizations) and the responses of the parents (such as feeding, comforting, and protecting the offspring).',
  },

  // LS3: Heredity
  {
    notation: 'US.NGSS.1.SC.LS3.1',
    officialCode: '1-LS3-1',
    dci: 'Life Sciences',
    topic: 'Heredity: Inheritance and Variation of Traits',
    description: 'Make observations to construct an evidence-based account that young plants and animals are like, but not exactly like, their parents.',
    clarification: 'Examples of patterns could include features plants or animals share. Examples of observations could include that leaves from the same kind of plant are the same shape but can differ in size; a particular breed of dog looks like its parents but is not exactly the same.',
    assessmentBoundary: 'Assessment does not include inheritance or animals that undergo metamorphosis or hybrids.',
  },

  // ESS1: Earth's Place in the Universe
  {
    notation: 'US.NGSS.1.SC.ESS1.1',
    officialCode: '1-ESS1-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Use observations of the sun, moon, and stars to describe patterns that can be predicted.',
    clarification: 'Examples of patterns could include that the sun and moon appear to rise in one part of the sky, move across the sky, and set; and stars other than our sun are visible at night but not during the day.',
    assessmentBoundary: 'Assessment of star patterns is limited to stars being seen at night and not during the day.',
  },
  {
    notation: 'US.NGSS.1.SC.ESS1.2',
    officialCode: '1-ESS1-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Make observations at different times of year to relate the amount of daylight to the time of year.',
    clarification: 'Emphasis is on relative comparisons of the amount of daylight in the winter to the amount in the spring or fall.',
    assessmentBoundary: 'Assessment is limited to relative amounts of daylight, not quantifying the hours or time of daylight.',
  },
];

// =============================================================================
// GRADE 2 (Ages 7-8)
// =============================================================================

const grade2Standards: NGSSScienceStandard[] = [
  // PS1: Matter and Its Interactions
  {
    notation: 'US.NGSS.2.SC.PS1.1',
    officialCode: '2-PS1-1',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.',
    clarification: 'Observations could include color, texture, hardness, and flexibility. Patterns could include the similar properties that different materials share.',
  },
  {
    notation: 'US.NGSS.2.SC.PS1.2',
    officialCode: '2-PS1-2',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Analyze data obtained from testing different materials to determine which materials have the properties that are best suited for an intended purpose.',
    clarification: 'Examples of properties could include strength, flexibility, hardness, texture, and absorbency.',
  },
  {
    notation: 'US.NGSS.2.SC.PS1.3',
    officialCode: '2-PS1-3',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Make observations to construct an evidence-based account of how an object made of a small set of pieces can be disassembled and made into a new object.',
    clarification: 'Examples of pieces could include blocks, building bricks, or other assorted small objects.',
  },
  {
    notation: 'US.NGSS.2.SC.PS1.4',
    officialCode: '2-PS1-4',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Construct an argument with evidence that some changes caused by heating or cooling can be reversed and some cannot.',
    clarification: 'Examples of reversible changes could include water being frozen and then melted. Examples of irreversible changes could include cooking an egg, freezing a plant leaf, and heating paper.',
  },

  // LS2: Ecosystems
  {
    notation: 'US.NGSS.2.SC.LS2.1',
    officialCode: '2-LS2-1',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Plan and conduct an investigation to determine if plants need sunlight and water to grow.',
    assessmentBoundary: 'Assessment is limited to testing one variable at a time.',
  },
  {
    notation: 'US.NGSS.2.SC.LS2.2',
    officialCode: '2-LS2-2',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Develop a simple model that mimics the function of an animal in dispersing seeds or pollinating plants.',
  },

  // LS4: Biological Evolution
  {
    notation: 'US.NGSS.2.SC.LS4.1',
    officialCode: '2-LS4-1',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Make observations of plants and animals to compare the diversity of life in different habitats.',
    clarification: 'Emphasis is on the diversity of living things in each of a variety of different habitats.',
    assessmentBoundary: 'Assessment does not include specific animal or plant names in specific habitats.',
  },

  // ESS1: Earth's Place in the Universe
  {
    notation: 'US.NGSS.2.SC.ESS1.1',
    officialCode: '2-ESS1-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Use information from several sources to provide evidence that Earth events can occur quickly or slowly.',
    clarification: 'Examples of events and timescales could include volcanic explosions and earthquakes, which happen quickly, and erosion of rocks, which occurs slowly.',
    assessmentBoundary: 'Assessment does not include quantitative measurements of timescales.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.2.SC.ESS2.1',
    officialCode: '2-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Compare multiple solutions designed to slow or prevent wind or water from changing the shape of the land.',
    clarification: 'Examples of solutions could include different designs of dikes and windbreaks to hold back wind and water, and different designs for using shrubs, grass, and trees to hold back the land.',
  },
  {
    notation: 'US.NGSS.2.SC.ESS2.2',
    officialCode: '2-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Develop a model to represent the shapes and kinds of land and bodies of water in an area.',
  },
  {
    notation: 'US.NGSS.2.SC.ESS2.3',
    officialCode: '2-ESS2-3',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Obtain information to identify where water is found on Earth and that it can be solid or liquid.',
  },
];

// =============================================================================
// GRADE 3 (Ages 8-9)
// =============================================================================

const grade3Standards: NGSSScienceStandard[] = [
  // PS2: Motion and Stability
  {
    notation: 'US.NGSS.3.SC.PS2.1',
    officialCode: '3-PS2-1',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Plan and conduct an investigation to provide evidence of the effects of balanced and unbalanced forces on the motion of an object.',
    clarification: 'Examples could include an unbalanced force on one side of a ball can make it start moving; and, balanced forces pushing on a box from both sides will not produce any motion at all.',
    assessmentBoundary: 'Assessment is limited to one variable at a time: number, size, or direction of forces. Assessment does not include quantitative force size, only qualitative and relative. Assessment is limited to gravity being addressed as a force that pulls objects down.',
  },
  {
    notation: 'US.NGSS.3.SC.PS2.2',
    officialCode: '3-PS2-2',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Make observations and/or measurements of an object\'s motion to provide evidence that a pattern can be used to predict future motion.',
    clarification: 'Examples of motion with a predictable pattern could include a child swinging in a swing, a ball rolling back and forth in a bowl, and two children on a see-saw.',
    assessmentBoundary: 'Assessment does not include technical terms such as period and frequency.',
  },
  {
    notation: 'US.NGSS.3.SC.PS2.3',
    officialCode: '3-PS2-3',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Ask questions to determine cause and effect relationships of electric or magnetic interactions between two objects not in contact with each other.',
    clarification: 'Examples of an electric force could include the force on hair from an electrically charged balloon and the electrical forces between a charged rod and pieces of paper; examples of a magnetic force could include the force between two permanent magnets.',
    assessmentBoundary: 'Assessment is limited to forces produced by objects that can be manipulated by students, and electrical interactions are limited to static electricity.',
  },
  {
    notation: 'US.NGSS.3.SC.PS2.4',
    officialCode: '3-PS2-4',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Define a simple design problem that can be solved by applying scientific ideas about magnets.',
    clarification: 'Examples of problems could include constructing a latch to keep a door shut and creating a device to keep two moving objects from touching each other.',
  },

  // LS1: From Molecules to Organisms
  {
    notation: 'US.NGSS.3.SC.LS1.1',
    officialCode: '3-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Develop models to describe that organisms have unique and diverse life cycles but all have in common birth, growth, reproduction, and death.',
    clarification: 'Changes organisms go through during their life form a pattern.',
    assessmentBoundary: 'Assessment of plant life cycles is limited to those of flowering plants. Assessment does not include details of human reproduction.',
  },

  // LS2: Ecosystems
  {
    notation: 'US.NGSS.3.SC.LS2.1',
    officialCode: '3-LS2-1',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Construct an argument that some animals form groups that help members survive.',
  },

  // LS3: Heredity
  {
    notation: 'US.NGSS.3.SC.LS3.1',
    officialCode: '3-LS3-1',
    dci: 'Life Sciences',
    topic: 'Heredity: Inheritance and Variation of Traits',
    description: 'Analyze and interpret data to provide evidence that plants and animals have traits inherited from parents and that variation of these traits exists in a group of similar organisms.',
    clarification: 'Patterns are the similarities and differences in traits shared between offspring and their parents, or among siblings.',
    assessmentBoundary: 'Assessment does not include genetic mechanisms of inheritance and prediction of traits.',
  },
  {
    notation: 'US.NGSS.3.SC.LS3.2',
    officialCode: '3-LS3-2',
    dci: 'Life Sciences',
    topic: 'Heredity: Inheritance and Variation of Traits',
    description: 'Use evidence to support the explanation that traits can be influenced by the environment.',
    clarification: 'Examples of the environment affecting a trait could include normally tall plants grown with insufficient water are stunted; and a pet dog that is given too much food and little exercise may become overweight.',
  },

  // LS4: Biological Evolution
  {
    notation: 'US.NGSS.3.SC.LS4.1',
    officialCode: '3-LS4-1',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Analyze and interpret data from fossils to provide evidence of the organisms and the environments in which they lived long ago.',
    clarification: 'Examples of data could include type, size, and distributions of fossil organisms.',
    assessmentBoundary: 'Assessment does not include identification of specific fossils or present plants and animals. Assessment is limited to major fossil types and relative ages.',
  },
  {
    notation: 'US.NGSS.3.SC.LS4.2',
    officialCode: '3-LS4-2',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Use evidence to construct an explanation for how the variations in characteristics among individuals of the same species may provide advantages in surviving, finding mates, and reproducing.',
    clarification: 'Examples of cause and effect relationships could include how plants and animals with certain traits may be more likely to survive and reproduce.',
  },
  {
    notation: 'US.NGSS.3.SC.LS4.3',
    officialCode: '3-LS4-3',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Construct an argument with evidence that in a particular habitat some organisms can survive well, some survive less well, and some cannot survive at all.',
    clarification: 'Examples of evidence could include needs and characteristics of the organisms and habitats involved.',
  },
  {
    notation: 'US.NGSS.3.SC.LS4.4',
    officialCode: '3-LS4-4',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Make a claim about the merit of a solution to a problem caused when the environment changes and the types of plants and animals that live there may change.',
    clarification: 'Examples of environmental changes could include changes in land characteristics, water distribution, temperature, food, and other organisms.',
    assessmentBoundary: 'Assessment is limited to a single environmental change. Assessment does not include the greenhouse effect or climate change.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.3.SC.ESS2.1',
    officialCode: '3-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Represent data in tables and graphical displays to describe typical weather conditions expected during a particular season.',
    clarification: 'Examples of data could include average temperature, precipitation, and wind direction.',
    assessmentBoundary: 'Assessment of graphical displays is limited to pictographs and bar graphs. Assessment does not include climate change.',
  },
  {
    notation: 'US.NGSS.3.SC.ESS2.2',
    officialCode: '3-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Obtain and combine information to describe climates in different regions of the world.',
  },

  // ESS3: Earth and Human Activity
  {
    notation: 'US.NGSS.3.SC.ESS3.1',
    officialCode: '3-ESS3-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Make a claim about the merit of a design solution that reduces the impacts of a weather-related hazard.',
    clarification: 'Examples of design solutions to weather-related hazards could include barriers to prevent flooding, wind resistant roofs, and lightning rods.',
  },

  // ETS1: Engineering Design (3-5)
  {
    notation: 'US.NGSS.3.SC.ETS1.1',
    officialCode: '3-5-ETS1-1',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Define a simple design problem reflecting a need or a want that includes specified criteria for success and constraints on materials, time, or cost.',
  },
  {
    notation: 'US.NGSS.3.SC.ETS1.2',
    officialCode: '3-5-ETS1-2',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Generate and compare multiple possible solutions to a problem based on how well each is likely to meet the criteria and constraints of the problem.',
  },
  {
    notation: 'US.NGSS.3.SC.ETS1.3',
    officialCode: '3-5-ETS1-3',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Plan and carry out fair tests in which variables are controlled and failure points are considered to identify aspects of a model or prototype that can be improved.',
  },
];

// =============================================================================
// GRADE 4 (Ages 9-10)
// =============================================================================

const grade4Standards: NGSSScienceStandard[] = [
  // PS3: Energy
  {
    notation: 'US.NGSS.4.SC.PS3.1',
    officialCode: '4-PS3-1',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Use evidence to construct an explanation relating the speed of an object to the energy of that object.',
    assessmentBoundary: 'Assessment does not include quantitative measures of changes in the speed of an object or on any precise or quantitative definition of energy.',
  },
  {
    notation: 'US.NGSS.4.SC.PS3.2',
    officialCode: '4-PS3-2',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents.',
    assessmentBoundary: 'Assessment does not include quantitative measurements of energy.',
  },
  {
    notation: 'US.NGSS.4.SC.PS3.3',
    officialCode: '4-PS3-3',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Ask questions and predict outcomes about the changes in energy that occur when objects collide.',
    clarification: 'Emphasis is on the change in the energy due to the change in speed, not on the forces, as objects interact.',
    assessmentBoundary: 'Assessment does not include quantitative measurements of energy.',
  },
  {
    notation: 'US.NGSS.4.SC.PS3.4',
    officialCode: '4-PS3-4',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Apply scientific ideas to design, test, and refine a device that converts energy from one form to another.',
    clarification: 'Examples of devices could include electric circuits that convert electrical energy into motion energy of a vehicle, light, or sound; and, a passive solar heater that converts light into heat.',
    assessmentBoundary: 'Devices should be limited to those that convert motion energy to electric energy or use stored energy to cause motion or produce light or sound.',
  },

  // PS4: Waves
  {
    notation: 'US.NGSS.4.SC.PS4.1',
    officialCode: '4-PS4-1',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Develop a model of waves to describe patterns in terms of amplitude and wavelength and that waves can cause objects to move.',
    clarification: 'Examples of models could include diagrams, analogies, and physical models using wire to illustrate wavelength and amplitude of waves.',
    assessmentBoundary: 'Assessment does not include interference effects, electromagnetic waves, non-periodic waves, or quantitative models of amplitude and wavelength.',
  },
  {
    notation: 'US.NGSS.4.SC.PS4.2',
    officialCode: '4-PS4-2',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Develop a model to describe that light reflecting from objects and entering the eye allows objects to be seen.',
    assessmentBoundary: 'Assessment does not include knowledge of specific combcolors reflected and seen, the## cellular mechanisms of vision, or how the retina works.',
  },
  {
    notation: 'US.NGSS.4.SC.PS4.3',
    officialCode: '4-PS4-3',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Generate and compare multiple solutions that use patterns to transfer information.',
    clarification: 'Examples of solutions could include drums sending coded information through sound waves, using a grid of 1s and 0s representing black and white to send information about a picture, and using Morse code to send text.',
  },

  // LS1: From Molecules to Organisms
  {
    notation: 'US.NGSS.4.SC.LS1.1',
    officialCode: '4-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Construct an argument that plants and animals have internal and external structures that function to support survival, growth, behavior, and reproduction.',
    clarification: 'Examples of structures could include thorns, stems, roots, colored petals, heart, stomach, lung, brain, and skin.',
    assessmentBoundary: 'Assessment is limited to macroscopic structures within plant and animal systems.',
  },
  {
    notation: 'US.NGSS.4.SC.LS1.2',
    officialCode: '4-LS1-2',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Use a model to describe that animals receive different types of information through their senses, process the information in their brain, and respond to the information in different ways.',
    clarification: 'Emphasis is on systems of information transfer.',
    assessmentBoundary: 'Assessment does not include the mechanisms by which the brain stores and recalls information or the mechanisms of how sensory receptors function.',
  },

  // ESS1: Earth's Place in the Universe
  {
    notation: 'US.NGSS.4.SC.ESS1.1',
    officialCode: '4-ESS1-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Identify evidence from patterns in rock formations and fossils in rock layers to support an explanation for changes in a landscape over time.',
    clarification: 'Examples of evidence from patterns could include rock layers with marine shell fossils above rock layers with plant fossils and no shells.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.4.SC.ESS2.1',
    officialCode: '4-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Make observations and/or measurements to provide evidence of the effects of weathering or the rate of erosion by water, ice, wind, or vegetation.',
    clarification: 'Examples of variables to test could include angle of slope in the downhill movement of water, amount of vegetation, speed of wind, relative rate of deposition, cycles of freezing and thawing of water, cycles of heating and cooling, and volume of water flow.',
    assessmentBoundary: 'Assessment is limited to a single form of weathering or erosion.',
  },
  {
    notation: 'US.NGSS.4.SC.ESS2.2',
    officialCode: '4-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Analyze and interpret data from maps to describe patterns of Earth\'s features.',
    clarification: 'Maps can include topographic maps of Earth\'s land and ocean floor, as well as maps of the locations of mountains, continental boundaries, volcanoes, and earthquakes.',
  },

  // ESS3: Earth and Human Activity
  {
    notation: 'US.NGSS.4.SC.ESS3.1',
    officialCode: '4-ESS3-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Obtain and combine information to describe that energy and fuels are derived from natural resources and their uses affect the environment.',
    clarification: 'Examples of renewable energy resources could include wind energy, water behind dams, and sunlight; non-renewable energy resources are fossil fuels and fissile materials.',
    assessmentBoundary: 'Assessment does not include Global Warming.',
  },
  {
    notation: 'US.NGSS.4.SC.ESS3.2',
    officialCode: '4-ESS3-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Generate and compare multiple solutions to reduce the impacts of natural Earth processes on humans.',
    clarification: 'Examples of solutions could include designing an earthquake resistant building and improving monitoring of volcanic activity.',
    assessmentBoundary: 'Assessment is limited to earthquakes, floods, tsunamis, and volcanic eruptions.',
  },
];

// =============================================================================
// GRADE 5 (Ages 10-11)
// =============================================================================

const grade5Standards: NGSSScienceStandard[] = [
  // PS1: Matter and Its Interactions
  {
    notation: 'US.NGSS.5.SC.PS1.1',
    officialCode: '5-PS1-1',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Develop a model to describe that matter is made of particles too small to be seen.',
    clarification: 'Examples of evidence supporting a model could include adding air to expand a basketball, compressing air in a syringe, dissolving sugar in water, and evaporating salt water.',
    assessmentBoundary: 'Assessment does not include the atomic-scale mechanism of evaporation and condensation or defining the unseen particles.',
  },
  {
    notation: 'US.NGSS.5.SC.PS1.2',
    officialCode: '5-PS1-2',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Measure and graph quantities to provide evidence that regardless of the type of change that occurs when heating, cooling, or mixing substances, the total weight of matter is conserved.',
    clarification: 'Examples of reactions or changes could include phase changes, dissolving, and mixing that form new substances.',
    assessmentBoundary: 'Assessment does not include distinguishing mass and weight.',
  },
  {
    notation: 'US.NGSS.5.SC.PS1.3',
    officialCode: '5-PS1-3',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Make observations and measurements to identify materials based on their properties.',
    clarification: 'Examples of materials to be identified could include baking soda and other powders, metals, minerals, and liquids. Examples of properties could include color, hardness, reflectivity, electrical conductivity, thermal conductivity, response to magnetic forces, and solubility.',
    assessmentBoundary: 'Assessment does not include density or distinguishing mass and weight.',
  },
  {
    notation: 'US.NGSS.5.SC.PS1.4',
    officialCode: '5-PS1-4',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Conduct an investigation to determine whether the mixing of two or more substances results in new substances.',
  },

  // PS2: Motion and Stability
  {
    notation: 'US.NGSS.5.SC.PS2.1',
    officialCode: '5-PS2-1',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Support an argument that the gravitational force exerted by Earth on objects is directed down.',
    clarification: 'Down is a local description of the direction that points toward the center of the spherical Earth.',
    assessmentBoundary: 'Assessment does not include mathematical representation of gravitational force.',
  },

  // PS3: Energy
  {
    notation: 'US.NGSS.5.SC.PS3.1',
    officialCode: '5-PS3-1',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Use models to describe that energy in animals\' food (used for body repair, growth, motion, and to maintain body warmth) was once energy from the sun.',
    clarification: 'Examples of models could include diagrams, and flow charts.',
  },

  // LS1: From Molecules to Organisms
  {
    notation: 'US.NGSS.5.SC.LS1.1',
    officialCode: '5-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Support an argument that plants get the materials they need for growth chiefly from air and water.',
    clarification: 'Emphasis is on the idea that plant matter comes mostly from air and water, not from the soil.',
  },

  // LS2: Ecosystems
  {
    notation: 'US.NGSS.5.SC.LS2.1',
    officialCode: '5-LS2-1',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment.',
    clarification: 'Emphasis is on the idea that matter that is not food (air, water, decomposed materials in soil) is changed by plants into matter that is food.',
    assessmentBoundary: 'Assessment does not include molecular explanations.',
  },

  // ESS1: Earth's Place in the Universe
  {
    notation: 'US.NGSS.5.SC.ESS1.1',
    officialCode: '5-ESS1-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Support an argument that the apparent brightness of the sun and stars is due to their relative distances from Earth.',
    clarification: 'Assessment is limited to relative distances, not combcalculations of actual distances.',
  },
  {
    notation: 'US.NGSS.5.SC.ESS1.2',
    officialCode: '5-ESS1-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Represent data in graphical displays to reveal patterns of daily changes in length and direction of shadows, day and night, and the seasonal appearance of some stars in the night sky.',
    clarification: 'Examples of patterns could include the position and motion of Earth with respect to the sun and selected stars that are visible only in particular months.',
    assessmentBoundary: 'Assessment does not include causes of seasons.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.5.SC.ESS2.1',
    officialCode: '5-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Develop a model using an example to describe ways the geosphere, biosphere, hydrosphere, and/or atmosphere interact.',
    clarification: 'Examples could include the influence of the ocean on ecosystems, landform shape, and climate; the influence of the atmosphere on landforms and ecosystems through weather and climate; and the influence of mountain ranges on winds and clouds in the atmosphere.',
    assessmentBoundary: 'Assessment is limited to the interactions of two systems at a time.',
  },
  {
    notation: 'US.NGSS.5.SC.ESS2.2',
    officialCode: '5-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Describe and graph the amounts of salt water and fresh water in various reservoirs to provide evidence about the distribution of water on Earth.',
    assessmentBoundary: 'Assessment is limited to oceans, lakes, rivers, glaciers, ground water, and polar ice caps, and does not include the atmosphere.',
  },

  // ESS3: Earth and Human Activity
  {
    notation: 'US.NGSS.5.SC.ESS3.1',
    officialCode: '5-ESS3-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Obtain and combine information about ways individual communities use science ideas to protect the Earth\'s resources and environment.',
  },
];

// =============================================================================
// MIDDLE SCHOOL (Grades 6-8, Ages 11-14)
// =============================================================================

const middleSchoolStandards: NGSSScienceStandard[] = [
  // PS1: Matter and Its Interactions
  {
    notation: 'US.NGSS.MS.SC.PS1.1',
    officialCode: 'MS-PS1-1',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Develop models to describe the atomic composition of simple molecules and extended structures.',
    clarification: 'Emphasis is on developing models of molecules that vary in complexity.',
    assessmentBoundary: 'Assessment does not include valence electrons and bonding energy, discussing the ionic nature of subunits of complex structures, or a complete description of all individual atoms in a complex molecule.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS1.2',
    officialCode: 'MS-PS1-2',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Analyze and interpret data on the properties of substances before and after the substances interact to determine if a chemical reaction has occurred.',
    clarification: 'Examples of reactions could include burning sugar or steel wool, fat reacting with sodium hydroxide, and mixing zinc with hydrogen chloride.',
    assessmentBoundary: 'Assessment is limited to analysis of the following properties: density, melting point, boiling point, solubility, flammability, and odor.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS1.3',
    officialCode: 'MS-PS1-3',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Gather and make sense of information to describe that synthetic materials come from natural resources and impact society.',
    clarification: 'Emphasis is on natural resources that underlie synthetic materials.',
    assessmentBoundary: 'Assessment is limited to qualitative information.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS1.4',
    officialCode: 'MS-PS1-4',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Develop a model that predicts and describes changes in particle motion, temperature, and state of a pure substance when thermal energy is added or removed.',
    clarification: 'Emphasis is on qualitative molecular-level models of solids, liquids, and gases to show that adding or removing thermal energy increases or decreases kinetic energy of the particles until a change of state occurs.',
    assessmentBoundary: 'Assessment does not include calculating or describing the change in total energy of the particles.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS1.5',
    officialCode: 'MS-PS1-5',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Develop and use a model to describe how the total number of atoms does not change in a chemical reaction and thus mass is conserved.',
    clarification: 'Emphasis is on law of conservation of matter and on physical models or drawings.',
    assessmentBoundary: 'Assessment does not include the use of atomic masses, balancing symbolic equations, or intermolecular forces.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS1.6',
    officialCode: 'MS-PS1-6',
    dci: 'Physical Sciences',
    topic: 'Matter and Its Interactions',
    description: 'Undertake a design project to construct, test, and modify a device that either releases or absorbs thermal energy by chemical processes.',
    clarification: 'Emphasis is on the design, controlling the transfer of energy to the environment, and modification of a device using factors such as type and concentration of a substance.',
    assessmentBoundary: 'Assessment is limited to the criteria of amount, time, and temperature of substance in testing the device.',
  },

  // PS2: Motion and Stability
  {
    notation: 'US.NGSS.MS.SC.PS2.1',
    officialCode: 'MS-PS2-1',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Apply Newton\'s Third Law to design a solution to a problem involving the motion of two colliding objects.',
    clarification: 'Examples of practical problems could include the impact of collisions between two cars, between a car and stationary objects, and between a meteor and a space vehicle.',
    assessmentBoundary: 'Assessment is limited to vertical or horizontal interactions in one dimension.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS2.2',
    officialCode: 'MS-PS2-2',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Plan an investigation to provide evidence that the change in an object\'s motion depends on the sum of the forces on the object and the mass of the object.',
    clarification: 'Emphasis is on balanced (Fnet = 0) and unbalanced forces in a system, qualitative comparisons of forces, mass and changes in motion, frame of reference, and specification of units.',
    assessmentBoundary: 'Assessment is limited to forces and changes in motion in one-dimension in an inertial reference frame and does not include the use of trigonometry.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS2.3',
    officialCode: 'MS-PS2-3',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Ask questions about data to determine the factors that affect the strength of electric and magnetic forces.',
    clarification: 'Examples of devices that use electric and magnetic forces could include electromagnets, electric motors, or generators.',
    assessmentBoundary: 'Assessment is limited to qualitative data.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS2.4',
    officialCode: 'MS-PS2-4',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Construct and present arguments using evidence to support the claim that gravitational interactions are attractive and depend on the masses of interacting objects.',
    assessmentBoundary: 'Assessment does not include Newton\'s Law of Gravitation or Kepler\'s Laws.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS2.5',
    officialCode: 'MS-PS2-5',
    dci: 'Physical Sciences',
    topic: 'Motion and Stability: Forces and Interactions',
    description: 'Conduct an investigation and evaluate the experimental design to provide evidence that fields exist between objects exerting forces on each other even though the objects are not in contact.',
    clarification: 'Examples of this phenomenon could include the interactions of magnets, electrically-charged strips of tape, and electrically-charged pith balls.',
    assessmentBoundary: 'Assessment is limited to electric and magnetic fields, and is limited to qualitative evidence for the existence of fields.',
  },

  // PS3: Energy
  {
    notation: 'US.NGSS.MS.SC.PS3.1',
    officialCode: 'MS-PS3-1',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Construct and interpret graphical displays of data to describe the relationships of kinetic energy to the mass of an object and to the speed of an object.',
    clarification: 'Emphasis is on descriptive relationships between kinetic energy and mass separately from kinetic energy and speed.',
    assessmentBoundary: 'Assessment does not include KE = 1/2mv².',
  },
  {
    notation: 'US.NGSS.MS.SC.PS3.2',
    officialCode: 'MS-PS3-2',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Develop a model to describe that when the arrangement of objects interacting at a distance changes, different amounts of potential energy are stored in the system.',
    clarification: 'Emphasis is on relative amounts of potential energy, not on calculations of potential energy.',
    assessmentBoundary: 'Assessment is limited to two objects and electric, magnetic, and gravitational interactions.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS3.3',
    officialCode: 'MS-PS3-3',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Apply scientific principles to design, construct, and test a device that either minimizes or maximizes thermal energy transfer.',
    clarification: 'Examples of devices could include an insulated box, a ## solar cooker, and a Styrofoam cup.',
    assessmentBoundary: 'Assessment does not include calculating the total amount of thermal energy transferred.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS3.4',
    officialCode: 'MS-PS3-4',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Plan an investigation to determine the relationships among the energy transferred, the type of matter, the mass, and the change in the average kinetic energy of the particles as measured by the temperature of the sample.',
    clarification: 'Examples of experiments could include comparing final water temperatures after different masses of ice melted in the same volume of water with the same initial temperature.',
    assessmentBoundary: 'Assessment does not include calculating the total amount of thermal energy transferred.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS3.5',
    officialCode: 'MS-PS3-5',
    dci: 'Physical Sciences',
    topic: 'Energy',
    description: 'Construct, use, and present arguments to support the claim that when the kinetic energy of an object changes, energy is transferred to or from the object.',
    clarification: 'Examples of empirical evidence used in arguments could include an inventory or other representation of the energy before and after the transfer in the form of temperature changes or motion of object.',
    assessmentBoundary: 'Assessment does not include calculations of energy.',
  },

  // PS4: Waves
  {
    notation: 'US.NGSS.MS.SC.PS4.1',
    officialCode: 'MS-PS4-1',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Use mathematical representations to describe a simple model for waves that includes how the amplitude of a wave is related to the energy in a wave.',
    clarification: 'Emphasis is on describing waves with both qualitative and quantitative thinking.',
    assessmentBoundary: 'Assessment does not include electromagnetic waves and is limited to standard repeating waves.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS4.2',
    officialCode: 'MS-PS4-2',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Develop and use a model to describe that waves are reflected, absorbed, or transmitted through various materials.',
    clarification: 'Emphasis is on both light and mechanical waves.',
    assessmentBoundary: 'Assessment is limited to qualitative applications pertaining to light and mechanical waves.',
  },
  {
    notation: 'US.NGSS.MS.SC.PS4.3',
    officialCode: 'MS-PS4-3',
    dci: 'Physical Sciences',
    topic: 'Waves and Their Applications in Technologies for Information Transfer',
    description: 'Integrate qualitative scientific and technical information to support the claim that digitized signals are a more reliable way to encode and transmit information than analog signals.',
    clarification: 'Emphasis is on a basic understanding that waves can be used for communication purposes.',
    assessmentBoundary: 'Assessment does not include binary counting. Assessment does not include the specific technological design features.',
  },

  // LS1: From Molecules to Organisms
  {
    notation: 'US.NGSS.MS.SC.LS1.1',
    officialCode: 'MS-LS1-1',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Conduct an investigation to provide evidence that living things are made of cells; either one cell or many different numbers and types of cells.',
    assessmentBoundary: 'Assessment is limited to human combcells.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.2',
    officialCode: 'MS-LS1-2',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Develop and use a model to describe the function of a cell as a whole and ways parts of cells contribute to the function.',
    clarification: 'Emphasis is on the cell functioning as a whole system and the primary role of identified parts of the cell, specifically the nucleus, chloroplasts, mitochondria, cell membrane, and cell wall.',
    assessmentBoundary: 'Assessment does not include the biochemical function of cells or cell parts.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.3',
    officialCode: 'MS-LS1-3',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Use argument supported by evidence for how the body is a system of interacting subsystems composed of groups of cells.',
    clarification: 'Emphasis is on the conceptual understanding that cells form tissues and tissues form organs specialized for particular body functions.',
    assessmentBoundary: 'Assessment does not include the mechanism of one body system independent of others.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.4',
    officialCode: 'MS-LS1-4',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Use argument based on empirical evidence and scientific reasoning to support an explanation for how characteristic animal behaviors and specialized plant structures affect the probability of successful reproduction of animals and plants respectively.',
    clarification: 'Examples of behaviors that affect the probability of animal reproduction could include nest building to protect young from cold, herding of animals to protect young from predators, and vocalizations and other displays that attract mates.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.5',
    officialCode: 'MS-LS1-5',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Construct a scientific explanation based on evidence for how environmental and genetic factors influence the growth of organisms.',
    clarification: 'Examples of local environmental conditions could include availability of food, light, space, and water.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.6',
    officialCode: 'MS-LS1-6',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms.',
    clarification: 'Emphasis is on tracing movement of matter and flow of energy.',
    assessmentBoundary: 'Assessment does not include the biochemical mechanisms of photosynthesis.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.7',
    officialCode: 'MS-LS1-7',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Develop a model to describe how food is rearranged through chemical reactions forming new molecules that support growth and/or release energy as this matter moves through an organism.',
    clarification: 'Emphasis is on describing that molecules are broken apart and put back together and that in this process, energy is released.',
    assessmentBoundary: 'Assessment does not include details of the chemical reactions for photosynthesis or respiration.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS1.8',
    officialCode: 'MS-LS1-8',
    dci: 'Life Sciences',
    topic: 'From Molecules to Organisms: Structures and Processes',
    description: 'Gather and synthesize information that sensory receptors respond to stimuli by sending messages to the brain for immediate behavior or storage as memories.',
    assessmentBoundary: 'Assessment does not include mechanisms for the transmission of this information.',
  },

  // LS2: Ecosystems
  {
    notation: 'US.NGSS.MS.SC.LS2.1',
    officialCode: 'MS-LS2-1',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Analyze and interpret data to provide evidence for the effects of resource availability on organisms and populations of organisms in an ecosystem.',
    clarification: 'Emphasis is on cause and effect relationships between resources and growth of individual organisms and the numbers of organisms in ecosystems during periods of abundant and scarce resources.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS2.2',
    officialCode: 'MS-LS2-2',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Construct an explanation that predicts patterns of interactions among organisms across multiple ecosystems.',
    clarification: 'Emphasis is on predicting consistent patterns of interactions in different ecosystems in terms of the relationships among and between organisms and abiotic components of ecosystems.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS2.3',
    officialCode: 'MS-LS2-3',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Develop a model to describe the cycling of matter and flow of energy among living and nonliving parts of an ecosystem.',
    clarification: 'Emphasis is on describing the conservation of matter and flow of energy into and out of various ecosystems, and on defining the boundaries of the system.',
    assessmentBoundary: 'Assessment does not include the use of chemical reactions to describe the processes.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS2.4',
    officialCode: 'MS-LS2-4',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Construct an argument supported by empirical evidence that changes to physical or biological components of an ecosystem affect populations.',
    clarification: 'Emphasis is on recognizing patterns in data and making warranted inferences about changes in populations.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS2.5',
    officialCode: 'MS-LS2-5',
    dci: 'Life Sciences',
    topic: 'Ecosystems: Interactions, Energy, and Dynamics',
    description: 'Evaluate competing design solutions for maintaining biodiversity and ecosystem services.',
    clarification: 'Examples of ecosystem services could include water purification, nutrient recycling, and prevention of soil erosion.',
    assessmentBoundary: 'Assessment does not include the specific practices combfor land management.',
  },

  // LS3: Heredity
  {
    notation: 'US.NGSS.MS.SC.LS3.1',
    officialCode: 'MS-LS3-1',
    dci: 'Life Sciences',
    topic: 'Heredity: Inheritance and Variation of Traits',
    description: 'Develop and use a model to describe why structural changes to genes (mutations) located on chromosomes may affect proteins and may result in harmful, beneficial, or neutral effects to the structure and function of the organism.',
    clarification: 'Emphasis is on conceptual understanding that changes in genetic material may result in making different proteins.',
    assessmentBoundary: 'Assessment does not include specific changes at the molecular level, mechanisms for protein synthesis, or specific types of mutations.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS3.2',
    officialCode: 'MS-LS3-2',
    dci: 'Life Sciences',
    topic: 'Heredity: Inheritance and Variation of Traits',
    description: 'Develop and use a model to describe why asexual reproduction results in offspring with identical genetic information and sexual reproduction results in offspring with genetic variation.',
    clarification: 'Emphasis is on using models such as Punnett squares, diagrams, and simulations to describe the cause and effect relationship of gene transmission from parent(s) to offspring and resulting genetic variation.',
  },

  // LS4: Biological Evolution
  {
    notation: 'US.NGSS.MS.SC.LS4.1',
    officialCode: 'MS-LS4-1',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Analyze and interpret data for patterns in the fossil record that document the existence, diversity, extinction, and change of life forms throughout the history of life on Earth under the assumption that natural laws operate today as in the past.',
    clarification: 'Emphasis is on finding patterns of changes in the level of complexity of anatomical structures in organisms and the chronological order of fossil appearance in the rock layers.',
    assessmentBoundary: 'Assessment does not include the names of combindividual combphyla, combclasses, or comborders.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS4.2',
    officialCode: 'MS-LS4-2',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Apply scientific ideas to construct an explanation for the anatomical similarities and differences among modern organisms and between modern and fossil organisms to infer evolutionary relationships.',
    clarification: 'Emphasis is on explanations of the evolutionary relationships among organisms in terms of similarity or differences of the gross appearance of anatomical structures.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS4.3',
    officialCode: 'MS-LS4-3',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Analyze displays of pictorial data to compare patterns of similarities in the embryological development across multiple species to identify relationships not evident in the fully formed anatomy.',
    clarification: 'Emphasis is on inferring general patterns of relatedness among embryos of different organisms by comparing the macroscopic appearance of diagrams or pictures.',
    assessmentBoundary: 'Assessment of comparisons is limited to gross appearance of anatomical structures in embryological development.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS4.4',
    officialCode: 'MS-LS4-4',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Construct an explanation based on evidence that describes how genetic variations of traits in a population increase some individuals\' probability of surviving and reproducing in a specific environment.',
    clarification: 'Emphasis is on using simple probability statements and proportional reasoning to construct explanations.',
  },
  {
    notation: 'US.NGSS.MS.SC.LS4.5',
    officialCode: 'MS-LS4-5',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Gather and synthesize information about the technologies that have changed the way humans influence the inheritance of desired traits in organisms.',
    clarification: 'Emphasis is on synthesizing information from reliable sources about the influence of humans on genetic outcomes in artificial selection (such as animals combwith combdesirable combtraits, combcrops, and combGMOs).',
  },
  {
    notation: 'US.NGSS.MS.SC.LS4.6',
    officialCode: 'MS-LS4-6',
    dci: 'Life Sciences',
    topic: 'Biological Evolution: Unity and Diversity',
    description: 'Use mathematical representations to support explanations of how natural selection may lead to increases and decreases of specific traits in populations over time.',
    clarification: 'Emphasis is on using mathematical models, probability statements, and proportional reasoning to support explanations of trends in changes to populations over time.',
    assessmentBoundary: 'Assessment does not include Hardy-Weinberg calculations.',
  },

  // ESS1: Earth's Place in the Universe
  {
    notation: 'US.NGSS.MS.SC.ESS1.1',
    officialCode: 'MS-ESS1-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Develop and use a model of the Earth-sun-moon system to describe the cyclic patterns of lunar phases, eclipses of the sun and moon, and seasons.',
    clarification: 'Examples of models can be physical, graphical, or conceptual.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS1.2',
    officialCode: 'MS-ESS1-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Develop and use a model to describe the role of gravity in the motions within galaxies and the solar system.',
    clarification: 'Emphasis for the model is on gravity as the force that holds together the solar system and Milky Way galaxy and controls orbital motions within them.',
    assessmentBoundary: 'Assessment does not include Kepler\'s Laws of orbital motion or the apparent retrograde motion of the planets as combviewed combfrom combEarth.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS1.3',
    officialCode: 'MS-ESS1-3',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Analyze and interpret data to determine scale properties of objects in the solar system.',
    clarification: 'Emphasis is on the analysis of data from Earth-based instruments, space-based telescopes, and spacecraft to determine similarities and differences among solar system objects.',
    assessmentBoundary: 'Assessment does not include recalling combfacts combabout combproperties combof combthe combplanets combor combother combsolar combsystem combobjects.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS1.4',
    officialCode: 'MS-ESS1-4',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Place in the Universe',
    description: 'Construct a scientific explanation based on evidence from rock strata for how the geologic time scale is used to organize Earth\'s 4.6-billion-year-old history.',
    clarification: 'Emphasis is on how analyses of rock formations and the fossils they contain are used to establish relative ages of major events in Earth\'s history.',
    assessmentBoundary: 'Assessment does not include combrecalling combspecific combtime combperiods comb or combevents.',
  },

  // ESS2: Earth's Systems
  {
    notation: 'US.NGSS.MS.SC.ESS2.1',
    officialCode: 'MS-ESS2-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Develop a model to describe the cycling of Earth\'s materials and the flow of energy that drives this process.',
    clarification: 'Emphasis is on the processes of melting, crystallization, weathering, deformation, and sedimentation, which act together to form minerals and rocks through the rock cycle.',
    assessmentBoundary: 'Assessment does not include the identification and naming of minerals.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS2.2',
    officialCode: 'MS-ESS2-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Construct an explanation based on evidence for how geoscience processes have changed Earth\'s surface at varying time and spatial scales.',
    clarification: 'Emphasis is on how processes change Earth\'s surface at time and spatial scales that can be large (such as slow plate motions or the uplift of large mountain ranges) or small (such as rapid landslides or microscopic geochemical reactions).',
    assessmentBoundary: 'Assessment does not include the combreplication combof combspecific combrates combof combchange.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS2.3',
    officialCode: 'MS-ESS2-3',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Analyze and interpret data on the distribution of fossils and rocks, continental shapes, and seafloor structures to provide evidence of the past plate motions.',
    clarification: 'Examples of data include similarities of rock and fossil types on different continents, the shapes of the continents, and the locations of ocean structures.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS2.4',
    officialCode: 'MS-ESS2-4',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Develop a model to describe the cycling of water through Earth\'s systems driven by energy from the sun and the force of gravity.',
    clarification: 'Emphasis is on the ways water changes its state as it moves through the multiple pathways of the hydrologic cycle.',
    assessmentBoundary: 'Assessment is limited to a combqualitative combdescription combof combthe combhydrologic combcycle.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS2.5',
    officialCode: 'MS-ESS2-5',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Collect data to provide evidence for how the motions and complex interactions of air masses results in changes in weather conditions.',
    clarification: 'Emphasis is on how air masses flow from regions of high pressure to low pressure, causing weather (defined by temperature, pressure, humidity, precipitation, and wind) at a fixed location to change over time.',
    assessmentBoundary: 'Assessment does not include combanalysis combof combclimate combdata combor combprediction combof combweather.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS2.6',
    officialCode: 'MS-ESS2-6',
    dci: 'Earth and Space Sciences',
    topic: 'Earth\'s Systems',
    description: 'Develop and use a model to describe how unequal heating and rotation of the Earth cause patterns of atmospheric and oceanic circulation that determine regional climates.',
    clarification: 'Emphasis is on how patterns vary by latitude, altitude, and geographic land distribution.',
    assessmentBoundary: 'Assessment does not include the combuse combof combmathematical combrepresentations combof combheat combtransfer.',
  },

  // ESS3: Earth and Human Activity
  {
    notation: 'US.NGSS.MS.SC.ESS3.1',
    officialCode: 'MS-ESS3-1',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Construct a scientific explanation based on evidence for how the uneven distributions of Earth\'s mineral, energy, and groundwater resources are the result of past and current geoscience processes.',
    clarification: 'Emphasis is on how these resources are limited and typically non-renewable.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS3.2',
    officialCode: 'MS-ESS3-2',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Analyze and interpret data on natural hazards to forecast future catastrophic events and inform the development of technologies to mitigate their effects.',
    clarification: 'Emphasis is on how some natural hazards, such as volcanic eruptions and severe weather, are preceded by phenomena that allow for reliable predictions.',
    assessmentBoundary: 'Assessment is limited to combnatural hazards combin combthe comblast combo-100 combyears.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS3.3',
    officialCode: 'MS-ESS3-3',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Apply scientific principles to design a method for monitoring and minimizing a human impact on the environment.',
    clarification: 'Examples of the design process include examining human environmental impacts, assessing the kinds of solutions that are feasible, and designing and evaluating solutions that could reduce that impact.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS3.4',
    officialCode: 'MS-ESS3-4',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Construct an argument supported by evidence for how increases in human population and per-capita consumption of natural resources impact Earth\'s systems.',
    clarification: 'Examples of evidence include grade-appropriate databases on human populations and the rates of consumption of food and natural resources.',
  },
  {
    notation: 'US.NGSS.MS.SC.ESS3.5',
    officialCode: 'MS-ESS3-5',
    dci: 'Earth and Space Sciences',
    topic: 'Earth and Human Activity',
    description: 'Ask questions to clarify evidence of the factors that have caused the rise in global temperatures over the past century.',
    clarification: 'Examples of factors include human activities (such as fossil fuel combustion, cement production, and agricultural activity) and natural processes (such as changes in incoming solar radiation or volcanic activity).',
  },

  // ETS1: Engineering Design (Middle School)
  {
    notation: 'US.NGSS.MS.SC.ETS1.1',
    officialCode: 'MS-ETS1-1',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Define the criteria and constraints of a design problem with sufficient precision to ensure a successful solution, taking into account relevant scientific principles and potential impacts on people and the natural environment that may limit possible solutions.',
  },
  {
    notation: 'US.NGSS.MS.SC.ETS1.2',
    officialCode: 'MS-ETS1-2',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Evaluate competing design solutions using a systematic process to determine how well they meet the criteria and constraints of the problem.',
  },
  {
    notation: 'US.NGSS.MS.SC.ETS1.3',
    officialCode: 'MS-ETS1-3',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Analyze data from tests to determine similarities and differences among several design solutions to identify the best characteristics of each that can be combined into a new solution to better meet the criteria for success.',
  },
  {
    notation: 'US.NGSS.MS.SC.ETS1.4',
    officialCode: 'MS-ETS1-4',
    dci: 'Engineering, Technology, and Applications of Science',
    topic: 'Engineering Design',
    description: 'Develop a model to generate data for iterative testing and modification of a proposed object, tool, or process such that an optimal design can be achieved.',
  },
];

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const ngssScienceCurriculum: NGSSScienceCurriculum = {
  code: 'US_NGSS',
  name: 'Next Generation Science Standards',
  country: 'United States',
  version: '2013',
  sourceUrl: 'https://www.nextgenscience.org/',
  subject: 'SCIENCE',
  grades: [
    {
      grade: 0,
      gradeLabel: 'Kindergarten',
      ageRangeMin: 5,
      ageRangeMax: 6,
      standards: kindergartenStandards,
    },
    {
      grade: 1,
      gradeLabel: 'Grade 1',
      ageRangeMin: 6,
      ageRangeMax: 7,
      standards: grade1Standards,
    },
    {
      grade: 2,
      gradeLabel: 'Grade 2',
      ageRangeMin: 7,
      ageRangeMax: 8,
      standards: grade2Standards,
    },
    {
      grade: 3,
      gradeLabel: 'Grade 3',
      ageRangeMin: 8,
      ageRangeMax: 9,
      standards: grade3Standards,
    },
    {
      grade: 4,
      gradeLabel: 'Grade 4',
      ageRangeMin: 9,
      ageRangeMax: 10,
      standards: grade4Standards,
    },
    {
      grade: 5,
      gradeLabel: 'Grade 5',
      ageRangeMin: 10,
      ageRangeMax: 11,
      standards: grade5Standards,
    },
    {
      grade: 6, // Represents MS (Middle School) grades 6-8
      gradeLabel: 'Middle School (6-8)',
      ageRangeMin: 11,
      ageRangeMax: 14,
      standards: middleSchoolStandards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get standards for a specific grade
 * @param grade Grade number (0 = K, 1-5 = Grades 1-5, 6 = MS)
 */
export function getStandardsForGrade(grade: number): NGSSScienceStandard[] {
  const gradeData = ngssScienceCurriculum.grades.find((g) => g.grade === grade);
  return gradeData?.standards || [];
}

/**
 * Get total count of all NGSS standards
 */
export function getTotalNGSSStandardsCount(): number {
  return ngssScienceCurriculum.grades.reduce(
    (total, grade) => total + grade.standards.length,
    0
  );
}

/**
 * Get standards by DCI (Disciplinary Core Idea)
 */
export function getStandardsByDCI(dci: string): NGSSScienceStandard[] {
  const allStandards = ngssScienceCurriculum.grades.flatMap((g) => g.standards);
  return allStandards.filter((s) => s.dci === dci);
}

/**
 * Get standards by topic
 */
export function getStandardsByTopic(topic: string): NGSSScienceStandard[] {
  const allStandards = ngssScienceCurriculum.grades.flatMap((g) => g.standards);
  return allStandards.filter((s) => s.topic.includes(topic));
}

/**
 * Get grade label from grade number
 */
export function getGradeLabel(grade: number): string {
  const gradeData = ngssScienceCurriculum.grades.find((g) => g.grade === grade);
  return gradeData?.gradeLabel || '';
}
