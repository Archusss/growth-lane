import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Download, Eye, Calendar } from "lucide-react";
import { useEbook, useTrackEbookView } from "@/hooks/use-ebooks";
import { format } from "date-fns";

export default function EbookDetail() {
  const { id } = useParams();
  const ebookId = parseInt(id || "0", 10);
  
  const { data: ebook, isLoading } = useEbook(ebookId);
  const { mutate: trackView } = useTrackEbookView();

  useEffect(() => {
    if (ebookId && ebook) {
      trackView(ebookId);
    }
  }, [ebookId, !!ebook, trackView]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-4 max-w-6xl mx-auto flex gap-12 animate-pulse">
        <div className="w-1/3 bg-neutral-200 rounded-2xl aspect-[3/4]"></div>
        <div className="w-2/3 space-y-6 pt-12">
          <div className="h-12 bg-neutral-200 rounded-lg w-3/4"></div>
          <div className="h-32 bg-neutral-200 rounded-lg w-full"></div>
          <div className="h-12 bg-neutral-200 rounded-full w-48 mt-12"></div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Ebook Not Found</h2>
        <p className="text-neutral-500 mb-8">The resource you're looking for doesn't exist or has been removed.</p>
        <Link href="/library" className="px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/library" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-medium mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Library
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Cover Image */}
          <div className="w-full lg:w-5/12 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-neutral-900/10 border border-neutral-100 aspect-[4/5] sticky top-32">
              <img 
                src={ebook.coverImageUrl} 
                alt={ebook.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="w-full lg:w-7/12 pt-4">
            <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 mb-6">
              <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full">
                <Calendar size={14} />
                {ebook.createdAt ? format(new Date(ebook.createdAt), "MMMM d, yyyy") : "Recently"}
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-full">
                <Eye size={14} />
                {ebook.viewCount.toLocaleString()} Views
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 mb-8 leading-tight tracking-tight">
              {ebook.title}
            </h1>
            
            <div className="prose prose-lg prose-neutral mb-12">
              <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {ebook.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 border-t border-neutral-100 pt-10">
              <a 
                href={ebook.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-900 rounded-full font-bold text-lg hover:border-neutral-900 hover:bg-neutral-50 transition-all"
              >
                Read Online
              </a>
              <a 
                href={`/api/ebooks/${ebook.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-lg hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 hover:-translate-y-0.5 transition-all"
              >
                <Download size={20} />
                Download PDF
              </a>
            </div>
            
            <p className="text-center sm:text-left text-sm text-neutral-400 mt-6 flex items-center justify-center sm:justify-start gap-1">
              Downloaded {ebook.downloadCount.toLocaleString()} times
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
