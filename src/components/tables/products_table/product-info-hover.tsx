import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { CalendarIcon, HelpCircle } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { ProductColumnDef } from "./schema";
import notFoundImage from "@/public/product-not-found.jpg"
import Image from "next/image";


type ProductInfoHoverProps = {
  product: ProductColumnDef
};

export const ProductInfoHover: FC<ProductInfoHoverProps> = ({ product }) => {
  const firstProductImage = product.images?.media?.length && product.images.media.length > 0 ? product.images.media[0] : null;
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
            src={firstProductImage?.url || notFoundImage.src}
            alt={product.name}
            width={100}
            height={100}
            blurDataURL={notFoundImage.blurDataURL}
            className="w-28 h-28 object-contain ring-1 rounded-md shadow-md p-1 bg-white ring-gray-900/10 "
          />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              <Link href={`/products/${product.id}`}>
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