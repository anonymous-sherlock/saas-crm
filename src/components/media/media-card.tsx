"use client";
import { trpc } from "@/app/_trpc/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteMedia } from "@/lib/actions/media.action";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Listbox, ListboxItem, ListboxSection, Spinner } from "@nextui-org/react";
import { Media } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useTransition } from "react";
import { toast as hotToast } from "react-hot-toast";
import { toast } from "sonner";
import { Icons } from "../Icons";
import { CustomDeleteAlertDailog } from "../global/custom-delete-alert-dailog";
import { Separator } from "../ui/separator";

type MediaCardProps = { file: Media; isSelected?: boolean };
export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(({ file, isSelected = false }, ref) => {
  const [isPending, startTransition] = useTransition();
  const { setOpen } = useModal();
  const router = useRouter();
  const utils = trpc.useUtils();

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteMedia(file.id);
      utils.media.getUserMedia.invalidate();
      toast("Deleted File", {
        description: "Successfully deleted the file",
      });
      router.refresh();
    });
  };
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <Card ref={ref} className={cn("h-full overflow-hidden w-full transition-colors hover:bg-muted/50", isSelected && "border-primary border-2")}>
      <AspectRatio ratio={16 / 8}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-zinc-950/60" />
        <div
          className="h-full rounded-t-md border-b"
          style={{
            background: `url(${file.url})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AspectRatio>
      <CardHeader className="p-4 space-y-2">
        <CardTitle className="line-clamp-1 text-base flex flex-row justify-between items-center">
          <p className="text-sm">{file.name}</p>
          <Popover placement="left" style={{ zIndex: 200 }}>
            <PopoverTrigger>
              <Button variant="secondary" disabled={isPending} className="flex justify-center items-center h-8 w-8 p-0 data-[state=open]:bg-muted border-2 rounded-full justify-self-end shrink-0">
                {isPending ? <Spinner size="sm" className="m-0 text-muted-foreground" /> : <DotsHorizontalIcon className="h-4 w-4" />}
                <span className="sr-only">Open menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Listbox variant="faded" aria-label="lead quick actions menu">
                <ListboxSection title="Quick actions" aria-label="Quick actions">
                  <ListboxItem
                    key="copy-file-url"
                    aria-label="Copy lead id"
                    startContent={<Icons.CopyIcon className={iconClasses} />}
                    onClick={() => {
                      navigator.clipboard.writeText(file.url.toString());
                      hotToast.success("Successfully Copied file url");
                    }}
                  >
                    Copy File Url
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
              <Separator className="my-1" />
              <Listbox variant="faded" aria-label="Leads Danger zone menu">
                <ListboxSection title="Danger zone" aria-label="Danger zone">
                  <ListboxItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    aria-label="Permanently delete file"
                    description="Permanently delete file"
                    onClick={() => {
                      setOpen(
                        <CustomDeleteAlertDailog
                          title="Are you absolutely sure?"
                          description="Are you sure you want to delete this file? All products using this file will no longer have access to it!"
                          isDeleting={isPending}
                          onDelete={handleDelete}
                          actionText="Delete File"
                        />,
                      );
                    }}
                    startContent={isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.DeleteIcon className={cn(iconClasses, "text-danger")} />}
                  >
                    Delete
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription className="line-clamp-1 !mt-0 text-sm">{file.createdAt.toDateString()}</CardDescription>
      </CardHeader>
    </Card>
  );
});

MediaCard.displayName = "MediaCard";
