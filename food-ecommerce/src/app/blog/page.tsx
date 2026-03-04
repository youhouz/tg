import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Recettes et conseils vanille',
  description: 'Decouvrez nos recettes a la vanille, conseils d\'utilisation et actualites du monde de la vanille.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="section-title mb-3">Blog & Recettes</h1>
        <p className="text-earth-600 max-w-xl mx-auto">
          Recettes gourmandes, conseils d&apos;utilisation et actualites du monde de la vanille.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-earth-500 py-12">Aucun article pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card group">
              <div className="h-48 bg-earth-100 flex items-center justify-center">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📝</span>
                )}
              </div>
              <div className="p-5">
                {post.publishedAt && (
                  <p className="text-xs text-earth-500 mb-2">{formatDate(post.publishedAt)}</p>
                )}
                <h2 className="font-serif font-semibold text-lg text-earth-900 group-hover:text-earth-700 transition-colors mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-earth-600 line-clamp-3">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
