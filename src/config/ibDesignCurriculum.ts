/**
 * IB Design Curriculum Standards
 *
 * Covers all three IB programmes:
 * - PYP (Ages 3-12): Design thinking integrated into transdisciplinary learning
 * - MYP (Grades 6-10): Design with Digital and Product Design pathways
 * - DP (Grades 11-12): Design Technology as a Group 4 Science
 *
 * Sources:
 * - IB MYP Design Guide: https://www.ibo.org/programmes/middle-years-programme/curriculum/design/
 * - IB DP Design Technology: https://www.ibo.org/programmes/diploma-programme/curriculum/sciences/design-technology/
 * - IB PYP Framework: https://www.ibo.org/programmes/primary-years-programme/
 *
 * MYP Assessment Criteria:
 * - Criterion A: Inquiring and analysing
 * - Criterion B: Developing ideas
 * - Criterion C: Creating the solution
 * - Criterion D: Evaluating
 *
 * DP Design Technology Topics:
 * Common Core: Human factors, Resource management, Modelling, Materials, Innovation, Classic design
 * HL Extension: User-centred design, Sustainability, Innovation and markets, Commercial production
 */

export interface IBDesignStandard {
  notation: string;
  pathway?: 'Digital Design' | 'Product Design' | 'Design Technology';
  strand: string;
  description: string;
  assessmentCriterion?: 'A' | 'B' | 'C' | 'D';
  isHL?: boolean;
}

// ============================================================================
// PYP DESIGN (Ages 3-12) - Design Thinking in Transdisciplinary Learning
// ============================================================================

