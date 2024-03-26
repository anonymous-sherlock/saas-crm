import { trpc } from "@/app/_trpc/client";

export type UseProductListProps = {
  /** Delay to wait before fetching more items */
  fetchDelay?: number;
  debouncedValue?: string | undefined | null;
  selectedProduct?: string | undefined | null;
  userId: string;
};

export function useProductList({ fetchDelay = 0, debouncedValue, selectedProduct, userId }: UseProductListProps) {
  const query = trpc.search.getProducts.useInfiniteQuery({ limit: 10, q: debouncedValue, userId: userId }, { getNextPageParam: (lastPage) => lastPage.nextCursor });

  return query;
}
