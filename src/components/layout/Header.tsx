'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Terminal, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface SiteSettings {
  showSubmitButton: boolean;
  showDashboardButton: boolean;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    showSubmitButton: true,
    showDashboardButton: true,
  });

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSiteSettings({
            showSubmitButton: data.showSubmitButton ?? true,
            showDashboardButton: data.showDashboardButton ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const navigation = [
    { name: 'Launches', href: '/launches' },
    { name: 'Alternatives', href: '/alternatives' },
    { name: 'Categories', href: '/categories' },
    { name: 'Self-Hosted', href: '/self-hosted' },
    // { name: 'Advertise', href: '/advertise' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand/10 border border-brand/30 rounded-lg flex items-center justify-center group-hover:border-brand/60 transition-colors flex-shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            </div>
            <span className="font-pixel text-xs sm:text-sm text-white tracking-wider truncate">
              OS<span className="text-brand">_</span>FINDER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-muted hover:text-brand font-mono text-sm transition-colors relative group"
              >
                <span className="opacity-0 group-hover:opacity-100 text-brand/50 transition-opacity">[</span>
                {item.name}
                <span className="opacity-0 group-hover:opacity-100 text-brand/50 transition-opacity">]</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
              href="/search"
              className="p-2 sm:p-2.5 text-muted hover:text-brand border border-transparent hover:border-border rounded-lg transition-all touch-manipulation"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            {siteSettings.showSubmitButton && (
              <Link
                href="/submit"
                className="hidden sm:inline-flex items-center px-3 md:px-4 py-2 bg-brand text-dark font-mono text-xs md:text-sm font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
              >
                Submit_
              </Link>
            )}
            <Link
              href="/donate"
              className="hidden sm:inline-flex items-center px-3 md:px-4 py-2 bg-brand text-dark font-mono text-xs md:text-sm font-medium rounded-lg hover:bg-brand-light transition-all hover:shadow-glow"
            >
              Support the Project
            </Link>
            
            {/* Auth Section */}
            {loading ? (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 border border-border rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-muted/20 rounded" />
                <div className="w-16 h-4 bg-muted/20 rounded" />
              </div>
            ) : user ? (
              <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 text-muted hover:text-white border border-border hover:border-brand/50 rounded-lg transition-all touch-manipulation"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline font-mono text-xs md:text-sm max-w-[100px] md:max-w-[150px] truncate">
                        {user.name || user.email?.split('@')[0]}
                      </span>
                    </button>
                    
                    {isUserMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                          {siteSettings.showDashboardButton && (
                            <Link
                              href="/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-3 text-muted hover:text-white hover:bg-brand/10 font-mono text-sm transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-3 text-muted hover:text-red-400 hover:bg-red-500/10 font-mono text-sm transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-muted hover:text-white border border-border hover:border-brand/50 font-mono text-sm rounded-lg transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 -mr-1 text-muted hover:text-brand active:bg-brand/10 rounded-lg transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-border bg-surface/80 backdrop-blur-md max-h-[calc(100vh-56px)] overflow-y-auto">
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3.5 text-muted hover:text-brand active:bg-brand/10 font-mono text-sm transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-brand/50">{'>'}</span> {item.name}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {loading ? (
                <div className="px-4 py-3.5 text-muted font-mono text-sm">
                  <span className="text-brand/50">{'>'}</span> Loading...
                </div>
              ) : user ? (
                <>
                  {siteSettings.showDashboardButton && (
                    <Link
                      href="/dashboard"
                      className="px-4 py-3.5 text-muted hover:text-brand active:bg-brand/10 font-mono text-sm transition-colors touch-manipulation"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-brand/50">{'>'}</span> Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3.5 text-left text-muted hover:text-red-400 active:bg-red-500/10 font-mono text-sm transition-colors touch-manipulation w-full"
                  >
                    <span className="text-red-500/50">{'>'}</span> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3.5 text-muted hover:text-brand active:bg-brand/10 font-mono text-sm transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-brand/50">{'>'}</span> Sign In
                </Link>
              )}
              {siteSettings.showSubmitButton && (
                <div className="p-4 pt-2">
                  <Link
                    href="/submit"
                    className="flex items-center justify-center w-full px-4 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg active:bg-brand-light transition-colors touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Submit Project
                  </Link>
                </div>
              )}
              <div className="p-4 pt-0">
                  <Link
                    href="/donate"
                    className="flex items-center justify-center w-full px-4 py-3 bg-brand text-dark font-mono text-sm font-medium rounded-lg active:bg-brand-light transition-colors touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support the Project
                  </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
