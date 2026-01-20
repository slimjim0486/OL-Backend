/**
 * British National Curriculum - History Standards
 * Years 1-9 (Key Stages 1, 2, and 3)
 *
 * Source: GOV.UK National Curriculum in England
 * https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study/national-curriculum-in-england-history-programmes-of-study
 *
 * VERIFIED: 2025-01-20 against official GOV.UK documentation
 *
 * Note: Unlike Maths and Science, History is organised by Key Stage rather than
 * individual year. Standards are replicated across years within each Key Stage
 * to maintain consistency with the seeding system.
 *
 * Notation System: UK.KS{keyStage}.Y{year}.HIS.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1, 2, or 3)
 * - Y = Year (1-9)
 * - HIS = History
 * - Strand codes:
 *   KS1:
 *   - CLM = Changes within Living Memory
 *   - EBL = Events Beyond Living memory
 *   - SIG = Significant Individuals
 *   - LOC = Local History
 *   KS2:
 *   - SAI = Stone Age to Iron Age
 *   - ROM = Roman Empire
 *   - AAS = Anglo-Saxons and Scots
 *   - VIK = Vikings and Anglo-Saxon struggle
 *   - LOC = Local History
 *   - B1066 = British history beyond 1066
 *   - ECV = Earliest Civilizations
 *   - AGR = Ancient Greece
 *   - NES = Non-European Society
 *   KS3:
 *   - DMB = Development of Medieval Britain
 *   - DEB = Development of Early Modern Britain
 *   - DIB = Development of Industrial Britain
 *   - DMO = Development of Modern Britain
 *   - LOC = Local History
 *   - WHI = World History
 *   - HSK = Historical Skills
 */

export interface BritishNCHistoryStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
}

export interface BritishNCHistoryYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCHistoryStandard[];
}

export interface BritishNCHistoryJurisdiction {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCHistoryYear[];
}

// =============================================================================
// KEY STAGE 1: YEARS 1-2 (Ages 5-7)
// History at KS1 focuses on developing awareness of the past and chronology
// =============================================================================

