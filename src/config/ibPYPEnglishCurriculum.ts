/**
 * IB Primary Years Programme (PYP) - Language (English) Scope and Sequence
 * Ages 3-12 (5 developmental phases)
 *
 * Official Source: IB PYP Language Scope and Sequence (2009)
 * https://www.ibo.org/programmes/primary-years-programme/
 *
 * The IB PYP uses developmental phases rather than strict grade levels.
 * Language is organized by 4 strands covering receptive and expressive aspects:
 * - Oral Language (Listening and Speaking)
 * - Visual Language (Viewing and Presenting)
 * - Written Language - Reading
 * - Written Language - Writing
 *
 * Notation System: IB.PYP.{phase}.EN.{strand}.{number}
 * - IB = International Baccalaureate
 * - PYP = Primary Years Programme
 * - Phase: P1 (3-5), P2 (5-6), P3 (6-8), P4 (8-10), P5 (10-12)
 * - EN = English/Language
 * - Strand codes:
 *   - OL = Oral Language (Listening and Speaking)
 *   - VL = Visual Language (Viewing and Presenting)
 *   - RD = Reading
 *   - WR = Writing
 */

export interface IBPYPEnglishStandard {
  notation: string;
  strand: string;
  description: string;
}

export interface IBPYPEnglishPhase {
  phase: number; // 1-5
  phaseLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  gradeEquivalent: string;
  standards: IBPYPEnglishStandard[];
}

export interface IBPYPEnglishCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  phases: IBPYPEnglishPhase[];
}

// =============================================================================
// PHASE 1 (Ages 3-5) - Early Years / Pre-K
// =============================================================================

const phase1Standards: IBPYPEnglishStandard[] = [
  // ORAL LANGUAGE - Phase 1
  {
    notation: 'IB.PYP.P1.EN.OL.1',
    strand: 'Oral Language',
    description: 'use gestures, actions, body language and/or words to communicate needs and to express ideas',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.2',
    strand: 'Oral Language',
    description: 'listen and respond to picture books, showing pleasure, and demonstrating their understanding through gestures, expression and/or words',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.3',
    strand: 'Oral Language',
    description: 'name classmates, teachers and familiar classroom and playground objects',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.4',
    strand: 'Oral Language',
    description: 'interact effectively with peers and adults in familiar social settings',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.5',
    strand: 'Oral Language',
    description: 'tell their own stories using words, gestures, and objects/artifacts',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.6',
    strand: 'Oral Language',
    description: 'repeat/echo single words',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.7',
    strand: 'Oral Language',
    description: 'use single words and two-word phrases in context',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.8',
    strand: 'Oral Language',
    description: 'join in with poems, rhymes, songs and repeated phrases in shared books',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.9',
    strand: 'Oral Language',
    description: 'understand simple questions and respond with actions or words',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.10',
    strand: 'Oral Language',
    description: 'follow classroom directions and routines, using context cues',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.11',
    strand: 'Oral Language',
    description: 'realize that people speak different languages',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.12',
    strand: 'Oral Language',
    description: 'use the mother tongue (with translation, if necessary) to express needs and explain ideas',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.13',
    strand: 'Oral Language',
    description: 'realize that word order can change from one language to another',
  },
  {
    notation: 'IB.PYP.P1.EN.OL.14',
    strand: 'Oral Language',
    description: 'use own grammar style as part of the process of developing grammatical awareness',
  },

  // VISUAL LANGUAGE - Phase 1
  {
    notation: 'IB.PYP.P1.EN.VL.1',
    strand: 'Visual Language',
    description: 'attend to visual information showing understanding through play, gestures, facial expression',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.2',
    strand: 'Visual Language',
    description: 'reveal their own feelings in response to visual presentations (showing amusement, curiosity, surprise)',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.3',
    strand: 'Visual Language',
    description: 'observe visual cues that indicate context; show understanding by matching pictures with context',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.4',
    strand: 'Visual Language',
    description: 'recognize familiar signs, labels and logos (pedestrian walking sign, emergency exit sign, no dogs allowed)',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.5',
    strand: 'Visual Language',
    description: 'make personal connections to visual texts (picture books about children making friends)',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.6',
    strand: 'Visual Language',
    description: 'use body language to communicate and to convey understanding (pointing, gesturing, facial expressions)',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.7',
    strand: 'Visual Language',
    description: 'select and incorporate colours, shapes, symbols and images into visual presentations',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.8',
    strand: 'Visual Language',
    description: 'show appreciation of illustrations in picture books by selecting and rereading familiar books, focusing on favourite pages',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.9',
    strand: 'Visual Language',
    description: 'locate and use appropriate ICT iconography to activate different devices (computer games, CD player, television)',
  },
  {
    notation: 'IB.PYP.P1.EN.VL.10',
    strand: 'Visual Language',
    description: 'listen to terminology associated with visual texts and understand terms such as colour, shape, size',
  },

  // READING - Phase 1
  {
    notation: 'IB.PYP.P1.EN.RD.1',
    strand: 'Reading',
    description: 'enjoy listening to stories',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.2',
    strand: 'Reading',
    description: 'choose and "read" picture books for pleasure',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.3',
    strand: 'Reading',
    description: 'locate and respond to aspects of interest in self-selected texts (pointing, examining pictures closely, commenting)',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.4',
    strand: 'Reading',
    description: 'show curiosity and ask questions about pictures or text',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.5',
    strand: 'Reading',
    description: 'listen attentively and respond to stories read aloud',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.6',
    strand: 'Reading',
    description: 'participate in shared reading, joining in with rhymes, refrains and repeated text as they gain familiarity',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.7',
    strand: 'Reading',
    description: 'make connections to their own experience when listening to or "reading" texts',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.8',
    strand: 'Reading',
    description: 'begin to discriminate between visual representations such as symbols, numbers, ICT iconography, letters and words',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.9',
    strand: 'Reading',
    description: 'recognize their own first name',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.10',
    strand: 'Reading',
    description: 'express opinions about the meaning of a story',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.11',
    strand: 'Reading',
    description: 'show empathy for characters in a story',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.12',
    strand: 'Reading',
    description: 'distinguish between pictures and written text',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.13',
    strand: 'Reading',
    description: 'recognize that the organization of on-screen text is different from how text is organized in a book',
  },
  {
    notation: 'IB.PYP.P1.EN.RD.14',
    strand: 'Reading',
    description: 'join in with chants, poems, songs, word games and clapping games, gaining familiarity with the sounds and patterns of the language of instruction',
  },

  // WRITING - Phase 1
  {
    notation: 'IB.PYP.P1.EN.WR.1',
    strand: 'Writing',
    description: 'experiment with writing using different writing implements and media',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.2',
    strand: 'Writing',
    description: 'choose to write as play, or in informal situations (filling in forms in a pretend post office, writing a menu or wish list for a party)',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.3',
    strand: 'Writing',
    description: 'differentiate between illustrations and written text',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.4',
    strand: 'Writing',
    description: 'use their own experience as a stimulus when drawing and "writing"',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.5',
    strand: 'Writing',
    description: 'show curiosity and ask questions about written language',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.6',
    strand: 'Writing',
    description: 'participate in shared writing, observing the teacher\'s writing and making suggestions',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.7',
    strand: 'Writing',
    description: 'listen and respond to shared books (enlarged texts), observing conventions of print, according to the language(s) of instruction',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.8',
    strand: 'Writing',
    description: 'begin to discriminate between letters/characters, numbers and symbols',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.9',
    strand: 'Writing',
    description: 'show an awareness of sound-symbol relationships and begin to recognize the way that some familiar sounds can be recorded',
  },
  {
    notation: 'IB.PYP.P1.EN.WR.10',
    strand: 'Writing',
    description: 'write their own name independently',
  },
];

