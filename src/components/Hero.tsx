import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="relative bg-white dark:bg-gray-900">
      <div className="h-screen flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80")'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}