const ks1Standards: BritishNCHistoryStandard[] = [
  // CHANGES WITHIN LIVING MEMORY
  {
    notation: 'UK.KS1.HIS.CLM.1',
    strand: 'Changes within Living Memory',
    description: 'changes within living memory, where appropriate, these should be used to reveal aspects of change in national life',
    isStatutory: true,
    guidance: 'Examples could include: changes in technology, transport, communication, or family life'
  },

  // EVENTS BEYOND LIVING MEMORY
  {
    notation: 'UK.KS1.HIS.EBL.1',
    strand: 'Events Beyond Living Memory',
    description: 'events beyond living memory that are significant nationally or globally',
    isStatutory: true,
    guidance: 'Examples given in NC: the Great Fire of London, the first aeroplane flight, events commemorated through festivals or anniversaries'
  },

  // SIGNIFICANT INDIVIDUALS
  {
    notation: 'UK.KS1.HIS.SIG.1',
    strand: 'Significant Individuals',
    description: 'the lives of significant individuals in the past who have contributed to national and international achievements',
    isStatutory: true,
    guidance: 'Some should be used to compare aspects of life in different periods. Examples given in NC include: Elizabeth I and Queen Victoria, Christopher Columbus and Neil Armstrong, William Caxton and Tim Berners-Lee, Pieter Bruegel the Elder and LS Lowry, Rosa Parks and Emily Davison, Mary Seacole and/or Florence Nightingale and Edith Cavell'
  },

  // LOCAL HISTORY
  {
    notation: 'UK.KS1.HIS.LOC.1',
    strand: 'Local History',
    description: 'significant historical events, people and places in their own locality',
    isStatutory: true
  },

  // HISTORICAL SKILLS - AIMS
  {
    notation: 'UK.KS1.HIS.SKL.1',
    strand: 'Historical Skills',
    description: 'know and understand the history of these islands as a coherent, chronological narrative, from the earliest times to the present day',
    isStatutory: true,
    guidance: 'Aims: how people\'s lives have shaped this nation and how Britain has influenced and been influenced by the wider world'
  },
  {
    notation: 'UK.KS1.HIS.SKL.2',
    strand: 'Historical Skills',
    description: 'know and understand significant aspects of the history of the wider world: the nature of ancient civilisations; the expansion and dissolution of empires; characteristic features of past non-European societies',
    isStatutory: true,
    guidance: 'Aims: achievements and follies of mankind'
  },
  {
    notation: 'UK.KS1.HIS.SKL.3',
    strand: 'Historical Skills',
    description: 'gain and deploy a historically grounded understanding of abstract terms such as "empire", "civilisation", "parliament" and "peasantry"',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.4',
    strand: 'Historical Skills',
    description: 'understand historical concepts such as continuity and change, cause and consequence, similarity, difference and significance',
    isStatutory: true,
    guidance: 'Use these to make connections, draw contrasts, analyse trends, frame historically-valid questions and create their own structured accounts'
  },
  {
    notation: 'UK.KS1.HIS.SKL.5',
    strand: 'Historical Skills',
    description: 'understand the methods of historical enquiry, including how evidence is used rigorously to make historical claims',
    isStatutory: true,
    guidance: 'Discern how and why contrasting arguments and interpretations of the past have been constructed'
  },
  {
    notation: 'UK.KS1.HIS.SKL.6',
    strand: 'Historical Skills',
    description: 'gain historical perspective by placing their growing knowledge into different contexts',
    isStatutory: true,
    guidance: 'Understanding the connections between local, regional, national and international history; between cultural, economic, military, political, religious and social history; and between short- and long-term timescales'
  },

  // KS1 SPECIFIC SKILLS
  {
    notation: 'UK.KS1.HIS.SKL.7',
    strand: 'Historical Skills - KS1',
    description: 'develop an awareness of the past, using common words and phrases relating to the passing of time',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.8',
    strand: 'Historical Skills - KS1',
    description: 'know where the people and events they study fit within a chronological framework',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.9',
    strand: 'Historical Skills - KS1',
    description: 'identify similarities and differences between ways of life in different periods',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.10',
    strand: 'Historical Skills - KS1',
    description: 'use a wide vocabulary of everyday historical terms',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.11',
    strand: 'Historical Skills - KS1',
    description: 'ask and answer questions, choosing and using parts of stories and other sources to show that they know and understand key features of events',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.HIS.SKL.12',
    strand: 'Historical Skills - KS1',
    description: 'understand some of the ways in which we find out about the past and identify different ways in which it is represented',
    isStatutory: true
  }
];

// Create year-specific standards with proper notation
const year1Standards: BritishNCHistoryStandard[] = ks1Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS1.HIS', 'UK.KS1.Y1.HIS')
}));

const year2Standards: BritishNCHistoryStandard[] = ks1Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS1.HIS', 'UK.KS1.Y2.HIS')
}));

// =============================================================================
// KEY STAGE 2: YEARS 3-6 (Ages 7-11)
// History at KS2 covers British, local and world history
// =============================================================================

