/**
 * CSTA K-12 Computer Science Standards (2017 Revision)
 *
 * The Computer Science Teachers Association (CSTA) K-12 Computer Science Standards
 * provide the foundation for a complete computer science curriculum at K-12 level.
 *
 * Source: https://csteachers.org/k12standards/
 *
 * Grade Levels:
 * - Level 1A: Grades K-2 (Ages 5-7)
 * - Level 1B: Grades 3-5 (Ages 8-11)
 * - Level 2: Grades 6-8 (Ages 11-14)
 * - Level 3A: Grades 9-10 (High school core - for all students)
 * - Level 3B: Grades 9-12 (High school specialty/elective courses)
 *
 * Five Core Concepts:
 * - CS: Computing Systems
 * - NI: Networks and the Internet
 * - DA: Data and Analysis
 * - AP: Algorithms and Programming
 * - IC: Impacts of Computing
 *
 * Seven Practices:
 * 1. Fostering an Inclusive Computing Culture
 * 2. Collaborating Around Computing
 * 3. Recognizing and Defining Computational Problems
 * 4. Developing and Using Abstractions
 * 5. Creating Computational Artifacts
 * 6. Testing and Refining Computational Artifacts
 * 7. Communicating about Computing
 */

export type CSTALevel = '1A' | '1B' | '2' | '3A' | '3B';
export type CSTAConcept = 'CS' | 'NI' | 'DA' | 'AP' | 'IC';

export interface CSTAStandard {
  notation: string;
  level: CSTALevel;
  concept: CSTAConcept;
  subconcept: string;
  description: string;
  practices?: number[];
}

// ============================================================================
// LEVEL 1A: GRADES K-2 (Ages 5-7)
// ============================================================================

export const cstaLevel1AStandards: CSTAStandard[] = [
  // Computing Systems (CS)
  { notation: '1A-CS-01', level: '1A', concept: 'CS', subconcept: 'Devices', description: 'Select and operate appropriate software to perform a variety of tasks, and recognize that users have different needs and preferences for the technology they use', practices: [1] },
  { notation: '1A-CS-02', level: '1A', concept: 'CS', subconcept: 'Hardware and Software', description: 'Use appropriate terminology in identifying and describing the function of common physical components of computing systems (hardware)', practices: [7] },
  { notation: '1A-CS-03', level: '1A', concept: 'CS', subconcept: 'Troubleshooting', description: 'Describe basic hardware and software problems using accurate terminology', practices: [6] },

  // Networks and the Internet (NI)
  { notation: '1A-NI-04', level: '1A', concept: 'NI', subconcept: 'Network Communication', description: 'Explain what passwords are and why we use them, and use strong passwords to protect devices and information from unauthorized access', practices: [7] },

  // Data and Analysis (DA)
  { notation: '1A-DA-05', level: '1A', concept: 'DA', subconcept: 'Storage', description: 'Store, copy, search, retrieve, modify, and delete information using a computing device and define the information stored as data', practices: [4] },
  { notation: '1A-DA-06', level: '1A', concept: 'DA', subconcept: 'Collection', description: 'Collect and present the same data in various visual formats', practices: [7] },
  { notation: '1A-DA-07', level: '1A', concept: 'DA', subconcept: 'Visualization', description: 'Identify and describe patterns in data visualizations, such as charts or graphs, to make predictions', practices: [4] },

  // Algorithms and Programming (AP)
  { notation: '1A-AP-08', level: '1A', concept: 'AP', subconcept: 'Algorithms', description: 'Model daily processes by creating and following algorithms (sets of step-by-step instructions) to complete tasks', practices: [4] },
  { notation: '1A-AP-09', level: '1A', concept: 'AP', subconcept: 'Variables', description: 'Model the way programs store and manipulate data by using numbers or other symbols to represent information', practices: [4] },
  { notation: '1A-AP-10', level: '1A', concept: 'AP', subconcept: 'Control', description: 'Develop programs with sequences and simple loops, to express ideas or address a problem', practices: [5] },
  { notation: '1A-AP-11', level: '1A', concept: 'AP', subconcept: 'Modularity', description: 'Decompose (break down) the steps needed to solve a problem into a precise sequence of instructions', practices: [3] },
  { notation: '1A-AP-12', level: '1A', concept: 'AP', subconcept: 'Program Development', description: 'Develop plans that describe a program\'s sequence of events, goals, and expected outcomes', practices: [5] },
  { notation: '1A-AP-13', level: '1A', concept: 'AP', subconcept: 'Program Development', description: 'Give attribution when using the ideas and creations of others while developing programs', practices: [7] },
  { notation: '1A-AP-14', level: '1A', concept: 'AP', subconcept: 'Program Development', description: 'Debug (identify and fix) errors in an algorithm or program that includes sequences and simple loops', practices: [6] },
  { notation: '1A-AP-15', level: '1A', concept: 'AP', subconcept: 'Program Development', description: 'Using correct terminology, describe steps taken and choices made during the iterative process of program development', practices: [7] },

  // Impacts of Computing (IC)
  { notation: '1A-IC-16', level: '1A', concept: 'IC', subconcept: 'Culture', description: 'Compare how people live and work before and after the implementation or adoption of new computing technology', practices: [7] },
  { notation: '1A-IC-17', level: '1A', concept: 'IC', subconcept: 'Social Interactions', description: 'Work respectfully and responsibly with others online', practices: [2] },
  { notation: '1A-IC-18', level: '1A', concept: 'IC', subconcept: 'Safety', description: 'Keep login information private, and log off of devices appropriately', practices: [7] },
];

