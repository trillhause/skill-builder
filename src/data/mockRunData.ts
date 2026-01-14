export type RunStatus = 'ready' | 'running' | 'completed' | 'failed';

export type TrajectoryStepType = 'message' | 'tool_call' | 'result' | 'error';

export interface TrajectoryStep {
  id: string;
  type: TrajectoryStepType;
  content: string;
  timestamp: Date;
  expanded?: boolean;
}

export interface RunSession {
  id: string;
  threadId: string;
  prompt: string;
  model: string;
  status: RunStatus;
  trajectory: TrajectoryStep[];
  createdAt: Date;
  completedAt?: Date;
}

export interface RunThread {
  id: string;
  name: string;
  createdAt: Date;
  status: RunStatus;
  sessions: RunSession[];
}

const MOCK_RUN_THREADS: RunThread[] = [
  {
    id: 'thread-1',
    name: 'Figma Blog Run',
    createdAt: new Date('2026-01-14T10:30:00'),
    status: 'completed',
    sessions: [
      {
        id: 'session-1-1',
        threadId: 'thread-1',
        prompt: 'Extract the main points from the Figma blog post about design systems',
        model: 'Claude 3.5 Sonnet',
        status: 'completed',
        createdAt: new Date('2026-01-14T10:30:00'),
        completedAt: new Date('2026-01-14T10:32:15'),
        trajectory: [
          {
            id: 'step-1-1-1',
            type: 'message',
            content: 'Starting analysis of Figma design systems blog post...',
            timestamp: new Date('2026-01-14T10:30:00'),
          },
          {
            id: 'step-1-1-2',
            type: 'tool_call',
            content: 'tool: web_search\nargs: { "query": "Figma design systems blog post" }',
            timestamp: new Date('2026-01-14T10:30:05'),
            expanded: false,
          },
          {
            id: 'step-1-1-3',
            type: 'result',
            content: 'Found 3 relevant articles. Reading top result...',
            timestamp: new Date('2026-01-14T10:30:15'),
            expanded: false,
          },
          {
            id: 'step-1-1-4',
            type: 'message',
            content: 'Key points extracted:\n1. Design systems scale better with component libraries\n2. Tokens drive consistency across teams\n3. Documentation is crucial for adoption\n4. Automated testing ensures quality',
            timestamp: new Date('2026-01-14T10:32:15'),
          },
        ],
      },
    ],
  },
  {
    id: 'thread-2',
    name: 'Anthropic Blog Run',
    createdAt: new Date('2026-01-14T12:45:00'),
    status: 'completed',
    sessions: [
      {
        id: 'session-2-1',
        threadId: 'thread-2',
        prompt: 'Summarize the latest Anthropic research on AI safety',
        model: 'Claude 3.5 Sonnet',
        status: 'completed',
        createdAt: new Date('2026-01-14T12:45:00'),
        completedAt: new Date('2026-01-14T12:48:30'),
        trajectory: [
          {
            id: 'step-2-1-1',
            type: 'message',
            content: 'Analyzing Anthropic AI safety research...',
            timestamp: new Date('2026-01-14T12:45:00'),
          },
          {
            id: 'step-2-1-2',
            type: 'message',
            content: 'Key findings:\n1. Constitutional AI reduces harmful outputs\n2. Scalable oversight techniques are critical\n3. Red-teaming identifies vulnerabilities\n4. Interpretability improves understanding of model behavior',
            timestamp: new Date('2026-01-14T12:48:30'),
          },
        ],
      },
    ],
  },
  {
    id: 'thread-3',
    name: 'Test Run 3',
    createdAt: new Date('2026-01-14T14:00:00'),
    status: 'failed',
    sessions: [
      {
        id: 'session-3-1',
        threadId: 'thread-3',
        prompt: 'Generate a Python script for data analysis',
        model: 'GPT-4',
        status: 'failed',
        createdAt: new Date('2026-01-14T14:00:00'),
        completedAt: new Date('2026-01-14T14:02:45'),
        trajectory: [
          {
            id: 'step-3-1-1',
            type: 'message',
            content: 'Generating Python data analysis script...',
            timestamp: new Date('2026-01-14T14:00:00'),
          },
          {
            id: 'step-3-1-2',
            type: 'error',
            content: 'Error: Failed to import pandas library. Please ensure dependencies are installed.',
            timestamp: new Date('2026-01-14T14:02:45'),
          },
        ],
      },
    ],
  },
  {
    id: 'thread-4',
    name: 'Test Run 4',
    createdAt: new Date('2026-01-14T15:30:00'),
    status: 'ready',
    sessions: [],
  },
];

