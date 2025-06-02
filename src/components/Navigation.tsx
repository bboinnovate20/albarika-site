"use client";
import Link from "next/link";

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Navigation({ isMenuOpen, setIsMenuOpen }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Albarika</span>
              <span className="text-sm text-gray-600 block -mt-1">Computer Centre</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link href="#schools" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Our Schools</Link>
            <Link href="#programs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Programs</Link>
            <Link href="#masterclasses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Masterclasses</Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
            <Link href="#contact" className="btn-primary">Get Started</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#schools"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Schools
              </Link>
              <Link
                href="#programs"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Programs
              </Link>
              <Link
                href="#masterclasses"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Masterclasses
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="block mx-3 mt-4 btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 