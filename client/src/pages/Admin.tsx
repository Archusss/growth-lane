import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import {
  LayoutDashboard,
  Book,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { useEbooks, useCreateEbook, useUpdateEbook, useDeleteEbook } from "@/hooks/use-ebooks";
import { useContactMessages } from "@/hooks/use-contact";

export default function Admin() {
  const { data: user, isLoading: authLoading } = useUser();
  const [, setLocation] = useLocation();
  const { mutate: logout } = useLogout();
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "ebooks" | "messages">("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEbookId, setEditEbookId] = useState<number | null>(null);

  const { data: analytics } = useAnalyticsOverview();
  const { data: ebooks } = useEbooks();
  const { data: messages } = useContactMessages();

  const { mutate: createEbook, isPending: isCreating } = useCreateEbook();
  const { mutate: updateEbook, isPending: isUpdating } = useUpdateEbook();
  const { mutate: deleteEbook } = useDeleteEbook();

  if (authLoading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">Loading...</div>;

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleCreateEbook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createEbook(formData, {
      onSuccess: () => setIsCreateModalOpen(false)
    });
  };

  const handleUpdateEbook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editEbookId) return;
    const formData = new FormData(e.currentTarget);
    updateEbook({
      id: editEbookId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    }, {
      onSuccess: () => setEditEbookId(null)
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col h-auto md:min-h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900">Admin Panel</h2>
          <p className="text-sm text-neutral-500 mt-1">Welcome, {user.username}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === "dashboard" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("ebooks")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === "ebooks" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            <Book size={18} /> Manage Ebooks
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeTab === "messages" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            <MessageSquare size={18} /> Inbox
          </button>
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-left font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-sm font-semibold text-neutral-500 mb-2">Total Page Views</p>
                <p className="text-4xl font-extrabold text-neutral-900">{analytics?.pageViews?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-sm font-semibold text-neutral-500 mb-2">Unique Visitors</p>
                <p className="text-4xl font-extrabold text-neutral-900">{analytics?.uniqueVisitors?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-sm font-semibold text-neutral-500 mb-2">Total Ebooks</p>
                <p className="text-4xl font-extrabold text-neutral-900">{ebooks?.length || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ebooks" && (
          <div className="animate-in fade-in">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-neutral-900">Manage Ebooks</h1>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-full font-semibold hover:bg-neutral-800 transition-colors"
              >
                <Plus size={18} /> Add New Ebook
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-sm text-neutral-500 uppercase tracking-wider">
                      <th className="p-4 font-semibold">Title</th>
                      <th className="p-4 font-semibold">Views</th>
                      <th className="p-4 font-semibold">Downloads</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {ebooks?.map((ebook) => (
                      <tr key={ebook.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={ebook.coverImageUrl} alt="" className="w-10 h-10 rounded object-cover border border-neutral-200" />
                            <span className="font-semibold text-neutral-900">{ebook.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600">{ebook.viewCount}</td>
                        <td className="p-4 text-neutral-600">{ebook.downloadCount}</td>
                        <td className="p-4 text-neutral-600">
                          {ebook.createdAt && format(new Date(ebook.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setEditEbookId(ebook.id)}
                            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors inline-block"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm("Are you sure you want to delete this ebook?")) {
                                deleteEbook(ebook.id);
                              }
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors inline-block ml-2"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ebooks?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-500">No ebooks found. Add your first one!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="animate-in fade-in">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">Inbox</h1>
            <div className="space-y-4">
              {messages?.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{msg.name}</h3>
                      <div className="flex gap-4 text-sm text-neutral-500">
                        <a href={`mailto:${msg.email}`} className="hover:text-neutral-900">{msg.email}</a>
                        {msg.instagram && <span>IG: {msg.instagram}</span>}
                      </div>
                    </div>
                    <span className="text-sm text-neutral-400">
                      {msg.timestamp && format(new Date(msg.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="text-neutral-700 bg-neutral-50 p-4 rounded-xl whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))}
              {messages?.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
                  <MessageSquare className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p className="text-neutral-500 font-medium">No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">Upload New Ebook</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleCreateEbook} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Title</label>
                  <input type="text" name="title" required className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900" placeholder="Ebook Title" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Description</label>
                  <textarea name="description" required rows={4} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" placeholder="What is this ebook about?"></textarea>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">Cover Image</label>
                    <div className="relative border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:bg-neutral-50 transition-colors cursor-pointer group">
                      <input type="file" name="coverImage" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <ImageIcon className="mx-auto h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mb-2 transition-colors" />
                      <span className="text-sm font-medium text-neutral-600">Select Image</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">PDF File</label>
                    <div className="relative border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:bg-neutral-50 transition-colors cursor-pointer group">
                      <input type="file" name="pdf" accept="application/pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <FileText className="mx-auto h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mb-2 transition-colors" />
                      <span className="text-sm font-medium text-neutral-600">Select PDF</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">Cancel</button>
                  <button type="submit" disabled={isCreating} className="px-8 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors">
                    {isCreating ? "Uploading..." : "Publish Ebook"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editEbookId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">Edit Ebook Info</h2>
              <button onClick={() => setEditEbookId(null)} className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {(() => {
                const ebookToEdit = ebooks?.find(e => e.id === editEbookId);
                if(!ebookToEdit) return null;
                return (
                  <form onSubmit={handleUpdateEbook} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Title</label>
                      <input type="text" name="title" defaultValue={ebookToEdit.title} required className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Description</label>
                      <textarea name="description" defaultValue={ebookToEdit.description} required rows={5} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"></textarea>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                      <button type="button" onClick={() => setEditEbookId(null)} className="px-6 py-3 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">Cancel</button>
                      <button type="submit" disabled={isUpdating} className="px-8 py-3 bg-neutral-900 text-white rounded-full font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors">
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
