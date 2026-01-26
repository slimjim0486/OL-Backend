/**
 * British National Curriculum - Art and Design Standards
 * Years 1-13 (Key Stages 1-5)
 *
 * Sources:
 * - KS1-3 (Years 1-9): GOV.UK National Curriculum in England
 *   https://www.gov.uk/government/publications/national-curriculum-in-england-art-and-design-programmes-of-study
 * - KS4 (Years 10-11 GCSE): DfE GCSE Art and Design Subject Content
 *   https://www.gov.uk/government/publications/gcse-art-and-design
 * - KS5 (Years 12-13 A-Level): DfE GCE AS and A Level Art and Design
 *   https://www.gov.uk/government/publications/gce-as-and-a-level-for-art-and-design
 *
 * VERIFIED: 2026-01-26 against official DfE documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.ART.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1-5)
 * - Y = Year (1-13)
 * - ART = Art and Design
 *
 * Strand codes by Key Stage:
 *
 * KS1-2 (Years 1-6):
 *   - MAT = Materials and Making
 *   - DPS = Drawing, Painting, Sculpture
 *   - TEC = Techniques (colour, pattern, texture, line, shape, form, space)
 *   - AKN = Artist Knowledge
 *   - SKB = Sketchbooks (KS2 only)
 *
 * KS3 (Years 7-9):
 *   - OBS = Recording Observations
 *   - MED = Media and Techniques
 *   - PRO = Proficiency and Materials
 *   - EVA = Analysis and Evaluation
 *   - HIS = Art History
 *
 * KS4 GCSE (Years 10-11):
 *   - CRT = Critical Understanding
 *   - GEN = Generating Ideas
 *   - INV = Investigation and Experimentation
 *   - PRE = Presentation and Realisation
 *   - SPE = Specialist Areas
 *
 * KS5 A-Level (Years 12-13):
 *   - INT = Integrated Study
 *   - CAP = Creative Capabilities
 *   - RES = Research and Response
 *   - PER = Personal Investigation
 *   - EXT = Extended Project
 */

export interface BritishNCArtDesignStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
  specialistArea?: string;
}

export interface BritishNCArtDesignYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCArtDesignStandard[];
}

export interface BritishNCArtDesignCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCArtDesignYear[];
}

// =============================================================================
// KEY STAGE 1: YEARS 1-2 (Ages 5-7)
// Art and design at KS1 focuses on creativity, exploration and basic techniques
// =============================================================================