const ks2Standards: BritishNCHistoryStandard[] = [
  // BRITISH HISTORY - STONE AGE TO IRON AGE
  {
    notation: 'UK.KS2.HIS.SAI.1',
    strand: 'Stone Age to Iron Age',
    description: 'changes in Britain from the Stone Age to the Iron Age',
    isStatutory: true,
    guidance: 'This could include: late Neolithic hunter-gatherers and early farmers (e.g. Skara Brae); Bronze Age religion, technology and travel (e.g. Stonehenge); Iron Age hill forts: tribal kingdoms, farming, art and culture'
  },
  {
    notation: 'UK.KS2.HIS.SAI.2',
    strand: 'Stone Age to Iron Age',
    description: 'late Neolithic hunter-gatherers and early farmers, for example, Skara Brae',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SAI.3',
    strand: 'Stone Age to Iron Age',
    description: 'Bronze Age religion, technology and travel, for example, Stonehenge',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SAI.4',
    strand: 'Stone Age to Iron Age',
    description: 'Iron Age hill forts: tribal kingdoms, farming, art and culture',
    isStatutory: true
  },

  // ROMAN EMPIRE AND ITS IMPACT ON BRITAIN
  {
    notation: 'UK.KS2.HIS.ROM.1',
    strand: 'Roman Empire',
    description: 'the Roman Empire and its impact on Britain',
    isStatutory: true,
    guidance: 'This could include: Julius Caesar\'s attempted invasion in 55-54 BC; the Roman Empire by AD 42 and the power of its army; successful invasion by Claudius and conquest, including Hadrian\'s Wall; British resistance (e.g. Boudica); "Romanisation" of Britain (sites such as Caerwent) and the impact of technology, culture and beliefs, including early Christianity'
  },
  {
    notation: 'UK.KS2.HIS.ROM.2',
    strand: 'Roman Empire',
    description: 'Julius Caesar\'s attempted invasion in 55-54 BC',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.ROM.3',
    strand: 'Roman Empire',
    description: 'the Roman Empire by AD 42 and the power of its army',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.ROM.4',
    strand: 'Roman Empire',
    description: 'successful invasion by Claudius and conquest, including Hadrian\'s Wall',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.ROM.5',
    strand: 'Roman Empire',
    description: 'British resistance, for example, Boudica',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.ROM.6',
    strand: 'Roman Empire',
    description: '"Romanisation" of Britain: sites such as Caerwent and the impact of technology, culture and beliefs, including early Christianity',
    isStatutory: true
  },

  // BRITAIN'S SETTLEMENT BY ANGLO-SAXONS AND SCOTS
  {
    notation: 'UK.KS2.HIS.AAS.1',
    strand: 'Anglo-Saxons and Scots',
    description: 'Britain\'s settlement by Anglo-Saxons and Scots',
    isStatutory: true,
    guidance: 'This could include: Roman withdrawal from Britain in c. AD 410 and the fall of the western Roman Empire; Scots invasions from Ireland to north Britain (now Scotland); Anglo-Saxon invasions, settlements and kingdoms: place names and village life; Anglo-Saxon art and culture; Christian conversion (Canterbury, Iona and Lindisfarne)'
  },
  {
    notation: 'UK.KS2.HIS.AAS.2',
    strand: 'Anglo-Saxons and Scots',
    description: 'Roman withdrawal from Britain in c. AD 410 and the fall of the western Roman Empire',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.AAS.3',
    strand: 'Anglo-Saxons and Scots',
    description: 'Scots invasions from Ireland to north Britain (now Scotland)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.AAS.4',
    strand: 'Anglo-Saxons and Scots',
    description: 'Anglo-Saxon invasions, settlements and kingdoms: place names and village life',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.AAS.5',
    strand: 'Anglo-Saxons and Scots',
    description: 'Anglo-Saxon art and culture',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.AAS.6',
    strand: 'Anglo-Saxons and Scots',
    description: 'Christian conversion – Canterbury, Iona and Lindisfarne',
    isStatutory: true
  },

  // THE VIKING AND ANGLO-SAXON STRUGGLE FOR THE KINGDOM OF ENGLAND
  {
    notation: 'UK.KS2.HIS.VIK.1',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'the Viking and Anglo-Saxon struggle for the Kingdom of England to the time of Edward the Confessor',
    isStatutory: true,
    guidance: 'This could include: Viking raids and invasion; resistance by Alfred the Great and Athelstan, first King of England; further Viking invasions and Danegeld; Anglo-Saxon laws and justice; Edward the Confessor and his death in 1066'
  },
  {
    notation: 'UK.KS2.HIS.VIK.2',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'Viking raids and invasion',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.VIK.3',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'resistance by Alfred the Great and Athelstan, first King of England',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.VIK.4',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'further Viking invasions and Danegeld',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.VIK.5',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'Anglo-Saxon laws and justice',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.VIK.6',
    strand: 'Vikings and Anglo-Saxon Struggle',
    description: 'Edward the Confessor and his death in 1066',
    isStatutory: true
  },

  // LOCAL HISTORY
  {
    notation: 'UK.KS2.HIS.LOC.1',
    strand: 'Local History',
    description: 'a local history study',
    isStatutory: true,
    guidance: 'Examples given in NC: a depth study linked to one of the British areas of study; a study over time tracing how several aspects of national history are reflected in the locality (this can go beyond 1066); a study of an aspect of history or a site dating from a period beyond 1066 that is significant in the locality'
  },
  {
    notation: 'UK.KS2.HIS.LOC.2',
    strand: 'Local History',
    description: 'a depth study linked to one of the British areas of study listed above',
    isStatutory: false,
    guidance: 'Option 1 for local history'
  },
  {
    notation: 'UK.KS2.HIS.LOC.3',
    strand: 'Local History',
    description: 'a study over time tracing how several aspects of national history are reflected in the locality (this can go beyond 1066)',
    isStatutory: false,
    guidance: 'Option 2 for local history'
  },
  {
    notation: 'UK.KS2.HIS.LOC.4',
    strand: 'Local History',
    description: 'a study of an aspect of history or a site dating from a period beyond 1066 that is significant in the locality',
    isStatutory: false,
    guidance: 'Option 3 for local history'
  },

  // A STUDY OF AN ASPECT OR THEME IN BRITISH HISTORY BEYOND 1066
  {
    notation: 'UK.KS2.HIS.B1066.1',
    strand: 'British History Beyond 1066',
    description: 'a study of an aspect or theme in British history that extends pupils\' chronological knowledge beyond 1066',
    isStatutory: true,
    guidance: 'Examples given in NC: the changing power of monarchs using case studies (e.g. John, Anne, Victoria); changes in an aspect of social history (e.g. crime and punishment, leisure and entertainment through the ages); the legacy of Greek or Roman culture (art, architecture, literature) on later periods in British history, including the present day; a significant turning point in British history (e.g. the first railways, the Battle of Britain)'
  },
  {
    notation: 'UK.KS2.HIS.B1066.2',
    strand: 'British History Beyond 1066',
    description: 'the changing power of monarchs using case studies such as John, Anne and Victoria',
    isStatutory: false,
    guidance: 'Example option for British history beyond 1066'
  },
  {
    notation: 'UK.KS2.HIS.B1066.3',
    strand: 'British History Beyond 1066',
    description: 'changes in an aspect of social history, such as crime and punishment from the Anglo-Saxons to the present',
    isStatutory: false,
    guidance: 'Example option for British history beyond 1066'
  },
  {
    notation: 'UK.KS2.HIS.B1066.4',
    strand: 'British History Beyond 1066',
    description: 'the legacy of Greek or Roman culture (art, architecture or literature) on later periods in British history, including the present day',
    isStatutory: false,
    guidance: 'Example option for British history beyond 1066'
  },
  {
    notation: 'UK.KS2.HIS.B1066.5',
    strand: 'British History Beyond 1066',
    description: 'a significant turning point in British history, for example, the first railways or the Battle of Britain',
    isStatutory: false,
    guidance: 'Example option for British history beyond 1066'
  },

  // THE ACHIEVEMENTS OF THE EARLIEST CIVILIZATIONS
  {
    notation: 'UK.KS2.HIS.ECV.1',
    strand: 'Earliest Civilizations',
    description: 'the achievements of the earliest civilizations – an overview of where and when the first civilizations appeared and a depth study of one of the following: Ancient Sumer; The Indus Valley; Ancient Egypt; The Shang Dynasty of Ancient China',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.ECV.2',
    strand: 'Earliest Civilizations',
    description: 'Ancient Sumer: achievements and influence on later civilizations',
    isStatutory: false,
    guidance: 'One of four options for depth study'
  },
  {
    notation: 'UK.KS2.HIS.ECV.3',
    strand: 'Earliest Civilizations',
    description: 'The Indus Valley: achievements and influence on later civilizations',
    isStatutory: false,
    guidance: 'One of four options for depth study'
  },
  {
    notation: 'UK.KS2.HIS.ECV.4',
    strand: 'Earliest Civilizations',
    description: 'Ancient Egypt: achievements and influence on later civilizations',
    isStatutory: false,
    guidance: 'One of four options for depth study'
  },
  {
    notation: 'UK.KS2.HIS.ECV.5',
    strand: 'Earliest Civilizations',
    description: 'The Shang Dynasty of Ancient China: achievements and influence on later civilizations',
    isStatutory: false,
    guidance: 'One of four options for depth study'
  },

  // ANCIENT GREECE
  {
    notation: 'UK.KS2.HIS.AGR.1',
    strand: 'Ancient Greece',
    description: 'Ancient Greece – a study of Greek life and achievements and their influence on the western world',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.AGR.2',
    strand: 'Ancient Greece',
    description: 'Greek life and achievements',
    isStatutory: true,
    guidance: 'Including: democracy, philosophy, theatre, art, architecture'
  },
  {
    notation: 'UK.KS2.HIS.AGR.3',
    strand: 'Ancient Greece',
    description: 'the influence of Ancient Greece on the western world',
    isStatutory: true,
    guidance: 'Including: language, literature, mathematics, Olympics'
  },

  // A NON-EUROPEAN SOCIETY
  {
    notation: 'UK.KS2.HIS.NES.1',
    strand: 'Non-European Society',
    description: 'a non-European society that provides contrasts with British history',
    isStatutory: true,
    guidance: 'One study chosen from: early Islamic civilization (e.g. Baghdad c. AD 900); Mayan civilization c. AD 900; Benin (West Africa) c. AD 900-1300'
  },
  {
    notation: 'UK.KS2.HIS.NES.2',
    strand: 'Non-European Society',
    description: 'early Islamic civilization, including a study of Baghdad c. AD 900',
    isStatutory: false,
    guidance: 'One of three options for non-European society study'
  },
  {
    notation: 'UK.KS2.HIS.NES.3',
    strand: 'Non-European Society',
    description: 'Mayan civilization c. AD 900',
    isStatutory: false,
    guidance: 'One of three options for non-European society study'
  },
  {
    notation: 'UK.KS2.HIS.NES.4',
    strand: 'Non-European Society',
    description: 'Benin (West Africa) c. AD 900-1300',
    isStatutory: false,
    guidance: 'One of three options for non-European society study'
  },

  // KS2 HISTORICAL SKILLS
  {
    notation: 'UK.KS2.HIS.SKL.1',
    strand: 'Historical Skills - KS2',
    description: 'continue to develop a chronologically secure knowledge and understanding of British, local and world history, establishing clear narratives within and across the periods they study',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SKL.2',
    strand: 'Historical Skills - KS2',
    description: 'note connections, contrasts and trends over time and develop the appropriate use of historical terms',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SKL.3',
    strand: 'Historical Skills - KS2',
    description: 'regularly address and sometimes devise historically valid questions about change, cause, similarity and difference, and significance',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SKL.4',
    strand: 'Historical Skills - KS2',
    description: 'construct informed responses that involve thoughtful selection and organisation of relevant historical information',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SKL.5',
    strand: 'Historical Skills - KS2',
    description: 'understand how our knowledge of the past is constructed from a range of sources',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.HIS.SKL.6',
    strand: 'Historical Skills - KS2',
    description: 'construct informed responses that involve thoughtful selection and organisation of relevant historical information',
    isStatutory: true
  }
];

