import React from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ArticleContentRendererProps {
  content: string[] | string;
}

export function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  const blocks = Array.isArray(content) ? content : [content];

  // Helper to format inline bold, italic, code, links
  const renderFormattedText = (text: string): React.ReactNode => {
    // Check if line contains [VERIFIED CONTENT TO BE ADDED...]
    if (text.includes('[VERIFIED CONTENT TO BE ADDED')) {
      const match = text.match(/\[VERIFIED CONTENT TO BE ADDED(.*?)\]/);
      if (match) {
        const parts = text.split(match[0]);
        return (
          <>
            {renderFormattedText(parts[0])}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 my-2 rounded-sm bg-[#FFF8EE] dark:bg-[#251B10] border border-[#E9C894] dark:border-[#523A1E] text-xs font-mono font-medium text-[#925C15] dark:text-[#E9B66F] leading-snug">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#B58A3C]" />
              <span>[VERIFIED CONTENT TO BE ADDED{match[1]}]</span>
            </span>
            {renderFormattedText(parts[1])}
          </>
        );
      }
    }

    // Split for markdown images ![alt](src)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    if (imgRegex.test(text)) {
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      const re = /!\[(.*?)\]\((.*?)\)/g;
      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
          elements.push(text.substring(lastIndex, match.index));
        }
        const alt = match[1];
        const src = match[2];
        elements.push(
          <figure key={match.index} className="my-8">
            <div className="rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#28394E] bg-[#F1ECE2] dark:bg-[#131F30]">
              <img
                src={src}
                alt={alt}
                className="w-full h-auto max-h-[460px] object-cover"
                loading="lazy"
              />
            </div>
            {alt && (
              <figcaption className="mt-2 text-center text-xs text-[#718096] dark:text-[#94A3B8] italic font-serif">
                {alt}
              </figcaption>
            )}
          </figure>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
      }
      return <>{elements}</>;
    }

    // Simple markdown inline tokenization (bold **text**, italic *text*, links [label](url))
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\)|`.*?`)/g);

    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-[#142033] dark:text-[#F8F5EE]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            return (
              <em key={i} className="italic text-[#142033] dark:text-[#E2E8F0]">
                {part.slice(1, -1)}
              </em>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={i}
                className="px-1.5 py-0.5 rounded-xs bg-[#EAE2D2] dark:bg-[#1E2B3E] text-[13px] font-mono text-[#142033] dark:text-[#E2E8F0]"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
          if (linkMatch) {
            return (
              <a
                key={i}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B58A3C] hover:underline underline-offset-4 font-medium"
              >
                {linkMatch[1]}
              </a>
            );
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className="prose-editorial space-y-6 text-[#333C4E] dark:text-[#CBD5E1] font-normal leading-[1.75] text-[16.5px] sm:text-[17.5px]">
      {blocks.map((block, idx) => {
        const lines = block.split('\n');

        return (
          <div key={idx} className="space-y-4">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              if (!trimmed) return null;

              // H2 Heading
              if (trimmed.startsWith('## ')) {
                const headingText = trimmed.replace('## ', '');
                const anchorId = headingText
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '');

                return (
                  <div key={lineIdx} id={anchorId} className="pt-10 pb-3 scroll-mt-24 group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#B58A3C] shrink-0" />
                      <h2 className="font-playfair text-2xl sm:text-[30px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
                        {headingText}
                      </h2>
                    </div>
                    {/* Subtle gold divider line */}
                    <div className="h-[1.5px] bg-gradient-to-r from-[#B58A3C]/70 via-[#E4C88A]/50 to-transparent dark:from-[#D8BD82]/70 dark:via-[#B58A3C]/30 dark:to-transparent w-full mt-3.5 mb-2" />
                  </div>
                );
              }

              // H3 Heading
              if (trimmed.startsWith('### ')) {
                const headingText = trimmed.replace('### ', '');
                return (
                  <h3
                    key={lineIdx}
                    className="font-playfair text-xl sm:text-2xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight pt-5 pb-1"
                  >
                    {headingText}
                  </h3>
                );
              }

              // Unordered List Items
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const itemContent = trimmed.substring(2);
                return (
                  <div key={lineIdx} className="flex items-start gap-3 pl-2 sm:pl-4 my-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B58A3C] dark:bg-[#D8BD82] mt-2.5 shrink-0" />
                    <div className="flex-1 leading-relaxed">{renderFormattedText(itemContent)}</div>
                  </div>
                );
              }

              // Numbered List Items
              if (/^\d+\.\s/.test(trimmed)) {
                const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
                if (numMatch) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-3 pl-2 sm:pl-4 my-1.5">
                      <span className="font-mono text-xs font-bold text-[#B58A3C] dark:text-[#D8BD82] mt-1 shrink-0">
                        {numMatch[1]}.
                      </span>
                      <div className="flex-1 leading-relaxed">{renderFormattedText(numMatch[2])}</div>
                    </div>
                  );
                }
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                const quoteText = trimmed.replace('> ', '');
                return (
                  <blockquote
                    key={lineIdx}
                    className="my-6 pl-5 py-2 border-l-3 border-[#B58A3C] dark:border-[#D8BD82] bg-[#F4EFE5]/50 dark:bg-[#152132]/50 italic font-playfair text-lg text-[#142033] dark:text-[#E2E8F0]"
                  >
                    {renderFormattedText(quoteText)}
                  </blockquote>
                );
              }

              // Standalone Verified notice line
              if (trimmed.startsWith('[VERIFIED CONTENT TO BE ADDED')) {
                return (
                  <div
                    key={lineIdx}
                    className="p-4 sm:p-5 my-5 rounded-sm bg-[#FCFAF6] dark:bg-[#142030] border border-[#E4D7BE] dark:border-[#382618] flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F5EBD7] dark:bg-[#342817] flex items-center justify-center text-[#B58A3C] shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono tracking-wider uppercase text-[#B58A3C] dark:text-[#D8BD82] mb-1">
                        Archival Notice
                      </div>
                      <p className="text-sm font-sans text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                        {trimmed.replace(/^\[|\]$/g, '')}
                      </p>
                    </div>
                  </div>
                );
              }

              // Standard Paragraph
              return (
                <p key={lineIdx} className="leading-relaxed">
                  {renderFormattedText(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
