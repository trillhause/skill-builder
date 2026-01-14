// Mock skill folder data structure for File Browser

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  path: string;
  content?: string; // Only for files
  language?: string; // For Monaco editor syntax highlighting
  children?: FileNode[]; // Only for folders
}

// Sample Skill.md content
const skillMdContent = `# Blog Content Extraction Skill

Extract and summarize blog URLs and metadata for a given company's blog using efficient modular discovery.

## Methodology

Efficiently extract all blog URLs and metadata for a given company's blog using efficient modular discovery.
Use multiple discovery strategies to find blog URLs and important metadata:

1. **Targeted crawling** - Use the given blog platform to get all URLs (e.g., "ghost", "figma").
2. **Sitemap discovery** - Check for and parse sitemap.xml if available.
3. **RSS/Atom feeds** - Look for RSS or Atom feeds that list recent posts.
4. **Pagination discovery** - Follow pagination links to discover all posts.

For example, crawling Ghost will generate:
\`\`\`javascript
const ghostPosts = await fetchGhostAPI(baseURL);
\`\`\`

Parse the response to extract all blog post URLs, publish dates, titles, and descriptions.

## Why Modular Discovery?

Different websites structure their blog differently. Different websites structure their blog posts differently (Ghost, WordPress, custom CMS). Websites vary in sitemap availability and RSS feeds. DOM structures differ across platforms.

Reduces dependencies on blog platform or how the blog posts are structured.
`;

// Sample helpers.js content
const helpersJsContent = `// Helper functions for blog extraction

/**
 * Fetch and parse JSON from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<any>} Parsed JSON response
 */
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return await response.json();
}

/**
 * Extract domain from URL
 * @param {string} url - Full URL
 * @returns {string} Domain name
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
}

/**
 * Parse sitemap XML
 * @param {string} xmlContent - XML content
 * @returns {Array<string>} Array of URLs
 */
function parseSitemap(xmlContent) {
  // Simple regex-based parsing (in production, use proper XML parser)
  const urlRegex = /<loc>(.*?)<\\/loc>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(xmlContent)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

module.exports = {
  fetchJSON,
  extractDomain,
  parseSitemap
};
`;

// Sample scraper.py content
const scraperPyContent = `#!/usr/bin/env python3
"""
Blog scraper utility for extracting metadata
"""

import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from urllib.parse import urljoin, urlparse


class BlogScraper:
    """Scraper for blog post metadata extraction"""

    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'BlogExtractor/1.0'
        })

    def fetch_page(self, url: str) -> str:
        """Fetch HTML content from URL"""
        response = self.session.get(url)
        response.raise_for_status()
        return response.text

    def extract_meta_tags(self, html: str) -> Dict[str, str]:
        """Extract meta tags from HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        meta_data = {}

        # Open Graph tags
        for tag in soup.find_all('meta', property=True):
            if tag['property'].startswith('og:'):
                meta_data[tag['property']] = tag.get('content', '')

        # Twitter Card tags
        for tag in soup.find_all('meta', attrs={'name': True}):
            if tag['name'].startswith('twitter:'):
                meta_data[tag['name']] = tag.get('content', '')

        return meta_data

    def find_blog_posts(self, html: str) -> List[str]:
        """Find blog post links in HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        links = []

        for link in soup.find_all('a', href=True):
            href = link['href']
            # Convert relative URLs to absolute
            absolute_url = urljoin(self.base_url, href)

            # Filter for blog post patterns
            if '/blog/' in absolute_url or '/post/' in absolute_url:
                links.append(absolute_url)

        return list(set(links))  # Remove duplicates


if __name__ == '__main__':
    scraper = BlogScraper('https://example.com')
    print('Blog scraper initialized')
`;

