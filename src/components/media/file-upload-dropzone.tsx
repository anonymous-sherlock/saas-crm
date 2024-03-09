import { UploadThingEndpoint } from '@/types'
import { Cloud, FileIcon, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import React, { FC, useState } from 'react'
import { Button } from '../ui/button'
import { Accept, FileRejection, FileWithPath, useDropzone } from 'react-dropzone'
import { useUploadThing } from '@/lib/uploadthing'
import { toast } from 'sonner'
import { cn, formatBytes } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { MediaFormType } from '@/schema/media.schema'
import { Progress } from '../ui/progress'
import { deleteMediaFromUT } from '@/lib/actions/media.action'

interface FileUploadDropzoneProps {
    apiEndpoint: UploadThingEndpoint
    value?: string
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    accept?: Accept
}

const FileUploadDropzone: FC<FileUploadDropzoneProps> = ({ apiEndpoint, value,
    accept = {
        "image/*": [],
    },
    maxSize = 1024 * 1024 * 4,
    maxFiles = 1,
    disabled = false,
}) => {
    const type = value?.split('.').pop()
    const { setValue, getValues, reset, } = useFormContext<MediaFormType>()
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const { startUpload, isUploading } = useUploadThing(apiEndpoint, {
        onClientUploadComplete: (res) => {
            console.log(res)
            setValue("key", res?.[0].key)
            setValue("originalFileName", res?.[0].name)
            setValue("type", res?.[0].type)
            setValue("size", res?.[0].size.toString())
            setValue("url", res?.[0].url)
        },
        onUploadProgress(p) {
            setUploadProgress(p)
        },
        onUploadError(err) {
            console.log(err.message)
        }
    })
    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            acceptedFiles.forEach(async (file) => {
                const res = await startUpload(acceptedFiles)
                console.log(res)
            })
            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ errors }) => {
                    if (errors[0]?.code === "file-too-large") {
                        toast.error(
                            `File is too large. Max size is ${formatBytes(maxSize)}`
                        )
                        return
                    }
                    errors[0]?.message && toast.error(errors[0].message)
                })
            }
        },

        [maxSize, startUpload]
    )
    const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        multiple: maxFiles > 1,
        disabled,
    })

    async function handleRemoveFile() {
        const key = getValues("key")
        const name = getValues("name")
        if (!key) {
            toast.error("File not found")
        }
        await deleteMediaFromUT(key).then((data) => {
            toast.success(data.success)
            reset({ name: name, key: "", originalFileName: "", size: "", type: "", url: "" })
        })
    }
    if (value) {
        return (
            <div className={cn('border h-64 border-dashed border-gray-300 rounded-lg bg-gray-50',)}>
                <div className="flex flex-col justify-center items-center h-full">
                    {type !== 'pdf' ? (
                        <div className="relative w-40 h-40">
                            <Image
                                src={value}
                                alt="uploaded image"
                                className="object-contain"
                                fill
                                sizes='400px'
                                priority
                                quality={80}
                            />
                        </div>
                    ) : (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon />
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener_noreferrer"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                View PDF
                            </a>
                        </div>
                    )}
                    <Button onClick={handleRemoveFile} variant="destructive" type="button" >
                        <X className="h-4 w-4" />
                        Remove File
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div  {...getRootProps()} className={cn('border h-64 border-dashed border-gray-300 rounded-lg', isDragActive && "border-muted-foreground/50 bg-fuchsia-100",)}>
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
                            Image (up to {formatBytes(maxSize)})
                        </p>

                        {isUploading ? (
                            <div className='w-full mt-4 max-w-xs mx-auto'>
                                <Progress
                                    indicatorColor={cn("", uploadProgress === 100 && "bg-green-500")}
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

                    </div>
                </label>
            </div>
            <input {...getInputProps()} />
        </div>
    )
}

export default FileUploadDropzone