const ks1Standards: BritishNCArtDesignStandard[] = [
  // MATERIALS AND MAKING (MAT)
  {
    notation: 'UK.KS1.ART.MAT.1',
    strand: 'Materials and Making',
    description: 'use a range of materials creatively to design and make products',
    isStatutory: true,
    guidance: 'Pupils should explore materials such as paper, card, textiles, clay, and found objects to create their own designs',
  },
  {
    notation: 'UK.KS1.ART.MAT.2',
    strand: 'Materials and Making',
    description: 'explore different materials and their properties for creative purposes',
    isStatutory: true,
    guidance: 'Encourage experimentation with how materials behave - folding, cutting, joining, shaping',
  },

  // DRAWING, PAINTING, SCULPTURE (DPS)
  {
    notation: 'UK.KS1.ART.DPS.1',
    strand: 'Drawing, Painting, Sculpture',
    description: 'use drawing to develop and share their ideas, experiences and imagination',
    isStatutory: true,
    guidance: 'Drawing from observation, memory, and imagination using various drawing tools',
  },
  {
    notation: 'UK.KS1.ART.DPS.2',
    strand: 'Drawing, Painting, Sculpture',
    description: 'use painting to develop and share their ideas, experiences and imagination',
    isStatutory: true,
    guidance: 'Exploring colour mixing, brush techniques, and different types of paint',
  },
  {
    notation: 'UK.KS1.ART.DPS.3',
    strand: 'Drawing, Painting, Sculpture',
    description: 'use sculpture to develop and share their ideas, experiences and imagination',
    isStatutory: true,
    guidance: 'Working with malleable materials like clay, plasticine, and dough to create 3D forms',
  },

  // TECHNIQUES (TEC)
  {
    notation: 'UK.KS1.ART.TEC.1',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using colour',
    isStatutory: true,
    guidance: 'Mixing primary colours, creating shades and tints, colour matching',
  },
  {
    notation: 'UK.KS1.ART.TEC.2',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using pattern',
    isStatutory: true,
    guidance: 'Creating repeating patterns, symmetrical patterns, and patterns from nature',
  },
  {
    notation: 'UK.KS1.ART.TEC.3',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using texture',
    isStatutory: true,
    guidance: 'Exploring rough, smooth, bumpy surfaces through collage, rubbings, and mark-making',
  },
  {
    notation: 'UK.KS1.ART.TEC.4',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using line',
    isStatutory: true,
    guidance: 'Thick, thin, curved, straight, zigzag lines using different tools',
  },
  {
    notation: 'UK.KS1.ART.TEC.5',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using shape',
    isStatutory: true,
    guidance: 'Recognising and creating 2D shapes in artwork',
  },
  {
    notation: 'UK.KS1.ART.TEC.6',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using form',
    isStatutory: true,
    guidance: 'Understanding 3D forms and how to represent them',
  },
  {
    notation: 'UK.KS1.ART.TEC.7',
    strand: 'Art and Design Techniques',
    description: 'develop a wide range of art and design techniques in using space',
    isStatutory: true,
    guidance: 'Foreground, background, and arranging elements within a composition',
  },

  // ARTIST KNOWLEDGE (AKN)
  {
    notation: 'UK.KS1.ART.AKN.1',
    strand: 'Artist Knowledge',
    description: 'learn about the work of a range of artists, craft makers and designers',
    isStatutory: true,
    guidance: 'Introduce pupils to famous artists from different periods and cultures',
  },
  {
    notation: 'UK.KS1.ART.AKN.2',
    strand: 'Artist Knowledge',
    description: 'describe the differences and similarities between different practices and disciplines',
    isStatutory: true,
    guidance: 'Compare and contrast different artists\' styles, subjects, and techniques',
  },
  {
    notation: 'UK.KS1.ART.AKN.3',
    strand: 'Artist Knowledge',
    description: 'make links between artists\' work and their own work',
    isStatutory: true,
    guidance: 'Encourage pupils to be inspired by artists and incorporate ideas into their own creations',
  },
];

// =============================================================================
// KEY STAGE 2: YEARS 3-6 (Ages 7-11)
// Art and design at KS2 builds technical skills and introduces sketchbooks
// =============================================================================

