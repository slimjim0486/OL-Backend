/**
 * IB PYP Social Studies Curriculum Data
 *
 * Source: IB PYP Social Studies Scope and Sequence (2008)
 * https://teachingandlearninginthepyp.weebly.com/uploads/2/8/7/7/28779711/social_studies_scope_and_sequence.pdf
 *
 * Structure:
 * - 4 Age Bands: 3-5, 5-7, 7-9, 9-12
 * - 5 Strands: Human Systems, Social Organization, Continuity & Change, Human & Natural Environments, Resources
 *
 * Notation System: IB.PYP.{ageBand}.SS.{strand}.{number}
 * - AgeBand: A1 (3-5), A2 (5-7), A3 (7-9), A4 (9-12)
 * - Subject: SS (Social Studies)
 * - Strand: HS (Human Systems), SO (Social Organization), CC (Continuity & Change),
 *           HN (Human & Natural Environments), RE (Resources & Environment)
 *
 * Verified against official IB documentation: 2025-01-20
 */

export interface IBPYPSocialStudiesStandard {
  notation: string;
  strand: string;
  description: string;
}

export interface IBPYPSocialStudiesAgeBand {
  ageBand: string;
  ageBandLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  gradeEquivalent: string;
  standards: IBPYPSocialStudiesStandard[];
}

export interface IBPYPSocialStudiesCurriculum {
  curriculumCode: string;
  curriculumName: string;
  subject: 'SOCIAL_STUDIES';
  ageBands: IBPYPSocialStudiesAgeBand[];
}

