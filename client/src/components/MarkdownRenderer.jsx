import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownRenderer({ content }) {
  if (!content) return null;
  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
