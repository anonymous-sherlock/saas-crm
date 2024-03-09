"use client"
import { GetMediaFiles } from '@/types'
import { FolderSearch } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import MediaCard from './media-card'
import MediaUploadButton from './upload-buttons'

type Props = {
  data: GetMediaFiles
  companyId: string
}

const MediaComponent = ({ data, companyId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton companyId={companyId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-10 max-h-full ">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default MediaComponent