export const ibPYPSocialStudiesCurriculum: IBPYPSocialStudiesCurriculum = {
  curriculumCode: 'IB_PYP',
  curriculumName: 'International Baccalaureate Primary Years Programme',
  subject: 'SOCIAL_STUDIES',
  ageBands: [
    // =====================================================
    // AGE BAND 1: Ages 3-5 (Early Years/Pre-K to K)
    // =====================================================
    {
      ageBand: 'A1',
      ageBandLabel: 'Age Band 1 (Ages 3-5)',
      ageRangeMin: 3,
      ageRangeMax: 5,
      gradeEquivalent: 'Pre-K to Kindergarten',
      standards: [
        // Human Systems and Economic Activities Strand
        {
          notation: 'IB.PYP.A1.SS.HS.1',
          strand: 'Human Systems and Economic Activities',
          description: 'Recognize that people have different jobs and roles in the community',
        },
        {
          notation: 'IB.PYP.A1.SS.HS.2',
          strand: 'Human Systems and Economic Activities',
          description: 'Identify basic needs (food, clothing, shelter) and how people meet them',
        },
        {
          notation: 'IB.PYP.A1.SS.HS.3',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand that goods and services are exchanged for money',
        },
        {
          notation: 'IB.PYP.A1.SS.HS.4',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore how families work together to meet their needs',
        },
        {
          notation: 'IB.PYP.A1.SS.HS.5',
          strand: 'Human Systems and Economic Activities',
          description: 'Recognize places in the local community (shops, schools, hospitals)',
        },
        {
          notation: 'IB.PYP.A1.SS.HS.6',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand the concept of wants versus needs',
        },

        // Social Organization and Culture Strand
        {
          notation: 'IB.PYP.A1.SS.SO.1',
          strand: 'Social Organization and Culture',
          description: 'Recognize that people belong to different groups (family, class, community)',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.2',
          strand: 'Social Organization and Culture',
          description: 'Identify different family structures and roles within families',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.3',
          strand: 'Social Organization and Culture',
          description: 'Explore how people celebrate special occasions and traditions',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.4',
          strand: 'Social Organization and Culture',
          description: 'Recognize that people have different languages and cultures',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.5',
          strand: 'Social Organization and Culture',
          description: 'Understand basic rules that help people live together',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.6',
          strand: 'Social Organization and Culture',
          description: 'Explore how people express feelings and communicate with others',
        },
        {
          notation: 'IB.PYP.A1.SS.SO.7',
          strand: 'Social Organization and Culture',
          description: 'Recognize similarities and differences between self and others',
        },

        // Continuity and Change Through Time Strand
        {
          notation: 'IB.PYP.A1.SS.CC.1',
          strand: 'Continuity and Change Through Time',
          description: 'Understand the sequence of daily routines and events',
        },
        {
          notation: 'IB.PYP.A1.SS.CC.2',
          strand: 'Continuity and Change Through Time',
          description: 'Recognize that people grow and change over time',
        },
        {
          notation: 'IB.PYP.A1.SS.CC.3',
          strand: 'Continuity and Change Through Time',
          description: 'Explore personal and family history through stories and photographs',
        },
        {
          notation: 'IB.PYP.A1.SS.CC.4',
          strand: 'Continuity and Change Through Time',
          description: 'Understand concepts of past, present, and future',
        },
        {
          notation: 'IB.PYP.A1.SS.CC.5',
          strand: 'Continuity and Change Through Time',
          description: 'Recognize that objects and places change over time',
        },
        {
          notation: 'IB.PYP.A1.SS.CC.6',
          strand: 'Continuity and Change Through Time',
          description: 'Explore how special days and holidays are celebrated',
        },

        // Human and Natural Environments Strand
        {
          notation: 'IB.PYP.A1.SS.HN.1',
          strand: 'Human and Natural Environments',
          description: 'Identify features of the local environment (home, school, neighborhood)',
        },
        {
          notation: 'IB.PYP.A1.SS.HN.2',
          strand: 'Human and Natural Environments',
          description: 'Recognize different types of places (urban, rural, natural)',
        },
        {
          notation: 'IB.PYP.A1.SS.HN.3',
          strand: 'Human and Natural Environments',
          description: 'Understand that people adapt to and change their environment',
        },
        {
          notation: 'IB.PYP.A1.SS.HN.4',
          strand: 'Human and Natural Environments',
          description: 'Explore how weather affects daily activities',
        },
        {
          notation: 'IB.PYP.A1.SS.HN.5',
          strand: 'Human and Natural Environments',
          description: 'Use simple maps and pictures to locate places',
        },
        {
          notation: 'IB.PYP.A1.SS.HN.6',
          strand: 'Human and Natural Environments',
          description: 'Recognize the difference between land and water on Earth',
        },

        // Resources and the Environment Strand
        {
          notation: 'IB.PYP.A1.SS.RE.1',
          strand: 'Resources and the Environment',
          description: 'Identify natural resources in the local environment (water, plants, animals)',
        },
        {
          notation: 'IB.PYP.A1.SS.RE.2',
          strand: 'Resources and the Environment',
          description: 'Understand that resources are used to make things people need',
        },
        {
          notation: 'IB.PYP.A1.SS.RE.3',
          strand: 'Resources and the Environment',
          description: 'Explore ways to care for the environment',
        },
        {
          notation: 'IB.PYP.A1.SS.RE.4',
          strand: 'Resources and the Environment',
          description: 'Recognize that some things can be reused and recycled',
        },
        {
          notation: 'IB.PYP.A1.SS.RE.5',
          strand: 'Resources and the Environment',
          description: 'Understand that clean air, water, and land are important for living things',
        },
        {
          notation: 'IB.PYP.A1.SS.RE.6',
          strand: 'Resources and the Environment',
          description: 'Explore how people use plants and animals for food and materials',
        },
      ],
    },

    // =====================================================
    // AGE BAND 2: Ages 5-7 (Grade 1-2)
    // =====================================================
    {
      ageBand: 'A2',
      ageBandLabel: 'Age Band 2 (Ages 5-7)',
      ageRangeMin: 5,
      ageRangeMax: 7,
      gradeEquivalent: 'Grade 1-2',
      standards: [
        // Human Systems and Economic Activities Strand
        {
          notation: 'IB.PYP.A2.SS.HS.1',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand how communities are organized to meet needs and wants',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.2',
          strand: 'Human Systems and Economic Activities',
          description: 'Identify different types of work and occupations in the community',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.3',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore the concept of trade and exchange between people',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.4',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand that goods come from different places (local and far away)',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.5',
          strand: 'Human Systems and Economic Activities',
          description: 'Recognize the role of transportation in connecting places and people',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.6',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore how technology helps people work and communicate',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.7',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand the difference between producers and consumers',
        },
        {
          notation: 'IB.PYP.A2.SS.HS.8',
          strand: 'Human Systems and Economic Activities',
          description: 'Recognize that people make choices about spending and saving',
        },

        // Social Organization and Culture Strand
        {
          notation: 'IB.PYP.A2.SS.SO.1',
          strand: 'Social Organization and Culture',
          description: 'Explore how different cultures express their beliefs and values',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.2',
          strand: 'Social Organization and Culture',
          description: 'Understand that communities have rules and laws to help people live together',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.3',
          strand: 'Social Organization and Culture',
          description: 'Identify different cultural celebrations and their significance',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.4',
          strand: 'Social Organization and Culture',
          description: 'Recognize that people have rights and responsibilities',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.5',
          strand: 'Social Organization and Culture',
          description: 'Explore how art, music, and stories reflect culture',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.6',
          strand: 'Social Organization and Culture',
          description: 'Understand the concept of fairness in social relationships',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.7',
          strand: 'Social Organization and Culture',
          description: 'Recognize that people can belong to multiple groups and communities',
        },
        {
          notation: 'IB.PYP.A2.SS.SO.8',
          strand: 'Social Organization and Culture',
          description: 'Explore how people cooperate to solve problems',
        },

        // Continuity and Change Through Time Strand
        {
          notation: 'IB.PYP.A2.SS.CC.1',
          strand: 'Continuity and Change Through Time',
          description: 'Understand that some things stay the same while others change',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.2',
          strand: 'Continuity and Change Through Time',
          description: 'Explore how life in the past was different from today',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.3',
          strand: 'Continuity and Change Through Time',
          description: 'Use timelines to sequence events and experiences',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.4',
          strand: 'Continuity and Change Through Time',
          description: 'Investigate family and community history through artifacts and stories',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.5',
          strand: 'Continuity and Change Through Time',
          description: 'Recognize significant people and events from the past',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.6',
          strand: 'Continuity and Change Through Time',
          description: 'Understand how technology has changed over time',
        },
        {
          notation: 'IB.PYP.A2.SS.CC.7',
          strand: 'Continuity and Change Through Time',
          description: 'Explore how transportation and communication have changed',
        },

        // Human and Natural Environments Strand
        {
          notation: 'IB.PYP.A2.SS.HN.1',
          strand: 'Human and Natural Environments',
          description: 'Use maps and globes to locate places and features',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.2',
          strand: 'Human and Natural Environments',
          description: 'Identify physical features of the environment (mountains, rivers, plains)',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.3',
          strand: 'Human and Natural Environments',
          description: 'Understand how climate affects how people live',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.4',
          strand: 'Human and Natural Environments',
          description: 'Explore how people modify the environment to meet their needs',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.5',
          strand: 'Human and Natural Environments',
          description: 'Recognize different types of communities (coastal, mountain, desert)',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.6',
          strand: 'Human and Natural Environments',
          description: 'Understand cardinal directions and use them to describe locations',
        },
        {
          notation: 'IB.PYP.A2.SS.HN.7',
          strand: 'Human and Natural Environments',
          description: 'Explore the relationship between where people live and what they do',
        },

        // Resources and the Environment Strand
        {
          notation: 'IB.PYP.A2.SS.RE.1',
          strand: 'Resources and the Environment',
          description: 'Identify natural and human-made resources in the environment',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.2',
          strand: 'Resources and the Environment',
          description: 'Understand that resources can be renewable or non-renewable',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.3',
          strand: 'Resources and the Environment',
          description: 'Explore how people use resources responsibly and irresponsibly',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.4',
          strand: 'Resources and the Environment',
          description: 'Recognize the importance of reducing, reusing, and recycling',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.5',
          strand: 'Resources and the Environment',
          description: 'Understand how human actions affect the environment',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.6',
          strand: 'Resources and the Environment',
          description: 'Explore ways communities protect and conserve resources',
        },
        {
          notation: 'IB.PYP.A2.SS.RE.7',
          strand: 'Resources and the Environment',
          description: 'Recognize the interconnection between humans and the environment',
        },
      ],
    },

    // =====================================================
    // AGE BAND 3: Ages 7-9 (Grade 3-4)
    // =====================================================
    {
      ageBand: 'A3',
      ageBandLabel: 'Age Band 3 (Ages 7-9)',
      ageRangeMin: 7,
      ageRangeMax: 9,
      gradeEquivalent: 'Grade 3-4',
      standards: [
        // Human Systems and Economic Activities Strand
        {
          notation: 'IB.PYP.A3.SS.HS.1',
          strand: 'Human Systems and Economic Activities',
          description: 'Analyze how supply and demand affect prices and availability of goods',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.2',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand the concept of specialization and division of labor',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.3',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore how businesses operate and create products and services',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.4',
          strand: 'Human Systems and Economic Activities',
          description: 'Investigate patterns of migration and their causes',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.5',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand how transportation networks connect places globally',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.6',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore the impact of technology on work and daily life',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.7',
          strand: 'Human Systems and Economic Activities',
          description: 'Recognize that economic decisions involve trade-offs and opportunity costs',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.8',
          strand: 'Human Systems and Economic Activities',
          description: 'Investigate how different regions specialize in particular products',
        },
        {
          notation: 'IB.PYP.A3.SS.HS.9',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand the role of imports and exports in the economy',
        },

        // Social Organization and Culture Strand
        {
          notation: 'IB.PYP.A3.SS.SO.1',
          strand: 'Social Organization and Culture',
          description: 'Compare different systems of government and decision-making',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.2',
          strand: 'Social Organization and Culture',
          description: 'Understand the structure and function of local government',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.3',
          strand: 'Social Organization and Culture',
          description: 'Explore how cultural practices and traditions are passed down',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.4',
          strand: 'Social Organization and Culture',
          description: 'Investigate how media influences culture and society',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.5',
          strand: 'Social Organization and Culture',
          description: 'Understand concepts of equality, justice, and human rights',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.6',
          strand: 'Social Organization and Culture',
          description: 'Explore how societies address conflict and promote peace',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.7',
          strand: 'Social Organization and Culture',
          description: 'Recognize the contributions of diverse cultures to society',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.8',
          strand: 'Social Organization and Culture',
          description: 'Investigate how social groups and institutions shape individual identity',
        },
        {
          notation: 'IB.PYP.A3.SS.SO.9',
          strand: 'Social Organization and Culture',
          description: 'Explore the role of education in society',
        },

        // Continuity and Change Through Time Strand
        {
          notation: 'IB.PYP.A3.SS.CC.1',
          strand: 'Continuity and Change Through Time',
          description: 'Investigate key events and turning points in local and national history',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.2',
          strand: 'Continuity and Change Through Time',
          description: 'Analyze how societies have changed over different historical periods',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.3',
          strand: 'Continuity and Change Through Time',
          description: 'Use primary and secondary sources to learn about the past',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.4',
          strand: 'Continuity and Change Through Time',
          description: 'Understand the concept of cause and effect in historical events',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.5',
          strand: 'Continuity and Change Through Time',
          description: 'Explore how ancient civilizations developed and influenced modern life',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.6',
          strand: 'Continuity and Change Through Time',
          description: 'Recognize that history can be interpreted from different perspectives',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.7',
          strand: 'Continuity and Change Through Time',
          description: 'Investigate how technological innovations have shaped history',
        },
        {
          notation: 'IB.PYP.A3.SS.CC.8',
          strand: 'Continuity and Change Through Time',
          description: 'Understand the significance of historical documents and monuments',
        },

        // Human and Natural Environments Strand
        {
          notation: 'IB.PYP.A3.SS.HN.1',
          strand: 'Human and Natural Environments',
          description: 'Read and interpret different types of maps (political, physical, thematic)',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.2',
          strand: 'Human and Natural Environments',
          description: 'Understand how geographic features influence settlement patterns',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.3',
          strand: 'Human and Natural Environments',
          description: 'Investigate how different regions of the world have distinct climates and ecosystems',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.4',
          strand: 'Human and Natural Environments',
          description: 'Explore the relationship between natural hazards and human settlements',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.5',
          strand: 'Human and Natural Environments',
          description: 'Analyze patterns of population distribution and density',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.6',
          strand: 'Human and Natural Environments',
          description: 'Understand latitude, longitude, and coordinate systems',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.7',
          strand: 'Human and Natural Environments',
          description: 'Explore how urban and rural areas are interconnected',
        },
        {
          notation: 'IB.PYP.A3.SS.HN.8',
          strand: 'Human and Natural Environments',
          description: 'Investigate the physical and human characteristics of different world regions',
        },

        // Resources and the Environment Strand
        {
          notation: 'IB.PYP.A3.SS.RE.1',
          strand: 'Resources and the Environment',
          description: 'Analyze how natural resources are distributed unevenly around the world',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.2',
          strand: 'Resources and the Environment',
          description: 'Understand the environmental impacts of resource extraction and use',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.3',
          strand: 'Resources and the Environment',
          description: 'Explore concepts of sustainability and sustainable development',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.4',
          strand: 'Resources and the Environment',
          description: 'Investigate how human activities contribute to pollution and environmental degradation',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.5',
          strand: 'Resources and the Environment',
          description: 'Understand the importance of biodiversity and ecosystem conservation',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.6',
          strand: 'Resources and the Environment',
          description: 'Explore how energy sources power modern society',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.7',
          strand: 'Resources and the Environment',
          description: 'Recognize the role of international cooperation in environmental protection',
        },
        {
          notation: 'IB.PYP.A3.SS.RE.8',
          strand: 'Resources and the Environment',
          description: 'Investigate solutions to environmental challenges',
        },
      ],
    },

    // =====================================================
    // AGE BAND 4: Ages 9-12 (Grade 5-6)
    // =====================================================
    {
      ageBand: 'A4',
      ageBandLabel: 'Age Band 4 (Ages 9-12)',
      ageRangeMin: 9,
      ageRangeMax: 12,
      gradeEquivalent: 'Grade 5-6',
      standards: [
        // Human Systems and Economic Activities Strand
        {
          notation: 'IB.PYP.A4.SS.HS.1',
          strand: 'Human Systems and Economic Activities',
          description: 'Analyze the interconnected nature of the global economy',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.2',
          strand: 'Human Systems and Economic Activities',
          description: 'Evaluate the impacts of globalization on different communities',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.3',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand economic systems (market, command, mixed economies)',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.4',
          strand: 'Human Systems and Economic Activities',
          description: 'Investigate factors that influence economic development',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.5',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore the role of international trade and organizations',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.6',
          strand: 'Human Systems and Economic Activities',
          description: 'Analyze patterns of urbanization and their consequences',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.7',
          strand: 'Human Systems and Economic Activities',
          description: 'Understand the relationship between employment, income, and quality of life',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.8',
          strand: 'Human Systems and Economic Activities',
          description: 'Investigate how multinational corporations operate across borders',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.9',
          strand: 'Human Systems and Economic Activities',
          description: 'Explore ethical considerations in economic decision-making',
        },
        {
          notation: 'IB.PYP.A4.SS.HS.10',
          strand: 'Human Systems and Economic Activities',
          description: 'Analyze the causes and effects of economic inequality',
        },

        // Social Organization and Culture Strand
        {
          notation: 'IB.PYP.A4.SS.SO.1',
          strand: 'Social Organization and Culture',
          description: 'Compare democratic and non-democratic forms of government',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.2',
          strand: 'Social Organization and Culture',
          description: 'Understand the principles of citizenship and civic participation',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.3',
          strand: 'Social Organization and Culture',
          description: 'Investigate how social movements have driven change in society',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.4',
          strand: 'Social Organization and Culture',
          description: 'Analyze the role of international organizations in global governance',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.5',
          strand: 'Social Organization and Culture',
          description: 'Explore issues of identity, diversity, and inclusion',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.6',
          strand: 'Social Organization and Culture',
          description: 'Understand how cultural globalization affects local cultures',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.7',
          strand: 'Social Organization and Culture',
          description: 'Investigate human rights issues and their resolution',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.8',
          strand: 'Social Organization and Culture',
          description: 'Explore the relationship between religion, culture, and society',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.9',
          strand: 'Social Organization and Culture',
          description: 'Analyze the impact of digital technology on social interactions',
        },
        {
          notation: 'IB.PYP.A4.SS.SO.10',
          strand: 'Social Organization and Culture',
          description: 'Understand the causes and consequences of conflict and cooperation',
        },

        // Continuity and Change Through Time Strand
        {
          notation: 'IB.PYP.A4.SS.CC.1',
          strand: 'Continuity and Change Through Time',
          description: 'Analyze major world civilizations and their contributions to human development',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.2',
          strand: 'Continuity and Change Through Time',
          description: 'Investigate the causes and consequences of significant historical events',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.3',
          strand: 'Continuity and Change Through Time',
          description: 'Evaluate historical sources for reliability and bias',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.4',
          strand: 'Continuity and Change Through Time',
          description: 'Understand how historiography and interpretations of history change over time',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.5',
          strand: 'Continuity and Change Through Time',
          description: 'Explore the connections between historical events and contemporary issues',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.6',
          strand: 'Continuity and Change Through Time',
          description: 'Analyze the impact of revolutions and reform movements',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.7',
          strand: 'Continuity and Change Through Time',
          description: 'Investigate the causes and effects of colonialism and imperialism',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.8',
          strand: 'Continuity and Change Through Time',
          description: 'Understand the development of human rights throughout history',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.9',
          strand: 'Continuity and Change Through Time',
          description: 'Explore how ideas and knowledge have spread across civilizations',
        },
        {
          notation: 'IB.PYP.A4.SS.CC.10',
          strand: 'Continuity and Change Through Time',
          description: 'Analyze the role of individuals and groups in shaping history',
        },

        // Human and Natural Environments Strand
        {
          notation: 'IB.PYP.A4.SS.HN.1',
          strand: 'Human and Natural Environments',
          description: 'Analyze the relationship between physical geography and human activity',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.2',
          strand: 'Human and Natural Environments',
          description: 'Use geographic information systems (GIS) and digital mapping tools',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.3',
          strand: 'Human and Natural Environments',
          description: 'Investigate global climate patterns and their effects on regions',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.4',
          strand: 'Human and Natural Environments',
          description: 'Understand the causes and effects of human migration patterns',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.5',
          strand: 'Human and Natural Environments',
          description: 'Explore issues of land use and urban planning',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.6',
          strand: 'Human and Natural Environments',
          description: 'Analyze the impacts of natural disasters on human populations',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.7',
          strand: 'Human and Natural Environments',
          description: 'Investigate how cultural factors influence human-environment interactions',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.8',
          strand: 'Human and Natural Environments',
          description: 'Understand geopolitical issues and their geographic dimensions',
        },
        {
          notation: 'IB.PYP.A4.SS.HN.9',
          strand: 'Human and Natural Environments',
          description: 'Explore the spatial organization of human societies',
        },

        // Resources and the Environment Strand
        {
          notation: 'IB.PYP.A4.SS.RE.1',
          strand: 'Resources and the Environment',
          description: 'Analyze global environmental challenges (climate change, deforestation, pollution)',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.2',
          strand: 'Resources and the Environment',
          description: 'Evaluate different approaches to environmental management and policy',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.3',
          strand: 'Resources and the Environment',
          description: 'Understand the concept of ecological footprint and its implications',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.4',
          strand: 'Resources and the Environment',
          description: 'Investigate the relationship between economic development and environmental sustainability',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.5',
          strand: 'Resources and the Environment',
          description: 'Explore renewable energy technologies and their potential',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.6',
          strand: 'Resources and the Environment',
          description: 'Analyze water scarcity as a global issue and potential solutions',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.7',
          strand: 'Resources and the Environment',
          description: 'Understand the role of international agreements in addressing environmental issues',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.8',
          strand: 'Resources and the Environment',
          description: 'Explore food security and sustainable agriculture practices',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.9',
          strand: 'Resources and the Environment',
          description: 'Investigate how individuals and communities can take action for sustainability',
        },
        {
          notation: 'IB.PYP.A4.SS.RE.10',
          strand: 'Resources and the Environment',
          description: 'Analyze the ethical dimensions of environmental decision-making',
        },
      ],
    },
  ],
};

