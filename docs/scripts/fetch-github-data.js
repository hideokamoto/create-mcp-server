import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_OWNER = 'hideokamoto';
const REPO_NAME = 'create-mcp-server';

async function fetchReleases() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`;
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'create-mcp-tools-docs'
    };

    // Add GitHub token if available to avoid rate limiting
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.warn('Failed to fetch releases from GitHub API, using empty array');
      return [];
    }

    const releases = await response.json();
    return releases.map(release => ({
      name: release.name,
      tag_name: release.tag_name,
      published_at: release.published_at,
      body: release.body,
      html_url: release.html_url,
      prerelease: release.prerelease,
      draft: release.draft
    }));
  } catch (error) {
    console.error('Error fetching releases:', error.message);
    return [];
  }
}

async function fetchReadme() {
  try {
    // Read README from parent directory
    const readmePath = join(__dirname, '../../README.md');
    const content = await readFile(readmePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading README:', error.message);
    return '';
  }
}

async function main() {
  console.log('Fetching GitHub data...');

  const [releases, readme] = await Promise.all([
    fetchReleases(),
    fetchReadme()
  ]);

  const data = {
    releases,
    readme,
    fetchedAt: new Date().toISOString()
  };

  const outputPath = join(__dirname, '../src/data/github.json');
  await writeFile(outputPath, JSON.stringify(data, null, 2));

  console.log(`✓ Fetched ${releases.length} releases`);
  console.log(`✓ Fetched README (${readme.length} chars)`);
  console.log(`✓ Data saved to ${outputPath}`);
}

main().catch(console.error);
