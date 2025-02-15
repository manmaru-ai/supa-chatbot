import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ComponentPropsWithoutRef } from 'react';

type CodeBlockProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  className?: string;
};

type PrismStyleObj = {
  [key: string]: {
    color?: string;
    backgroundColor?: string;
    fontStyle?: string;
    fontWeight?: string;
    textDecoration?: string;
    verticalAlign?: string;
    display?: string;
    [key: string]: string | undefined;
  };
};

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        "flex w-full",
        message.role === "assistant" ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] rounded-lg px-4 py-2",
          message.role === "assistant"
            ? "bg-gray-100"
            : "bg-blue-500 text-white"
        )}
      >
        <div className={cn(
          "prose dark:prose-invert max-w-none",
          message.role === "user" && "prose-invert"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border border-gray-300 px-4 py-2">
                    {children}
                  </td>
                );
              },
              a({ children, href }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 