// =============================================================================
// PHASE 2 (Ages 5-6) - Year 1 / Kindergarten
// =============================================================================

const phase2Standards: IBPYPEnglishStandard[] = [
  // ORAL LANGUAGE - Phase 2
  {
    notation: 'IB.PYP.P2.EN.OL.1',
    strand: 'Oral Language',
    description: 'listen and respond in small or large groups for increasing periods of time',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.2',
    strand: 'Oral Language',
    description: 'listen to and enjoy stories read aloud; show understanding by responding in oral, written or visual form',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.3',
    strand: 'Oral Language',
    description: 'memorize and join in with poems, rhymes and songs',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.4',
    strand: 'Oral Language',
    description: 'follow classroom instructions, showing understanding',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.5',
    strand: 'Oral Language',
    description: 'describe personal experiences with increasing accuracy',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.6',
    strand: 'Oral Language',
    description: 'obtain simple information from accessible spoken texts',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.7',
    strand: 'Oral Language',
    description: 'distinguish beginning, medial and ending sounds of words with increasing accuracy',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.8',
    strand: 'Oral Language',
    description: 'follow two-step directions',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.9',
    strand: 'Oral Language',
    description: 'predict likely outcomes when listening to texts read aloud',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.10',
    strand: 'Oral Language',
    description: 'use language to address their needs, express feelings and ask questions to gain information',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.11',
    strand: 'Oral Language',
    description: 'use oral language to communicate during classroom activities, conversations and imaginative play',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.12',
    strand: 'Oral Language',
    description: 'begin to communicate in more than one language',
  },
  {
    notation: 'IB.PYP.P2.EN.OL.13',
    strand: 'Oral Language',
    description: 'use grammatical rules of the language(s) of instruction (learners may overgeneralize at this stage)',
  },

  // VISUAL LANGUAGE - Phase 2
  {
    notation: 'IB.PYP.P2.EN.VL.1',
    strand: 'Visual Language',
    description: 'attend to visual information showing understanding through discussion, role play, illustrations',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.2',
    strand: 'Visual Language',
    description: 'talk about their own feelings in response to visual messages; show empathy for the way others might feel',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.3',
    strand: 'Visual Language',
    description: 'relate to different contexts presented in visual texts according to their own experiences',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.4',
    strand: 'Visual Language',
    description: 'locate familiar visual texts in magazines, advertising catalogues, and connect them with associated products',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.5',
    strand: 'Visual Language',
    description: 'show their understanding that visual messages influence our behaviour',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.6',
    strand: 'Visual Language',
    description: 'use body language in mime and role play to communicate ideas and feelings visually',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.7',
    strand: 'Visual Language',
    description: 'realize that shapes, symbols and colours have meaning and include them in presentations',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.8',
    strand: 'Visual Language',
    description: 'use a variety of implements to practise and develop handwriting and presentation skills',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.9',
    strand: 'Visual Language',
    description: 'observe and discuss illustrations in picture books and simple reference books, commenting on the information being conveyed',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.10',
    strand: 'Visual Language',
    description: 'recognize ICT iconography and follow prompts to access programs or activate devices',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.11',
    strand: 'Visual Language',
    description: 'through teacher modelling, become aware of terminology used to tell about visual effects (features, layout, border, frame)',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.12',
    strand: 'Visual Language',
    description: 'view different versions of the same story and discuss the effectiveness of the different ways of telling the same story',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.13',
    strand: 'Visual Language',
    description: 'become aware of the use and organization of visual effects to create a particular impact',
  },
  {
    notation: 'IB.PYP.P2.EN.VL.14',
    strand: 'Visual Language',
    description: 'observe and discuss visual presentations; make suggestions about why they have been created and what the creator has been aiming to achieve',
  },

  // READING - Phase 2
  {
    notation: 'IB.PYP.P2.EN.RD.1',
    strand: 'Reading',
    description: 'select and reread favourite texts for enjoyment',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.2',
    strand: 'Reading',
    description: 'understand that print is permanent (when listening to familiar stories, notices when the reader leaves out or changes parts)',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.3',
    strand: 'Reading',
    description: 'participate in shared reading, posing and responding to questions and joining in the refrains',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.4',
    strand: 'Reading',
    description: 'participate in guided reading situations, observing and applying reading behaviours and interacting effectively with the group',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.5',
    strand: 'Reading',
    description: 'listen attentively and respond actively to read-aloud situations; make predictions, anticipate possible outcomes',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.6',
    strand: 'Reading',
    description: 'read and understand the meaning of self-selected and teacher-selected texts at an appropriate level',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.7',
    strand: 'Reading',
    description: 'use meaning, visual, contextual and memory cues, and cross-check cues against each other, when necessary',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.8',
    strand: 'Reading',
    description: 'read and understand familiar pictures and written text, print from the immediate environment (signs, advertisements, logos, ICT iconography)',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.9',
    strand: 'Reading',
    description: 'make connections between personal experience and storybook characters',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.10',
    strand: 'Reading',
    description: 'discuss personality and behaviour of storybook characters, commenting on reasons why they might react in particular ways',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.11',
    strand: 'Reading',
    description: 'instantly recognize an increasing bank of high-frequency and high-interest words, characters or symbols',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.12',
    strand: 'Reading',
    description: 'have a secure knowledge of the basic conventions of the language(s) of instruction in printed text (orientation, directional movement, layout, spacing, punctuation)',
  },
  {
    notation: 'IB.PYP.P2.EN.RD.13',
    strand: 'Reading',
    description: 'participate in learning engagements involving reading aloud—taking roles and reading dialogue, repeating refrains from familiar stories, reciting poems',
  },

  // WRITING - Phase 2
  {
    notation: 'IB.PYP.P2.EN.WR.1',
    strand: 'Writing',
    description: 'enjoy writing and value their own efforts',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.2',
    strand: 'Writing',
    description: 'write informally about their own ideas, experiences and feelings in a personal journal or diary, initially using simple sentence structures',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.3',
    strand: 'Writing',
    description: 'read their own writing to the teacher and to classmates, realizing that what they have written remains unchanged',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.4',
    strand: 'Writing',
    description: 'participate in shared and guided writing, observing the teacher\'s model, asking questions and offering suggestions',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.5',
    strand: 'Writing',
    description: 'write to communicate a message to a particular audience (news story, instructions, a fantasy story)',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.6',
    strand: 'Writing',
    description: 'create illustrations to match their own written text',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.7',
    strand: 'Writing',
    description: 'demonstrate an awareness of the conventions of written text (sequence, spacing, directionality)',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.8',
    strand: 'Writing',
    description: 'connect written codes with the sounds of spoken language and reflect this understanding when recording ideas',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.9',
    strand: 'Writing',
    description: 'form letters/characters conventionally and legibly, with an understanding as to why this is important within a language community',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.10',
    strand: 'Writing',
    description: 'discriminate between types of code (letters, numbers, symbols, words/characters)',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.11',
    strand: 'Writing',
    description: 'write an increasing number of frequently used words or ideas independently',
  },
  {
    notation: 'IB.PYP.P2.EN.WR.12',
    strand: 'Writing',
    description: 'illustrate their own writing and contribute to a class book or collection of published writing',
  },
];

