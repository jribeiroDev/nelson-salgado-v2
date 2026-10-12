import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const plans = defineCollection({
  loader: file('src/content/plans.json'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    price: z.number(),
    period: z.string().default('mês'),
    tagline: z.string(),
    note: z.string().optional(),
    popular: z.boolean().default(false),
    includesPrevious: z.string().optional(),
    benefits: z.array(z.string()).min(1),
  }),
});

const programs = defineCollection({
  loader: file('src/content/programs.json'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      duration: z.string(),
      level: z.string(),
      time: z.string(),
      type: z.string(),
      gender: z.string(),
      popular: z.boolean().default(false),
      description: z.string(),
      image: image(),
      imageAlt: z.string(),
      features: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            highlight: z.boolean().default(false),
          }),
        )
        .min(1),
    }),
});

const testimonials = defineCollection({
  loader: file('src/content/testimonials.json'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      role: z.string(),
      photo: image(),
      quote: z.string(),
    }),
});

const faq = defineCollection({
  loader: file('src/content/faq.json'),
  schema: z.object({
    order: z.number(),
    question: z.string(),
    answer: z.string(),
  }),
});

export const collections = { plans, programs, testimonials, faq };
