/**
 * IB Primary Years Programme (PYP) - Mathematics Scope and Sequence
 * Ages 3-12 (4 developmental phases)
 *
 * Official Source: IB PYP Mathematics Scope and Sequence (2009)
 * https://www.ibo.org/programmes/primary-years-programme/
 *
 * The IB PYP uses developmental phases rather than strict grade levels.
 * Standards are organized by 5 strands with learning outcomes across
 * three stages: Constructing Meaning, Transferring Meaning into Symbols,
 * and Applying with Understanding.
 *
 * Notation System: IB.PYP.{phase}.MA.{strand}.{number}
 * - IB = International Baccalaureate
 * - PYP = Primary Years Programme
 * - Phase: P1 (3-5), P2 (5-7), P3 (7-9), P4 (9-12)
 * - MA = Mathematics
 * - Strand codes:
 *   - DH = Data Handling
 *   - ME = Measurement
 *   - SS = Shape and Space
 *   - PF = Pattern and Function
 *   - NU = Number
 */

export interface IBPYPMathStandard {
  notation: string;
  strand: string;
  learningStage: 'constructing_meaning' | 'transferring_symbols' | 'applying_understanding';
  description: string;
}

export interface IBPYPMathPhase {
  phase: number; // 1-4
  phaseLabel: string; // "Phase 1", "Phase 2", etc.
  ageRangeMin: number;
  ageRangeMax: number;
  gradeEquivalent: string; // For mapping to traditional grades
  standards: IBPYPMathStandard[];
}

export interface IBPYPMathCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  phases: IBPYPMathPhase[];
}

// =============================================================================
// PHASE 1 (Ages 3-5) - Early Years / Pre-K / Reception
// =============================================================================

const phase1Standards: IBPYPMathStandard[] = [
  // DATA HANDLING - Phase 1
  {
    notation: 'IB.PYP.P1.MA.DH.1',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that sets can be organized by different attributes',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.2',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that information about themselves and their surroundings can be obtained in different ways',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.3',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'discuss chance in daily events (impossible, maybe, certain)',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.4',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'represent information through pictographs and tally marks',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.5',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'sort and label real objects by attributes',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.6',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'create pictographs and tally marks',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.7',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'create living graphs using real objects and people',
  },
  {
    notation: 'IB.PYP.P1.MA.DH.8',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'describe real objects and events by attributes',
  },

  // MEASUREMENT - Phase 1
  {
    notation: 'IB.PYP.P1.MA.ME.1',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that attributes of real objects can be compared and described (longer, shorter, heavier, empty, full, hotter, colder)',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.2',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that events in daily routines can be described and sequenced (before, after, bedtime, storytime, today, tomorrow)',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.3',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'identify, compare and describe attributes of real objects (longer, shorter, heavier, empty, full, hotter, colder)',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.4',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'compare the length, mass and capacity of objects using non-standard units',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.5',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'identify, describe and sequence events in their daily routine (before, after, bedtime, storytime, today, tomorrow)',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.6',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'describe observations about events and objects in real-life situations',
  },
  {
    notation: 'IB.PYP.P1.MA.ME.7',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'use non-standard units of measurement to solve problems in real-life situations involving length, mass and capacity',
  },

  // SHAPE AND SPACE - Phase 1
  {
    notation: 'IB.PYP.P1.MA.SS.1',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that 2D and 3D shapes have characteristics that can be described and compared',
  },
  {
    notation: 'IB.PYP.P1.MA.SS.2',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that common language can be used to describe position and direction (inside, outside, above, below, next to, behind, in front of, up, down)',
  },
  {
    notation: 'IB.PYP.P1.MA.SS.3',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'sort, describe and compare 3D shapes',
  },
  {
    notation: 'IB.PYP.P1.MA.SS.4',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'describe position and direction (inside, outside, above, below, next to, behind, in front of, up, down)',
  },
  {
    notation: 'IB.PYP.P1.MA.SS.5',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'explore and describe the paths, regions and boundaries of their immediate environment',
  },

  // PATTERN AND FUNCTION - Phase 1
  {
    notation: 'IB.PYP.P1.MA.PF.1',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that patterns can be found in everyday situations (sounds, actions, objects, nature)',
  },
  {
    notation: 'IB.PYP.P1.MA.PF.2',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'describe patterns in various ways using words, drawings, symbols, materials, actions, numbers',
  },
  {
    notation: 'IB.PYP.P1.MA.PF.3',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'extend and create patterns',
  },

  // NUMBER - Phase 1
  {
    notation: 'IB.PYP.P1.MA.NU.1',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand one-to-one correspondence',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.2',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand that for a set of objects, the number name of the last object counted describes the quantity of the whole set',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.3',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand that numbers can be constructed in multiple ways (by combining and partitioning)',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.4',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand conservation of number',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.5',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand the relative magnitude of whole numbers',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.6',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'recognize groups of zero to five objects without counting (subitizing)',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.7',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand whole-part relationships',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.8',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'use the language of mathematics to compare quantities (more, less, first, second)',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.9',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'connect number names and numerals to the quantities they represent',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.10',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'count to determine the number of objects in a set',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.11',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use number words and numerals to represent quantities in real-life situations',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.12',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use the language of mathematics to compare quantities in real-life situations',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.13',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'subitize in real-life situations',
  },
  {
    notation: 'IB.PYP.P1.MA.NU.14',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use simple fraction names in real-life situations',
  },
];

