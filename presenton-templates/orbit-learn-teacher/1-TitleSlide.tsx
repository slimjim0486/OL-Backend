import React from 'react';
import * as z from "zod";
import { ImageSchema } from '../schemas';

export const layoutId = 'orbit-learn-title-slide';
export const layoutName = 'Title Slide';
export const layoutDescription = 'Opening slide with lesson title, subject/grade info, and Orbit Learn branding';

export const Schema = z.object({
  title: z
    .string()
    .min(3)
    .max(80)
    .default("Introduction to Fractions")
    .meta({
      description: "The main lesson title - should be clear, engaging, and student-appropriate"
    }),
  subtitle: z
    .string()
    .min(3)
    .max(60)
    .default("Mathematics • Grade 3")
    .meta({
      description: "Subject and grade level, formatted as 'Subject • Grade X'"
    }),
  decorativeEmoji: z
    .string()
    .max(4)
    .default("📐")
    .meta({
      description: "A single emoji that represents the lesson topic"
    }),
  heroImage: ImageSchema.optional().meta({
    description: "Optional decorative image related to the lesson topic"
  })
});

type SchemaType = z.infer<typeof Schema>;

interface SlideProps {
  data?: Partial<SchemaType>;
}

const SlideComponent: React.FC<SlideProps> = ({ data: slideData }) => {
  return (
    <div
      className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#FDF8F3"
      }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(212,168,83,0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(45,90,74,0.12) 0%, transparent 40%),
            radial-gradient(circle at 60% 60%, rgba(199,91,57,0.08) 0%, transparent 35%)
          `
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,42,58,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,42,58,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating decorative shapes */}
      <div
        className="absolute top-12 right-16 w-20 h-20 rounded-2xl rotate-12"
        style={{
          background: '#D4A853',
          border: '3px solid #000',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
        }}
      />
      <div
        className="absolute bottom-20 left-12 w-14 h-14 rounded-full"
        style={{
          background: '#C75B39',
          border: '3px solid #000',
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)'
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-16 py-12">

        {/* Orbit Learn Logo - top left */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <span
            className="text-lg font-semibold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: '#2D5A4A'
            }}
          >
            Orbit Learn
          </span>
        </div>

        {/* Decorative emoji badge */}
        <div
          className="mb-6 w-24 h-24 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%)',
            border: '4px solid #000',
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <span className="text-5xl">{slideData?.decorativeEmoji || '📐'}</span>
        </div>

        {/* Title */}
        <h1
          className="text-center mb-4 leading-tight text-5xl font-bold"
          style={{
            color: '#1E2A3A',
            maxWidth: '900px'
          }}
        >
          {slideData?.title || 'Introduction to Fractions'}
        </h1>

        {/* Subtitle badge */}
        <div
          className="px-6 py-3 rounded-full"
          style={{
            background: '#2D5A4A',
            border: '3px solid #000',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <span
            className="text-xl font-semibold"
            style={{ color: '#FDF8F3' }}
          >
            {slideData?.subtitle || 'Mathematics • Grade 3'}
          </span>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3"
        style={{
          background: 'linear-gradient(90deg, #2D5A4A 0%, #D4A853 50%, #C75B39 100%)'
        }}
      />
    </div>
  );
};

export default SlideComponent;
