export const BUSINESS_QUERY_OPTIONS = {
  list: {
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  firstBusiness: {
    staleTime: 60_000,
    pageSize: 1,
  },
} as const;