// =============================================================================
// PHASE 3 (Ages 6-8) - Years 2-3 / Grades 1-2
// =============================================================================

const phase3Standards: IBPYPEnglishStandard[] = [
  // ORAL LANGUAGE - Phase 3
  {
    notation: 'IB.PYP.P3.EN.OL.1',
    strand: 'Oral Language',
    description: 'listen attentively and speak appropriately in small and large group interactions',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.2',
    strand: 'Oral Language',
    description: 'listen to a variety of oral presentations including stories, poems, rhymes and reports and respond with increasing confidence and detail',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.3',
    strand: 'Oral Language',
    description: 'pick out main events and relevant points in oral texts',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.4',
    strand: 'Oral Language',
    description: 'follow multi-step directions',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.5',
    strand: 'Oral Language',
    description: 'retell familiar stories in sequence',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.6',
    strand: 'Oral Language',
    description: 'use language for a variety of personal purposes (invitations)',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.7',
    strand: 'Oral Language',
    description: 'express thoughts, ideas and opinions and discuss them, respecting contributions from others',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.8',
    strand: 'Oral Language',
    description: 'participate in a variety of dramatic activities (role play, puppet theatre, dramatization of familiar stories and poems)',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.9',
    strand: 'Oral Language',
    description: 'use language to explain, inquire and compare',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.10',
    strand: 'Oral Language',
    description: 'recognize patterns in language(s) of instruction and use increasingly accurate grammar',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.11',
    strand: 'Oral Language',
    description: 'begin to understand that language use is influenced by its purpose and the audience',
  },
  {
    notation: 'IB.PYP.P3.EN.OL.12',
    strand: 'Oral Language',
    description: 'hear and appreciate differences between languages',
  },

  // VISUAL LANGUAGE - Phase 3
  {
    notation: 'IB.PYP.P3.EN.VL.1',
    strand: 'Visual Language',
    description: 'view visual information and show understanding by asking relevant questions and discussing possible meaning',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.2',
    strand: 'Visual Language',
    description: 'discuss their own feelings in response to visual messages; listen to other responses, realizing that people react differently',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.3',
    strand: 'Visual Language',
    description: 'realize that visual information reflects and contributes to the understanding of context',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.4',
    strand: 'Visual Language',
    description: 'recognize and name familiar visual texts and explain why they are or are not effective (advertising, logos, labels, signs, billboards)',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.5',
    strand: 'Visual Language',
    description: 'interpret visual cues in order to analyse and make inferences about the intention of the message',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.6',
    strand: 'Visual Language',
    description: 'explain how relevant personal experiences can add to the meaning of a selected film/movie; write and illustrate a personal response',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.7',
    strand: 'Visual Language',
    description: 'use actions and body language to reinforce and add meaning to oral presentations',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.8',
    strand: 'Visual Language',
    description: 'select and use suitable shapes, colours, symbols and layout for presentations; practise and develop writing/calligraphy styles',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.9',
    strand: 'Visual Language',
    description: 'realize that text and illustrations in reference materials work together to convey information, and can explain how this enhances understanding',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.10',
    strand: 'Visual Language',
    description: 'with guidance, use the internet to access relevant information; process and present information in ways that are personally meaningful',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.11',
    strand: 'Visual Language',
    description: 'use appropriate terminology to discuss visual texts (logos, font, foreground, background, impact)',
  },
  {
    notation: 'IB.PYP.P3.EN.VL.12',
    strand: 'Visual Language',
    description: 'observe and discuss familiar and unfamiliar visual messages; make judgments about how visual images and effects contribute to meaning and impact',
  },

  // READING - Phase 3
  {
    notation: 'IB.PYP.P3.EN.RD.1',
    strand: 'Reading',
    description: 'develop personal preferences, selecting books for pleasure and information',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.2',
    strand: 'Reading',
    description: 'read texts at an appropriate level, independently, confidently and with good understanding',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.3',
    strand: 'Reading',
    description: 'recognize a range of different text types (letters, poetry, plays, stories, novels, reports, articles)',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.4',
    strand: 'Reading',
    description: 'identify and explain the basic structure of a story—beginning, middle and end; may use storyboards or comic strips',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.5',
    strand: 'Reading',
    description: 'make predictions about a story, based on their own knowledge and experience; revise or confirm predictions as the story progresses',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.6',
    strand: 'Reading',
    description: 'realize that there is a difference between fiction and non-fiction and use books for particular purposes, with teacher guidance',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.7',
    strand: 'Reading',
    description: 'recognize and use the different parts of a book (title page, contents, index)',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.8',
    strand: 'Reading',
    description: 'understand sound-symbol relationships and apply reliable phonetic strategies when decoding print',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.9',
    strand: 'Reading',
    description: 'use a range of strategies to self-monitor and self-correct (meaning, context, rereading, reading on, cross-checking one cue source against another)',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.10',
    strand: 'Reading',
    description: 'discuss their own experiences and relate them to fiction and non-fiction texts',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.11',
    strand: 'Reading',
    description: 'participate in collaborative learning experiences, acknowledging that people see things differently and are entitled to express their point of view',
  },
  {
    notation: 'IB.PYP.P3.EN.RD.12',
    strand: 'Reading',
    description: 'wonder about texts and ask questions to try to understand what the author is saying to the reader',
  },

  // WRITING - Phase 3
  {
    notation: 'IB.PYP.P3.EN.WR.1',
    strand: 'Writing',
    description: 'engage confidently with the process of writing',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.2',
    strand: 'Writing',
    description: 'write about a range of topics for a variety of purposes, using literary forms and structures modelled by the teacher and/or encountered in reading',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.3',
    strand: 'Writing',
    description: 'use graphic organizers to plan writing (Mind Maps, storyboards)',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.4',
    strand: 'Writing',
    description: 'organize ideas in a logical sequence, for example, write simple narratives with a beginning, middle and end',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.5',
    strand: 'Writing',
    description: 'use appropriate writing conventions (word order) as required by the language(s) of instruction',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.6',
    strand: 'Writing',
    description: 'use familiar aspects of written language with increasing confidence and accuracy (spelling patterns, high-frequency words, high-interest words)',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.7',
    strand: 'Writing',
    description: 'use increasingly accurate grammatical constructs',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.8',
    strand: 'Writing',
    description: 'write legibly, and in a consistent style',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.9',
    strand: 'Writing',
    description: 'proofread their own writing and make some corrections and improvements',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.10',
    strand: 'Writing',
    description: 'use feedback from teachers and other students to improve their writing',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.11',
    strand: 'Writing',
    description: 'use a dictionary, a thesaurus and word banks to extend their use of language',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.12',
    strand: 'Writing',
    description: 'keep a log of ideas to write about',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.13',
    strand: 'Writing',
    description: 'over time, create examples of different types of writing and store them in their own writing folder',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.14',
    strand: 'Writing',
    description: 'participate in teacher conferences with teachers recording progress and noting new learning goals; self-monitor and take responsibility for improvement',
  },
  {
    notation: 'IB.PYP.P3.EN.WR.15',
    strand: 'Writing',
    description: 'with teacher guidance, publish written work, in handwritten form or in digital format',
  },
];

