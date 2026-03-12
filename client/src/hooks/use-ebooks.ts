import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useEbooks() {
  return useQuery({
    queryKey: [api.ebooks.list.path],
    queryFn: async () => {
      const res = await fetch(api.ebooks.list.path);
      if (!res.ok) throw new Error("Failed to fetch ebooks");
      return api.ebooks.list.responses[200].parse(await res.json());
    },
  });
}

export function useEbook(id: number) {
  return useQuery({
    queryKey: [api.ebooks.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.ebooks.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch ebook");
      return api.ebooks.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateEbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Multipart form data, intentionally not using JSON headers
      const res = await fetch(api.ebooks.create.path, {
        method: api.ebooks.create.method,
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create ebook");
      }
      return api.ebooks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ebooks.list.path] });
    },
  });
}

export function useUpdateEbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, description }: { id: number; title?: string; description?: string }) => {
      const url = buildUrl(api.ebooks.update.path, { id });
      const payload = api.ebooks.update.input.parse({ title, description });
      const res = await fetch(url, {
        method: api.ebooks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update ebook");
      return api.ebooks.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.ebooks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.ebooks.get.path, variables.id] });
    },
  });
}

export function useDeleteEbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.ebooks.delete.path, { id });
      const res = await fetch(url, {
        method: api.ebooks.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete ebook");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ebooks.list.path] });
    },
  });
}

export function useTrackEbookView() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.ebooks.trackView.path, { id });
      const res = await fetch(url, { method: api.ebooks.trackView.method });
      if (!res.ok) throw new Error("Failed to track view");
      return api.ebooks.trackView.responses[200].parse(await res.json());
    },
  });
}
