import React from 'react';
import { ArrowLeft, Linkedin, Twitter, Mail } from 'lucide-react';

interface EditorialTeamProps {
  onBack: () => void;
}

const teamMembers = [
  {
    name: "Sarah Jenkins",
    role: "Senior Editor, Air Freight",
    bio: "Sarah brings over 15 years of experience in aviation logistics. Formerly with Cargo Facts, she specializes in analyzing air cargo capacity trends and carrier strategies.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "David Chen",
    role: "Lead Analyst, Ocean Markets",
    bio: "David is a renowned expert in trans-pacific trade lanes. His analysis of container spot rates and port congestion is widely cited in the industry.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Elena Rodriguez",
    role: "Supply Chain & Tech Editor",
    bio: "Elena covers the intersection of technology and supply chain resilience. She reports on digitalization, blockchain adoption, and sustainability regulations.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Michael Chang",
    role: "Regulatory Affairs Correspondent",
    bio: "Based in Brussels, Michael tracks evolving EU and global trade regulations, providing critical insights on compliance for logistics managers.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

const EditorialTeam: React.FC<EditorialTeamProps> = ({ onBack }) => {
  return (
    <div className="bg-white min-h-screen animate-fade-in pb-20">
      <div className="bg-logi-navy text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <button 
             onClick={onBack}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
           >
             <ArrowLeft size={16} /> Back to News
           </button>
           <h1 className="text-4xl md:text-5xl font-bold mb-4">Editorial Team</h1>
           <p className="text-xl text-gray-400 max-w-2xl">
             Meet the experts behind LogiInsight's market intelligence.
           </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-logi-blue font-medium text-sm mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {member.bio}
              </p>
              <div className="flex gap-4 text-gray-400 mt-auto">
                <button className="hover:text-logi-blue transition-colors"><Linkedin size={18} /></button>
                <button className="hover:text-logi-blue transition-colors"><Twitter size={18} /></button>
                <button className="hover:text-logi-blue transition-colors"><Mail size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialTeam;