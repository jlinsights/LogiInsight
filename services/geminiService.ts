import { GoogleGenAI, Type } from "@google/genai";
import { Category, Article } from "../types";

const apiKey = process.env.API_KEY || ''; // Fallback handled by check in App

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// Helper to get random image based on category
const getImageUrl = (category: string, id: string) => {
  const seed = id.replace(/[^0-9]/g, '').slice(0, 3) || '100';
  return `https://picsum.photos/seed/${seed}/800/600`;
};

export const fetchLatestArticles = async (): Promise<Article[]> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are the editor-in-chief of a prestigious international logistics magazine like The Loadstar or JOC.
      Generate 7 diverse, high-quality article summaries about current trends in international logistics.
      
      Topics to cover:
      - Pharma & Cold Chain Logistics (Key focus: GxP compliance, Temperature Monitoring, Active/Passive Packaging)
      - Air Freight rates, capacity, Airlines strategies, and Airport infrastructure
      - Ocean Freight container indices (SCFI) and port congestion
      - Global Supply Chain resilience
      - Major Logistics Events & Conferences
      - New Regulations (EU ETS, C-BAM)
      
      Output JSON format strictly. Include a list of 3-5 relevant short tags for each article. 
      Ensure tags frequently include terms like 'Pharma', 'Cold Chain', 'Packaging', 'Monitoring', 'GxP', 'Events', 'Airlines', 'Airport' where applicable.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING, enum: Object.values(Category).filter(c => c !== Category.ALL) },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              author: { type: Type.STRING },
              readTime: { type: Type.STRING },
              date: { type: Type.STRING },
            },
            required: ['id', 'title', 'summary', 'category', 'tags', 'author', 'readTime', 'date']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    // Enrich with images
    return rawData.map((article: any, index: number) => ({
      ...article,
      id: `art-${Date.now()}-${index}`,
      imageUrl: getImageUrl(article.category, `art-${Date.now()}-${index}`),
      isFeatured: index === 0 // Make the first one featured
    }));

  } catch (error) {
    console.error("Failed to fetch articles from Gemini", error);
    // Fallback data in case of API failure or limit
    return [
      {
        id: 'fallback-1',
        title: 'New GxP Guidelines Impact Pharma Cold Chain Strategies',
        summary: 'Pharmaceutical shippers are revising packaging protocols to meet stricter temperature monitoring requirements for cell & gene therapies.',
        category: Category.SUPPLY_CHAIN,
        tags: ['Pharma', 'Cold Chain', 'GxP', 'Monitoring'],
        author: 'Sarah Jenkins',
        readTime: '6 min read',
        date: 'Oct 26, 2023',
        imageUrl: 'https://picsum.photos/seed/pharma1/800/600',
        isFeatured: true
      },
      {
        id: 'fallback-2',
        title: 'Major Airlines Expand Cargo Fleet Amidst Demand Surge',
        summary: 'Leading global airlines are converting passenger aircraft to freighters to capture the growing e-commerce market share.',
        category: Category.AIR_FREIGHT,
        tags: ['Airlines', 'Air Cargo', 'Airport', 'Logistics'],
        author: 'David Chen',
        readTime: '5 min read',
        date: 'Oct 24, 2023',
        imageUrl: 'https://picsum.photos/seed/logistics1/800/600'
      },
      {
        id: 'fallback-3',
        title: 'Logistics World Summit 2024: Key Takeaways',
        summary: 'Industry leaders gathered to discuss sustainable packaging and the future of digital monitoring in supply chains.',
        category: Category.MARKET_INSIGHT,
        tags: ['Events', 'Packaging', 'Logistics'],
        author: 'Elena Rodriguez',
        readTime: '4 min read',
        date: 'Oct 22, 2023',
        imageUrl: 'https://picsum.photos/seed/event1/800/600'
      }
    ];
  }
};

export const generateFullArticle = async (article: Article): Promise<string> => {
  try {
    const prompt = `
      Write a professional, in-depth magazine article (approx 500 words) based on this headline: "${article.title}".
      Category: ${article.category}.
      Summary context: ${article.summary}.
      Tags: ${article.tags?.join(', ')}.
      
      Style: Analytical, data-driven, professional tone suitable for logistics managers. 
      If related to Pharma/Cold Chain, emphasize GxP compliance and packaging technologies.
      Include subheadings.
      Format: Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Content generation failed.";
  } catch (error) {
    console.error("Error generating full article", error);
    return "## Service Unavailable\n\nWe are unable to generate the full article content at this moment. Please try again later.";
  }
};