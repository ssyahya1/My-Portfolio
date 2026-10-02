/**
 * =========================================================================
 * GITHUB API SERVICE
 * =========================================================================
 * A thin, predictable wrapper around the public GitHub REST API.
 *
 * Responsibilities
 *  - build requests (username, optional token, pagination)
 *  - give every failure a machine-readable `type` and a human-readable message
 *  - short-lived in-memory caching so re-renders do not burn the rate limit
 *
 * Deliberately NOT responsible for: filtering repositories, categorising them
 * or building project models. That lives in src/data/projects.js.
 *
 * GitHub allows 60 unauthenticated requests per hour per IP. If a token is
 * provided through VITE_GITHUB_TOKEN the limit becomes 5,000/hour.
 */

import { GITHUB_USERNAME } from '../data/site.js'

const API_BASE = 'https://api.github.com'
const RAW_BASE = 'https://raw.githubusercontent.com'
const TOKEN = ((import.meta.env && import.meta.env.VITE_GITHUB_TOKEN) || '').trim()

const MAX_PAGES = 3
const PER_PAGE = 100
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/** Error carrying a `type` the UI can switch on. */
export class GitHubApiError extends Error {
  constructor(message, { type = 'unknown', status = 0, resetAt = null } = {}) {
    super(message)
    this.name = 'GitHubApiError'
    this.type = type
    this.status = status
    this.resetAt = resetAt
  }
}

/** Plain-language text for each failure mode, used by the UI. */
export const GITHUB_ERROR_COPY = {
  rate_limit: {
    title: 'GitHub rate limit reached',
    body: 'GitHub only allows a limited number of requests per hour for anonymous visitors. The projects will load again shortly — or set VITE_GITHUB_TOKEN to raise the limit.',
  },
  not_found: {
    title: 'GitHub user not found',
    body: 'The configured GitHub username could not be found. Check VITE_GITHUB_USERNAME.',
  },
  network: {
    title: 'Could not reach GitHub',
    body: 'The network request to the GitHub API failed. Check the connection and try again.',
  },
  http: {
    title: 'GitHub returned an error',
    body: 'GitHub responded with an unexpected status. Trying again usually resolves it.',
  },
  unknown: {
    title: 'Something went wrong loading projects',
    body: 'The projects could not be loaded from GitHub. Try again in a moment.',
  },
}

export function describeGitHubError(error) {
  const type = error instanceof GitHubApiError ? error.type : 'unknown'
  const copy = GITHUB_ERROR_COPY[type] || GITHUB_ERROR_COPY.unknown
  return {
    type,
    title: copy.title,
    body: copy.body,
    status: error?.status || 0,
    resetAt: error?.resetAt || null,
  }
}

/* ------------------------------------------------------------------ cache */
const cache = new Map()

function readCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.time > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.value
}

function writeCache(key, value) {
  cache.set(key, { time: Date.now(), value })
}

export function clearGitHubCache() {
  cache.clear()
}

/* ---------------------------------------------------------------- request */
function buildHeaders(accept = 'application/vnd.github+json') {
  const headers = { Accept: accept, 'X-GitHub-Api-Version': '2022-11-28' }
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`
  return headers
}

function rateLimitInfo(response) {
  const remaining = response.headers.get('x-ratelimit-remaining')
  const reset = response.headers.get('x-ratelimit-reset')
  const resetAt = reset ? new Date(Number(reset) * 1000) : null
  return { remaining: remaining === null ? null : Number(remaining), resetAt }
}

async function requestJson(path, { signal } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, { headers: buildHeaders(), signal })
  } catch (error) {
    if (error && error.name === 'AbortError') throw error
    throw new GitHubApiError('Network request to the GitHub API failed.', { type: 'network' })
  }

  const { remaining, resetAt } = rateLimitInfo(response)
  const rateLimitExhausted = remaining === 0

  if (response.status === 403 || response.status === 429) {
    throw new GitHubApiError(
      rateLimitExhausted
        ? 'GitHub API rate limit has been reached.'
        : 'GitHub refused the request (403/429).',
      { type: 'rate_limit', status: response.status, resetAt },
    )
  }

  if (response.status === 404) {
    throw new GitHubApiError('Requested GitHub resource was not found.', {
      type: 'not_found',
      status: 404,
    })
  }

  if (!response.ok) {
    throw new GitHubApiError(`GitHub responded with status ${response.status}.`, {
      type: 'http',
      status: response.status,
      resetAt,
    })
  }

  try {
    return await response.json()
  } catch {
    throw new GitHubApiError('GitHub returned a response that could not be parsed.', {
      type: 'http',
      status: response.status,
    })
  }
}

/* ------------------------------------------------------------ public API */

/**
 * Public repositories owned by the configured user, newest activity first.
 * Follows pagination up to MAX_PAGES so a growing profile keeps working.
 */
export async function fetchRepos({ username = GITHUB_USERNAME, signal } = {}) {
  const cacheKey = `repos:${username}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const all = []

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const path = `/users/${encodeURIComponent(username)}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated&type=owner`
    const batch = await requestJson(path, { signal })

    if (!Array.isArray(batch)) {
      throw new GitHubApiError('GitHub returned an unexpected payload for repositories.', {
        type: 'http',
      })
    }

    all.push(...batch)
    if (batch.length < PER_PAGE) break
  }

  writeCache(cacheKey, all)
  return all
}

/** Profile summary used by the GitHub section (repos count, avatar, join date). */
export async function fetchUser({ username = GITHUB_USERNAME, signal } = {}) {
  const cacheKey = `user:${username}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const user = await requestJson(`/users/${encodeURIComponent(username)}`, { signal })
  writeCache(cacheKey, user)
  return user
}

/**
 * README for a repository, fetched on demand only.
 *
 * READMEs live on raw.githubusercontent.com, which is not subject to the API
 * rate limit, so this is safe to call when a project detail view is opened.
 * Returns `null` instead of throwing: a missing README is not an error.
 */
export async function fetchRepoReadme(repoName, { branch = 'main', maxLength = 24000 } = {}) {
  if (!repoName) return null

  const url = `${RAW_BASE}/${encodeURIComponent(GITHUB_USERNAME)}/${encodeURIComponent(repoName)}/${encodeURIComponent(branch)}/README.md`

  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const text = await response.text()
    return text.slice(0, maxLength)
  } catch {
    return null
  }
}

/** True when a token is configured (used to explain rate limits in the UI). */
export function hasGitHubToken() {
  return Boolean(TOKEN)
}

export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`