import React, { useEffect, useState } from 'react';
import { Article } from '../../types';
import { generateFullArticle } from '../../services/geminiService';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Tag, Printer, MessageSquare, Send, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ArticleCard from './ArticleCard';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onArticleClick: (article: Article) => void;
  onTagClick: (tag: string) => void;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, relatedArticles, onBack, onArticleClick, onTagClick }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Comment State
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Load Content
  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setLoading(true);
      setContent(''); // Clear previous content
      
      if (article.content) {
        setContent(article.content);
        setLoading(false);
        return;
      }
      
      const generatedText = await generateFullArticle(article);
      if (isMounted) {
        setContent(generatedText);
        setLoading(false);
      }
    };
    loadContent();
    return () => { isMounted = false; };
  }, [article]);

  // Load Comments from LocalStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`logiinsight_comments_${article.id}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Failed to parse comments", e);
        setComments([]);
      }
    } else {
      setComments([]);
    }
  }, [article.id]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'native') => {
    const shareUrl = window.location.href;
    const shareText = `Check out this article: ${article.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: article.title,
            text: article.summary,
            url: shareUrl,
          }).catch(console.error);
        } else {
           navigator.clipboard.writeText(shareUrl).then(() => alert('Link copied to clipboard!'));
        }
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      name: commentName.trim(),
      text: commentText.trim(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`logiinsight_comments_${article.id}`, JSON.stringify(updatedComments));
    
    setCommentName('');
    setCommentText('');
  };

  const displayTags = article.tags && article.tags.length > 0 
    ? article.tags 
    : ['Logistics', 'Supply Chain', article.category]; // Fallback tags

  return (
    <div className="bg-white min-h-screen pb-0 animate-fade-in">
      {/* Hero Header for Article */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/50"></div>
        <div className="absolute top-0 left-0 p-6 z-10 print:hidden">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all font-medium text-sm"
           >
             <ArrowLeft size={16} /> Back to News
           </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block bg-logi-blue text-white px-3 py-1 rounded text-xs font-bold uppercase mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
              <span className="font-semibold">{article.author}</span>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {article.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Main Text & Comments */}
          <div className="lg:w-3/4 print:w-full">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-64 bg-gray-200 rounded w-full my-8"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : (
              <article className="prose prose-lg prose-slate max-w-none">
                <p className="lead text-xl text-gray-600 font-medium mb-8 border-l-4 border-logi-blue pl-4">
                  {article.summary}
                </p>
                <ReactMarkdown>{content}</ReactMarkdown>
              </article>
            )}

            {/* Comments Section */}
            <div className="mt-16 pt-10 border-t border-gray-200 print:hidden">
              <h3 className="text-2xl font-bold text-logi-navy mb-8 flex items-center gap-2 font-serif">
                <MessageSquare size={24} className="text-logi-blue"/>
                Community Discussion <span className="text-gray-400 text-lg font-normal">({comments.length})</span>
              </h3>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-10 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Leave a comment</h4>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-logi-blue focus:ring-1 focus:ring-logi-blue outline-none transition-all"
                    required
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-logi-blue focus:ring-1 focus:ring-logi-blue outline-none transition-all resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!commentName.trim() || !commentText.trim()}
                  className="bg-logi-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} /> Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-4">No comments yet. Be the first to start the discussion!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-logi-light-blue text-logi-blue flex items-center justify-center font-bold border border-blue-100">
                           {comment.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                           <h5 className="font-bold text-gray-900">{comment.name}</h5>
                           <span className="text-xs text-gray-400">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-8 print:hidden">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Share this article</h3>
              <div className="flex gap-2 mb-8">
                <button 
                  onClick={() => handleShare('facebook')}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  title="Share on Facebook"
                >
                  <Facebook size={18} />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </button>
                <button 
                  onClick={() => handleShare('native')}
                  className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
                  title="Share Link"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={handlePrint}
                  className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
                  title="Print Article"
                >
                  <Printer size={18} />
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2 pt-6 border-t border-gray-200">
                <Tag size={14} /> Relevant Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayTags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => onTagClick(tag)}
                    title={`Filter articles by ${tag}`}
                    className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:bg-logi-blue hover:text-white hover:border-logi-blue hover:shadow-sm transition-all active:scale-95"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Articles Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-16 mt-12 print:hidden">
        <div className="container mx-auto px-4 lg:px-8">
           <h3 className="text-2xl font-bold text-logi-navy mb-8 font-serif border-l-4 border-logi-blue pl-4">
             Related Intelligence
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(rel => (
                 <ArticleCard 
                   key={rel.id} 
                   article={rel} 
                   variant="grid" 
                   onClick={onArticleClick} 
                 />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;