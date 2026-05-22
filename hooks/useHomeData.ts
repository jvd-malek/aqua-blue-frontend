const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';

async function getProducts(majorCat: string, limit: number = 20) {
  try {
    const res = await fetch(`${API_URL}/products?majorCat=${encodeURIComponent(majorCat)}&limit=${limit}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch { 
    return []; 
  }
}

async function getArticles(limit: number = 12) {
  try {
    const res = await fetch(`${API_URL}/articles?limit=${limit}&sortBy=newest`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch { 
    return []; 
  }
}

export async function useHomeData() {
  const [fishProducts, aquariumProducts, foodProducts, accessoryProducts, articles] = await Promise.all([
    getProducts('ماهی'),
    getProducts('آکواریوم'),
    getProducts('غذا'),
    getProducts('لوازم جانبی'),
    getArticles(12),
  ]);

  return {
    products: { fishProducts, aquariumProducts, foodProducts, accessoryProducts },
    articles,
  };
}