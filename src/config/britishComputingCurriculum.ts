/**
 * British National Curriculum - Computing Standards
 * Years 1-13 (Key Stages 1-5)
 *
 * Sources:
 * - KS1-3 (Years 1-9): GOV.UK National Curriculum in England
 *   https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study
 * - KS4 (Years 10-11 GCSE): DfE GCSE Computer Science Subject Content (2025)
 *   https://www.gov.uk/government/publications/gcse-computer-science
 * - KS5 (Years 12-13 A-Level): DfE GCE AS and A Level Computer Science
 *   https://www.gov.uk/government/publications/gce-as-and-a-level-for-computer-science
 *
 * VERIFIED: 2026-01-26 against official DfE documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.COM.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1-5)
 * - Y = Year (1-13)
 * - COM = Computing
 *
 * Strand codes by Key Stage:
 *
 * KS1-2 (Years 1-6):
 *   - ALG = Algorithms
 *   - PRG = Programming
 *   - LOG = Logical Reasoning
 *   - DIG = Digital Literacy
 *   - SAF = Online Safety
 *   - NET = Networks (KS2)
 *
 * KS3 (Years 7-9):
 *   - ABS = Computational Abstractions
 *   - ALG = Algorithms
 *   - PRG = Programming Languages
 *   - BOL = Boolean Logic and Binary
 *   - SYS = Systems and Architecture
 *   - CRE = Creative Projects
 *   - SAF = Online Safety and Security
 *
 * KS4 GCSE (Years 10-11):
 *   - ALG = Algorithms
 *   - DAT = Data Representation
 *   - SYS = Systems Architecture
 *   - NET = Networks
 *   - SEC = Cyber Security
 *   - PRG = Programming
 *   - ETH = Ethics and Impacts
 *
 * KS5 A-Level (Years 12-13):
 *   - PRG = Advanced Programming
 *   - DSA = Data Structures and Algorithms
 *   - ARC = Computer Architecture
 *   - NET = Networking and Web
 *   - DBS = Databases
 *   - THE = Theory of Computation
 *   - PRJ = Programming Project
 */

export interface BritishNCComputingStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
  skillLevel?: 'knowledge' | 'skill' | 'both';
}

export interface BritishNCComputingYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCComputingStandard[];
}

export interface BritishNCComputingCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCComputingYear[];
}

// =============================================================================
// KEY STAGE 1: YEARS 1-2 (Ages 5-7)
// Computing at KS1 focuses on understanding algorithms and basic programming
// =============================================================================

const ks1Standards: BritishNCComputingStandard[] = [
  // ALGORITHMS (ALG)
  {
    notation: 'UK.KS1.COM.ALG.1',
    strand: 'Algorithms',
    description: 'understand what algorithms are',
    isStatutory: true,
    guidance: 'An algorithm is a precise set of instructions or rules to solve a problem or accomplish a task',
  },
  {
    notation: 'UK.KS1.COM.ALG.2',
    strand: 'Algorithms',
    description: 'understand how algorithms are implemented as programs on digital devices',
    isStatutory: true,
    guidance: 'Link algorithms to programs that run on computers, tablets, and other devices',
  },
  {
    notation: 'UK.KS1.COM.ALG.3',
    strand: 'Algorithms',
    description: 'understand that programs execute by following precise and unambiguous instructions',
    isStatutory: true,
    guidance: 'Computers follow instructions exactly as written - they cannot guess what you mean',
  },

  // PROGRAMMING (PRG)
  {
    notation: 'UK.KS1.COM.PRG.1',
    strand: 'Programming',
    description: 'create simple programs',
    isStatutory: true,
    guidance: 'Use age-appropriate programming environments like Scratch Jr, Bee-Bots, or similar tools',
  },
  {
    notation: 'UK.KS1.COM.PRG.2',
    strand: 'Programming',
    description: 'debug simple programs',
    isStatutory: true,
    guidance: 'Find and fix errors in programs - understanding that mistakes can be corrected',
  },

  // LOGICAL REASONING (LOG)
  {
    notation: 'UK.KS1.COM.LOG.1',
    strand: 'Logical Reasoning',
    description: 'use logical reasoning to predict the behaviour of simple programs',
    isStatutory: true,
    guidance: 'Think through what a program will do before running it - making predictions',
  },

  // DIGITAL LITERACY (DIG)
  {
    notation: 'UK.KS1.COM.DIG.1',
    strand: 'Digital Literacy',
    description: 'use technology purposefully to create digital content',
    isStatutory: true,
    guidance: 'Creating pictures, stories, or other content using computers and tablets',
  },
  {
    notation: 'UK.KS1.COM.DIG.2',
    strand: 'Digital Literacy',
    description: 'use technology purposefully to organise digital content',
    isStatutory: true,
    guidance: 'Saving work in appropriate places, naming files sensibly',
  },
  {
    notation: 'UK.KS1.COM.DIG.3',
    strand: 'Digital Literacy',
    description: 'use technology purposefully to store and retrieve digital content',
    isStatutory: true,
    guidance: 'Saving work and finding it again later',
  },
  {
    notation: 'UK.KS1.COM.DIG.4',
    strand: 'Digital Literacy',
    description: 'use technology purposefully to manipulate digital content',
    isStatutory: true,
    guidance: 'Editing and changing digital work - text, images, sounds',
  },
  {
    notation: 'UK.KS1.COM.DIG.5',
    strand: 'Digital Literacy',
    description: 'recognise common uses of information technology beyond school',
    isStatutory: true,
    guidance: 'Understanding how computers are used in shops, hospitals, homes, and other places',
  },

  // ONLINE SAFETY (SAF)
  {
    notation: 'UK.KS1.COM.SAF.1',
    strand: 'Online Safety',
    description: 'use technology safely and respectfully',
    isStatutory: true,
    guidance: 'Being kind online and treating technology with care',
  },
  {
    notation: 'UK.KS1.COM.SAF.2',
    strand: 'Online Safety',
    description: 'keep personal information private',
    isStatutory: true,
    guidance: 'Not sharing names, addresses, school names, or photos without permission',
  },
  {
    notation: 'UK.KS1.COM.SAF.3',
    strand: 'Online Safety',
    description: 'identify where to go for help and support when they have concerns about content or contact on the internet or other online technologies',
    isStatutory: true,
    guidance: 'Knowing to tell a trusted adult if something online makes them worried or uncomfortable',
  },
];