// =============================================================================
// PHASE 4 (Ages 8-10) - Years 4-5 / Grades 3-4
// =============================================================================

const phase4Standards: IBPYPEnglishStandard[] = [
  // ORAL LANGUAGE - Phase 4
  {
    notation: 'IB.PYP.P4.EN.OL.1',
    strand: 'Oral Language',
    description: 'listen appreciatively and responsively, presenting their own point of view and respecting the views of others',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.2',
    strand: 'Oral Language',
    description: 'listen for a specific purpose in a variety of situations',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.3',
    strand: 'Oral Language',
    description: 'identify and expand on main ideas in familiar oral texts',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.4',
    strand: 'Oral Language',
    description: 'listen reflectively to stories read aloud in order to identify story structures and ideas',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.5',
    strand: 'Oral Language',
    description: 'anticipate and predict when listening to text read aloud',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.6',
    strand: 'Oral Language',
    description: 'use language for a variety of personal purposes (invitations)',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.7',
    strand: 'Oral Language',
    description: 'express thoughts, ideas and opinions and discuss them, respecting contributions from others',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.8',
    strand: 'Oral Language',
    description: 'participate in a variety of dramatic activities (role play, puppet theatre, dramatization of familiar stories and poems)',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.9',
    strand: 'Oral Language',
    description: 'use language to explain, inquire and compare',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.10',
    strand: 'Oral Language',
    description: 'recognize patterns in language(s) of instruction and use increasingly accurate grammar',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.11',
    strand: 'Oral Language',
    description: 'begin to understand that language use is influenced by its purpose and the audience',
  },
  {
    notation: 'IB.PYP.P4.EN.OL.12',
    strand: 'Oral Language',
    description: 'hear and appreciate differences between languages',
  },

  // VISUAL LANGUAGE - Phase 4
  {
    notation: 'IB.PYP.P4.EN.VL.1',
    strand: 'Visual Language',
    description: 'view, respond to and describe visual information, communicating understanding in oral, written and visual form',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.2',
    strand: 'Visual Language',
    description: 'describe personal reactions to visual messages; reflect on why others may perceive the images differently',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.3',
    strand: 'Visual Language',
    description: 'understand and explain how visual effects can be used to reflect a particular context',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.4',
    strand: 'Visual Language',
    description: 'identify elements and techniques that make advertisements, logos and symbols effective and draw on this knowledge to create their own visual effects',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.5',
    strand: 'Visual Language',
    description: 'realize that cultural influences affect the way we respond to visual effects and explain how this affects our interpretation',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.6',
    strand: 'Visual Language',
    description: 'realize that individuals interpret visual information according to their personal experiences and different perspectives',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.7',
    strand: 'Visual Language',
    description: 'show how body language (facial expression, gesture and movement, posture and orientation, eye contact and touch) can be used to achieve effects and influence meaning',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.8',
    strand: 'Visual Language',
    description: 'apply knowledge of presentation techniques in original and innovative ways; explain their own ideas for achieving desired effects',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.9',
    strand: 'Visual Language',
    description: 'examine and analyse text and illustrations in reference material, including online text, explaining how visual and written information work together',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.10',
    strand: 'Visual Language',
    description: 'identify aspects of body language in a dramatic presentation and explain how they are used to convey the mood and personal traits of characters',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.11',
    strand: 'Visual Language',
    description: 'design posters and charts, using shapes, colours, symbols, layout and fonts, to achieve particular effects; explain how the desired effect is achieved',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.12',
    strand: 'Visual Language',
    description: 'discuss a newspaper report and tell how the words and pictures work together to convey a particular message',
  },
  {
    notation: 'IB.PYP.P4.EN.VL.13',
    strand: 'Visual Language',
    description: 'prepare, individually or in collaboration, visual presentations using a range of media, including computer and web-based applications',
  },

  // READING - Phase 4
  {
    notation: 'IB.PYP.P4.EN.RD.1',
    strand: 'Reading',
    description: 'read a variety of books for pleasure, instruction and information; reflect regularly on reading and set future goals',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.2',
    strand: 'Reading',
    description: 'distinguish between fiction and non-fiction and select books appropriate to specific purposes',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.3',
    strand: 'Reading',
    description: 'understand and respond to the ideas, feelings and attitudes expressed in various texts, showing empathy for characters',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.4',
    strand: 'Reading',
    description: 'recognize the author\'s purpose (to inform, entertain, persuade) understand that stories have a plot; identify the main idea; discuss and outline the sequence of events leading to the final outcome',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.5',
    strand: 'Reading',
    description: 'appreciate that writers plan and structure their stories to achieve particular effects; identify features that can be replicated when planning their own stories',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.6',
    strand: 'Reading',
    description: 'use reference books, dictionaries, and computer and web-based applications with increasing independence and responsibility',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.7',
    strand: 'Reading',
    description: 'know how to skim and scan texts to decide whether they will be useful, before attempting to read in detail',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.8',
    strand: 'Reading',
    description: 'work cooperatively with others to access, read, interpret, and evaluate a range of source materials',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.9',
    strand: 'Reading',
    description: 'identify relevant, reliable and useful information and decide on appropriate ways to use it',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.10',
    strand: 'Reading',
    description: 'access information from a variety of texts both in print and online (newspapers, magazines, journals, comics, graphic books, e-books, blogs, wikis)',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.11',
    strand: 'Reading',
    description: 'know when and how to use the internet and multimedia resources for research',
  },
  {
    notation: 'IB.PYP.P4.EN.RD.12',
    strand: 'Reading',
    description: 'understand that the internet must be used with the approval and supervision of a parent or teacher; read, understand and sign the school\'s cyber-safety policy',
  },

  // WRITING - Phase 4
  {
    notation: 'IB.PYP.P4.EN.WR.1',
    strand: 'Writing',
    description: 'write independently and with confidence, demonstrating a personal voice as a writer',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.2',
    strand: 'Writing',
    description: 'write for a range of purposes, both creative and informative, using different types of structures and styles according to the purpose of the writing',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.3',
    strand: 'Writing',
    description: 'show awareness of different audiences and adapt writing appropriately',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.4',
    strand: 'Writing',
    description: 'select vocabulary and supporting details to achieve desired effects',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.5',
    strand: 'Writing',
    description: 'organize ideas in a logical sequence',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.6',
    strand: 'Writing',
    description: 'reread, edit and revise to improve their own writing (content, language, organization)',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.7',
    strand: 'Writing',
    description: 'respond to the writing of others sensitively',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.8',
    strand: 'Writing',
    description: 'use appropriate punctuation to support meaning',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.9',
    strand: 'Writing',
    description: 'use knowledge of written code patterns to accurately spell high-frequency and familiar words',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.10',
    strand: 'Writing',
    description: 'use a range of strategies to record words/ideas of increasing complexity',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.11',
    strand: 'Writing',
    description: 'realize that writers ask questions of themselves and identify ways to improve their writing',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.12',
    strand: 'Writing',
    description: 'check punctuation, variety of sentence starters, spelling, presentation',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.13',
    strand: 'Writing',
    description: 'use a dictionary and thesaurus to check accuracy, broaden vocabulary and enrich their writing',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.14',
    strand: 'Writing',
    description: 'work cooperatively with a partner to discuss and improve each other\'s work, taking the roles of authors and editors',
  },
  {
    notation: 'IB.PYP.P4.EN.WR.15',
    strand: 'Writing',
    description: 'work independently, to produce written work that is legible and well-presented, written either by hand or in digital format',
  },
];