// ============================================================================
// LEVEL 1B: GRADES 3-5 (Ages 8-11)
// ============================================================================

export const cstaLevel1BStandards: CSTAStandard[] = [
  // Computing Systems (CS)
  { notation: '1B-CS-01', level: '1B', concept: 'CS', subconcept: 'Devices', description: 'Describe how internal and external parts of computing devices function to form a system', practices: [7] },
  { notation: '1B-CS-02', level: '1B', concept: 'CS', subconcept: 'Hardware and Software', description: 'Model how computer hardware and software work together as a system to accomplish tasks', practices: [4] },
  { notation: '1B-CS-03', level: '1B', concept: 'CS', subconcept: 'Troubleshooting', description: 'Determine potential solutions to solve simple hardware and software problems using common troubleshooting strategies', practices: [6] },

  // Networks and the Internet (NI)
  { notation: '1B-NI-04', level: '1B', concept: 'NI', subconcept: 'Network Communication', description: 'Model how information is broken down into smaller pieces, transmitted as packets through multiple devices over networks and the Internet, and reassembled at the destination', practices: [4] },
  { notation: '1B-NI-05', level: '1B', concept: 'NI', subconcept: 'Cybersecurity', description: 'Discuss real-world cybersecurity problems and how personal information can be protected', practices: [7] },

  // Data and Analysis (DA)
  { notation: '1B-DA-06', level: '1B', concept: 'DA', subconcept: 'Storage', description: 'Organize and present collected data visually to highlight relationships and support a claim', practices: [7] },
  { notation: '1B-DA-07', level: '1B', concept: 'DA', subconcept: 'Inference', description: 'Use data to highlight or propose cause-and-effect relationships, predict outcomes, or communicate an idea', practices: [7] },

  // Algorithms and Programming (AP)
  { notation: '1B-AP-08', level: '1B', concept: 'AP', subconcept: 'Algorithms', description: 'Compare and refine multiple algorithms for the same task and determine which is the most appropriate', practices: [3, 6] },
  { notation: '1B-AP-09', level: '1B', concept: 'AP', subconcept: 'Variables', description: 'Create programs that use variables to store and modify data', practices: [5] },
  { notation: '1B-AP-10', level: '1B', concept: 'AP', subconcept: 'Control', description: 'Create programs that include sequences, events, loops, and conditionals', practices: [5] },
  { notation: '1B-AP-11', level: '1B', concept: 'AP', subconcept: 'Modularity', description: 'Decompose (break down) problems into smaller, manageable subproblems to facilitate the program development process', practices: [3] },
  { notation: '1B-AP-12', level: '1B', concept: 'AP', subconcept: 'Modularity', description: 'Modify, remix, or incorporate portions of an existing program into one\'s own work, to develop something new or add more advanced features', practices: [5] },
  { notation: '1B-AP-13', level: '1B', concept: 'AP', subconcept: 'Program Development', description: 'Use an iterative process to plan the development of a program by including others\' perspectives and considering user preferences', practices: [1, 5] },
  { notation: '1B-AP-14', level: '1B', concept: 'AP', subconcept: 'Program Development', description: 'Observe intellectual property rights and give appropriate attribution when creating or remixing programs', practices: [7] },
  { notation: '1B-AP-15', level: '1B', concept: 'AP', subconcept: 'Program Development', description: 'Test and debug (identify and fix errors) a program or algorithm to ensure it runs as intended', practices: [6] },
  { notation: '1B-AP-16', level: '1B', concept: 'AP', subconcept: 'Program Development', description: 'Take on varying roles, with teacher guidance, when collaborating with peers during the design, implementation, and review stages of program development', practices: [2] },
  { notation: '1B-AP-17', level: '1B', concept: 'AP', subconcept: 'Program Development', description: 'Describe choices made during program development using code comments, presentations, and demonstrations', practices: [7] },

  // Impacts of Computing (IC)
  { notation: '1B-IC-18', level: '1B', concept: 'IC', subconcept: 'Culture', description: 'Discuss computing technologies that have changed the world, and express how those technologies influence, and are influenced by, cultural practices', practices: [7] },
  { notation: '1B-IC-19', level: '1B', concept: 'IC', subconcept: 'Social Interactions', description: 'Brainstorm ways to improve the accessibility and usability of technology products for the diverse needs and wants of users', practices: [1] },
  { notation: '1B-IC-20', level: '1B', concept: 'IC', subconcept: 'Social Interactions', description: 'Seek diverse perspectives for the purpose of improving computational artifacts', practices: [1] },
  { notation: '1B-IC-21', level: '1B', concept: 'IC', subconcept: 'Safety', description: 'Use public domain or Creative Commons media and refrain from copying or using material created by others without permission', practices: [7] },
];

// ============================================================================
// LEVEL 2: GRADES 6-8 (Ages 11-14)
// ============================================================================

export const cstaLevel2Standards: CSTAStandard[] = [
  // Computing Systems (CS)
  { notation: '2-CS-01', level: '2', concept: 'CS', subconcept: 'Devices', description: 'Recommend improvements to the design of computing devices, based on an analysis of how users interact with the devices', practices: [3, 6] },
  { notation: '2-CS-02', level: '2', concept: 'CS', subconcept: 'Hardware and Software', description: 'Design projects that combine hardware and software components to collect and exchange data', practices: [5] },
  { notation: '2-CS-03', level: '2', concept: 'CS', subconcept: 'Troubleshooting', description: 'Systematically identify and fix problems with computing devices and their components', practices: [6] },

  // Networks and the Internet (NI)
  { notation: '2-NI-04', level: '2', concept: 'NI', subconcept: 'Network Communication', description: 'Model the role of protocols in transmitting data across networks and the Internet', practices: [4] },
  { notation: '2-NI-05', level: '2', concept: 'NI', subconcept: 'Cybersecurity', description: 'Explain how physical and digital security measures protect electronic information', practices: [7] },
  { notation: '2-NI-06', level: '2', concept: 'NI', subconcept: 'Cybersecurity', description: 'Apply multiple methods of encryption to model the secure transmission of information', practices: [4] },

  // Data and Analysis (DA)
  { notation: '2-DA-07', level: '2', concept: 'DA', subconcept: 'Storage', description: 'Represent data using multiple encoding schemes', practices: [4] },
  { notation: '2-DA-08', level: '2', concept: 'DA', subconcept: 'Collection', description: 'Collect data using computational tools and transform the data to make it more useful and reliable', practices: [6] },
  { notation: '2-DA-09', level: '2', concept: 'DA', subconcept: 'Inference', description: 'Refine computational models based on the data they have generated', practices: [4, 6] },

  // Algorithms and Programming (AP)
  { notation: '2-AP-10', level: '2', concept: 'AP', subconcept: 'Algorithms', description: 'Use flowcharts and/or pseudocode to address complex problems as algorithms', practices: [4] },
  { notation: '2-AP-11', level: '2', concept: 'AP', subconcept: 'Variables', description: 'Create clearly named variables that represent different data types and perform operations on their values', practices: [5] },
  { notation: '2-AP-12', level: '2', concept: 'AP', subconcept: 'Control', description: 'Design and iteratively develop programs that combine control structures, including nested loops and compound conditionals', practices: [5] },
  { notation: '2-AP-13', level: '2', concept: 'AP', subconcept: 'Modularity', description: 'Decompose problems and subproblems into parts to facilitate the design, implementation, and review of programs', practices: [3] },
  { notation: '2-AP-14', level: '2', concept: 'AP', subconcept: 'Modularity', description: 'Create procedures with parameters to organize code and make it easier to reuse', practices: [4] },
  { notation: '2-AP-15', level: '2', concept: 'AP', subconcept: 'Program Development', description: 'Seek and incorporate feedback from team members and users to refine a solution that meets user needs', practices: [1, 6] },
  { notation: '2-AP-16', level: '2', concept: 'AP', subconcept: 'Program Development', description: 'Incorporate existing code, media, and libraries into original programs, and give attribution', practices: [4, 7] },
  { notation: '2-AP-17', level: '2', concept: 'AP', subconcept: 'Program Development', description: 'Systematically test and refine programs using a range of test cases', practices: [6] },
  { notation: '2-AP-18', level: '2', concept: 'AP', subconcept: 'Program Development', description: 'Distribute tasks and maintain a project timeline when collaboratively developing computational artifacts', practices: [2] },
  { notation: '2-AP-19', level: '2', concept: 'AP', subconcept: 'Program Development', description: 'Document programs in order to make them easier to follow, test, and debug', practices: [7] },

  // Impacts of Computing (IC)
  { notation: '2-IC-20', level: '2', concept: 'IC', subconcept: 'Culture', description: 'Compare tradeoffs associated with computing technologies that affect people\'s everyday activities and career options', practices: [7] },
  { notation: '2-IC-21', level: '2', concept: 'IC', subconcept: 'Social Interactions', description: 'Discuss issues of bias and accessibility in the design of existing technologies', practices: [1] },
  { notation: '2-IC-22', level: '2', concept: 'IC', subconcept: 'Social Interactions', description: 'Collaborate with many contributors through strategies such as crowdsourcing or surveys when creating a computational artifact', practices: [2] },
  { notation: '2-IC-23', level: '2', concept: 'IC', subconcept: 'Safety', description: 'Describe tradeoffs between allowing information to be public and keeping information private and secure depending on the situation', practices: [7] },
];

