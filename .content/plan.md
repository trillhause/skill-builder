# Implementation Plan: Finder-like Version Viewer

## Overview
Transform the version viewer from a tree-based view to a Finder-like file browser with horizontal split layout, grid view, and clickable breadcrumb navigation.

## Current State Analysis

**Current Implementation:**
- `VersionViewerTab.tsx` - Shows ReadOnlyFileTree component
- `ReadOnlyFileTree.tsx` - Recursive tree with expand/collapse, files not clickable
- Uses FileNode data structure (id, name, type, path, content, language, children)
- No file content viewing capability

**Data Structure (FileNode):**
```typescript
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;      // For files
  language?: string;     // For syntax highlighting
  children?: FileNode[]; // For folders
}
```

## Design Requirements

**User Preferences (from questionnaire):**
1. **Horizontal split**: File list (LEFT) + Content viewer (RIGHT)
2. **Grid view**: Large icons for files/folders
3. **Clickable breadcrumbs**: Full path navigation

**Functional Requirements:**
- Navigate into folders by clicking
- Navigate back/up via breadcrumb clicks
- Display file content in Monaco editor (read-only)
- Keep "Checkout Version" button at bottom

## Implementation Plan

### Phase 1: Helper Functions & Navigation Logic

**Create: `src/utils/fileNavigation.ts`**

```typescript
// Helper functions for file/folder navigation

export interface PathSegment {
  name: string;
  path: string;
  node: FileNode;
}

// Get folder contents by path
export function getFolderContents(root: FileNode, path: string): FileNode[] {
  // Navigate to path and return children
}

// Build breadcrumb segments from path
export function buildBreadcrumbs(root: FileNode, path: string): PathSegment[] {
  // Return array of path segments for navigation
}

// Find node by path
export function findNodeByPath(root: FileNode, path: string): FileNode | undefined {
  // Already exists in mockSkillData.ts as findFileByPath
}
```

**Tasks:**
1. Create fileNavigation.ts with path navigation helpers
2. Add getFolderContents() to get children of current folder
3. Add buildBreadcrumbs() to create clickable navigation path
4. Export functions for component use

### Phase 2: Component Architecture

**New Component Structure:**

```
VersionViewerTab (container)
├── VersionBrowser (main browser area)
│   ├── BreadcrumbNav (top navigation bar)
│   ├── FileGrid (grid of folders/files)
│   └── FileContentPanel (right panel - Monaco editor)
└── CheckoutButton (bottom)
```

**Component Breakdown:**

1. **VersionBrowser.tsx** - Main container managing navigation state
   - State: currentPath, selectedFile
   - Layout: Horizontal split (grid left, content right)
   - Handles navigation logic

2. **BreadcrumbNav.tsx** - Clickable breadcrumb navigation
   - Props: segments[], onNavigate
   - Displays: "Skill Folder / scripts / helpers.js"
   - Click segments to jump to that level

3. **FileGrid.tsx** - Grid view with large icons
   - Props: items[], onItemClick
   - Display: Grid with folder/file icons
   - Click folder → navigate, Click file → show content

4. **FileContentPanel.tsx** - Content viewer (right panel)
   - Props: file, versionId
   - Display: Monaco editor (read-only)
   - Shows placeholder when no file selected

### Phase 3: State Management

**VersionBrowser State:**
```typescript
const [currentPath, setCurrentPath] = useState('/');
const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

const currentFolder = getFolderContents(mockSkillFolder, currentPath);
const breadcrumbs = buildBreadcrumbs(mockSkillFolder, currentPath);
```

**Navigation Handlers:**
```typescript
const handleFolderClick = (folder: FileNode) => {
  setCurrentPath(folder.path);
  setSelectedFile(null); // Clear file selection when navigating
};

const handleBreadcrumbClick = (path: string) => {
  setCurrentPath(path);
  setSelectedFile(null);
};

const handleFileClick = (file: FileNode) => {
  setSelectedFile(file); // Show file content in right panel
};
```

### Phase 4: Layout & Styling

**CSS Structure:**

