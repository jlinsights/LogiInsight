import React from 'react';
import { Article, Category } from '../../types';
import { Clock, ArrowUpRight, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  variant?: 'hero' | 'list' | 'grid' | 'compact';
  highlightTerm?: string;
}

const getCategoryColor = (cat: Category) => {
  switch (cat) {
    case Category.AIR_FREIGHT: return 'text-sky-600 border-sky-200 bg-sky-50';
    case Category.OCEAN_FREIGHT: return 'text-blue-700 border-blue-200 bg-blue-50';
    case Category.REGULATIONS: return 'text-rose-600 border-rose-200 bg-rose-50';
    case Category.SUPPLY_CHAIN: return 'text-emerald-600 border-emerald-200 bg-emerald-50';
    default: return 'text-gray-600 border-gray-200 bg-gray-50';
  }
};

const HighlightedText = ({ text, term }: { text: string; term?: string }) => {
  if (!term || !term.trim()) return <>{text}</>;
  
  try {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 font-inherit">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    return <>{text}</>;
  }
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, variant = 'grid', highlightTerm }) => {
  
  // Variant: Hero (Main Feature)
  if (variant === 'hero') {
    return (
      <div 
        onClick={() => onClick(article)}
        className="group relative w-full h-[500px] overflow-hidden rounded-xl cursor-pointer shadow-soft hover:shadow-lg transition-all duration-300"
      >
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
          <span className="self-start px-3 py-1 mb-4 text-xs font-bold text-white uppercase bg-logi-blue rounded">
            {article.category}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:underline decoration-logi-blue underline-offset-4">
            <HighlightedText text={article.title} term={highlightTerm} />
          </h2>
          <div className="text-gray-200 text-lg line-clamp-2 max-w-3xl mb-4 hidden md:block">
            <HighlightedText text={article.summary} term={highlightTerm} />
          </div>
          <div className="flex items-center text-white/80 text-sm gap-4 border-t border-white/20 pt-4 mt-2">
             <span className="font-medium uppercase tracking-wider text-xs">{article.author}</span>
             <span className="text-xs">• {article.date}</span>
          </div>
        </div>
      </div>
    );
  }

  // Variant: List (Image Left, Content Right - Good for feed)
  if (variant === 'list') {
    return (
      <div 
        onClick={() => onClick(article)}
        className="group flex flex-col sm:flex-row gap-6 p-6 bg-white border-b border-gray-100 hover:bg-logi-light-blue/30 transition-colors cursor-pointer last:border-0"
      >
        <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden rounded-lg relative">
           <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="sm:w-2/3 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
             <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
             <span className="text-xs text-gray-400 font-medium">{article.date}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-logi-blue transition-colors font-serif leading-snug">
            <HighlightedText text={article.title} term={highlightTerm} />
          </h3>
          <div className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
            <HighlightedText text={article.summary} term={highlightTerm} />
          </div>
          <div className="flex items-center text-logi-blue text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
             Read Full Story <ChevronRight size={14} className="ml-1"/>
          </div>
        </div>
      </div>
    );
  }

  // Variant: Compact (Sidebar / Widgets)
  if (variant === 'compact') {
    return (
       <div 
        onClick={() => onClick(article)}
        className="group flex gap-3 py-4 border-b border-gray-100 cursor-pointer last:border-0"
      >
         <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
           <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
         </div>
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-logi-blue uppercase mb-1">{article.category}</span>
            <h4 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-logi-blue transition-colors line-clamp-2">
              <HighlightedText text={article.title} term={highlightTerm} />
            </h4>
            <span className="text-[10px] text-gray-400 mt-2">{article.date}</span>
         </div>
      </div>
    );
  }

  // Variant: Grid (Standard Card)
  return (
    <div 
      onClick={() => onClick(article)}
      className="group flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4">
          <span className="text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-logi-blue transition-colors leading-snug font-serif">
          <HighlightedText text={article.title} term={highlightTerm} />
        </h3>
        <div className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed flex-grow">
          <HighlightedText text={article.summary} term={highlightTerm} />
        </div>
        
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium text-gray-600">{article.author}</span>
          <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;