// =============================================================================
// PHASE 2 (Ages 5-7) - Year 1-2 / Kindergarten-Grade 1
// =============================================================================

const phase2Standards: IBPYPMathStandard[] = [
  // DATA HANDLING - Phase 2
  {
    notation: 'IB.PYP.P2.MA.DH.1',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that sets can be organized by one or more attributes',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.2',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that information about themselves and their surroundings can be collected and recorded in different ways',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.3',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand the concept of chance in daily events (impossible, less likely, maybe, most likely, certain)',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.4',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'collect and represent data in different types of graphs (tally marks, bar graphs)',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.5',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'represent the relationship between objects in sets using tree, Venn and Carroll diagrams',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.6',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'express the chance of an event happening using words or phrases (impossible, less likely, maybe, most likely, certain)',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.7',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'collect, display and interpret data for the purpose of answering questions',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.8',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'create a pictograph and sample bar graph of real objects and interpret data by comparing quantities',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.9',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'use tree, Venn and Carroll diagrams to explore relationships between data',
  },
  {
    notation: 'IB.PYP.P2.MA.DH.10',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'identify and describe chance in daily events (impossible, less likely, maybe, most likely, certain)',
  },

  // MEASUREMENT - Phase 2
  {
    notation: 'IB.PYP.P2.MA.ME.1',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand the use of standard units to measure (length, mass, money, time, temperature)',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.2',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that tools can be used to measure',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.3',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that calendars can be used to determine the date and to identify and sequence days of the week and months of the year',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.4',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that time is measured using universal units of measure (years, months, days, hours, minutes and seconds)',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.5',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'estimate and measure objects using standard units of measurement: length, mass, capacity, money and temperature',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.6',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'read and write the time to the hour, half hour and quarter hour',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.7',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'estimate and compare lengths of time: second, minute, hour, day, week and month',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.8',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'use standard units of measurement to solve problems in real-life situations involving length, mass, capacity, money and temperature',
  },
  {
    notation: 'IB.PYP.P2.MA.ME.9',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'use measures of time to assist with problem solving in real-life situations',
  },

  // SHAPE AND SPACE - Phase 2
  {
    notation: 'IB.PYP.P2.MA.SS.1',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that there are relationships among and between 2D and 3D shapes',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.2',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that 2D and 3D shapes can be created by putting together and/or taking apart other shapes',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.3',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that examples of symmetry and transformations can be found in their immediate environment',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.4',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that geometric shapes are useful for representing real-world situations',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.5',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that directions can be used to describe pathways, regions, positions and boundaries of their immediate environment',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.6',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'sort, describe and label 2D and 3D shapes',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.7',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'analyse and describe the relationships between 2D and 3D shapes',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.8',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'create and describe symmetrical and tessellating patterns',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.9',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'identify lines of reflective symmetry',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.10',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'represent ideas about the real world using geometric vocabulary and symbols (oral description, drawing, modelling, labelling)',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.11',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'interpret and create simple directions, describing paths, regions, positions and boundaries of their immediate environment',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.12',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'analyse and use what they know about 3D shapes to describe and work with 2D shapes',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.13',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'recognize and explain simple symmetrical designs in the environment',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.14',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'apply knowledge of symmetry to problem-solving situations',
  },
  {
    notation: 'IB.PYP.P2.MA.SS.15',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'interpret and use simple directions, describing paths, regions, positions and boundaries of their immediate environment',
  },

  // PATTERN AND FUNCTION - Phase 2
  {
    notation: 'IB.PYP.P2.MA.PF.1',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that patterns can be found in numbers (odd and even numbers, skip counting)',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.2',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand the inverse relationship between addition and subtraction',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.3',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand the associative and commutative properties of addition',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.4',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'represent patterns in a variety of ways using words, drawings, symbols, materials, actions, numbers',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.5',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'describe number patterns (odd and even numbers, skip counting)',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.6',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'extend and create patterns in numbers (odd and even numbers, skip counting)',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.7',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'use number patterns to represent and understand real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.PF.8',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'use the properties and relationships of addition and subtraction to solve problems',
  },

  // NUMBER - Phase 2
  {
    notation: 'IB.PYP.P2.MA.NU.1',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model numbers to hundreds or beyond using the base 10 place value system',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.2',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'estimate quantities to 100 or beyond',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.3',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model simple fraction relationships',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.4',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'use the language of addition and subtraction (add, take away, plus, minus, sum, difference)',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.5',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition and subtraction of whole numbers',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.6',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'develop strategies for memorizing addition and subtraction number facts',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.7',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'estimate sums and differences',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.8',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand situations that involve multiplication and division',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.9',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition and subtraction of fractions with the same denominator',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.10',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read and write whole numbers up to hundreds or beyond',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.11',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order cardinal and ordinal numbers',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.12',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'describe mental and written strategies for adding and subtracting two-digit numbers',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.13',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use whole numbers up to hundreds or beyond in real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.14',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use cardinal and ordinal numbers in real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.15',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use fast recall of addition and subtraction number facts in real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.16',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use fractions in real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.17',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use mental and written strategies for addition and subtraction of two-digit numbers or beyond in real-life situations',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.18',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'select an appropriate method for solving a problem (mental estimation, mental or written strategies, or by using a calculator)',
  },
  {
    notation: 'IB.PYP.P2.MA.NU.19',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use strategies to evaluate the reasonableness of answers',
  },
];

