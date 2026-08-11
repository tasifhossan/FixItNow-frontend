import React from 'react';

interface PaymentResultLayoutProps {
  children: React.ReactNode;
}

/**
 * Centred, glassy card wrapper shared by the payment success / failed / cancelled pages.
 * Supports both light mode and dark mode with high-contrast text and borders.
 */
export default function PaymentResultLayout({ children }: PaymentResultLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-subtle dark:bg-none dark:bg-slate-950 transition-colors duration-300">
      <div className="glass-card dark:bg-slate-900/90 dark:border-slate-800/80 w-full max-w-md rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6 text-center shadow-xl transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
