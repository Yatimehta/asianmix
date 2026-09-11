import { redirect } from 'next/navigation';

export default function CollectionSlugPage({ params }: { params: { slug: string } }) {
  redirect(`/products?category=${encodeURIComponent(params.slug)}`);
}
