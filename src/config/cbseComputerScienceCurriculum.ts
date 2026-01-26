/**
 * CBSE (Central Board of Secondary Education) - Computer Science Standards
 * Classes 9-12 (Secondary and Senior Secondary)
 *
 * CBSE introduces Computer Applications as an elective from Class 9.
 * Computer Science with Python is offered from Class 11 as a full subject.
 *
 * Classes 9-10: Computer Applications (Code 165)
 *   - Basic computing concepts, networking, HTML, Python basics
 *
 * Classes 11-12: Computer Science (Code 083)
 *   - Advanced Python programming, data structures, SQL, networks
 *
 * Source: Official CBSE Curriculum 2024-25
 * https://cbseacademic.nic.in/curriculum_2025.html
 *
 * Notation System: IN.CBSE.C{class}.CS.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (9-12)
 * - CS = Computer Science
 * - Strand codes:
 *   Classes 9-10:
 *   - ICT = ICT Fundamentals
 *   - NET = Networking
 *   - HTM = HTML/Web Development
 *   - PYB = Python Basics
 *   - CYB = Cyber Safety
 *   Classes 11-12:
 *   - PYP = Python Programming
 *   - DST = Data Structures
 *   - SRT = Sorting and Searching
 *   - NET = Computer Networks
 *   - DBS = Database and SQL
 *   - CON = Python-SQL Connectivity
 *   - FIL = File Handling
 *   - EXC = Exception Handling
 */

export interface CBSEComputerScienceStandard {
  notation: string;
  strand: string;
  description: string;
  skillLevel?: 'knowledge' | 'skill' | 'application';
  practicalComponent?: boolean;
}

export interface CBSEComputerScienceClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  courseCode: string;
  courseName: string;
  standards: CBSEComputerScienceStandard[];
}

