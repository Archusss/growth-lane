import { useEbooks } from "@/hooks/use-ebooks";
import { EbookCard } from "@/components/EbookCard";
import { BookMarked, Search } from "lucide-react";
import { useState } from "react";

export default function Library() {
  const { data: ebooks, isLoading } = useEbooks();
  const [search, setSearch] = useState("");

  const filteredEbooks = ebooks?.filter((ebook) => 
    ebook.title.toLowerCase().includes(search.toLowerCase()) || 
    ebook.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">The Library</h1>
            <p className="text-lg text-neutral-500 max-w-xl">
              Explore our full collection of premium ebooks and resources.
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-[500px] border border-neutral-100"></div>
            ))}
          </div>
        ) : filteredEbooks && filteredEbooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-neutral-100 text-center px-4">
            <BookMarked className="w-16 h-16 text-neutral-200 mb-6" />
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No results found</h3>
            <p className="text-neutral-500">
              We couldn't find any ebooks matching "{search}". Try another search term.
            </p>
            <button 
              onClick={() => setSearch("")}
              className="mt-8 px-6 py-2.5 bg-neutral-100 text-neutral-900 font-medium rounded-full hover:bg-neutral-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
