"use client"
import { trpc } from "@/app/_trpc/client"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { deleteMedia } from "@/lib/actions/media.action"
import { cn } from "@/lib/utils"
import { Listbox, ListboxItem, ListboxSection, Spinner } from "@nextui-org/react"
import { Media } from "@prisma/client"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { forwardRef, useTransition } from "react"
import { toast as hotToast } from "react-hot-toast"
import { toast } from 'sonner'
import { Icons } from "../Icons"
import { Separator } from "../ui/separator"
import { DeleteMediaAlert } from "./media-delete-alert"


type MediaCardProps = { file: Media, isSelected?: boolean }
export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(({ file, isSelected = false }, ref) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const utils = trpc.useUtils()

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteMedia(file.id)
      utils.media.getMedia.invalidate()
      toast("Deleted File", {
        description: "Successfully deleted the file",
      })
      router.refresh()
    })
  }
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <DropdownMenu>
      <Card ref={ref} className={cn("h-full overflow-hidden w-full transition-colors hover:bg-muted/50",
        isSelected && "border-primary border-2")}>
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
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" disabled={isPending} className="flex justify-center items-center h-8 w-8 p-0 data-[state=open]:bg-muted border-2 rounded-full justify-self-end"   >
                {isPending ? <Spinner size="sm" className="m-0 text-muted-foreground" /> : <DotsHorizontalIcon className="h-4 w-4" />}
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
          </CardTitle>
          <CardDescription className="line-clamp-1 !mt-0 text-sm">
            {file.createdAt.toDateString()}
          </CardDescription>
        </CardHeader>
        <DropdownMenuContent>
          <Listbox variant="faded" aria-label="lead quick actions menu">
            <ListboxSection title="Quick actions" aria-label='Quick actions'>
              <ListboxItem key="copy-file-url" aria-label='Copy lead id' startContent={<Icons.CopyIcon className={iconClasses} />}
                onClick={() => {
                  navigator.clipboard.writeText(file.url.toString());
                  hotToast.success('Successfully Copied file url')
                }}
              >
                Copy File Url
              </ListboxItem>
            </ListboxSection>
          </Listbox>
          <Separator className='my-1' />
          <DeleteMediaAlert
            onDelete={handleDelete}
            isDeleting={isPending}
          />
        </DropdownMenuContent>
      </Card>
    </DropdownMenu>
  )
})

MediaCard.displayName = 'MediaCard'
