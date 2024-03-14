import { ProductSearchPayload } from "@/schema/productSchema";
import { Prisma } from "@prisma/client";
import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query"; // Import UseInfiniteQueryResult
import axios from "axios";

type ProductWithImagesPayload = Prisma.ProductGetPayload<{
  include: {
    images: true;
  };
}>;

export type Product = ProductWithImagesPayload;

export type UseProductListProps = {
  /** Delay to wait before fetching more items */
  fetchDelay?: number;
  debouncedValue?: string | undefined | null;
  selectedProduct?: string | undefined | null;
};

export function useProductList({
  fetchDelay = 0,
  debouncedValue,
  selectedProduct,
}: UseProductListProps = {}): UseInfiniteQueryResult<{
  nextCursor: string;
  data: ProductWithImagesPayload[];
}> {
  const query = useInfiniteQuery({
    queryKey: ["product", debouncedValue],
    queryFn: async ({ pageParam }) => {
      const payload: ProductSearchPayload = {
        name: debouncedValue as string,
        selectedId: selectedProduct as string,
        cursor: pageParam,
        limit: 2,
      };
      const { data } = await axios.get("/api/search/product", {
        params: payload,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    keepPreviousData: true,
  });

  return query
}
