"use client"
import { cn } from '@/lib/utils'
import { useProductImages } from '@/store/index'
import { ProductImage } from '@prisma/client'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import { UploadDropzone } from './UploadDropZone'






type DragnDropProps = {
  productImages?: ProductImage[];
};

const DragnDrop = ({ productImages }: DragnDropProps) => {
  const { images, removeImage, } = useProductImages();





  return (
    <>
      <UploadDropzone />

      <div className={cn("hidden  w-full grid-cols-3 gap-4 rounded-md border-2 border-solid bg-gray-50 p-2",
        (images.length > 0) && "grid", (productImages && productImages?.length > 0) && "grid"
      )}>
        {productImages && productImages.length > 0 && (
          // Corrected braces here
          productImages.map((img, idx) => (
            <div key={img.id} className="bg-gray-black group relative w-full rounded-md" style={{ width: "100%", height: "100px" }}>
              <Image width={50} height={50} src={img.url} alt="cover" className="absolute h-full w-full object-cover transition-transform duration-300" />
              <span className={cn("absolute right-0 top-2 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive duration-300 group-hover:flex")}>
                <Trash width={"50%"} className='text-destructive!' color='red' />
              </span>
            </div>
          ))
        )}

        {images.length > 0 && (
          // Corrected braces here
          images.map((image, idx) => (
            <div key={idx} className="bg-gray-black group relative w-full rounded-md" style={{ width: "100%", height: "100px" }}>
              <Image width={50} height={50} src={URL.createObjectURL(image)} alt="cover" className="absolute h-full w-full object-cover transition-transform duration-300" />
              <span
                className={cn("absolute right-0 top-2 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive duration-300 group-hover:flex")}
                onClick={() => {
                  removeImage(image);
                }}
              >
                <Trash width={"50%"} className='text-destructive!' color='red' />
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};


export default DragnDrop