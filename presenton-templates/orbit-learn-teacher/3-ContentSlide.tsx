import { z } from "zod";
import { ImageSchema } from "../schemas";

export const layoutId = 'orbit-learn-content-slide';
export const layoutName = 'Content Slide';
export const layoutDescription = 'Main teaching content with header, body text, and optional image';

/**
 * Orbit Learn Teacher Portal - Content Slide
 *
 * The main teaching content slide with a header, body text,
 * optional image, and vocabulary callout. This is the workhorse
 * slide for presenting lesson material.
 */

const VocabularyItemSchema = z.object({
  term: z
    .string()
    .min(2)
    .max(40)
    .meta({
      description: "The vocabulary word or phrase"
    }),
  definition: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description: "A student-friendly definition of the term"
    })
});

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
      description: "1-3 paragraphs of teaching content, written in clear, student-appropriate language"
    }),
  contentImage: ImageSchema.optional().meta({
    description: "Optional visual that supports the content (diagram, illustration, or example)"
  }),
  vocabularyItems: z
    .array(VocabularyItemSchema)
    .max(3)
    .optional()
    .meta({
      description: "Optional vocabulary terms introduced in this section (max 3)"
    }),
  highlightBox: z
    .string()
    .max(200)
    .optional()
    .meta({
      description: "Optional highlighted tip, fact, or important note"
    })
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const paragraphs = data.bodyParagraphs || [];
  const vocabulary = data.vocabularyItems || [];
  const hasImage = data.contentImage?.__image_url__;
  const hasVocabulary = vocabulary.length > 0;

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Subtle background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,42,58,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,42,58,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 h-full w-full flex flex-col px-12 py-10">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-2 h-12 rounded-full"
            style={{ background: '#2D5A4A' }}
          />
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#1E2A3A'
            }}
          >
            {data.sectionHeader}
          </h2>
        </div>

        {/* Content area - flexible layout */}
        <div className={`flex-1 flex gap-8 ${hasImage ? 'flex-row' : 'flex-col'}`}>

          {/* Text content */}
          <div className={`flex flex-col gap-4 ${hasImage ? 'flex-1' : 'max-w-4xl'}`}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: '1.2rem',
                  lineHeight: 1.7,
                  color: '#1E2A3A'
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* Highlight box */}
            {data.highlightBox && (
              <div
                className="mt-4 p-5 rounded-2xl flex items-start gap-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.05) 100%)',
                  border: '3px solid #D4A853',
                  boxShadow: '4px 4px 0px 0px rgba(212,168,83,0.3)'
                }}
              >
                <span className="text-2xl flex-shrink-0">💡</span>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: '#1E2A3A',
                    lineHeight: 1.5
                  }}
                >
                  {data.highlightBox}
                </p>
              </div>
            )}

            {/* Vocabulary section */}
            {hasVocabulary && (
              <div className="mt-auto pt-4">
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #000',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📖</span>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: '#2D5A4A' }}
                    >
                      Key Vocabulary
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {vocabulary.map((item, index) => (
                      <div key={index} className="flex items-baseline gap-2">
                        <span
                          className="font-bold"
                          style={{
                            color: '#C75B39',
                            fontSize: '1.05rem'
                          }}
                        >
                          {item.term}:
                        </span>
                        <span
                          style={{
                            color: '#3D4F66',
                            fontSize: '1rem'
                          }}
                        >
                          {item.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image */}
          {hasImage && (
            <div
              className="flex-shrink-0 rounded-2xl overflow-hidden self-start"
              style={{
                border: '4px solid #000',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                maxWidth: '320px'
              }}
            >
              <img
                src={data.contentImage!.__image_url__}
                alt={data.contentImage!.__image_prompt__ || 'Content illustration'}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Page indicator dots - bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-3 h-3 rounded-full" style={{ background: '#2D5A4A' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#D4A853' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#C75B39' }} />
      </div>

      {/* Orbit Learn branding */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-50">
        <img src="/static/orbit-logo.png" alt="" className="w-5 h-5" />
        <span className="text-xs font-medium" style={{ color: '#3D4F66' }}>
          Orbit Learn
        </span>
      </div>
    </div>
  );
};

export default SlideComponent;
