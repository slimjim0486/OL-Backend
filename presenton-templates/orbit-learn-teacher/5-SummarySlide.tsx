import { z } from "zod";

export const layoutId = "orbit-learn-summary-slide";
export const layoutName = "Summary Slide";
export const layoutDescription = "Closing slide with recap points and next steps";

const RecapPointSchema = z.object({
  text: z
    .string()
    .min(10)
    .max(150)
    .meta({
      description: "A single recap point summarizing a key takeaway from the lesson",
    }),
  emoji: z
    .string()
    .max(4)
    .optional()
    .meta({
      description: "Optional emoji to represent this point",
    }),
});

export const Schema = z.object({
  headerTitle: z
    .string()
    .max(40)
    .default("What We Learned")
    .meta({
      description: "The section header, typically 'What We Learned' or 'Lesson Summary'",
    }),
  recapPoints: z
    .array(RecapPointSchema)
    .min(2)
    .max(5)
    .default([
      { text: "Fractions represent parts of a whole", emoji: "🧩" },
      { text: "The numerator is the top number - how many parts we have", emoji: "⬆️" },
      { text: "The denominator is the bottom number - total equal parts", emoji: "⬇️" },
      { text: "We can use visual models to compare fractions", emoji: "📊" },
    ])
    .meta({
      description: "2-5 key takeaways from the lesson, written as concise bullet points",
    }),
  nextStepsTitle: z
    .string()
    .max(40)
    .default("Next Steps")
    .meta({
      description: "Header for the next steps section (e.g., 'Next Steps', 'Homework', 'Practice Time')",
    }),
  nextStepsContent: z
    .string()
    .max(250)
    .optional()
    .meta({
      description: "Instructions for homework, practice activities, or what's coming in the next lesson",
    }),
  closingMessage: z
    .string()
    .max(100)
    .default("Great job today! 🌟")
    .meta({
      description: "An encouraging closing message for students",
    }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const recapPoints = data.recapPoints || [];

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
        <div style={{ height: "16px", background: "#2D5A4A" }} />

        <div className="flex-1 flex flex-col px-12 py-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "#2D5A4A",
                  border: "3px solid #1E2A3A",
                }}
              >
                <span className="text-2xl">✅</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "2.1rem",
                  fontWeight: 700,
                  color: "#1E2A3A",
                }}
              >
                {data.headerTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <img src="/static/orbit-logo.png" alt="" className="w-5 h-5" />
              <span className="text-xs font-medium" style={{ color: "#3D4F66" }}>
                Orbit Learn
              </span>
            </div>
          </div>

          <div className="flex-1 flex gap-8 items-start">
            <div className="flex-1 flex flex-col gap-3">
              {recapPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    background: "#FFFFFF",
                    border: "3px solid #1E2A3A",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: index % 2 === 0 ? "#D4A853" : "#2D5A4A",
                      border: "2px solid #1E2A3A",
                    }}
                  >
                    <span className="text-lg">{point.emoji || "•"}</span>
                  </div>
                  <p
                    style={{
                      fontSize: "1.08rem",
                      fontWeight: 500,
                      color: "#1E2A3A",
                      lineHeight: 1.4,
                    }}
                  >
                    {point.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-80 flex flex-col gap-5">
              {data.nextStepsContent && (
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: "#C75B39",
                    border: "3px solid #1E2A3A",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📋</span>
                    <h3 className="text-lg font-bold" style={{ color: "#FDF8F3" }}>
                      {data.nextStepsTitle}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#FDF8F3",
                      lineHeight: 1.5,
                    }}
                  >
                    {data.nextStepsContent}
                  </p>
                </div>
              )}

              <div
                className="p-6 rounded-2xl text-center"
                style={{
                  background: "#FFF4D6",
                  border: "3px solid #D4A853",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "#FFFFFF",
                    border: "3px solid #1E2A3A",
                  }}
                >
                  <span className="text-4xl">🎉</span>
                </div>
                <p
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#1E2A3A",
                    lineHeight: 1.3,
                  }}
                >
                  {data.closingMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
