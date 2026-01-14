# Skill Builder UI - Product Specification

## Overview

Skill Builder is a tool for building, testing, and iterating on AI agent skills. Users create skills (folders containing instructions and scripts), test them against prompts, analyze execution trajectories, and use an AI-powered Builder Agent to suggest improvements based on run analysis.

---

## Core Concepts

### Skill
A skill is a directory containing:
- **Skill.md**: A markdown file with YAML frontmatter (including `name` and `description`) describing the skill's behavior and instructions.
- **Supporting Files**: Any other files or directories (scripts, configuration, etc.) required by the skill. There is no mandatory internal structure or specific directory required for scripts.

Skills are versioned as isolated snapshots. Each version is a complete, immutable copy of the skill folder state.

### Agents
Two distinct Claude Agent SDK instances power the system:

1. **Tester Agent**: Executes skills against prompts. Has read access to skill files mounted in its sandbox VM. Cannot access run history.

2. **Builder Agent**: Analyzes past runs and suggests skill improvements. Has tools to read conversation histories from past runs. Suggests changes as diffs that users can accept or reject.

### Runs
A run is a single execution of a skill against a prompt. Each run stores:
- Complete execution trajectory (all reasoning, tool calls, intermediate outputs) (Use AgentFS to store run trajectory in SQLite database)
- Derived metrics (latency, token usage, etc.)
- Input prompt and final output
- Success/failure status
- Timestamp and version reference

### Test Sets
Named collections of prompts used for testing. Each prompt in a test set triggers an independent run when executed. Test sets are manually curated—users explicitly add/remove prompts.

### Analysis Sets
User-curated groupings of past runs. Users reference analysis sets (or individual runs) when asking the Builder Agent for improvement suggestions. Manually populated.

### Threads
Isolated test contexts within the Tester view (e.g., "Figma Blog", "Airbnb Blog"). Each thread:
- Is completely isolated from other threads
- Has no shared state or cross-thread interaction
- Serves as an organizational container for related test runs

---

## Architecture

### Frontend
- **Framework**: Next.js
- **Code Editor**: Monaco (VS Code-like editing in browser)
- **Real-time Updates**: WebSocket connections to sandbox VMs for streaming run output

### Backend
- **API Layer**: Next.js API routes
- **WebSocket Server**: Handles real-time communication with sandbox VMs
- **Storage**: Google Cloud Storage (GCS)

### Agent Execution
- **Runtime**: Claude Agent SDK
- **Environment**: Each agent runs in an isolated sandbox VM
- **File Access**: Entire skill folder mounted to agent's sandbox (read-write)
- **Persistence**: Agent file modifications sync back to storage after run completion

### Storage Strategy
Version snapshots stored in GCS using copy-on-write semantics:
- Only changed files stored per version (not full copies)
- Enables efficient snapshot creation and loading
- Supports loading any version into workspace without duplicating unchanged files

**Recommended Implementation**: Content-addressable storage where each file is stored by its content hash. Version manifests reference file hashes rather than duplicating content. This provides automatic deduplication across versions.

---

## User Interface

### Global Navigation
Toolbar with icons for all primary views (always visible):
- File browser
- Version graph
- Terminal
- Skill Builder
- Skill Tester
- Test Sets
- Analysis Sets

### Views

#### 1. File Browser
- Tree view of current skill folder
- Skill Folder / Scripts / Skill.md structure
- Click to open files in editor tabs

#### 2. Editor (Tabs)
- Monaco editor for Skill.md, scripts, and other files
- Multiple tabs supported
- **Auto-save**: Changes saved continuously (no manual save required)
- Syntax highlighting based on file type

#### 3. Version Graph
- Visual timeline/tree of skill versions
- Current version indicated (green dot)
- Click version to preview
- "Preview Only" state for non-checked-out versions
- "Checkout Version" button to load a version into workspace
- Branching visualization (versions can branch from any point)

#### 4. Terminal
- Purpose: Configure sandbox environment before skill runs
- Available environments: Node, Bash
- Used to install dependencies, set environment variables, configure external API access
- Secrets and credentials configured here (not stored in skill files)

#### 5. Skill Builder
- Left sidebar: Threads list (conversation threads with Builder Agent)
- Main area: Chat interface with Builder Agent
- "Select Runs or Analysis Set" button to provide context
- Message input to request changes or ask questions
- Expandable sections showing:
  - Skill files fetched
  - Runs fetched
  - Suggested changes

