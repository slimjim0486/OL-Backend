import { z } from "zod";
import { IconSchema } from "../schemas";

export const layoutId = "orbit-learn-objectives-slide";
export const layoutName = "Learning Objectives";
export const layoutDescription = "Displays 3-5 learning objectives with numbered badges";

const ObjectiveSchema = z.object({
  text: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description:
        "A single learning objective, starting with an action verb (e.g., 'Understand', 'Identify', 'Apply')",
    }),
  icon: IconSchema.optional().meta({
    description: "Optional icon representing this objective",
  }),
});

export const Schema = z.object({
  headerTitle: z
    .string()
    .max(40)
    .default("Learning Objectives")
    .meta({
      description: "The section header, typically 'Learning Objectives' or 'What You'll Learn'",
    }),
  objectives: z
    .array(ObjectiveSchema)
    .min(2)
    .max(5)
    .default([
      { text: "Understand the basic concept of fractions as parts of a whole" },
      { text: "Identify numerators and denominators in fraction notation" },
      { text: "Compare simple fractions using visual models" },
      { text: "Apply fraction concepts to real-world scenarios" },
    ])
    .meta({
      description:
        "List of 2-5 learning objectives for this lesson, each starting with an action verb",
    }),
  footerNote: z
    .string()
    .max(100)
    .optional()
    .meta({
      description: "Optional note at the bottom (e.g., 'By the end of this lesson...')",
    }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const objectives = data.objectives || [];

  return (
    <div
      className="h-full w-full"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3",
      }}
    >
      <div
        className="h-full w-full flex flex-col"
        style={{
          border: "6px solid #1E2A3A",
          boxSizing: "border-box",
        }}
      >
        <div style={{ height: "16px", background: "#D4A853" }} />

        <div className="flex-1 flex flex-col px-12 py-10">
          <div className="flex items-start justify-between gap-6 mb-7">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "#D4A853",
                  border: "3px solid #1E2A3A",
                }}
              >
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "2.35rem",
                    fontWeight: 700,
                    color: "#1E2A3A",
                    lineHeight: 1.1,
                  }}
                >
                  {data.headerTitle}
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#3D4F66",
                    marginTop: "6px",
                  }}
                >
                  Key targets for this lesson.
                </p>
              </div>
            </div>

            <div
              className="px-4 py-2 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "2px solid #1E2A3A",
              }}
            >
              <span
                className="font-semibold"
                style={{ color: "#2D5A4A", fontSize: "0.95rem" }}
              >
                {objectives.length} objectives
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  border: "3px solid #1E2A3A",
                }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      index === 0
                        ? "#2D5A4A"
                        : index === 1
                          ? "#C75B39"
                          : index === 2
                            ? "#D4A853"
                            : index === 3
                              ? "#7BAE7F"
                              : "#7B5EA7",
                    border: "2px solid #1E2A3A",
                  }}
                >
                  <span className="text-xl font-bold" style={{ color: "#FDF8F3" }}>
                    {index + 1}
                  </span>
                </div>

                <p
                  className="flex-1 pt-2"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    color: "#1E2A3A",
                    lineHeight: 1.5,
                  }}
                >
                  {objective.text}
                </p>

                {objective.icon?.__icon_url__ && (
                  <img src={objective.icon.__icon_url__} alt="" className="w-10 h-10 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {data.footerNote && (
            <div
              className="mt-5 px-5 py-4 rounded-2xl"
              style={{
                background: "#E8F0E8",
                border: "2px solid #2D5A4A",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  color: "#3D4F66",
                  fontStyle: "italic",
                }}
              >
                {data.footerNote}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-5">
            <img src="/static/orbit-logo.png" alt="Orbit Learn" className="w-6 h-6" />
            <span className="text-sm font-medium" style={{ color: "#3D4F66" }}>
              Orbit Learn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
