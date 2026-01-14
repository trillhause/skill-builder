'use client';

import { useRef } from 'react';
import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { customMonacoTheme, MONACO_THEME_NAME } from '@/themes/monacoTheme';

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

  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Register the custom theme before editor mounts
    monaco.editor.defineTheme(MONACO_THEME_NAME, customMonacoTheme);
    // Set the theme immediately after defining it
    monaco.editor.setTheme(MONACO_THEME_NAME);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ensure theme is applied (fallback in case beforeMount didn't work)
    if (monaco) {
      try {
        monaco.editor.defineTheme(MONACO_THEME_NAME, customMonacoTheme);
        monaco.editor.setTheme(MONACO_THEME_NAME);
      } catch (error) {
        console.error('Failed to set Monaco theme:', error);
      }
    }

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
        beforeMount={handleEditorWillMount}
        onMount={handleEditorMount}
        theme={MONACO_THEME_NAME}
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
