import { z } from "zod";

/**
 * Shared schemas for Presenton template images and icons
 * These follow Presenton's conventions for AI-generated visuals
 */

/**
 * Schema for images that can be AI-generated or sourced from stock
 */
export const ImageSchema = z.object({
  __image_url__: z
    .string()
    .url()
    .meta({
      description: "URL of the image to display"
    }),
  __image_prompt__: z
    .string()
    .max(500)
    .meta({
      description: "A detailed prompt describing the desired image for AI generation"
    })
});

/**
 * Schema for icons (typically smaller, simpler graphics)
 */
export const IconSchema = z.object({
  __icon_url__: z
    .string()
    .meta({
      description: "URL or path to the icon"
    }),
  __icon_query__: z
    .string()
    .max(100)
    .meta({
      description: "Search query or description for finding/generating the icon"
    })
});

export type ImageSchemaType = z.infer<typeof ImageSchema>;
export type IconSchemaType = z.infer<typeof IconSchema>;