const ks2Standards: BritishNCArtDesignStandard[] = [
  // SKETCHBOOKS (SKB)
  {
    notation: 'UK.KS2.ART.SKB.1',
    strand: 'Sketchbooks',
    description: 'create sketch books to record their observations',
    isStatutory: true,
    guidance: 'Regular use of sketchbooks for drawing, collecting, and recording ideas',
  },
  {
    notation: 'UK.KS2.ART.SKB.2',
    strand: 'Sketchbooks',
    description: 'use sketch books to review and revisit ideas',
    isStatutory: true,
    guidance: 'Reflect on previous work and develop ideas further over time',
  },
  {
    notation: 'UK.KS2.ART.SKB.3',
    strand: 'Sketchbooks',
    description: 'use sketch books for experimentation and exploration',
    isStatutory: true,
    guidance: 'Try out techniques, test materials, and explore possibilities',
  },

  // TECHNIQUES - DRAWING (TEC)
  {
    notation: 'UK.KS2.ART.TEC.1',
    strand: 'Art and Design Techniques',
    description: 'improve their mastery of art and design techniques in drawing',
    isStatutory: true,
    guidance: 'Develop skills in observational drawing, proportion, shading, and perspective',
  },
  {
    notation: 'UK.KS2.ART.TEC.2',
    strand: 'Art and Design Techniques',
    description: 'use a range of drawing materials including pencil, charcoal, and pen',
    isStatutory: true,
    guidance: 'Experience different drawing media and their effects',
  },
  {
    notation: 'UK.KS2.ART.TEC.3',
    strand: 'Art and Design Techniques',
    description: 'improve their mastery of art and design techniques in painting',
    isStatutory: true,
    guidance: 'Develop brushwork, colour theory, and painting techniques',
  },
  {
    notation: 'UK.KS2.ART.TEC.4',
    strand: 'Art and Design Techniques',
    description: 'use paint with increasing control and awareness of colour mixing',
    isStatutory: true,
    guidance: 'Secondary colours, complementary colours, warm and cool palettes',
  },
  {
    notation: 'UK.KS2.ART.TEC.5',
    strand: 'Art and Design Techniques',
    description: 'improve their mastery of art and design techniques in sculpture',
    isStatutory: true,
    guidance: 'Working in 3D with increasing skill and understanding of form',
  },
  {
    notation: 'UK.KS2.ART.TEC.6',
    strand: 'Art and Design Techniques',
    description: 'use a range of materials for sculpture including clay',
    isStatutory: true,
    guidance: 'Experience clay techniques: pinching, coiling, slab building, modelling',
  },
  {
    notation: 'UK.KS2.ART.TEC.7',
    strand: 'Art and Design Techniques',
    description: 'develop control and their use of materials with creativity',
    isStatutory: true,
    guidance: 'Balance technical skill with creative expression',
  },
  {
    notation: 'UK.KS2.ART.TEC.8',
    strand: 'Art and Design Techniques',
    description: 'develop awareness of different kinds of art, craft and design',
    isStatutory: true,
    guidance: 'Exposure to fine art, craft traditions, and design disciplines',
  },

  // PRINTMAKING AND OTHER TECHNIQUES
  {
    notation: 'UK.KS2.ART.TEC.9',
    strand: 'Art and Design Techniques',
    description: 'explore printmaking techniques',
    isStatutory: true,
    guidance: 'Mono-printing, relief printing, block printing, screen printing basics',
  },
  {
    notation: 'UK.KS2.ART.TEC.10',
    strand: 'Art and Design Techniques',
    description: 'explore collage and mixed media techniques',
    isStatutory: true,
    guidance: 'Combining materials, layering, and creating texture through collage',
  },
  {
    notation: 'UK.KS2.ART.TEC.11',
    strand: 'Art and Design Techniques',
    description: 'explore textile and fabric techniques',
    isStatutory: true,
    guidance: 'Weaving, stitching, fabric printing, and textile design',
  },
  {
    notation: 'UK.KS2.ART.TEC.12',
    strand: 'Art and Design Techniques',
    description: 'explore digital art and design',
    isStatutory: true,
    guidance: 'Using digital tools for creating and manipulating images',
  },

  // ARTIST KNOWLEDGE (AKN)
  {
    notation: 'UK.KS2.ART.AKN.1',
    strand: 'Artist Knowledge',
    description: 'learn about great artists in history',
    isStatutory: true,
    guidance: 'Study significant artists from the Western canon and beyond',
  },
  {
    notation: 'UK.KS2.ART.AKN.2',
    strand: 'Artist Knowledge',
    description: 'learn about great architects in history',
    isStatutory: true,
    guidance: 'Introduction to architectural styles, famous buildings, and architects',
  },
  {
    notation: 'UK.KS2.ART.AKN.3',
    strand: 'Artist Knowledge',
    description: 'learn about great designers in history',
    isStatutory: true,
    guidance: 'Study designers across disciplines: product, graphic, fashion, industrial',
  },
  {
    notation: 'UK.KS2.ART.AKN.4',
    strand: 'Artist Knowledge',
    description: 'understand how artists reflect their time and place',
    isStatutory: true,
    guidance: 'Connect art movements to historical and cultural contexts',
  },
  {
    notation: 'UK.KS2.ART.AKN.5',
    strand: 'Artist Knowledge',
    description: 'compare artists from different periods and cultures',
    isStatutory: true,
    guidance: 'Analyse similarities and differences in style, technique, and subject matter',
  },
];

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// Art and design at KS3 develops critical understanding and technical proficiency
// =============================================================================

