import { z } from "zod";
import { ImageSchema } from "../schemas";

export const layoutId = "orbit-learn-title-slide";
export const layoutName = "Title Slide";
export const layoutDescription =
  "Opening slide with lesson title, subject/grade info, and Orbit Learn branding";

export const Schema = z.object({
  title: z
    .string()
    .min(3)
    .max(80)
    .default("Introduction to Fractions")
    .meta({
      description: "The main lesson title - should be clear, engaging, and student-appropriate",
    }),
  subtitle: z
    .string()
    .min(3)
    .max(60)
    .default("Mathematics • Grade 3")
    .meta({
      description: "Subject and grade level, formatted as 'Subject • Grade X'",
    }),
  decorativeEmoji: z
    .string()
    .max(4)
    .default("📐")
    .meta({
      description:
        "A single emoji that represents the lesson topic (e.g., 📐 for math, 🔬 for science, 📚 for reading)",
    }),
  heroImage: ImageSchema.optional().meta({
    description: "Optional decorative image related to the lesson topic",
  }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const hasImage = Boolean(data.heroImage?.__image_url__);

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
        <div style={{ height: "18px", background: "#2D5A4A" }} />

        <div className="flex-1 flex flex-col px-12 py-10">
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "3px solid #1E2A3A",
              }}
            >
              <img src="/static/orbit-logo.png" alt="Orbit Learn" className="w-10 h-10" />
              <span
                className="text-lg font-semibold"
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: "#1E2A3A",
                }}
              >
                Orbit Learn
              </span>
            </div>

            <div
              className="px-5 py-3 rounded-2xl"
              style={{
                background: "#D4A853",
                border: "3px solid #1E2A3A",
              }}
            >
              <span
                style={{
                  fontSize: "2.25rem",
                  lineHeight: 1,
                }}
              >
                {data.decorativeEmoji}
              </span>
            </div>
          </div>

          <div className={`flex flex-1 ${hasImage ? "gap-10" : ""}`}>
            <div className={hasImage ? "flex-1 pr-2" : "w-full max-w-5xl"}>
              <div
                className="inline-flex items-center px-5 py-2 rounded-full mb-5"
                style={{
                  background: "#C75B39",
                  border: "3px solid #1E2A3A",
                }}
              >
                <span
                  className="font-bold uppercase tracking-wide"
                  style={{
                    color: "#FDF8F3",
                    fontSize: "0.95rem",
                  }}
                >
                  Teacher Presentation
                </span>
              </div>

              <h1
                className="mb-5"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "3.35rem",
                  fontWeight: 800,
                  color: "#1E2A3A",
                  lineHeight: 1.08,
                  maxWidth: hasImage ? "820px" : "980px",
                }}
              >
                {data.title}
              </h1>

              <div
                className="inline-flex px-6 py-3 rounded-full mb-6"
                style={{
                  background: "#2D5A4A",
                  border: "3px solid #1E2A3A",
                }}
              >
                <span
                  className="text-xl font-semibold"
                  style={{
                    color: "#FDF8F3",
                  }}
                >
                  {data.subtitle}
                </span>
              </div>

              <div
                className="p-6 rounded-3xl"
                style={{
                  background: "#FFFFFF",
                  border: "4px solid #1E2A3A",
                }}
              >
                <p
                  style={{
                    fontSize: "1.3rem",
                    lineHeight: 1.6,
                    color: "#3D4F66",
                    fontWeight: 500,
                  }}
                >
                  This lesson deck is laid out from the top of the slide so the exported presentation
                  stays readable and classroom-ready.
                </p>
              </div>
            </div>

            {hasImage && (
              <div
                className="flex-shrink-0 rounded-3xl overflow-hidden self-start"
                style={{
                  width: "320px",
                  background: "#FFFFFF",
                  border: "4px solid #1E2A3A",
                }}
              >
                <img
                  src={data.heroImage!.__image_url__}
                  alt={data.heroImage!.__image_prompt__ || "Lesson illustration"}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-8">
            <div className="h-4 w-20 rounded-full" style={{ background: "#2D5A4A" }} />
            <div className="h-4 w-20 rounded-full" style={{ background: "#D4A853" }} />
            <div className="h-4 w-20 rounded-full" style={{ background: "#C75B39" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