**Suggestion Flow**:
1. User selects runs/analysis set for context
2. User describes desired changes or asks for suggestions
3. Builder Agent analyzes trajectories
4. Agent suggests changes as diffs (ranked by confidence/impact)
5. User reviews diff view
6. User accepts entire suggestion:
   - If current version has runs → new version created
   - If current version has no runs → overwrites current version

#### 6. Skill Tester
- Left sidebar: Threads (isolated test contexts like "Figma Blog", "Anthropic Blog")
- "Select Model" dropdown to choose which LLM powers the test run
- Prompt input area
- Current skill version indicator
- Run output area with expandable trajectory sections:
  - Collapsed by default
  - Expand to see tool calls, responses, intermediate steps
- "Add run to Analysis Set" action
- "Add prompt to Test Set" action

**Interaction Model**: Agent runs in a loop. When user sends a message, it's added to context in the next loop iteration, allowing users to steer the agent mid-execution.

#### 7. Test Sets
- Left sidebar: List of test sets (e.g., "Eng Blogs", "SaaS Blogs", "Personal Blogs")
- Main area: List of prompts in selected test set
- "[N] New Prompt" button
- "[T] Trigger Runs" button - executes all prompts in parallel
- Each prompt shown as a row

**Execution**: All prompts trigger independent, parallel runs. Each runs in its own sandbox. Progress shown in Threads sidebar. Clicking a run streams its output via WebSocket.

#### 8. Analysis Sets
- Left sidebar: List of analysis sets
- Main area: List of runs in selected analysis set
- Each run shows: prompt, timestamp, version used
- "[A] Add a Run" button
- "[A] Analyze Runs" button - opens Builder Agent with this set
- "[S] Suggest Changes" button

---

## Key Workflows

### Creating a New Skill
1. User creates new skill (blank Skill.md)
2. User writes skill instructions in free-form markdown
3. User optionally adds scripts to Scripts/ folder
4. Skill is Version 1

### Testing a Skill
1. User opens Skill Tester
2. User selects or creates a thread
3. User selects model for this run
4. User enters prompt
5. Run executes in sandbox VM
6. Output streams back in real-time
7. User can send messages to steer agent mid-run
8. Full trajectory stored on completion

### Running a Test Set
1. User opens Test Sets view
2. User selects a test set
3. User clicks "Trigger Runs"
4. All prompts execute in parallel (each in own sandbox)
5. Progress indicators shown in sidebar
6. User clicks any run to stream its output
7. All runs complete and store full trajectories

### Improving a Skill
1. User opens Skill Builder
2. User selects runs or an analysis set for context
3. User describes what they want to improve
4. Builder Agent analyzes trajectories
5. Builder Agent suggests changes as diff
6. User reviews suggestions
7. User accepts → new version created (if runs exist) or overwrites (if no runs)
8. User tests new version

### Managing Versions
1. User opens Version Graph
2. User sees all versions as timeline/tree
3. User clicks a version to preview (read-only)
4. User clicks "Checkout Version" to make it active
5. All subsequent runs use checked-out version files
6. Editing creates changes in current version (auto-saved)

---

## Data Models

### Skill
```typescript
interface Skill {
  id: string;
  name: string;
  createdAt: Date;
  currentVersionId: string;
}
```

### SkillVersion
```typescript
interface SkillVersion {
  id: string;
  skillId: string;
  versionNumber: number;
  parentVersionId: string | null;
  createdAt: Date;
  fileManifest: FileReference[]; // Content-addressable references
}

interface FileReference {
  path: string;        // e.g., "Skill.md", "Scripts/crawl.py"
  contentHash: string; // SHA-256 of file content
  size: number;
}
```

### Run
```typescript
interface Run {
  id: string;
  skillId: string;
  versionId: string;
  threadId: string;
  prompt: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt: Date | null;
  trajectory: TrajectoryEvent[];
  metrics: RunMetrics;
  finalOutput: string | null;
}

interface TrajectoryEvent {
  timestamp: Date;
  type: 'user_message' | 'assistant_message' | 'tool_call' | 'tool_result';
  content: any;
}

interface RunMetrics {
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  toolCallCount: number;
}
```

### TestSet
```typescript
interface TestSet {
  id: string;
  skillId: string;
  name: string;
  prompts: TestPrompt[];
}

interface TestPrompt {
  id: string;
  content: string;
  createdAt: Date;
}
```

### AnalysisSet
```typescript
interface AnalysisSet {
  id: string;
  skillId: string;
  name: string;
  runIds: string[];
  createdAt: Date;
}
```

