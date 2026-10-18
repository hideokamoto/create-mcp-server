import type { APIRoute, GetStaticPaths } from 'astro';
import { loadSkills, markdownHeaders } from '../../../../lib/skills';

export const getStaticPaths = (() =>
  loadSkills().map((skill) => ({ params: { name: skill.name } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const skill = loadSkills().find((s) => s.name === params.name);
  if (!skill) return new Response('Not found', { status: 404 });
  return new Response(skill.content, { headers: markdownHeaders });
};
