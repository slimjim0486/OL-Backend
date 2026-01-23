import React from 'react';
import * as z from "zod";

export const layoutId = 'orbit-learn-summary-slide';
export const layoutName = 'Summary Slide';
export const layoutDescription = 'Closing slide with recap points and next steps';

export const Schema = z.object({
  headerTitle: z
    .string()
    .max(40)
    .default("What We Learned")
    .meta({
      description: "Header for the summary section"
    }),
  recapPoints: z
    .array(z.object({
      text: z.string().min(10).max(150),
      emoji: z.string().max(4).optional()
    }))
    .min(2)
    .max(5)
    .default([
      { text: "Fractions represent parts of a whole", emoji: "🍕" },
      { text: "The numerator is the top number", emoji: "⬆️" },
      { text: "The denominator is the bottom number", emoji: "⬇️" }
    ])
    .meta({
      description: "Key takeaways from the lesson"
    }),
  nextStepsTitle: z
    .string()
    .max(40)
    .default("Next Steps")
    .optional()
    .meta({
      description: "Header for next steps section"
    }),
  nextStepsText: z
    .string()
    .max(200)
    .optional()
    .meta({
      description: "Homework or continued learning instructions"
    })
});

type SchemaType = z.infer<typeof Schema>;

interface SlideProps {
  data?: Partial<SchemaType>;
}

const SlideComponent: React.FC<SlideProps> = ({ data: slideData }) => {
  const recapPoints = slideData?.recapPoints || [];

  return (
    <div
      className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 10% 90%, rgba(45,90,74,0.1) 0%, transparent 30%),
            radial-gradient(circle at 90% 10%, rgba(212,168,83,0.1) 0%, transparent 30%)
          `
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col px-14 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: '#2D5A4A',
              border: '3px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: '#1E2A3A' }}>
            {slideData?.headerTitle || 'What We Learned'}
          </h2>
        </div>

        {/* Content area */}
        <div className="flex-1 flex gap-8">
          {/* Recap points */}
          <div className="flex-1">
            <div className="space-y-4">
              {recapPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #000',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
                  }}
                >
                  <span className="text-2xl">{point.emoji || '✓'}</span>
                  <p className="text-lg" style={{ color: '#1E2A3A' }}>
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          {slideData?.nextStepsText && (
            <div
              className="w-80 p-6 rounded-2xl flex-shrink-0 h-fit"
              style={{
                background: '#C75B39',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#FDF8F3' }}>
                📝 {slideData?.nextStepsTitle || 'Next Steps'}
              </h3>
              <p style={{ color: '#FDF8F3' }}>
                {slideData.nextStepsText}
              </p>
            </div>
          )}
        </div>

        {/* Branding footer */}
        <div className="flex justify-center mt-6">
          <span className="text-sm" style={{ color: '#3D4F66' }}>
            Created with Orbit Learn
          </span>
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
