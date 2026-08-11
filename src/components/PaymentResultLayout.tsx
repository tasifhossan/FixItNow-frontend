import React from 'react';

interface PaymentResultLayoutProps {
  children: React.ReactNode;
}

/**
 * Centred, glassy card wrapper shared by the payment success / failed / cancelled pages.
 * Each page provides its own icon, heading, body, and action buttons as children.
 */
export default function PaymentResultLayout({ children }: PaymentResultLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-subtle">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}
