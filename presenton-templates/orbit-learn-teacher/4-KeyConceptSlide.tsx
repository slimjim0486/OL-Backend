import { z } from "zod";
import { ImageSchema, IconSchema } from "../schemas";

export const layoutId = "orbit-learn-key-concept-slide";
export const layoutName = "Key Concept";
export const layoutDescription = "Highlights a single important concept with definition and visual";

export const Schema = z.object({
  badgeLabel: z
    .string()
    .max(30)
    .default("Key Concept")
    .meta({
      description:
        "The label for the badge above the concept (e.g., 'Key Concept', 'Important Rule', 'Remember This')",
    }),
  conceptTitle: z
    .string()
    .min(3)
    .max(60)
    .default("The Denominator")
    .meta({
      description: "The main concept name or title - keep it concise and memorable",
    }),
  definition: z
    .string()
    .min(20)
    .max(250)
    .default(
      "The denominator is the bottom number in a fraction. It tells us how many equal parts the whole has been divided into.",
    )
    .meta({
      description: "A clear, student-friendly explanation of the concept",
    }),
  example: z
    .string()
    .max(200)
    .optional()
    .meta({
      description: "A concrete example illustrating the concept",
    }),
  visualImage: ImageSchema.optional().meta({
    description: "A diagram, illustration, or visual example of the concept",
  }),
  conceptIcon: IconSchema.optional().meta({
    description: "An icon representing this concept",
  }),
  memoryTip: z
    .string()
    .max(150)
    .optional()
    .meta({
      description: "An optional memory trick or mnemonic to help students remember",
    }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const hasImage = Boolean(data.visualImage?.__image_url__);

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
        <div style={{ height: "16px", background: "#C75B39" }} />

        <div className="flex-1 flex flex-col px-12 py-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
              style={{
                background: "#C75B39",
                border: "3px solid #1E2A3A",
              }}
            >
              <span className="text-lg">⭐</span>
              <span
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: "#FDF8F3" }}
              >
                {data.badgeLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <img src="/static/orbit-logo.png" alt="" className="w-5 h-5" />
              <span className="text-xs font-medium" style={{ color: "#3D4F66" }}>
                Orbit Learn
              </span>
            </div>
          </div>

          <div className={`flex-1 ${hasImage ? "flex gap-8" : "block"}`}>
            <div className={hasImage ? "flex-1 pr-2" : "max-w-5xl"}>
              <h1
                className="mb-5"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: hasImage ? "2.95rem" : "3.3rem",
                  fontWeight: 800,
                  color: "#1E2A3A",
                  lineHeight: 1.08,
                }}
              >
                {data.conceptTitle}
              </h1>

              <div
                className="p-6 rounded-3xl mb-5"
                style={{
                  background: "#FFFFFF",
                  border: "4px solid #1E2A3A",
                  maxWidth: hasImage ? "100%" : "760px",
                }}
              >
                <p
                  style={{
                    fontSize: "1.28rem",
                    lineHeight: 1.6,
                    color: "#1E2A3A",
                    fontWeight: 500,
                  }}
                >
                  {data.definition}
                </p>
              </div>

              {data.example && (
                <div
                  className="p-5 rounded-2xl mb-4"
                  style={{
                    background: "#E8F0E8",
                    border: "2px solid #2D5A4A",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📝</span>
                    <span
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: "#2D5A4A" }}
                    >
                      Example
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "1.08rem",
                      color: "#1E2A3A",
                      lineHeight: 1.5,
                    }}
                  >
                    {data.example}
                  </p>
                </div>
              )}

              {data.memoryTip && (
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: "#FFF4D6",
                    border: "2px solid #D4A853",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🧠</span>
                    <span
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: "#A57B20" }}
                    >
                      Remember
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#3D4F66",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    {data.memoryTip}
                  </p>
                </div>
              )}
            </div>

            {hasImage && (
              <div
                className="flex-shrink-0 rounded-3xl overflow-hidden self-start"
                style={{
                  width: "360px",
                  background: "#FFFFFF",
                  border: "4px solid #1E2A3A",
                }}
              >
                <img
                  src={data.visualImage!.__image_url__}
                  alt={data.visualImage!.__image_prompt__ || "Concept illustration"}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