// =============================================================================
// PHASE 3 (Ages 7-9) - Year 3-4 / Grades 2-3
// =============================================================================

const phase3Standards: IBPYPMathStandard[] = [
  // DATA HANDLING - Phase 3
  {
    notation: 'IB.PYP.P3.MA.DH.1',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that data can be collected, displayed and interpreted using simple graphs (bar graphs, line graphs)',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.2',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that scale can represent different quantities in graphs',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.3',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that the mode can be used to summarize a set of data',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.4',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that one of the purposes of a database is to answer questions and solve problems',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.5',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that probability is based on experimental events',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.6',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'collect, display and interpret data using simple graphs (bar graphs, line graphs)',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.7',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'identify, read and interpret range and scale on graphs',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.8',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'identify the mode of a set of data',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.9',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'use tree diagrams to express probability using simple fractions',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.10',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'design a survey and systematically collect, organize and display data in pictographs and bar graphs',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.11',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'select appropriate graph form(s) to display data',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.12',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'interpret range and scale on graphs',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.13',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'use probability to determine mathematically fair and unfair games and to explain possible outcomes',
  },
  {
    notation: 'IB.PYP.P3.MA.DH.14',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'express probability using simple fractions',
  },

  // MEASUREMENT - Phase 3
  {
    notation: 'IB.PYP.P3.MA.ME.1',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand the use of standard units to measure perimeter, area and volume',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.2',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand that measures can fall between numbers on a measurement scale (e.g., 3½ kg, between 4 cm and 5 cm)',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.3',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand relationships between units (metres, centimetres and millimetres)',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.4',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand an angle as a measure of rotation',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.5',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'estimate and measure using standard units of measurement: perimeter, area and volume',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.6',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'describe measures that fall between numbers on a scale',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.7',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'read and write digital and analogue time on 12-hour and 24-hour clocks',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.8',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'use standard units of measurement to solve problems in real-life situations involving perimeter, area and volume',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.9',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'select appropriate tools and units of measurement',
  },
  {
    notation: 'IB.PYP.P3.MA.ME.10',
    strand: 'Measurement',
    learningStage: 'applying_understanding',
    description: 'use timelines in units of inquiry and other real-life situations',
  },

  // SHAPE AND SPACE - Phase 3
  {
    notation: 'IB.PYP.P3.MA.SS.1',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand the common language used to describe shapes',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.2',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand the properties of regular and irregular polygons',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.3',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand congruent or similar shapes',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.4',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that lines and axes of reflective and rotational symmetry assist with the construction of shapes',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.5',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand an angle as a measure of rotation',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.6',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that directions for location can be represented by coordinates on a grid',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.7',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that visualization of shape and space is a strategy for solving problems',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.8',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'sort, describe and model regular and irregular polygons',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.9',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'describe and model congruency and similarity in 2D shapes',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.10',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'analyse angles by comparing and describing rotations: whole turn, half turn, quarter turn; north, south, east and west on a compass',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.11',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'locate features on a grid using coordinates',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.12',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'describe and/or represent mental images of objects, patterns, and paths',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.13',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'analyse and describe 2D and 3D shapes, including regular and irregular polygons, using geometrical vocabulary',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.14',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'identify, describe and model congruency and similarity in 2D shapes',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.15',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'recognize and explain symmetrical patterns, including tessellation, in the environment',
  },
  {
    notation: 'IB.PYP.P3.MA.SS.16',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'apply knowledge of transformations to problem-solving situations',
  },

  // PATTERN AND FUNCTION - Phase 3
  {
    notation: 'IB.PYP.P3.MA.PF.1',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that patterns can be analysed and rules identified',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.2',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that multiplication is repeated addition and that division is repeated subtraction',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.3',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand the inverse relationship between multiplication and division',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.4',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand the associative and commutative properties of multiplication',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.5',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'describe the rule for a pattern in a variety of ways',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.6',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'represent rules for patterns using words, symbols and tables',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.7',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'identify a sequence of operations relating one set of numbers to another set',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.8',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'select appropriate methods for representing patterns (using words, symbols and tables)',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.9',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'use number patterns to make predictions and solve problems',
  },
  {
    notation: 'IB.PYP.P3.MA.PF.10',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'use the properties and relationships of the four operations to solve problems',
  },

  // NUMBER - Phase 3
  {
    notation: 'IB.PYP.P3.MA.NU.1',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model numbers to thousands or beyond using the base 10 place value system',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.2',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model equivalent fractions',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.3',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'use the language of fractions (numerator, denominator)',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.4',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model decimal fractions to hundredths or beyond',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.5',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model multiplication and division of whole numbers',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.6',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'use the language of multiplication and division (factor, multiple, product, quotient, prime numbers, composite number)',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.7',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition and subtraction of fractions with related denominators',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.8',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition and subtraction of decimals',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.9',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order whole numbers up to thousands or beyond',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.10',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'develop strategies for memorizing addition, subtraction, multiplication and division number facts',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.11',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order fractions',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.12',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read and write equivalent fractions',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.13',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order fractions to hundredths or beyond',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.14',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'describe mental and written strategies for multiplication and division',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.15',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use whole numbers up to thousands or beyond in real-life situations',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.16',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use fast recall of multiplication and division number facts in real-life situations',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.17',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use decimal fractions in real-life situations',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.18',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use mental and written strategies for multiplication and division in real-life situations',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.19',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'select an efficient method for solving a problem (mental estimation, mental or written strategies, or by using a calculator)',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.20',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use strategies to evaluate the reasonableness of answers',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.21',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'add and subtract fractions with related denominators in real-life situations',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.22',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'add and subtract decimals in real-life situations, including money',
  },
  {
    notation: 'IB.PYP.P3.MA.NU.23',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'estimate sum, difference, product and quotient in real-life situations, including fractions and decimals',
  },
];