```css
/* Version Browser - Horizontal Split */
.version-browser {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Panel - File Grid (40% width) */
.version-browser-left {
  width: 40%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-primary);
}

/* Right Panel - Content Viewer (60% width) */
.version-browser-right {
  width: 60%;
  display: flex;
  flex-direction: column;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-primary);
  font-size: 13px;
}

.breadcrumb-item {
  cursor: pointer;
  color: var(--text-secondary);
}

.breadcrumb-item:hover {
  color: var(--text-primary);
}

.breadcrumb-separator {
  color: var(--text-muted);
}

/* File Grid - Large Icons */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  overflow-y: auto;
}

.file-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.file-grid-item:hover {
  background-color: var(--bg-hover);
}

.file-grid-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-sm);
}

.file-grid-name {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
}

/* File Content Panel */
.file-content-panel {
  flex: 1;
  overflow: hidden;
}

.file-content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}
```

### Phase 5: Critical Files - Implementation Tasks

**Create New Files:**
1. `src/utils/fileNavigation.ts` - Navigation helper functions
2. `src/components/version-browser/VersionBrowser.tsx` - Main container
3. `src/components/version-browser/BreadcrumbNav.tsx` - Navigation bar
4. `src/components/version-browser/FileGrid.tsx` - Grid view
5. `src/components/version-browser/FileContentPanel.tsx` - Content viewer

**Modify Existing Files:**
1. `src/components/tabs/VersionViewerTab.tsx`
   - Replace ReadOnlyFileTree with VersionBrowser
   - Keep checkout button at bottom

2. `src/app/globals.css`
   - Add .version-browser layout styles
   - Add .breadcrumb-nav styles
   - Add .file-grid styles
   - Add .file-content-panel styles

3. `src/data/mockSkillData.ts`
   - May need to add helper functions if not present
   - Ensure findFileByPath exists and works

### Phase 6: Implementation Order

**Task 1: Helper Functions**
- Create fileNavigation.ts
- Implement getFolderContents()
- Implement buildBreadcrumbs()
- Test with mock data

**Task 2: BreadcrumbNav Component**
- Create BreadcrumbNav.tsx
- Accept segments[] and onNavigate props
- Style with clickable segments
- Test navigation

**Task 3: FileGrid Component**
- Create FileGrid.tsx
- Grid layout with large icons (64x64)
- Folder and file icons from lucide-react
- onItemClick handler
- Style with hover effects

**Task 4: FileContentPanel Component**
- Create FileContentPanel.tsx
- Wrap Monaco editor component
- Set readOnly={true}
- Show placeholder when no file selected
- Handle file type/language

**Task 5: VersionBrowser Component**
- Create VersionBrowser.tsx
- Manage state (currentPath, selectedFile)
- Integrate BreadcrumbNav, FileGrid, FileContentPanel
- Implement navigation handlers
- Horizontal split layout (40/60)

**Task 6: Update VersionViewerTab**
- Replace ReadOnlyFileTree with VersionBrowser
- Keep checkout button
- Update layout to accommodate new structure

**Task 7: Styling**
- Add all CSS to globals.css
- Ensure responsive layout
- Test dark theme colors
- Verify spacing and proportions

**Task 8: Integration & Testing**
- Test folder navigation (click → navigate)
- Test breadcrumb clicks (jump to parent)
- Test file clicks (show content in Monaco)
- Test read-only mode (can't edit)
- Test checkout button still works
- Verify horizontal split proportions

### Phase 7: Edge Cases & Considerations

**Edge Cases to Handle:**
1. Root folder navigation - "/" path
2. Empty folders - Show empty state message
3. Files without content - Show placeholder
4. Very long filenames - Truncate with ellipsis
5. Deep folder nesting - Ensure breadcrumbs scroll/overflow properly
6. Large number of files - Grid should scroll

**Accessibility:**
- Keyboard navigation (arrow keys, Enter)
- ARIA labels for grid items
- Focus management
- Screen reader support

**Performance:**
- Lazy load file content only when clicked
- Memoize breadcrumb calculations
- Virtual grid if many files (future optimization)

## Summary

**New Components:** 5
- VersionBrowser (container)
- BreadcrumbNav (navigation)
- FileGrid (grid view)
- FileContentPanel (content viewer)
- fileNavigation.ts (helpers)

**Modified Components:** 2
- VersionViewerTab.tsx
- globals.css

**Key Features:**
- Horizontal split layout (40/60)
- Grid view with 64px icons
- Clickable breadcrumb navigation
- Monaco editor for read-only file viewing
- Folder navigation in/out

**Estimated Tasks:** 8 implementation tasks + 1 testing task