// Create year-specific standards with proper notation
const year3Standards: BritishNCHistoryStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.HIS', 'UK.KS2.Y3.HIS')
}));

const year4Standards: BritishNCHistoryStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.HIS', 'UK.KS2.Y4.HIS')
}));

const year5Standards: BritishNCHistoryStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.HIS', 'UK.KS2.Y5.HIS')
}));

const year6Standards: BritishNCHistoryStandard[] = ks2Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS2.HIS', 'UK.KS2.Y6.HIS')
}));

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// History at KS3 extends and deepens chronological knowledge
// =============================================================================

const ks3Standards: BritishNCHistoryStandard[] = [
  // THE DEVELOPMENT OF CHURCH, STATE AND SOCIETY IN MEDIEVAL BRITAIN 1066-1509
  {
    notation: 'UK.KS3.HIS.DMB.1',
    strand: 'Medieval Britain 1066-1509',
    description: 'the development of Church, state and society in Medieval Britain 1066-1509',
    isStatutory: true,
    guidance: 'Examples given in NC: the Norman Conquest, Magna Carta, Crusades'
  },
  {
    notation: 'UK.KS3.HIS.DMB.2',
    strand: 'Medieval Britain 1066-1509',
    description: 'the Norman Conquest',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.3',
    strand: 'Medieval Britain 1066-1509',
    description: 'Magna Carta',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.4',
    strand: 'Medieval Britain 1066-1509',
    description: 'the Crusades',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.5',
    strand: 'Medieval Britain 1066-1509',
    description: 'the development of Parliament',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.6',
    strand: 'Medieval Britain 1066-1509',
    description: 'the Black Death',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.7',
    strand: 'Medieval Britain 1066-1509',
    description: 'the Peasants\' Revolt',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMB.8',
    strand: 'Medieval Britain 1066-1509',
    description: 'the Wars of the Roses',
    isStatutory: true
  },

  // THE DEVELOPMENT OF CHURCH, STATE AND SOCIETY IN BRITAIN 1509-1745
  {
    notation: 'UK.KS3.HIS.DEB.1',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the development of Church, state and society in Britain 1509-1745',
    isStatutory: true,
    guidance: 'Examples given in NC: Reformation, Civil War, Restoration'
  },
  {
    notation: 'UK.KS3.HIS.DEB.2',
    strand: 'Early Modern Britain 1509-1745',
    description: 'Renaissance and Reformation in Europe and Britain',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.3',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the English Reformation',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.4',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the wider impact of the English Reformation on the Tudor period',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.5',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the English Civil War',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.6',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the Interregnum',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.7',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the Restoration',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.8',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the Glorious Revolution',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DEB.9',
    strand: 'Early Modern Britain 1509-1745',
    description: 'the Act of Union of 1707',
    isStatutory: true
  },

  // IDEAS, POLITICAL POWER, INDUSTRY AND EMPIRE: BRITAIN 1745-1901
  {
    notation: 'UK.KS3.HIS.DIB.1',
    strand: 'Industrial Britain 1745-1901',
    description: 'ideas, political power, industry and empire: Britain, 1745-1901',
    isStatutory: true,
    guidance: 'Examples given in NC: Industrial Revolution, British Empire, slavery and abolition'
  },
  {
    notation: 'UK.KS3.HIS.DIB.2',
    strand: 'Industrial Britain 1745-1901',
    description: 'the Enlightenment',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DIB.3',
    strand: 'Industrial Britain 1745-1901',
    description: 'the impact of the Industrial Revolution',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DIB.4',
    strand: 'Industrial Britain 1745-1901',
    description: 'Britain\'s transatlantic slave trade: its effects and its eventual abolition',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DIB.5',
    strand: 'Industrial Britain 1745-1901',
    description: 'the development of the British Empire',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DIB.6',
    strand: 'Industrial Britain 1745-1901',
    description: 'the struggle for political rights in Britain',
    isStatutory: true,
    guidance: 'Including the Reform Acts, Chartism, women\'s suffrage'
  },
  {
    notation: 'UK.KS3.HIS.DIB.7',
    strand: 'Industrial Britain 1745-1901',
    description: 'social reform',
    isStatutory: true,
    guidance: 'Including factory acts, public health, education'
  },
  {
    notation: 'UK.KS3.HIS.DIB.8',
    strand: 'Industrial Britain 1745-1901',
    description: 'Victorian Britain',
    isStatutory: true,
    guidance: 'Including the Great Exhibition, railways, urban development'
  },

  // CHALLENGES FOR BRITAIN, EUROPE AND THE WIDER WORLD 1901 TO THE PRESENT DAY
  {
    notation: 'UK.KS3.HIS.DMO.1',
    strand: 'Modern Britain 1901-Present',
    description: 'challenges for Britain, Europe and the wider world 1901 to the present day',
    isStatutory: true,
    guidance: 'Examples given in NC: two World Wars, Holocaust, Britain since 1948'
  },
  {
    notation: 'UK.KS3.HIS.DMO.2',
    strand: 'Modern Britain 1901-Present',
    description: 'women\'s suffrage',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.3',
    strand: 'Modern Britain 1901-Present',
    description: 'the First World War and the Peace Settlement',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.4',
    strand: 'Modern Britain 1901-Present',
    description: 'the inter-war years: the Great Depression and the rise of dictators',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.5',
    strand: 'Modern Britain 1901-Present',
    description: 'the Second World War and the Holocaust',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.6',
    strand: 'Modern Britain 1901-Present',
    description: 'the creation of the welfare state',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.7',
    strand: 'Modern Britain 1901-Present',
    description: 'Indian independence and the end of Empire',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.8',
    strand: 'Modern Britain 1901-Present',
    description: 'the Cold War',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.9',
    strand: 'Modern Britain 1901-Present',
    description: 'decolonisation',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.DMO.10',
    strand: 'Modern Britain 1901-Present',
    description: 'social, cultural and technological change in post-war British society',
    isStatutory: true
  },

  // A LOCAL HISTORY STUDY
  {
    notation: 'UK.KS3.HIS.LOC.1',
    strand: 'Local History',
    description: 'a local history study',
    isStatutory: true
  },

  // A STUDY OF AN ASPECT OR THEME IN BRITISH HISTORY
  {
    notation: 'UK.KS3.HIS.THM.1',
    strand: 'Thematic Study',
    description: 'a study of an aspect or theme in British history that consolidates and extends pupils\' chronological knowledge from before 1066',
    isStatutory: true
  },

  // AT LEAST ONE STUDY OF A SIGNIFICANT SOCIETY OR ISSUE IN WORLD HISTORY
  {
    notation: 'UK.KS3.HIS.WHI.1',
    strand: 'World History',
    description: 'at least one study of a significant society or issue in world history and its interconnections with other world developments',
    isStatutory: true,
    guidance: 'Examples given in NC: Mughal India 1526-1857; China\'s Qing dynasty 1644-1911; Changing Russian empires c.1800-1989; USA in the 20th Century'
  },
  {
    notation: 'UK.KS3.HIS.WHI.2',
    strand: 'World History',
    description: 'Mughal India 1526-1857',
    isStatutory: false,
    guidance: 'Example option for world history study'
  },
  {
    notation: 'UK.KS3.HIS.WHI.3',
    strand: 'World History',
    description: 'China\'s Qing dynasty 1644-1911',
    isStatutory: false,
    guidance: 'Example option for world history study'
  },
  {
    notation: 'UK.KS3.HIS.WHI.4',
    strand: 'World History',
    description: 'Changing Russian empires c.1800-1989',
    isStatutory: false,
    guidance: 'Example option for world history study'
  },
  {
    notation: 'UK.KS3.HIS.WHI.5',
    strand: 'World History',
    description: 'USA in the 20th Century',
    isStatutory: false,
    guidance: 'Example option for world history study'
  },

  // KS3 HISTORICAL SKILLS
  {
    notation: 'UK.KS3.HIS.SKL.1',
    strand: 'Historical Skills - KS3',
    description: 'extend and deepen their chronologically secure knowledge and understanding of British, local and world history, so that it provides a well-informed context for wider learning',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.SKL.2',
    strand: 'Historical Skills - KS3',
    description: 'identify significant events, make connections, draw contrasts, and analyse trends within periods and over long arcs of time',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.SKL.3',
    strand: 'Historical Skills - KS3',
    description: 'use historical terms and concepts in increasingly sophisticated ways',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.SKL.4',
    strand: 'Historical Skills - KS3',
    description: 'pursue historically valid enquiries including some they have framed themselves, and create relevant, structured and evidentially supported accounts in response',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.SKL.5',
    strand: 'Historical Skills - KS3',
    description: 'understand how different types of historical sources are used rigorously to make historical claims and discern how and why contrasting arguments and interpretations of the past have been constructed',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.HIS.SKL.6',
    strand: 'Historical Skills - KS3',
    description: 'gain historical perspective by placing their growing knowledge into different contexts: understanding the connections between local, regional, national and international history; between cultural, economic, military, political, religious and social history; and between short- and long-term timescales',
    isStatutory: true
  }
];

