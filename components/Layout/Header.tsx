import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Ship, Bell, X, User, Globe, ChevronRight } from 'lucide-react';
import { Category, Article } from '../../types';

interface HeaderProps {
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
  onHomeClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  articles: Article[];
}

const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, onHomeClick, onSearch, searchQuery, articles }) => {
  const navItems = Object.values(Category);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleCloseSearch = () => {
    onSearch('');
    setIsSearchOpen(false);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // Only close full search if query is empty to prevent annoying closure
        if (!searchQuery) setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length > 0 && isSearchOpen) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) || 
        a.summary.toLowerCase().includes(lowerQuery)
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, articles, isSearchOpen]);

  const handleSuggestionClick = (articleTitle: string) => {
    onSearch(articleTitle); // Or navigate directly
    setShowSuggestions(false);
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col w-full font-sans sticky top-0 z-50 print:hidden">
      {/* Top Utility Bar */}
      <div className="bg-logi-navy text-gray-300 text-xs py-2 border-b border-gray-700">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          <div className="hidden md:flex gap-4">
            <span>{currentDate}</span>
            <span className="text-gray-500">|</span>
            <span className="hover:text-white cursor-pointer transition-colors">Market Indices: SCFI 1024.50 ▼</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="hover:text-white flex items-center gap-1 transition-colors">
              <Globe size={12} /> Global (EN)
            </button>
            <span className="text-gray-500">|</span>
            <button className="hover:text-white transition-colors">Subscribe</button>
            <span className="text-gray-500">|</span>
            <button className="hover:text-white flex items-center gap-1 transition-colors">
              <User size={12} /> Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onHomeClick}>
              <div className="bg-logi-blue text-white p-2 rounded-lg shadow-sm group-hover:bg-logi-navy transition-colors">
                <Ship size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-logi-navy leading-none">
                  LOGI<span className="text-logi-blue">INSIGHT</span>
                </span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Global Market Intelligence</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all rounded-md ${
                    activeCategory === cat 
                      ? 'text-logi-blue bg-logi-light-blue' 
                      : 'text-gray-600 hover:text-logi-blue hover:bg-gray-50'
                  }`}
                >
                  {cat === Category.ALL ? 'News Feed' : cat}
                </button>
              ))}
            </nav>

            {/* Icons / Actions */}
            <div className="flex items-center gap-3 text-gray-500 relative" ref={searchRef}>
              {(isSearchOpen || searchQuery) ? (
                <div className="relative">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 animate-fade-in transition-all border border-gray-200">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 outline-none w-32 md:w-64"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => onSearch(e.target.value)}
                      autoFocus
                    />
                    <button onClick={handleCloseSearch} className="ml-1 hover:text-gray-800">
                      <X size={14} />
                    </button>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[100]">
                      <div className="p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Suggested Articles
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {suggestions.map((article) => (
                          <div 
                            key={article.id}
                            onClick={() => handleSuggestionClick(article.title)}
                            className="p-3 hover:bg-logi-light-blue cursor-pointer border-b border-gray-50 last:border-0 flex gap-3 group"
                          >
                             <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                               <img src={article.imageUrl} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div className="flex flex-col justify-center">
                               <h5 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-logi-blue">{article.title}</h5>
                               <p className="text-xs text-gray-500 line-clamp-1">{article.summary}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                      {suggestions.length === 5 && (
                         <div className="p-2 text-center text-xs text-logi-blue font-bold cursor-pointer hover:bg-gray-50 border-t border-gray-100">
                           View all results
                         </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
              
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-logi-navy">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;