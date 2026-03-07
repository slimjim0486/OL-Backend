import { z } from "zod";

export const layoutId = 'orbit-learn-summary-slide';
export const layoutName = 'Summary Slide';
export const layoutDescription = 'Closing slide with recap points and next steps';

/**
 * Orbit Learn Teacher Portal - Summary Slide
 *
 * The closing slide that recaps what was learned and
 * provides next steps or homework. Features a "What We Learned"
 * section and calls to action for continued learning.
 */

const RecapPointSchema = z.object({
  text: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description: "A single recap point summarizing a key takeaway from the lesson"
    }),
  emoji: z
    .string()
    .max(4)
    .optional()
    .meta({
      description: "Optional emoji to represent this point"
    })
});

export const Schema = z.object({
  headerTitle: z
    .string()
    .max(40)
    .default("What We Learned")
    .meta({
      description: "The section header, typically 'What We Learned' or 'Lesson Summary'"
    }),
  recapPoints: z
    .array(RecapPointSchema)
    .min(2)
    .max(5)
    .default([
      { text: "Fractions represent parts of a whole", emoji: "🧩" },
      { text: "The numerator is the top number - how many parts we have", emoji: "⬆️" },
      { text: "The denominator is the bottom number - total equal parts", emoji: "⬇️" },
      { text: "We can use visual models to compare fractions", emoji: "📊" }
    ])
    .meta({
      description: "2-5 key takeaways from the lesson, written as concise bullet points"
    }),
  nextStepsTitle: z
    .string()
    .max(40)
    .default("Next Steps")
    .meta({
      description: "Header for the next steps section (e.g., 'Next Steps', 'Homework', 'Practice Time')"
    }),
  nextStepsContent: z
    .string()
    .max(250)
    .optional()
    .meta({
      description: "Instructions for homework, practice activities, or what's coming in the next lesson"
    }),
  closingMessage: z
    .string()
    .max(100)
    .default("Great job today! 🌟")
    .meta({
      description: "An encouraging closing message for students"
    })
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const recapPoints = data.recapPoints || [];

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Celebratory background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(123,174,127,0.12) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(212,168,83,0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(45,90,74,0.05) 0%, transparent 60%)
          `
        }}
      />

      {/* Decorative confetti-like elements */}
      <div
        className="absolute top-16 right-20 w-8 h-8 rounded-lg rotate-45"
        style={{
          background: '#D4A853',
          border: '2px solid #000',
          boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
        }}
      />
      <div
        className="absolute top-32 right-40 w-6 h-6 rounded-full"
        style={{
          background: '#C75B39',
          border: '2px solid #000'
        }}
      />
      <div
        className="absolute bottom-24 left-16 w-10 h-10 rounded-xl -rotate-12"
        style={{
          background: '#7BAE7F',
          border: '2px solid #000',
          boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
        }}
      />
      <div
        className="absolute top-20 left-32 w-5 h-5 rounded-full"
        style={{
          background: '#7B5EA7',
          border: '2px solid #000'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 h-full w-full flex gap-8 px-12 py-10">

        {/* Left column - What We Learned */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
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
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1E2A3A'
              }}
            >
              {data.headerTitle}
            </h2>
          </div>

          {/* Recap points */}
          <div className="flex-1 flex flex-col gap-3">
            {recapPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #000',
                  boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: index % 2 === 0 ? '#D4A853' : '#2D5A4A',
                    border: '2px solid #000'
                  }}
                >
                  <span className="text-lg">{point.emoji || '•'}</span>
                </div>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: '#1E2A3A',
                    lineHeight: 1.4
                  }}
                >
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Next Steps & Closing */}
        <div className="w-80 flex flex-col gap-6">
          {/* Next Steps card */}
          {data.nextStepsContent && (
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #C75B39 0%, #E8846A 100%)',
                border: '4px solid #000',
                boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📋</span>
                <h3
                  className="text-lg font-bold"
                  style={{ color: '#FDF8F3' }}
                >
                  {data.nextStepsTitle}
                </h3>
              </div>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#FDF8F3',
                  lineHeight: 1.5
                }}
              >
                {data.nextStepsContent}
              </p>
            </div>
          )}

          {/* Closing message card */}
          <div
            className="p-6 rounded-2xl flex-1 flex flex-col items-center justify-center text-center"
            style={{
              background: 'linear-gradient(135deg, #D4A853 0%, #E8C97A 100%)',
              border: '4px solid #000',
              boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{
                background: '#FDF8F3',
                border: '3px solid #000',
                boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.2)'
              }}
            >
              <span className="text-4xl">🎉</span>
            </div>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E2A3A',
                lineHeight: 1.3
              }}
            >
              {data.closingMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with branding */}
      <div
        className="absolute bottom-0 left-0 right-0 py-4 px-8 flex items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, #2D5A4A 0%, #3D7A6A 50%, #2D5A4A 100%)',
          borderTop: '3px solid #000'
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/static/orbit-logo.png"
            alt="Orbit Learn"
            className="w-8 h-8"
            style={{
              filter: 'brightness(0) invert(1)'
            }}
          />
          <span
            className="font-semibold"
            style={{
              fontFamily: "'Fraunces', serif",
              color: '#FDF8F3',
              fontSize: '1.1rem'
            }}
          >
            Orbit Learn
          </span>
        </div>
        <span
          className="text-sm"
          style={{ color: 'rgba(253,248,243,0.7)' }}
        >
          Made with ❤️ for educators
        </span>
      </div>
    </div>
  );
};

export default SlideComponent;
