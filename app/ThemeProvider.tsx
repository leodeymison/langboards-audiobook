'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Erro ao aplicar tema:', error);
    }
  }, []);

  return null;
}