// =============================================================================
// KEY STAGE 2: YEARS 3-6 (Ages 7-11)
// Computing at KS2 develops programming skills and introduces networks
// =============================================================================

const ks2Standards: BritishNCComputingStandard[] = [
  // PROGRAMMING (PRG)
  {
    notation: 'UK.KS2.COM.PRG.1',
    strand: 'Programming',
    description: 'design programs that accomplish specific goals',
    isStatutory: true,
    guidance: 'Planning what a program should do before writing it',
  },
  {
    notation: 'UK.KS2.COM.PRG.2',
    strand: 'Programming',
    description: 'write programs that accomplish specific goals, including controlling or simulating physical systems',
    isStatutory: true,
    guidance: 'Programs that control devices or model real-world systems',
  },
  {
    notation: 'UK.KS2.COM.PRG.3',
    strand: 'Programming',
    description: 'debug programs that accomplish specific goals',
    isStatutory: true,
    guidance: 'Finding and fixing errors in more complex programs',
  },
  {
    notation: 'UK.KS2.COM.PRG.4',
    strand: 'Programming',
    description: 'solve problems by decomposing them into smaller parts',
    isStatutory: true,
    guidance: 'Breaking big problems into smaller, manageable steps',
  },
  {
    notation: 'UK.KS2.COM.PRG.5',
    strand: 'Programming',
    description: 'use sequence in programs',
    isStatutory: true,
    guidance: 'Instructions that run one after another in order',
  },
  {
    notation: 'UK.KS2.COM.PRG.6',
    strand: 'Programming',
    description: 'use selection in programs',
    isStatutory: true,
    guidance: 'Using if/then/else to make decisions in programs',
  },
  {
    notation: 'UK.KS2.COM.PRG.7',
    strand: 'Programming',
    description: 'use repetition in programs',
    isStatutory: true,
    guidance: 'Using loops to repeat instructions',
  },
  {
    notation: 'UK.KS2.COM.PRG.8',
    strand: 'Programming',
    description: 'work with variables in programs',
    isStatutory: true,
    guidance: 'Storing and using data that can change during program execution',
  },
  {
    notation: 'UK.KS2.COM.PRG.9',
    strand: 'Programming',
    description: 'work with various forms of input and output in programs',
    isStatutory: true,
    guidance: 'Getting information into programs and displaying results',
  },

  // LOGICAL REASONING (LOG)
  {
    notation: 'UK.KS2.COM.LOG.1',
    strand: 'Logical Reasoning',
    description: 'use logical reasoning to explain how some simple algorithms work',
    isStatutory: true,
    guidance: 'Being able to trace through and explain what an algorithm does',
  },
  {
    notation: 'UK.KS2.COM.LOG.2',
    strand: 'Logical Reasoning',
    description: 'use logical reasoning to detect errors in algorithms',
    isStatutory: true,
    guidance: 'Finding mistakes by thinking through the logic',
  },
  {
    notation: 'UK.KS2.COM.LOG.3',
    strand: 'Logical Reasoning',
    description: 'use logical reasoning to correct errors in algorithms and programs',
    isStatutory: true,
    guidance: 'Fixing errors once they have been found',
  },

  // NETWORKS (NET)
  {
    notation: 'UK.KS2.COM.NET.1',
    strand: 'Networks',
    description: 'understand computer networks, including the internet',
    isStatutory: true,
    guidance: 'How computers connect and share information',
  },
  {
    notation: 'UK.KS2.COM.NET.2',
    strand: 'Networks',
    description: 'understand how networks can provide multiple services, such as the World Wide Web',
    isStatutory: true,
    guidance: 'Different services available over the internet - web, email, etc.',
  },
  {
    notation: 'UK.KS2.COM.NET.3',
    strand: 'Networks',
    description: 'understand the opportunities networks offer for communication and collaboration',
    isStatutory: true,
    guidance: 'How people use networks to work together and communicate',
  },

  // DIGITAL LITERACY (DIG)
  {
    notation: 'UK.KS2.COM.DIG.1',
    strand: 'Digital Literacy',
    description: 'use search technologies effectively',
    isStatutory: true,
    guidance: 'Finding information using search engines with appropriate keywords',
  },
  {
    notation: 'UK.KS2.COM.DIG.2',
    strand: 'Digital Literacy',
    description: 'appreciate how search results are selected and ranked',
    isStatutory: true,
    guidance: 'Understanding that search results are ordered by relevance and other factors',
  },
  {
    notation: 'UK.KS2.COM.DIG.3',
    strand: 'Digital Literacy',
    description: 'be discerning in evaluating digital content',
    isStatutory: true,
    guidance: 'Thinking critically about whether online information is reliable and accurate',
  },
  {
    notation: 'UK.KS2.COM.DIG.4',
    strand: 'Digital Literacy',
    description: 'select, use and combine a variety of software on a range of digital devices',
    isStatutory: true,
    guidance: 'Choosing appropriate tools and using them together',
  },
  {
    notation: 'UK.KS2.COM.DIG.5',
    strand: 'Digital Literacy',
    description: 'design and create a range of programs, systems and content that accomplish given goals',
    isStatutory: true,
    guidance: 'Creating digital solutions to problems',
  },
  {
    notation: 'UK.KS2.COM.DIG.6',
    strand: 'Digital Literacy',
    description: 'collect, analyse, evaluate and present data and information',
    isStatutory: true,
    guidance: 'Working with data - gathering, understanding, and presenting findings',
  },

  // ONLINE SAFETY (SAF)
  {
    notation: 'UK.KS2.COM.SAF.1',
    strand: 'Online Safety',
    description: 'use technology safely, respectfully and responsibly',
    isStatutory: true,
    guidance: 'Good digital citizenship - being safe and kind online',
  },
  {
    notation: 'UK.KS2.COM.SAF.2',
    strand: 'Online Safety',
    description: 'recognise acceptable and unacceptable behaviour online',
    isStatutory: true,
    guidance: 'Understanding what is appropriate and inappropriate online',
  },
  {
    notation: 'UK.KS2.COM.SAF.3',
    strand: 'Online Safety',
    description: 'identify a range of ways to report concerns about content and contact',
    isStatutory: true,
    guidance: 'Knowing multiple ways to report problems - adults, CEOP button, platform reporting',
  },
];

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// Computing at KS3 develops computational thinking and multiple programming languages
// =============================================================================

const ks3Standards: BritishNCComputingStandard[] = [
  // COMPUTATIONAL ABSTRACTIONS (ABS)
  {
    notation: 'UK.KS3.COM.ABS.1',
    strand: 'Computational Abstractions',
    description: 'design computational abstractions that model the state and behaviour of real-world problems and physical systems',
    isStatutory: true,
    guidance: 'Creating models that represent real things in code',
  },
  {
    notation: 'UK.KS3.COM.ABS.2',
    strand: 'Computational Abstractions',
    description: 'use computational abstractions that model the state and behaviour of real-world problems',
    isStatutory: true,
    guidance: 'Working with models to solve problems',
  },
  {
    notation: 'UK.KS3.COM.ABS.3',
    strand: 'Computational Abstractions',
    description: 'evaluate computational abstractions',
    isStatutory: true,
    guidance: 'Assessing how well a model represents reality',
  },

  // ALGORITHMS (ALG)
  {
    notation: 'UK.KS3.COM.ALG.1',
    strand: 'Algorithms',
    description: 'understand several key algorithms that reflect computational thinking, such as ones for sorting and searching',
    isStatutory: true,
    guidance: 'Learning standard algorithms like bubble sort, merge sort, linear and binary search',
  },
  {
    notation: 'UK.KS3.COM.ALG.2',
    strand: 'Algorithms',
    description: 'use logical reasoning to compare the utility of alternative algorithms for the same problem',
    isStatutory: true,
    guidance: 'Comparing algorithms for efficiency, readability, and suitability',
  },

  // PROGRAMMING LANGUAGES (PRG)
  {
    notation: 'UK.KS3.COM.PRG.1',
    strand: 'Programming Languages',
    description: 'use two or more programming languages, at least one of which is textual, to solve a variety of computational problems',
    isStatutory: true,
    guidance: 'Experience with both block-based (Scratch) and text-based (Python) languages',
  },
  {
    notation: 'UK.KS3.COM.PRG.2',
    strand: 'Programming Languages',
    description: 'make appropriate use of data structures such as lists, tables, or arrays',
    isStatutory: true,
    guidance: 'Understanding and using structured ways to store data',
  },
  {
    notation: 'UK.KS3.COM.PRG.3',
    strand: 'Programming Languages',
    description: 'design and develop modular programs that use procedures or functions',
    isStatutory: true,
    guidance: 'Breaking programs into reusable parts',
  },

  // BOOLEAN LOGIC AND BINARY (BOL)
  {
    notation: 'UK.KS3.COM.BOL.1',
    strand: 'Boolean Logic and Binary',
    description: 'understand simple Boolean logic, including AND, OR and NOT',
    isStatutory: true,
    guidance: 'Logic gates and their truth tables',
  },
  {
    notation: 'UK.KS3.COM.BOL.2',
    strand: 'Boolean Logic and Binary',
    description: 'understand uses of Boolean logic in circuits and programming',
    isStatutory: true,
    guidance: 'How logic is used in both hardware and software',
  },
  {
    notation: 'UK.KS3.COM.BOL.3',
    strand: 'Boolean Logic and Binary',
    description: 'understand how numbers can be represented in binary',
    isStatutory: true,
    guidance: 'Base-2 number system and its importance in computing',
  },
  {
    notation: 'UK.KS3.COM.BOL.4',
    strand: 'Boolean Logic and Binary',
    description: 'carry out simple operations on binary numbers, including binary addition and conversion between binary and decimal',
    isStatutory: true,
    guidance: 'Practical skills in working with binary numbers',
  },

  // SYSTEMS AND ARCHITECTURE (SYS)
  {
    notation: 'UK.KS3.COM.SYS.1',
    strand: 'Systems and Architecture',
    description: 'understand the hardware and software components that make up computer systems',
    isStatutory: true,
    guidance: 'CPU, memory, storage, operating systems, applications',
  },
  {
    notation: 'UK.KS3.COM.SYS.2',
    strand: 'Systems and Architecture',
    description: 'understand how hardware and software components communicate with one another and with other systems',
    isStatutory: true,
    guidance: 'Buses, interfaces, protocols, APIs',
  },
  {
    notation: 'UK.KS3.COM.SYS.3',
    strand: 'Systems and Architecture',
    description: 'understand how instructions are stored and executed within a computer system',
    isStatutory: true,
    guidance: 'Fetch-decode-execute cycle, machine code basics',
  },
  {
    notation: 'UK.KS3.COM.SYS.4',
    strand: 'Systems and Architecture',
    description: 'understand how data of various types can be represented and manipulated digitally, including text, sounds, and pictures',
    isStatutory: true,
    guidance: 'Digital representation of different media types',
  },

  // CREATIVE PROJECTS (CRE)
  {
    notation: 'UK.KS3.COM.CRE.1',
    strand: 'Creative Projects',
    description: 'undertake creative projects that involve selecting, using, and combining multiple applications',
    isStatutory: true,
    guidance: 'Integrating different tools to create meaningful outcomes',
  },
  {
    notation: 'UK.KS3.COM.CRE.2',
    strand: 'Creative Projects',
    description: 'undertake creative projects preferably across a range of devices',
    isStatutory: true,
    guidance: 'Working with different platforms - mobile, desktop, embedded',
  },
  {
    notation: 'UK.KS3.COM.CRE.3',
    strand: 'Creative Projects',
    description: 'achieve challenging goals, including collecting and analysing data and meeting the needs of known users',
    isStatutory: true,
    guidance: 'User-centered design and data-driven projects',
  },
  {
    notation: 'UK.KS3.COM.CRE.4',
    strand: 'Creative Projects',
    description: 'create, reuse, revise and repurpose digital artefacts for a given audience',
    isStatutory: true,
    guidance: 'Understanding audience and purpose in digital creation',
  },
  {
    notation: 'UK.KS3.COM.CRE.5',
    strand: 'Creative Projects',
    description: 'create digital artefacts with attention to trustworthiness, design, and usability',
    isStatutory: true,
    guidance: 'Quality considerations in digital products',
  },

  // ONLINE SAFETY AND SECURITY (SAF)
  {
    notation: 'UK.KS3.COM.SAF.1',
    strand: 'Online Safety and Security',
    description: 'understand a range of ways to use technology safely, respectfully, responsibly and securely',
    isStatutory: true,
    guidance: 'Comprehensive digital citizenship and security practices',
  },
  {
    notation: 'UK.KS3.COM.SAF.2',
    strand: 'Online Safety and Security',
    description: 'protect online identity and privacy',
    isStatutory: true,
    guidance: 'Managing digital footprint, privacy settings, personal data',
  },
  {
    notation: 'UK.KS3.COM.SAF.3',
    strand: 'Online Safety and Security',
    description: 'recognise inappropriate content, contact and conduct',
    isStatutory: true,
    guidance: 'Identifying and avoiding harmful online situations',
  },
  {
    notation: 'UK.KS3.COM.SAF.4',
    strand: 'Online Safety and Security',
    description: 'know how to report concerns',
    isStatutory: true,
    guidance: 'Effective reporting through appropriate channels',
  },
];