// Create year-specific standards with proper notation
const year7Standards: BritishNCHistoryStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.HIS', 'UK.KS3.Y7.HIS')
}));

const year8Standards: BritishNCHistoryStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.HIS', 'UK.KS3.Y8.HIS')
}));

const year9Standards: BritishNCHistoryStandard[] = ks3Standards.map(std => ({
  ...std,
  notation: std.notation.replace('UK.KS3.HIS', 'UK.KS3.Y9.HIS')
}));

// =============================================================================
// BRITISH NATIONAL CURRICULUM HISTORY DATA EXPORT
// =============================================================================

export const britishNCHistory: BritishNCHistoryJurisdiction = {
  code: 'UK_NATIONAL_CURRICULUM',
  name: 'British National Curriculum - History',
  country: 'GB',
  version: '2014 (verified January 2025)',
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-history-programmes-of-study/national-curriculum-in-england-history-programmes-of-study',
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
export function getHistoryStandardsForYear(year: number): BritishNCHistoryStandard[] {
  const yearData = britishNCHistory.years.find(y => y.year === year);
  return yearData?.standards || [];
}

export function getHistoryStandardsForKeyStage(keyStage: number): BritishNCHistoryStandard[] {
  return britishNCHistory.years
    .filter(y => y.keyStage === keyStage)
    .flatMap(y => y.standards);
}

export function getTotalHistoryStandardsCount(): number {
  return britishNCHistory.years.reduce((sum, y) => sum + y.standards.length, 0);
}

export default britishNCHistory;
