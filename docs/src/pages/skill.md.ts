import type { APIRoute } from 'astro';
import { loadPrimarySkill, markdownHeaders } from '../lib/skills';

export const GET: APIRoute = () =>
  new Response(loadPrimarySkill().content, { headers: markdownHeaders });
