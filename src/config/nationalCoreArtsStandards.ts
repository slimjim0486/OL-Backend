/**
 * National Core Arts Standards (NCAS)
 *
 * Comprehensive K-12 arts education standards for the United States.
 * Source: https://www.nationalartsstandards.org/
 *
 * Five Disciplines: Dance, Media Arts, Music, Theatre, Visual Arts
 *
 * Four Artistic Processes with 11 Anchor Standards:
 * - Creating (CR): AS1-Generate, AS2-Organize, AS3-Refine
 * - Performing/Presenting/Producing (PR): AS4-Select, AS5-Develop, AS6-Convey
 * - Responding (RE): AS7-Perceive, AS8-Interpret, AS9-Evaluate
 * - Connecting (CN): AS10-Synthesize, AS11-Relate
 *
 * Grade Levels: PreK-8 (by grade), HS Proficient/Accomplished/Advanced
 */

export type ArtsDiscipline = 'DA' | 'MA' | 'MU' | 'TH' | 'VA';
export type ArtisticProcess = 'CR' | 'PR' | 'RE' | 'CN';
export type HSLevel = 'Prof' | 'Acc' | 'Adv';

export interface NCASStandard {
  notation: string;
  discipline: ArtsDiscipline;
  process: ArtisticProcess;
  anchorStandard: number;
  grade: string;
  description: string;
}

// ============================================================================
// VISUAL ARTS (VA)
// ============================================================================

export const visualArtsStandards: NCASStandard[] = [
  // PreK
  { notation: 'VA.CR.1.PK', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: 'PK', description: 'Engage in exploration and imaginative play with materials' },
  { notation: 'VA.CR.2.PK', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: 'PK', description: 'Use a variety of art-making tools' },
  { notation: 'VA.CR.3.PK', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: 'PK', description: 'Share and talk about personal artwork' },
  { notation: 'VA.PR.4.PK', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: 'PK', description: 'Select art objects for personal portfolio and display' },
  { notation: 'VA.PR.5.PK', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: 'PK', description: 'Identify places where art may be displayed or saved' },
  { notation: 'VA.PR.6.PK', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: 'PK', description: 'Identify why some objects, artifacts, and artworks are valued over others' },
  { notation: 'VA.RE.7.PK', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: 'PK', description: 'Recognize art in one\'s environment' },
  { notation: 'VA.RE.8.PK', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: 'PK', description: 'Interpret art by identifying and describing subject matter' },
  { notation: 'VA.RE.9.PK', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: 'PK', description: 'Select a preferred artwork' },
  { notation: 'VA.CN.10.PK', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: 'PK', description: 'Create art that tells a story about a life experience' },
  { notation: 'VA.CN.11.PK', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: 'PK', description: 'Recognize that people make art' },

  // Kindergarten
  { notation: 'VA.CR.1.K', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: 'K', description: 'Engage collaboratively in exploration and imaginative play with materials' },
  { notation: 'VA.CR.2.K', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: 'K', description: 'Through experimentation, build skills and knowledge of materials and tools' },
  { notation: 'VA.CR.3.K', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: 'K', description: 'Explain the process of making art while creating' },
  { notation: 'VA.PR.4.K', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: 'K', description: 'Select art objects for personal portfolio and explain why they were chosen' },
  { notation: 'VA.PR.5.K', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: 'K', description: 'Explain the purpose of a portfolio or collection' },
  { notation: 'VA.PR.6.K', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: 'K', description: 'Explain what an art museum is and distinguish how it differs from other buildings' },
  { notation: 'VA.RE.7.K', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: 'K', description: 'Identify uses of art within one\'s personal environment' },
  { notation: 'VA.RE.8.K', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: 'K', description: 'Interpret art by identifying subject matter and describing relevant details' },
  { notation: 'VA.RE.9.K', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: 'K', description: 'Explain reasons for selecting a preferred artwork' },
  { notation: 'VA.CN.10.K', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: 'K', description: 'Create art that tells a story about a life experience' },
  { notation: 'VA.CN.11.K', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: 'K', description: 'Identify a purpose of an artwork' },

  // Grade 1
  { notation: 'VA.CR.1.1', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '1', description: 'Engage collaboratively in exploration and imaginative play with materials' },
  { notation: 'VA.CR.2.1', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '1', description: 'Explore uses of materials and tools to create works of art or design' },
  { notation: 'VA.CR.3.1', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '1', description: 'Use art vocabulary to describe choices while creating art' },
  { notation: 'VA.PR.4.1', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '1', description: 'Explain why some objects, artifacts, and artworks are valued over others' },
  { notation: 'VA.PR.5.1', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '1', description: 'Ask and answer questions about preparing and presenting artwork' },
  { notation: 'VA.PR.6.1', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '1', description: 'Identify the roles and responsibilities of people who work in museums and galleries' },
  { notation: 'VA.RE.7.1', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '1', description: 'Select and describe works of art that illustrate daily life experiences' },
  { notation: 'VA.RE.8.1', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '1', description: 'Interpret art by categorizing subject matter and identifying characteristics' },
  { notation: 'VA.RE.9.1', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '1', description: 'Classify artwork based on different reasons for preferences' },
  { notation: 'VA.CN.10.1', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '1', description: 'Identify times, places, and reasons students make art outside of school' },
  { notation: 'VA.CN.11.1', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '1', description: 'Understand that people from different places and times make art about different things' },

  // Grade 2
  { notation: 'VA.CR.1.2', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '2', description: 'Brainstorm collaboratively multiple approaches to an art or design problem' },
  { notation: 'VA.CR.2.2', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '2', description: 'Demonstrate safe and proper procedures for using materials, tools, and equipment' },
  { notation: 'VA.CR.3.2', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '2', description: 'Discuss and reflect with peers about choices made in creating artwork' },
  { notation: 'VA.PR.4.2', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '2', description: 'Categorize artwork based on a theme or concept for an exhibit' },
  { notation: 'VA.PR.5.2', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '2', description: 'Distinguish between different materials or artistic techniques for preparing artwork' },
  { notation: 'VA.PR.6.2', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '2', description: 'Analyze how art exhibited inside and outside of schools contributes to communities' },
  { notation: 'VA.RE.7.2', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '2', description: 'Perceive and describe aesthetic characteristics of one\'s natural world and constructed environments' },
  { notation: 'VA.RE.8.2', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '2', description: 'Interpret art by identifying the mood suggested by a work of art' },
  { notation: 'VA.RE.9.2', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '2', description: 'Use learned art vocabulary to express preferences about artwork' },
  { notation: 'VA.CN.10.2', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '2', description: 'Create works of art about events in home, school, or community life' },
  { notation: 'VA.CN.11.2', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '2', description: 'Compare and contrast cultural uses of artwork from different times and places' },

  // Grade 3
  { notation: 'VA.CR.1.3', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '3', description: 'Elaborate on an imaginative idea' },
  { notation: 'VA.CR.2.3', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '3', description: 'Create personally satisfying artwork using a variety of artistic processes and materials' },
  { notation: 'VA.CR.3.3', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '3', description: 'Elaborate visual information by adding details to enhance emerging meaning' },
  { notation: 'VA.PR.4.3', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '3', description: 'Investigate and discuss possibilities and limitations of spaces for exhibiting artwork' },
  { notation: 'VA.PR.5.3', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '3', description: 'Identify exhibit space and prepare works of art for presentation' },
  { notation: 'VA.PR.6.3', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '3', description: 'Identify and explain how and where different cultures record and illustrate stories' },
  { notation: 'VA.RE.7.3', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '3', description: 'Speculate about processes an artist uses to create a work of art' },
  { notation: 'VA.RE.8.3', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '3', description: 'Interpret art by analyzing use of media to create subject matter, characteristics of form' },
  { notation: 'VA.RE.9.3', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '3', description: 'Evaluate an artwork based on given criteria' },
  { notation: 'VA.CN.10.3', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '3', description: 'Develop a work of art based on observations of surroundings' },
  { notation: 'VA.CN.11.3', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '3', description: 'Recognize that responses to art change depending on knowledge of the time and place' },

  // Grade 4
  { notation: 'VA.CR.1.4', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '4', description: 'Brainstorm multiple approaches to a creative art or design problem' },
  { notation: 'VA.CR.2.4', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '4', description: 'Explore and invent art-making techniques and approaches' },
  { notation: 'VA.CR.3.4', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '4', description: 'Revise artwork in progress on the basis of insights gained through peer discussion' },
  { notation: 'VA.PR.4.4', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '4', description: 'Analyze how past, present, and emerging technologies have impacted art preservation' },
  { notation: 'VA.PR.5.4', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '4', description: 'Analyze the various considerations for presenting and protecting art' },
  { notation: 'VA.PR.6.4', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '4', description: 'Compare and contrast purposes of art museums, art galleries, and other venues' },
  { notation: 'VA.RE.7.4', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '4', description: 'Compare responses to a work of art before and after working in similar media' },
  { notation: 'VA.RE.8.4', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '4', description: 'Interpret art by referring to contextual information and analyzing relevant subject matter' },
  { notation: 'VA.RE.9.4', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '4', description: 'Apply one set of criteria to evaluate more than one work of art' },
  { notation: 'VA.CN.10.4', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '4', description: 'Create works of art that reflect community cultural traditions' },
  { notation: 'VA.CN.11.4', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '4', description: 'Through observation, infer information about time, place, and culture' },

  // Grade 5
  { notation: 'VA.CR.1.5', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '5', description: 'Combine ideas to generate an innovative idea for art-making' },
  { notation: 'VA.CR.2.5', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '5', description: 'Demonstrate quality craftsmanship through care for and use of materials, tools, and equipment' },
  { notation: 'VA.CR.3.5', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '5', description: 'Create artist statements using art vocabulary to describe personal choices in art-making' },
  { notation: 'VA.PR.4.5', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '5', description: 'Define the roles and responsibilities of a curator, explaining the skills needed' },
  { notation: 'VA.PR.5.5', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '5', description: 'Develop a logical argument for safe and effective use of materials and techniques' },
  { notation: 'VA.PR.6.5', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '5', description: 'Cite evidence about how an exhibition in a museum or other venue presents ideas' },
  { notation: 'VA.RE.7.5', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '5', description: 'Compare one\'s own interpretation of a work of art with the interpretation of others' },
  { notation: 'VA.RE.8.5', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '5', description: 'Interpret art by analyzing characteristics of form and structure' },
  { notation: 'VA.RE.9.5', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '5', description: 'Recognize differences in criteria used to evaluate works of art' },
  { notation: 'VA.CN.10.5', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '5', description: 'Apply formal and conceptual vocabularies of art and design to view surroundings' },
  { notation: 'VA.CN.11.5', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '5', description: 'Identify how art is used to inform or change beliefs, values, or behaviors' },

  // Grade 6
  { notation: 'VA.CR.1.6', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '6', description: 'Combine concepts collaboratively to generate innovative ideas for creating art' },
  { notation: 'VA.CR.2.6', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '6', description: 'Demonstrate openness in trying new ideas, materials, methods, and approaches' },
  { notation: 'VA.CR.3.6', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '6', description: 'Reflect on whether personal artwork conveys the intended meaning and revise accordingly' },
  { notation: 'VA.PR.4.6', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '6', description: 'Analyze similarities and differences associated with preserving and presenting art' },
  { notation: 'VA.PR.5.6', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '6', description: 'Individually or collaboratively, develop a visual plan for displaying works of art' },
  { notation: 'VA.PR.6.6', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '6', description: 'Assess, explain, and provide evidence of how museums or other venues reflect history' },
  { notation: 'VA.RE.7.6', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '6', description: 'Identify and interpret works of art that reveal how people live and what they value' },
  { notation: 'VA.RE.8.6', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '6', description: 'Interpret art by distinguishing between relevant and non-relevant contextual information' },
  { notation: 'VA.RE.9.6', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '6', description: 'Develop and apply relevant criteria to evaluate a work of art' },
  { notation: 'VA.CN.10.6', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '6', description: 'Generate a collection of ideas reflecting current interests and concerns' },
  { notation: 'VA.CN.11.6', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '6', description: 'Analyze how art reflects changing times, traditions, resources, and cultural uses' },

  // Grade 7
  { notation: 'VA.CR.1.7', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '7', description: 'Apply methods to overcome creative blocks' },
  { notation: 'VA.CR.2.7', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '7', description: 'Demonstrate persistence in developing skills with various materials, methods, and approaches' },
  { notation: 'VA.CR.3.7', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '7', description: 'Reflect on and explain important information about personal artwork in an artist statement' },
  { notation: 'VA.PR.4.7', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '7', description: 'Compare and contrast how technologies have changed the way artwork is preserved' },
  { notation: 'VA.PR.5.7', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '7', description: 'Based on criteria, analyze and evaluate methods for preparing and presenting art' },
  { notation: 'VA.PR.6.7', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '7', description: 'Compare and contrast viewing and experiencing collections and exhibitions' },
  { notation: 'VA.RE.7.7', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '7', description: 'Explain how the method of display, the location, and the experience of an artwork influence perception' },
  { notation: 'VA.RE.8.7', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '7', description: 'Interpret art by analyzing art-making approaches, the characteristics of form and structure' },
  { notation: 'VA.RE.9.7', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '7', description: 'Compare and explain the difference between an evaluation of an artwork based on personal criteria' },
  { notation: 'VA.CN.10.7', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '7', description: 'Individually or collaboratively, create visual documentation of places and times' },
  { notation: 'VA.CN.11.7', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '7', description: 'Analyze how response to art is influenced by understanding the time and place' },

  // Grade 8
  { notation: 'VA.CR.1.8', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: '8', description: 'Document early stages of the creative process visually and/or verbally' },
  { notation: 'VA.CR.2.8', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: '8', description: 'Demonstrate willingness to experiment, innovate, and take risks to pursue ideas' },
  { notation: 'VA.CR.3.8', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: '8', description: 'Apply relevant criteria to examine, reflect on, and plan revisions for a work of art' },
  { notation: 'VA.PR.4.8', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: '8', description: 'Develop and apply criteria for evaluating a collection of artwork for presentation' },
  { notation: 'VA.PR.5.8', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: '8', description: 'Collaboratively prepare and present selected artworks for a specific exhibit' },
  { notation: 'VA.PR.6.8', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: '8', description: 'Analyze why and how an exhibition or collection may influence ideas, beliefs, and experiences' },
  { notation: 'VA.RE.7.8', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: '8', description: 'Explain how a person\'s aesthetic choices are influenced by culture and environment' },
  { notation: 'VA.RE.8.8', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: '8', description: 'Interpret art by analyzing how the interaction of subject matter, characteristics of form' },
  { notation: 'VA.RE.9.8', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: '8', description: 'Create a convincing and logical argument to support an evaluation of art' },
  { notation: 'VA.CN.10.8', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: '8', description: 'Make art collaboratively to reflect on and reinforce positive aspects of group identity' },
  { notation: 'VA.CN.11.8', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: '8', description: 'Distinguish different ways art is used to represent, establish, reinforce, and reflect group identity' },

  // High School Proficient
  { notation: 'VA.CR.1.Prof', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: 'Prof', description: 'Use multiple approaches to begin creative endeavors' },
  { notation: 'VA.CR.2.Prof', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: 'Prof', description: 'Engage in making a work of art without having a preconceived plan' },
  { notation: 'VA.CR.3.Prof', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: 'Prof', description: 'Apply relevant criteria from traditional and contemporary cultural contexts to examine and reflect on artworks' },
  { notation: 'VA.PR.4.Prof', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: 'Prof', description: 'Analyze, select, and curate artifacts and/or artworks for presentation and preservation' },
  { notation: 'VA.PR.5.Prof', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: 'Prof', description: 'Analyze and evaluate the reasons and ways an exhibition is presented' },
  { notation: 'VA.PR.6.Prof', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: 'Prof', description: 'Analyze and describe the impact that an exhibition or collection has on personal awareness' },
  { notation: 'VA.RE.7.Prof', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: 'Prof', description: 'Hypothesize ways in which art influences perception and understanding of human experiences' },
  { notation: 'VA.RE.8.Prof', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: 'Prof', description: 'Interpret an artwork or collection of works, supported by relevant and sufficient evidence' },
  { notation: 'VA.RE.9.Prof', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: 'Prof', description: 'Establish relevant criteria in order to evaluate a work of art or collection of works' },
  { notation: 'VA.CN.10.Prof', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: 'Prof', description: 'Document the process of developing ideas from early stages to fully elaborated ideas' },
  { notation: 'VA.CN.11.Prof', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: 'Prof', description: 'Describe how knowledge of culture, traditions, and history may influence personal responses to art' },

  // High School Accomplished
  { notation: 'VA.CR.1.Acc', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: 'Acc', description: 'Individually or collaboratively formulate new creative problems based on student\'s existing artwork' },
  { notation: 'VA.CR.2.Acc', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: 'Acc', description: 'Through experimentation, practice, and persistence, demonstrate acquisition of skills and knowledge' },
  { notation: 'VA.CR.3.Acc', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: 'Acc', description: 'Engage in constructive critique with peers, then reflect on, reengage, revise, and refine works of art' },
  { notation: 'VA.PR.4.Acc', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: 'Acc', description: 'Analyze, select, and critique personal artwork for a collection or portfolio presentation' },
  { notation: 'VA.PR.5.Acc', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: 'Acc', description: 'Evaluate, select, and apply methods or processes appropriate to display artwork' },
  { notation: 'VA.PR.6.Acc', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: 'Acc', description: 'Make, explain, and justify connections between artists or artwork and social, cultural, and political history' },
  { notation: 'VA.RE.7.Acc', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: 'Acc', description: 'Recognize and describe personal aesthetic and empathetic responses to the natural world and constructed environments' },
  { notation: 'VA.RE.8.Acc', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: 'Acc', description: 'Identify types of contextual information useful in the process of constructing interpretations' },
  { notation: 'VA.RE.9.Acc', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: 'Acc', description: 'Determine the relevance of criteria used by others to evaluate a work of art' },
  { notation: 'VA.CN.10.Acc', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: 'Acc', description: 'Utilize inquiry methods of observation, research, and experimentation to explore unfamiliar subjects' },
  { notation: 'VA.CN.11.Acc', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: 'Acc', description: 'Compare uses of art in a variety of societal, cultural, and historical contexts' },

  // High School Advanced
  { notation: 'VA.CR.1.Adv', discipline: 'VA', process: 'CR', anchorStandard: 1, grade: 'Adv', description: 'Visualize and hypothesize to generate plans for ideas and directions for creating art' },
  { notation: 'VA.CR.2.Adv', discipline: 'VA', process: 'CR', anchorStandard: 2, grade: 'Adv', description: 'Experiment, plan, and make multiple works of art exploring a personal theme, idea, or concept' },
  { notation: 'VA.CR.3.Adv', discipline: 'VA', process: 'CR', anchorStandard: 3, grade: 'Adv', description: 'Reflect on, re-engage, revise, and refine works of art considering relevant traditional and contemporary criteria' },
  { notation: 'VA.PR.4.Adv', discipline: 'VA', process: 'PR', anchorStandard: 4, grade: 'Adv', description: 'Critique, justify, and present choices in the process of analyzing, selecting, curating, and presenting' },
  { notation: 'VA.PR.5.Adv', discipline: 'VA', process: 'PR', anchorStandard: 5, grade: 'Adv', description: 'Investigate, compare, and contrast methods for preserving and protecting art' },
  { notation: 'VA.PR.6.Adv', discipline: 'VA', process: 'PR', anchorStandard: 6, grade: 'Adv', description: 'Curate a collection of objects, artifacts, or artwork to impact the viewer\'s understanding' },
  { notation: 'VA.RE.7.Adv', discipline: 'VA', process: 'RE', anchorStandard: 7, grade: 'Adv', description: 'Analyze how responses to art develop over time based on knowledge of and experience with art' },
  { notation: 'VA.RE.8.Adv', discipline: 'VA', process: 'RE', anchorStandard: 8, grade: 'Adv', description: 'Analyze differing interpretations of an artwork or collection of works' },
  { notation: 'VA.RE.9.Adv', discipline: 'VA', process: 'RE', anchorStandard: 9, grade: 'Adv', description: 'Construct evaluations of a work of art or collection of works based on differing sets of criteria' },
  { notation: 'VA.CN.10.Adv', discipline: 'VA', process: 'CN', anchorStandard: 10, grade: 'Adv', description: 'Synthesize knowledge of social, cultural, historical, and personal life with art-making approaches' },
  { notation: 'VA.CN.11.Adv', discipline: 'VA', process: 'CN', anchorStandard: 11, grade: 'Adv', description: 'Assess the impact of an artist or group of artists on the beliefs, values, and behaviors of a society' },
];

