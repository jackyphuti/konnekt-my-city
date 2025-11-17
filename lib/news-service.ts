/**
 * News Service - Real news data fetching from multiple sources
 * Uses NewsAPI.org (requires free API key)
 * Fallback: Uses Bing News RSS for free access
 */

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timestamp: string;
  likes: number;
  image?: string;
  url: string;
  publishedAt: string;
}

/**
 * Fetch news using RSS feed parsing (free alternative)
 * This fetches latest news from South Africa
 */
export async function fetchSouthAfricaNews(): Promise<NewsArticle[]> {
  try {
    // Using Bing News RSS feed for South Africa (no API key needed)
    const rssUrl =
      'https://www.bing.com/news/search?q=South+Africa&rss';

    // Since we can't directly parse RSS in the browser, use a CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) {
      console.warn('RSS feed fetch failed, using mock data');
      return getMockNews();
    }

    const data = await response.json();

    // Parse XML from response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const articles: NewsArticle[] = [];

    items.forEach((item, idx) => {
      const title = item.querySelector('title')?.textContent || 'Untitled';
      const description =
        item.querySelector('description')?.textContent || 'No description';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '#';

      // Clean HTML from description
      const summary = description
        .replace(/<[^>]*>/g, '')
        .substring(0, 200) + '...';

      // Categorize based on keywords
      let category = 'general';
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('sport') || lowerTitle.includes('rugby'))
        category = 'sports';
      if (lowerTitle.includes('business') || lowerTitle.includes('economy'))
        category = 'business';
      if (lowerTitle.includes('health') || lowerTitle.includes('covid'))
        category = 'health';
      if (lowerTitle.includes('tech') || lowerTitle.includes('technology'))
        category = 'technology';
      if (
        lowerTitle.includes('entertainment') ||
        lowerTitle.includes('celebrity')
      )
        category = 'entertainment';
      if (lowerTitle.includes('police') || lowerTitle.includes('crime'))
        category = 'politics';

      articles.push({
        id: `news-${idx}`,
        title,
        summary,
        category,
        source: 'Bing News',
        timestamp: new Date(pubDate).toLocaleDateString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        likes: Math.floor(Math.random() * 1000),
        url: link,
        publishedAt: pubDate,
      });
    });

    return articles.slice(0, 10);
  } catch (error) {
    console.error('Error fetching news:', error);
    return getMockNews();
  }
}

/**
 * Fetch news from NewsAPI (requires API key)
 * Add your API key as environment variable: NEXT_PUBLIC_NEWS_API_KEY
 */
export async function fetchNewsFromNewsAPI(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NewsAPI key not configured');
    return getMockNews();
  }

  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.append('q', 'South Africa');
    url.searchParams.append('country', 'za');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', '10');
    url.searchParams.append('apiKey', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    const articles: NewsArticle[] = data.articles.map(
      (article: any, idx: number) => ({
        id: `news-${idx}`,
        title: article.title,
        summary: article.description || article.content,
        category: categorizeArticle(article.title),
        source: article.source.name,
        timestamp: new Date(article.publishedAt).toLocaleDateString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        likes: Math.floor(Math.random() * 1000),
        image: article.urlToImage,
        url: article.url,
        publishedAt: article.publishedAt,
      })
    );

    return articles;
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return getMockNews();
  }
}

/**
 * Categorize article based on title content
 */
function categorizeArticle(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sport') || lowerTitle.includes('rugby'))
    return 'sports';
  if (lowerTitle.includes('business') || lowerTitle.includes('economy'))
    return 'business';
  if (lowerTitle.includes('health') || lowerTitle.includes('covid'))
    return 'health';
  if (lowerTitle.includes('tech') || lowerTitle.includes('technology'))
    return 'technology';
  if (lowerTitle.includes('entertainment') || lowerTitle.includes('celebrity'))
    return 'entertainment';
  if (
    lowerTitle.includes('government') ||
    lowerTitle.includes('politics') ||
    lowerTitle.includes('president')
  )
    return 'politics';

  return 'general';
}

/**
 * Get mock news data (fallback)
 */
export function getMockNews(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'New Infrastructure Development in Johannesburg CBD',
      summary:
        'The City of Johannesburg announced a new R500 million infrastructure development project aimed at improving public transport and pedestrian safety in the CBD.',
      category: 'politics',
      source: 'City News',
      timestamp: '2 hours ago',
      likes: 234,
      url: '#',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'South African Unemployment Rate Update',
      summary:
        'According to the latest StatsSA report, economic indicators show changes in employment patterns across the country.',
      category: 'business',
      source: 'Business Report',
      timestamp: '4 hours ago',
      likes: 567,
      url: '#',
      publishedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Springboks Match Analysis',
      summary:
        'Expert analysis of the recent rugby match featuring the South African national team.',
      category: 'sports',
      source: 'Sport News SA',
      timestamp: '6 hours ago',
      likes: 892,
      url: '#',
      publishedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Cache news data in localStorage
 */
export function cacheNewsData(articles: NewsArticle[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(
    'newsCache',
    JSON.stringify({
      articles,
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Get cached news data
 */
export function getCachedNewsData(): NewsArticle[] | null {
  if (typeof window === 'undefined') return null;

  const cache = localStorage.getItem('newsCache');
  if (!cache) return null;

  const { articles, timestamp } = JSON.parse(cache);

  // Check if cache is older than 1 hour
  const cacheAge = Date.now() - new Date(timestamp).getTime();
  if (cacheAge < 60 * 60 * 1000) {
    return articles;
  }

  return null;
}