const ks3Standards: BritishNCArtDesignStandard[] = [
  // RECORDING OBSERVATIONS (OBS)
  {
    notation: 'UK.KS3.ART.OBS.1',
    strand: 'Recording Observations',
    description: 'use a range of techniques to record observations in sketchbooks',
    isStatutory: true,
    guidance: 'Drawing from life, annotation, photography, collected materials',
  },
  {
    notation: 'UK.KS3.ART.OBS.2',
    strand: 'Recording Observations',
    description: 'use journals and other media to record observations',
    isStatutory: true,
    guidance: 'Visual diaries, digital portfolios, mood boards',
  },
  {
    notation: 'UK.KS3.ART.OBS.3',
    strand: 'Recording Observations',
    description: 'use observations as a basis for exploring their ideas',
    isStatutory: true,
    guidance: 'Develop observational studies into creative outcomes',
  },

  // MEDIA AND TECHNIQUES (MED)
  {
    notation: 'UK.KS3.ART.MED.1',
    strand: 'Media and Techniques',
    description: 'use a range of techniques and media, including painting',
    isStatutory: true,
    guidance: 'Explore watercolour, acrylic, oil, and mixed media painting',
  },
  {
    notation: 'UK.KS3.ART.MED.2',
    strand: 'Media and Techniques',
    description: 'develop creative and imaginative approaches to art-making',
    isStatutory: true,
    guidance: 'Encourage experimentation and risk-taking in creative work',
  },
  {
    notation: 'UK.KS3.ART.MED.3',
    strand: 'Media and Techniques',
    description: 'explore lens-based and light-based media',
    isStatutory: true,
    guidance: 'Photography, film, digital imaging, projection',
  },
  {
    notation: 'UK.KS3.ART.MED.4',
    strand: 'Media and Techniques',
    description: 'explore three-dimensional work including sculpture and installation',
    isStatutory: true,
    guidance: 'Work at different scales, consider space and site',
  },

  // PROFICIENCY AND MATERIALS (PRO)
  {
    notation: 'UK.KS3.ART.PRO.1',
    strand: 'Proficiency and Materials',
    description: 'increase their proficiency in the handling of different materials',
    isStatutory: true,
    guidance: 'Develop technical skills and material knowledge',
  },
  {
    notation: 'UK.KS3.ART.PRO.2',
    strand: 'Proficiency and Materials',
    description: 'understand the properties and possibilities of different materials',
    isStatutory: true,
    guidance: 'How materials behave, their limitations and creative potential',
  },
  {
    notation: 'UK.KS3.ART.PRO.3',
    strand: 'Proficiency and Materials',
    description: 'select appropriate materials for creative intentions',
    isStatutory: true,
    guidance: 'Match materials to concept and desired outcome',
  },

  // ANALYSIS AND EVALUATION (EVA)
  {
    notation: 'UK.KS3.ART.EVA.1',
    strand: 'Analysis and Evaluation',
    description: 'analyse and evaluate their own work',
    isStatutory: true,
    guidance: 'Reflect on process, identify strengths, and areas for development',
  },
  {
    notation: 'UK.KS3.ART.EVA.2',
    strand: 'Analysis and Evaluation',
    description: 'analyse and evaluate the work of others',
    isStatutory: true,
    guidance: 'Critically discuss artwork using appropriate terminology',
  },
  {
    notation: 'UK.KS3.ART.EVA.3',
    strand: 'Analysis and Evaluation',
    description: 'strengthen the visual impact or applications of their work through evaluation',
    isStatutory: true,
    guidance: 'Use feedback and reflection to improve outcomes',
  },
  {
    notation: 'UK.KS3.ART.EVA.4',
    strand: 'Analysis and Evaluation',
    description: 'express reasoned judgements that can inform their own work',
    isStatutory: true,
    guidance: 'Articulate opinions and justify creative decisions',
  },

  // ART HISTORY (HIS)
  {
    notation: 'UK.KS3.ART.HIS.1',
    strand: 'Art History',
    description: 'learn about the history of art from ancient times to the present day',
    isStatutory: true,
    guidance: 'Survey of major periods, movements, and developments in art history',
  },
  {
    notation: 'UK.KS3.ART.HIS.2',
    strand: 'Art History',
    description: 'learn about the history of craft from ancient times to the present day',
    isStatutory: true,
    guidance: 'Ceramic, textile, metalwork, and other craft traditions',
  },
  {
    notation: 'UK.KS3.ART.HIS.3',
    strand: 'Art History',
    description: 'learn about the history of design from ancient times to the present day',
    isStatutory: true,
    guidance: 'Graphic design, product design, fashion design, interior design',
  },
  {
    notation: 'UK.KS3.ART.HIS.4',
    strand: 'Art History',
    description: 'learn about the history of architecture from ancient times to the present day',
    isStatutory: true,
    guidance: 'Architectural styles, significant buildings, and key architects',
  },
  {
    notation: 'UK.KS3.ART.HIS.5',
    strand: 'Art History',
    description: 'understand periods, styles and major movements in art history',
    isStatutory: true,
    guidance: 'Renaissance, Baroque, Impressionism, Modernism, Contemporary art',
  },
  {
    notation: 'UK.KS3.ART.HIS.6',
    strand: 'Art History',
    description: 'understand the cultural and historical contexts of artwork',
    isStatutory: true,
    guidance: 'How social, political, and economic factors influence art',
  },
];