// =============================================================================
// PHASE 5 (Ages 10-12) - Years 6-7 / Grades 5-6
// =============================================================================

const phase5Standards: IBPYPEnglishStandard[] = [
  // ORAL LANGUAGE - Phase 5
  {
    notation: 'IB.PYP.P5.EN.OL.1',
    strand: 'Oral Language',
    description: 'participate appropriately as listener and speaker, in discussions, conversations, debates and group presentations',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.2',
    strand: 'Oral Language',
    description: 'generate, develop and modify ideas and opinions through discussion',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.3',
    strand: 'Oral Language',
    description: 'listen and respond appropriately to instructions, questions and explanations',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.4',
    strand: 'Oral Language',
    description: 'infer meanings, draw conclusions and make judgments about oral presentations',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.5',
    strand: 'Oral Language',
    description: 'understand that ideas and opinions can be generated, developed and presented through talk; they work in pairs and groups to develop oral presentations',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.6',
    strand: 'Oral Language',
    description: 'argue persuasively and defend a point of view',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.7',
    strand: 'Oral Language',
    description: 'explain and discuss their own writing with peers and adults',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.8',
    strand: 'Oral Language',
    description: 'begin to paraphrase and summarize',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.9',
    strand: 'Oral Language',
    description: 'organize thoughts and feelings before speaking',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.10',
    strand: 'Oral Language',
    description: 'use a range of specific vocabulary in different situations, indicating an awareness that language is influenced by purpose, audience and context',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.11',
    strand: 'Oral Language',
    description: 'realize that grammatical structures can be irregular and begin to use them appropriately and consistently',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.12',
    strand: 'Oral Language',
    description: 'use oral language appropriately, confidently and with increasing accuracy',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.13',
    strand: 'Oral Language',
    description: 'verbalize their thinking and explain their reasoning',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.14',
    strand: 'Oral Language',
    description: 'recognize that different forms of grammar are used in different contexts',
  },
  {
    notation: 'IB.PYP.P5.EN.OL.15',
    strand: 'Oral Language',
    description: 'appreciate that language is not always used literally; understand and use the figurative language of their own culture',
  },

  // VISUAL LANGUAGE - Phase 5
  {
    notation: 'IB.PYP.P5.EN.VL.1',
    strand: 'Visual Language',
    description: 'view and critically analyse a range of visual texts, communicating understanding through oral, written and visual media',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.2',
    strand: 'Visual Language',
    description: 'identify factors that influence personal reactions to visual texts; design visual texts with the intention of influencing the way people think and feel',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.3',
    strand: 'Visual Language',
    description: 'analyse and interpret the ways in which visual effects are used to establish context',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.4',
    strand: 'Visual Language',
    description: 'observe and discuss the composition of visual presentations; select examples to explain how they achieve a particular impact (dominant images, use of colour, texture, symbolism)',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.5',
    strand: 'Visual Language',
    description: 'identify the intended audience and purpose of a visual presentation; identify overt and subliminal messages',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.6',
    strand: 'Visual Language',
    description: 'reflect on ways in which understanding the intention of a visual message can influence personal responses',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.7',
    strand: 'Visual Language',
    description: 'view a range of visual language formats and appreciate and describe why particular formats are selected to achieve particular effects',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.8',
    strand: 'Visual Language',
    description: 'navigate the internet in response to verbal and visual prompts with confidence and familiarity; use ICT to prepare their own presentations',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.9',
    strand: 'Visual Language',
    description: 'use appropriate terminology to identify a range of visual effects/formats and critically analyse their effectiveness (mood, media, juxtaposition, proportion)',
  },
  {
    notation: 'IB.PYP.P5.EN.VL.10',
    strand: 'Visual Language',
    description: 'analyse the selection and composition of visual presentations; select examples to explain how they achieve a particular impact',
  },

  // READING - Phase 5
  {
    notation: 'IB.PYP.P5.EN.RD.1',
    strand: 'Reading',
    description: 'read a wide range of texts confidently, independently and with understanding',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.2',
    strand: 'Reading',
    description: 'work in cooperative groups to locate and select texts appropriate to purpose and audience',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.3',
    strand: 'Reading',
    description: 'participate in class, group or individual author studies, gaining an in-depth understanding of the work and style of a particular author and appreciating what it means to be an author',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.4',
    strand: 'Reading',
    description: 'identify genre (including fantasy, biography, science fiction, mystery, historical novel) and explain elements and literary forms that are associated with different genres',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.5',
    strand: 'Reading',
    description: 'appreciate structural and stylistic differences between fiction and non-fiction; show understanding of this distinction when structuring their own writing',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.6',
    strand: 'Reading',
    description: 'appreciate authors\' use of language and interpret meaning beyond the literal',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.7',
    strand: 'Reading',
    description: 'understand that authors use words and literary devices to evoke mental images',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.8',
    strand: 'Reading',
    description: 'recognize and understand figurative language (similes, metaphors, idioms)',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.9',
    strand: 'Reading',
    description: 'make inferences and be able to justify them',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.10',
    strand: 'Reading',
    description: 'identify and describe elements of a story—plot, setting, characters, theme—and explain how they contribute to its effectiveness',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.11',
    strand: 'Reading',
    description: 'compare and contrast the plots of two different but similar novels, commenting on effectiveness and impact',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.12',
    strand: 'Reading',
    description: 'distinguish between fact and opinion, and reach their own conclusions about what represents valid information',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.13',
    strand: 'Reading',
    description: 'use a range of strategies to solve comprehension problems and deepen their understanding of a text',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.14',
    strand: 'Reading',
    description: 'consistently and confidently use a range of resources to find information and support their inquiries',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.15',
    strand: 'Reading',
    description: 'participate in collaborative learning, considering multiple perspectives and working with peers to co-construct new understanding',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.16',
    strand: 'Reading',
    description: 'use the internet responsibly and knowledgeably, appreciating its uses and limitations',
  },
  {
    notation: 'IB.PYP.P5.EN.RD.17',
    strand: 'Reading',
    description: 'locate, organize and synthesize information from a variety of sources including the library/media centre, the internet, people in the school, family, the immediate community or the global community',
  },

  // WRITING - Phase 5
  {
    notation: 'IB.PYP.P5.EN.WR.1',
    strand: 'Writing',
    description: 'write independently and with confidence, showing the development of their own voice and style',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.2',
    strand: 'Writing',
    description: 'write using a range of text types in order to communicate effectively (narrative, instructional, persuasive)',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.3',
    strand: 'Writing',
    description: 'adapt writing according to the audience and demonstrate the ability to engage and sustain the interest of the reader',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.4',
    strand: 'Writing',
    description: 'use appropriate paragraphing to organize ideas',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.5',
    strand: 'Writing',
    description: 'use a range of vocabulary and relevant supporting details to convey meaning and create atmosphere and mood',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.6',
    strand: 'Writing',
    description: 'use planning, drafting, editing and reviewing processes independently and with increasing competence',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.7',
    strand: 'Writing',
    description: 'critique the writing of peers sensitively; offer constructive suggestions',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.8',
    strand: 'Writing',
    description: 'vary sentence structure and length',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.9',
    strand: 'Writing',
    description: 'demonstrate an increasing understanding of how grammar works',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.10',
    strand: 'Writing',
    description: 'use standard spelling for most words and use appropriate resources to check spelling',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.11',
    strand: 'Writing',
    description: 'use a dictionary, thesaurus, spellchecker confidently and effectively to check accuracy, broaden vocabulary and enrich their writing',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.12',
    strand: 'Writing',
    description: 'choose to publish written work in handwritten form or in digital format independently',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.13',
    strand: 'Writing',
    description: 'use written language as a means of reflecting on their own learning',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.14',
    strand: 'Writing',
    description: 'recognize and use figurative language to enhance writing (similes, metaphors, idioms, alliteration)',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.15',
    strand: 'Writing',
    description: 'identify and describe elements of a story—setting, plot, character, theme',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.16',
    strand: 'Writing',
    description: 'locate, organize, synthesize and present written information obtained from a variety of valid sources',
  },
  {
    notation: 'IB.PYP.P5.EN.WR.17',
    strand: 'Writing',
    description: 'use a range of tools and techniques to produce written work that is attractively and effectively presented',
  },
];

