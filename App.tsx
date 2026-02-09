import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ArticleCard from './components/Article/ArticleCard';
import ArticleDetail from './components/Article/ArticleDetail';
import Newsletter from './components/Newsletter';
import EditorialTeam from './components/Team/EditorialTeam';
import { Article, Category } from './types';
import { fetchLatestArticles } from './services/geminiService';
import { Loader2, TrendingUp, Mail, ChevronRight, Filter, Tag, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Derived State from URL
  const activeCategoryParam = searchParams.get('category');
  const activeCategory = Object.values(Category).includes(activeCategoryParam as Category) 
    ? (activeCategoryParam as Category) 
    : Category.ALL;
    
  const activeTag = searchParams.get('tag');
  const searchQuery = searchParams.get('q') || '';
  
  const isTeamPage = location.pathname === '/team';
  const articlePathMatch = location.pathname.match(/^\/article\/(.+)$/);
  const articleId = articlePathMatch ? articlePathMatch[1] : null;

  // Load Initial Data
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const data = await fetchLatestArticles();
      setArticles(data);
      setLoading(false);
    };
    initData();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  // Handlers
  const handleCategoryChange = (cat: Category) => {
    if (cat === Category.ALL) navigate('/');
    else navigate(`/?category=${encodeURIComponent(cat)}`);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleShowTeam = () => {
    navigate('/team');
  };

  const handleSearch = (query: string) => {
    if (query) navigate(`/?q=${encodeURIComponent(query)}`);
    else navigate('/');
  };

  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.id}`);
  };

  // Filter Logic
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === Category.ALL || article.category === activeCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || (article.tags && article.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()));
    return matchesCategory && matchesSearch && matchesTag;
  });

  // Layout Logic: Divide content for the "Magazine" look
  const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const secondaryArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id).slice(0, 3);
  const mainFeedArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id).slice(3);

  // Determine Title text
  const getPageTitle = () => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (activeTag) return `Articles tagged with #${activeTag}`;
    if (activeCategory === Category.ALL) return 'Latest Intelligence';
    return activeCategory;
  }

  // --- Views ---

  // Article Detail View
  if (articleId) {
    // If loading, show loader, else find article
    if (loading) {
       return (
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
          <Header 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
            onHomeClick={handleHomeClick}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            articles={articles}
          />
           <div className="flex flex-col items-center justify-center flex-grow text-logi-slate">
            <Loader2 size={48} className="animate-spin mb-4 text-logi-blue" />
            <p className="text-lg font-medium">Loading article...</p>
          </div>
          <Footer onShowTeam={handleShowTeam} />
        </div>
       )
    }

    const selectedArticle = articles.find(a => a.id === articleId);

    if (selectedArticle) {
        const relatedArticles = articles
          .filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)
          .slice(0, 3);
        
        if (relatedArticles.length < 3) {
           const others = articles
            .filter(a => a.id !== selectedArticle.id && !relatedArticles.find(r => r.id === a.id))
            .slice(0, 3 - relatedArticles.length);
           relatedArticles.push(...others);
        }

        return (
          <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
            <Header 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
              onHomeClick={handleHomeClick}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              articles={articles}
            />
            <main className="flex-grow">
              <ArticleDetail 
                article={selectedArticle} 
                relatedArticles={relatedArticles}
                onBack={() => navigate('/')} 
                onArticleClick={handleArticleClick}
                onTagClick={handleTagClick}
              />
            </main>
            <Footer onShowTeam={handleShowTeam} />
          </div>
        );
    } else {
        // Article ID present but not found in list (404)
        return (
           <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
            <Header 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
              onHomeClick={handleHomeClick}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              articles={articles}
            />
             <div className="container mx-auto px-4 py-20 text-center flex-grow">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h2>
               <p className="text-gray-500 mb-8">The article you are looking for does not exist or has been removed.</p>
               <button onClick={() => navigate('/')} className="text-logi-blue font-bold hover:underline flex items-center justify-center gap-2">
                 <ArrowLeft size={16}/> Back to Home
               </button>
             </div>
             <Footer onShowTeam={handleShowTeam} />
           </div>
        );
    }
  }

  // Team View
  if (isTeamPage) {
    return (
      <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
        <Header 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
          onHomeClick={handleHomeClick}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          articles={articles}
        />
        <main className="flex-grow">
          <EditorialTeam onBack={handleHomeClick} />
        </main>
        <Footer onShowTeam={handleShowTeam} />
      </div>
    );
  }

  // --- Main Feed View ---

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        onHomeClick={handleHomeClick}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        articles={articles}
      />

      <main className="flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-logi-slate">
            <Loader2 size={48} className="animate-spin mb-4 text-logi-blue" />
            <p className="text-lg font-medium">Gathering market intelligence...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h2>
            <button onClick={() => navigate('/')} className="text-logi-blue hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="container mx-auto px-4 lg:px-8 py-8">
            
            {/* Filter Bar */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                <Filter size={16} />
                <span className="hidden md:inline">Filter by:</span>
              </div>
              <div className="flex gap-2">
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      activeCategory === cat
                        ? 'bg-logi-blue border-logi-blue text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-logi-blue hover:text-logi-blue hover:bg-logi-light-blue/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* HERO SECTION - Only show on Home/All when not searching or filtering by tag */}
            {!searchQuery && !activeTag && activeCategory === Category.ALL && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b border-gray-200 pb-12">
                {/* Main Featured Article (Left 8 cols) */}
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-8 bg-logi-blue block"></span>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-logi-navy">Top Story</h2>
                  </div>
                  {featuredArticle && (
                    <ArticleCard 
                      variant="hero" 
                      article={featuredArticle} 
                      onClick={handleArticleClick} 
                    />
                  )}
                </div>
                
                {/* Secondary Featured (Right 4 cols) - "Headlines" style */}
                <div className="lg:col-span-4 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-logi-blue"/>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-logi-navy">Trending Now</h2>
                  </div>
                  <div className="flex flex-col gap-0 bg-gray-50 rounded-xl border border-gray-100 p-4 h-full">
                     {secondaryArticles.map(article => (
                       <ArticleCard 
                         key={`sec-${article.id}`} 
                         variant="compact" 
                         article={article} 
                         onClick={handleArticleClick} 
                       />
                     ))}
                     <button className="mt-auto text-center text-sm font-bold text-logi-blue py-3 hover:underline">
                        View All Trending
                     </button>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Latest News List (8 cols) */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-3">
                    {activeTag && (
                      <button onClick={handleHomeClick} className="p-1 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} className="text-gray-500" />
                      </button>
                    )}
                    <h3 className="text-2xl font-bold text-logi-navy font-serif">
                      {getPageTitle()}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                     <span className="w-2 h-2 rounded-full bg-gray-300 hover:bg-logi-blue cursor-pointer"></span>
                     <span className="w-2 h-2 rounded-full bg-logi-blue cursor-pointer"></span>
                     <span className="w-2 h-2 rounded-full bg-gray-300 hover:bg-logi-blue cursor-pointer"></span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {(searchQuery || activeTag || activeCategory !== Category.ALL ? filteredArticles : mainFeedArticles).map(article => (
                    <ArticleCard 
                      key={article.id} 
                      variant="list" 
                      article={article} 
                      onClick={handleArticleClick} 
                      highlightTerm={searchQuery}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-12">
                
                {/* Sidebar Widget: Newsletter Mini */}
                <div className="bg-logi-navy text-white p-8 rounded-lg shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-logi-blue/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                   <h4 className="text-xl font-bold mb-3 relative z-10 font-serif">Logistics Briefing</h4>
                   <p className="text-gray-300 text-sm mb-6 relative z-10">
                     Daily rates, regulation updates, and market analysis delivered to your inbox.
                   </p>
                   <button className="w-full py-3 bg-logi-blue hover:bg-blue-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center gap-2 relative z-10">
                      <Mail size={16}/> Subscribe Free
                   </button>
                </div>

                {/* Sidebar Widget: Market Indices */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                   <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 pb-2">Market Indices</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-gray-800">SCFI (Shanghai)</span>
                         <span className="text-red-500 font-mono text-sm">1024.50 ▼ 1.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-gray-800">WCI (Drewry)</span>
                         <span className="text-green-500 font-mono text-sm">$1,450 ▲ 0.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-gray-800">TAC Index (Air)</span>
                         <span className="text-green-500 font-mono text-sm">$2.85/kg ▲ 3.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="font-bold text-gray-800">Baltic Dry</span>
                         <span className="text-red-500 font-mono text-sm">1540 ▼ 0.8%</span>
                      </div>
                   </div>
                   <button className="w-full mt-6 text-xs font-bold text-logi-blue uppercase flex items-center justify-center">
                      View All Data <ChevronRight size={12}/>
                   </button>
                </div>

                {/* Sidebar Widget: Industry Focus */}
                <div>
                   <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-100 pb-2">Industry Focus</h4>
                   <div className="flex flex-wrap gap-2">
                      {['Pharma', 'Cold Chain', 'Logistics', 'Packaging', 'Monitoring', 'GxP', 'Events', 'Airlines', 'Airport', 'Automotive', 'E-Commerce'].map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => handleTagClick(tag)}
                          className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                            activeTag === tag 
                             ? 'bg-logi-blue text-white' 
                             : 'bg-gray-100 text-gray-600 hover:bg-logi-light-blue hover:text-logi-blue'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                   </div>
                </div>

              </div>
            </div>
            
            {/* Bottom Section: Editor's Picks (Grid) */}
            {!searchQuery && !activeTag && (
              <div className="mt-16 pt-12 border-t border-gray-200">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-logi-navy font-serif">Editor's Picks</h3>
                    <button className="text-sm font-bold text-logi-blue hover:text-logi-navy">See All</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {articles.slice(0,4).map(article => (
                      <div key={`pick-${article.id}`} className="h-full">
                         <ArticleCard variant="grid" article={article} onClick={handleArticleClick} />
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        )}
      </main>

      <Newsletter />
      <Footer onShowTeam={handleShowTeam} />
    </div>
  );
};

export default App;