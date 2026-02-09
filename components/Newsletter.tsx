import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Check } from 'lucide-react';
import { Category } from '../types';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const interestOptions = [
    Category.AIR_FREIGHT,
    Category.OCEAN_FREIGHT,
    Category.SUPPLY_CHAIN,
    Category.REGULATIONS
  ];

  const toggleInterest = (interest: Category) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      // In a real application, you would send 'email' and 'selectedInterests' to your backend here.
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSelectedInterests([]);
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-logi-navy to-slate-900 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-logi-blue rounded-full blur-[120px] opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-logi-teal rounded-full blur-[100px] opacity-10 transform -translate-x-1/4 translate-y-1/4"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-logi-blue mb-6 backdrop-blur-sm border border-white/10">
            <Mail size={16} />
            <span>Weekly Market Intelligence</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Stay ahead of the supply chain curve.
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 15,000+ logistics professionals receiving our weekly digest on rates, regulations, and market movements. Customize your feed by selecting your interests below.
          </p>

          {subscribed ? (
             <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-8 py-4 rounded-xl inline-flex items-center gap-3 animate-fade-in">
               <CheckCircle2 size={24} className="text-green-400" />
               <span className="font-semibold">Successfully subscribed! Welcome aboard.</span>
             </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto">
              
              {/* Interest Selection */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${
                      selectedInterests.includes(interest)
                        ? 'bg-logi-blue border-logi-blue text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {selectedInterests.includes(interest) && <Check size={14} strokeWidth={3} />}
                    {interest}
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="work@company.com" 
                  required
                  className="flex-grow px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-logi-blue focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-logi-blue hover:bg-sky-500 text-white font-bold transition-all shadow-lg hover:shadow-logi-blue/25 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2">
                 {selectedInterests.length === 0 ? (
                   <span>Select topics to personalize your newsletter</span>
                 ) : (
                   <span className="text-logi-blue">{selectedInterests.length} topics selected</span>
                 )}
              </div>
            </form>
          )}
          
          <p className="text-xs text-gray-600 mt-6">
            By subscribing, you agree to our Terms & Conditions. You can unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;