// ============================================================================
// LEVEL 3A: GRADES 9-10 (High School Core - for all students)
// ============================================================================

export const cstaLevel3AStandards: CSTAStandard[] = [
  // Computing Systems (CS)
  { notation: '3A-CS-01', level: '3A', concept: 'CS', subconcept: 'Devices', description: 'Explain how abstractions hide the underlying implementation details of computing systems embedded in everyday objects', practices: [7] },
  { notation: '3A-CS-02', level: '3A', concept: 'CS', subconcept: 'Hardware and Software', description: 'Compare levels of abstraction and interactions between application software, system software, and hardware layers', practices: [4] },
  { notation: '3A-CS-03', level: '3A', concept: 'CS', subconcept: 'Troubleshooting', description: 'Develop guidelines that convey systematic troubleshooting strategies that others can use to identify and fix errors', practices: [3, 6] },

  // Networks and the Internet (NI)
  { notation: '3A-NI-04', level: '3A', concept: 'NI', subconcept: 'Network Communication', description: 'Evaluate the scalability and reliability of networks, by describing the relationship between routers, switches, servers, topology, and addressing', practices: [4] },
  { notation: '3A-NI-05', level: '3A', concept: 'NI', subconcept: 'Cybersecurity', description: 'Give examples to illustrate how sensitive data can be affected by malware and other attacks', practices: [7] },
  { notation: '3A-NI-06', level: '3A', concept: 'NI', subconcept: 'Cybersecurity', description: 'Recommend security measures to address various scenarios based on factors such as efficiency, feasibility, and ethical considerations', practices: [3] },
  { notation: '3A-NI-07', level: '3A', concept: 'NI', subconcept: 'Cybersecurity', description: 'Compare various security measures, considering tradeoffs between the usability and security of a computing system', practices: [3, 6] },
  { notation: '3A-NI-08', level: '3A', concept: 'NI', subconcept: 'Cybersecurity', description: 'Explain tradeoffs when selecting and implementing cybersecurity recommendations', practices: [7] },

  // Data and Analysis (DA)
  { notation: '3A-DA-09', level: '3A', concept: 'DA', subconcept: 'Storage', description: 'Translate between different bit representations of real-world phenomena, such as characters, numbers, and images', practices: [4] },
  { notation: '3A-DA-10', level: '3A', concept: 'DA', subconcept: 'Collection', description: 'Evaluate the tradeoffs in how data elements are organized and where data is stored', practices: [3] },
  { notation: '3A-DA-11', level: '3A', concept: 'DA', subconcept: 'Inference', description: 'Create interactive data visualizations using software tools to help others better understand real-world phenomena', practices: [5] },
  { notation: '3A-DA-12', level: '3A', concept: 'DA', subconcept: 'Inference', description: 'Create computational models that represent the relationships among different elements of data collected from a phenomenon or process', practices: [4, 5] },

  // Algorithms and Programming (AP)
  { notation: '3A-AP-13', level: '3A', concept: 'AP', subconcept: 'Algorithms', description: 'Create prototypes that use algorithms to solve computational problems by leveraging prior student knowledge and personal interests', practices: [1, 5] },
  { notation: '3A-AP-14', level: '3A', concept: 'AP', subconcept: 'Variables', description: 'Use lists to simplify solutions, generalizing computational problems instead of repeatedly using simple variables', practices: [4] },
  { notation: '3A-AP-15', level: '3A', concept: 'AP', subconcept: 'Control', description: 'Justify the selection of specific control structures when tradeoffs involve implementation, readability, and program performance, and explain the benefits and drawbacks of choices made', practices: [6] },
  { notation: '3A-AP-16', level: '3A', concept: 'AP', subconcept: 'Modularity', description: 'Design and iteratively develop computational artifacts for practical intent, personal expression, or to address a societal issue by using events to initiate instructions', practices: [5] },
  { notation: '3A-AP-17', level: '3A', concept: 'AP', subconcept: 'Modularity', description: 'Decompose problems into smaller components through systematic analysis, using constructs such as procedures, modules, and/or objects', practices: [3] },
  { notation: '3A-AP-18', level: '3A', concept: 'AP', subconcept: 'Modularity', description: 'Create artifacts by using procedures within a program, combinations of data and procedures, or independent but interrelated programs', practices: [5] },
  { notation: '3A-AP-19', level: '3A', concept: 'AP', subconcept: 'Program Development', description: 'Systematically design and develop programs for broad audiences by incorporating feedback from users', practices: [1, 5] },
  { notation: '3A-AP-20', level: '3A', concept: 'AP', subconcept: 'Program Development', description: 'Evaluate licenses that limit or restrict use of computational artifacts when using resources such as libraries', practices: [7] },
  { notation: '3A-AP-21', level: '3A', concept: 'AP', subconcept: 'Program Development', description: 'Evaluate and refine computational artifacts to make them more usable and accessible', practices: [1, 6] },
  { notation: '3A-AP-22', level: '3A', concept: 'AP', subconcept: 'Program Development', description: 'Design and develop computational artifacts working in team roles using collaborative tools', practices: [2] },
  { notation: '3A-AP-23', level: '3A', concept: 'AP', subconcept: 'Program Development', description: 'Document design decisions using text, graphics, presentations, and/or demonstrations in the development of complex programs', practices: [7] },

  // Impacts of Computing (IC)
  { notation: '3A-IC-24', level: '3A', concept: 'IC', subconcept: 'Culture', description: 'Evaluate the ways computing impacts personal, ethical, social, economic, and cultural practices', practices: [7] },
  { notation: '3A-IC-25', level: '3A', concept: 'IC', subconcept: 'Culture', description: 'Test and refine computational artifacts to reduce bias and equity deficits', practices: [1, 6] },
  { notation: '3A-IC-26', level: '3A', concept: 'IC', subconcept: 'Social Interactions', description: 'Demonstrate ways a given algorithm applies to problems across disciplines', practices: [3] },
  { notation: '3A-IC-27', level: '3A', concept: 'IC', subconcept: 'Social Interactions', description: 'Use tools and methods for collaboration on a project to increase connectivity of people in different cultures and career fields', practices: [2] },
  { notation: '3A-IC-28', level: '3A', concept: 'IC', subconcept: 'Safety', description: 'Explain the beneficial and harmful effects that intellectual property laws can have on innovation', practices: [7] },
  { notation: '3A-IC-29', level: '3A', concept: 'IC', subconcept: 'Safety', description: 'Explain the privacy concerns related to the collection and generation of data through automated processes that may not be evident to users', practices: [7] },
  { notation: '3A-IC-30', level: '3A', concept: 'IC', subconcept: 'Safety', description: 'Evaluate the social and economic implications of privacy in the context of safety, law, or ethics', practices: [7] },
];

