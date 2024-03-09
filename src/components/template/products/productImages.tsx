"use client"
import { FileDialog } from '@/components/file-dialog'
import { Zoom } from '@/components/zoom-image'
import { productFormSchema } from '@/schema/productSchema'
import { FileWithPreview } from '@/types'
import { FormControl, FormItem, FormLabel, UncontrolledFormMessage } from '@/ui/form'
import { File as FileIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

interface ProductImagesUploaderProps {
    files: FileWithPreview[] | null
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
}

export const ProductImagesUploader = ({ files, setFiles }: ProductImagesUploaderProps) => {

    const { control, register, setValue, formState } = useFormContext<z.infer<typeof productFormSchema>>();


    return (
        <div className='flex flex-col gap-4'>
            <FormItem className="flex w-full flex-col gap-1.5 col-span-2  justify-end">
                <FormLabel>Upload Product Images</FormLabel>
                <FormControl>
                    <FileDialog
                        setValue={setValue}
                        name="productImages"
                        maxFiles={10}
                        maxSize={1024 * 1024 * 4}
                        files={files}
                        setFiles={setFiles}
                        accept={{
                            "application/pdf": [],
                            "image/*": []
                        }}
                        labelText='Upload Product Images'
                        triggerStyle='Card'
                        triggerFileDrop
                    />
                </FormControl>
                <UncontrolledFormMessage
                    message={formState.errors.productImages?.message}
                />
            </FormItem>

            {files?.length ? (
                <div className="flex items-center justify-start flex-wrap gap-2 w-full">
                    {files.map((file, i) => (
                        <React.Fragment key={i}>
                            {
                                !file.type.startsWith("image") ?
                                    <div className='border border-gray-200 px-4 py-2 h-full rounded-md grid gap-2 place-items-center'>
                                        <FileIcon className='h-7 w-7 text-blue-500 m-2' />
                                    </div> :
                                    <Zoom key={i}>
                                        <Image
                                            src={file.preview}
                                            alt={file.name}
                                            className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                                            width={80}
                                            height={80}
                                        />
                                    </Zoom>
                            }
                        </React.Fragment>
                    ))}
                </div>
            ) : null}
        </div>
    );
};