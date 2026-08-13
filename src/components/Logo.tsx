import React from 'react';

export default function Logo() {
  return (
    <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-850 flex flex-col gap-0.5">
      <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 select-none">
        FixItNow
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Home Services
      </span>
    </div>
  );
}
