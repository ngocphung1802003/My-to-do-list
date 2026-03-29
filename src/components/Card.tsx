import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card = ({ children, className, title, subtitle, footer }: CardProps) => {
  return (
    <div className={cn('glass-card rounded-[32px] p-8 flex flex-col gap-6 border-white/20 shadow-2xl', className)}>
      {(title || subtitle) && (
        <div className="flex flex-col gap-2">
          {title && <h3 className="text-2xl font-black tracking-tight text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-white/60 font-medium tracking-wide">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {footer && (
        <div className="pt-6 border-t border-white/10">
          {footer}
        </div>
      )}
    </div>
  );
};
