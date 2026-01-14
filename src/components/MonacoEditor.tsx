'use client';

import { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface MonacoEditorProps {
  content: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

export default function MonacoEditor({
  content,
  language,
  onChange,
  readOnly = false
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Focus the editor on mount
    editor.focus();
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={language}
        value={content}
        onChange={onChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          bracketPairColorization: {
            enabled: true
          },
          guides: {
            indentation: true,
            bracketPairs: true
          }
        }}
        loading={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-secondary)'
            }}
          >
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
