export enum Category {
  ALL = 'All',
  AIR_FREIGHT = 'Air Freight',
  OCEAN_FREIGHT = 'Ocean Freight',
  SUPPLY_CHAIN = 'Supply Chain',
  MARKET_INSIGHT = 'Market Insight',
  REGULATIONS = 'Regulations'
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: Category;
  author: string;
  readTime: string;
  date: string;
  imageUrl: string;
  tags?: string[]; // Added tags
  isFeatured?: boolean;
  content?: string; // Full content loaded on demand
}

export interface NewsletterForm {
  email: string;
  interests: Category[];
}