// =============================================================================
// KEY STAGE 4 GCSE: YEARS 10-11 (Ages 14-16)
// GCSE Computer Science - academic study of computer science principles
// Source: DfE GCSE Computer Science Subject Content (2025)
// =============================================================================

const ks4GCSEStandards: BritishNCComputingStandard[] = [
  // ALGORITHMS (ALG)
  {
    notation: 'UK.KS4.COM.ALG.1',
    strand: 'Algorithms',
    description: 'understand standard algorithms, including binary search and merge sort',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Detailed understanding of how these algorithms work and their efficiency',
  },
  {
    notation: 'UK.KS4.COM.ALG.2',
    strand: 'Algorithms',
    description: 'follow and write algorithms using sequence, selection and iteration',
    isStatutory: true,
    skillLevel: 'both',
    guidance: 'Reading and creating algorithms using all control structures',
  },
  {
    notation: 'UK.KS4.COM.ALG.3',
    strand: 'Algorithms',
    description: 'follow and write algorithms using input, processing and output',
    isStatutory: true,
    skillLevel: 'both',
    guidance: 'Understanding the flow of data through a program',
  },
  {
    notation: 'UK.KS4.COM.ALG.4',
    strand: 'Algorithms',
    description: 'understand how particular programs and algorithms work',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Trace execution and explain purpose of given code',
  },
  {
    notation: 'UK.KS4.COM.ALG.5',
    strand: 'Algorithms',
    description: 'take a systematic approach to problem solving including decomposition and abstraction',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Computational thinking skills applied to problem solving',
  },
  {
    notation: 'UK.KS4.COM.ALG.6',
    strand: 'Algorithms',
    description: 'make use of conventions including pseudo code and flowcharts',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Representing algorithms in standard notations',
  },
  {
    notation: 'UK.KS4.COM.ALG.7',
    strand: 'Algorithms',
    description: 'evaluate the fitness for purpose of algorithms using logical reasoning and test data',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Assessing algorithm correctness and suitability',
  },

  // DATA REPRESENTATION (DAT)
  {
    notation: 'UK.KS4.COM.DAT.1',
    strand: 'Data Representation',
    description: 'understand the concept of data type, including integer, Boolean, real, character and string',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Different types of data and their properties',
  },
  {
    notation: 'UK.KS4.COM.DAT.2',
    strand: 'Data Representation',
    description: 'understand data structures, including records and one- and two-dimensional arrays',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Structured ways of organizing data',
  },
  {
    notation: 'UK.KS4.COM.DAT.3',
    strand: 'Data Representation',
    description: 'understand representation of numbers in binary and hexadecimal',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Number bases used in computing',
  },
  {
    notation: 'UK.KS4.COM.DAT.4',
    strand: 'Data Representation',
    description: 'perform conversion between binary, hexadecimal and decimal',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Converting numbers between different bases',
  },
  {
    notation: 'UK.KS4.COM.DAT.5',
    strand: 'Data Representation',
    description: 'perform binary addition and shifts',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Arithmetic operations on binary numbers',
  },
  {
    notation: 'UK.KS4.COM.DAT.6',
    strand: 'Data Representation',
    description: 'understand representation of text, sound, and graphics',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'How different media types are stored digitally',
  },
  {
    notation: 'UK.KS4.COM.DAT.7',
    strand: 'Data Representation',
    description: 'understand Boolean logic using AND, OR and NOT, combinations of these, and truth tables',
    isStatutory: true,
    skillLevel: 'both',
    guidance: 'Logic operations and their application in programming',
  },

  // SYSTEMS ARCHITECTURE (SYS)
  {
    notation: 'UK.KS4.COM.SYS.1',
    strand: 'Systems Architecture',
    description: 'understand the purpose and functionality of systems software, including the operating system and utility software',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Role of system software in managing hardware and resources',
  },
  {
    notation: 'UK.KS4.COM.SYS.2',
    strand: 'Systems Architecture',
    description: 'understand CPU architecture, and the role of components in the fetch-execute cycle',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'ALU, control unit, registers, and how instructions are processed',
  },
  {
    notation: 'UK.KS4.COM.SYS.3',
    strand: 'Systems Architecture',
    description: 'understand main and contemporary secondary storage and ways of storing data on devices',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'RAM, ROM, HDD, SSD, optical, magnetic storage',
  },
  {
    notation: 'UK.KS4.COM.SYS.4',
    strand: 'Systems Architecture',
    description: 'understand data capacity and calculation of data capacity requirements',
    isStatutory: true,
    skillLevel: 'both',
    guidance: 'Bits, bytes, and calculating storage needs',
  },
  {
    notation: 'UK.KS4.COM.SYS.5',
    strand: 'Systems Architecture',
    description: 'understand hardware components and embedded systems',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Physical components and purpose-built computing systems',
  },
  {
    notation: 'UK.KS4.COM.SYS.6',
    strand: 'Systems Architecture',
    description: 'understand characteristics and purpose of different levels of programming language, including low-level language',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Machine code, assembly language, high-level languages',
  },

  // NETWORKS (NET)
  {
    notation: 'UK.KS4.COM.NET.1',
    strand: 'Networks',
    description: 'understand the importance of connectivity, both wired and wireless',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Different connection methods and their characteristics',
  },
  {
    notation: 'UK.KS4.COM.NET.2',
    strand: 'Networks',
    description: 'understand types of network',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'LAN, WAN, client-server, peer-to-peer',
  },
  {
    notation: 'UK.KS4.COM.NET.3',
    strand: 'Networks',
    description: 'understand network security',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Firewalls, encryption, authentication, access control',
  },
  {
    notation: 'UK.KS4.COM.NET.4',
    strand: 'Networks',
    description: 'understand the concept of networking protocols',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'TCP/IP, HTTP, HTTPS, FTP and their purposes',
  },
  {
    notation: 'UK.KS4.COM.NET.5',
    strand: 'Networks',
    description: 'understand network layers',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Layered approach to networking (OSI/TCP-IP models)',
  },

  // CYBER SECURITY (SEC)
  {
    notation: 'UK.KS4.COM.SEC.1',
    strand: 'Cyber Security',
    description: 'understand forms of attack based on technical weaknesses',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Malware, SQL injection, DDoS, brute force attacks',
  },
  {
    notation: 'UK.KS4.COM.SEC.2',
    strand: 'Cyber Security',
    description: 'understand forms of attack based on behaviour',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Social engineering, phishing, shoulder surfing',
  },
  {
    notation: 'UK.KS4.COM.SEC.3',
    strand: 'Cyber Security',
    description: 'understand methods of identifying vulnerabilities',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Penetration testing, vulnerability scanning',
  },
  {
    notation: 'UK.KS4.COM.SEC.4',
    strand: 'Cyber Security',
    description: 'understand ways to protect software systems during design, creation, testing, and use',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Secure coding practices, testing strategies, updates',
  },
  {
    notation: 'UK.KS4.COM.SEC.5',
    strand: 'Cyber Security',
    description: 'use appropriate security techniques, including validation and authentication',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Implementing security measures in code',
  },

  // PROGRAMMING (PRG)
  {
    notation: 'UK.KS4.COM.PRG.1',
    strand: 'Programming',
    description: 'design, write, test and refine programs using one or more high-level programming languages with textual definition',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Full development cycle using languages like Python',
  },
  {
    notation: 'UK.KS4.COM.PRG.2',
    strand: 'Programming',
    description: 'develop programs to a specification or to solve a problem',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Requirements analysis and implementation',
  },
  {
    notation: 'UK.KS4.COM.PRG.3',
    strand: 'Programming',
    description: 'use abstraction to model selected aspects of the external world in a program',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Creating appropriate representations in code',
  },
  {
    notation: 'UK.KS4.COM.PRG.4',
    strand: 'Programming',
    description: 'structure programs into modular parts with clear, well-documented interfaces',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Functions, procedures, modules, documentation',
  },
  {
    notation: 'UK.KS4.COM.PRG.5',
    strand: 'Programming',
    description: 'apply computing-related mathematics',
    isStatutory: true,
    skillLevel: 'skill',
    guidance: 'Mathematical operations relevant to programming',
  },

  // ETHICS AND IMPACTS (ETH)
  {
    notation: 'UK.KS4.COM.ETH.1',
    strand: 'Ethics and Impacts',
    description: 'understand the ethical impacts of digital technology on wider society',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'AI ethics, automation, digital divide',
  },
  {
    notation: 'UK.KS4.COM.ETH.2',
    strand: 'Ethics and Impacts',
    description: 'understand the legal impacts of digital technology on wider society',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Data protection, computer misuse, copyright',
  },
  {
    notation: 'UK.KS4.COM.ETH.3',
    strand: 'Ethics and Impacts',
    description: 'understand the environmental impacts of digital technology on wider society',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'E-waste, energy consumption, sustainability',
  },
  {
    notation: 'UK.KS4.COM.ETH.4',
    strand: 'Ethics and Impacts',
    description: 'understand issues of privacy and cyber security',
    isStatutory: true,
    skillLevel: 'knowledge',
    guidance: 'Personal data protection, surveillance, security trade-offs',
  },
];

