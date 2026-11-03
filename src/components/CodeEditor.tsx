
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  height = '420px',
  readOnly = false
}) => {
  const getMonacoLang = (lang: string) => {
    const l = lang.toLowerCase();

    if (l === 'c' || l === 'cpp' || l === 'c++') return 'cpp';
    if (l === 'python') return 'python';
    if (l === 'java') return 'java';
    if (l === 'javascript') return 'javascript';
    if (l === 'typescript') return 'typescript';
    if (l === 'sql') return 'sql';
    if (l === 'html') return 'html';
    if (l === 'css') return 'css';

    return 'javascript';
  };

  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-slate-700"
      style={{
        height,
        minHeight: '300px',
        backgroundColor: '#1e1e1e'
      }}
    >
      <Editor
        width="100%"
        height="100%"
        language={getMonacoLang(language)}
        value={value ?? ''}
        theme="vs-dark"
        onChange={(newValue) => onChange(newValue ?? '')}
        options={{
          fontSize: 15,
          fontFamily: 'Consolas, "Courier New", monospace',
          fontWeight: '400',
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          readOnly,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          wordWrap: 'on',
          folding: true,
          cursorBlinking: 'smooth',
          cursorStyle: 'line',
          selectionHighlight: true,
          overviewRulerLanes: 0,
          padding: {
            top: 12,
            bottom: 12
          },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
          }
        }}
      />
    </div>
  );
};
