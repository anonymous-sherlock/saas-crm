import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import notFoundImage from "@/public/product-not-found.jpg";
import { Product, ProductImage } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type ProductInfoHoverProps = {
  product: Pick<
    Product & {
      images: ProductImage[];
    },
    "name" | "description" | "price" | "productId" | "images" | "createdAt"
  >;
};

export const ProductInfoHover: FC<ProductInfoHoverProps> = ({ product }) => {
  const firstProductImage = product.images[0];
  return (
    <HoverCard closeDelay={200} openDelay={300}>
      <HoverCardTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full p-1 h-6 w-6"
        >
          <HelpCircle size={14} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[370px]" side="bottom">
        <div className="flex justify-start space-x-4">
          <Image
            src={firstProductImage?.url.toString() || notFoundImage.src}
            alt={product.name}
            width={100}
            height={100}
            blurDataURL={notFoundImage.blurDataURL}
            className="w-28 h-28 object-contain ring-1 rounded-md shadow-md p-1 bg-white ring-gray-900/10 "
          />

          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              <Link href={`/products/${product.productId}`}>
                {product.name}
              </Link>
            </h4>
            <p className="text-sm  line-clamp-3 whitespace-pre-line ">
              {product.description}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Uploaded {format(product.createdAt, 'MMMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};