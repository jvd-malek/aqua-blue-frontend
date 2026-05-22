import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aquablueiran.com';

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products?limit=1000`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

async function getArticles() {
  try {
    const res = await fetch(`${API_URL}/articles?limit=1000`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getProducts(), getArticles()]);
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/category/ماهی`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/آکواریوم`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/غذا`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/category/لوازم جانبی`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(product.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  const articlePages: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${SITE_URL}/blog/${article.id}`,
    lastModified: new Date(article.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  return [...staticPages, ...productPages, ...articlePages];
}