import React from 'react';
import * as z from "zod";
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'orbit-learn-content-slide';
export const layoutName = 'Content Slide';
export const layoutDescription = 'Main teaching content with header, body text, and optional image';

export const Schema = z.object({
  sectionHeader: z
    .string()
    .min(3)
    .max(60)
    .default("Understanding Fractions")
    .meta({
      description: "The main header for this content section"
    }),
  bodyParagraphs: z
    .array(z.string().min(20).max(400))
    .min(1)
    .max(3)
    .default([
      "A fraction represents a part of a whole. When we divide something into equal pieces, each piece is a fraction of the original.",
      "The top number (numerator) tells us how many parts we have. The bottom number (denominator) tells us how many equal parts make up the whole."
    ])
    .meta({
      description: "1-3 paragraphs of teaching content"
    }),
  contentImage: ImageSchema.optional().meta({
    description: "Optional visual that supports the content"
  }),
  vocabularyTerm: z.string().max(40).optional().meta({
    description: "Optional vocabulary word to highlight"
  }),
  vocabularyDefinition: z.string().max(150).optional().meta({
    description: "Definition of the vocabulary word"
  })
});

type SchemaType = z.infer<typeof Schema>;

interface SlideProps {
  data?: Partial<SchemaType>;
}

const SlideComponent: React.FC<SlideProps> = ({ data: slideData }) => {
  const paragraphs = slideData?.bodyParagraphs || [];
  const hasImage = slideData?.contentImage?.__image_url__;
  const hasVocab = slideData?.vocabularyTerm;

  return (
    <div
      className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: '#C75B39' }} />

      <div className="relative z-10 h-full w-full flex flex-col px-14 py-10">
        {/* Header */}
        <h2
          className="text-4xl font-bold mb-6 pb-4"
          style={{
            color: '#1E2A3A',
            borderBottom: '3px solid #2D5A4A'
          }}
        >
          {slideData?.sectionHeader || 'Understanding Fractions'}
        </h2>

        {/* Content area */}
        <div className={`flex-1 flex ${hasImage ? 'gap-8' : ''}`}>
          {/* Text content */}
          <div className={hasImage ? 'flex-1' : 'w-full'}>
            <div className="space-y-4">
              {paragraphs.map((para, index) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed"
                  style={{ color: '#1E2A3A' }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Vocabulary callout */}
            {hasVocab && (
              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: '#D4A853',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📖</span>
                  <span className="font-bold" style={{ color: '#1E2A3A' }}>
                    Vocabulary
                  </span>
                </div>
                <p style={{ color: '#1E2A3A' }}>
                  <strong>{slideData?.vocabularyTerm}</strong>: {slideData?.vocabularyDefinition}
                </p>
              </div>
            )}
          </div>

          {/* Image */}
          {hasImage && (
            <div
              className="w-80 rounded-xl overflow-hidden flex-shrink-0"
              style={{
                border: '3px solid #000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <img
                src={slideData?.contentImage?.__image_url__}
                alt={slideData?.contentImage?.__image_prompt__ || ''}
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
