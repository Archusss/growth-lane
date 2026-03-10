import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTrackPageView } from "@/hooks/use-analytics";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { mutate: trackPage } = useTrackPageView();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    trackPage({ path: location });
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location, trackPage]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/library", label: "Library" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-neutral-200 selection:text-neutral-900">
      <header className="fixed top-0 inset-x-0 z-50 glass-nav">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <BookOpen size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight text-neutral-900">Growth Lane</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-neutral-900 ${
                  location === link.href ? "text-neutral-900" : "text-neutral-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/library" 
              className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Browse Library
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b border-neutral-100 shadow-lg px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium p-2 rounded-lg ${
                  location === link.href ? "bg-neutral-50 text-neutral-900" : "text-neutral-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 mt-16 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-neutral-200/50 bg-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 text-neutral-900 font-bold">
            <BookOpen size={20} />
            Growth Lane
          </div>
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Growth Lane. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
