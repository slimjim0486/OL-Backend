import { z } from "zod";
import { IconSchema } from "../schemas";

/**
 * Orbit Learn Teacher Portal - Learning Objectives Slide
 *
 * Displays the lesson's learning objectives in a clear,
 * numbered list format with icons for visual engagement.
 */

const ObjectiveSchema = z.object({
  text: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description: "A single learning objective, starting with an action verb (e.g., 'Understand', 'Identify', 'Apply')"
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
      description: "The section header, typically 'Learning Objectives' or 'What You'll Learn'"
    }),
  objectives: z
    .array(ObjectiveSchema)
    .min(2)
    .max(5)
    .default([
      { text: "Understand the basic concept of fractions as parts of a whole" },
      { text: "Identify numerators and denominators in fraction notation" },
      { text: "Compare simple fractions using visual models" },
      { text: "Apply fraction concepts to real-world scenarios" }
    ])
    .meta({
      description: "List of 2-5 learning objectives for this lesson, each starting with an action verb"
    }),
  footerNote: z
    .string()
    .max(100)
    .optional()
    .meta({
      description: "Optional note at the bottom (e.g., 'By the end of this lesson...')"
    })
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const objectives = data.objectives || [];

  return (
    <div
      className="h-full w-full relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 90% 10%, rgba(45,90,74,0.08) 0%, transparent 30%),
            radial-gradient(circle at 10% 90%, rgba(212,168,83,0.1) 0%, transparent 30%)
          `
        }}
      />

      {/* Decorative corner element */}
      <div
        className="absolute top-0 right-0 w-32 h-32"
        style={{
          background: 'linear-gradient(135deg, #2D5A4A 0%, transparent 100%)',
          opacity: 0.1
        }}
      />

      {/* Main content */}
      <div className="relative z-10 h-full w-full flex flex-col px-14 py-10">

        {/* Header with icon */}
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
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1E2A3A'
            }}
          >
            {data.headerTitle}
          </h2>
        </div>

        {/* Objectives list */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-2xl transition-all"
              style={{
                background: '#FFFFFF',
                border: '3px solid #000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
              }}
            >
              {/* Number badge */}
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
                <span
                  className="text-xl font-bold"
                  style={{ color: '#FDF8F3' }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Objective text */}
              <p
                className="flex-1 pt-2"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#1E2A3A',
                  lineHeight: 1.5
                }}
              >
                {objective.text}
              </p>

              {/* Optional icon */}
              {objective.icon?.__icon_url__ && (
                <img
                  src={objective.icon.__icon_url__}
                  alt=""
                  className="w-10 h-10 flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        {data.footerNote && (
          <div
            className="mt-6 px-5 py-3 rounded-xl"
            style={{
              background: 'rgba(45,90,74,0.1)',
              borderLeft: '4px solid #2D5A4A'
            }}
          >
            <p
              style={{
                fontSize: '1rem',
                color: '#3D4F66',
                fontStyle: 'italic'
              }}
            >
              {data.footerNote}
            </p>
          </div>
        )}
      </div>

      {/* Orbit Learn branding - bottom right */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-60">
        <img
          src="/static/orbit-logo.png"
          alt="Orbit Learn"
          className="w-6 h-6"
        />
        <span
          className="text-sm font-medium"
          style={{ color: '#3D4F66' }}
        >
          Orbit Learn
        </span>
      </div>
    </div>
  );
};

export default SlideComponent;
