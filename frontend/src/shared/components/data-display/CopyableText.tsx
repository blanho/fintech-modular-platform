import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyableTextProps {
  text: string;
  displayText?: string;
  truncate?: boolean;
  maxLength?: number;
  className?: string;
}

export function CopyableText({
  text,
  displayText,
  truncate = false,
  maxLength = 16,
  className,
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const display = displayText || text;
  const shouldTruncate = truncate && display.length > maxLength;
  const truncatedText = shouldTruncate
    ? `${display.slice(0, maxLength / 2)}...${display.slice(-maxLength / 2)}`
    : display;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className={cn(
              'inline-flex items-center gap-1.5 font-mono text-sm hover:text-foreground transition-colors',
              'text-muted-foreground',
              className
            )}
          >
            <span>{truncatedText}</span>
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Click to copy'}</p>
          {shouldTruncate && <p className="text-xs text-muted-foreground mt-1">{text}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}