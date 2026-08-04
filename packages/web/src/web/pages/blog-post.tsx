import { Link, useParams, Redirect } from "wouter";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Seo } from "../components/seo";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { WhatsappFloat } from "../components/whatsapp-float";
import { LeadQuiz } from "../components/quiz/lead-quiz";
import { getPost, posts } from "../data/posts";
import { site } from "../lib/site";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);

  if (!post) return <Redirect to="/blog" />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.keyword,
    articleSection: post.category,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Kamillo Santos",
      jobTitle: "Gestor de Tráfego Sênior",
      url: site.url,
    },
    publisher: { "@type": "Person", name: "Kamillo Santos", url: site.url },
  };

  return (
    <>
      <Seo
        title={post.metaTitle}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        keywords={[post.keyword, "marketing digital", "Kamillo Santos"]}
        jsonLd={jsonLd}
      />
      <Header />
      <main className="pt-28 pb-24">
        <article className="container-x max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[#60a5fa] text-sm no-underline mb-6"
          >
            <ArrowLeft size={15} /> Todos os artigos
          </Link>

          <span className="chip">{post.category}</span>
          <h1 className="mt-4 text-[clamp(1.9rem,4.5vw,2.8rem)] font-extrabold text-white leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-[#6f7fa3] text-[0.85rem]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readingTime} min de leitura
            </span>
            <span>Por Kamillo Santos</span>
          </div>

          <div className="divider-line my-8" />

          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />

          <LeadQuiz articleTitle={post.title} />
        </article>

        <div className="container-x max-w-3xl mt-16">
          <h4 className="text-white font-bold text-lg mb-5">Continue lendo</h4>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="glass card-hover rounded-xl p-6 no-underline"
              >
                <span className="text-[#22d3ee] text-[0.78rem] font-semibold uppercase tracking-wide">
                  {p.category}
                </span>
                <h5 className="mt-2 text-white font-semibold leading-snug">{p.title}</h5>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[#60a5fa] text-sm font-semibold">
                  Ler <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  );
}