// ============================================================================
// MUSIC (MU)
// ============================================================================

export const musicStandards: NCASStandard[] = [
  // PreK
  { notation: 'MU.CR.1.PK', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: 'PK', description: 'With guidance, explore and experience music concepts' },
  { notation: 'MU.CR.2.PK', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: 'PK', description: 'With guidance, explore favorite musical ideas' },
  { notation: 'MU.CR.3.PK', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: 'PK', description: 'With guidance, apply personal, peer, and teacher feedback in refining musical ideas' },
  { notation: 'MU.PR.4.PK', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: 'PK', description: 'With guidance, demonstrate and state preference for varied musical selections' },
  { notation: 'MU.PR.5.PK', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: 'PK', description: 'With guidance, apply personal, peer, and teacher feedback to refine performances' },
  { notation: 'MU.PR.6.PK', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: 'PK', description: 'With guidance, perform music with expression' },
  { notation: 'MU.RE.7.PK', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: 'PK', description: 'With guidance, list personal interests and experiences and demonstrate why they prefer some music' },
  { notation: 'MU.RE.8.PK', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: 'PK', description: 'With guidance, explore music\'s expressive qualities' },
  { notation: 'MU.RE.9.PK', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: 'PK', description: 'With guidance, apply personal and expressive preferences in the evaluation of music' },
  { notation: 'MU.CN.10.PK', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: 'PK', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.PK', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: 'PK', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Kindergarten
  { notation: 'MU.CR.1.K', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: 'K', description: 'With guidance, explore and experience music concepts' },
  { notation: 'MU.CR.2.K', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: 'K', description: 'With guidance, organize personal musical ideas using iconic notation or recording technology' },
  { notation: 'MU.CR.3.K', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: 'K', description: 'With guidance, apply personal, peer, and teacher feedback in refining musical ideas' },
  { notation: 'MU.PR.4.K', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: 'K', description: 'With guidance, demonstrate and state personal interest in varied musical selections' },
  { notation: 'MU.PR.5.K', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: 'K', description: 'With guidance, apply personal, peer, and teacher feedback to refine performances' },
  { notation: 'MU.PR.6.K', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: 'K', description: 'With guidance, perform music with expression and technical accuracy' },
  { notation: 'MU.RE.7.K', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: 'K', description: 'With guidance, list personal interests and experiences and demonstrate why they prefer some music' },
  { notation: 'MU.RE.8.K', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: 'K', description: 'With guidance, demonstrate awareness of expressive qualities that support the creators\' intent' },
  { notation: 'MU.RE.9.K', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: 'K', description: 'With guidance, apply personal and expressive preferences in the evaluation of music' },
  { notation: 'MU.CN.10.K', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: 'K', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.K', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: 'K', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Grades 1-8 and HS (abbreviated for space - full standards follow same pattern)
  { notation: 'MU.CR.1.1', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '1', description: 'With limited guidance, create musical ideas for a specific purpose' },
  { notation: 'MU.CR.2.1', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '1', description: 'With limited guidance, demonstrate and discuss personal reasons for selecting musical ideas' },
  { notation: 'MU.CR.3.1', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '1', description: 'With limited guidance, discuss and apply personal, peer, and teacher feedback' },
  { notation: 'MU.PR.4.1', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '1', description: 'With limited guidance, demonstrate and discuss personal interest in performing music' },
  { notation: 'MU.PR.5.1', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '1', description: 'With limited guidance, apply personal, peer, and teacher feedback to refine performances' },
  { notation: 'MU.PR.6.1', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '1', description: 'With limited guidance, perform music with expression and technical accuracy' },
  { notation: 'MU.RE.7.1', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '1', description: 'With limited guidance, identify and demonstrate how personal interests and experiences influence choices' },
  { notation: 'MU.RE.8.1', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '1', description: 'With limited guidance, demonstrate awareness of expressive qualities that reflect creators\' intent' },
  { notation: 'MU.RE.9.1', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '1', description: 'With limited guidance, apply personal and expressive preferences in the evaluation of music' },
  { notation: 'MU.CN.10.1', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '1', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices and intent' },
  { notation: 'MU.CN.11.1', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '1', description: 'Demonstrate understanding of relationships between music and other arts and disciplines' },

  // Grade 2
  { notation: 'MU.CR.1.2', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '2', description: 'Improvise rhythmic and melodic patterns and musical ideas for a specific purpose' },
  { notation: 'MU.CR.2.2', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '2', description: 'Demonstrate and explain personal reasons for selecting patterns and ideas for music' },
  { notation: 'MU.CR.3.2', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '2', description: 'Interpret and apply personal, peer, and teacher feedback to revise musical ideas' },
  { notation: 'MU.PR.4.2', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '2', description: 'Demonstrate and explain personal interest in performing varied musical selections' },
  { notation: 'MU.PR.5.2', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '2', description: 'Apply established criteria and feedback to evaluate accuracy of ensemble performances' },
  { notation: 'MU.PR.6.2', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '2', description: 'Perform music for a specific purpose with expression and technical accuracy' },
  { notation: 'MU.RE.7.2', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '2', description: 'Explain and demonstrate how personal interests and experiences influence musical selection' },
  { notation: 'MU.RE.8.2', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '2', description: 'Demonstrate knowledge of music concepts and how they support creators\' intent' },
  { notation: 'MU.RE.9.2', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '2', description: 'Apply personal and expressive preferences in the evaluation of music for specific purposes' },
  { notation: 'MU.CN.10.2', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '2', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.2', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '2', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Grade 3
  { notation: 'MU.CR.1.3', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '3', description: 'Improvise rhythmic and melodic ideas, and describe connection to specific purpose and context' },
  { notation: 'MU.CR.2.3', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '3', description: 'Demonstrate selected musical ideas using standard and/or iconic notation, or recording technology' },
  { notation: 'MU.CR.3.3', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '3', description: 'Evaluate, refine, and document revisions to personal musical ideas' },
  { notation: 'MU.PR.4.3', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '3', description: 'Demonstrate and explain how the selection of music to perform is influenced by interests and context' },
  { notation: 'MU.PR.5.3', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '3', description: 'Apply teacher-provided and established criteria and feedback to prepare for performances' },
  { notation: 'MU.PR.6.3', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '3', description: 'Perform music with expression and technical accuracy' },
  { notation: 'MU.RE.7.3', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '3', description: 'Demonstrate and describe how selected music connects to and is influenced by specific interests' },
  { notation: 'MU.RE.8.3', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '3', description: 'Demonstrate and describe how the expressive qualities are used in performers\' interpretations' },
  { notation: 'MU.RE.9.3', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '3', description: 'Evaluate musical works and performances using established and personal criteria' },
  { notation: 'MU.CN.10.3', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '3', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices' },
  { notation: 'MU.CN.11.3', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '3', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Grade 4
  { notation: 'MU.CR.1.4', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '4', description: 'Improvise rhythmic, melodic, and harmonic ideas, and explain connection to purpose and context' },
  { notation: 'MU.CR.2.4', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '4', description: 'Demonstrate selected and organized musical ideas using iconic or standard notation' },
  { notation: 'MU.CR.3.4', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '4', description: 'Evaluate, refine, and document revisions to personal music, applying feedback' },
  { notation: 'MU.PR.4.4', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '4', description: 'Demonstrate and explain how the selection of music is influenced by interests, context, and setting' },
  { notation: 'MU.PR.5.4', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '4', description: 'Apply teacher-provided criteria and feedback to identify and refine technical challenges' },
  { notation: 'MU.PR.6.4', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '4', description: 'Perform music, alone or with others, with expression and technical accuracy and intent' },
  { notation: 'MU.RE.7.4', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '4', description: 'Demonstrate and explain how selected music connects to and is influenced by experiences and interests' },
  { notation: 'MU.RE.8.4', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '4', description: 'Demonstrate and explain how the expressive qualities are used in performers\' interpretations' },
  { notation: 'MU.RE.9.4', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '4', description: 'Evaluate musical works and performances using criteria based on structure and context' },
  { notation: 'MU.CN.10.4', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '4', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.4', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '4', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Grade 5
  { notation: 'MU.CR.1.5', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '5', description: 'Improvise rhythmic, melodic, and harmonic ideas, and explain connection to specific purpose' },
  { notation: 'MU.CR.2.5', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '5', description: 'Demonstrate selected and developed musical ideas using standard notation or audio/video recording' },
  { notation: 'MU.CR.3.5', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '5', description: 'Evaluate, refine, and document revisions to musical works, applying feedback to show improvement' },
  { notation: 'MU.PR.4.5', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '5', description: 'Demonstrate and explain how the selection of music is influenced by interests and context' },
  { notation: 'MU.PR.5.5', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '5', description: 'Apply teacher-provided and self-generated criteria to address technical challenges' },
  { notation: 'MU.PR.6.5', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '5', description: 'Perform music with expression, technical accuracy, and appropriate interpretation' },
  { notation: 'MU.RE.7.5', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '5', description: 'Demonstrate and explain how personal interests and experiences influence choices' },
  { notation: 'MU.RE.8.5', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '5', description: 'Demonstrate and explain how expressive qualities are used to reflect creators\' intentions' },
  { notation: 'MU.RE.9.5', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '5', description: 'Evaluate musical works and performances using criteria based on analysis and interpretation' },
  { notation: 'MU.CN.10.5', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '5', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.5', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '5', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // Grades 6-8
  { notation: 'MU.CR.1.6', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '6', description: 'Generate simple rhythmic, melodic, and harmonic phrases within AB and ABA forms' },
  { notation: 'MU.CR.2.6', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '6', description: 'Select, organize, construct, and document personal musical ideas for arrangements and compositions' },
  { notation: 'MU.CR.3.6', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '6', description: 'Evaluate their own work by selecting and applying criteria including appropriateness' },
  { notation: 'MU.PR.4.6', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '6', description: 'Apply teacher-provided criteria for selecting music to perform for a specific purpose and context' },
  { notation: 'MU.PR.5.6', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '6', description: 'Identify and apply personally-developed criteria to rehearse, refine, and determine accuracy' },
  { notation: 'MU.PR.6.6', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '6', description: 'Perform music with technical accuracy, stylistic expression, and culturally authentic practices' },
  { notation: 'MU.RE.7.6', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '6', description: 'Select music to listen to and explain connections to specific interests or experiences' },
  { notation: 'MU.RE.8.6', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '6', description: 'Describe a personal interpretation of how creators\' and performers\' application of elements' },
  { notation: 'MU.RE.9.6', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '6', description: 'Apply teacher-provided criteria to evaluate musical works or performances' },
  { notation: 'MU.CN.10.6', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '6', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.6', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '6', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  { notation: 'MU.CR.1.7', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '7', description: 'Generate rhythmic, melodic, and harmonic phrases and variations over harmonic accompaniment' },
  { notation: 'MU.CR.2.7', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '7', description: 'Select, organize, develop, and document personal musical ideas for arrangements and compositions' },
  { notation: 'MU.CR.3.7', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '7', description: 'Evaluate their own work by selecting and applying criteria including appropriateness and context' },
  { notation: 'MU.PR.4.7', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '7', description: 'Apply collaboratively-developed criteria for selecting music for a specific purpose and context' },
  { notation: 'MU.PR.5.7', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '7', description: 'Identify and apply collaboratively-developed criteria to rehearse, refine, and determine performance' },
  { notation: 'MU.PR.6.7', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '7', description: 'Perform music with technical accuracy, stylistic expression, and culturally authentic practices' },
  { notation: 'MU.RE.7.7', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '7', description: 'Select music to listen to and compare the connections to specific interests or experiences' },
  { notation: 'MU.RE.8.7', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '7', description: 'Classify and compare how the elements of music and expressive qualities relate to structure' },
  { notation: 'MU.RE.9.7', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '7', description: 'Apply teacher-provided and collaboratively-developed criteria to evaluate musical works' },
  { notation: 'MU.CN.10.7', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '7', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.7', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '7', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  { notation: 'MU.CR.1.8', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: '8', description: 'Generate rhythmic, melodic, and harmonic phrases and harmonic accompaniments within expanded forms' },
  { notation: 'MU.CR.2.8', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: '8', description: 'Select, organize, and document personal musical ideas for arrangements, songs, and compositions' },
  { notation: 'MU.CR.3.8', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: '8', description: 'Evaluate their own work by selecting and applying criteria including originality and quality' },
  { notation: 'MU.PR.4.8', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: '8', description: 'Apply personally-developed criteria for selecting music for a specific purpose and context' },
  { notation: 'MU.PR.5.8', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: '8', description: 'Identify and apply personally-developed criteria to rehearse, refine, and improve performances' },
  { notation: 'MU.PR.6.8', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: '8', description: 'Perform music with technical accuracy, stylistic expression, and culturally authentic practices' },
  { notation: 'MU.RE.7.8', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: '8', description: 'Select programs of music and describe the connections to specific interests and purposes' },
  { notation: 'MU.RE.8.8', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: '8', description: 'Support personal interpretation of contrasting programs of music and discuss how creators use elements' },
  { notation: 'MU.RE.9.8', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: '8', description: 'Apply appropriate personally-developed criteria to evaluate musical works or performances' },
  { notation: 'MU.CN.10.8', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: '8', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.8', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: '8', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  // High School
  { notation: 'MU.CR.1.Prof', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: 'Prof', description: 'Generate melodic, rhythmic, and harmonic ideas for compositions, arrangements, and improvisations' },
  { notation: 'MU.CR.2.Prof', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: 'Prof', description: 'Select and develop draft melodic, rhythmic, and harmonic ideas demonstrating understanding of characteristics' },
  { notation: 'MU.CR.3.Prof', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: 'Prof', description: 'Evaluate and refine draft compositions and improvisations based on criteria including craft and function' },
  { notation: 'MU.PR.4.Prof', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: 'Prof', description: 'Explain the criteria used to select repertoire for a specific purpose and audience' },
  { notation: 'MU.PR.5.Prof', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: 'Prof', description: 'Develop and apply criteria to rehearse, refine, and improve the quality and accuracy of performances' },
  { notation: 'MU.PR.6.Prof', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: 'Prof', description: 'Perform music with technical accuracy, stylistic expression, and culturally authentic practices' },
  { notation: 'MU.RE.7.Prof', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: 'Prof', description: 'Apply criteria to select music for specified purposes, supporting choices by citing musical characteristics' },
  { notation: 'MU.RE.8.Prof', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: 'Prof', description: 'Explain and support personal interpretation using structural, historical, and cultural context' },
  { notation: 'MU.RE.9.Prof', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: 'Prof', description: 'Evaluate works and performances based on research as well as personally-developed criteria' },
  { notation: 'MU.CN.10.Prof', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: 'Prof', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.Prof', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: 'Prof', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  { notation: 'MU.CR.1.Acc', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: 'Acc', description: 'Generate melodic, rhythmic, and harmonic ideas for compositions and improvisations using established forms' },
  { notation: 'MU.CR.2.Acc', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: 'Acc', description: 'Select and develop melodic, rhythmic, and harmonic ideas that demonstrate craftsmanship' },
  { notation: 'MU.CR.3.Acc', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: 'Acc', description: 'Evaluate and refine compositions and improvisations based on criteria including artistic intent' },
  { notation: 'MU.PR.4.Acc', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: 'Acc', description: 'Develop and apply criteria for selecting repertoire for a specific purpose' },
  { notation: 'MU.PR.5.Acc', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: 'Acc', description: 'Develop and apply criteria to rehearse, refine, and determine when a piece is ready to perform' },
  { notation: 'MU.PR.6.Acc', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: 'Acc', description: 'Demonstrate mastery of technical demands and artistic expression in prepared performances' },
  { notation: 'MU.RE.7.Acc', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: 'Acc', description: 'Apply criteria to select music for specified purposes, justifying how selection meets stated criteria' },
  { notation: 'MU.RE.8.Acc', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: 'Acc', description: 'Support personal interpretation using structural, historical, cultural context and research' },
  { notation: 'MU.RE.9.Acc', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: 'Acc', description: 'Evaluate works and performances based on personally or collaboratively-developed criteria' },
  { notation: 'MU.CN.10.Acc', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: 'Acc', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.Acc', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: 'Acc', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },

  { notation: 'MU.CR.1.Adv', discipline: 'MU', process: 'CR', anchorStandard: 1, grade: 'Adv', description: 'Generate melodic, rhythmic, and harmonic ideas for a collection of compositions or improvisations' },
  { notation: 'MU.CR.2.Adv', discipline: 'MU', process: 'CR', anchorStandard: 2, grade: 'Adv', description: 'Select and develop melodic, rhythmic, and harmonic ideas to express personal, cultural, and social intent' },
  { notation: 'MU.CR.3.Adv', discipline: 'MU', process: 'CR', anchorStandard: 3, grade: 'Adv', description: 'Evaluate and refine compositions and improvisations based on criteria demonstrating a high level of musical understanding' },
  { notation: 'MU.PR.4.Adv', discipline: 'MU', process: 'PR', anchorStandard: 4, grade: 'Adv', description: 'Develop and apply criteria for selecting repertoire demonstrating deep understanding of the art form' },
  { notation: 'MU.PR.5.Adv', discipline: 'MU', process: 'PR', anchorStandard: 5, grade: 'Adv', description: 'Develop, apply, and refine criteria to rehearse, improve performance, and address technical and interpretive challenges' },
  { notation: 'MU.PR.6.Adv', discipline: 'MU', process: 'PR', anchorStandard: 6, grade: 'Adv', description: 'Demonstrate technical mastery, personal expression, and an understanding of intended meaning' },
  { notation: 'MU.RE.7.Adv', discipline: 'MU', process: 'RE', anchorStandard: 7, grade: 'Adv', description: 'Use personally-developed criteria to select music demonstrating comprehensive musical understanding' },
  { notation: 'MU.RE.8.Adv', discipline: 'MU', process: 'RE', anchorStandard: 8, grade: 'Adv', description: 'Support interpretations demonstrating a deep understanding of the work and the creator\' intent' },
  { notation: 'MU.RE.9.Adv', discipline: 'MU', process: 'RE', anchorStandard: 9, grade: 'Adv', description: 'Develop and justify evaluations of music, programs, and performances based on comprehensive criteria' },
  { notation: 'MU.CN.10.Adv', discipline: 'MU', process: 'CN', anchorStandard: 10, grade: 'Adv', description: 'Demonstrate how interests, knowledge, and skills relate to personal choices in music' },
  { notation: 'MU.CN.11.Adv', discipline: 'MU', process: 'CN', anchorStandard: 11, grade: 'Adv', description: 'Demonstrate understanding of relationships between music and other arts, disciplines, contexts' },
];

// ============================================================================
// DANCE (DA)
// ============================================================================

export const danceStandards: NCASStandard[] = [
  // PreK-K
  { notation: 'DA.CR.1.PK', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: 'PK', description: 'Respond in movement to a variety of stimuli' },
  { notation: 'DA.CR.2.PK', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: 'PK', description: 'Improvise dance that has a beginning, middle, and end' },
  { notation: 'DA.CR.3.PK', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: 'PK', description: 'Respond to suggestions for changing movement' },
  { notation: 'DA.PR.4.PK', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: 'PK', description: 'Identify and demonstrate directions for moving the body through space' },
  { notation: 'DA.PR.5.PK', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: 'PK', description: 'Demonstrate a range of locomotor and non-locomotor movements' },
  { notation: 'DA.PR.6.PK', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: 'PK', description: 'Dance for others in a designated area' },
  { notation: 'DA.RE.7.PK', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: 'PK', description: 'Identify a movement in a dance by repeating it' },
  { notation: 'DA.RE.8.PK', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: 'PK', description: 'Observe movement and describe it using simple dance terminology' },
  { notation: 'DA.RE.9.PK', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: 'PK', description: 'Find a movement that is interesting and share' },
  { notation: 'DA.CN.10.PK', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: 'PK', description: 'Recognize and name an emotion expressed in dance' },
  { notation: 'DA.CN.11.PK', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: 'PK', description: 'Observe illustrations from a story and discuss movements' },

  { notation: 'DA.CR.1.K', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: 'K', description: 'Respond in movement to a variety of sensory stimuli' },
  { notation: 'DA.CR.2.K', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: 'K', description: 'Improvise dance that has a beginning, middle, and end' },
  { notation: 'DA.CR.3.K', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: 'K', description: 'Apply suggestions for changing movement through guided improvisational experiences' },
  { notation: 'DA.PR.4.K', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: 'K', description: 'Make still and moving body shapes that show lines, curves, and angles' },
  { notation: 'DA.PR.5.K', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: 'K', description: 'Demonstrate same side and cross-body locomotor and non-locomotor movements' },
  { notation: 'DA.PR.6.K', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: 'K', description: 'Dance for and with others in a designated area' },
  { notation: 'DA.RE.7.K', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: 'K', description: 'Find a movement that is interesting and explain why' },
  { notation: 'DA.RE.8.K', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: 'K', description: 'Observe a dance and describe movements using simple dance terminology' },
  { notation: 'DA.RE.9.K', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: 'K', description: 'Identify and describe an expressive movement' },
  { notation: 'DA.CN.10.K', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: 'K', description: 'Recognize and describe an emotion or feeling expressed in dance' },
  { notation: 'DA.CN.11.K', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: 'K', description: 'Describe movements in a dance that relate to a familiar experience' },

  // Grades 1-8
  { notation: 'DA.CR.1.1', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '1', description: 'Explore movement inspired by a variety of stimuli and identify the source' },
  { notation: 'DA.CR.2.1', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '1', description: 'Improvise a series of movements that have a beginning, middle, and end' },
  { notation: 'DA.CR.3.1', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '1', description: 'Explore suggestions to change movement from guided improvisational experiences' },
  { notation: 'DA.PR.4.1', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '1', description: 'Demonstrate locomotor and non-locomotor movements that change body shapes, levels, and facings' },
  { notation: 'DA.PR.5.1', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '1', description: 'Demonstrate a range of movements, body patterning, and dance sequences' },
  { notation: 'DA.PR.6.1', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '1', description: 'Dance for others, with a focus on performance etiquette' },
  { notation: 'DA.RE.7.1', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '1', description: 'Identify and demonstrate movements in a dance that attract attention' },
  { notation: 'DA.RE.8.1', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '1', description: 'Select movements from a dance and describe characteristics' },
  { notation: 'DA.RE.9.1', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '1', description: 'Identify and describe the expressive qualities of a dance' },
  { notation: 'DA.CN.10.1', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '1', description: 'Find an experience expressed or portrayed in a dance and identify the movements' },
  { notation: 'DA.CN.11.1', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '1', description: 'Watch a dance and describe how the movement relates to a familiar experience' },

  { notation: 'DA.CR.1.2', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '2', description: 'Explore movement inspired by a variety of stimuli and suggest additional sources' },
  { notation: 'DA.CR.2.2', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '2', description: 'Improvise a dance phrase with a clear beginning, middle, and end' },
  { notation: 'DA.CR.3.2', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '2', description: 'Choose movements that express an idea or emotion, or follow a storyline' },
  { notation: 'DA.PR.4.2', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '2', description: 'Demonstrate clear directionality and intent when performing locomotor and non-locomotor movements' },
  { notation: 'DA.PR.5.2', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '2', description: 'Repeat movements, with an awareness of self and others in space' },
  { notation: 'DA.PR.6.2', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '2', description: 'Dance for others in a space where audience and performers occupy different areas' },
  { notation: 'DA.RE.7.2', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '2', description: 'Describe movements in a variety of dances and identify patterns' },
  { notation: 'DA.RE.8.2', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '2', description: 'Use basic dance terminology to describe movements observed' },
  { notation: 'DA.RE.9.2', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '2', description: 'Describe the characteristics that make a dance artistic and meaningful' },
  { notation: 'DA.CN.10.2', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '2', description: 'Describe how the movement in a dance expresses a personal experience' },
  { notation: 'DA.CN.11.2', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '2', description: 'Observe a dance and describe how dances from a genre or culture differ' },

  { notation: 'DA.CR.1.3', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '3', description: 'Experiment with a variety of self-identified stimuli for movement' },
  { notation: 'DA.CR.2.3', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '3', description: 'Develop a dance phrase with a clear pathway that includes level changes' },
  { notation: 'DA.CR.3.3', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '3', description: 'Revise movement choices in response to feedback to achieve clear artistic intent' },
  { notation: 'DA.PR.4.3', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '3', description: 'Judge spaces as distance from and in relationship to others' },
  { notation: 'DA.PR.5.3', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '3', description: 'Replicate body shapes, movement characteristics, and movement patterns' },
  { notation: 'DA.PR.6.3', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '3', description: 'Communicate to audience by demonstrating attention, and expression' },
  { notation: 'DA.RE.7.3', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '3', description: 'Find patterns of movement in a dance work' },
  { notation: 'DA.RE.8.3', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '3', description: 'Select specific context cues from movement and describe using dance terminology' },
  { notation: 'DA.RE.9.3', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '3', description: 'Select dance movements that express personal ideas and explain why' },
  { notation: 'DA.CN.10.3', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '3', description: 'Ask and research questions about a dance and explain answers using dance terminology' },
  { notation: 'DA.CN.11.3', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '3', description: 'Find a relationship between movement in a dance and its meaning within cultural context' },

  { notation: 'DA.CR.1.4', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '4', description: 'Identify ideas for choreography generated from a variety of stimuli' },
  { notation: 'DA.CR.2.4', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '4', description: 'Manipulate movement to develop a dance study with a clear intent' },
  { notation: 'DA.CR.3.4', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '4', description: 'Revise choreography based on peer feedback and self-reflection' },
  { notation: 'DA.PR.4.4', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '4', description: 'Make static and dynamic shapes with positive and negative space' },
  { notation: 'DA.PR.5.4', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '4', description: 'Demonstrate fundamental dance skills and movement qualities' },
  { notation: 'DA.PR.6.4', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '4', description: 'Perform movement sequences with an intent' },
  { notation: 'DA.RE.7.4', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '4', description: 'Describe how the elements of dance are used in a variety of dance genres' },
  { notation: 'DA.RE.8.4', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '4', description: 'Explain how specific context cues relate to movement qualities and intent' },
  { notation: 'DA.RE.9.4', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '4', description: 'Discuss the characteristics that make a dance artistic and meaningful' },
  { notation: 'DA.CN.10.4', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '4', description: 'Relate the main idea or content in a dance to other experiences' },
  { notation: 'DA.CN.11.4', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '4', description: 'Describe how dance relates to history, culture, and society' },

  { notation: 'DA.CR.1.5', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '5', description: 'Build content for choreography using multiple dance structures' },
  { notation: 'DA.CR.2.5', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '5', description: 'Develop a clear artistic intent for choreography' },
  { notation: 'DA.CR.3.5', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '5', description: 'Clarify the artistic intent of a dance by manipulating dance elements' },
  { notation: 'DA.PR.4.5', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '5', description: 'Integrate locomotor and non-locomotor movements in a variety of pathways' },
  { notation: 'DA.PR.5.5', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '5', description: 'Recall and execute a series of movements that demand complex coordination' },
  { notation: 'DA.PR.6.5', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '5', description: 'Evaluate possible solutions to technical dance problems' },
  { notation: 'DA.RE.7.5', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '5', description: 'Compare and contrast two dances, identifying genres and styles' },
  { notation: 'DA.RE.8.5', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '5', description: 'Interpret meaning in a dance based on its movements' },
  { notation: 'DA.RE.9.5', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '5', description: 'Define the characteristics that make a dance meaningful to describe' },
  { notation: 'DA.CN.10.5', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '5', description: 'Describe how the perspectives expressed in a dance relate to personal views' },
  { notation: 'DA.CN.11.5', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '5', description: 'Describe how the elements of dance are used in dance from different historical periods' },

  { notation: 'DA.CR.1.6', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '6', description: 'Explore various movement vocabularies and make content choices for choreography' },
  { notation: 'DA.CR.2.6', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '6', description: 'Explore choreographic methods to develop a dance study' },
  { notation: 'DA.CR.3.6', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '6', description: 'Revise dance compositions using collaboratively developed criteria' },
  { notation: 'DA.PR.4.6', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '6', description: 'Embody technical dance skills to retain and execute choreography' },
  { notation: 'DA.PR.5.6', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '6', description: 'Apply basic anatomical knowledge and nutrition to support technical training' },
  { notation: 'DA.PR.6.6', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '6', description: 'Identify performance practices in a variety of dance genres' },
  { notation: 'DA.RE.7.6', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '6', description: 'Describe choreographic elements used in a dance' },
  { notation: 'DA.RE.8.6', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '6', description: 'Explain how the artistic expression of a dance is achieved' },
  { notation: 'DA.RE.9.6', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '6', description: 'Discuss the characteristics of dance that make it artistic and meaningful' },
  { notation: 'DA.CN.10.6', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '6', description: 'Explain how the perspectives expressed in a dance relate to the experience' },
  { notation: 'DA.CN.11.6', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '6', description: 'Interpret and show how dance movement and culture are interrelated' },

  { notation: 'DA.CR.1.7', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '7', description: 'Compare a variety of stimuli and explore multiple content ideas' },
  { notation: 'DA.CR.2.7', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '7', description: 'Use a variety of choreographic approaches to create dance studies' },
  { notation: 'DA.CR.3.7', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '7', description: 'Evaluate and analyze how criteria function in the revision of dance' },
  { notation: 'DA.PR.4.7', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '7', description: 'Demonstrate technical skills using fundamental dance vocabulary' },
  { notation: 'DA.PR.5.7', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '7', description: 'Apply anatomical knowledge to inform practices that support dance technique' },
  { notation: 'DA.PR.6.7', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '7', description: 'Demonstrate dance etiquette and performance practices' },
  { notation: 'DA.RE.7.7', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '7', description: 'Compare and contrast how dance communicates aesthetic and cultural values' },
  { notation: 'DA.RE.8.7', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '7', description: 'Use genre-specific terminology to compare how artistic expression is achieved' },
  { notation: 'DA.RE.9.7', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '7', description: 'Compare artistic intent, and how well dancers convey meaning' },
  { notation: 'DA.CN.10.7', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '7', description: 'Compare the perspectives expressed in dances from different cultures' },
  { notation: 'DA.CN.11.7', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '7', description: 'Compare, contrast, and discuss dances performed by people in various cultures' },

  { notation: 'DA.CR.1.8', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: '8', description: 'Implement movement from various dance styles to express artistic intent' },
  { notation: 'DA.CR.2.8', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: '8', description: 'Collaborate to select and apply choreographic methods to create original dance' },
  { notation: 'DA.CR.3.8', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: '8', description: 'Analyze evaluation methods and apply to revise choreography' },
  { notation: 'DA.PR.4.8', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: '8', description: 'Embody technical skills and demonstrate stylistic understanding' },
  { notation: 'DA.PR.5.8', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: '8', description: 'Evaluate personal healthful practices in dance technique and performance' },
  { notation: 'DA.PR.6.8', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: '8', description: 'Evaluate production elements to enhance meaning and artistic intent' },
  { notation: 'DA.RE.7.8', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: '8', description: 'Analyze how the elements of dance are used to communicate intent' },
  { notation: 'DA.RE.8.8', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: '8', description: 'Select a dance and explain how artistic expression is achieved' },
  { notation: 'DA.RE.9.8', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: '8', description: 'Use criteria to evaluate artistic expression and discuss what is effective' },
  { notation: 'DA.CN.10.8', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: '8', description: 'Analyze how the perspectives expressed in a dance impact one\'s own interpretation' },
  { notation: 'DA.CN.11.8', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: '8', description: 'Analyze how dances from historical time periods reflect the ideas of the time' },

  // High School
  { notation: 'DA.CR.1.Prof', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: 'Prof', description: 'Explore various movement vocabularies and synthesize to create choreography' },
  { notation: 'DA.CR.2.Prof', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: 'Prof', description: 'Work independently and collaboratively to design choreographic works' },
  { notation: 'DA.CR.3.Prof', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: 'Prof', description: 'Develop artistic criteria to establish what makes a dance successful' },
  { notation: 'DA.PR.4.Prof', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: 'Prof', description: 'Develop body awareness, balance, and core support' },
  { notation: 'DA.PR.5.Prof', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: 'Prof', description: 'Apply body-mind principles to technical dance skills' },
  { notation: 'DA.PR.6.Prof', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: 'Prof', description: 'Demonstrate attention to technical accuracy and performance quality' },
  { notation: 'DA.RE.7.Prof', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: 'Prof', description: 'Analyze dance works from a variety of dance genres and styles' },
  { notation: 'DA.RE.8.Prof', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: 'Prof', description: 'Analyze and interpret how the elements of dance contribute to intent' },
  { notation: 'DA.RE.9.Prof', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: 'Prof', description: 'Develop criteria that can be used to evaluate a range of dance genres' },
  { notation: 'DA.CN.10.Prof', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: 'Prof', description: 'Analyze a dance to determine the ideas expressed by the choreographer' },
  { notation: 'DA.CN.11.Prof', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: 'Prof', description: 'Analyze dances from several genres or historical periods to determine societal issues' },

  { notation: 'DA.CR.1.Acc', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: 'Acc', description: 'Synthesize content for choreography by manipulating and expanding known dance ideas' },
  { notation: 'DA.CR.2.Acc', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: 'Acc', description: 'Work collaboratively and independently to choreographically develop a dance' },
  { notation: 'DA.CR.3.Acc', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: 'Acc', description: 'Analyze and evaluate the impact of choices made in dance composition' },
  { notation: 'DA.PR.4.Acc', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: 'Acc', description: 'Apply technical dance skills to execute complex sequences' },
  { notation: 'DA.PR.5.Acc', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: 'Acc', description: 'Apply and develop strategies for healthful practices in dance' },
  { notation: 'DA.PR.6.Acc', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: 'Acc', description: 'Demonstrate artistry through the understanding and embodiment of the work' },
  { notation: 'DA.RE.7.Acc', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: 'Acc', description: 'Analyze dance works using genre-specific terminology' },
  { notation: 'DA.RE.8.Acc', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: 'Acc', description: 'Analyze and interpret how the elements of dance demonstrate intent' },
  { notation: 'DA.RE.9.Acc', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: 'Acc', description: 'Formulate criteria to evaluate different genres of dance' },
  { notation: 'DA.CN.10.Acc', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: 'Acc', description: 'Analyze and discuss how the experience of a dance is influenced by personal perspectives' },
  { notation: 'DA.CN.11.Acc', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: 'Acc', description: 'Analyze and discuss how dance from various genres and historical periods have shaped dance' },

  { notation: 'DA.CR.1.Adv', discipline: 'DA', process: 'CR', anchorStandard: 1, grade: 'Adv', description: 'Generate content for choreography using an original choreographic voice' },
  { notation: 'DA.CR.2.Adv', discipline: 'DA', process: 'CR', anchorStandard: 2, grade: 'Adv', description: 'Demonstrate fluency and proficiency in personal choreographic approach' },
  { notation: 'DA.CR.3.Adv', discipline: 'DA', process: 'CR', anchorStandard: 3, grade: 'Adv', description: 'Justify artistic choices using a range of criteria from various sources' },
  { notation: 'DA.PR.4.Adv', discipline: 'DA', process: 'PR', anchorStandard: 4, grade: 'Adv', description: 'Apply technical skills to demonstrate artistry in executing choreography' },
  { notation: 'DA.PR.5.Adv', discipline: 'DA', process: 'PR', anchorStandard: 5, grade: 'Adv', description: 'Develop personal practices and plans for maintaining lifelong wellness' },
  { notation: 'DA.PR.6.Adv', discipline: 'DA', process: 'PR', anchorStandard: 6, grade: 'Adv', description: 'Infuse performances with personal artistry and model professional standards' },
  { notation: 'DA.RE.7.Adv', discipline: 'DA', process: 'RE', anchorStandard: 7, grade: 'Adv', description: 'Analyze dance works through the lens of historical and cultural context' },
  { notation: 'DA.RE.8.Adv', discipline: 'DA', process: 'RE', anchorStandard: 8, grade: 'Adv', description: 'Analyze and provide multiple interpretations of a dance' },
  { notation: 'DA.RE.9.Adv', discipline: 'DA', process: 'RE', anchorStandard: 9, grade: 'Adv', description: 'Defend evaluations and explain how different criteria can be used' },
  { notation: 'DA.CN.10.Adv', discipline: 'DA', process: 'CN', anchorStandard: 10, grade: 'Adv', description: 'Review and interpret how a dance communicates perspectives about values and beliefs' },
  { notation: 'DA.CN.11.Adv', discipline: 'DA', process: 'CN', anchorStandard: 11, grade: 'Adv', description: 'Analyze how issues of time, place, and personal experience influence dance' },
];

// ============================================================================
// THEATRE (TH)
// ============================================================================

export const theatreStandards: NCASStandard[] = [
  // PreK-K
  { notation: 'TH.CR.1.PK', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: 'PK', description: 'With prompting and support, invent and inhabit an imaginary place' },
  { notation: 'TH.CR.2.PK', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: 'PK', description: 'With prompting and support, interact with peers and contribute to dramatic play' },
  { notation: 'TH.CR.3.PK', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: 'PK', description: 'With prompting and support, ask and answer questions in dramatic play' },
  { notation: 'TH.PR.4.PK', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: 'PK', description: 'With prompting and support, identify characters and setting in dramatic play' },
  { notation: 'TH.PR.5.PK', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: 'PK', description: 'With prompting and support, express original ideas in dramatic play' },
  { notation: 'TH.PR.6.PK', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: 'PK', description: 'With prompting and support, engage in dramatic play' },
  { notation: 'TH.RE.7.PK', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: 'PK', description: 'With prompting and support, express emotional responses to characters' },
  { notation: 'TH.RE.8.PK', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: 'PK', description: 'With prompting and support, identify preferences in dramatic play' },
  { notation: 'TH.RE.9.PK', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: 'PK', description: 'With prompting and support, actively engage with others in dramatic play' },
  { notation: 'TH.CN.10.PK', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: 'PK', description: 'With prompting and support, identify similarities between characters and self' },
  { notation: 'TH.CN.11.PK', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: 'PK', description: 'With prompting and support, identify stories that are similar to one another' },

  { notation: 'TH.CR.1.K', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: 'K', description: 'With prompting and support, invent and inhabit an imaginary elsewheres' },
  { notation: 'TH.CR.2.K', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: 'K', description: 'With prompting and support, contribute through action and dialogue in dramatic play' },
  { notation: 'TH.CR.3.K', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: 'K', description: 'With prompting and support, collaborate with others in dramatic play' },
  { notation: 'TH.PR.4.K', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: 'K', description: 'With prompting and support, identify characters\' physical traits' },
  { notation: 'TH.PR.5.K', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: 'K', description: 'With prompting and support, express original ideas in dramatic play' },
  { notation: 'TH.PR.6.K', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: 'K', description: 'With prompting and support, use voice and sound in dramatic play' },
  { notation: 'TH.RE.7.K', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: 'K', description: 'With prompting and support, recognize when artistic choices are made' },
  { notation: 'TH.RE.8.K', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: 'K', description: 'With prompting and support, identify preferences in dramatic play' },
  { notation: 'TH.RE.9.K', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: 'K', description: 'With prompting and support, actively engage with others in dramatic play' },
  { notation: 'TH.CN.10.K', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: 'K', description: 'With prompting and support, identify similarities between characters' },
  { notation: 'TH.CN.11.K', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: 'K', description: 'With prompting and support, identify stories from one\'s own life' },

  // Grades 1-8 (abbreviated)
  { notation: 'TH.CR.1.1', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '1', description: 'Propose ideas for dramatic play' },
  { notation: 'TH.CR.2.1', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '1', description: 'Contribute ideas to collaborate on a guided drama experience' },
  { notation: 'TH.CR.3.1', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '1', description: 'Identify ways in which the characters express themselves' },
  { notation: 'TH.PR.4.1', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '1', description: 'Describe a characters traits in a guided drama experience' },
  { notation: 'TH.PR.5.1', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '1', description: 'Express original ideas in dramatic play' },
  { notation: 'TH.PR.6.1', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '1', description: 'Use voice and sound in dramatic play' },
  { notation: 'TH.RE.7.1', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '1', description: 'Recall choices made in a guided drama experience' },
  { notation: 'TH.RE.8.1', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '1', description: 'Explain preferences and emotions in dramatic play' },
  { notation: 'TH.RE.9.1', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '1', description: 'Build on others ideas in a guided drama experience' },
  { notation: 'TH.CN.10.1', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '1', description: 'Identify character actions and emotions' },
  { notation: 'TH.CN.11.1', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '1', description: 'Identify connections to community, culture, and world in dramatic works' },

  { notation: 'TH.CR.1.2', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '2', description: 'Propose ideas for dramatic play that represent an event' },
  { notation: 'TH.CR.2.2', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '2', description: 'Collaborate to devise a short scene' },
  { notation: 'TH.CR.3.2', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '2', description: 'Contribute to the creation of dialogue in a dramatic work' },
  { notation: 'TH.PR.4.2', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '2', description: 'Interpret visual and aural characteristics of characters' },
  { notation: 'TH.PR.5.2', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '2', description: 'Use props, costumes, and scenic elements' },
  { notation: 'TH.PR.6.2', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '2', description: 'Contribute ideas and cooperate in devising drama' },
  { notation: 'TH.RE.7.2', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '2', description: 'Identify choices that can be made by performers' },
  { notation: 'TH.RE.8.2', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '2', description: 'Express personal responses to a drama or theatre work' },
  { notation: 'TH.RE.9.2', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '2', description: 'Discuss and evaluate artistic choices in drama/theatre' },
  { notation: 'TH.CN.10.2', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '2', description: 'Relate character experience to personal experience' },
  { notation: 'TH.CN.11.2', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '2', description: 'Identify similarities between story elements and cultures' },

  { notation: 'TH.CR.1.3', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '3', description: 'Create roles, imagined worlds, and improvised stories' },
  { notation: 'TH.CR.2.3', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '3', description: 'Participate in methods of investigation to devise original ideas' },
  { notation: 'TH.CR.3.3', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '3', description: 'Collaborate to determine how characters might move and speak' },
  { notation: 'TH.PR.4.3', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '3', description: 'Apply movement and voice to characters in dramatic performance' },
  { notation: 'TH.PR.5.3', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '3', description: 'Identify and suggest technical elements to support a story' },
  { notation: 'TH.PR.6.3', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '3', description: 'Practice and revise a short scene or play' },
  { notation: 'TH.RE.7.3', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '3', description: 'Evaluate artistic choices in drama/theatre work' },
  { notation: 'TH.RE.8.3', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '3', description: 'Consider and identify multiple personal responses to drama' },
  { notation: 'TH.RE.9.3', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '3', description: 'Understand that audiences observe and express preferences' },
  { notation: 'TH.CN.10.3', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '3', description: 'Use personal experiences and knowledge to develop a character' },
  { notation: 'TH.CN.11.3', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '3', description: 'Explore how stories are adapted from their original source' },

  { notation: 'TH.CR.1.4', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '4', description: 'Articulate the visual details of imagined worlds and improvise' },
  { notation: 'TH.CR.2.4', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '4', description: 'Collaborate to develop an original drama or theatre piece' },
  { notation: 'TH.CR.3.4', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '4', description: 'Revise and improve an improvised or scripted drama through collaboration' },
  { notation: 'TH.PR.4.4', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '4', description: 'Explore physical, vocal, and physiological choices to develop a character' },
  { notation: 'TH.PR.5.4', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '4', description: 'Propose design ideas that support the story' },
  { notation: 'TH.PR.6.4', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '4', description: 'Share small-group drama or theatre work with peers' },
  { notation: 'TH.RE.7.4', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '4', description: 'Identify and discuss artistic choices in drama/theatre work' },
  { notation: 'TH.RE.8.4', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '4', description: 'Compare and contrast multiple personal responses to drama' },
  { notation: 'TH.RE.9.4', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '4', description: 'Develop and apply criteria for evaluating drama and theatre' },
  { notation: 'TH.CN.10.4', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '4', description: 'Identify the ways drama/theatre reflects the perspectives of a community' },
  { notation: 'TH.CN.11.4', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '4', description: 'Respond to community and social issues through drama/theatre' },

  { notation: 'TH.CR.1.5', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '5', description: 'Identify physical qualities that reveal character' },
  { notation: 'TH.CR.2.5', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '5', description: 'Devise original ideas for a drama or theatre work' },
  { notation: 'TH.CR.3.5', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '5', description: 'Revise and refine a devised or scripted drama based on feedback' },
  { notation: 'TH.PR.4.5', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '5', description: 'Describe the underlying thoughts and emotions of a character' },
  { notation: 'TH.PR.5.5', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '5', description: 'Explore design choices to support a unified design' },
  { notation: 'TH.PR.6.5', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '5', description: 'Present a drama/theatre work for a defined audience' },
  { notation: 'TH.RE.7.5', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '5', description: 'Explain personal reactions to artistic choices in a drama' },
  { notation: 'TH.RE.8.5', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '5', description: 'Justify personal responses based on evidence in drama/theatre' },
  { notation: 'TH.RE.9.5', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '5', description: 'Recognize and evaluate how performers convey character' },
  { notation: 'TH.CN.10.5', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '5', description: 'Explain how drama/theatre connects to personal experiences' },
  { notation: 'TH.CN.11.5', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '5', description: 'Investigate historical, global, and social issues expressed in drama' },

  { notation: 'TH.CR.1.6', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '6', description: 'Identify possible solutions to staging challenges' },
  { notation: 'TH.CR.2.6', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '6', description: 'Use collaborative methods to generate ideas for an original drama' },
  { notation: 'TH.CR.3.6', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '6', description: 'Articulate and examine choices to refine a devised or scripted work' },
  { notation: 'TH.PR.4.6', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '6', description: 'Identify the essential events in a story or script' },
  { notation: 'TH.PR.5.6', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '6', description: 'Explore technical elements for a drama/theatre work' },
  { notation: 'TH.PR.6.6', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '6', description: 'Adapt a drama/theatre work and present for different audiences' },
  { notation: 'TH.RE.7.6', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '6', description: 'Describe and record personal reactions to artistic choices' },
  { notation: 'TH.RE.8.6', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '6', description: 'Explain how the actions and choices of characters impact drama' },
  { notation: 'TH.RE.9.6', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '6', description: 'Identify and apply criteria for evaluating drama and theatre' },
  { notation: 'TH.CN.10.6', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '6', description: 'Explain how stories are influenced by culture and history' },
  { notation: 'TH.CN.11.6', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '6', description: 'Research and analyze the role of theatre in a community' },

  { notation: 'TH.CR.1.7', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '7', description: 'Investigate multiple perspectives and solutions in drama' },
  { notation: 'TH.CR.2.7', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '7', description: 'Devise original ideas to create drama or theatre work' },
  { notation: 'TH.CR.3.7', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '7', description: 'Demonstrate focus and concentration in rehearsal and refine work' },
  { notation: 'TH.PR.4.7', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '7', description: 'Consider multiple interpretations of a drama or theatre work' },
  { notation: 'TH.PR.5.7', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '7', description: 'Choose design solutions to support the story and characters' },
  { notation: 'TH.PR.6.7', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '7', description: 'Participate in a variety of theatre experiences' },
  { notation: 'TH.RE.7.7', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '7', description: 'Compare recorded personal reactions to artistic choices' },
  { notation: 'TH.RE.8.7', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '7', description: 'Apply criteria to the evaluation of artistic choices' },
  { notation: 'TH.RE.9.7', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '7', description: 'Explain preferences, using drama vocabulary and artistic criteria' },
  { notation: 'TH.CN.10.7', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '7', description: 'Incorporate multiple perspectives in a drama or theatre work' },
  { notation: 'TH.CN.11.7', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '7', description: 'Research and discuss historical and cultural contexts of drama' },

  { notation: 'TH.CR.1.8', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: '8', description: 'Develop a scripted or devised theatrical work' },
  { notation: 'TH.CR.2.8', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: '8', description: 'Develop detailed supporting evidence for an original work' },
  { notation: 'TH.CR.3.8', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: '8', description: 'Use repetition and analysis to refine technical skills' },
  { notation: 'TH.PR.4.8', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: '8', description: 'Explore a scripted or devised character through given circumstances' },
  { notation: 'TH.PR.5.8', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: '8', description: 'Explore and justify design choices to support drama' },
  { notation: 'TH.PR.6.8', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: '8', description: 'Perform a rehearsed drama or theatre work for an audience' },
  { notation: 'TH.RE.7.8', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: '8', description: 'Apply criteria to evaluate artistic choices in a drama' },
  { notation: 'TH.RE.8.8', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: '8', description: 'Apply understanding of cultures and experiences to interpret a drama' },
  { notation: 'TH.RE.9.8', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: '8', description: 'Respond to a drama and justify personal reactions' },
  { notation: 'TH.CN.10.8', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: '8', description: 'Examine a community issue through drama or theatre' },
  { notation: 'TH.CN.11.8', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: '8', description: 'Apply understanding of different cultural perspectives in drama' },

  // High School
  { notation: 'TH.CR.1.Prof', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: 'Prof', description: 'Apply creative processes to create a drama or theatre work' },
  { notation: 'TH.CR.2.Prof', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: 'Prof', description: 'Research to devise an original work for a specific audience' },
  { notation: 'TH.CR.3.Prof', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: 'Prof', description: 'Use script analysis to create a believable performance' },
  { notation: 'TH.PR.4.Prof', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: 'Prof', description: 'Explore physical, vocal, and psychological dimensions of character' },
  { notation: 'TH.PR.5.Prof', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: 'Prof', description: 'Apply technical elements and design to support a production' },
  { notation: 'TH.PR.6.Prof', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: 'Prof', description: 'Perform a scripted drama for a specific audience' },
  { notation: 'TH.RE.7.Prof', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: 'Prof', description: 'Respond to and evaluate artistic choices in a theatrical production' },
  { notation: 'TH.RE.8.Prof', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: 'Prof', description: 'Apply script analysis and production concepts to interpret drama' },
  { notation: 'TH.RE.9.Prof', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: 'Prof', description: 'Justify critical responses to drama using criteria' },
  { notation: 'TH.CN.10.Prof', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: 'Prof', description: 'Explore how personal experience influences character work' },
  { notation: 'TH.CN.11.Prof', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: 'Prof', description: 'Research and analyze historical and cultural context of a drama' },

  { notation: 'TH.CR.1.Acc', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: 'Acc', description: 'Develop and synthesize original ideas in a drama or theatre work' },
  { notation: 'TH.CR.2.Acc', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: 'Acc', description: 'Develop a drama or theatre piece that identifies and questions social issues' },
  { notation: 'TH.CR.3.Acc', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: 'Acc', description: 'Develop effective physical, vocal, and psychological choices' },
  { notation: 'TH.PR.4.Acc', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: 'Acc', description: 'Apply reliable methods of research to create a believable character' },
  { notation: 'TH.PR.5.Acc', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: 'Acc', description: 'Originate and execute design elements in a drama or theatre work' },
  { notation: 'TH.PR.6.Acc', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: 'Acc', description: 'Present a drama or theatre production for a specific audience' },
  { notation: 'TH.RE.7.Acc', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: 'Acc', description: 'Collaboratively analyze the dramatic elements of a drama' },
  { notation: 'TH.RE.8.Acc', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: 'Acc', description: 'Develop and synthesize personal responses and observations' },
  { notation: 'TH.RE.9.Acc', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: 'Acc', description: 'Research and assess multiple artistic philosophies' },
  { notation: 'TH.CN.10.Acc', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: 'Acc', description: 'Choose roles that require different skills to build fluency' },
  { notation: 'TH.CN.11.Acc', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: 'Acc', description: 'Integrate conventions and knowledge from different cultures in drama' },

  { notation: 'TH.CR.1.Adv', discipline: 'TH', process: 'CR', anchorStandard: 1, grade: 'Adv', description: 'Synthesize knowledge to create theatrical work that challenges assumptions' },
  { notation: 'TH.CR.2.Adv', discipline: 'TH', process: 'CR', anchorStandard: 2, grade: 'Adv', description: 'Collaborate as an ensemble to refine a devised or scripted drama' },
  { notation: 'TH.CR.3.Adv', discipline: 'TH', process: 'CR', anchorStandard: 3, grade: 'Adv', description: 'Use research and analysis to refine choices in creating characters' },
  { notation: 'TH.PR.4.Adv', discipline: 'TH', process: 'PR', anchorStandard: 4, grade: 'Adv', description: 'Apply a variety of researched approaches to character development' },
  { notation: 'TH.PR.5.Adv', discipline: 'TH', process: 'PR', anchorStandard: 5, grade: 'Adv', description: 'Explain and justify the selection of technical choices' },
  { notation: 'TH.PR.6.Adv', discipline: 'TH', process: 'PR', anchorStandard: 6, grade: 'Adv', description: 'Present theatre that exhibits a high degree of discipline' },
  { notation: 'TH.RE.7.Adv', discipline: 'TH', process: 'RE', anchorStandard: 7, grade: 'Adv', description: 'Use historical and cultural analysis to evaluate a drama' },
  { notation: 'TH.RE.8.Adv', discipline: 'TH', process: 'RE', anchorStandard: 8, grade: 'Adv', description: 'Apply research and analysis to develop original critiques' },
  { notation: 'TH.RE.9.Adv', discipline: 'TH', process: 'RE', anchorStandard: 9, grade: 'Adv', description: 'Synthesize research and analysis to construct complex critiques' },
  { notation: 'TH.CN.10.Adv', discipline: 'TH', process: 'CN', anchorStandard: 10, grade: 'Adv', description: 'Collaborate on drama that examines a contemporary social issue' },
  { notation: 'TH.CN.11.Adv', discipline: 'TH', process: 'CN', anchorStandard: 11, grade: 'Adv', description: 'Develop a drama that uses theatre conventions from multiple cultures' },
];

// ============================================================================
// MEDIA ARTS (MA)
// ============================================================================

export const mediaArtsStandards: NCASStandard[] = [
  // Grades K-2 (Media Arts starts at Kindergarten)
  { notation: 'MA.CR.1.K', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: 'K', description: 'Discover, share, and express ideas for media artworks' },
  { notation: 'MA.CR.2.K', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: 'K', description: 'With guidance, use ideas to form plans for media arts productions' },
  { notation: 'MA.CR.3.K', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: 'K', description: 'Make changes to the content of media artworks' },
  { notation: 'MA.PR.4.K', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: 'K', description: 'With guidance, combine arts forms and media content' },
  { notation: 'MA.PR.5.K', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: 'K', description: 'With guidance, identify and demonstrate basic skills for media arts production' },
  { notation: 'MA.PR.6.K', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: 'K', description: 'With guidance, identify and share media artworks' },
  { notation: 'MA.RE.7.K', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: 'K', description: 'Identify components and messages in media artworks' },
  { notation: 'MA.RE.8.K', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: 'K', description: 'Share observations of media artworks, identifying subject matter' },
  { notation: 'MA.RE.9.K', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: 'K', description: 'Share appealing qualities and possible improvements for media artworks' },
  { notation: 'MA.CN.10.K', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: 'K', description: 'Use personal experiences in making media artworks' },
  { notation: 'MA.CN.11.K', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: 'K', description: 'Interact safely and appropriately with media arts tools' },

  { notation: 'MA.CR.1.1', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '1', description: 'Express and share ideas for media artworks using play and experimentation' },
  { notation: 'MA.CR.2.1', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '1', description: 'With guidance, use ideas to form plans for media arts productions' },
  { notation: 'MA.CR.3.1', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '1', description: 'Identify and describe effects and changes in media artworks' },
  { notation: 'MA.PR.4.1', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '1', description: 'With guidance, combine varied arts media in forming media artworks' },
  { notation: 'MA.PR.5.1', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '1', description: 'With guidance, practice and identify basic skills in media arts production' },
  { notation: 'MA.PR.6.1', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '1', description: 'With guidance, identify, share, and discuss media artworks' },
  { notation: 'MA.RE.7.1', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '1', description: 'Identify components and messages in media artworks' },
  { notation: 'MA.RE.8.1', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '1', description: 'With guidance, identify meanings in a variety of media artworks' },
  { notation: 'MA.RE.9.1', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '1', description: 'Identify and share effective components of media artworks' },
  { notation: 'MA.CN.10.1', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '1', description: 'Use personal experiences and interests in creating media artworks' },
  { notation: 'MA.CN.11.1', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '1', description: 'Discuss media arts safely and responsibly' },

  { notation: 'MA.CR.1.2', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '2', description: 'Explore form ideas through brainstorming and experimentation' },
  { notation: 'MA.CR.2.2', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '2', description: 'Discuss, test, and assemble ideas for media arts productions' },
  { notation: 'MA.CR.3.2', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '2', description: 'Choose, examine, and demonstrate effects in media artworks' },
  { notation: 'MA.PR.4.2', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '2', description: 'Practice combining media and content in media artworks' },
  { notation: 'MA.PR.5.2', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '2', description: 'Demonstrate basic skills in media arts production practices' },
  { notation: 'MA.PR.6.2', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '2', description: 'Identify, describe, and share media artworks considering context' },
  { notation: 'MA.RE.7.2', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '2', description: 'Identify and describe how messages are created in media artworks' },
  { notation: 'MA.RE.8.2', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '2', description: 'Identify and describe meanings in media artworks' },
  { notation: 'MA.RE.9.2', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '2', description: 'Discuss the effectiveness of components in media artworks' },
  { notation: 'MA.CN.10.2', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '2', description: 'Relate media arts ideas to personal and community life' },
  { notation: 'MA.CN.11.2', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '2', description: 'Discuss safe and responsible choices when creating media artworks' },

  // Grades 3-5
  { notation: 'MA.CR.1.3', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '3', description: 'Develop multiple ideas for media arts production using a variety of tools' },
  { notation: 'MA.CR.2.3', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '3', description: 'Form plans for media arts productions' },
  { notation: 'MA.CR.3.3', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '3', description: 'Evaluate and refine media arts products and productions' },
  { notation: 'MA.PR.4.3', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '3', description: 'Practice combining media arts content with other arts forms' },
  { notation: 'MA.PR.5.3', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '3', description: 'Exhibit standard skills in media arts production processes' },
  { notation: 'MA.PR.6.3', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '3', description: 'Present media artworks considering meaning and context' },
  { notation: 'MA.RE.7.3', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '3', description: 'Identify and describe how messages are created and communicated' },
  { notation: 'MA.RE.8.3', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '3', description: 'Determine and explain how messages and meaning are created' },
  { notation: 'MA.RE.9.3', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '3', description: 'Identify criteria for evaluating media artworks' },
  { notation: 'MA.CN.10.3', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '3', description: 'Identify how media arts relate to everyday life and self' },
  { notation: 'MA.CN.11.3', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '3', description: 'Identify rules for and effects of safe media practices' },

  { notation: 'MA.CR.1.4', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '4', description: 'Conceive creative ideas for media arts productions' },
  { notation: 'MA.CR.2.4', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '4', description: 'Discuss and make goals for media arts productions' },
  { notation: 'MA.CR.3.4', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '4', description: 'Revise media arts products and productions' },
  { notation: 'MA.PR.4.4', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '4', description: 'Demonstrate how to integrate media with other arts forms' },
  { notation: 'MA.PR.5.4', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '4', description: 'Demonstrate skills in using various media arts production tools' },
  { notation: 'MA.PR.6.4', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '4', description: 'Explain methods for presenting and showing media artworks' },
  { notation: 'MA.RE.7.4', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '4', description: 'Explain how and why media arts are experienced' },
  { notation: 'MA.RE.8.4', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '4', description: 'Determine and explain perspectives in media artworks' },
  { notation: 'MA.RE.9.4', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '4', description: 'Determine and apply criteria for evaluating media artworks' },
  { notation: 'MA.CN.10.4', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '4', description: 'Examine and use media arts tools for self-expression and learning' },
  { notation: 'MA.CN.11.4', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '4', description: 'Examine, discuss, and demonstrate rules and consequences of media arts' },

  { notation: 'MA.CR.1.5', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '5', description: 'Envision original ideas and refine concepts for media artworks' },
  { notation: 'MA.CR.2.5', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '5', description: 'Develop plans to create media artworks' },
  { notation: 'MA.CR.3.5', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '5', description: 'Create, refine, and present media artworks' },
  { notation: 'MA.PR.4.5', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '5', description: 'Create media artworks that integrate other arts forms' },
  { notation: 'MA.PR.5.5', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '5', description: 'Demonstrate skills in media arts production using feedback' },
  { notation: 'MA.PR.6.5', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '5', description: 'Compare the presentation of media artworks' },
  { notation: 'MA.RE.7.5', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '5', description: 'Identify, describe, and compare how audiences experience media artworks' },
  { notation: 'MA.RE.8.5', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '5', description: 'Determine and compare how meaning is conveyed in media artworks' },
  { notation: 'MA.RE.9.5', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '5', description: 'Develop and apply criteria to evaluate media artworks' },
  { notation: 'MA.CN.10.5', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '5', description: 'Access, evaluate, and use media artworks for learning' },
  { notation: 'MA.CN.11.5', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '5', description: 'Research and discuss laws, rules, and standards related to media arts' },

  // Grades 6-8
  { notation: 'MA.CR.1.6', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '6', description: 'Formulate variations of goals and solutions for media artworks' },
  { notation: 'MA.CR.2.6', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '6', description: 'Organize, propose, and evaluate ideas for media artworks' },
  { notation: 'MA.CR.3.6', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '6', description: 'Experiment and refine media artworks for constructive evaluation' },
  { notation: 'MA.PR.4.6', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '6', description: 'Validate how integrating media can support the communication of ideas' },
  { notation: 'MA.PR.5.6', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '6', description: 'Develop skills in media arts production' },
  { notation: 'MA.PR.6.6', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '6', description: 'Analyze various presentation methods for media artworks' },
  { notation: 'MA.RE.7.6', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '6', description: 'Identify, describe, and analyze how context affects media artwork' },
  { notation: 'MA.RE.8.6', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '6', description: 'Analyze meaning in media artworks' },
  { notation: 'MA.RE.9.6', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '6', description: 'Determine and apply criteria to evaluate media artworks' },
  { notation: 'MA.CN.10.6', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '6', description: 'Access, evaluate, and use media for learning and community' },
  { notation: 'MA.CN.11.6', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '6', description: 'Explain rules, laws, and ethics of media arts' },

  { notation: 'MA.CR.1.7', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '7', description: 'Produce ideas and solutions for media arts problems' },
  { notation: 'MA.CR.2.7', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '7', description: 'Design, propose, and evaluate media arts productions' },
  { notation: 'MA.CR.3.7', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '7', description: 'Improve media artworks through constructive evaluation' },
  { notation: 'MA.PR.4.7', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '7', description: 'Demonstrate use of tools to integrate multiple contents' },
  { notation: 'MA.PR.5.7', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '7', description: 'Demonstrate skills in media arts production processes' },
  { notation: 'MA.PR.6.7', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '7', description: 'Evaluate media artworks for various contexts' },
  { notation: 'MA.RE.7.7', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '7', description: 'Describe and analyze how context affects media perception' },
  { notation: 'MA.RE.8.7', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '7', description: 'Analyze message and meaning in media artworks' },
  { notation: 'MA.RE.9.7', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '7', description: 'Develop and apply criteria to evaluate media artworks and productions' },
  { notation: 'MA.CN.10.7', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '7', description: 'Access, evaluate, and integrate media for learning and citizenship' },
  { notation: 'MA.CN.11.7', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '7', description: 'Research and demonstrate responsible media creation' },

  { notation: 'MA.CR.1.8', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: '8', description: 'Generate ideas to develop media artworks' },
  { notation: 'MA.CR.2.8', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: '8', description: 'Structure, propose, and implement media arts productions' },
  { notation: 'MA.CR.3.8', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: '8', description: 'Refine and present media artworks responding to feedback' },
  { notation: 'MA.PR.4.8', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: '8', description: 'Demonstrate use of tools and techniques in media production' },
  { notation: 'MA.PR.5.8', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: '8', description: 'Demonstrate adaptability using tools for media arts production' },
  { notation: 'MA.PR.6.8', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: '8', description: 'Design presentation of media artworks for specific contexts' },
  { notation: 'MA.RE.7.8', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: '8', description: 'Compare, contrast, and analyze how media artworks affect meaning' },
  { notation: 'MA.RE.8.8', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: '8', description: 'Analyze the intent and meaning of media artworks' },
  { notation: 'MA.RE.9.8', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: '8', description: 'Evaluate media artworks and productions using criteria' },
  { notation: 'MA.CN.10.8', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: '8', description: 'Demonstrate critical evaluation and integration of media' },
  { notation: 'MA.CN.11.8', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: '8', description: 'Demonstrate ethical responsibility in creating media artworks' },

  // High School
  { notation: 'MA.CR.1.Prof', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: 'Prof', description: 'Use identified ideas and audience awareness for generating media artworks' },
  { notation: 'MA.CR.2.Prof', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: 'Prof', description: 'Apply aesthetic criteria to achieve goals for media artworks' },
  { notation: 'MA.CR.3.Prof', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: 'Prof', description: 'Refine media artworks using self and peer assessment' },
  { notation: 'MA.PR.4.Prof', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: 'Prof', description: 'Integrate varied processes and content to convey purpose' },
  { notation: 'MA.PR.5.Prof', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: 'Prof', description: 'Demonstrate use of tools and techniques in media production' },
  { notation: 'MA.PR.6.Prof', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: 'Prof', description: 'Curate and present media artworks considering context' },
  { notation: 'MA.RE.7.Prof', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: 'Prof', description: 'Analyze contextual factors that influence media artworks' },
  { notation: 'MA.RE.8.Prof', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: 'Prof', description: 'Analyze the intent, meaning, and impact of media artworks' },
  { notation: 'MA.RE.9.Prof', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: 'Prof', description: 'Evaluate and justify the effectiveness of media artworks' },
  { notation: 'MA.CN.10.Prof', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: 'Prof', description: 'Access, evaluate, and use media for personal and collective purposes' },
  { notation: 'MA.CN.11.Prof', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: 'Prof', description: 'Demonstrate understanding of legal and ethical responsibilities' },

  { notation: 'MA.CR.1.Acc', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: 'Acc', description: 'Integrate ideas for media artworks that consider audience' },
  { notation: 'MA.CR.2.Acc', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: 'Acc', description: 'Apply a personal aesthetic in designing media artworks' },
  { notation: 'MA.CR.3.Acc', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: 'Acc', description: 'Refine media artworks demonstrating acquired knowledge' },
  { notation: 'MA.PR.4.Acc', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: 'Acc', description: 'Demonstrate proficiency integrating content in media artworks' },
  { notation: 'MA.PR.5.Acc', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: 'Acc', description: 'Demonstrate increased fluency in media production' },
  { notation: 'MA.PR.6.Acc', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: 'Acc', description: 'Design and curate media presentations for specific audiences' },
  { notation: 'MA.RE.7.Acc', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: 'Acc', description: 'Analyze how context affects and informs media artworks' },
  { notation: 'MA.RE.8.Acc', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: 'Acc', description: 'Analyze and interpret intent and meaning of media artworks' },
  { notation: 'MA.RE.9.Acc', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: 'Acc', description: 'Form and justify criteria and evaluations of media artworks' },
  { notation: 'MA.CN.10.Acc', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: 'Acc', description: 'Access, evaluate, and use internal and external resources' },
  { notation: 'MA.CN.11.Acc', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: 'Acc', description: 'Demonstrate ethical responsibility in media arts practices' },

  { notation: 'MA.CR.1.Adv', discipline: 'MA', process: 'CR', anchorStandard: 1, grade: 'Adv', description: 'Integrate original ideas for media artworks using multiple resources' },
  { notation: 'MA.CR.2.Adv', discipline: 'MA', process: 'CR', anchorStandard: 2, grade: 'Adv', description: 'Demonstrate a personal aesthetic in complex media artworks' },
  { notation: 'MA.CR.3.Adv', discipline: 'MA', process: 'CR', anchorStandard: 3, grade: 'Adv', description: 'Intentionally and consistently refine media artworks' },
  { notation: 'MA.PR.4.Adv', discipline: 'MA', process: 'PR', anchorStandard: 4, grade: 'Adv', description: 'Synthesize content and technologies to create unified media artworks' },
  { notation: 'MA.PR.5.Adv', discipline: 'MA', process: 'PR', anchorStandard: 5, grade: 'Adv', description: 'Demonstrate mastery in production processes for media artworks' },
  { notation: 'MA.PR.6.Adv', discipline: 'MA', process: 'PR', anchorStandard: 6, grade: 'Adv', description: 'Curate and design presentations of media artworks' },
  { notation: 'MA.RE.7.Adv', discipline: 'MA', process: 'RE', anchorStandard: 7, grade: 'Adv', description: 'Analyze contextual, cultural, and societal perspectives in media artworks' },
  { notation: 'MA.RE.8.Adv', discipline: 'MA', process: 'RE', anchorStandard: 8, grade: 'Adv', description: 'Analyze and synthesize meanings and cultural perspectives' },
  { notation: 'MA.RE.9.Adv', discipline: 'MA', process: 'RE', anchorStandard: 9, grade: 'Adv', description: 'Independently develop rigorous evaluations of media artworks' },
  { notation: 'MA.CN.10.Adv', discipline: 'MA', process: 'CN', anchorStandard: 10, grade: 'Adv', description: 'Critically evaluate and demonstrate media literacy' },
  { notation: 'MA.CN.11.Adv', discipline: 'MA', process: 'CN', anchorStandard: 11, grade: 'Adv', description: 'Demonstrate exemplary ethical responsibility in media arts' },
];

// Combined export
export const allNCASStandards: NCASStandard[] = [
  ...visualArtsStandards,
  ...musicStandards,
  ...danceStandards,
  ...theatreStandards,
  ...mediaArtsStandards,
];

// Helper functions
export function getNCASStandardsByDiscipline(discipline: ArtsDiscipline): NCASStandard[] {
  return allNCASStandards.filter(s => s.discipline === discipline);
}

export function getNCASStandardsByGrade(grade: string): NCASStandard[] {
  return allNCASStandards.filter(s => s.grade === grade);
}

export function getNCASStandardsByProcess(process: ArtisticProcess): NCASStandard[] {
  return allNCASStandards.filter(s => s.process === process);
}

export function getNCASStandardsByAnchor(anchorStandard: number): NCASStandard[] {
  return allNCASStandards.filter(s => s.anchorStandard === anchorStandard);
}

export function getDisciplineName(discipline: ArtsDiscipline): string {
  const names: Record<ArtsDiscipline, string> = {
    DA: 'Dance',
    MA: 'Media Arts',
    MU: 'Music',
    TH: 'Theatre',
    VA: 'Visual Arts',
  };
  return names[discipline];
}

export function getProcessName(process: ArtisticProcess): string {
  const names: Record<ArtisticProcess, string> = {
    CR: 'Creating',
    PR: 'Performing/Presenting/Producing',
    RE: 'Responding',
    CN: 'Connecting',
  };
  return names[process];
}
