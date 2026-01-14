'use client';

import { useRef } from 'react';
import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type * as Monaco from 'monaco-editor';

interface MonacoEditorProps {
  content: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

// Custom theme matching globals.css color scheme
const customTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    // Comments - muted text with italic
    { token: 'comment', foreground: '6e7681', fontStyle: 'italic' },
    // Keywords - slightly brighter than primary text
    { token: 'keyword', foreground: 'e6edf3', fontStyle: 'bold' },
    // Strings - success accent color
    { token: 'string', foreground: '3fb950' },
    // Numbers - warning accent color
    { token: 'number', foreground: 'd29922' },
    // Functions and methods - primary text
    { token: 'function', foreground: 'e6edf3' },
    { token: 'method', foreground: 'e6edf3' },
    // Variables and identifiers
    { token: 'variable', foreground: 'e6edf3' },
    { token: 'identifier', foreground: 'e6edf3' },
    // Types and classes
    { token: 'type', foreground: 'e6edf3' },
    { token: 'class', foreground: 'e6edf3' },
    // Operators
    { token: 'operator', foreground: '8b949e' },
    // Punctuation
    { token: 'delimiter', foreground: '8b949e' },
    // Tags (for HTML/JSX)
    { token: 'tag', foreground: '3fb950' },
    // Attributes
    { token: 'attribute.name', foreground: 'e6edf3' },
    { token: 'attribute.value', foreground: '3fb950' },
  ],
  colors: {
    // Backgrounds
    'editor.background': '#17110d',
    'editor.lineHighlightBackground': '#2d2921',
    'editor.selectionBackground': '#3d3730',
    'editor.selectionHighlightBackground': '#3d3730',
    'editorWidget.background': '#221b16',
    'editorWidget.border': '#30363d',
    'editorSuggestWidget.background': '#221b16',
    'editorSuggestWidget.border': '#30363d',
    'editorSuggestWidget.selectedBackground': '#3d3730',
    'editorHoverWidget.background': '#221b16',
    'editorHoverWidget.border': '#30363d',
    
    // Text colors
    'editor.foreground': '#e6edf3',
    'editorLineNumber.foreground': '#8b949e',
    'editorLineNumber.activeForeground': '#e6edf3',
    
    // Cursor and selection
    'editorCursor.foreground': '#e6edf3',
    'editorCursor.background': '#17110d',
    'editor.selectionForeground': '#e6edf3',
    
    // Whitespace
    'editorWhitespace.foreground': '#6e7681',
    
    // Indentation guides
    'editorIndentGuide.activeBackground': '#5c513e',
    'editorIndentGuide.background': '#21262d',
    
    // Bracket matching
    'editorBracketMatch.background': '#2d2921',
    'editorBracketMatch.border': '#5c513e',
    
    // Find and replace
    'editor.findMatchBackground': '#3d3730',
    'editor.findMatchHighlightBackground': '#2d2921',
    'editor.findRangeHighlightBackground': '#2d2921',
    
    // Scrollbar
    'scrollbar.shadow': '#17110d',
    'scrollbarSlider.background': '#30363d80',
    'scrollbarSlider.hoverBackground': '#30363daa',
    'scrollbarSlider.activeBackground': '#30363dcc',
    
    // Minimap
    'minimap.background': '#17110d',
    'minimap.selectionHighlight': '#3d3730',
    
    // Other UI elements
    'editorRuler.foreground': '#21262d',
    'editorError.foreground': '#f85149',
    'editorWarning.foreground': '#d29922',
    'editorInfo.foreground': '#3fb950',
  },
};

export default function MonacoEditor({
  content,
  language,
  onChange,
  readOnly = false
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Register the custom theme before editor mounts
    monaco.editor.defineTheme('custom-theme', customTheme);
    // Set the theme immediately after defining it
    monaco.editor.setTheme('custom-theme');
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ensure theme is applied (fallback in case beforeMount didn't work)
    if (monaco) {
      try {
        monaco.editor.defineTheme('custom-theme', customTheme);
        monaco.editor.setTheme('custom-theme');
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
        theme="custom-theme"
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