// =============================================================================
// KEY STAGE 5 A-LEVEL: YEARS 12-13 (Ages 16-18)
// A-Level Computer Science - advanced study preparing for higher education
// Source: DfE GCE AS and A Level Computer Science Subject Content (2014)
// =============================================================================

const ks5ALevelYear1Standards: BritishNCComputingStandard[] = [
  // ADVANCED PROGRAMMING (PRG)
  {
    notation: 'UK.KS5.Y12.COM.PRG.1',
    strand: 'Advanced Programming',
    description: 'understand and apply the principles of procedural programming',
    isStatutory: true,
    guidance: 'Procedures, functions, parameters, scope, recursion',
  },
  {
    notation: 'UK.KS5.Y12.COM.PRG.2',
    strand: 'Advanced Programming',
    description: 'understand and apply the principles of object-oriented programming',
    isStatutory: true,
    guidance: 'Classes, objects, inheritance, polymorphism, encapsulation',
  },
  {
    notation: 'UK.KS5.Y12.COM.PRG.3',
    strand: 'Advanced Programming',
    description: 'develop programs using an appropriate programming paradigm',
    isStatutory: true,
    guidance: 'Choosing and applying suitable programming approaches',
  },
  {
    notation: 'UK.KS5.Y12.COM.PRG.4',
    strand: 'Advanced Programming',
    description: 'write well-structured, maintainable programs',
    isStatutory: true,
    guidance: 'Code quality, readability, documentation, standards',
  },

  // DATA STRUCTURES AND ALGORITHMS (DSA)
  {
    notation: 'UK.KS5.Y12.COM.DSA.1',
    strand: 'Data Structures and Algorithms',
    description: 'understand and use arrays, records, stacks, queues and trees',
    isStatutory: true,
    guidance: 'Implementation and application of fundamental data structures',
  },
  {
    notation: 'UK.KS5.Y12.COM.DSA.2',
    strand: 'Data Structures and Algorithms',
    description: 'understand and implement searching algorithms including binary search and linear search',
    isStatutory: true,
    guidance: 'Comparing efficiency and appropriate use cases',
  },
  {
    notation: 'UK.KS5.Y12.COM.DSA.3',
    strand: 'Data Structures and Algorithms',
    description: 'understand and implement sorting algorithms including bubble sort, merge sort, and quick sort',
    isStatutory: true,
    guidance: 'Comparing time complexity and space complexity',
  },
  {
    notation: 'UK.KS5.Y12.COM.DSA.4',
    strand: 'Data Structures and Algorithms',
    description: 'understand algorithm complexity using Big O notation',
    isStatutory: true,
    guidance: 'O(1), O(n), O(log n), O(n²), O(n log n)',
  },

  // COMPUTER ARCHITECTURE (ARC)
  {
    notation: 'UK.KS5.Y12.COM.ARC.1',
    strand: 'Computer Architecture',
    description: 'understand the Von Neumann architecture and its components',
    isStatutory: true,
    guidance: 'CPU, memory, buses, registers, instruction cycle',
  },
  {
    notation: 'UK.KS5.Y12.COM.ARC.2',
    strand: 'Computer Architecture',
    description: 'understand processor instruction sets and addressing modes',
    isStatutory: true,
    guidance: 'Machine code, assembly language, addressing techniques',
  },
  {
    notation: 'UK.KS5.Y12.COM.ARC.3',
    strand: 'Computer Architecture',
    description: 'understand the role of operating systems',
    isStatutory: true,
    guidance: 'Memory management, process scheduling, file systems',
  },
  {
    notation: 'UK.KS5.Y12.COM.ARC.4',
    strand: 'Computer Architecture',
    description: 'understand different types of processor architectures',
    isStatutory: true,
    guidance: 'CISC, RISC, multi-core, parallel processing',
  },

  // NETWORKING AND WEB (NET)
  {
    notation: 'UK.KS5.Y12.COM.NET.1',
    strand: 'Networking and Web',
    description: 'understand the structure and protocols of the internet',
    isStatutory: true,
    guidance: 'TCP/IP stack, DNS, routing, IP addressing',
  },
  {
    notation: 'UK.KS5.Y12.COM.NET.2',
    strand: 'Networking and Web',
    description: 'understand web technologies',
    isStatutory: true,
    guidance: 'HTML, CSS, JavaScript, client-server model',
  },
  {
    notation: 'UK.KS5.Y12.COM.NET.3',
    strand: 'Networking and Web',
    description: 'understand network security principles',
    isStatutory: true,
    guidance: 'Encryption, digital certificates, secure protocols',
  },

  // DATABASES (DBS)
  {
    notation: 'UK.KS5.Y12.COM.DBS.1',
    strand: 'Databases',
    description: 'understand relational database concepts',
    isStatutory: true,
    guidance: 'Tables, relationships, keys, normalization',
  },
  {
    notation: 'UK.KS5.Y12.COM.DBS.2',
    strand: 'Databases',
    description: 'use SQL for data definition and data manipulation',
    isStatutory: true,
    guidance: 'SELECT, INSERT, UPDATE, DELETE, CREATE, JOIN',
  },
  {
    notation: 'UK.KS5.Y12.COM.DBS.3',
    strand: 'Databases',
    description: 'understand database design and normalisation',
    isStatutory: true,
    guidance: '1NF, 2NF, 3NF, entity-relationship diagrams',
  },
];

