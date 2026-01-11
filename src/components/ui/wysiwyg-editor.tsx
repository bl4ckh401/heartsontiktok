'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function WysiwygEditor({ value, onChange, placeholder, className }: WysiwygEditorProps) {
  return (
    <div className={cn("rounded-xl border border-white/10 overflow-hidden bg-black/20 backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300", className)} data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        height={300}
        style={{ backgroundColor: 'transparent', color: 'inherit' }}
        className="!bg-transparent !border-none !shadow-none"
        textareaProps={{
          placeholder: placeholder || 'Enter description...',
          className: "placeholder:text-muted-foreground/50",
        }}
        previewOptions={{
          style: { backgroundColor: 'transparent', color: 'inherit' }
        }}
      />
    </div>
  );
}

interface WysiwygViewerProps {
  content: string;
  className?: string;
}

export function WysiwygViewer({ content, className }: WysiwygViewerProps) {
  return (
    <div
      className={cn(
        "w-full text-foreground/90 space-y-4",
        // Typography Overrides for 'World Class' Look
        "[&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-4 [&_h1]:bg-gradient-to-r [&_h1]:from-white [&_h1]:to-white/70 [&_h1]:bg-clip-text [&_h1]:text-transparent",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-white",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-white/90",
        "[&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-muted-foreground",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-muted-foreground",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2",
        "[&_li]:pl-1",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80 [&_a]:transition-colors",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground/80 [&_blockquote]:my-4",
        "[&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm",
        "[&_pre]:bg-black/50 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:border [&_pre]:border-white/5",
        "[&_hr]:border-white/10 [&_hr]:my-8",
        className
      )}
      data-color-mode="dark"
    >
      <MarkdownPreview
        source={content}
        style={{
          backgroundColor: 'transparent',
          color: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          fontFamily: 'inherit'
        }}
        wrapperElement={{
          "data-color-mode": "dark"
        }}
      />
    </div>
  );
}