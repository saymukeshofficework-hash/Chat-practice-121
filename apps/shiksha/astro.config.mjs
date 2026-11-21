import { unified } from '@astrojs/markdown-remark';
import { defineConfig, envField } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { loadEnv, searchForWorkspaceRoot } from 'vite';
import { fileURLToPath } from 'node:url';

const localEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: process.env.SITE_URL || localEnv.SITE_URL || 'https://shiksha.buzz',
  output: 'static',
  trailingSlash: 'always',
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [[rehypeKatex, { throwOnError: true }]] }) },
  vite: {
    server: { fs: { allow: [searchForWorkspaceRoot(process.cwd()), fileURLToPath(new URL('../../content/', import.meta.url))] } },
  },
  env: {
    schema: {
      ENABLE_HINDI: envField.boolean({ context: 'server', access: 'public', default: false }),
      ENABLE_INDEXING: envField.boolean({ context: 'server', access: 'public', default: false }),
      ACADEMIC_SESSION: envField.string({ context: 'server', access: 'public', default: '2026–27' }),
      EXAM_NAME: envField.string({ context: 'server', access: 'public', optional: true }),
      EXAM_DATE: envField.string({ context: 'server', access: 'public', optional: true }),
      REPORT_EMAIL: envField.string({ context: 'server', access: 'public', optional: true }),
      TEST_ENGINE: envField.enum({ context: 'server', access: 'public', values: ['local', 'tettesthub'], default: 'local' }),
      TETTESTHUB_TEST_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      TETTESTHUB_SIGNUP_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      TETTESTHUB_SERIES_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      SCHOOL_CURRICULUM_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      SEARCH_CONSOLE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_CLARITY_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