const ks5ALevelYear2Standards: BritishNCComputingStandard[] = [
  // THEORY OF COMPUTATION (THE)
  {
    notation: 'UK.KS5.Y13.COM.THE.1',
    strand: 'Theory of Computation',
    description: 'understand finite state machines',
    isStatutory: true,
    guidance: 'State diagrams, transition tables, acceptance',
  },
  {
    notation: 'UK.KS5.Y13.COM.THE.2',
    strand: 'Theory of Computation',
    description: 'understand regular expressions and their applications',
    isStatutory: true,
    guidance: 'Pattern matching, text processing, validation',
  },
  {
    notation: 'UK.KS5.Y13.COM.THE.3',
    strand: 'Theory of Computation',
    description: 'understand the Turing machine model',
    isStatutory: true,
    guidance: 'Universal computation, halting problem',
  },
  {
    notation: 'UK.KS5.Y13.COM.THE.4',
    strand: 'Theory of Computation',
    description: 'understand computability and decidability',
    isStatutory: true,
    guidance: 'Limits of computation, undecidable problems',
  },

  // ADVANCED DATA STRUCTURES (DSA)
  {
    notation: 'UK.KS5.Y13.COM.DSA.1',
    strand: 'Advanced Data Structures',
    description: 'understand and use hash tables',
    isStatutory: true,
    guidance: 'Hashing functions, collision resolution',
  },
  {
    notation: 'UK.KS5.Y13.COM.DSA.2',
    strand: 'Advanced Data Structures',
    description: 'understand and use graphs',
    isStatutory: true,
    guidance: 'Directed, undirected, weighted graphs, traversal algorithms',
  },
  {
    notation: 'UK.KS5.Y13.COM.DSA.3',
    strand: 'Advanced Data Structures',
    description: 'understand graph algorithms',
    isStatutory: true,
    guidance: 'Dijkstra, A*, depth-first, breadth-first search',
  },
  {
    notation: 'UK.KS5.Y13.COM.DSA.4',
    strand: 'Advanced Data Structures',
    description: 'understand and apply recursion',
    isStatutory: true,
    guidance: 'Recursive algorithms, stack frames, base cases',
  },

  // FUNCTIONAL PROGRAMMING (FUN)
  {
    notation: 'UK.KS5.Y13.COM.FUN.1',
    strand: 'Functional Programming',
    description: 'understand the principles of functional programming',
    isStatutory: true,
    guidance: 'Pure functions, immutability, first-class functions',
  },
  {
    notation: 'UK.KS5.Y13.COM.FUN.2',
    strand: 'Functional Programming',
    description: 'use higher-order functions',
    isStatutory: true,
    guidance: 'Map, filter, reduce, lambda expressions',
  },
  {
    notation: 'UK.KS5.Y13.COM.FUN.3',
    strand: 'Functional Programming',
    description: 'understand list processing in functional languages',
    isStatutory: true,
    guidance: 'Head, tail, cons, list comprehensions',
  },

  // PROGRAMMING PROJECT (PRJ)
  {
    notation: 'UK.KS5.Y13.COM.PRJ.1',
    strand: 'Programming Project',
    description: 'analyse a problem and design a solution',
    isStatutory: true,
    guidance: 'Requirements analysis, design documentation',
  },
  {
    notation: 'UK.KS5.Y13.COM.PRJ.2',
    strand: 'Programming Project',
    description: 'implement a solution using appropriate techniques',
    isStatutory: true,
    guidance: 'Coding to a substantial scale with good practices',
  },
  {
    notation: 'UK.KS5.Y13.COM.PRJ.3',
    strand: 'Programming Project',
    description: 'test and evaluate a solution',
    isStatutory: true,
    guidance: 'Testing strategies, evaluation against requirements',
  },
  {
    notation: 'UK.KS5.Y13.COM.PRJ.4',
    strand: 'Programming Project',
    description: 'document a programming project',
    isStatutory: true,
    guidance: 'Technical documentation, user guides, evaluation',
  },

  // ADVANCED TOPICS (ADV)
  {
    notation: 'UK.KS5.Y13.COM.ADV.1',
    strand: 'Advanced Topics',
    description: 'understand compression techniques',
    isStatutory: true,
    guidance: 'Lossless vs lossy, run-length encoding, dictionary coding',
  },
  {
    notation: 'UK.KS5.Y13.COM.ADV.2',
    strand: 'Advanced Topics',
    description: 'understand encryption methods',
    isStatutory: true,
    guidance: 'Symmetric, asymmetric, public key infrastructure',
  },
  {
    notation: 'UK.KS5.Y13.COM.ADV.3',
    strand: 'Advanced Topics',
    description: 'understand machine learning fundamentals',
    isStatutory: true,
    guidance: 'Supervised/unsupervised learning, neural networks basics',
  },
];