// ============================================================================
// CLASS 9 - Computer Applications (Elective)
// ============================================================================
const class9Standards: CBSEComputerScienceStandard[] = [
  // ICT Fundamentals
  { notation: 'IN.CBSE.C9.CS.ICT.1', strand: 'ICT Fundamentals', description: 'Understand the basic components of a computer system (CPU, memory, storage, I/O devices)', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.2', strand: 'ICT Fundamentals', description: 'Differentiate between hardware and software components', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.3', strand: 'ICT Fundamentals', description: 'Understand types of software: system software and application software', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.4', strand: 'ICT Fundamentals', description: 'Explain the function of an operating system', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.5', strand: 'ICT Fundamentals', description: 'Understand memory hierarchy and storage devices', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.6', strand: 'ICT Fundamentals', description: 'Convert between number systems (binary, decimal, octal, hexadecimal)', skillLevel: 'skill' },
  { notation: 'IN.CBSE.C9.CS.ICT.7', strand: 'ICT Fundamentals', description: 'Understand data representation in computers', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.ICT.8', strand: 'ICT Fundamentals', description: 'Identify input and output devices and their functions', skillLevel: 'knowledge' },

  // Networking
  { notation: 'IN.CBSE.C9.CS.NET.1', strand: 'Networking', description: 'Define a computer network and explain its advantages', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.2', strand: 'Networking', description: 'Classify networks by geographical area: PAN, LAN, MAN, WAN', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.3', strand: 'Networking', description: 'Understand network topologies: bus, star, ring, mesh, tree', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.4', strand: 'Networking', description: 'Identify network devices: modem, hub, switch, router, gateway', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.5', strand: 'Networking', description: 'Understand transmission media: wired (twisted pair, coaxial, fiber optic) and wireless', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.6', strand: 'Networking', description: 'Explain the concept of the Internet and World Wide Web', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.7', strand: 'Networking', description: 'Understand web browsers and web servers', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.NET.8', strand: 'Networking', description: 'Explain URLs, domain names, and IP addresses', skillLevel: 'knowledge' },

  // HTML/Web Development
  { notation: 'IN.CBSE.C9.CS.HTM.1', strand: 'HTML/Web Development', description: 'Understand the structure of an HTML document', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.HTM.2', strand: 'HTML/Web Development', description: 'Use HTML tags for text formatting: heading, paragraph, bold, italic, underline', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.3', strand: 'HTML/Web Development', description: 'Create lists using ordered and unordered list tags', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.4', strand: 'HTML/Web Development', description: 'Insert images in web pages using img tag', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.5', strand: 'HTML/Web Development', description: 'Create hyperlinks using anchor tag', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.6', strand: 'HTML/Web Development', description: 'Create tables using table, tr, th, td tags', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.7', strand: 'HTML/Web Development', description: 'Create forms using form, input, textarea, select tags', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C9.CS.HTM.8', strand: 'HTML/Web Development', description: 'Apply basic CSS for styling web pages', skillLevel: 'skill', practicalComponent: true },

  // Cyber Safety
  { notation: 'IN.CBSE.C9.CS.CYB.1', strand: 'Cyber Safety', description: 'Understand the importance of cyber safety and netiquette', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.CYB.2', strand: 'Cyber Safety', description: 'Identify types of cyber threats: viruses, worms, trojans, spyware', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.CYB.3', strand: 'Cyber Safety', description: 'Explain measures for safe internet usage', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.CYB.4', strand: 'Cyber Safety', description: 'Understand digital footprint and privacy concerns', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.CYB.5', strand: 'Cyber Safety', description: 'Recognize cyberbullying and appropriate responses', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C9.CS.CYB.6', strand: 'Cyber Safety', description: 'Understand the importance of strong passwords and authentication', skillLevel: 'knowledge' },
];

// ============================================================================
// CLASS 10 - Computer Applications (Elective)
// ============================================================================
const class10Standards: CBSEComputerScienceStandard[] = [
  // ICT Fundamentals
  { notation: 'IN.CBSE.C10.CS.ICT.1', strand: 'ICT Fundamentals', description: 'Understand the evolution of computers and generations', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.ICT.2', strand: 'ICT Fundamentals', description: 'Explain the role of ICT in society and education', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.ICT.3', strand: 'ICT Fundamentals', description: 'Understand cloud computing concepts', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.ICT.4', strand: 'ICT Fundamentals', description: 'Explain the concept of Internet of Things (IoT)', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.ICT.5', strand: 'ICT Fundamentals', description: 'Understand e-commerce and online transactions', skillLevel: 'knowledge' },

  // Networking
  { notation: 'IN.CBSE.C10.CS.NET.1', strand: 'Networking', description: 'Understand network protocols and their functions', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.NET.2', strand: 'Networking', description: 'Explain HTTP, HTTPS, FTP, SMTP, POP3 protocols', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.NET.3', strand: 'Networking', description: 'Understand TCP/IP protocol suite', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.NET.4', strand: 'Networking', description: 'Differentiate between circuit switching and packet switching', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.NET.5', strand: 'Networking', description: 'Understand mobile communication technologies (2G, 3G, 4G, 5G)', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.NET.6', strand: 'Networking', description: 'Explain the concept of Wi-Fi and Bluetooth', skillLevel: 'knowledge' },

  // Python Basics
  { notation: 'IN.CBSE.C10.CS.PYB.1', strand: 'Python Basics', description: 'Understand the features and applications of Python', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.PYB.2', strand: 'Python Basics', description: 'Work with Python interactive mode and script mode', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.3', strand: 'Python Basics', description: 'Use Python data types: int, float, string, boolean', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.4', strand: 'Python Basics', description: 'Declare and use variables in Python', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.5', strand: 'Python Basics', description: 'Use arithmetic, relational, and logical operators', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.6', strand: 'Python Basics', description: 'Use input() and print() for user interaction', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.7', strand: 'Python Basics', description: 'Use conditional statements: if, if-else, if-elif-else', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.8', strand: 'Python Basics', description: 'Use looping statements: for, while', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.9', strand: 'Python Basics', description: 'Use break, continue, and pass statements', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.10', strand: 'Python Basics', description: 'Work with strings: indexing, slicing, string methods', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.11', strand: 'Python Basics', description: 'Work with lists: creation, indexing, slicing, list methods', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.12', strand: 'Python Basics', description: 'Work with tuples: creation, indexing, tuple operations', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.13', strand: 'Python Basics', description: 'Work with dictionaries: creation, accessing, updating', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C10.CS.PYB.14', strand: 'Python Basics', description: 'Write simple Python programs to solve problems', skillLevel: 'application', practicalComponent: true },

  // Cyber Safety
  { notation: 'IN.CBSE.C10.CS.CYB.1', strand: 'Cyber Safety', description: 'Understand cyber crimes and their types', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.CYB.2', strand: 'Cyber Safety', description: 'Explain phishing, identity theft, and online fraud', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.CYB.3', strand: 'Cyber Safety', description: 'Understand intellectual property rights and plagiarism', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.CYB.4', strand: 'Cyber Safety', description: 'Explain cyber laws and IT Act provisions', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C10.CS.CYB.5', strand: 'Cyber Safety', description: 'Understand the role of firewalls and antivirus software', skillLevel: 'knowledge' },
];

// ============================================================================
// CLASS 11 - Computer Science (Code 083)
// ============================================================================
const class11Standards: CBSEComputerScienceStandard[] = [
  // Computer System Fundamentals
  { notation: 'IN.CBSE.C11.CS.ICT.1', strand: 'Computer Fundamentals', description: 'Understand the architecture of a computer system', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.2', strand: 'Computer Fundamentals', description: 'Explain the functioning of CPU components: ALU, CU, registers', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.3', strand: 'Computer Fundamentals', description: 'Understand primary and secondary memory types', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.4', strand: 'Computer Fundamentals', description: 'Explain encoding schemes: ASCII, ISCII, Unicode', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.5', strand: 'Computer Fundamentals', description: 'Understand Boolean logic and logic gates', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.6', strand: 'Computer Fundamentals', description: 'Construct truth tables for Boolean expressions', skillLevel: 'skill' },
  { notation: 'IN.CBSE.C11.CS.ICT.7', strand: 'Computer Fundamentals', description: 'Understand software licensing and open source concepts', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.ICT.8', strand: 'Computer Fundamentals', description: 'Explain cloud computing: IaaS, PaaS, SaaS models', skillLevel: 'knowledge' },

  // Python Programming
  { notation: 'IN.CBSE.C11.CS.PYP.1', strand: 'Python Programming', description: 'Understand Python fundamentals: features, execution modes', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.PYP.2', strand: 'Python Programming', description: 'Use Python tokens: keywords, identifiers, literals, operators', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.3', strand: 'Python Programming', description: 'Understand data types: mutable and immutable', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.PYP.4', strand: 'Python Programming', description: 'Use expressions and type conversion', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.5', strand: 'Python Programming', description: 'Write programs using conditional statements', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.6', strand: 'Python Programming', description: 'Implement iteration using for and while loops', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.7', strand: 'Python Programming', description: 'Use nested loops effectively', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.8', strand: 'Python Programming', description: 'Understand and use strings: operations, methods, formatting', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.9', strand: 'Python Programming', description: 'Work with lists: creation, traversal, operations, methods', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.10', strand: 'Python Programming', description: 'Work with tuples and their operations', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.11', strand: 'Python Programming', description: 'Work with dictionaries: creation, accessing, methods', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.12', strand: 'Python Programming', description: 'Define and call user-defined functions', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.13', strand: 'Python Programming', description: 'Understand parameters: positional, default, keyword', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.14', strand: 'Python Programming', description: 'Understand scope of variables: local and global', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.PYP.15', strand: 'Python Programming', description: 'Use modules and import statements', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.16', strand: 'Python Programming', description: 'Work with math and random modules', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C11.CS.PYP.17', strand: 'Python Programming', description: 'Understand recursion and write recursive functions', skillLevel: 'application', practicalComponent: true },

  // Data Handling
  { notation: 'IN.CBSE.C11.CS.DST.1', strand: 'Data Handling', description: 'Understand introduction to data: its importance and types', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DST.2', strand: 'Data Handling', description: 'Explain data collection methods', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DST.3', strand: 'Data Handling', description: 'Understand data storage concepts', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DST.4', strand: 'Data Handling', description: 'Understand statistical measures: mean, median, mode', skillLevel: 'skill' },

  // Networking
  { notation: 'IN.CBSE.C11.CS.NET.1', strand: 'Computer Networks', description: 'Understand evolution of networking: ARPANET, NSFNET, Internet', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.2', strand: 'Computer Networks', description: 'Explain network types: PAN, LAN, MAN, WAN', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.3', strand: 'Computer Networks', description: 'Understand network topologies', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.4', strand: 'Computer Networks', description: 'Explain network devices and their functions', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.5', strand: 'Computer Networks', description: 'Understand transmission media types', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.6', strand: 'Computer Networks', description: 'Explain network protocols: HTTP, FTP, SMTP, TCP/IP', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.NET.7', strand: 'Computer Networks', description: 'Understand IP addressing and domain names', skillLevel: 'knowledge' },

  // Database Concepts Introduction
  { notation: 'IN.CBSE.C11.CS.DBS.1', strand: 'Database Concepts', description: 'Understand the need for database management', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DBS.2', strand: 'Database Concepts', description: 'Explain file system vs database management system', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DBS.3', strand: 'Database Concepts', description: 'Understand relational model concepts: relation, attribute, tuple', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.DBS.4', strand: 'Database Concepts', description: 'Identify keys: primary, candidate, alternate, foreign', skillLevel: 'knowledge' },

  // Society and Ethics
  { notation: 'IN.CBSE.C11.CS.CYB.1', strand: 'Society and Ethics', description: 'Understand digital divide and its implications', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.CYB.2', strand: 'Society and Ethics', description: 'Explain e-waste management and green computing', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.CYB.3', strand: 'Society and Ethics', description: 'Understand gender and disability issues in technology', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.CYB.4', strand: 'Society and Ethics', description: 'Explain intellectual property rights: copyright, patent, trademark', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C11.CS.CYB.5', strand: 'Society and Ethics', description: 'Understand cyber safety threats and prevention', skillLevel: 'knowledge' },
];

// ============================================================================
// CLASS 12 - Computer Science (Code 083)
// ============================================================================
const class12Standards: CBSEComputerScienceStandard[] = [
  // Exception Handling
  { notation: 'IN.CBSE.C12.CS.EXC.1', strand: 'Exception Handling', description: 'Understand the difference between syntax errors and exceptions', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.EXC.2', strand: 'Exception Handling', description: 'Identify built-in exceptions in Python', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.EXC.3', strand: 'Exception Handling', description: 'Handle exceptions using try-except blocks', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.EXC.4', strand: 'Exception Handling', description: 'Use multiple except blocks for different exceptions', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.EXC.5', strand: 'Exception Handling', description: 'Use finally clause for cleanup operations', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.EXC.6', strand: 'Exception Handling', description: 'Raise exceptions using raise statement', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.EXC.7', strand: 'Exception Handling', description: 'Write programs with proper exception handling', skillLevel: 'application', practicalComponent: true },

  // File Handling
  { notation: 'IN.CBSE.C12.CS.FIL.1', strand: 'File Handling', description: 'Understand the need for data files and file types', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.FIL.2', strand: 'File Handling', description: 'Open and close text files using open() and close()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.3', strand: 'File Handling', description: 'Understand text file open modes: r, r+, w, w+, a, a+', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.FIL.4', strand: 'File Handling', description: 'Use with statement for file handling', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.5', strand: 'File Handling', description: 'Write to text files using write() and writelines()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.6', strand: 'File Handling', description: 'Read from text files using read(), readline(), readlines()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.7', strand: 'File Handling', description: 'Use seek() and tell() methods for file positioning', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.8', strand: 'File Handling', description: 'Process text files: count characters, words, lines', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.9', strand: 'File Handling', description: 'Understand binary files and their open modes', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.FIL.10', strand: 'File Handling', description: 'Use pickle module for binary file operations', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.11', strand: 'File Handling', description: 'Use dump() and load() for binary file read/write', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.12', strand: 'File Handling', description: 'Search and update records in binary files', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.13', strand: 'File Handling', description: 'Understand CSV files and their structure', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.FIL.14', strand: 'File Handling', description: 'Import and use csv module', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.15', strand: 'File Handling', description: 'Write CSV files using writer(), writerow(), writerows()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.FIL.16', strand: 'File Handling', description: 'Read CSV files using reader()', skillLevel: 'skill', practicalComponent: true },

  // Data Structures - Stack
  { notation: 'IN.CBSE.C12.CS.DST.1', strand: 'Data Structures', description: 'Understand the concept of data structures', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DST.2', strand: 'Data Structures', description: 'Explain stack as LIFO (Last In First Out) structure', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DST.3', strand: 'Data Structures', description: 'Understand stack operations: push, pop, peek, isEmpty', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DST.4', strand: 'Data Structures', description: 'Implement stack using Python list', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DST.5', strand: 'Data Structures', description: 'Handle stack overflow and underflow conditions', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DST.6', strand: 'Data Structures', description: 'Apply stack for expression evaluation', skillLevel: 'application' },
  { notation: 'IN.CBSE.C12.CS.DST.7', strand: 'Data Structures', description: 'Convert infix to postfix notation using stack', skillLevel: 'application' },
  { notation: 'IN.CBSE.C12.CS.DST.8', strand: 'Data Structures', description: 'Evaluate postfix expressions using stack', skillLevel: 'application' },

  // Data Structures - Queue
  { notation: 'IN.CBSE.C12.CS.DST.9', strand: 'Data Structures', description: 'Explain queue as FIFO (First In First Out) structure', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DST.10', strand: 'Data Structures', description: 'Understand queue operations: enqueue, dequeue, front, rear', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DST.11', strand: 'Data Structures', description: 'Implement queue using Python list', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DST.12', strand: 'Data Structures', description: 'Understand and implement deque (double-ended queue)', skillLevel: 'skill', practicalComponent: true },

  // Sorting
  { notation: 'IN.CBSE.C12.CS.SRT.1', strand: 'Sorting', description: 'Understand the need for sorting algorithms', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.SRT.2', strand: 'Sorting', description: 'Implement bubble sort algorithm', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.SRT.3', strand: 'Sorting', description: 'Implement selection sort algorithm', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.SRT.4', strand: 'Sorting', description: 'Implement insertion sort algorithm', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.SRT.5', strand: 'Sorting', description: 'Analyze time complexity of sorting algorithms', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.SRT.6', strand: 'Sorting', description: 'Compare efficiency of different sorting algorithms', skillLevel: 'knowledge' },

  // Searching
  { notation: 'IN.CBSE.C12.CS.SRT.7', strand: 'Searching', description: 'Implement linear search algorithm', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.SRT.8', strand: 'Searching', description: 'Implement binary search algorithm', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.SRT.9', strand: 'Searching', description: 'Understand search by hashing', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.SRT.10', strand: 'Searching', description: 'Compare time complexity of linear and binary search', skillLevel: 'knowledge' },

  // Computer Networks
  { notation: 'IN.CBSE.C12.CS.NET.1', strand: 'Computer Networks', description: 'Review network fundamentals and evolution', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.2', strand: 'Computer Networks', description: 'Understand data communication components', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.3', strand: 'Computer Networks', description: 'Explain bandwidth and data transfer rate concepts', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.4', strand: 'Computer Networks', description: 'Understand types of data communication: simplex, half-duplex, full-duplex', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.5', strand: 'Computer Networks', description: 'Explain switching techniques: circuit and packet switching', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.6', strand: 'Computer Networks', description: 'Understand wired transmission media in detail', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.7', strand: 'Computer Networks', description: 'Understand wireless transmission media: radio, microwave, infrared', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.8', strand: 'Computer Networks', description: 'Explain mobile communication technologies (2G to 5G)', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.9', strand: 'Computer Networks', description: 'Understand network protocols in depth', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.10', strand: 'Computer Networks', description: 'Explain web services: WWW, HTML, XML, URL', skillLevel: 'knowledge' },

  // Network Security
  { notation: 'IN.CBSE.C12.CS.NET.11', strand: 'Network Security', description: 'Understand network security threats', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.12', strand: 'Network Security', description: 'Explain malware types: virus, worms, trojans, spyware', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.13', strand: 'Network Security', description: 'Understand role of antivirus and firewall', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.14', strand: 'Network Security', description: 'Differentiate between HTTP and HTTPS', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.15', strand: 'Network Security', description: 'Understand cookies and their implications', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.16', strand: 'Network Security', description: 'Explain denial of service and intrusion attacks', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.NET.17', strand: 'Network Security', description: 'Understand eavesdropping and snooping threats', skillLevel: 'knowledge' },

  // Database Concepts
  { notation: 'IN.CBSE.C12.CS.DBS.1', strand: 'Database Concepts', description: 'Review database concepts and need for DBMS', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DBS.2', strand: 'Database Concepts', description: 'Understand relational model: degree and cardinality', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DBS.3', strand: 'Database Concepts', description: 'Identify and apply different types of keys', skillLevel: 'skill' },
  { notation: 'IN.CBSE.C12.CS.DBS.4', strand: 'Database Concepts', description: 'Understand referential integrity', skillLevel: 'knowledge' },

  // SQL - Data Definition Language
  { notation: 'IN.CBSE.C12.CS.DBS.5', strand: 'SQL', description: 'Understand SQL as a query language', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DBS.6', strand: 'SQL', description: 'Use data types: char, varchar, int, float, date', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.7', strand: 'SQL', description: 'Apply constraints: NOT NULL, UNIQUE, PRIMARY KEY', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.8', strand: 'SQL', description: 'Create database using CREATE DATABASE', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.9', strand: 'SQL', description: 'Use database with USE statement', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.10', strand: 'SQL', description: 'Display databases using SHOW DATABASES', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.11', strand: 'SQL', description: 'Create tables using CREATE TABLE', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.12', strand: 'SQL', description: 'View table structure using DESCRIBE', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.13', strand: 'SQL', description: 'Modify table structure using ALTER TABLE', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.14', strand: 'SQL', description: 'Delete database and tables using DROP', skillLevel: 'skill', practicalComponent: true },

  // SQL - Data Manipulation Language
  { notation: 'IN.CBSE.C12.CS.DBS.15', strand: 'SQL', description: 'Insert records using INSERT INTO', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.16', strand: 'SQL', description: 'Query data using SELECT statement', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.17', strand: 'SQL', description: 'Use WHERE clause for filtering', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.18', strand: 'SQL', description: 'Use comparison operators in queries', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.19', strand: 'SQL', description: 'Use logical operators: AND, OR, NOT', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.20', strand: 'SQL', description: 'Use IN and BETWEEN operators', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.21', strand: 'SQL', description: 'Use ORDER BY for sorting results', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.22', strand: 'SQL', description: 'Use DISTINCT to eliminate duplicates', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.23', strand: 'SQL', description: 'Work with NULL values using IS NULL and IS NOT NULL', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.24', strand: 'SQL', description: 'Use LIKE for pattern matching with wildcards', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.25', strand: 'SQL', description: 'Update records using UPDATE statement', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.26', strand: 'SQL', description: 'Delete records using DELETE statement', skillLevel: 'skill', practicalComponent: true },

  // SQL - Aggregate Functions
  { notation: 'IN.CBSE.C12.CS.DBS.27', strand: 'SQL', description: 'Use aggregate functions: MAX, MIN, AVG, SUM, COUNT', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.28', strand: 'SQL', description: 'Group data using GROUP BY clause', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.29', strand: 'SQL', description: 'Filter groups using HAVING clause', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.30', strand: 'SQL', description: 'Use column aliases for clarity', skillLevel: 'skill', practicalComponent: true },

  // SQL - Joins
  { notation: 'IN.CBSE.C12.CS.DBS.31', strand: 'SQL', description: 'Understand the need for joining tables', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.DBS.32', strand: 'SQL', description: 'Perform Cartesian product of two tables', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.33', strand: 'SQL', description: 'Perform equi-join on two tables', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.DBS.34', strand: 'SQL', description: 'Perform natural join on two tables', skillLevel: 'skill', practicalComponent: true },

  // Python-SQL Connectivity
  { notation: 'IN.CBSE.C12.CS.CON.1', strand: 'Python-SQL Connectivity', description: 'Understand the need for database connectivity', skillLevel: 'knowledge' },
  { notation: 'IN.CBSE.C12.CS.CON.2', strand: 'Python-SQL Connectivity', description: 'Import mysql.connector module', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.3', strand: 'Python-SQL Connectivity', description: 'Connect to MySQL database using connect()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.4', strand: 'Python-SQL Connectivity', description: 'Create cursor object using cursor()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.5', strand: 'Python-SQL Connectivity', description: 'Execute SQL queries using execute()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.6', strand: 'Python-SQL Connectivity', description: 'Commit changes using commit()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.7', strand: 'Python-SQL Connectivity', description: 'Fetch records using fetchone()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.8', strand: 'Python-SQL Connectivity', description: 'Fetch all records using fetchall()', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.9', strand: 'Python-SQL Connectivity', description: 'Use rowcount to count affected rows', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.10', strand: 'Python-SQL Connectivity', description: 'Use parameterized queries with %s format specifier', skillLevel: 'skill', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.11', strand: 'Python-SQL Connectivity', description: 'Perform INSERT operations through Python', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.12', strand: 'Python-SQL Connectivity', description: 'Perform UPDATE operations through Python', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.13', strand: 'Python-SQL Connectivity', description: 'Perform DELETE operations through Python', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.14', strand: 'Python-SQL Connectivity', description: 'Build database applications with user interface', skillLevel: 'application', practicalComponent: true },
  { notation: 'IN.CBSE.C12.CS.CON.15', strand: 'Python-SQL Connectivity', description: 'Handle connection errors and exceptions', skillLevel: 'skill', practicalComponent: true },
];

// ============================================================================
// EXPORT CLASS DATA
// ============================================================================
export const cbseComputerScienceClasses: CBSEComputerScienceClass[] = [
  {
    class: 9,
    ageRangeMin: 14,
    ageRangeMax: 15,
    courseCode: '165',
    courseName: 'Computer Applications',
    standards: class9Standards,
  },
  {
    class: 10,
    ageRangeMin: 15,
    ageRangeMax: 16,
    courseCode: '165',
    courseName: 'Computer Applications',
    standards: class10Standards,
  },
  {
    class: 11,
    ageRangeMin: 16,
    ageRangeMax: 17,
    courseCode: '083',
    courseName: 'Computer Science',
    standards: class11Standards,
  },
  {
    class: 12,
    ageRangeMin: 17,
    ageRangeMax: 18,
    courseCode: '083',
    courseName: 'Computer Science',
    standards: class12Standards,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all standards for a specific class
 */
export function getCBSEComputerScienceStandardsByClass(classNum: number): CBSEComputerScienceStandard[] {
  const classData = cbseComputerScienceClasses.find(c => c.class === classNum);
  return classData?.standards || [];
}

/**
 * Get all standards across all classes
 */
export function getAllCBSEComputerScienceStandards(): CBSEComputerScienceStandard[] {
  return cbseComputerScienceClasses.flatMap(c => c.standards);
}

/**
 * Get standards by strand
 */
export function getCBSEComputerScienceStandardsByStrand(strand: string): CBSEComputerScienceStandard[] {
  return getAllCBSEComputerScienceStandards().filter(s =>
    s.strand.toLowerCase().includes(strand.toLowerCase())
  );
}

/**
 * Get practical-focused standards (for lab work)
 */
export function getCBSEComputerSciencePracticalStandards(): CBSEComputerScienceStandard[] {
  return getAllCBSEComputerScienceStandards().filter(s => s.practicalComponent);
}

/**
 * Get total count of standards
 */
export function getCBSEComputerScienceStandardsCount(): number {
  return getAllCBSEComputerScienceStandards().length;
}

/**
 * Export for curriculum system
 */
export default {
  classes: cbseComputerScienceClasses,
  getStandardsByClass: getCBSEComputerScienceStandardsByClass,
  getAllStandards: getAllCBSEComputerScienceStandards,
  getStandardsByStrand: getCBSEComputerScienceStandardsByStrand,
  getPracticalStandards: getCBSEComputerSciencePracticalStandards,
  getStandardsCount: getCBSEComputerScienceStandardsCount,
};