// =============================================================================
// KEY STAGE 4 GCSE: YEARS 10-11 (Ages 14-16)
// GCSE Art and Design develops critical, practical and theoretical understanding
// Source: DfE GCSE Art and Design Subject Content (2015)
// =============================================================================

const ks4GCSEStandards: BritishNCArtDesignStandard[] = [
  // CRITICAL UNDERSTANDING (CRT)
  {
    notation: 'UK.KS4.ART.CRT.1',
    strand: 'Critical Understanding',
    description: 'develop a critical understanding of the work of artists, craftspeople and designers',
    isStatutory: true,
    guidance: 'Study a range of practitioners to inform and inspire personal work',
  },
  {
    notation: 'UK.KS4.ART.CRT.2',
    strand: 'Critical Understanding',
    description: 'develop a critical understanding of art movements, periods and styles',
    isStatutory: true,
    guidance: 'In-depth study of specific movements and their characteristics',
  },
  {
    notation: 'UK.KS4.ART.CRT.3',
    strand: 'Critical Understanding',
    description: 'understand how artists communicate ideas, feelings and meanings',
    isStatutory: true,
    guidance: 'Analyse visual language, symbolism, and artistic intention',
  },
  {
    notation: 'UK.KS4.ART.CRT.4',
    strand: 'Critical Understanding',
    description: 'develop understanding of the contexts in which art is created',
    isStatutory: true,
    guidance: 'Social, cultural, historical, and personal contexts',
  },

  // GENERATING IDEAS (GEN)
  {
    notation: 'UK.KS4.ART.GEN.1',
    strand: 'Generating Ideas',
    description: 'effectively develop ideas through creative and purposeful investigations',
    isStatutory: true,
    guidance: 'Research, experimentation, and exploration of themes',
  },
  {
    notation: 'UK.KS4.ART.GEN.2',
    strand: 'Generating Ideas',
    description: 'demonstrate analytical and cultural understanding through investigations',
    isStatutory: true,
    guidance: 'Connect research to broader cultural and artistic contexts',
  },
  {
    notation: 'UK.KS4.ART.GEN.3',
    strand: 'Generating Ideas',
    description: 'thoughtfully refine ideas through experimentation',
    isStatutory: true,
    guidance: 'Iterative development of concepts and visual solutions',
  },
  {
    notation: 'UK.KS4.ART.GEN.4',
    strand: 'Generating Ideas',
    description: 'select and use appropriate resources, media and materials',
    isStatutory: true,
    guidance: 'Match resources to creative intentions and project requirements',
  },

  // INVESTIGATION AND EXPERIMENTATION (INV)
  {
    notation: 'UK.KS4.ART.INV.1',
    strand: 'Investigation and Experimentation',
    description: 'demonstrate skills in practical investigation of techniques, processes and materials',
    isStatutory: true,
    guidance: 'Hands-on exploration and testing of methods',
  },
  {
    notation: 'UK.KS4.ART.INV.2',
    strand: 'Investigation and Experimentation',
    description: 'refine work through experimentation with techniques',
    isStatutory: true,
    guidance: 'Develop personal approaches through trial and refinement',
  },
  {
    notation: 'UK.KS4.ART.INV.3',
    strand: 'Investigation and Experimentation',
    description: 'document and record the creative journey',
    isStatutory: true,
    guidance: 'Portfolio development showing process and development',
  },

  // PRESENTATION AND REALISATION (PRE)
  {
    notation: 'UK.KS4.ART.PRE.1',
    strand: 'Presentation and Realisation',
    description: 'realise personal intentions through sustained practical work',
    isStatutory: true,
    guidance: 'Complete resolved outcomes that demonstrate skill and intention',
  },
  {
    notation: 'UK.KS4.ART.PRE.2',
    strand: 'Presentation and Realisation',
    description: 'present a personal response informed by meaningful engagement with sources',
    isStatutory: true,
    guidance: 'Connect final work to research and contextual understanding',
  },
  {
    notation: 'UK.KS4.ART.PRE.3',
    strand: 'Presentation and Realisation',
    description: 'demonstrate understanding of visual language through final outcomes',
    isStatutory: true,
    guidance: 'Apply formal elements and principles of design effectively',
  },

  // SPECIALIST AREAS (SPE)
  {
    notation: 'UK.KS4.ART.SPE.1',
    strand: 'Specialist Areas',
    description: 'work in one or more specialist area: fine art',
    isStatutory: false,
    specialistArea: 'Fine Art',
    guidance: 'Painting, drawing, mixed-media, sculpture, installation, printmaking, lens-based media',
  },
  {
    notation: 'UK.KS4.ART.SPE.2',
    strand: 'Specialist Areas',
    description: 'work in one or more specialist area: graphic communication',
    isStatutory: false,
    specialistArea: 'Graphic Communication',
    guidance: 'Illustration, advertising, packaging, design for print, multimedia, animation',
  },
  {
    notation: 'UK.KS4.ART.SPE.3',
    strand: 'Specialist Areas',
    description: 'work in one or more specialist area: textile design',
    isStatutory: false,
    specialistArea: 'Textile Design',
    guidance: 'Fashion design, fashion textiles, costume design, constructed textiles, printed textiles',
  },
  {
    notation: 'UK.KS4.ART.SPE.4',
    strand: 'Specialist Areas',
    description: 'work in one or more specialist area: three-dimensional design',
    isStatutory: false,
    specialistArea: 'Three-Dimensional Design',
    guidance: 'Product design, jewellery, body adornment, ceramics, theatre design',
  },
  {
    notation: 'UK.KS4.ART.SPE.5',
    strand: 'Specialist Areas',
    description: 'work in one or more specialist area: photography',
    isStatutory: false,
    specialistArea: 'Photography',
    guidance: 'Portraiture, landscape, documentary, experimental imagery, multimedia',
  },
];

