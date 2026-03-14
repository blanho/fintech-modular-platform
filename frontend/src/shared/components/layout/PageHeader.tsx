import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backHref,
  onBack,
  actions,
  className,
  children,
}: PageHeaderProps) {
  const showBack = backHref || onBack;

  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              asChild={!!backHref}
            >
              {backHref ? (
                <a href={backHref}>
                  <ChevronLeft className="h-5 w-5" />
                </a>
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}