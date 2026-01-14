/**
 * Custom Monaco Editor theme matching the global dark theme from globals.css
 * 
 * This theme uses the warm brown color palette defined in the application's
 * global CSS variables for visual consistency across the editor.
 */

export const customMonacoTheme = {
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

export const MONACO_THEME_NAME = 'custom-theme';