// Sample types.ts content
const typesTsContent = `// TypeScript type definitions for blog extraction

export interface BlogPost {
  url: string;
  title: string;
  description: string;
  publishDate: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface BlogMetadata {
  siteName: string;
  baseUrl: string;
  platform?: 'ghost' | 'wordpress' | 'custom';
  totalPosts: number;
  lastUpdated: string;
}

export interface ExtractionResult {
  metadata: BlogMetadata;
  posts: BlogPost[];
  errors?: string[];
}

export interface ScraperConfig {
  maxPages?: number;
  includeImages?: boolean;
  followPagination?: boolean;
  timeout?: number;
}

export type ExtractionStrategy =
  | 'ghost-api'
  | 'sitemap'
  | 'rss-feed'
  | 'pagination'
  | 'crawl';

export interface StrategyResult {
  strategy: ExtractionStrategy;
  postsFound: number;
  success: boolean;
  error?: string;
}
`;

// Sample config.json content
const configJsonContent = `{
  "skillName": "Blog Content Extraction",
  "version": "1.0.0",
  "platform": "multiple",
  "strategies": [
    "ghost-api",
    "sitemap",
    "rss-feed",
    "pagination"
  ],
  "defaults": {
    "maxPages": 100,
    "timeout": 30000,
    "includeImages": true,
    "followPagination": true
  },
  "endpoints": {
    "ghost": "/ghost/api/v3/content/posts/",
    "sitemap": "/sitemap.xml",
    "rss": "/rss/"
  }
}
`;

// Sample README.md content
const readmeMdContent = `# Blog Extraction Skill

This skill extracts blog posts and metadata from company blogs using multiple discovery strategies.

## Files

- **Skill.md** - Main skill specification and methodology
- **helpers.js** - JavaScript utility functions for fetching and parsing
- **scraper.py** - Python scraper for metadata extraction
- **types.ts** - TypeScript type definitions
- **config.json** - Configuration for extraction strategies

## Usage

The skill uses a modular approach to discover blog posts across different platforms and CMS systems.

## Supported Platforms

- Ghost
- WordPress
- Custom CMS with sitemap/RSS
`;

// Mock skill folder structure
export const mockSkillFolder: FileNode = {
  id: 'root',
  name: 'Skill Folder',
  type: 'folder',
  path: '/',
  children: [
    {
      id: 'skill-md',
      name: 'Skill.md',
      type: 'file',
      path: '/Skill.md',
      content: skillMdContent,
      language: 'markdown'
    },
    {
      id: 'readme-md',
      name: 'README.md',
      type: 'file',
      path: '/README.md',
      content: readmeMdContent,
      language: 'markdown'
    },
    {
      id: 'scripts-folder',
      name: 'scripts',
      type: 'folder',
      path: '/scripts',
      children: [
        {
          id: 'helpers-js',
          name: 'helpers.js',
          type: 'file',
          path: '/scripts/helpers.js',
          content: helpersJsContent,
          language: 'javascript'
        },
        {
          id: 'scraper-py',
          name: 'scraper.py',
          type: 'file',
          path: '/scripts/scraper.py',
          content: scraperPyContent,
          language: 'python'
        }
      ]
    },
    {
      id: 'types-folder',
      name: 'types',
      type: 'folder',
      path: '/types',
      children: [
        {
          id: 'types-ts',
          name: 'types.ts',
          type: 'file',
          path: '/types/types.ts',
          content: typesTsContent,
          language: 'typescript'
        }
      ]
    },
    {
      id: 'config-json',
      name: 'config.json',
      type: 'file',
      path: '/config.json',
      content: configJsonContent,
      language: 'json'
    }
  ]
};

// Helper function to find a file by path
export function findFileByPath(path: string, node: FileNode = mockSkillFolder): FileNode | null {
  if (node.path === path) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findFileByPath(path, child);
      if (found) return found;
    }
  }

  return null;
}

// Helper function to get all files (excluding folders)
export function getAllFiles(node: FileNode = mockSkillFolder): FileNode[] {
  const files: FileNode[] = [];

  if (node.type === 'file') {
    files.push(node);
  }

  if (node.children) {
    for (const child of node.children) {
      files.push(...getAllFiles(child));
    }
  }

  return files;
}
