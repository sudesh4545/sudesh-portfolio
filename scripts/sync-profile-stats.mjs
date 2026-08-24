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
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
    }
  }`;
  const payload = await fetchJson('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { username: 'Sudesh4545' } }),
  });
  const user = payload.data?.matchedUser;
  const accepted = user?.submitStatsGlobal?.acSubmissionNum?.find((item) => item.difficulty === 'All');
  const total = user?.submitStatsGlobal?.totalSubmissionNum?.find((item) => item.difficulty === 'All');
  if (!user || !accepted || !total) throw new Error('LeetCode profile data missing');
  return {
    solved: accepted.count,
    submissions: total.submissions,
    acceptance: total.submissions ? Math.round((accepted.submissions / total.submissions) * 100) : 0,
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
  const [user, repositories, contributionResponse] = await Promise.all([
    fetchJson('https://api.github.com/users/sudesh4545', { headers: { accept: 'application/vnd.github+json' } }),
    fetchJson('https://api.github.com/users/sudesh4545/repos?per_page=100&type=owner', {
      headers: { accept: 'application/vnd.github+json' },
    }),
    fetch('https://github.com/users/sudesh4545/contributions', { headers }),
  ]);
  if (!contributionResponse.ok) throw new Error(`GitHub contributions returned ${contributionResponse.status}`);
  const contributionHtml = await contributionResponse.text();
  const dayPattern = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d+)"[^>]*>[\s\S]*?<\/td>\s*<tool-tip[^>]*>([^<]+)<\/tool-tip>/gi;
  const contributions = [...contributionHtml.matchAll(dayPattern)].map((match) => {
    const countMatch = match[3].match(/^([\d,]+) contributions?/i);
    return {
      date: match[1],
      count: countMatch ? Number(countMatch[1].replaceAll(',', '')) : 0,
      level: Number(match[2]),
    };
  });
  if (contributions.length < 300) throw new Error('GitHub contribution calendar data missing');
  return {
    repositories: user.public_repos,
    followers: user.followers,
    stars: repositories.reduce((total, repository) => total + repository.stargazers_count, 0),
    totalContributions: contributions.reduce((total, day) => total + day.count, 0),
    contributions,
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
