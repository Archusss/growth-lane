import { useState } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { useLogin, useUser } from "@/hooks/use-auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();
  const { data: user } = useUser();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl shadow-neutral-900/5 border border-neutral-100 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-900">
          <Lock size={28} />
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Admin Access</h2>
        <p className="text-neutral-500 mb-8">Sign in to manage Growth Lane</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
              {error.message || "Invalid credentials"}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
