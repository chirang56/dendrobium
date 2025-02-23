import React, { useState } from 'react';
import { Sun, Moon, Languages, LogIn, LogOut, Home, Bell, Calendar, Phone, LayoutDashboard, AlertTriangle, Users, Wallet, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, icon, children, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-400 px-3 py-2 text-sm font-medium"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage, t } = useLanguage();
  const { profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const publicLinks = (
    <>
      <NavLink href="/" icon={<Home className="h-4 w-4" />}>{t('home')}</NavLink>
      <NavLink href="/notices" icon={<Bell className="h-4 w-4" />}>{t('notices')}</NavLink>
      <NavLink href="/events" icon={<Calendar className="h-4 w-4" />}>{t('events')}</NavLink>
      <NavLink href="/contact" icon={<Phone className="h-4 w-4" />}>{t('contact')}</NavLink>
    </>
  );

  const residentLinks = (
    <>
      <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>{t('dashboard')}</NavLink>
      <NavLink href="/complaints" icon={<AlertTriangle className="h-4 w-4" />}>{t('complaints')}</NavLink>
      <NavLink href="/notices" icon={<Bell className="h-4 w-4" />}>{t('notices')}</NavLink>
      <NavLink href="/events" icon={<Calendar className="h-4 w-4" />}>{t('events')}</NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>{t('dashboard')}</NavLink>
      <NavLink href="/residents" icon={<Users className="h-4 w-4" />}>{t('residents')}</NavLink>
      <NavLink href="/notices" icon={<Bell className="h-4 w-4" />}>{t('notices')}</NavLink>
      <NavLink href="/complaints" icon={<AlertTriangle className="h-4 w-4" />}>{t('complaints')}</NavLink>
      <NavLink href="/events" icon={<Calendar className="h-4 w-4" />}>{t('events')}</NavLink>
      <NavLink href="/finances" icon={<Wallet className="h-4 w-4" />}>{t('finances')}</NavLink>
    </>
  );

  return (
    <nav className="fixed w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {!profile && publicLinks}
            {profile?.role === 'resident' && residentLinks}
            {profile?.role === 'admin' && adminLinks}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Language"
            >
              <Languages className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {profile ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">{t('logout')}</span>
              </button>
            ) : (
              <a
                href="/login"
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogIn className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">{t('login')}</span>
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!profile && publicLinks}
              {profile?.role === 'resident' && residentLinks}
              {profile?.role === 'admin' && adminLinks}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}