import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const review = z.object({
  session: z.string().min(1),
  source: z.url(),
  writer: z.string().min(1),
  reviewer: z.string().min(1),
  writerProfile: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  reviewerProfile: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  checkedOn: z.iso.date(),
}).refine(({ writer, reviewer }) => writer.trim().toLowerCase() !== reviewer.trim().toLowerCase(), {
  message: 'The reviewer must be different from the writer.',
});

const lessons = defineCollection({
  loader: glob({ base: '../../content', pattern: 'class-*/**/*.md', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['sample', 'reviewed']).default('sample'),
    chapterNumber: z.number().int().positive().optional(),
    testId: z.string().regex(/^[a-z0-9-]+$/).optional(),
    engineTestId: z.string().regex(/^[a-zA-Z0-9_-]+$/).optional(),
    diagram: z.enum(['light-reflection']).optional(),
    review: review.optional(),
  }).superRefine((entry, context) => {
    if (entry.status === 'reviewed' && !entry.review) {
      context.addIssue({ code: 'custom', message: 'Reviewed entries require syllabus, source, writer, reviewer and check date.' });
    }
  }),
});

export const collections = { lessons };
