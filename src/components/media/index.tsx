"use client"
import { trpc } from '@/app/_trpc/client'
import { GetMediaFiles } from '@/types'
import { useIntersection } from '@mantine/hooks'
import { Spinner } from '@nextui-org/react'
import { FolderSearch } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { MediaCard } from './media-card'

type Props = {
  data: GetMediaFiles
  companyId: string
}

const MediaComponent = ({ data, companyId }: Props) => {
  const { data: fileData, fetchNextPage, isFetchingNextPage, isLoading } = trpc.media.getUserMedia.useInfiniteQuery(
    { limit: 12, },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, },
  )

  const files = fileData ? fileData.pages.flatMap((data) => data.mediafiles) : []

  const lastImageRef = useRef<HTMLDivElement>(null)

  const { ref, entry } = useIntersection({
    root: lastImageRef.current,
    threshold: 1,
  })
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  return (

    <Command className="bg-transparent">
      <CommandInput placeholder="Search for file name..." />
      <CommandList className="pb-10 max-h-full ">
        <CommandEmpty >No Media Files</CommandEmpty>
        <CommandGroup heading="Media Files" className='col-span-4'>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {files?.map((file, i) => (
              <CommandItem key={file.id} className="p-0 w-full rounded-lg !bg-transparent !font-medium !text-white" >
                {(i === files.length - 1) ?
                  <MediaCard file={file} ref={ref} /> :
                  <MediaCard file={file} />
                }
              </CommandItem>
            ))}
            {isFetchingNextPage ?
              <div className="flex items-center justify-center w-full flex-row  col-span-4">
                <Spinner size="md" />
                <p className="text-muted-foreground ">
                  loading....
                </p>
              </div> : null}
            {!data?.media.length && (
              <div className="flex items-center justify-center w-full flex-col col-span-4">
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
  )
}

export default MediaComponent
