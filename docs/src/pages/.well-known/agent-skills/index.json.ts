import type { APIRoute } from 'astro';
import { loadSkills, SKILLS_INDEX_SCHEMA } from '../../../lib/skills';

// Agent Skills Discovery index (https://github.com/cloudflare/agent-skills-discovery-rfc, v0.2.0).
export const GET: APIRoute = () =>
  Response.json({
    $schema: SKILLS_INDEX_SCHEMA,
    skills: loadSkills().map(({ name, description, url, digest }) => ({
      name,
      type: 'skill-md',
      description,
      url,
      digest,
    })),
  });
