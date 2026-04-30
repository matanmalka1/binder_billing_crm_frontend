type NS = string | readonly string[]
type AsArray<T extends NS> = T extends string
  ? readonly [T]
  : T extends readonly string[]
    ? T
    : never

export const createQueryKeys = <T extends NS>(namespace: T) => {
  const ns = (Array.isArray(namespace) ? namespace : [namespace]) as unknown as AsArray<T>
  return {
    all: ns,
    lists: () => [...ns, 'list' as const] as const,
    list: (params?: unknown) => [...ns, 'list' as const, params] as const,
    details: () => [...ns, 'detail' as const] as const,
    detail: (id: string | number) => [...ns, 'detail' as const, id] as const,
  }
}
