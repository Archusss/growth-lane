import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useSubmitContact } from "@/hooks/use-contact";

export default function Contact() {
  const { mutate: submitContact, isPending } = useSubmitContact();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitContact(
      {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        instagram: formData.get("instagram") as string || undefined,
        message: formData.get("message") as string,
      },
      {
        onSuccess: () => setIsSuccess(true),
      }
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-900/5 overflow-hidden flex flex-col md:flex-row border border-neutral-100">
          
          {/* Info Side */}
          <div className="w-full md:w-5/12 bg-neutral-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Let's connect.</h2>
              <p className="text-neutral-300 leading-relaxed mb-12">
                Have questions about our resources? Want to partner up? Or just want to share your growth journey? Drop us a line.
              </p>
            </div>
            
            <div className="relative z-10 space-y-6 text-sm text-neutral-400">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-white">Email</span>
                <span>hello@growthlane.com</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-white">Social</span>
                <span>@growthlane</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-7/12 p-12 lg:p-16">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold text-neutral-900 mb-4">Message Sent!</h3>
                <p className="text-neutral-500 mb-8 max-w-sm">
                  Thanks for reaching out. We'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 font-medium rounded-full hover:bg-neutral-200 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-semibold text-neutral-900 mb-2">Instagram <span className="text-neutral-400 font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    id="instagram" 
                    name="instagram"
                    className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    placeholder="@johndoe"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-900 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    rows={4}
                    className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="mt-4 w-full flex justify-center items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? "Sending..." : "Send Message"}
                  {!isPending && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
