
# Skill Builder IDE Design

## 1. Project Vision

Build a web-based IDE for developing and testing AI Agent Skills. The UI follows a VS Code-style "Three-Pane" architecture:

1. **Icon Bar (Nav)**: Top-aligned horizontal icons to switch sidebar contexts.
2. **Sidebar**: Contextual list/tree based on the selected icon.
3. **Main Workspace**: Multi-tabbed area for editors, chat threads, and viewers.

---

## 2. Layout Architecture

### A. Global Shell

* **The Container**: Full-screen flex column.
* **Top Bar (Optional)**: Status information (e.g., Current Version: V8).
* **Main Body**: Flex row containing the Sidebar and Workspace.

### B. Sidebar Design

* **Icon Header**: A horizontal strip at the top of the sidebar containing 7 icons:
`[Files] [Graph] [Terminal] [Builder] [Tester] [TestSets] [Analysis]`
* **Content Area**: The area below the icons updates immediately when an icon is clicked.

### C. Workspace (Tabs)
 
* **Tab Bar**: Displays active documents/sessions. Tabs can be closed.
* **Persistence**: Opening a file from the sidebar adds a tab. Switching sidebar icons does *not* close existing tabs.

---

## 3. Sidebar Contexts & View Logic

| Icon | Sidebar Content | Clicking an Item in Sidebar... |
| --- | --- | --- |
| **Files** | File tree of the current skill folder. | Opens file in a **Monaco Editor** tab. |
| **Graph** | Vertical list of Version snapshots. | Opens a **Read-only Viewer** tab for that version. |
| **Terminal** | Single item: "Global Session". | Opens/focuses the **Terminal** tab. |
| **Builder** | List of chat threads (Builder Agent). | Opens/focuses that specific **Chat** tab. |
| **Tester** | List of run threads (Tester Agent). | Opens/focuses that specific **Run** tab. |
| **TestSets** | List of named test collections. | Opens the **Test Set Manager** tab. |
| **Analysis** | List of named analysis groups. | Opens the **Analysis Set Manager** tab. |

---

## 4. State & Versioning Rules (The "Dirty Version" Logic)

* **Working State**: Users edit files in the "Current Version".
* **Dirty State**: If changes are made but not saved, the version is "Dirty".
* **Snapshot Trigger**:
1. **On Run**: When a user clicks "Run" in the Tester, the system automatically snapshots the current state, creates a new version number (e.g., V9), and executes the run against that snapshot.
2. **On Save**: A manual save also creates a version snapshot.


* **Intermediate Edits**: Multiple edits without a run do *not* create multiple versions; they update the single "Working" state until a snapshot is triggered.

---

## 5. View-Specific Requirements

### 1. Monaco Editor (Files)

* Standard VS Code-like editing.
* **Auto-save**: Disabled. Requires explicit "Save" to trigger a version snapshot.

### 2. Version Graph Viewer

* When a user selects a version in the sidebar, the main tab displays a **Read-Only File Tree** of that snapshot.
* **Action**: A prominent "Checkout this Version" button. Clicking this replaces the current working files with this version's content.

### 3. Builder Agent (Chat)

* **Context**: Users can reference "Analysis Sets" or "Runs" in the chat.
* **Suggested Changes**: Diffs are displayed **inline within the chat messages**.
* **The "Apply" Action**: Each diff block has an "Apply" button. Clicking it updates the working file in the background (and updates any open editor tabs).

### 4. Skill Tester (Runs)

* **Model Selection**: Dropdown at the top of the tab.
* **Output**: Real-time streaming text with expandable "Trajectory" sections (to see reasoning/tool calls).
* **Interaction**: User can type into the run tab to "steer" the agent mid-execution.

### 5. Test Sets (Batching)

* **Trigger Runs**: Clicking this button in the Test Set tab:
1. Switches the Sidebar to the **Tester** icon.
2. Spawns  parallel runs (where  = number of prompts in the set).
3. Adds these  runs to the Tester Sidebar.



### 6. Analysis Sets

* **Analyze Runs**: Clicking this button:
1. Switches the Sidebar to the **Builder** icon.
2. Creates a new Builder Thread.
3. Opens a Builder Chat tab pre-loaded with the selected runs.



---

## 6. Technical Implementation Notes (For AI Agent)

1. **Component Library**: Use **Tailwind CSS** for layout and **Lucide-React** for icons.
2. **Editor**: Integrate `@monaco-editor/react`.
3. **State Management**: Use `Zustand` or `React Context` to manage the "Active Sidebar Icon", "List of Open Tabs", and "Current Version State".
4. **Terminal**: Use `xterm.js` for the terminal UI. It is a global singleton for the MVP.
5. **Mocking**:
* Mock the "Run" process with a `setInterval` that appends text to a log.
* Mock the "Builder Agent" response with a hardcoded Markdown diff.