### Thread
```typescript
interface Thread {
  id: string;
  skillId: string;
  context: 'builder' | 'tester';
  name: string;
  createdAt: Date;
}
```

---

## Business Rules

### Version Management
- Versions are isolated snapshots—no merging concept
- Checkout loads version files into workspace
- All runs execute against currently checked-out version
- Cannot delete a version that has associated runs

### Run Management
- Each prompt execution creates one run
- Runs store complete trajectory (full conversation history)
- Runs are immutable once completed
- Failed/crashed runs marked as failed, partial trajectory preserved

### Suggestion Acceptance
- Suggestions shown as diffs
- User accepts entire suggestion (no partial acceptance for MVP)
- If accepting and current version has runs → create new version
- If accepting and current version has no runs → overwrite current version

### Test Execution
- Prompts in a test set run independently and in parallel
- Each run gets its own sandbox VM
- No dependencies between prompts in same test set

---

## MVP Scope

### In Scope
- Skill creation and editing (Monaco editor)
- Version management (create, checkout, view history)
- Skill testing with model selection
- Test set management and batch execution
- Analysis set management
- Builder Agent integration for suggestions
- Full trajectory storage and viewing
- Real-time streaming of run output
- Terminal for sandbox setup
- Auto-save for all edits

### Out of Scope (Future)
- User authentication
- Skill sharing/collaboration
- Advanced debugging (replay, checkpoint restart, step-through)
- Auto-population of test/analysis sets
- Partial diff acceptance (line-by-line)
- Model comparison features
- Skill marketplace

---

## Technical Considerations

### WebSocket Connection
- Each active run maintains WebSocket to its sandbox VM
- Supports real-time streaming of agent output
- Handles user messages mid-run (added to agent context in next loop)
- Graceful handling of disconnection/reconnection

### Storage Optimization
- Content-addressable storage in GCS for file deduplication
- Version manifests stored as JSON with file hash references
- Lazy loading of file content (fetch on demand)
- Consider caching frequently accessed versions

### Sandbox Management
- Sandbox VMs provisioned per-run
- Skill folder mounted read-write
- Changes synced back to storage on completion
- Handle VM crashes gracefully (mark run as failed, preserve partial data)

### Performance
- Parallel test execution (no concurrency limits)
- Streaming responses for long-running operations
- Collapsed trajectory view by default (expand on demand)
- Pagination for large run/version lists

---

## API Endpoints (Suggested)

### Skills
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create new skill
- `GET /api/skills/:id` - Get skill details
- `DELETE /api/skills/:id` - Delete skill

### Versions
- `GET /api/skills/:id/versions` - List versions
- `POST /api/skills/:id/versions` - Create version (checkout + save)
- `GET /api/skills/:id/versions/:versionId` - Get version details
- `POST /api/skills/:id/versions/:versionId/checkout` - Checkout version
- `GET /api/skills/:id/versions/:versionId/files/:path` - Get file content

### Runs
- `GET /api/skills/:id/runs` - List runs
- `POST /api/skills/:id/runs` - Start new run
- `GET /api/skills/:id/runs/:runId` - Get run details
- `GET /api/skills/:id/runs/:runId/trajectory` - Get full trajectory
- `WS /api/skills/:id/runs/:runId/stream` - WebSocket for live streaming

### Test Sets
- `GET /api/skills/:id/test-sets` - List test sets
- `POST /api/skills/:id/test-sets` - Create test set
- `POST /api/skills/:id/test-sets/:setId/prompts` - Add prompt
- `DELETE /api/skills/:id/test-sets/:setId/prompts/:promptId` - Remove prompt
- `POST /api/skills/:id/test-sets/:setId/trigger` - Trigger all runs

### Analysis Sets
- `GET /api/skills/:id/analysis-sets` - List analysis sets
- `POST /api/skills/:id/analysis-sets` - Create analysis set
- `POST /api/skills/:id/analysis-sets/:setId/runs` - Add run to set
- `DELETE /api/skills/:id/analysis-sets/:setId/runs/:runId` - Remove run

### Builder Agent
- `POST /api/skills/:id/builder/analyze` - Start analysis (returns stream)
- `POST /api/skills/:id/builder/apply` - Apply suggestion

---

## Open Questions for Future Consideration

1. **Sandbox resource limits**: Should there be timeout or resource caps on individual runs?
2. **Cost tracking**: Should token usage be tracked and displayed per-skill/per-version?
3. **Version pruning**: How to handle skills with many versions over time?
4. **Bulk operations**: Import/export of skills, test sets, or runs?
5. **Notifications**: Alert users when long-running batch tests complete?