// =============================================================================
// PHASE 4 (Ages 9-12) - Year 5-7 / Grades 4-6
// =============================================================================

const phase4Standards: IBPYPMathStandard[] = [
  // DATA HANDLING - Phase 4
  {
    notation: 'IB.PYP.P4.MA.DH.1',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that different types of graphs have special purposes',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.2',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that the mode, median, mean and range can summarize a set of data',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.3',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand that probability can be expressed in scale (0-1) or per cent (0%-100%)',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.4',
    strand: 'Data Handling',
    learningStage: 'constructing_meaning',
    description: 'understand the difference between experimental and theoretical probability',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.5',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'collect, display and interpret data in circle graphs (pie charts) and line graphs',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.6',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'identify, describe and explain the range, mode, median and mean in a set of data',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.7',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'set up a spreadsheet using simple formulas to manipulate data and to create graphs',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.8',
    strand: 'Data Handling',
    learningStage: 'transferring_symbols',
    description: 'express probabilities using scale (0-1) or per cent (0%-100%)',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.9',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'design a survey and systematically collect, record, organize and display the data in a bar graph, circle graph, line graph',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.10',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'identify, describe and explain the range, mode, median and mean in a set of data',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.11',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'create and manipulate an electronic database for their own purposes',
  },
  {
    notation: 'IB.PYP.P4.MA.DH.12',
    strand: 'Data Handling',
    learningStage: 'applying_understanding',
    description: 'determine the theoretical probability of an event and explain why it might differ from experimental probability',
  },

  // MEASUREMENT - Phase 4
  {
    notation: 'IB.PYP.P4.MA.ME.1',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand procedures for finding area, perimeter and volume',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.2',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand the relationships between area and perimeter, between area and volume, and between volume and capacity',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.3',
    strand: 'Measurement',
    learningStage: 'constructing_meaning',
    description: 'understand unit conversions within measurement systems (metric or customary)',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.4',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'develop and describe formulas for finding perimeter, area and volume',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.5',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'use decimal and fraction notation in measurement (e.g., 3.2 cm, 1.47 kg, 11½ miles)',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.6',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'read and interpret scales on a range of measuring instruments',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.7',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'measure and construct angles in degrees using a protractor',
  },
  {
    notation: 'IB.PYP.P4.MA.ME.8',
    strand: 'Measurement',
    learningStage: 'transferring_symbols',
    description: 'carry out simple unit conversions within a system of measurement (metric or customary)',
  },

  // SHAPE AND SPACE - Phase 4
  {
    notation: 'IB.PYP.P4.MA.SS.1',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand the common language used to describe shapes',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.2',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand the properties of regular and irregular polyhedra',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.3',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand the properties of circles',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.4',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand how scale (ratios) is used to enlarge and reduce shapes',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.5',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand systems for describing position and direction',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.6',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that 2D representations of 3D objects can be used to visualize and solve problems',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.7',
    strand: 'Shape and Space',
    learningStage: 'constructing_meaning',
    description: 'understand that geometric ideas and relationships can be used to solve problems in other areas of mathematics and in real life',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.8',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'analyse, describe, classify and visualize 2D (including circles, triangles and quadrilaterals) and 3D shapes, using geometric vocabulary',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.9',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'describe lines and angles using geometric vocabulary',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.10',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'identify and use scale (ratios) to enlarge and reduce shapes',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.11',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'identify and use the language and notation of bearing to describe direction and position',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.12',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'create and model how a 2D net converts into a 3D shape and vice versa',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.13',
    strand: 'Shape and Space',
    learningStage: 'transferring_symbols',
    description: 'explore the use of geometric ideas and relationships to solve problems in other areas of mathematics',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.14',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'use geometric vocabulary when describing shape and space in mathematical situations and beyond',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.15',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'use scale (ratios) to enlarge and reduce shapes',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.16',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'apply the language and notation of bearing to describe direction and position',
  },
  {
    notation: 'IB.PYP.P4.MA.SS.17',
    strand: 'Shape and Space',
    learningStage: 'applying_understanding',
    description: 'use 2D representations of 3D objects to visualize and solve problems (using drawings or models)',
  },

  // PATTERN AND FUNCTION - Phase 4
  {
    notation: 'IB.PYP.P4.MA.PF.1',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that patterns can be generalized by a rule',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.2',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand exponents as repeated multiplication',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.3',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand the inverse relationship between exponents and roots',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.4',
    strand: 'Pattern and Function',
    learningStage: 'constructing_meaning',
    description: 'understand that patterns can be represented, analysed and generalized using tables, graphs, words, and, when possible, symbolic rules',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.5',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'represent the rule of a pattern by using a function',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.6',
    strand: 'Pattern and Function',
    learningStage: 'transferring_symbols',
    description: 'analyse pattern and function using words, tables and graphs, and, when possible, symbolic rules',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.7',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'select appropriate methods to analyse patterns and identify rules',
  },
  {
    notation: 'IB.PYP.P4.MA.PF.8',
    strand: 'Pattern and Function',
    learningStage: 'applying_understanding',
    description: 'use functions to solve problems',
  },

  // NUMBER - Phase 4
  {
    notation: 'IB.PYP.P4.MA.NU.1',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model numbers to millions or beyond using the base 10 place value system',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.2',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model ratios',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.3',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model integers in appropriate contexts',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.4',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model exponents and square roots',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.5',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model improper fractions and mixed numbers',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.6',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'simplify fractions using manipulatives',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.7',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model decimal fractions to thousandths or beyond',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.8',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model percentages',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.9',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'understand the relationship between fractions, decimals and percentages',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.10',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition, subtraction, multiplication and division of fractions',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.11',
    strand: 'Number',
    learningStage: 'constructing_meaning',
    description: 'model addition, subtraction, multiplication and division of decimals',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.12',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order whole numbers up to millions or beyond',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.13',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read and write ratios',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.14',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read and write integers in appropriate contexts',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.15',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read and write exponents and square roots',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.16',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'convert improper fractions to mixed numbers and vice versa',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.17',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'simplify fractions in mental and written form',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.18',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order decimal fractions to thousandths or beyond',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.19',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'read, write, compare and order percentages',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.20',
    strand: 'Number',
    learningStage: 'transferring_symbols',
    description: 'convert between fractions, decimals and percentages',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.21',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use whole numbers up to millions or beyond in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.22',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use ratios in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.23',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use integers in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.24',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'convert improper fractions to mixed numbers and vice versa in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.25',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'simplify fractions in computation answers',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.26',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use fractions, decimals and percentages interchangeably in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.27',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'select and use an appropriate sequence of operations to solve word problems',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.28',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'select an efficient method for solving a problem: mental estimation, mental computation, written algorithms, by using a calculator',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.29',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use strategies to evaluate the reasonableness of answers',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.30',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'use mental and written strategies for adding, subtracting, multiplying and dividing fractions and decimals in real-life situations',
  },
  {
    notation: 'IB.PYP.P4.MA.NU.31',
    strand: 'Number',
    learningStage: 'applying_understanding',
    description: 'estimate and make approximations in real-life situations involving fractions, decimals and percentages',
  },
];