// =============================================================================
// MAIN EXPORT
// =============================================================================

export const ibPYPEnglishCurriculum: IBPYPEnglishCurriculum = {
  code: 'IB_PYP',
  name: 'International Baccalaureate Primary Years Programme',
  country: 'INTERNATIONAL',
  version: '2009',
  sourceUrl: 'https://www.ibo.org/programmes/primary-years-programme/',
  subject: 'ENGLISH',
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
      ageRangeMax: 6,
      gradeEquivalent: 'Year 1 / Kindergarten',
      standards: phase2Standards,
    },
    {
      phase: 3,
      phaseLabel: 'Phase 3',
      ageRangeMin: 6,
      ageRangeMax: 8,
      gradeEquivalent: 'Years 2-3 / Grades 1-2',
      standards: phase3Standards,
    },
    {
      phase: 4,
      phaseLabel: 'Phase 4',
      ageRangeMin: 8,
      ageRangeMax: 10,
      gradeEquivalent: 'Years 4-5 / Grades 3-4',
      standards: phase4Standards,
    },
    {
      phase: 5,
      phaseLabel: 'Phase 5',
      ageRangeMin: 10,
      ageRangeMax: 12,
      gradeEquivalent: 'Years 6-7 / Grades 5-6',
      standards: phase5Standards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get total count of English standards
 */
export function getTotalEnglishStandardsCount(): number {
  return ibPYPEnglishCurriculum.phases.reduce(
    (total, phase) => total + phase.standards.length,
    0
  );
}

/**
 * Get standards count by phase
 */
export function getEnglishStandardsCountByPhase(): { phase: string; count: number }[] {
  return ibPYPEnglishCurriculum.phases.map((phase) => ({
    phase: phase.phaseLabel,
    count: phase.standards.length,
  }));
}

/**
 * Get standards count by strand across all phases
 */
export function getEnglishStandardsCountByStrand(): { strand: string; count: number }[] {
  const strandCounts: Record<string, number> = {};

  for (const phase of ibPYPEnglishCurriculum.phases) {
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
 * Get all English standards across all phases
 */
export function getAllIBPYPEnglishStandards(): IBPYPEnglishStandard[] {
  return ibPYPEnglishCurriculum.phases.flatMap(phase => phase.standards);
}

/**
 * Get English phase by age
 */
export function getIBPYPEnglishPhaseByAge(age: number): IBPYPEnglishPhase | undefined {
  return ibPYPEnglishCurriculum.phases.find(
    phase => age >= phase.ageRangeMin && age <= phase.ageRangeMax
  );
}

/**
 * Get English standard by notation
 */
export function getIBPYPEnglishStandardByNotation(notation: string): IBPYPEnglishStandard | undefined {
  for (const phase of ibPYPEnglishCurriculum.phases) {
    const standard = phase.standards.find(std => std.notation === notation);
    if (standard) return standard;
  }
  return undefined;
}
