import React from 'react';
import * as z from "zod";
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'orbit-learn-key-concept-slide';
export const layoutName = 'Key Concept';
export const layoutDescription = 'Highlights a single important concept with definition and visual';

export const Schema = z.object({
  badgeLabel: z
    .string()
    .max(30)
    .default("Key Concept")
    .meta({
      description: "The label for the badge"
    }),
  conceptTitle: z
    .string()
    .min(3)
    .max(60)
    .default("The Denominator")
    .meta({
      description: "The main concept name"
    }),
  definition: z
    .string()
    .min(20)
    .max(200)
    .default("The denominator is the bottom number in a fraction. It tells us how many equal parts the whole has been divided into.")
    .meta({
      description: "Clear explanation of the concept"
    }),
  example: z
    .string()
    .max(150)
    .optional()
    .meta({
      description: "A concrete example"
    }),
  conceptImage: ImageSchema.optional().meta({
    description: "Visual representation of the concept"
  })
});

type SchemaType = z.infer<typeof Schema>;

interface SlideProps {
  data?: Partial<SchemaType>;
}

const SlideComponent: React.FC<SlideProps> = ({ data: slideData }) => {
  return (
    <div
      className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(45,90,74,0.1) 0%, transparent 100%)'
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-16 py-12">
        {/* Badge */}
        <div
          className="px-6 py-2 rounded-full mb-6"
          style={{
            background: '#7B5EA7',
            border: '3px solid #000',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <span className="text-lg font-bold" style={{ color: '#FDF8F3' }}>
            ⭐ {slideData?.badgeLabel || 'Key Concept'}
          </span>
        </div>

        {/* Concept title */}
        <h2
          className="text-5xl font-bold text-center mb-6"
          style={{ color: '#1E2A3A' }}
        >
          {slideData?.conceptTitle || 'The Denominator'}
        </h2>

        {/* Definition box */}
        <div
          className="max-w-3xl p-6 rounded-2xl mb-6"
          style={{
            background: '#FFFFFF',
            border: '4px solid #2D5A4A',
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <p className="text-xl text-center leading-relaxed" style={{ color: '#1E2A3A' }}>
            {slideData?.definition || 'The denominator is the bottom number in a fraction.'}
          </p>
        </div>

        {/* Example */}
        {slideData?.example && (
          <div
            className="px-6 py-3 rounded-xl"
            style={{
              background: '#D4A853',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <p className="text-lg" style={{ color: '#1E2A3A' }}>
              <strong>Example:</strong> {slideData.example}
            </p>
          </div>
        )}
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
