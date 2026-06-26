export const jobsKeys = {
  all: ["jobs"] as const,
  list: (queryString: string) => [...jobsKeys.all, "list", queryString] as const,
  detail: (id: string) => [...jobsKeys.all, "detail", id] as const,
  filters: () => [...jobsKeys.all, "filters"] as const,
  featured: () => [...jobsKeys.all, "featured"] as const,
};