// =============================================================================
// KEY STAGE 5 A-LEVEL: YEARS 12-13 (Ages 16-18)
// A-Level Art and Design requires integrated critical, practical and theoretical study
// Source: DfE GCE AS and A Level Art and Design Subject Content (2014)
// =============================================================================

const ks5ALevelYear1Standards: BritishNCArtDesignStandard[] = [
  // INTEGRATED STUDY (INT)
  {
    notation: 'UK.KS5.Y12.ART.INT.1',
    strand: 'Integrated Study',
    description: 'engage in integrated critical, practical and theoretical study',
    isStatutory: true,
    guidance: 'Connect making with research and contextual understanding',
  },
  {
    notation: 'UK.KS5.Y12.ART.INT.2',
    strand: 'Integrated Study',
    description: 'demonstrate understanding of the inter-relationship between practical work and contextual study',
    isStatutory: true,
    guidance: 'Show how research informs practical outcomes',
  },
  {
    notation: 'UK.KS5.Y12.ART.INT.3',
    strand: 'Integrated Study',
    description: 'develop knowledge and critical understanding through investigation',
    isStatutory: true,
    guidance: 'In-depth study of artists, movements, and concepts',
  },

  // CREATIVE CAPABILITIES (CAP)
  {
    notation: 'UK.KS5.Y12.ART.CAP.1',
    strand: 'Creative Capabilities',
    description: 'develop intellectual capabilities through art and design',
    isStatutory: true,
    guidance: 'Critical thinking, analysis, and problem-solving',
  },
  {
    notation: 'UK.KS5.Y12.ART.CAP.2',
    strand: 'Creative Capabilities',
    description: 'develop imaginative capabilities through art and design',
    isStatutory: true,
    guidance: 'Original thinking and creative visualisation',
  },
  {
    notation: 'UK.KS5.Y12.ART.CAP.3',
    strand: 'Creative Capabilities',
    description: 'develop creative and intuitive capabilities through art and design',
    isStatutory: true,
    guidance: 'Trust creative instincts while developing technical control',
  },
  {
    notation: 'UK.KS5.Y12.ART.CAP.4',
    strand: 'Creative Capabilities',
    description: 'investigate, analyse and evaluate images, objects and artefacts',
    isStatutory: true,
    guidance: 'Close reading of visual material with appropriate vocabulary',
  },

  // RESEARCH AND RESPONSE (RES)
  {
    notation: 'UK.KS5.Y12.ART.RES.1',
    strand: 'Research and Response',
    description: 'research and respond to the work of other artists, craftspeople and designers',
    isStatutory: true,
    guidance: 'Contextual study that informs personal practice',
  },
  {
    notation: 'UK.KS5.Y12.ART.RES.2',
    strand: 'Research and Response',
    description: 'understand how historical and contemporary contexts influence art and design',
    isStatutory: true,
    guidance: 'Social, cultural, political, and technological influences',
  },
  {
    notation: 'UK.KS5.Y12.ART.RES.3',
    strand: 'Research and Response',
    description: 'demonstrate understanding of the place of art in society',
    isStatutory: true,
    guidance: 'Art as communication, commentary, and cultural expression',
  },

  // PRACTICAL SKILLS (PRA)
  {
    notation: 'UK.KS5.Y12.ART.PRA.1',
    strand: 'Practical Skills',
    description: 'use a variety of media appropriately and safely',
    isStatutory: true,
    guidance: 'Health and safety awareness, appropriate tool use',
  },
  {
    notation: 'UK.KS5.Y12.ART.PRA.2',
    strand: 'Practical Skills',
    description: 'develop proficiency and mastery in chosen media',
    isStatutory: true,
    guidance: 'Specialist skill development in area of focus',
  },
  {
    notation: 'UK.KS5.Y12.ART.PRA.3',
    strand: 'Practical Skills',
    description: 'record experiences and observations in appropriate ways',
    isStatutory: true,
    guidance: 'Drawing, photography, annotation, digital recording',
  },
];