export const ibPYPDesignStandards: IBDesignStandard[] = [
  // Age Band 1 (Ages 3-5) - Early Years
  // Design Process
  { notation: 'IB.PYP.AB1.DES.PROC.1', strand: 'Design Process', description: 'Show curiosity about how things are made' },
  { notation: 'IB.PYP.AB1.DES.PROC.2', strand: 'Design Process', description: 'Experiment with different materials to create something new' },
  { notation: 'IB.PYP.AB1.DES.PROC.3', strand: 'Design Process', description: 'Share ideas about what they want to make' },
  { notation: 'IB.PYP.AB1.DES.PROC.4', strand: 'Design Process', description: 'Follow simple steps to complete a making task' },
  { notation: 'IB.PYP.AB1.DES.PROC.5', strand: 'Design Process', description: 'Talk about what they have made and how they made it' },

  // Materials and Tools
  { notation: 'IB.PYP.AB1.DES.MAT.1', strand: 'Materials and Tools', description: 'Explore different materials through touch and manipulation' },
  { notation: 'IB.PYP.AB1.DES.MAT.2', strand: 'Materials and Tools', description: 'Use basic tools safely with guidance (scissors, glue, tape)' },
  { notation: 'IB.PYP.AB1.DES.MAT.3', strand: 'Materials and Tools', description: 'Sort materials by simple properties (hard/soft, rough/smooth)' },
  { notation: 'IB.PYP.AB1.DES.MAT.4', strand: 'Materials and Tools', description: 'Choose materials appropriate for their creations' },

  // Problem Solving
  { notation: 'IB.PYP.AB1.DES.PROB.1', strand: 'Problem Solving', description: 'Notice when something is not working as expected' },
  { notation: 'IB.PYP.AB1.DES.PROB.2', strand: 'Problem Solving', description: 'Try different approaches when first attempt does not work' },
  { notation: 'IB.PYP.AB1.DES.PROB.3', strand: 'Problem Solving', description: 'Ask for help when needed while attempting solutions independently first' },

  // Age Band 2 (Ages 5-7)
  // Design Process
  { notation: 'IB.PYP.AB2.DES.PROC.1', strand: 'Design Process', description: 'Identify a simple problem or need that design could address' },
  { notation: 'IB.PYP.AB2.DES.PROC.2', strand: 'Design Process', description: 'Draw or describe ideas before making' },
  { notation: 'IB.PYP.AB2.DES.PROC.3', strand: 'Design Process', description: 'Plan the steps needed to create something' },
  { notation: 'IB.PYP.AB2.DES.PROC.4', strand: 'Design Process', description: 'Make models or prototypes using various materials' },
  { notation: 'IB.PYP.AB2.DES.PROC.5', strand: 'Design Process', description: 'Test whether their creation works as intended' },
  { notation: 'IB.PYP.AB2.DES.PROC.6', strand: 'Design Process', description: 'Suggest improvements based on testing' },
  { notation: 'IB.PYP.AB2.DES.PROC.7', strand: 'Design Process', description: 'Explain design choices using appropriate vocabulary' },

  // Materials and Tools
  { notation: 'IB.PYP.AB2.DES.MAT.1', strand: 'Materials and Tools', description: 'Identify properties of common materials (wood, paper, plastic, fabric)' },
  { notation: 'IB.PYP.AB2.DES.MAT.2', strand: 'Materials and Tools', description: 'Select appropriate materials based on their properties' },
  { notation: 'IB.PYP.AB2.DES.MAT.3', strand: 'Materials and Tools', description: 'Use a range of tools safely and with increasing precision' },
  { notation: 'IB.PYP.AB2.DES.MAT.4', strand: 'Materials and Tools', description: 'Join materials using different techniques (gluing, taping, fastening)' },
  { notation: 'IB.PYP.AB2.DES.MAT.5', strand: 'Materials and Tools', description: 'Recognize that some materials can be reused or recycled' },

  // Problem Solving
  { notation: 'IB.PYP.AB2.DES.PROB.1', strand: 'Problem Solving', description: 'Break down a problem into smaller parts' },
  { notation: 'IB.PYP.AB2.DES.PROB.2', strand: 'Problem Solving', description: 'Generate multiple ideas before choosing one to develop' },
  { notation: 'IB.PYP.AB2.DES.PROB.3', strand: 'Problem Solving', description: 'Consider what makes a solution successful' },
  { notation: 'IB.PYP.AB2.DES.PROB.4', strand: 'Problem Solving', description: 'Learn from mistakes and unsuccessful attempts' },

  // Digital Awareness
  { notation: 'IB.PYP.AB2.DES.DIG.1', strand: 'Digital Awareness', description: 'Recognize that digital devices are designed by people' },
  { notation: 'IB.PYP.AB2.DES.DIG.2', strand: 'Digital Awareness', description: 'Use simple digital tools to support design work' },
  { notation: 'IB.PYP.AB2.DES.DIG.3', strand: 'Digital Awareness', description: 'Create simple digital content (drawings, basic animations)' },

  // Age Band 3 (Ages 7-9)
  // Design Process
  { notation: 'IB.PYP.AB3.DES.PROC.1', strand: 'Design Process', description: 'Research existing solutions to understand how problems have been solved' },
  { notation: 'IB.PYP.AB3.DES.PROC.2', strand: 'Design Process', description: 'Define clear criteria for successful design solutions' },
  { notation: 'IB.PYP.AB3.DES.PROC.3', strand: 'Design Process', description: 'Create detailed plans including materials lists and steps' },
  { notation: 'IB.PYP.AB3.DES.PROC.4', strand: 'Design Process', description: 'Use the design cycle iteratively to improve solutions' },
  { notation: 'IB.PYP.AB3.DES.PROC.5', strand: 'Design Process', description: 'Document the design process through sketches, notes, and photos' },
  { notation: 'IB.PYP.AB3.DES.PROC.6', strand: 'Design Process', description: 'Evaluate designs against original criteria' },
  { notation: 'IB.PYP.AB3.DES.PROC.7', strand: 'Design Process', description: 'Present and explain design work to others' },

  // Materials and Tools
  { notation: 'IB.PYP.AB3.DES.MAT.1', strand: 'Materials and Tools', description: 'Compare properties of materials for specific purposes' },
  { notation: 'IB.PYP.AB3.DES.MAT.2', strand: 'Materials and Tools', description: 'Understand that materials can be changed through processes (heating, mixing)' },
  { notation: 'IB.PYP.AB3.DES.MAT.3', strand: 'Materials and Tools', description: 'Use specialized tools appropriate to the task' },
  { notation: 'IB.PYP.AB3.DES.MAT.4', strand: 'Materials and Tools', description: 'Apply joining techniques appropriate to materials used' },
  { notation: 'IB.PYP.AB3.DES.MAT.5', strand: 'Materials and Tools', description: 'Consider sustainability when selecting materials' },
  { notation: 'IB.PYP.AB3.DES.MAT.6', strand: 'Materials and Tools', description: 'Measure accurately using appropriate units' },

  // Problem Solving
  { notation: 'IB.PYP.AB3.DES.PROB.1', strand: 'Problem Solving', description: 'Analyze problems from multiple perspectives' },
  { notation: 'IB.PYP.AB3.DES.PROB.2', strand: 'Problem Solving', description: 'Use systematic approaches to generate creative solutions' },
  { notation: 'IB.PYP.AB3.DES.PROB.3', strand: 'Problem Solving', description: 'Test solutions systematically and record results' },
  { notation: 'IB.PYP.AB3.DES.PROB.4', strand: 'Problem Solving', description: 'Identify trade-offs in design decisions' },
  { notation: 'IB.PYP.AB3.DES.PROB.5', strand: 'Problem Solving', description: 'Collaborate with others to solve complex problems' },

  // Digital Design
  { notation: 'IB.PYP.AB3.DES.DIG.1', strand: 'Digital Design', description: 'Use digital tools for planning and designing (drawing apps, simple CAD)' },
  { notation: 'IB.PYP.AB3.DES.DIG.2', strand: 'Digital Design', description: 'Create digital presentations to share design work' },
  { notation: 'IB.PYP.AB3.DES.DIG.3', strand: 'Digital Design', description: 'Understand basic principles of user-friendly digital design' },
  { notation: 'IB.PYP.AB3.DES.DIG.4', strand: 'Digital Design', description: 'Program simple sequences using block-based coding' },

  // Age Band 4 (Ages 9-12)
  // Design Process
  { notation: 'IB.PYP.AB4.DES.PROC.1', strand: 'Design Process', description: 'Conduct comprehensive research including user needs analysis' },
  { notation: 'IB.PYP.AB4.DES.PROC.2', strand: 'Design Process', description: 'Develop design briefs with clear specifications and constraints' },
  { notation: 'IB.PYP.AB4.DES.PROC.3', strand: 'Design Process', description: 'Generate and evaluate multiple design concepts' },
  { notation: 'IB.PYP.AB4.DES.PROC.4', strand: 'Design Process', description: 'Create detailed technical drawings and specifications' },
  { notation: 'IB.PYP.AB4.DES.PROC.5', strand: 'Design Process', description: 'Build functional prototypes to test design concepts' },
  { notation: 'IB.PYP.AB4.DES.PROC.6', strand: 'Design Process', description: 'Conduct systematic testing and document findings' },
  { notation: 'IB.PYP.AB4.DES.PROC.7', strand: 'Design Process', description: 'Iterate designs based on feedback and testing' },
  { notation: 'IB.PYP.AB4.DES.PROC.8', strand: 'Design Process', description: 'Evaluate final solutions against original specifications' },

  // Materials and Technology
  { notation: 'IB.PYP.AB4.DES.MAT.1', strand: 'Materials and Technology', description: 'Analyze material properties for engineering applications' },
  { notation: 'IB.PYP.AB4.DES.MAT.2', strand: 'Materials and Technology', description: 'Understand basic structural principles (tension, compression, stability)' },
  { notation: 'IB.PYP.AB4.DES.MAT.3', strand: 'Materials and Technology', description: 'Use advanced tools and techniques with precision' },
  { notation: 'IB.PYP.AB4.DES.MAT.4', strand: 'Materials and Technology', description: 'Consider lifecycle of materials in design decisions' },
  { notation: 'IB.PYP.AB4.DES.MAT.5', strand: 'Materials and Technology', description: 'Explore how technology affects design possibilities' },
  { notation: 'IB.PYP.AB4.DES.MAT.6', strand: 'Materials and Technology', description: 'Apply principles of mechanism and motion in designs' },

  // Problem Solving and Innovation
  { notation: 'IB.PYP.AB4.DES.PROB.1', strand: 'Problem Solving', description: 'Use design thinking to address complex challenges' },
  { notation: 'IB.PYP.AB4.DES.PROB.2', strand: 'Problem Solving', description: 'Apply creative thinking techniques (brainstorming, SCAMPER, mind mapping)' },
  { notation: 'IB.PYP.AB4.DES.PROB.3', strand: 'Problem Solving', description: 'Analyze how design solutions impact people and environment' },
  { notation: 'IB.PYP.AB4.DES.PROB.4', strand: 'Problem Solving', description: 'Consider ethical implications of design decisions' },
  { notation: 'IB.PYP.AB4.DES.PROB.5', strand: 'Problem Solving', description: 'Balance competing constraints in design solutions' },

  // Digital Design
  { notation: 'IB.PYP.AB4.DES.DIG.1', strand: 'Digital Design', description: 'Use CAD software to create 2D and 3D designs' },
  { notation: 'IB.PYP.AB4.DES.DIG.2', strand: 'Digital Design', description: 'Apply principles of user interface design' },
  { notation: 'IB.PYP.AB4.DES.DIG.3', strand: 'Digital Design', description: 'Create interactive digital products using appropriate tools' },
  { notation: 'IB.PYP.AB4.DES.DIG.4', strand: 'Digital Design', description: 'Program to create functional digital solutions' },
  { notation: 'IB.PYP.AB4.DES.DIG.5', strand: 'Digital Design', description: 'Understand principles of data representation in digital systems' },

  // Design in Context
  { notation: 'IB.PYP.AB4.DES.CTX.1', strand: 'Design in Context', description: 'Investigate how design reflects cultural values and needs' },
  { notation: 'IB.PYP.AB4.DES.CTX.2', strand: 'Design in Context', description: 'Explore the history of design and technological development' },
  { notation: 'IB.PYP.AB4.DES.CTX.3', strand: 'Design in Context', description: 'Examine how design can address global challenges' },
  { notation: 'IB.PYP.AB4.DES.CTX.4', strand: 'Design in Context', description: 'Consider accessibility in design for diverse users' },
];