// ============================================================================
// LEVEL 3B: GRADES 9-12 (High School Specialty/Elective)
// ============================================================================

export const cstaLevel3BStandards: CSTAStandard[] = [
  // Computing Systems (CS)
  { notation: '3B-CS-01', level: '3B', concept: 'CS', subconcept: 'Devices', description: 'Categorize the roles of operating system software', practices: [7] },
  { notation: '3B-CS-02', level: '3B', concept: 'CS', subconcept: 'Hardware and Software', description: 'Illustrate ways computing systems implement logic, input, and output through hardware components', practices: [4] },

  // Networks and the Internet (NI)
  { notation: '3B-NI-03', level: '3B', concept: 'NI', subconcept: 'Network Communication', description: 'Describe the issues that impact network functionality (e.g., bandwidth, load, delay, topology)', practices: [7] },
  { notation: '3B-NI-04', level: '3B', concept: 'NI', subconcept: 'Cybersecurity', description: 'Compare ways software developers protect devices and information from unauthorized access', practices: [7] },

  // Data and Analysis (DA)
  { notation: '3B-DA-05', level: '3B', concept: 'DA', subconcept: 'Storage', description: 'Use data analysis tools and techniques to identify patterns in data representing complex systems', practices: [4] },
  { notation: '3B-DA-06', level: '3B', concept: 'DA', subconcept: 'Inference', description: 'Select data collection tools and techniques to generate data sets that support a claim or communicate information', practices: [5] },
  { notation: '3B-DA-07', level: '3B', concept: 'DA', subconcept: 'Inference', description: 'Evaluate the ability of models and simulations to test and support the refinement of hypotheses', practices: [4] },

  // Algorithms and Programming (AP)
  { notation: '3B-AP-08', level: '3B', concept: 'AP', subconcept: 'Algorithms', description: 'Describe how artificial intelligence drives many software and physical systems', practices: [7] },
  { notation: '3B-AP-09', level: '3B', concept: 'AP', subconcept: 'Algorithms', description: 'Implement an artificial intelligence algorithm to play a game against a human opponent or solve a problem', practices: [5] },
  { notation: '3B-AP-10', level: '3B', concept: 'AP', subconcept: 'Algorithms', description: 'Use and adapt classic algorithms to solve computational problems', practices: [4] },
  { notation: '3B-AP-11', level: '3B', concept: 'AP', subconcept: 'Algorithms', description: 'Evaluate algorithms in terms of their efficiency, correctness, and clarity', practices: [6] },
  { notation: '3B-AP-12', level: '3B', concept: 'AP', subconcept: 'Variables', description: 'Compare and contrast fundamental data structures and their uses', practices: [4] },
  { notation: '3B-AP-13', level: '3B', concept: 'AP', subconcept: 'Variables', description: 'Illustrate the flow of execution of a recursive algorithm', practices: [4] },
  { notation: '3B-AP-14', level: '3B', concept: 'AP', subconcept: 'Control', description: 'Construct solutions to problems using student-created components, such as procedures, modules and/or objects', practices: [5] },
  { notation: '3B-AP-15', level: '3B', concept: 'AP', subconcept: 'Modularity', description: 'Analyze a large-scale computational problem and identify generalizable patterns that can be applied to a solution', practices: [3] },
  { notation: '3B-AP-16', level: '3B', concept: 'AP', subconcept: 'Modularity', description: 'Demonstrate code reuse by creating programming solutions using libraries and APIs', practices: [4, 5] },
  { notation: '3B-AP-17', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Plan and develop programs for broad audiences using a software life cycle process', practices: [5] },
  { notation: '3B-AP-18', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Explain security issues that might lead to compromised computer programs', practices: [7] },
  { notation: '3B-AP-19', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Develop programs for multiple computing platforms', practices: [5] },
  { notation: '3B-AP-20', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Use version control systems, integrated development environments (IDEs), and collaborative tools and practices (code documentation) in a group software project', practices: [2] },
  { notation: '3B-AP-21', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Develop and use a series of test cases to verify that a program performs according to its design specifications', practices: [6] },
  { notation: '3B-AP-22', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Modify an existing program to add additional functionality and discuss intended and unintended implications (e.g., breaking combatibility)', practices: [5, 6] },
  { notation: '3B-AP-23', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Evaluate key qualities of a program through a process such as a code review', practices: [6] },
  { notation: '3B-AP-24', level: '3B', concept: 'AP', subconcept: 'Program Development', description: 'Compare multiple programming languages and discuss how their features make them suitable for solving different types of problems', practices: [4] },

  // Impacts of Computing (IC)
  { notation: '3B-IC-25', level: '3B', concept: 'IC', subconcept: 'Culture', description: 'Evaluate computational artifacts to maximize their beneficial effects and minimize harmful effects on society', practices: [1, 6] },
  { notation: '3B-IC-26', level: '3B', concept: 'IC', subconcept: 'Culture', description: 'Evaluate the impact of equity, access, and influence on the distribution of computing resources in a global society', practices: [1] },
  { notation: '3B-IC-27', level: '3B', concept: 'IC', subconcept: 'Social Interactions', description: 'Predict how computational innovations that have revolutionized aspects of our culture might evolve', practices: [7] },
  { notation: '3B-IC-28', level: '3B', concept: 'IC', subconcept: 'Safety', description: 'Debate laws and regulations that impact the development and use of software', practices: [7] },
];

// ============================================================================
// COMBINED EXPORTS AND HELPER FUNCTIONS
// ============================================================================

export const allCSTAStandards: CSTAStandard[] = [
  ...cstaLevel1AStandards,
  ...cstaLevel1BStandards,
  ...cstaLevel2Standards,
  ...cstaLevel3AStandards,
  ...cstaLevel3BStandards,
];

/**
 * Get standards by level
 */
export function getCSTAStandardsByLevel(level: CSTALevel): CSTAStandard[] {
  return allCSTAStandards.filter(s => s.level === level);
}

/**
 * Get standards by concept
 */
export function getCSTAStandardsByConcept(concept: CSTAConcept): CSTAStandard[] {
  return allCSTAStandards.filter(s => s.concept === concept);
}

/**
 * Get standards by level and concept
 */
export function getCSTAStandardsByLevelAndConcept(level: CSTALevel, concept: CSTAConcept): CSTAStandard[] {
  return allCSTAStandards.filter(s => s.level === level && s.concept === concept);
}

/**
 * Get standards by subconcept
 */
export function getCSTAStandardsBySubconcept(subconcept: string): CSTAStandard[] {
  return allCSTAStandards.filter(s => s.subconcept === subconcept);
}

/**
 * Get standards by practice
 */
export function getCSTAStandardsByPractice(practice: number): CSTAStandard[] {
  return allCSTAStandards.filter(s => s.practices?.includes(practice));
}

/**
 * Map CSTA level to grade range
 */
export function getCSTALevelGradeRange(level: CSTALevel): { start: number; end: number } {
  switch (level) {
    case '1A': return { start: 0, end: 2 };  // K-2
    case '1B': return { start: 3, end: 5 };  // 3-5
    case '2': return { start: 6, end: 8 };   // 6-8
    case '3A': return { start: 9, end: 10 }; // 9-10
    case '3B': return { start: 9, end: 12 }; // 9-12
    default: return { start: 0, end: 12 };
  }
}

/**
 * Get CSTA level for a specific grade
 */
export function getCSTALevelForGrade(grade: number): CSTALevel[] {
  const levels: CSTALevel[] = [];
  if (grade >= 0 && grade <= 2) levels.push('1A');
  if (grade >= 3 && grade <= 5) levels.push('1B');
  if (grade >= 6 && grade <= 8) levels.push('2');
  if (grade >= 9 && grade <= 10) levels.push('3A');
  if (grade >= 9 && grade <= 12) levels.push('3B');
  return levels;
}

/**
 * Get concept full name
 */
export function getCSTAConceptName(concept: CSTAConcept): string {
  const names: Record<CSTAConcept, string> = {
    CS: 'Computing Systems',
    NI: 'Networks and the Internet',
    DA: 'Data and Analysis',
    AP: 'Algorithms and Programming',
    IC: 'Impacts of Computing',
  };
  return names[concept];
}

/**
 * Get practice name
 */
export function getCSTAPracticeName(practice: number): string {
  const practices: Record<number, string> = {
    1: 'Fostering an Inclusive Computing Culture',
    2: 'Collaborating Around Computing',
    3: 'Recognizing and Defining Computational Problems',
    4: 'Developing and Using Abstractions',
    5: 'Creating Computational Artifacts',
    6: 'Testing and Refining Computational Artifacts',
    7: 'Communicating about Computing',
  };
  return practices[practice] || 'Unknown Practice';
}

/**
 * Get standards count summary
 */
export function getCSTAStandardsSummary(): {
  total: number;
  byLevel: Record<CSTALevel, number>;
  byConcept: Record<CSTAConcept, number>;
} {
  const byLevel: Record<CSTALevel, number> = {
    '1A': cstaLevel1AStandards.length,
    '1B': cstaLevel1BStandards.length,
    '2': cstaLevel2Standards.length,
    '3A': cstaLevel3AStandards.length,
    '3B': cstaLevel3BStandards.length,
  };

  const byConcept: Record<CSTAConcept, number> = {
    CS: allCSTAStandards.filter(s => s.concept === 'CS').length,
    NI: allCSTAStandards.filter(s => s.concept === 'NI').length,
    DA: allCSTAStandards.filter(s => s.concept === 'DA').length,
    AP: allCSTAStandards.filter(s => s.concept === 'AP').length,
    IC: allCSTAStandards.filter(s => s.concept === 'IC').length,
  };

  return {
    total: allCSTAStandards.length,
    byLevel,
    byConcept,
  };
}