export function getRunThreads(): RunThread[] {
  return [...MOCK_RUN_THREADS];
}

export function getRunThreadById(id: string): RunThread | undefined {
  return MOCK_RUN_THREADS.find((thread) => thread.id === id);
}

export function getRunSessions(threadId: string): RunSession[] {
  const thread = getRunThreadById(threadId);
  return thread?.sessions || [];
}

export function getRunSessionById(sessionId: string): RunSession | undefined {
  for (const thread of MOCK_RUN_THREADS) {
    const session = thread.sessions.find((s) => s.id === sessionId);
    if (session) return session;
  }
  return undefined;
}

let threadCounter = MOCK_RUN_THREADS.length + 1;
let sessionCounter = 1;

export function createRunThread(name?: string): RunThread {
  const id = `thread-${threadCounter++}`;
  const thread: RunThread = {
    id,
    name: name || `Run ${threadCounter - 1}`,
    createdAt: new Date(),
    status: 'ready',
    sessions: [],
  };
  MOCK_RUN_THREADS.unshift(thread);
  return thread;
}

export function createRunSession(threadId: string, prompt: string, model: string): RunSession {
  const id = `session-${sessionCounter++}`;
  const session: RunSession = {
    id,
    threadId,
    prompt,
    model,
    status: 'running',
    trajectory: [],
    createdAt: new Date(),
  };
  
  const thread = getRunThreadById(threadId);
  if (thread) {
    thread.sessions.push(session);
    thread.status = 'running';
  }
  
  return session;
}

export function updateRunSessionStatus(sessionId: string, status: RunStatus, trajectory?: TrajectoryStep[]): void {
  const session = getRunSessionById(sessionId);
  if (session) {
    session.status = status;
    if (status === 'completed' || status === 'failed') {
      session.completedAt = new Date();
    }
    if (trajectory) {
      session.trajectory = trajectory;
    }
    
    const thread = getRunThreadById(session.threadId);
    if (thread) {
      thread.status = status;
    }
  }
}

export function appendTrajectoryStep(sessionId: string, step: TrajectoryStep): void {
  const session = getRunSessionById(sessionId);
  if (session) {
    session.trajectory.push(step);
  }
}

export function generateMockTrajectory(prompt: string, model: string): TrajectoryStep[] {
  const steps: TrajectoryStep[] = [];
  const startTime = new Date();

  steps.push({
    id: `step-${startTime.getTime()}-1`,
    type: 'message',
    content: `Starting analysis with ${model}...`,
    timestamp: new Date(startTime.getTime() + 100),
  });

  steps.push({
    id: `step-${startTime.getTime()}-2`,
    type: 'tool_call',
    content: `tool: search\nargs: { "query": "${prompt.substring(0, 50)}..." }`,
    timestamp: new Date(startTime.getTime() + 500),
    expanded: false,
  });

  steps.push({
    id: `step-${startTime.getTime()}-3`,
    type: 'result',
    content: `Found 5 relevant documents. Analyzing content...`,
    timestamp: new Date(startTime.getTime() + 1500),
    expanded: false,
  });

  steps.push({
    id: `step-${startTime.getTime()}-4`,
    type: 'tool_call',
    content: `tool: analyze\nargs: { "documents": 5 }`,
    timestamp: new Date(startTime.getTime() + 2500),
    expanded: false,
  });

  steps.push({
    id: `step-${startTime.getTime()}-5`,
    type: 'result',
    content: `Analysis complete. Generated response with 3 key points.`,
    timestamp: new Date(startTime.getTime() + 4000),
    expanded: false,
  });

  steps.push({
    id: `step-${startTime.getTime()}-6`,
    type: 'message',
    content: `Based on the analysis, here are the key findings:\n\n1. The primary theme is ${model} capabilities\n2. Performance metrics show 95% accuracy\n3. Recommendations include further testing`,
    timestamp: new Date(startTime.getTime() + 5000),
  });

  return steps;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
