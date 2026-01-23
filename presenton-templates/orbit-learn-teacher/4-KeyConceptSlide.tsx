import { z } from "zod";
import { ImageSchema, IconSchema } from "../schemas";

/**
 * Orbit Learn Teacher Portal - Key Concept Slide
 *
 * A focused slide for highlighting a single important concept
 * with a large title, definition, and visual example. Perfect
 * for the "big idea" moments in a lesson.
 */

export const Schema = z.object({
  badgeLabel: z
    .string()
    .max(30)
    .default("Key Concept")
    .meta({
      description: "The label for the badge above the concept (e.g., 'Key Concept', 'Important Rule', 'Remember This')"
    }),
  conceptTitle: z
    .string()
    .min(3)
    .max(60)
    .default("The Denominator")
    .meta({
      description: "The main concept name or title - keep it concise and memorable"
    }),
  definition: z
    .string()
    .min(20)
    .max(250)
    .default("The denominator is the bottom number in a fraction. It tells us how many equal parts the whole has been divided into.")
    .meta({
      description: "A clear, student-friendly explanation of the concept"
    }),
  example: z
    .string()
    .max(200)
    .optional()
    .meta({
      description: "A concrete example illustrating the concept"
    }),
  visualImage: ImageSchema.optional().meta({
    description: "A diagram, illustration, or visual example of the concept"
  }),
  conceptIcon: IconSchema.optional().meta({
    description: "An icon representing this concept"
  }),
  memoryTip: z
    .string()
    .max(150)
    .optional()
    .meta({
      description: "An optional memory trick or mnemonic to help students remember"
    })
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const hasImage = data.visualImage?.__image_url__;

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Dramatic background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(45,90,74,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(212,168,83,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 0% 100%, rgba(199,91,57,0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* Decorative corner accent */}
      <div
        className="absolute top-0 left-0 w-48 h-48"
        style={{
          background: 'linear-gradient(135deg, #2D5A4A 0%, transparent 100%)',
          opacity: 0.08
        }}
      />

      {/* Main content */}
      <div className="relative z-10 h-full w-full flex items-center px-14 py-10">

        {/* Content section */}
        <div className={`flex flex-col ${hasImage ? 'flex-1 pr-8' : 'w-full items-center text-center'}`}>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 self-start"
            style={{
              background: '#C75B39',
              border: '3px solid #000',
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
            }}
          >
            <span className="text-lg">⭐</span>
            <span
              className="text-sm font-bold uppercase tracking-wide"
              style={{ color: '#FDF8F3' }}
            >
              {data.badgeLabel}
            </span>
          </div>

          {/* Concept title */}
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: hasImage ? '3rem' : '3.5rem',
              fontWeight: 800,
              color: '#1E2A3A',
              lineHeight: 1.1
            }}
          >
            {data.conceptTitle}
          </h1>

          {/* Definition box */}
          <div
            className="p-6 rounded-2xl mb-6"
            style={{
              background: '#FFFFFF',
              border: '4px solid #000',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              maxWidth: hasImage ? '100%' : '700px'
            }}
          >
            <p
              style={{
                fontSize: '1.35rem',
                lineHeight: 1.6,
                color: '#1E2A3A',
                fontWeight: 500
              }}
            >
              {data.definition}
            </p>
          </div>

          {/* Example */}
          {data.example && (
            <div
              className="flex items-start gap-3 p-5 rounded-xl mb-4"
              style={{
                background: 'rgba(45,90,74,0.08)',
                borderLeft: '4px solid #2D5A4A'
              }}
            >
              <span className="text-xl flex-shrink-0">📝</span>
              <div>
                <span
                  className="text-sm font-bold uppercase tracking-wide block mb-1"
                  style={{ color: '#2D5A4A' }}
                >
                  Example
                </span>
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: '#1E2A3A',
                    lineHeight: 1.5
                  }}
                >
                  {data.example}
                </p>
              </div>
            </div>
          )}

          {/* Memory tip */}
          {data.memoryTip && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: 'rgba(212,168,83,0.15)',
                border: '2px dashed #D4A853'
              }}
            >
              <span className="text-xl flex-shrink-0">🧠</span>
              <div>
                <span
                  className="text-sm font-bold uppercase tracking-wide block mb-1"
                  style={{ color: '#D4A853' }}
                >
                  Remember
                </span>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#3D4F66',
                    fontStyle: 'italic'
                  }}
                >
                  {data.memoryTip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Visual image */}
        {hasImage && (
          <div
            className="flex-shrink-0 rounded-3xl overflow-hidden"
            style={{
              border: '5px solid #000',
              boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
              maxWidth: '380px',
              background: '#FFFFFF'
            }}
          >
            <img
              src={data.visualImage!.__image_url__}
              alt={data.visualImage!.__image_prompt__ || 'Concept illustration'}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Decorative shapes */}
      <div
        className="absolute bottom-8 left-8 w-8 h-8 rounded-lg rotate-12"
        style={{
          background: '#D4A853',
          border: '2px solid #000',
          boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)'
        }}
      />
      <div
        className="absolute top-12 right-12 w-6 h-6 rounded-full"
        style={{
          background: '#7BAE7F',
          border: '2px solid #000'
        }}
      />

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
