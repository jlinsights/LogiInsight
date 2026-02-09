import React from 'react';
import { Ship, Linkedin, Twitter, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onShowTeam: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTeam }) => {
  return (
    <footer className="bg-logi-navy text-gray-300 py-12 border-t border-gray-800 print:hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-4 text-white">
              <Ship size={24} />
              <span className="text-xl font-bold">LogiInsight</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your daily source for market intelligence in Air Freight, Ocean Shipping, and Global Supply Chain trends.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-logi-blue transition-colors">Air Freight</a></li>
              <li><a href="#" className="hover:text-logi-blue transition-colors">Ocean Freight</a></li>
              <li><a href="#" className="hover:text-logi-blue transition-colors">Supply Chain</a></li>
              <li><a href="#" className="hover:text-logi-blue transition-colors">Regulations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-logi-blue transition-colors">About Us</a></li>
              <li>
                <button onClick={onShowTeam} className="hover:text-logi-blue transition-colors text-left">
                  Editorial Team
                </button>
              </li>
              <li><a href="#" className="hover:text-logi-blue transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-logi-blue transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Stay Connected</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <Mail size={16} />
               <span>contact@logiinsight.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} LogiInsight Global. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;