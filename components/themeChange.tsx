'use client';
import { Button } from '@/components/ui/button';
import React from 'react';

export function ThemeChange() {
  const toggleTheme = (theme: 'dark' | 'light') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  return (
    <div className={'absolute right-2 top-2'}>
      <Button onClick={() => toggleTheme('dark')}>Dark Mode</Button>
      <Button onClick={() => toggleTheme('light')}>Light Mode</Button>
    </div>
  );
}
