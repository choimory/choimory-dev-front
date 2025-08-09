'use client';

import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <h1 className="text-xl font-bold">choimory-dev</h1>
      {children && <div className="flex items-center space-x-3">{children}</div>}
    </header>
  );
}
