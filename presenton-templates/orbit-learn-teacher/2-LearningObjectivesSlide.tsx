import React from 'react';
import * as z from "zod";
import { IconSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'orbit-learn-objectives-slide';
export const layoutName = 'Learning Objectives';
export const layoutDescription = 'Displays 3-5 learning objectives with numbered badges';

const ObjectiveSchema = z.object({
  text: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description: "A single learning objective, starting with an action verb"
    }),
  icon: IconSchema.optional().meta({
    description: "Optional icon representing this objective"
  })
});

export const Schema = z.object({
  headerTitle: z
    .string()
    .max(40)
    .default("Learning Objectives")
    .meta({
      description: "The section header"
    }),
  objectives: z
    .array(ObjectiveSchema)
    .min(2)
    .max(5)
    .default([
      { text: "Understand the basic concept of fractions as parts of a whole" },
      { text: "Identify numerators and denominators in fraction notation" },
      { text: "Compare simple fractions using visual models" }
    ])
    .meta({
      description: "List of 2-5 learning objectives for this lesson"
    })
});

type SchemaType = z.infer<typeof Schema>;

interface SlideProps {
  data?: Partial<SchemaType>;
}

const SlideComponent: React.FC<SlideProps> = ({ data: slideData }) => {
  const objectives = slideData?.objectives || [];

  return (
    <div
      className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Main content */}
      <div className="relative z-10 h-full w-full flex flex-col px-14 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: '#D4A853',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: '#1E2A3A' }}>
            {slideData?.headerTitle || 'Learning Objectives'}
          </h2>
        </div>

        {/* Objectives list */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{
                background: '#FFFFFF',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: index === 0 ? '#2D5A4A' :
                             index === 1 ? '#C75B39' :
                             index === 2 ? '#D4A853' :
                             index === 3 ? '#7BAE7F' : '#7B5EA7',
                  border: '2px solid #000'
                }}
              >
                <span className="text-xl font-bold" style={{ color: '#FDF8F3' }}>
                  {index + 1}
                </span>
              </div>
              <p className="flex-1 pt-2 text-xl font-medium" style={{ color: '#1E2A3A' }}>
                {objective.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, #2D5A4A 0%, #D4A853 50%, #C75B39 100%)'
        }}
      />
    </div>
  );
};

export default SlideComponent;
