import { readFile, writeFile } from 'node:fs/promises';

const outputUrl = new URL('../src/data/live-stats.json', import.meta.url);
const fallback = JSON.parse(await readFile(outputUrl, 'utf8'));
const headers = { 'user-agent': 'SudeshPortfolio/1.0' };

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function getLeetCode() {
  const query = `query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
    }
  }`;
  const payload = await fetchJson('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: 'Sudesh4545' } }),
  });
  const user = payload.data?.matchedUser;
  const all = user?.submitStatsGlobal?.acSubmissionNum?.find((item) => item.difficulty === 'All');
  if (!user || !all) throw new Error('LeetCode profile data missing');
  return {
    solved: all.count,
    submissions: all.submissions,
    acceptance: all.submissions ? Math.round((all.count / all.submissions) * 100) : 0,
    ranking: user.profile?.ranking ?? null,
  };
}

async function getHackerRank() {
  const badgePayload = await fetchJson('https://www.hackerrank.com/rest/hackers/sudeshmehar3/badges');
  const problemSolving = badgePayload.models?.find((badge) => badge.badge_type === 'problem-solving');
  if (!problemSolving) throw new Error('HackerRank Problem Solving badge missing');

  const profileResponse = await fetch('https://www.hackerrank.com/profile/sudeshmehar3', { headers });
  if (!profileResponse.ok) throw new Error(`HackerRank profile returned ${profileResponse.status}`);
  const html = await profileResponse.text();
  const certificatePattern = /href="\/certificates\/([a-z0-9]+)"[\s\S]*?<h2[^>]*>(?:<span[^>]*>[\s\S]*?<\/span>)?([^<]+)<\/h2>/gi;
  const certificates = [];
  for (const match of html.matchAll(certificatePattern)) {
    if (!certificates.some((certificate) => certificate.id === match[1])) {
      certificates.push({
        id: match[1],
        name: match[2].trim(),
        url: `https://www.hackerrank.com/certificates/${match[1]}`,
      });
    }
  }

  return {
    solved: problemSolving.solved,
    stars: problemSolving.stars ?? problemSolving.total_stars,
    rank: problemSolving.hacker_rank,
    topPercent: Math.max(1, Math.ceil((problemSolving.hacker_rank / 30_000_000) * 100)),
    certificates,
  };
}

async function getGitHub() {
  const [user, repositories] = await Promise.all([
    fetchJson('https://api.github.com/users/sudesh4545', { headers: { accept: 'application/vnd.github+json' } }),
    fetchJson('https://api.github.com/users/sudesh4545/repos?per_page=100&type=owner', {
      headers: { accept: 'application/vnd.github+json' },
    }),
  ]);
  return {
    repositories: user.public_repos,
    followers: user.followers,
    stars: repositories.reduce((total, repository) => total + repository.stargazers_count, 0),
  };
}

const results = await Promise.allSettled([getLeetCode(), getHackerRank(), getGitHub()]);
const names = ['leetcode', 'hackerrank', 'github'];
const next = { ...fallback, updatedAt: new Date().toISOString() };
results.forEach((result, index) => {
  const name = names[index];
  if (result.status === 'fulfilled') next[name] = result.value;
  else console.warn(`${name} sync failed; keeping last verified values: ${result.reason}`);
});

await writeFile(outputUrl, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
console.log(`Profile data synced at ${next.updatedAt}`);
