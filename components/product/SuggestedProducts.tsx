import { serverFetch } from '@/lib/server-fetch';
import ProductSliderSection from '../home/ProductSliderSection';

type Props = {
  currentId: string;
  majorCat?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api';
const UPLOADS_URL = API_URL.replace('/api', '') + '/uploads';

export default async function SuggestedProducts({ currentId, majorCat }: Props) {
  if (!majorCat) return null;

  const res = await serverFetch<{ items: any[] }>(`/products?majorCat=${encodeURIComponent(majorCat)}&limit=10`);
  const products = res.success ? res.data?.items || [] : [];
  const filtered = products.filter(p => p.id !== currentId).slice(0, 8);

  if (filtered.length === 0) return null;

  return (
    <ProductSliderSection title='محصولات مشابه' products={filtered} page/>
  );
}