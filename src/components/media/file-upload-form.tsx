"use client"
import { MediaFormType, mediaFormSchema } from '@/schema/media.schema'
import { UploadThingEndpoint } from '@/types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import FileUploadDropzone from './file-upload-dropzone'
import { createMedia } from '@/lib/actions/media.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/modal-provider'
import { Icons } from '@/components/Icons'
import { trpc } from '@/app/_trpc/client'

interface FileUploadDialogProps {
  endpoint?: UploadThingEndpoint
}


export const FileUploadDialog: FC<FileUploadDialogProps> = ({ }) => {
  const router = useRouter()
  const { setClose } = useModal()
  const [isPending, startTransition] = React.useTransition()
  const utils = trpc.useUtils()
  const form = useForm<MediaFormType>({
    resolver: zodResolver(mediaFormSchema),
    mode: 'all',
    defaultValues: {
      key: '',
      name: '',
      url: '',
      size: '',
      type: '',
      originalFileName: ''
    },
  })

  async function onSubmit(values: MediaFormType) {
    startTransition(async () => {
      try {
        const response = await createMedia(values)
        utils.media.getMedia.invalidate()
        setClose()
        form.reset()
        toast("Succes", { description: 'Uploaded media' })
        router.refresh()
      } catch (error) {
        console.log(error)
        toast.error("Failed", { description: 'Could not uploaded media' })
      }
    })
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className='text-muted-foreground'>File Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete='off'
                    placeholder="Name of your file"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>File key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="File key"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem >
                <FormControl>
                  <FileUploadDropzone
                    apiEndpoint="productImages"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>File Size</FormLabel>
                <FormControl>
                  <Input
                    placeholder="File Size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>File type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="File type"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending || form.watch("url") === ""}>
            {isPending && (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />)}
            Upload Media
          </Button>
        </form>
      </Form>
    </>
  )
}
