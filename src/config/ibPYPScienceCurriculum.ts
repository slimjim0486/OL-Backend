/**
 * IB PYP Science Curriculum Data
 *
 * Source: IB PYP Science Scope and Sequence (2009)
 *
 * Structure:
 * - 4 Age Bands: 3-5, 5-7, 7-9, 9-12
 * - 4 Strands: Living Things, Earth and Space, Materials and Matter, Forces and Energy
 *
 * Notation System: IB.PYP.{ageBand}.SC.{strand}.{number}
 * - AgeBand: A1 (3-5), A2 (5-7), A3 (7-9), A4 (9-12)
 * - Subject: SC (Science)
 * - Strand: LT (Living Things), ES (Earth and Space), MM (Materials and Matter), FE (Forces and Energy)
 */

export interface IBPYPScienceStandard {
  notation: string;
  strand: string;
  description: string;
}

export interface IBPYPScienceAgeBand {
  ageBand: string;
  ageBandLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  gradeEquivalent: string;
  standards: IBPYPScienceStandard[];
}

export interface IBPYPScienceCurriculum {
  curriculumCode: string;
  curriculumName: string;
  subject: 'SCIENCE';
  ageBands: IBPYPScienceAgeBand[];
}

export const ibPYPScienceCurriculum: IBPYPScienceCurriculum = {
  curriculumCode: 'IB_PYP',
  curriculumName: 'International Baccalaureate Primary Years Programme',
  subject: 'SCIENCE',
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
        // Living Things Strand
        {
          notation: 'IB.PYP.A1.SC.LT.1',
          strand: 'Living Things',
          description: 'Observe living things in their environment'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.2',
          strand: 'Living Things',
          description: 'Identify the differences between living and non-living things'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.3',
          strand: 'Living Things',
          description: 'Recognize that living things grow and change'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.4',
          strand: 'Living Things',
          description: 'Explore the basic needs of living things (food, water, air, shelter)'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.5',
          strand: 'Living Things',
          description: 'Observe and describe similarities and differences between plants and animals'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.6',
          strand: 'Living Things',
          description: 'Recognize that humans are living things with basic needs'
        },
        {
          notation: 'IB.PYP.A1.SC.LT.7',
          strand: 'Living Things',
          description: 'Use senses to explore living things and their environments'
        },

        // Earth and Space Strand
        {
          notation: 'IB.PYP.A1.SC.ES.1',
          strand: 'Earth and Space',
          description: 'Observe daily and seasonal changes in weather'
        },
        {
          notation: 'IB.PYP.A1.SC.ES.2',
          strand: 'Earth and Space',
          description: 'Recognize the difference between day and night'
        },
        {
          notation: 'IB.PYP.A1.SC.ES.3',
          strand: 'Earth and Space',
          description: 'Observe and describe the sun, moon, and stars'
        },
        {
          notation: 'IB.PYP.A1.SC.ES.4',
          strand: 'Earth and Space',
          description: 'Explore features of the local environment (soil, rocks, water)'
        },
        {
          notation: 'IB.PYP.A1.SC.ES.5',
          strand: 'Earth and Space',
          description: 'Recognize that weather affects daily activities'
        },
        {
          notation: 'IB.PYP.A1.SC.ES.6',
          strand: 'Earth and Space',
          description: 'Explore natural resources in the immediate environment'
        },

        // Materials and Matter Strand
        {
          notation: 'IB.PYP.A1.SC.MM.1',
          strand: 'Materials and Matter',
          description: 'Use senses to explore properties of materials (texture, color, size)'
        },
        {
          notation: 'IB.PYP.A1.SC.MM.2',
          strand: 'Materials and Matter',
          description: 'Sort materials by observable properties'
        },
        {
          notation: 'IB.PYP.A1.SC.MM.3',
          strand: 'Materials and Matter',
          description: 'Recognize that objects are made from different materials'
        },
        {
          notation: 'IB.PYP.A1.SC.MM.4',
          strand: 'Materials and Matter',
          description: 'Observe and describe water in different states (liquid, ice)'
        },
        {
          notation: 'IB.PYP.A1.SC.MM.5',
          strand: 'Materials and Matter',
          description: 'Explore how materials can be changed (mixing, bending, stretching)'
        },
        {
          notation: 'IB.PYP.A1.SC.MM.6',
          strand: 'Materials and Matter',
          description: 'Recognize that some changes can be reversed and some cannot'
        },

        // Forces and Energy Strand
        {
          notation: 'IB.PYP.A1.SC.FE.1',
          strand: 'Forces and Energy',
          description: 'Explore push and pull as ways to move objects'
        },
        {
          notation: 'IB.PYP.A1.SC.FE.2',
          strand: 'Forces and Energy',
          description: 'Observe how forces can change the shape of objects'
        },
        {
          notation: 'IB.PYP.A1.SC.FE.3',
          strand: 'Forces and Energy',
          description: 'Explore sources of light (sun, lamps, fire)'
        },
        {
          notation: 'IB.PYP.A1.SC.FE.4',
          strand: 'Forces and Energy',
          description: 'Recognize that sounds can be made in different ways'
        },
        {
          notation: 'IB.PYP.A1.SC.FE.5',
          strand: 'Forces and Energy',
          description: 'Observe how objects move (roll, slide, bounce)'
        },
        {
          notation: 'IB.PYP.A1.SC.FE.6',
          strand: 'Forces and Energy',
          description: 'Explore sources of heat and cold in the environment'
        }
      ]
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
        // Living Things Strand
        {
          notation: 'IB.PYP.A2.SC.LT.1',
          strand: 'Living Things',
          description: 'Identify the characteristics of living things (movement, growth, reproduction, response to stimuli)'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.2',
          strand: 'Living Things',
          description: 'Compare and classify living things into groups (plants, animals)'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.3',
          strand: 'Living Things',
          description: 'Recognize that living things have life cycles'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.4',
          strand: 'Living Things',
          description: 'Identify the main external parts of plants and animals'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.5',
          strand: 'Living Things',
          description: 'Explore how animals obtain food and shelter'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.6',
          strand: 'Living Things',
          description: 'Recognize that plants need light, water, and nutrients to grow'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.7',
          strand: 'Living Things',
          description: 'Observe and describe different habitats'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.8',
          strand: 'Living Things',
          description: 'Identify the major parts of the human body and their functions'
        },
        {
          notation: 'IB.PYP.A2.SC.LT.9',
          strand: 'Living Things',
          description: 'Recognize the importance of healthy habits for growth'
        },

        // Earth and Space Strand
        {
          notation: 'IB.PYP.A2.SC.ES.1',
          strand: 'Earth and Space',
          description: 'Describe patterns in weather and seasonal changes'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.2',
          strand: 'Earth and Space',
          description: 'Recognize that Earth rotates causing day and night'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.3',
          strand: 'Earth and Space',
          description: 'Identify features of Earth\'s surface (land, water, air)'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.4',
          strand: 'Earth and Space',
          description: 'Explore how people use natural resources'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.5',
          strand: 'Earth and Space',
          description: 'Recognize the importance of caring for the environment'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.6',
          strand: 'Earth and Space',
          description: 'Observe the movement of the sun across the sky'
        },
        {
          notation: 'IB.PYP.A2.SC.ES.7',
          strand: 'Earth and Space',
          description: 'Identify different types of rocks and soil'
        },

        // Materials and Matter Strand
        {
          notation: 'IB.PYP.A2.SC.MM.1',
          strand: 'Materials and Matter',
          description: 'Classify materials by their properties (hard/soft, rough/smooth, transparent/opaque)'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.2',
          strand: 'Materials and Matter',
          description: 'Recognize the three states of matter (solid, liquid, gas)'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.3',
          strand: 'Materials and Matter',
          description: 'Observe how heating and cooling can change materials'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.4',
          strand: 'Materials and Matter',
          description: 'Explore how materials are chosen for different purposes'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.5',
          strand: 'Materials and Matter',
          description: 'Identify natural and manufactured materials'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.6',
          strand: 'Materials and Matter',
          description: 'Observe changes in materials when mixed together'
        },
        {
          notation: 'IB.PYP.A2.SC.MM.7',
          strand: 'Materials and Matter',
          description: 'Recognize that materials can be recycled and reused'
        },

        // Forces and Energy Strand
        {
          notation: 'IB.PYP.A2.SC.FE.1',
          strand: 'Forces and Energy',
          description: 'Investigate how forces make things move, stop, or change direction'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.2',
          strand: 'Forces and Energy',
          description: 'Recognize that magnets attract some materials'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.3',
          strand: 'Forces and Energy',
          description: 'Explore how light travels and creates shadows'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.4',
          strand: 'Forces and Energy',
          description: 'Recognize that sounds are made by vibrations'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.5',
          strand: 'Forces and Energy',
          description: 'Identify sources of electricity and their uses'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.6',
          strand: 'Forces and Energy',
          description: 'Observe how heat can move from one object to another'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.7',
          strand: 'Forces and Energy',
          description: 'Explore how friction affects movement'
        },
        {
          notation: 'IB.PYP.A2.SC.FE.8',
          strand: 'Forces and Energy',
          description: 'Recognize that energy is needed to make things work'
        }
      ]
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
        // Living Things Strand
        {
          notation: 'IB.PYP.A3.SC.LT.1',
          strand: 'Living Things',
          description: 'Compare life cycles of different organisms'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.2',
          strand: 'Living Things',
          description: 'Classify animals by their characteristics (vertebrates/invertebrates, warm/cold-blooded)'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.3',
          strand: 'Living Things',
          description: 'Identify the parts of plants and their functions'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.4',
          strand: 'Living Things',
          description: 'Understand food chains and food webs'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.5',
          strand: 'Living Things',
          description: 'Explore how living things adapt to their environments'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.6',
          strand: 'Living Things',
          description: 'Recognize the interdependence of living things in ecosystems'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.7',
          strand: 'Living Things',
          description: 'Identify the major organ systems of the human body'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.8',
          strand: 'Living Things',
          description: 'Understand the importance of nutrition and exercise for health'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.9',
          strand: 'Living Things',
          description: 'Investigate how plants make their own food through photosynthesis'
        },
        {
          notation: 'IB.PYP.A3.SC.LT.10',
          strand: 'Living Things',
          description: 'Explore how traits are inherited from parents to offspring'
        },

        // Earth and Space Strand
        {
          notation: 'IB.PYP.A3.SC.ES.1',
          strand: 'Earth and Space',
          description: 'Understand that Earth orbits the sun causing seasons'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.2',
          strand: 'Earth and Space',
          description: 'Describe the water cycle and its importance'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.3',
          strand: 'Earth and Space',
          description: 'Identify the layers of Earth (crust, mantle, core)'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.4',
          strand: 'Earth and Space',
          description: 'Explore how natural forces shape Earth\'s surface (erosion, weathering)'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.5',
          strand: 'Earth and Space',
          description: 'Understand the phases of the moon'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.6',
          strand: 'Earth and Space',
          description: 'Recognize that Earth has limited natural resources'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.7',
          strand: 'Earth and Space',
          description: 'Investigate weather patterns and climate'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.8',
          strand: 'Earth and Space',
          description: 'Explore human impact on the environment'
        },
        {
          notation: 'IB.PYP.A3.SC.ES.9',
          strand: 'Earth and Space',
          description: 'Identify the planets in our solar system'
        },

        // Materials and Matter Strand
        {
          notation: 'IB.PYP.A3.SC.MM.1',
          strand: 'Materials and Matter',
          description: 'Investigate changes of state (melting, freezing, evaporation, condensation)'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.2',
          strand: 'Materials and Matter',
          description: 'Classify materials as conductors or insulators'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.3',
          strand: 'Materials and Matter',
          description: 'Understand that matter is made of particles'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.4',
          strand: 'Materials and Matter',
          description: 'Distinguish between reversible and irreversible changes'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.5',
          strand: 'Materials and Matter',
          description: 'Explore mixtures and solutions'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.6',
          strand: 'Materials and Matter',
          description: 'Investigate methods of separating mixtures'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.7',
          strand: 'Materials and Matter',
          description: 'Understand the properties of metals and non-metals'
        },
        {
          notation: 'IB.PYP.A3.SC.MM.8',
          strand: 'Materials and Matter',
          description: 'Explore how new materials are created through chemical reactions'
        },

        // Forces and Energy Strand
        {
          notation: 'IB.PYP.A3.SC.FE.1',
          strand: 'Forces and Energy',
          description: 'Investigate how gravity affects objects'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.2',
          strand: 'Forces and Energy',
          description: 'Understand how simple machines make work easier'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.3',
          strand: 'Forces and Energy',
          description: 'Explore properties of magnets and magnetic fields'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.4',
          strand: 'Forces and Energy',
          description: 'Investigate how light is reflected and refracted'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.5',
          strand: 'Forces and Energy',
          description: 'Understand how sound travels through different materials'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.6',
          strand: 'Forces and Energy',
          description: 'Build and test simple electrical circuits'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.7',
          strand: 'Forces and Energy',
          description: 'Recognize different forms of energy (kinetic, potential, thermal, light, sound)'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.8',
          strand: 'Forces and Energy',
          description: 'Understand that energy can be transferred and transformed'
        },
        {
          notation: 'IB.PYP.A3.SC.FE.9',
          strand: 'Forces and Energy',
          description: 'Explore renewable and non-renewable energy sources'
        }
      ]
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
        // Living Things Strand
        {
          notation: 'IB.PYP.A4.SC.LT.1',
          strand: 'Living Things',
          description: 'Understand the structure and function of cells as the basic unit of life'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.2',
          strand: 'Living Things',
          description: 'Compare single-celled and multi-celled organisms'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.3',
          strand: 'Living Things',
          description: 'Investigate how plants and animals reproduce'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.4',
          strand: 'Living Things',
          description: 'Understand the role of DNA in inheritance'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.5',
          strand: 'Living Things',
          description: 'Explore adaptation and natural selection'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.6',
          strand: 'Living Things',
          description: 'Analyze the impact of human activities on biodiversity'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.7',
          strand: 'Living Things',
          description: 'Understand the circulatory, respiratory, and digestive systems in detail'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.8',
          strand: 'Living Things',
          description: 'Investigate the nervous system and how it controls body functions'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.9',
          strand: 'Living Things',
          description: 'Explore the role of microorganisms in ecosystems and health'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.10',
          strand: 'Living Things',
          description: 'Understand energy flow through ecosystems'
        },
        {
          notation: 'IB.PYP.A4.SC.LT.11',
          strand: 'Living Things',
          description: 'Investigate the effects of environmental changes on ecosystems'
        },

        // Earth and Space Strand
        {
          notation: 'IB.PYP.A4.SC.ES.1',
          strand: 'Earth and Space',
          description: 'Understand the structure of the solar system and our place in the universe'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.2',
          strand: 'Earth and Space',
          description: 'Investigate plate tectonics and their effects (earthquakes, volcanoes, mountain formation)'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.3',
          strand: 'Earth and Space',
          description: 'Understand the rock cycle and how rocks are formed'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.4',
          strand: 'Earth and Space',
          description: 'Analyze the causes and effects of climate change'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.5',
          strand: 'Earth and Space',
          description: 'Explore Earth\'s atmosphere and its layers'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.6',
          strand: 'Earth and Space',
          description: 'Investigate the carbon cycle and its importance'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.7',
          strand: 'Earth and Space',
          description: 'Understand how fossils provide evidence of Earth\'s history'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.8',
          strand: 'Earth and Space',
          description: 'Evaluate sustainable practices for resource management'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.9',
          strand: 'Earth and Space',
          description: 'Compare the characteristics of planets, moons, and other celestial bodies'
        },
        {
          notation: 'IB.PYP.A4.SC.ES.10',
          strand: 'Earth and Space',
          description: 'Understand the importance of space exploration and technology'
        },

        // Materials and Matter Strand
        {
          notation: 'IB.PYP.A4.SC.MM.1',
          strand: 'Materials and Matter',
          description: 'Understand atomic structure (protons, neutrons, electrons)'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.2',
          strand: 'Materials and Matter',
          description: 'Use the periodic table to understand elements and their properties'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.3',
          strand: 'Materials and Matter',
          description: 'Distinguish between elements, compounds, and mixtures'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.4',
          strand: 'Materials and Matter',
          description: 'Investigate chemical reactions and identify their signs'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.5',
          strand: 'Materials and Matter',
          description: 'Understand the law of conservation of mass'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.6',
          strand: 'Materials and Matter',
          description: 'Explore acids, bases, and pH'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.7',
          strand: 'Materials and Matter',
          description: 'Investigate properties of gases and gas laws'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.8',
          strand: 'Materials and Matter',
          description: 'Understand the relationship between density, mass, and volume'
        },
        {
          notation: 'IB.PYP.A4.SC.MM.9',
          strand: 'Materials and Matter',
          description: 'Explore how new materials are developed for specific purposes'
        },

        // Forces and Energy Strand
        {
          notation: 'IB.PYP.A4.SC.FE.1',
          strand: 'Forces and Energy',
          description: 'Understand Newton\'s laws of motion'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.2',
          strand: 'Forces and Energy',
          description: 'Calculate speed, distance, and time relationships'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.3',
          strand: 'Forces and Energy',
          description: 'Investigate the relationship between force, mass, and acceleration'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.4',
          strand: 'Forces and Energy',
          description: 'Explore electromagnetism and its applications'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.5',
          strand: 'Forces and Energy',
          description: 'Understand the electromagnetic spectrum'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.6',
          strand: 'Forces and Energy',
          description: 'Investigate electrical current, voltage, and resistance'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.7',
          strand: 'Forces and Energy',
          description: 'Understand the law of conservation of energy'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.8',
          strand: 'Forces and Energy',
          description: 'Explore how energy efficiency can be improved'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.9',
          strand: 'Forces and Energy',
          description: 'Investigate wave properties (wavelength, frequency, amplitude)'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.10',
          strand: 'Forces and Energy',
          description: 'Understand how technology harnesses different forms of energy'
        },
        {
          notation: 'IB.PYP.A4.SC.FE.11',
          strand: 'Forces and Energy',
          description: 'Evaluate the environmental impact of different energy sources'
        }
      ]
    }
  ]
};

// Helper functions
export function getIBPYPScienceAgeBandByAge(age: number): IBPYPScienceAgeBand | undefined {
  return ibPYPScienceCurriculum.ageBands.find(
    band => age >= band.ageRangeMin && age <= band.ageRangeMax
  );
}

export function getIBPYPScienceStandardsByStrand(strand: string): IBPYPScienceStandard[] {
  return ibPYPScienceCurriculum.ageBands.flatMap(band =>
    band.standards.filter(std => std.strand === strand)
  );
}

export function getAllIBPYPScienceStandards(): IBPYPScienceStandard[] {
  return ibPYPScienceCurriculum.ageBands.flatMap(band => band.standards);
}

export function getIBPYPScienceStandardByNotation(notation: string): IBPYPScienceStandard | undefined {
  for (const band of ibPYPScienceCurriculum.ageBands) {
    const standard = band.standards.find(std => std.notation === notation);
    if (standard) return standard;
  }
  return undefined;
}

export default ibPYPScienceCurriculum;
