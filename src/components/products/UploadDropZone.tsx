import useFileUpload from "@/lib/hooks/useFileUpload";
import { useToast } from "../ui/use-toast";
import { useProductImages, useUploadedFileMeta } from "@/store/index";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { productFormSchema } from "@/schema/productSchema";
import { useDropzone } from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { z } from "zod";

export const UploadDropzone = () => {
  const { toast } = useToast()
  const { upload, isError } = useFileUpload();
  const { images, setImages } = useProductImages()
  const { addFile, files } = useUploadedFileMeta()

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const { getValues, setError, register, setValue, } = useFormContext<z.infer<typeof productFormSchema>>();


  useEffect(() => {
    const validImages = productFormSchema.shape.productImages.safeParse(images)
    if (!validImages.success) {
      setError('productImages', {
        type: 'manual',
        message: 'You can only upload up to 10 images',
      });
    } else {
      setValue('productImages', images, {
        shouldValidate: true,
      });
    }

  }, [getValues, images, files, setError, setValue]);

  const startSimulatedProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval)
          return prevProgress
        }
        return prevProgress + 5
      })
    }, 500)

    return interval
  }
  const { getRootProps, getInputProps, acceptedFiles, fileRejections, } = useDropzone({
    accept: {
      'image/*': []
    },
    disabled: isUploading,
    multiple: true,
    maxFiles: 10,
    maxSize: 2000 * 2000,
    onDrop: async (acceptedFile, fileRejections) => {
      if (images.length === 0 || images.length - 1 < 9) {
        if (fileRejections && fileRejections[0]) {
          return toast({
            title: `${fileRejections[0].file.name} Upload Failed`,
            description: `Only images are allowed`,
            variant: "destructive",
          });
        }

        if (acceptedFile.length === 0) {
          return toast({
            title: "Upload failed",
            description: "Only jpg, png, svg images are allowed.",
            variant: "destructive",
          });
        }
        if (acceptedFile[0] instanceof Blob) {
          setIsUploading(true)
          const progressInterval = startSimulatedProgress()
          const res = await upload({ files: acceptedFile });

          if (!res?.data.files) {
            clearInterval(progressInterval)
            setUploadProgress(95)
            setIsUploading(false)
          }
          if (res?.data.files) {
            setImages(acceptedFile);
            addFile(res?.data.files);
          }


          await new Promise((resolve) => setTimeout(resolve, 500));
          clearInterval(progressInterval)
          setUploadProgress(100)
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setIsUploading(false)
        }
      } else {
        setError("productImages", {
          type: "manual",
          message: "You can only upload up to 10 images"
        })
      }
    }
  })

  return (
    <>
      <div
        {...getRootProps()}
        className='border h-64  border-dashed border-gray-300 rounded-lg'>
        <div className='flex items-center justify-center h-full w-full'>
          <label
            htmlFor=''
            className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
              <p className='mb-2 text-sm text-zinc-700'>
                <span className='font-semibold'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className='text-xs text-zinc-500'>
                Image (up to 4 MB)
              </p>
            </div>
            {acceptedFiles && acceptedFiles[0] && isUploading ?
              (<div className={cn('max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-100 divide-x divide-zinc-200')}>
                <div className='px-3 py-2 h-full grid gap-2 place-items-center'>
                  <File className='h-4 w-4 text-blue-500' />
                </div>
                <div className='px-3 py-2 h-full text-sm truncate'>
                  {acceptedFiles[0].name}
                </div>
              </div>)
              : null}

            {isUploading ? (
              <div className='w-full mt-4 max-w-xs mx-auto'>
                <Progress
                  indicatorColor={
                    isError ? 'bg-red-500' :
                      uploadProgress === 100 ? 'bg-green-500' : ''
                  }
                  value={uploadProgress}
                  className='h-1 w-full bg-zinc-200'
                />
                {uploadProgress === 100 ? (
                  <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                    <Loader2 className='h-3 w-3 animate-spin' />
                    uploading...
                  </div>
                ) : null}
              </div>
            ) : null}

            <input
              {...getInputProps()}
              {...register("productImages")}
              type='file'
              id='dropzone-file'
              className='hidden'

            />
          </label>
        </div>
      </div>
    </>
  )
}