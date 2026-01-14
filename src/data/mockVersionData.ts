// Mock version history data for Version Graph

export interface VersionData {
  id: string;
  versionNumber: number;
  name: string;
  date: string;
  isCurrent: boolean;
  parentVersionId: string | null;
  description?: string;
}

export const mockVersions: VersionData[] = [
  {
    id: 'v8',
    versionNumber: 8,
    name: 'Version 8',
    date: '2026-01-14',
    isCurrent: true,
    parentVersionId: 'v7',
    description: 'Added error handling improvements'
  },
  {
    id: 'v7',
    versionNumber: 7,
    name: 'Version 7',
    date: '2026-01-13',
    isCurrent: false,
    parentVersionId: 'v6',
    description: 'Enhanced content extraction logic'
  },
  {
    id: 'v6',
    versionNumber: 6,
    name: 'Version 6',
    date: '2026-01-12',
    isCurrent: false,
    parentVersionId: 'v5',
    description: 'Fixed scraper timeout issues'
  },
  {
    id: 'v5',
    versionNumber: 5,
    name: 'Version 5',
    date: '2026-01-11',
    isCurrent: false,
    parentVersionId: 'v4',
    description: 'Updated skill instructions'
  },
  {
    id: 'v4',
    versionNumber: 4,
    name: 'Version 4',
    date: '2026-01-10',
    isCurrent: false,
    parentVersionId: 'v3',
    description: 'Added helper functions'
  },
  {
    id: 'v3',
    versionNumber: 3,
    name: 'Version 3',
    date: '2026-01-09',
    isCurrent: false,
    parentVersionId: 'v2',
    description: 'Improved type definitions'
  },
  {
    id: 'v2',
    versionNumber: 2,
    name: 'Version 2',
    date: '2026-01-08',
    isCurrent: false,
    parentVersionId: 'v1',
    description: 'Added Python scraper script'
  },
  {
    id: 'v1',
    versionNumber: 1,
    name: 'Version 1',
    date: '2026-01-07',
    isCurrent: false,
    parentVersionId: null,
    description: 'Initial skill creation'
  }
];

/**
 * Get the current version
 */
export function getCurrentVersion(): VersionData | undefined {
  return mockVersions.find(v => v.isCurrent);
}

/**
 * Get a version by ID
 */
export function getVersionById(id: string): VersionData | undefined {
  return mockVersions.find(v => v.id === id);
}

/**
 * Get all versions sorted by version number (descending)
 */
export function getAllVersions(): VersionData[] {
  return [...mockVersions].sort((a, b) => b.versionNumber - a.versionNumber);
}

/**
 * Get child versions of a given version
 */
export function getChildVersions(versionId: string): VersionData[] {
  return mockVersions.filter(v => v.parentVersionId === versionId);
}

/**
 * Get version history path from root to given version
 */
export function getVersionPath(versionId: string): VersionData[] {
  const path: VersionData[] = [];
  let currentVersion = getVersionById(versionId);

  while (currentVersion) {
    path.unshift(currentVersion);
    currentVersion = currentVersion.parentVersionId
      ? getVersionById(currentVersion.parentVersionId)
      : undefined;
  }

  return path;
}
