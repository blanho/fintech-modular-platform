import { formatDate, formatRelativeTime } from '@/shared/lib/format';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

interface DateDisplayProps {
  date: string | Date;
  format?: 'full' | 'date' | 'time' | 'relative';
  showTooltip?: boolean;
  className?: string;
}

export function DateDisplay({
  date,
  format = 'full',
  showTooltip = true,
  className,
}: DateDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const displayText =
    format === 'relative'
      ? formatRelativeTime(dateObj)
      : formatDate(dateObj, {
          dateStyle: format === 'time' ? undefined : format === 'date' ? 'medium' : 'medium',
          timeStyle: format === 'date' ? undefined : format === 'time' ? 'short' : 'short',
        });

  const fullDate = formatDate(dateObj, { dateStyle: 'full', timeStyle: 'medium' });

  if (!showTooltip || format === 'full') {
    return <span className={cn('text-muted-foreground', className)}>{displayText}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('text-muted-foreground cursor-help', className)}>{displayText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{fullDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}