// =============================================================================
// MAIN EXPORT
// =============================================================================

export const ibPYPMathCurriculum: IBPYPMathCurriculum = {
  code: 'IB_PYP',
  name: 'International Baccalaureate Primary Years Programme',
  country: 'INTERNATIONAL',
  version: '2009',
  sourceUrl: 'https://www.ibo.org/programmes/primary-years-programme/',
  subject: 'MATH',
  phases: [
    {
      phase: 1,
      phaseLabel: 'Phase 1',
      ageRangeMin: 3,
      ageRangeMax: 5,
      gradeEquivalent: 'Pre-K / Reception',
      standards: phase1Standards,
    },
    {
      phase: 2,
      phaseLabel: 'Phase 2',
      ageRangeMin: 5,
      ageRangeMax: 7,
      gradeEquivalent: 'Year 1-2 / K-Grade 1',
      standards: phase2Standards,
    },
    {
      phase: 3,
      phaseLabel: 'Phase 3',
      ageRangeMin: 7,
      ageRangeMax: 9,
      gradeEquivalent: 'Year 3-4 / Grades 2-3',
      standards: phase3Standards,
    },
    {
      phase: 4,
      phaseLabel: 'Phase 4',
      ageRangeMin: 9,
      ageRangeMax: 12,
      gradeEquivalent: 'Year 5-7 / Grades 4-6',
      standards: phase4Standards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get total count of math standards
 */
export function getTotalMathStandardsCount(): number {
  return ibPYPMathCurriculum.phases.reduce(
    (total, phase) => total + phase.standards.length,
    0
  );
}

/**
 * Get standards count by phase
 */
export function getMathStandardsCountByPhase(): { phase: string; count: number }[] {
  return ibPYPMathCurriculum.phases.map((phase) => ({
    phase: phase.phaseLabel,
    count: phase.standards.length,
  }));
}

/**
 * Get standards count by strand across all phases
 */
export function getMathStandardsCountByStrand(): { strand: string; count: number }[] {
  const strandCounts: Record<string, number> = {};

  for (const phase of ibPYPMathCurriculum.phases) {
    for (const standard of phase.standards) {
      strandCounts[standard.strand] = (strandCounts[standard.strand] || 0) + 1;
    }
  }

  return Object.entries(strandCounts).map(([strand, count]) => ({
    strand,
    count,
  }));
}

/**
 * Get all math standards across all phases
 */
export function getAllIBPYPMathStandards(): IBPYPMathStandard[] {
  return ibPYPMathCurriculum.phases.flatMap(phase => phase.standards);
}

/**
 * Get math phase by age
 */
export function getIBPYPMathPhaseByAge(age: number): IBPYPMathPhase | undefined {
  return ibPYPMathCurriculum.phases.find(
    phase => age >= phase.ageRangeMin && age <= phase.ageRangeMax
  );
}

/**
 * Get math standard by notation
 */
export function getIBPYPMathStandardByNotation(notation: string): IBPYPMathStandard | undefined {
  for (const phase of ibPYPMathCurriculum.phases) {
    const standard = phase.standards.find(std => std.notation === notation);
    if (standard) return standard;
  }
  return undefined;
}