// ============================================================================
// MYP DESIGN (Grades 6-10) - Digital Design and Product Design
// ============================================================================

export const ibMYPDesignStandards: IBDesignStandard[] = [
  // MYP Year 1 (Grade 6)
  // Criterion A: Inquiring and Analysing
  { notation: 'IB.MYP.M1.DES.INQ.1', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Explain and justify the need for a digital solution', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.2', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Identify and prioritize primary and secondary research needed', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.3', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Analyse existing digital products for inspiration', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.4', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Develop a design brief outlining requirements', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.5', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Explain and justify the need for a product solution', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.6', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Research existing products and materials', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.DES.INQ.7', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Identify client needs and target audience', assessmentCriterion: 'A' },

  // Criterion B: Developing Ideas
  { notation: 'IB.MYP.M1.DES.DEV.1', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop a design specification for digital solutions', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.2', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Generate multiple digital design concepts', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.3', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Create wireframes and interface mockups', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.4', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Justify choice of design concept', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.5', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Develop a design specification for products', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.6', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Generate multiple product design ideas through sketching', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.DES.DEV.7', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Select appropriate materials for the design', assessmentCriterion: 'B' },

  // Criterion C: Creating the Solution
  { notation: 'IB.MYP.M1.DES.CRE.1', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Construct a logical plan for creating digital solution', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.2', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Use appropriate digital tools and techniques', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.3', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Create a functional digital solution', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.4', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Document the creation process', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.5', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Construct a logical plan for making the product', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.6', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Use tools, materials, and techniques safely', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.DES.CRE.7', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Create a functional product prototype', assessmentCriterion: 'C' },

  // Criterion D: Evaluating
  { notation: 'IB.MYP.M1.DES.EVA.1', pathway: 'Digital Design', strand: 'Evaluating', description: 'Develop testing methods for digital solutions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.DES.EVA.2', pathway: 'Digital Design', strand: 'Evaluating', description: 'Evaluate the solution against the design specification', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.DES.EVA.3', pathway: 'Digital Design', strand: 'Evaluating', description: 'Identify improvements to the digital solution', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.DES.EVA.4', pathway: 'Product Design', strand: 'Evaluating', description: 'Develop testing methods for products', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.DES.EVA.5', pathway: 'Product Design', strand: 'Evaluating', description: 'Evaluate product success against specifications', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.DES.EVA.6', pathway: 'Product Design', strand: 'Evaluating', description: 'Suggest improvements based on evaluation', assessmentCriterion: 'D' },

  // MYP Year 2 (Grade 7)
  // Criterion A: Inquiring and Analysing
  { notation: 'IB.MYP.M2.DES.INQ.1', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Explain and justify the need for a solution to a problem for a client', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.2', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Conduct primary and secondary research to inform design', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.3', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Analyse existing digital products and identify trends', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.4', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Develop a comprehensive design brief', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.5', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Research problems through user interviews and surveys', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.6', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Analyse how form and function relate in existing products', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.DES.INQ.7', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Consider ergonomic factors in design briefs', assessmentCriterion: 'A' },

  // Criterion B: Developing Ideas
  { notation: 'IB.MYP.M2.DES.DEV.1', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop detailed design specifications with constraints', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.2', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Create detailed interface designs with user flow', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.3', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Present feasible design concepts to a client', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.4', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Justify design choices with reference to research', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.5', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Create annotated sketches showing design development', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.6', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Develop scale models to test design ideas', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.DES.DEV.7', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Consider manufacturing processes in design development', assessmentCriterion: 'B' },

  // Criterion C: Creating the Solution
  { notation: 'IB.MYP.M2.DES.CRE.1', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Create detailed project plans with milestones', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.2', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Apply coding skills to create interactive solutions', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.3', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Demonstrate competent use of digital design software', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.4', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Document changes and justify modifications', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.5', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Create working drawings with dimensions', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.6', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Demonstrate competent use of workshop tools', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.DES.CRE.7', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Apply appropriate finishes to products', assessmentCriterion: 'C' },

  // Criterion D: Evaluating
  { notation: 'IB.MYP.M2.DES.EVA.1', pathway: 'Digital Design', strand: 'Evaluating', description: 'Design and apply detailed testing strategies', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.2', pathway: 'Digital Design', strand: 'Evaluating', description: 'Critically evaluate solution success', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.3', pathway: 'Digital Design', strand: 'Evaluating', description: 'Explain how solution could be improved', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.4', pathway: 'Digital Design', strand: 'Evaluating', description: 'Consider impact of solution on client and others', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.5', pathway: 'Product Design', strand: 'Evaluating', description: 'Conduct user testing with target audience', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.6', pathway: 'Product Design', strand: 'Evaluating', description: 'Evaluate quality of construction and finish', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.DES.EVA.7', pathway: 'Product Design', strand: 'Evaluating', description: 'Consider environmental impact of product', assessmentCriterion: 'D' },

  // MYP Year 3 (Grade 8)
  // Criterion A: Inquiring and Analysing
  { notation: 'IB.MYP.M3.DES.INQ.1', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Construct a detailed research plan for complex digital problems', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.2', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Analyse the impact of technology on society', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.3', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Evaluate existing digital solutions for effectiveness', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.4', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Consider accessibility requirements in design briefs', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.5', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Research manufacturing methods and constraints', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.6', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Analyse sustainability in product design', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.DES.INQ.7', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Consider global contexts in design problems', assessmentCriterion: 'A' },

  // Criterion B: Developing Ideas
  { notation: 'IB.MYP.M3.DES.DEV.1', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop specifications addressing multiple user needs', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.2', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Create interactive prototypes for user testing', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.3', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Apply design principles (hierarchy, contrast, alignment)', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.4', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop database structures for digital solutions', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.5', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Create 3D CAD models of design concepts', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.6', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Consider structural integrity in design development', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.DES.DEV.7', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Apply principles of mechanisms and motion', assessmentCriterion: 'B' },

  // Criterion C: Creating the Solution
  { notation: 'IB.MYP.M3.DES.CRE.1', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Apply programming concepts effectively (loops, conditions, functions)', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.2', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Create responsive digital interfaces', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.3', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Implement data storage and retrieval', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.4', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Document code with appropriate comments', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.5', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Use CAM technologies for precision manufacturing', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.6', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Apply advanced joining and assembly techniques', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.DES.CRE.7', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Demonstrate high-quality craftsmanship', assessmentCriterion: 'C' },

  // Criterion D: Evaluating
  { notation: 'IB.MYP.M3.DES.EVA.1', pathway: 'Digital Design', strand: 'Evaluating', description: 'Conduct comprehensive usability testing', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.2', pathway: 'Digital Design', strand: 'Evaluating', description: 'Analyse test data to identify patterns', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.3', pathway: 'Digital Design', strand: 'Evaluating', description: 'Evaluate ethical implications of digital solutions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.4', pathway: 'Digital Design', strand: 'Evaluating', description: 'Propose iterative improvements based on evaluation', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.5', pathway: 'Product Design', strand: 'Evaluating', description: 'Evaluate product performance under various conditions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.6', pathway: 'Product Design', strand: 'Evaluating', description: 'Assess lifecycle environmental impact', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.DES.EVA.7', pathway: 'Product Design', strand: 'Evaluating', description: 'Consider commercial viability of solutions', assessmentCriterion: 'D' },

  // MYP Year 4 (Grade 9)
  // Criterion A: Inquiring and Analysing
  { notation: 'IB.MYP.M4.DES.INQ.1', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Conduct comprehensive stakeholder analysis', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.2', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Analyse emerging technologies and their applications', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.3', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Evaluate digital security and privacy considerations', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.4', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Research industry standards and best practices', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.5', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Analyse market trends and opportunities', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.6', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Research advanced materials and their properties', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.DES.INQ.7', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Consider cultural factors in design problems', assessmentCriterion: 'A' },

  // Criterion B: Developing Ideas
  { notation: 'IB.MYP.M4.DES.DEV.1', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop comprehensive technical specifications', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.2', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Design scalable system architectures', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.3', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Create comprehensive user experience designs', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.4', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop algorithms for complex functionality', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.5', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Apply biomimicry in design solutions', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.6', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Design for disassembly and recycling', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.DES.DEV.7', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Integrate electronics with physical products', assessmentCriterion: 'B' },

  // Criterion C: Creating the Solution
  { notation: 'IB.MYP.M4.DES.CRE.1', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Implement object-oriented programming principles', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.2', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Create solutions using APIs and frameworks', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.3', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Implement version control in development', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.4', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Apply testing strategies during development', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.5', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Use rapid prototyping technologies (3D printing, laser cutting)', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.6', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Integrate multiple materials in construction', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.DES.CRE.7', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Apply industrial finishing techniques', assessmentCriterion: 'C' },

  // Criterion D: Evaluating
  { notation: 'IB.MYP.M4.DES.EVA.1', pathway: 'Digital Design', strand: 'Evaluating', description: 'Conduct A/B testing to optimize solutions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.2', pathway: 'Digital Design', strand: 'Evaluating', description: 'Analyse user analytics and feedback data', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.3', pathway: 'Digital Design', strand: 'Evaluating', description: 'Evaluate scalability and performance', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.4', pathway: 'Digital Design', strand: 'Evaluating', description: 'Consider long-term maintenance requirements', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.5', pathway: 'Product Design', strand: 'Evaluating', description: 'Conduct stress testing and durability analysis', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.6', pathway: 'Product Design', strand: 'Evaluating', description: 'Evaluate manufacturing cost implications', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.DES.EVA.7', pathway: 'Product Design', strand: 'Evaluating', description: 'Consider global distribution challenges', assessmentCriterion: 'D' },

  // MYP Year 5 (Grade 10)
  // Criterion A: Inquiring and Analysing
  { notation: 'IB.MYP.M5.DES.INQ.1', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Conduct independent comprehensive research for complex problems', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.2', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Analyse systemic impacts of digital technologies', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.3', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Evaluate global implications of digital solutions', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.4', pathway: 'Digital Design', strand: 'Inquiring and Analysing', description: 'Synthesize research to inform sophisticated design briefs', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.5', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Analyse circular economy principles in design', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.6', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Research cutting-edge manufacturing technologies', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.DES.INQ.7', pathway: 'Product Design', strand: 'Inquiring and Analysing', description: 'Evaluate social responsibility in design practice', assessmentCriterion: 'A' },

  // Criterion B: Developing Ideas
  { notation: 'IB.MYP.M5.DES.DEV.1', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Develop innovative solutions to complex problems', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.2', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Create sophisticated system designs with multiple components', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.3', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Design for diverse user groups and accessibility', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.4', pathway: 'Digital Design', strand: 'Developing Ideas', description: 'Justify design decisions with sophisticated reasoning', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.5', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Design products for mass production', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.6', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Apply systems thinking in product design', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.DES.DEV.7', pathway: 'Product Design', strand: 'Developing Ideas', description: 'Develop comprehensive product specifications for manufacture', assessmentCriterion: 'B' },

  // Criterion C: Creating the Solution
  { notation: 'IB.MYP.M5.DES.CRE.1', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Develop sophisticated functional solutions independently', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.2', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Implement advanced programming techniques', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.3', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Create professional-quality digital products', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.4', pathway: 'Digital Design', strand: 'Creating the Solution', description: 'Maintain comprehensive development documentation', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.5', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Create production-ready prototypes', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.6', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Demonstrate mastery of manufacturing processes', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.DES.CRE.7', pathway: 'Product Design', strand: 'Creating the Solution', description: 'Create comprehensive technical documentation', assessmentCriterion: 'C' },

  // Criterion D: Evaluating
  { notation: 'IB.MYP.M5.DES.EVA.1', pathway: 'Digital Design', strand: 'Evaluating', description: 'Design and implement comprehensive evaluation strategies', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.2', pathway: 'Digital Design', strand: 'Evaluating', description: 'Critically evaluate solutions against all criteria', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.3', pathway: 'Digital Design', strand: 'Evaluating', description: 'Propose sophisticated improvements with justification', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.4', pathway: 'Digital Design', strand: 'Evaluating', description: 'Reflect critically on design process and personal growth', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.5', pathway: 'Product Design', strand: 'Evaluating', description: 'Conduct professional-level product evaluation', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.6', pathway: 'Product Design', strand: 'Evaluating', description: 'Evaluate complete product lifecycle impact', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.DES.EVA.7', pathway: 'Product Design', strand: 'Evaluating', description: 'Present comprehensive evaluation to stakeholders', assessmentCriterion: 'D' },
];

// ============================================================================
// DP DESIGN TECHNOLOGY (Grades 11-12) - Group 4 Sciences
// ============================================================================

export const ibDPDesignTechnologyStandards: IBDesignStandard[] = [
  // Year 1 (Grade 11) - Common Core Topics

  // Topic 1: Human Factors and Ergonomics
  { notation: 'IB.DP.D1.DT.HFE.1', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Explain anthropometrics and its application in design' },
  { notation: 'IB.DP.D1.DT.HFE.2', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Use anthropometric data to inform design decisions' },
  { notation: 'IB.DP.D1.DT.HFE.3', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Analyse psychological factors affecting user behaviour' },
  { notation: 'IB.DP.D1.DT.HFE.4', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Evaluate physiological factors in product interaction' },
  { notation: 'IB.DP.D1.DT.HFE.5', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Apply ergonomic principles to product design' },
  { notation: 'IB.DP.D1.DT.HFE.6', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Design for accessibility and inclusive use' },
  { notation: 'IB.DP.D1.DT.HFE.7', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Evaluate products for ergonomic effectiveness' },

  // Topic 2: Resource Management and Sustainable Production
  { notation: 'IB.DP.D1.DT.RMS.1', pathway: 'Design Technology', strand: 'Resource Management', description: 'Analyse the environmental impact of raw material extraction' },
  { notation: 'IB.DP.D1.DT.RMS.2', pathway: 'Design Technology', strand: 'Resource Management', description: 'Evaluate renewable and non-renewable material sources' },
  { notation: 'IB.DP.D1.DT.RMS.3', pathway: 'Design Technology', strand: 'Resource Management', description: 'Apply lifecycle analysis to product design' },
  { notation: 'IB.DP.D1.DT.RMS.4', pathway: 'Design Technology', strand: 'Resource Management', description: 'Evaluate production processes for sustainability' },
  { notation: 'IB.DP.D1.DT.RMS.5', pathway: 'Design Technology', strand: 'Resource Management', description: 'Analyse waste management strategies' },
  { notation: 'IB.DP.D1.DT.RMS.6', pathway: 'Design Technology', strand: 'Resource Management', description: 'Apply design for environment principles' },
  { notation: 'IB.DP.D1.DT.RMS.7', pathway: 'Design Technology', strand: 'Resource Management', description: 'Evaluate eco-design strategies' },
  { notation: 'IB.DP.D1.DT.RMS.8', pathway: 'Design Technology', strand: 'Resource Management', description: 'Analyse energy efficiency in production' },

  // Topic 3: Modelling
  { notation: 'IB.DP.D1.DT.MOD.1', pathway: 'Design Technology', strand: 'Modelling', description: 'Explain the purpose of different types of models' },
  { notation: 'IB.DP.D1.DT.MOD.2', pathway: 'Design Technology', strand: 'Modelling', description: 'Create conceptual models to communicate ideas' },
  { notation: 'IB.DP.D1.DT.MOD.3', pathway: 'Design Technology', strand: 'Modelling', description: 'Develop physical models for testing' },
  { notation: 'IB.DP.D1.DT.MOD.4', pathway: 'Design Technology', strand: 'Modelling', description: 'Use CAD software for 3D modelling' },
  { notation: 'IB.DP.D1.DT.MOD.5', pathway: 'Design Technology', strand: 'Modelling', description: 'Apply rapid prototyping technologies' },
  { notation: 'IB.DP.D1.DT.MOD.6', pathway: 'Design Technology', strand: 'Modelling', description: 'Evaluate models for accuracy and usefulness' },
  { notation: 'IB.DP.D1.DT.MOD.7', pathway: 'Design Technology', strand: 'Modelling', description: 'Use virtual simulation for testing designs' },

  // Topic 4: Raw Material to Final Product
  { notation: 'IB.DP.D1.DT.MAT.1', pathway: 'Design Technology', strand: 'Materials', description: 'Classify materials by properties and applications' },
  { notation: 'IB.DP.D1.DT.MAT.2', pathway: 'Design Technology', strand: 'Materials', description: 'Analyse mechanical properties of materials' },
  { notation: 'IB.DP.D1.DT.MAT.3', pathway: 'Design Technology', strand: 'Materials', description: 'Evaluate thermal and electrical properties' },
  { notation: 'IB.DP.D1.DT.MAT.4', pathway: 'Design Technology', strand: 'Materials', description: 'Select appropriate materials for design requirements' },
  { notation: 'IB.DP.D1.DT.MAT.5', pathway: 'Design Technology', strand: 'Materials', description: 'Analyse manufacturing processes for different materials' },
  { notation: 'IB.DP.D1.DT.MAT.6', pathway: 'Design Technology', strand: 'Materials', description: 'Evaluate joining methods for material combinations' },
  { notation: 'IB.DP.D1.DT.MAT.7', pathway: 'Design Technology', strand: 'Materials', description: 'Apply finishing techniques appropriate to materials' },
  { notation: 'IB.DP.D1.DT.MAT.8', pathway: 'Design Technology', strand: 'Materials', description: 'Analyse smart and composite materials' },

  // Topic 5: Innovation and Design
  { notation: 'IB.DP.D1.DT.INN.1', pathway: 'Design Technology', strand: 'Innovation', description: 'Explain the role of invention and innovation in design' },
  { notation: 'IB.DP.D1.DT.INN.2', pathway: 'Design Technology', strand: 'Innovation', description: 'Analyse strategies for fostering innovation' },
  { notation: 'IB.DP.D1.DT.INN.3', pathway: 'Design Technology', strand: 'Innovation', description: 'Evaluate intellectual property and patent systems' },
  { notation: 'IB.DP.D1.DT.INN.4', pathway: 'Design Technology', strand: 'Innovation', description: 'Apply design thinking methodologies' },
  { notation: 'IB.DP.D1.DT.INN.5', pathway: 'Design Technology', strand: 'Innovation', description: 'Analyse the relationship between technology push and market pull' },
  { notation: 'IB.DP.D1.DT.INN.6', pathway: 'Design Technology', strand: 'Innovation', description: 'Evaluate factors influencing diffusion of innovation' },
  { notation: 'IB.DP.D1.DT.INN.7', pathway: 'Design Technology', strand: 'Innovation', description: 'Apply creative thinking techniques in design' },

  // Topic 6: Classic Design
  { notation: 'IB.DP.D1.DT.CLS.1', pathway: 'Design Technology', strand: 'Classic Design', description: 'Analyse design movements and their influence' },
  { notation: 'IB.DP.D1.DT.CLS.2', pathway: 'Design Technology', strand: 'Classic Design', description: 'Evaluate iconic designs and their lasting impact' },
  { notation: 'IB.DP.D1.DT.CLS.3', pathway: 'Design Technology', strand: 'Classic Design', description: 'Analyse the work of influential designers' },
  { notation: 'IB.DP.D1.DT.CLS.4', pathway: 'Design Technology', strand: 'Classic Design', description: 'Evaluate the relationship between form and function' },
  { notation: 'IB.DP.D1.DT.CLS.5', pathway: 'Design Technology', strand: 'Classic Design', description: 'Analyse aesthetic considerations in design' },
  { notation: 'IB.DP.D1.DT.CLS.6', pathway: 'Design Technology', strand: 'Classic Design', description: 'Evaluate cultural influences on design' },

  // Design Cycle and Internal Assessment
  { notation: 'IB.DP.D1.DT.DC.1', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Apply the design cycle to analyse design opportunities' },
  { notation: 'IB.DP.D1.DT.DC.2', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Develop comprehensive design specifications' },
  { notation: 'IB.DP.D1.DT.DC.3', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Generate and evaluate multiple design concepts' },
  { notation: 'IB.DP.D1.DT.DC.4', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Develop detailed designs for feasible solutions' },
  { notation: 'IB.DP.D1.DT.DC.5', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Create functional prototypes' },
  { notation: 'IB.DP.D1.DT.DC.6', pathway: 'Design Technology', strand: 'Design Cycle', description: 'Test and evaluate solutions systematically' },

  // Year 2 (Grade 12) - Core Completion and HL Extension

  // Advanced Core Topics
  { notation: 'IB.DP.D2.DT.HFE.1', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Analyse cognitive ergonomics in interface design' },
  { notation: 'IB.DP.D2.DT.HFE.2', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Evaluate safety factors in product design' },
  { notation: 'IB.DP.D2.DT.HFE.3', pathway: 'Design Technology', strand: 'Human Factors and Ergonomics', description: 'Apply universal design principles' },

  { notation: 'IB.DP.D2.DT.RMS.1', pathway: 'Design Technology', strand: 'Resource Management', description: 'Analyse circular economy models in design' },
  { notation: 'IB.DP.D2.DT.RMS.2', pathway: 'Design Technology', strand: 'Resource Management', description: 'Evaluate cradle-to-cradle design approaches' },
  { notation: 'IB.DP.D2.DT.RMS.3', pathway: 'Design Technology', strand: 'Resource Management', description: 'Apply sustainable development goals to design' },

  { notation: 'IB.DP.D2.DT.MAT.1', pathway: 'Design Technology', strand: 'Materials', description: 'Analyse advanced and emerging materials' },
  { notation: 'IB.DP.D2.DT.MAT.2', pathway: 'Design Technology', strand: 'Materials', description: 'Evaluate nanotechnology applications in design' },
  { notation: 'IB.DP.D2.DT.MAT.3', pathway: 'Design Technology', strand: 'Materials', description: 'Analyse biomaterials and their applications' },

  // HL Extension Topic 7: User-Centred Design (UCD)
  { notation: 'IB.DP.D2.DT.UCD.1', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Explain the principles and process of user-centred design', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.2', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Apply user research methods (interviews, observations, surveys)', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.3', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Create user personas and scenarios', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.4', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Develop user journey maps', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.5', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Apply usability testing methodologies', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.6', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Evaluate products using UCD criteria', isHL: true },
  { notation: 'IB.DP.D2.DT.UCD.7', pathway: 'Design Technology', strand: 'User-Centred Design', description: 'Iterate designs based on user feedback', isHL: true },

  // HL Extension Topic 8: Sustainability
  { notation: 'IB.DP.D2.DT.SUS.1', pathway: 'Design Technology', strand: 'Sustainability', description: 'Analyse sustainable design strategies', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.2', pathway: 'Design Technology', strand: 'Sustainability', description: 'Evaluate design for disassembly approaches', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.3', pathway: 'Design Technology', strand: 'Sustainability', description: 'Apply biomimicry principles in design', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.4', pathway: 'Design Technology', strand: 'Sustainability', description: 'Analyse planned obsolescence and its alternatives', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.5', pathway: 'Design Technology', strand: 'Sustainability', description: 'Evaluate extended producer responsibility', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.6', pathway: 'Design Technology', strand: 'Sustainability', description: 'Design for social sustainability', isHL: true },
  { notation: 'IB.DP.D2.DT.SUS.7', pathway: 'Design Technology', strand: 'Sustainability', description: 'Apply triple bottom line evaluation', isHL: true },

  // HL Extension Topic 9: Innovation and Markets
  { notation: 'IB.DP.D2.DT.MKT.1', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Analyse market research methodologies', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.2', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Evaluate product positioning strategies', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.3', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Analyse branding and its impact on design', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.4', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Evaluate product launch strategies', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.5', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Analyse global market considerations', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.6', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Evaluate design for global markets', isHL: true },
  { notation: 'IB.DP.D2.DT.MKT.7', pathway: 'Design Technology', strand: 'Innovation and Markets', description: 'Analyse market segmentation in design', isHL: true },

  // HL Extension Topic 10: Commercial Production
  { notation: 'IB.DP.D2.DT.COM.1', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Analyse production systems (job, batch, mass, continuous)', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.2', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Evaluate lean manufacturing principles', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.3', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Analyse quality control and assurance systems', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.4', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Evaluate automation and robotics in production', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.5', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Analyse supply chain management', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.6', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Evaluate cost factors in commercial production', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.7', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Design for manufacturability', isHL: true },
  { notation: 'IB.DP.D2.DT.COM.8', pathway: 'Design Technology', strand: 'Commercial Production', description: 'Analyse Industry 4.0 and smart manufacturing', isHL: true },

  // HL Design Project Extension
  { notation: 'IB.DP.D2.DT.PRJ.1', pathway: 'Design Technology', strand: 'Design Project', description: 'Develop detailed commercial product specifications', isHL: true },
  { notation: 'IB.DP.D2.DT.PRJ.2', pathway: 'Design Technology', strand: 'Design Project', description: 'Create production planning documentation', isHL: true },
  { notation: 'IB.DP.D2.DT.PRJ.3', pathway: 'Design Technology', strand: 'Design Project', description: 'Make justified choices for commercial production methods', isHL: true },
  { notation: 'IB.DP.D2.DT.PRJ.4', pathway: 'Design Technology', strand: 'Design Project', description: 'Evaluate commercial viability of designs', isHL: true },
];

// ============================================================================
// COMBINED EXPORTS AND HELPER FUNCTIONS
// ============================================================================

export const allIBDesignStandards: IBDesignStandard[] = [
  ...ibPYPDesignStandards,
  ...ibMYPDesignStandards,
  ...ibDPDesignTechnologyStandards,
];

/**
 * Get standards by programme level
 */
export function getDesignStandardsByProgramme(programme: 'PYP' | 'MYP' | 'DP'): IBDesignStandard[] {
  switch (programme) {
    case 'PYP':
      return ibPYPDesignStandards;
    case 'MYP':
      return ibMYPDesignStandards;
    case 'DP':
      return ibDPDesignTechnologyStandards;
    default:
      return [];
  }
}

/**
 * Get MYP standards by year (1-5)
 */
export function getMYPDesignStandardsByYear(year: number): IBDesignStandard[] {
  const yearCode = `M${year}`;
  return ibMYPDesignStandards.filter(s => s.notation.includes(`.${yearCode}.`));
}

/**
 * Get DP standards by year (1-2)
 */
export function getDPDesignStandardsByYear(year: number): IBDesignStandard[] {
  const yearCode = `D${year}`;
  return ibDPDesignTechnologyStandards.filter(s => s.notation.includes(`.${yearCode}.`));
}

/**
 * Get PYP standards by age band (1-4)
 */
export function getPYPDesignStandardsByAgeBand(ageBand: number): IBDesignStandard[] {
  const bandCode = `AB${ageBand}`;
  return ibPYPDesignStandards.filter(s => s.notation.includes(`.${bandCode}.`));
}

/**
 * Get standards by pathway (Digital Design, Product Design, or Design Technology)
 */
export function getDesignStandardsByPathway(pathway: 'Digital Design' | 'Product Design' | 'Design Technology'): IBDesignStandard[] {
  return allIBDesignStandards.filter(s => s.pathway === pathway);
}

/**
 * Get MYP standards by assessment criterion
 */
export function getMYPDesignStandardsByCriterion(criterion: 'A' | 'B' | 'C' | 'D'): IBDesignStandard[] {
  return ibMYPDesignStandards.filter(s => s.assessmentCriterion === criterion);
}

/**
 * Get standards by strand
 */
export function getDesignStandardsByStrand(strand: string): IBDesignStandard[] {
  return allIBDesignStandards.filter(s => s.strand === strand);
}

/**
 * Get HL-only standards for DP
 */
export function getDPDesignHLStandards(): IBDesignStandard[] {
  return ibDPDesignTechnologyStandards.filter(s => s.isHL === true);
}

/**
 * Get SL standards for DP (not HL-only)
 */
export function getDPDesignSLStandards(): IBDesignStandard[] {
  return ibDPDesignTechnologyStandards.filter(s => !s.isHL);
}

/**
 * Get standards count summary
 */
export function getDesignStandardsSummary(): {
  total: number;
  pyp: number;
  myp: number;
  dp: number;
  dpHL: number;
  dpSL: number;
} {
  return {
    total: allIBDesignStandards.length,
    pyp: ibPYPDesignStandards.length,
    myp: ibMYPDesignStandards.length,
    dp: ibDPDesignTechnologyStandards.length,
    dpHL: getDPDesignHLStandards().length,
    dpSL: getDPDesignSLStandards().length,
  };
}
