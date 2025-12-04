"use client";

import { HTMLAttributes, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className = "", title, subtitle, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={`py-20 md:py-28 ${className}`}
        {...props}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {(title || subtitle) && (
            <div className="text-center mb-16">
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;
