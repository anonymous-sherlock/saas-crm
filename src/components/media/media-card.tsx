'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteMedia } from '@/lib/actions/media.action'
import { Media } from '@prisma/client'
import { Copy, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = { file: Media }

const MediaCard = ({ file }: Props) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <AlertDialog>
      <DropdownMenu>
        <Card className="h-full overflow-hidden w-full transition-colors hover:bg-muted/50">
          <AspectRatio ratio={16 / 8}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-zinc-950/60" />
            <div
              className="h-full rounded-t-md border-b"
              style={{
                background: `url(${file.url})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
          </AspectRatio>
          <CardHeader className="p-4 space-y-2">
            <CardTitle className="line-clamp-1 text-base flex flex-row justify-between">
              <p className='text-sm'>{file.name}</p>
              <DropdownMenuTrigger>
                <MoreHorizontal className='text-muted-foreground' />
              </DropdownMenuTrigger>
            </CardTitle>
            <CardDescription className="line-clamp-1 !mt-0 text-sm">
              {file.createdAt.toDateString()}
            </CardDescription>
          </CardHeader>
          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2 hover:text-primary"
              onClick={() => {
                navigator.clipboard.writeText(file.url)
                toast.success('Copied To Clipboard')
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2 hover:text-primary">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </Card>

      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All products using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction asChild >
            <Button variant="destructive" disabled={loading}
              className='bg-destructive hover:bg-destructive-foreground/10 text-destructive-foreground'
              onClick={async () => {
                setLoading(true)
                const response = await deleteMedia(file.id)
                toast("Deleted File", {
                  description: "Successfully deleted the file",
                })
                setLoading(false)
                router.refresh()
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MediaCard
