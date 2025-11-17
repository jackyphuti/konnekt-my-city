'use client';

import { Newspaper, ExternalLink, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'politics' | 'sports' | 'business' | 'health' | 'technology' | 'entertainment';
  source: string;
  timestamp: string;
  likes: number;
  image?: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'New Infrastructure Development in Johannesburg CBD',
    summary:
      'The City of Johannesburg announced a new R500 million infrastructure development project aimed at improving public transport and pedestrian safety in the CBD.',
    category: 'politics',
    source: 'Johannesburg Council',
    timestamp: '2 hours ago',
    likes: 234,
    image: '🏗️',
  },
  {
    id: '2',
    title: 'South African Unemployment Rate Drops to 28.2%',
    summary:
      'According to the latest StatsSA report, the unemployment rate has decreased by 0.5% compared to the previous quarter, showing positive economic trends.',
    category: 'business',
    source: 'Statistics South Africa',
    timestamp: '4 hours ago',
    likes: 567,
  },
  {
    id: '3',
    title: 'Springboks Secure Victory in Rugby Championship',
    summary:
      'The South African rugby team defeated their opponents 28-24 in an exciting Rugby Championship match held at the Ellis Park Stadium.',
    category: 'sports',
    source: 'Sport News SA',
    timestamp: '6 hours ago',
    likes: 892,
  },
  {
    id: '4',
    title: 'New Hospital Opens in Rural Eastern Cape',
    summary:
      'A state-of-the-art healthcare facility has been opened in Mthatha, Eastern Cape, providing essential medical services to over 200,000 residents.',
    category: 'health',
    source: 'Department of Health',
    timestamp: '8 hours ago',
    likes: 456,
  },
  {
    id: '5',
    title: 'SA Tech Startup Secures $10 Million Funding',
    summary:
      'A Cape Town-based fintech startup has successfully raised $10 million in Series A funding to expand its services across the African continent.',
    category: 'technology',
    source: 'TechCrunch Africa',
    timestamp: '10 hours ago',
    likes: 678,
  },
  {
    id: '6',
    title: 'Local Artists Win International Awards',
    summary:
      'South African musicians and artists received recognition at the African Music Awards, celebrating the countryâ€™s vibrant creative industry.',
    category: 'entertainment',
    source: 'Entertainment Today',
    timestamp: '12 hours ago',
    likes: 345,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  politics: 'bg-red-100 text-red-800',
  sports: 'bg-green-100 text-green-800',
  business: 'bg-blue-100 text-blue-800',
  health: 'bg-purple-100 text-purple-800',
  technology: 'bg-orange-100 text-orange-800',
  entertainment: 'bg-pink-100 text-pink-800',
};

const CATEGORY_ICONS: Record<string, string> = {
  politics: '🏛️',
  sports: '⚽',
  business: '💼',
  health: '🏥',
  technology: '💻',
  entertainment: '🎬',
};

export function NewsWidget() {
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setLikedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredNews = selectedCategory
    ? NEWS_ARTICLES.filter((article) => article.category === selectedCategory)
    : NEWS_ARTICLES;

  const uniqueCategories = Array.from(
    new Set(NEWS_ARTICLES.map((article) => article.category))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Newspaper className="text-primary" />
          South Africa News
        </h2>
        <p className="text-muted-foreground">
          Latest news and updates from across South Africa
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          size="sm"
        >
          All News
        </Button>
        {uniqueCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {CATEGORY_ICONS[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <div className="space-y-3">
        {filteredNews.map((article) => (
          <Card key={article.id} className="p-4 hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
              {/* Image/Icon */}
              <div className="flex-shrink-0 w-20 h-20 bg-secondary/50 rounded-lg flex items-center justify-center text-2xl">
                {article.image || CATEGORY_ICONS[article.category]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base leading-snug hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <Badge className={`flex-shrink-0 ${CATEGORY_COLORS[article.category]}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="space-x-3 flex">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(article.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Heart
                        size={16}
                        className={
                          likedArticles.includes(article.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }
                      />
                      <span className="text-xs">
                        {likedArticles.includes(article.id)
                          ? article.likes + 1
                          : article.likes}
                      </span>
                    </button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                      <ExternalLink size={14} />
                      Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
