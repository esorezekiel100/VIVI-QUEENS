import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';

export const JournalPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journal')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .catch(err => console.error('Error fetching journal:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      
      {/* Header */}
      <section className="py-24 bg-[#1A1412] text-[#FAF8F5] text-center border-b border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
            TIPS & ARTICLES
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight mt-2 text-white">
            Style Tips
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/80 font-sans max-w-xl mx-auto leading-relaxed">
            Simple tips on choosing and caring for your clothes.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-sm font-serif">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-[#1A1412]/10 overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-[#1A1412]/90 text-[#FAF8F5] text-[10px] uppercase tracking-widest px-2.5 py-1">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Zero-Pill unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#1A1412]/60 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        {post.publishedAt}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-medium text-[#1A1412] group-hover:text-[#C5A880] transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="mt-3 text-xs sm:text-sm text-[#1A1412]/75 leading-relaxed font-sans line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-4 border-t border-[#1A1412]/5 flex items-center justify-between">
                  <span className="text-xs text-[#1A1412]/60 font-sans italic">
                    By {post.author}
                  </span>
                  <button
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#1A1412] group-hover:text-[#C5A880] transition-colors cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Post Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FAF8F5] text-[#1A1412] p-6 sm:p-12 shadow-2xl border border-[#C5A880]/30 my-8">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-6 right-6 text-[#1A1412]/60 hover:text-[#1A1412] p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                  {activePost.category} · {activePost.readTime}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1412] mt-2 leading-tight">
                  {activePost.title}
                </h2>
                <p className="text-xs text-[#1A1412]/50 mt-1">
                  Published {activePost.publishedAt} by {activePost.author}
                </p>
              </div>

              <div className="border border-[#1A1412]/10 overflow-hidden">
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>

              <div className="text-sm sm:text-base text-[#1A1412]/80 leading-relaxed font-sans space-y-4 pt-2 border-t border-[#1A1412]/10">
                <p className="font-serif italic text-lg text-[#1A1412] border-l-2 border-[#C5A880] pl-4">
                  {activePost.excerpt}
                </p>
                <p>
                  {activePost.content}
                </p>
              </div>

              <div className="pt-6 border-t border-[#1A1412]/10 flex justify-end">
                <button
                  onClick={() => setActivePost(null)}
                  className="px-6 py-2.5 bg-[#1A1412] text-[#FAF8F5] text-xs uppercase tracking-widest hover:bg-[#2D2420]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
