import { Link } from "wouter";
import { ArrowRight, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { useEbooks } from "@/hooks/use-ebooks";
import { EbookCard } from "@/components/EbookCard";

export default function Home() {
  const { data: ebooks, isLoading } = useEbooks();
  const featured = ebooks?.slice(0, 3) || [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex items-center min-h-[85vh]">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-100/50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 font-medium text-xs mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles size={14} className="text-neutral-500" />
            <span>Premium resources for continuous growth</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 mb-8 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-6 delay-150 fill-mode-both">
            Accelerate your <span className="text-gradient">personal growth</span> journey.
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-300 fill-mode-both">
            Curated ebooks, guides, and playbooks to help you build habits, scale your business, and unlock your ultimate potential.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 delay-500 fill-mode-both">
            <Link 
              href="/library" 
              className="px-8 py-4 rounded-full bg-neutral-900 text-white font-semibold text-lg hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-neutral-900/20 flex items-center gap-2"
            >
              Browse Library <ArrowRight size={18} />
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 rounded-full bg-white text-neutral-900 border-2 border-neutral-200 font-semibold text-lg hover:border-neutral-900 hover:bg-neutral-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Featured Resources</h2>
              <p className="text-neutral-500 max-w-xl text-lg">
                Hand-picked ebooks that our community finds most valuable. Start your reading here.
              </p>
            </div>
            <Link 
              href="/library" 
              className="text-neutral-900 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all ebooks <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-[500px] border border-neutral-100"></div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((ebook) => (
                <EbookCard key={ebook.id} ebook={ebook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-neutral-100">
              <BookOpen className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900">No ebooks yet</h3>
              <p className="text-neutral-500 mt-2">Check back later for new releases.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Value Prop */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto text-neutral-900 mb-8" />
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Read. Apply. Grow.</h2>
          <p className="text-xl text-neutral-500 leading-relaxed">
            We believe that the right knowledge at the right time changes everything. 
            Growth Lane is dedicated to curating high-signal, zero-fluff resources 
            that you can implement immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
