"use client";
import { MediaCard } from "@/components/media/media-card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useIntersection } from "@mantine/hooks";
import { Spinner } from "@nextui-org/react";
import { Media } from "@prisma/client";
import { FolderSearch } from "lucide-react";
import { FC, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface MediaLibraryTabContentProps {
  data: Media[] | null;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  selectedFile: Media[];
  setSelectedFile: React.Dispatch<React.SetStateAction<Media[]>>;
  maxFiles: number;
}

const MediaLibraryTabContent: FC<MediaLibraryTabContentProps> = ({ data, fetchNextPage, isFetchingNextPage, selectedFile, setSelectedFile, maxFiles }: MediaLibraryTabContentProps) => {
  const lastImageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastImageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const handleFileClick = useCallback((file: Media) => {
    if (maxFiles === 1) {
      setSelectedFile([file]);
    } else {
      setSelectedFile((prevSelectedFiles) => {
        const isSelected = prevSelectedFiles.some((selectedFile) => selectedFile.id === file.id);
        if (isSelected) {
          return prevSelectedFiles.filter((selectedFile) => selectedFile.id !== file.id);
        } else {
          if (prevSelectedFiles.length < maxFiles) {
            return [...prevSelectedFiles, file];
          } else {
            toast.error(`You cannot select more than ${maxFiles} Files.`);
            return [...prevSelectedFiles];
          }
        }
      });
    }
  },[maxFiles, setSelectedFile]);

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-10 max-h-full ">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.map((file, i) => (
                <CommandItem key={file.id} className="p-0 w-full rounded-lg !bg-transparent !font-medium !text-white" onSelect={() => handleFileClick(file)}>
                  {i === data.length - 1 ? (
                    <MediaCard file={file} isSelected={selectedFile.some((f) => f.id === file.id)} ref={ref} />
                  ) : (
                    <MediaCard file={file} isSelected={selectedFile.some((f) => f.id === file.id)} />
                  )}
                </CommandItem>
              ))}
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center w-full flex-row gap-2 col-span-4">
                  <Spinner size="sm" />
                  <p className="text-muted-foreground ">loading</p>
                </div>
              ) : null}
              {!data?.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch size={200} className="dark:text-muted text-slate-300" />
                  <p className="text-muted-foreground ">Empty! no files to show.</p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaLibraryTabContent;