// Helper functions
export function getIBPYPSocialStudiesAgeBandByAge(
  age: number
): IBPYPSocialStudiesAgeBand | undefined {
  return ibPYPSocialStudiesCurriculum.ageBands.find(
    (band) => age >= band.ageRangeMin && age <= band.ageRangeMax
  );
}

export function getIBPYPSocialStudiesStandardsByStrand(
  strand: string
): IBPYPSocialStudiesStandard[] {
  return ibPYPSocialStudiesCurriculum.ageBands.flatMap((band) =>
    band.standards.filter((std) => std.strand === strand)
  );
}

export function getAllIBPYPSocialStudiesStandards(): IBPYPSocialStudiesStandard[] {
  return ibPYPSocialStudiesCurriculum.ageBands.flatMap((band) => band.standards);
}

export function getIBPYPSocialStudiesStandardByNotation(
  notation: string
): IBPYPSocialStudiesStandard | undefined {
  for (const band of ibPYPSocialStudiesCurriculum.ageBands) {
    const standard = band.standards.find((std) => std.notation === notation);
    if (standard) return standard;
  }
  return undefined;
}

export function getTotalIBPYPSocialStudiesCount(): number {
  return ibPYPSocialStudiesCurriculum.ageBands.reduce(
    (total, band) => total + band.standards.length,
    0
  );
}

export default ibPYPSocialStudiesCurriculum;
