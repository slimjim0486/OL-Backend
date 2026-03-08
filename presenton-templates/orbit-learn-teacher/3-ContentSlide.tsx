import { z } from "zod";
import { ImageSchema } from "../schemas";

export const layoutId = "orbit-learn-content-slide";
export const layoutName = "Content Slide";
export const layoutDescription = "Main teaching content with header, body text, and optional image";

const VocabularyItemSchema = z.object({
  term: z.string().min(2).max(40).meta({
    description: "The vocabulary word or phrase",
  }),
  definition: z.string().min(10).max(150).meta({
    description: "A student-friendly definition of the term",
  }),
});

export const Schema = z.object({
  sectionHeader: z
    .string()
    .min(3)
    .max(60)
    .default("Understanding Fractions")
    .meta({
      description: "The main header for this content section",
    }),
  bodyParagraphs: z
    .array(z.string().min(20).max(400))
    .min(1)
    .max(3)
    .default([
      "A fraction represents a part of a whole. When we divide something into equal pieces, each piece is a fraction of the original.",
      "The top number (numerator) tells us how many parts we have. The bottom number (denominator) tells us how many equal parts make up the whole.",
    ])
    .meta({
      description: "1-3 paragraphs of teaching content, written in clear, student-appropriate language",
    }),
  contentImage: ImageSchema.optional().meta({
    description: "Optional visual that supports the content (diagram, illustration, or example)",
  }),
  vocabularyItems: z
    .array(VocabularyItemSchema)
    .max(3)
    .optional()
    .meta({
      description: "Optional vocabulary terms introduced in this section (max 3)",
    }),
  highlightBox: z
    .string()
    .max(200)
    .optional()
    .meta({
      description: "Optional highlighted tip, fact, or important note",
    }),
});

type SchemaType = z.infer<typeof Schema>;

const SlideComponent = ({ data }: { data: Partial<SchemaType> }) => {
  const paragraphs = data.bodyParagraphs || [];
  const vocabulary = data.vocabularyItems || [];
  const hasImage = Boolean(data.contentImage?.__image_url__);
  const hasVocabulary = vocabulary.length > 0;

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
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-3 rounded-full flex-shrink-0"
              style={{ background: "#2D5A4A", minHeight: "72px" }}
            />
            <div className="flex-1">
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "#1E2A3A",
                  lineHeight: 1.1,
                }}
              >
                {data.sectionHeader}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#3D4F66",
                  marginTop: "8px",
                }}
              >
                Core teaching content anchored to the top of the slide for cleaner export.
              </p>
            </div>
          </div>

          <div className={`flex-1 ${hasImage ? "flex gap-8" : "block"}`}>
            <div className={hasImage ? "flex-1" : "max-w-5xl"}>
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === paragraphs.length - 1 ? "" : "mb-4"}
                  style={{
                    fontSize: "1.18rem",
                    lineHeight: 1.7,
                    color: "#1E2A3A",
                  }}
                >
                  {paragraph}
                </p>
              ))}

              {data.highlightBox && (
                <div
                  className="mt-5 p-5 rounded-2xl flex items-start gap-3"
                  style={{
                    background: "#FFF4D6",
                    border: "3px solid #D4A853",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <p
                    style={{
                      fontSize: "1.08rem",
                      fontWeight: 500,
                      color: "#1E2A3A",
                      lineHeight: 1.5,
                    }}
                  >
                    {data.highlightBox}
                  </p>
                </div>
              )}

              {hasVocabulary && (
                <div className="mt-5">
                  <div
                    className="p-5 rounded-2xl"
                    style={{
                      background: "#FFFFFF",
                      border: "3px solid #1E2A3A",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">📖</span>
                      <h3 className="text-lg font-bold" style={{ color: "#2D5A4A" }}>
                        Key Vocabulary
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {vocabulary.map((item, index) => (
                        <div key={index} className="flex items-baseline gap-2">
                          <span
                            className="font-bold"
                            style={{
                              color: "#C75B39",
                              fontSize: "1.05rem",
                            }}
                          >
                            {item.term}:
                          </span>
                          <span
                            style={{
                              color: "#3D4F66",
                              fontSize: "1rem",
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

            {hasImage && (
              <div
                className="flex-shrink-0 rounded-3xl overflow-hidden self-start"
                style={{
                  width: "320px",
                  border: "4px solid #1E2A3A",
                  background: "#FFFFFF",
                }}
              >
                <img
                  src={data.contentImage!.__image_url__}
                  alt={data.contentImage!.__image_prompt__ || "Content illustration"}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full" style={{ background: "#2D5A4A" }} />
              <div className="w-4 h-4 rounded-full" style={{ background: "#D4A853" }} />
              <div className="w-4 h-4 rounded-full" style={{ background: "#C75B39" }} />
            </div>
            <div className="flex items-center gap-2">
              <img src="/static/orbit-logo.png" alt="" className="w-5 h-5" />
              <span className="text-xs font-medium" style={{ color: "#3D4F66" }}>
                Orbit Learn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideComponent;
