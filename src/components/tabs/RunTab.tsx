'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, Clock, XCircle, MessageSquare, PlayCircle, AlertTriangle, ChevronRight, ChevronDown, Square } from 'lucide-react';
import { getRunThreadById, getRunSessionById, RunStatus, TrajectoryStep, createRunSession, updateRunSessionStatus, appendTrajectoryStep, generateMockTrajectory } from '@/data/mockRunData';
import { StreamController, StreamChunk } from '@/utils/mockStreaming';

interface RunTabProps {
  tabId: string;
  threadId: string;
}

const MODELS = [
  'Claude 3.5 Sonnet',
  'Claude 3 Opus',
  'GPT-4 Turbo',
  'GPT-4',
  'Gemini Pro',
];

interface TrajectoryStepDisplayProps {
  step: TrajectoryStep;
}

function TrajectoryStepDisplay({ step }: TrajectoryStepDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(step.expanded !== false);

  const isLargeContent = step.content.length > 200;
  const isCollapsible = step.type === 'tool_call' || step.type === 'result' || isLargeContent;
  const defaultCollapsed = isCollapsible && step.expanded !== true;

  useEffect(() => {
    if (defaultCollapsed) {
      setIsExpanded(false);
    }
  }, [defaultCollapsed]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getStepIcon = () => {
    switch (step.type) {
      case 'message':
        return <MessageSquare size={14} className="step-icon-message" />;
      case 'tool_call':
        return <PlayCircle size={14} className="step-icon-tool" />;
      case 'result':
        return <CheckCircle2 size={14} className="step-icon-result" />;
      case 'error':
        return <AlertTriangle size={14} className="step-icon-error" />;
      default:
        return null;
    }
  };

  const getStepTypeLabel = () => {
    switch (step.type) {
      case 'message':
        return 'Message';
      case 'tool_call':
        return 'Tool Call';
      case 'result':
        return 'Result';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getSummaryText = () => {
    if (step.content.length > 200) {
      return step.content.substring(0, 200) + '...';
    }
    return step.content;
  };

  return (
    <div className={`trajectory-step trajectory-step-${step.type}`}>
      <div className="trajectory-step-header" onClick={toggleExpanded}>
        <div className="trajectory-step-header-left">
          {isCollapsible && (
            isExpanded ? (
              <ChevronDown size={14} className="step-expand-icon" />
            ) : (
              <ChevronRight size={14} className="step-expand-icon" />
            )
          )}
          {getStepIcon()}
          <span className="trajectory-step-type">{getStepTypeLabel()}</span>
        </div>
        <span className="trajectory-step-time">{formatTime(step.timestamp)}</span>
      </div>
      {isExpanded ? (
        <div className="trajectory-step-content">
          <pre className="trajectory-step-text">{step.content}</pre>
        </div>
      ) : (
        <div className="trajectory-step-summary">
          <pre className="trajectory-step-text trajectory-step-text-summary">{getSummaryText()}</pre>
        </div>
      )}
    </div>
  );
}

export default function RunTab({ tabId, threadId }: RunTabProps) {
  const [model, setModel] = useState('Claude 3.5 Sonnet');
  const [prompt, setPrompt] = useState('');
  const [runStatus, setRunStatus] = useState<RunStatus>('ready');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const streamControllerRef = useRef<StreamController | null>(null);
  const threadRef = useRef(threadId);

  const thread = getRunThreadById(threadId);
  const latestSession = sessionId ? getRunSessionById(sessionId) : thread?.sessions[thread.sessions.length - 1];

  threadRef.current = threadId;

  useEffect(() => {
    if (latestSession) {
      setRunStatus(latestSession.status);
      if (latestSession.prompt && !prompt) {
        setPrompt(latestSession.prompt);
      }
      if (latestSession.status === 'completed' || latestSession.status === 'failed') {
        streamControllerRef.current = null;
      }
    }
  }, [latestSession, prompt]);

  const handleSubmit = async () => {
    if (!prompt.trim() || runStatus === 'running') return;

    const controller = new StreamController();
    streamControllerRef.current = controller;

    const session = createRunSession(threadId, prompt, model);
    setSessionId(session.id);
    setRunStatus('running');

    try {
      const trajectorySteps = generateMockTrajectory(prompt, model);

      for (const step of trajectorySteps as TrajectoryStep[]) {
        if (controller.isCancelled()) {
          break;
        }

        await controller.waitIfPaused();

        if (controller.isCancelled()) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 300));

        appendTrajectoryStep(session.id, step);
        setRunStatus('running');
      }

      if (!controller.isCancelled()) {
        updateRunSessionStatus(session.id, 'completed');
        setRunStatus('completed');
      }
    } catch (error) {
      console.error('Run error:', error);
      updateRunSessionStatus(session.id, 'failed');
      setRunStatus('failed');
    } finally {
      streamControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (streamControllerRef.current) {
      streamControllerRef.current.cancel();
      if (sessionId) {
        updateRunSessionStatus(sessionId, 'failed');
        setRunStatus('failed');
      }
    }
  };

  const getStatusIcon = () => {
    switch (runStatus) {
      case 'completed':
        return <CheckCircle2 size={16} className="status-icon-completed" />;
      case 'running':
        return <Play size={16} className="status-icon-running" />;
      case 'failed':
        return <XCircle size={16} className="status-icon-failed" />;
      default:
        return <Clock size={16} className="status-icon-ready" />;
    }
  };

  const getStatusText = () => {
    switch (runStatus) {
      case 'completed':
        return 'Completed';
      case 'running':
        return 'Running';
      case 'failed':
        return 'Failed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="run-tab">
      <div className="run-header">
        <div className="run-header-left">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="model-selector"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="run-header-right">
          <div className="run-status">
            {getStatusIcon()}
            <span className="run-status-text">{getStatusText()}</span>
          </div>
          {/* Task 6.8: Add 'Add to Analysis Set' action button */}
          {/* Task 6.9: Add 'Add prompt to Test Set' action button */}
        </div>
      </div>

      <div className="run-prompt-area">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt to test the skill..."
          className="prompt-input"
          rows={4}
        />
        <button
          onClick={runStatus === 'running' ? handleCancel : handleSubmit}
          disabled={!prompt.trim() && runStatus !== 'running'}
          className="submit-button"
        >
          {runStatus === 'running' ? (
            <>
              <Square size={16} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Run Test</span>
            </>
          )}
        </button>
      </div>

      <div className="run-output-area">
        {runStatus === 'ready' && prompt.trim() === '' && (
          <div className="run-output-placeholder">
            <p className="output-placeholder-text">
              Enter a prompt and click "Run Test" to start testing the skill.
            </p>
          </div>
        )}
        {runStatus === 'ready' && prompt.trim() !== '' && (
          <div className="run-output-placeholder">
            <p className="output-placeholder-text">
              Ready to run. Click "Run Test" to start.
            </p>
          </div>
        )}
        {runStatus === 'running' && (
          <div className="run-output-placeholder">
            <p className="output-placeholder-text output-running">
              Running test...
            </p>
          </div>
        )}
        {(runStatus === 'completed' || runStatus === 'failed') && latestSession && latestSession.trajectory.length > 0 && (
          <div className="trajectory-list">
            {latestSession.trajectory.map((step) => (
              <TrajectoryStepDisplay key={step.id} step={step} />
            ))}
          </div>
        )}
        {(runStatus === 'completed' || runStatus === 'failed') && (!latestSession || latestSession.trajectory.length === 0) && (
          <div className="run-output-placeholder">
            <p className="output-placeholder-text">
              No trajectory data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