----------


This UX document outlines the navigation and structural model for the **Skill Builder IDE**. It follows a VS Code-style pattern where the top-level navigation dictates the sidebar content, and the sidebar launches persistent or transient tabs into the main workspace.

---

## I. Global Layout Architecture

The application is split into three primary zones:

1. **Icon Bar (Top of Sidebar):** Horizontal nav to switch contexts.
2. **Context Sidebar:** Dynamic list/tree based on the active icon.
3. **Main Workspace:** Tabbed interface for editors, agents, and viewers.

```text
_______________________________________________________________________________
| [File] [Graph] [Term] [Build] [Test] [TestSet] [Anlyz] | Tabs: Skill.md x ... |
|________________________________________________________|_____________________|
|                                                        |                     |
|  SIDEBAR CONTENT (Dynamic)                             |   MAIN WORKSPACE    |
|                                                        |                     |
|  e.g., File Tree, Thread List, or Version List         |   (Editor / Agent)  |
|                                                        |                     |
|                                                        |                     |
|________________________________________________________|_____________________|
| Status: Version 8 (Current)                                                  |
|______________________________________________________________________________|

```

---

## II. Navigation & View Logic

### 1. Context Switcher (Top Icons)

| Icon | Sidebar Content | Primary Action (Main Tab) |
| --- | --- | --- |
| **File Browser** | Folder tree (Files/Scripts) | Opens file in **Monaco Editor**. |
| **Version Graph** | List of version numbers/labels. | Opens **Version File Viewer** (Read-only). |
| **Terminal** | List of active sessions (node, bash). | Opens **Terminal Console**. |
| **Skill Builder** | History of Builder Threads. | Opens **Builder Agent Chat**. |
| **Skill Tester** | History of Tester Threads. | Opens **Tester Agent Run**. |
| **Test Sets** | List of Test Set collections. | Opens **Test Set Detail View**. |
| **Analysis Sets** | List of Analysis Set collections. | Opens **Analysis Set Detail View**. |

---

## III. Key Workflow Diagrams

### 1. The Versioning & "Run" Loop

The system uses a "Dirty State" model. You edit the current version, but it only snapshots upon a **Run** or an **Explicit Save**.

```text
[V8 (Current)] --> User Edits Skill.md --> [V8 (Working/Dirty)]
                               |
                               |---- User Clicks "Run"
                               V
                1. System snapshots [V8 (Working)] as [V9]
                2. Run triggers against [V9]
                3. [V9] becomes the new Current Version.

```

### 2. Builder Agent Suggestion (In-Chat Diff)

To keep the MVP focused, diffs are presented within the chat flow.

```text
[ Builder Agent ]
"I suggest changing Skill.md to improve search..."

---------------------------------------
| Skill.md (Diff)                     |
| - search_depth: 3                   |
| + search_depth: 5                   |
|                                     |
| [ Apply Change ] [ Ignore ]         |
---------------------------------------

User clicks [ Apply ], system updates the working file.

```

---

## IV. Screen-by-Screen Navigation

### A. The File Browser & Editor

* **Sidebar:** Displays the file tree.
* **Action:** Clicking `Skill.md` opens a tab.
* **State:** Changes made here are "Working" changes.

### B. The Version Graph

* **Sidebar:** A vertical list: `Version 8`, `Version 7`, etc.
* **Action:** Clicking `Version 6` opens a **Read-only Tab** showing that snapshot's files.
* **Checkout:** A button in the tab allows the user to "Checkout Version 6," making it the active working state.

### C. Test Sets to Tester (Cross-Navigation)

* **Sidebar:** List of sets (e.g., "Edge Cases").
* **Main Tab:** Shows 10 prompts. User clicks **[Trigger Runs]**.
* **Behavior:** 1. Sidebar automatically switches to the **Tester Icon**.
2. 10 new "Runs" appear in the Tester sidebar.
3. User clicks any run in the sidebar to open its specific streaming tab.

### D. Analysis to Builder (Cross-Navigation)

* **Main Tab:** User selects 3 failed runs in an Analysis Set.
* **Action:** User clicks **[Analyze Runs]**.
* **Behavior:** 1. Sidebar switches to **Builder Icon**.
2. A new "Thread" is created.
3. Main tab opens a new Builder Agent Chat with those 3 runs already referenced in the context.