// =============================================================================
// YEAR-SPECIFIC STANDARDS GENERATION
// Generate year-specific standards from Key Stage standards
// =============================================================================

function generateYearStandards(
  ksStandards: BritishNCComputingStandard[],
  year: number,
  keyStage: number
): BritishNCComputingStandard[] {
  return ksStandards.map((standard) => ({
    ...standard,
    notation: standard.notation.replace(
      `UK.KS${keyStage}.COM`,
      `UK.KS${keyStage}.Y${year}.COM`
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

export const britishComputingCurriculum: BritishNCComputingCurriculum = {
  code: 'UK_NC_COM',
  name: 'British National Curriculum - Computing',
  country: 'United Kingdom',
  version: '2014-2025', // NC 2014, GCSE 2025, A-Level 2014
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study',
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
export function getBritishComputingStandardsByYear(year: number): BritishNCComputingStandard[] {
  const yearData = britishComputingCurriculum.years.find((y) => y.year === year);
  return yearData?.standards ?? [];
}

/**
 * Get standards for a specific Key Stage (1-5)
 */
export function getBritishComputingStandardsByKeyStage(keyStage: number): BritishNCComputingStandard[] {
  return britishComputingCurriculum.years
    .filter((y) => y.keyStage === keyStage)
    .flatMap((y) => y.standards);
}

/**
 * Get standards by strand across all years
 */
export function getBritishComputingStandardsByStrand(strand: string): BritishNCComputingStandard[] {
  return britishComputingCurriculum.years.flatMap((year) =>
    year.standards.filter((s) => s.strand.toLowerCase().includes(strand.toLowerCase()))
  );
}

/**
 * Get all programming-related standards
 */
export function getBritishComputingProgrammingStandards(): BritishNCComputingStandard[] {
  return britishComputingCurriculum.years.flatMap((year) =>
    year.standards.filter((s) =>
      s.strand.toLowerCase().includes('programming') ||
      s.notation.includes('.PRG.')
    )
  );
}

/**
 * Get total standard count
 */
export function getBritishComputingStandardCount(): number {
  return britishComputingCurriculum.years.reduce(
    (total, year) => total + year.standards.length,
    0
  );
}
