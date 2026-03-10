import { Link } from "wouter";
import { Download, Eye } from "lucide-react";
import type { Ebook } from "@shared/schema";

export function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden card-hover flex flex-col h-full">
      <Link href={`/ebook/${ebook.id}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img
          src={ebook.coverImageUrl}
          alt={ebook.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-white font-medium flex items-center gap-2">
            Read More <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/ebook/${ebook.id}`} className="block flex-1">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 leading-tight group-hover:text-neutral-700 transition-colors">
            {ebook.title}
          </h3>
          <p className="text-neutral-500 text-sm line-clamp-3 leading-relaxed mb-6">
            {ebook.description}
          </p>
        </Link>
        
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
            <div className="flex items-center gap-1.5" title="Views">
              <Eye size={14} />
              {ebook.viewCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5" title="Downloads">
              <Download size={14} />
              {ebook.downloadCount.toLocaleString()}
            </div>
          </div>
          
          <a
            href={`/api/ebooks/${ebook.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-neutral-50 text-neutral-600 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors"
            title="Download PDF"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
