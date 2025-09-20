'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  return (
    <div className="bg-background" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder || 'Enter description...',
        }}
      />
    </div>
  );
}

interface WysiwygViewerProps {
  content: string;
}

export function WysiwygViewer({ content }: WysiwygViewerProps) {
  const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });
  
  return (
    <div className="prose prose-sm max-w-none" data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  );
}