const ks5ALevelYear2Standards: BritishNCArtDesignStandard[] = [
  // PERSONAL INVESTIGATION (PER)
  {
    notation: 'UK.KS5.Y13.ART.PER.1',
    strand: 'Personal Investigation',
    description: 'develop and sustain a personal investigation in response to a given starting point',
    isStatutory: true,
    guidance: 'Extended project demonstrating creative journey',
  },
  {
    notation: 'UK.KS5.Y13.ART.PER.2',
    strand: 'Personal Investigation',
    description: 'demonstrate critical understanding through personal investigation',
    isStatutory: true,
    guidance: 'Written element connecting practice to contextual study',
  },
  {
    notation: 'UK.KS5.Y13.ART.PER.3',
    strand: 'Personal Investigation',
    description: 'show coherent development of ideas through investigation',
    isStatutory: true,
    guidance: 'Clear progression from initial ideas to resolved outcomes',
  },
  {
    notation: 'UK.KS5.Y13.ART.PER.4',
    strand: 'Personal Investigation',
    description: 'make connections between visual, written and other elements',
    isStatutory: true,
    guidance: 'Integrated portfolio with written analysis',
  },

  // EXTENDED PROJECT (EXT)
  {
    notation: 'UK.KS5.Y13.ART.EXT.1',
    strand: 'Extended Project',
    description: 'respond to an externally set assignment during a supervised period',
    isStatutory: true,
    guidance: 'Controlled assessment demonstrating independent working',
  },
  {
    notation: 'UK.KS5.Y13.ART.EXT.2',
    strand: 'Extended Project',
    description: 'prepare for the externally set assignment through development of ideas',
    isStatutory: true,
    guidance: 'Preparatory period for research and planning',
  },
  {
    notation: 'UK.KS5.Y13.ART.EXT.3',
    strand: 'Extended Project',
    description: 'realise intentions in the supervised time',
    isStatutory: true,
    guidance: 'Complete final outcome(s) during exam period',
  },

  // ADVANCED CRITICAL UNDERSTANDING (CRT)
  {
    notation: 'UK.KS5.Y13.ART.CRT.1',
    strand: 'Critical Understanding',
    description: 'articulate and justify a personal viewpoint on artwork',
    isStatutory: true,
    guidance: 'Sophisticated critical writing and verbal analysis',
  },
  {
    notation: 'UK.KS5.Y13.ART.CRT.2',
    strand: 'Critical Understanding',
    description: 'understand and apply appropriate specialist terminology',
    isStatutory: true,
    guidance: 'Use of art-specific vocabulary in analysis and discussion',
  },
  {
    notation: 'UK.KS5.Y13.ART.CRT.3',
    strand: 'Critical Understanding',
    description: 'evaluate and reflect on own progress and development',
    isStatutory: true,
    guidance: 'Self-assessment and target setting',
  },

  // ADVANCED PRACTICE (PRA)
  {
    notation: 'UK.KS5.Y13.ART.PRA.1',
    strand: 'Advanced Practice',
    description: 'demonstrate mastery of techniques, processes and materials',
    isStatutory: true,
    guidance: 'Technical excellence in chosen area(s)',
  },
  {
    notation: 'UK.KS5.Y13.ART.PRA.2',
    strand: 'Advanced Practice',
    description: 'show originality and creative risk-taking',
    isStatutory: true,
    guidance: 'Personal voice and innovative approaches',
  },
  {
    notation: 'UK.KS5.Y13.ART.PRA.3',
    strand: 'Advanced Practice',
    description: 'present work professionally and appropriately',
    isStatutory: true,
    guidance: 'Consider display, curation, and audience',
  },
];

