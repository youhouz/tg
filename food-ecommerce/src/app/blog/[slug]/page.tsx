import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Article introuvable' };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true },
  });

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-earth-500 mb-6" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-earth-700">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-earth-700">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-earth-900">{post.title}</span>
      </nav>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
      )}

      {post.publishedAt && (
        <p className="text-sm text-earth-500 mb-3">{formatDate(post.publishedAt)}</p>
      )}

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-earth-900 mb-6">{post.title}</h1>

      <div className="prose prose-earth max-w-none text-earth-700 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-12 pt-8 border-t border-earth-200">
        <Link href="/blog" className="btn-secondary">
          &larr; Retour au blog
        </Link>
      </div>
    </article>
  );
}