// =============================================================================
// YEAR-SPECIFIC STANDARDS GENERATION
// Generate year-specific standards from Key Stage standards
// =============================================================================

function generateYearStandards(
  ksStandards: BritishNCArtDesignStandard[],
  year: number,
  keyStage: number
): BritishNCArtDesignStandard[] {
  return ksStandards.map((standard) => ({
    ...standard,
    notation: standard.notation.replace(
      `UK.KS${keyStage}.ART`,
      `UK.KS${keyStage}.Y${year}.ART`
    ),
  }));
}

// Year 1 (KS1)
const year1Standards = generateYearStandards(ks1Standards, 1, 1);

// Year 2 (KS1)
const year2Standards = generateYearStandards(ks1Standards, 2, 1);

// Year 3 (KS2)
const year3Standards = generateYearStandards(ks2Standards, 3, 2);

// Year 4 (KS2)
const year4Standards = generateYearStandards(ks2Standards, 4, 2);

// Year 5 (KS2)
const year5Standards = generateYearStandards(ks2Standards, 5, 2);

// Year 6 (KS2)
const year6Standards = generateYearStandards(ks2Standards, 6, 2);

// Year 7 (KS3)
const year7Standards = generateYearStandards(ks3Standards, 7, 3);

// Year 8 (KS3)
const year8Standards = generateYearStandards(ks3Standards, 8, 3);

// Year 9 (KS3)
const year9Standards = generateYearStandards(ks3Standards, 9, 3);

// Year 10 (KS4 GCSE)
const year10Standards = generateYearStandards(ks4GCSEStandards, 10, 4);

// Year 11 (KS4 GCSE)
const year11Standards = generateYearStandards(ks4GCSEStandards, 11, 4);

// Year 12 and 13 (KS5 A-Level) - use direct standards
const year12Standards = ks5ALevelYear1Standards;
const year13Standards = ks5ALevelYear2Standards;

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const britishArtDesignCurriculum: BritishNCArtDesignCurriculum = {
  code: 'UK_NC_ART',
  name: 'British National Curriculum - Art and Design',
  country: 'United Kingdom',
  version: '2014-2015', // NC 2014, GCSE 2015, A-Level 2014
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-art-and-design-programmes-of-study',
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
    { year: 13, keyStage: 5, ageRangeMin: 17, ageRangeMax: 18, standards: year13Standards },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get standards for a specific year (1-13)
 */
export function getBritishArtDesignStandardsByYear(year: number): BritishNCArtDesignStandard[] {
  const yearData = britishArtDesignCurriculum.years.find((y) => y.year === year);
  return yearData?.standards ?? [];
}

/**
 * Get standards for a specific Key Stage (1-5)
 */
export function getBritishArtDesignStandardsByKeyStage(keyStage: number): BritishNCArtDesignStandard[] {
  return britishArtDesignCurriculum.years
    .filter((y) => y.keyStage === keyStage)
    .flatMap((y) => y.standards);
}

/**
 * Get standards by strand across all years
 */
export function getBritishArtDesignStandardsByStrand(strand: string): BritishNCArtDesignStandard[] {
  return britishArtDesignCurriculum.years.flatMap((year) =>
    year.standards.filter((s) => s.strand.toLowerCase().includes(strand.toLowerCase()))
  );
}

/**
 * Get all specialist area standards (GCSE)
 */
export function getBritishArtDesignSpecialistAreas(): BritishNCArtDesignStandard[] {
  return britishArtDesignCurriculum.years
    .filter((y) => y.keyStage === 4)
    .flatMap((y) => y.standards.filter((s) => s.specialistArea));
}

/**
 * Get total standard count
 */
export function getBritishArtDesignStandardCount(): number {
  return britishArtDesignCurriculum.years.reduce(
    (total, year) => total + year.standards.length,
    0
  );
}
