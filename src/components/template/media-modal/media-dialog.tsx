"use client"
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Media } from '@prisma/client';
import { Cloud, FileIcon, X } from 'lucide-react';
import { useState } from 'react';
import MediaLibraryTabContent from './media-library-tab-content';
import MediaUploaderTabContent from './media-uploader-tab-content';
import { Zoom } from '@/components/zoom-image';
import Image from 'next/image';
import { Fragment } from "react"

type TabType = "uploader" | "library" | "videos";
interface MediaDialogProps {
  images: Media[] | null,
  fetchNextPage: () => void
  isFetchingNextPage: boolean
  disabled?: boolean
  labelText?: string
  triggerStyle?: "Button" | "Card"
  maxSize?: number
  maxFiles?: number
  selectedFile: Media[]
  setSelectedFile: React.Dispatch<React.SetStateAction<Media[]>>;
}
export const MediaDialog = ({ images, selectedFile, setSelectedFile, fetchNextPage, isFetchingNextPage, triggerStyle, disabled, labelText,
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
}: MediaDialogProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState<"auto">("auto");
  const [selectedTab, setSelectedTab] = useState<TabType>("library");

  const tabContents: Record<TabType, JSX.Element> = {
    uploader: <MediaUploaderTabContent />,
    library: <MediaLibraryTabContent data={images} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />,
    videos: <div>Videos Content</div>,
  };

  async function removefile(id: string) {
    setSelectedFile(prevSelectedFiles => prevSelectedFiles.filter(file => file.id !== id));
  }
  return (
    <>
      {triggerStyle === "Button" ?
        <Button variant="outline" disabled={disabled} className="h-11" onClick={onOpen}>
          {labelText}
          <span className="sr-only">{labelText}</span>
        </Button>
        : <div className={cn('border h-64 border-dashed border-gray-300 rounded-lg',)} onClick={onOpen}>
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor=''
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>
                    Click to select
                  </span>{' '}
                  media file
                </p>
                <p className='text-xs text-zinc-500'>
                  Image max (up to {maxFiles})
                </p>
              </div>
            </label>
          </div>
        </div>
      }
      {selectedFile?.length ? (
        <div className="flex items-center justify-start flex-wrap gap-3 w-full mt-4">
          {selectedFile.map((file, i) => (
            <Fragment key={file.id}>
              <div className='relative group'>
                <Zoom key={i}>
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                  />
                </Zoom>
                <span className='absolute cursor-pointer -top-2 -right-2 z-[999] size-5 flex justify-center items-center rounded-full bg-red-700 text-white opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto' onClick={() => removefile(file.id)}><X className='size-4' /></span>
              </div>
            </Fragment>
          ))}
        </div>
      ) : null}
      <Modal backdrop="opaque" size='5xl' isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange} className='min-h-[85vh]'
        scrollBehavior="inside"
        onClose={() => {
          setSelectedFile([])
        }}
        classNames={{ backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20" }}
        isDismissable={false}
      >
        <ModalContent className='min-h-[70vh]'>
          {(onClose) => (
            <>
              <ModalHeader className='flex w-full flex-col'>
                <Tabs aria-label="Options" color="primary" variant="underlined"
                  defaultSelectedKey={selectedTab}
                  classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-[#22d3ee]",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-[#06b6d4]"
                  }}
                  onSelectionChange={(v) => setSelectedTab(v as TabType)}
                >
                  <Tab key="uploader"
                    title={
                      <div className="flex items-center space-x-2">
                        <Icons.UploadIcon />
                        <span>Upload Files</span>
                      </div>
                    }
                  />

                  <Tab key="library"
                    title={
                      <div className="flex items-center space-x-2">
                        <Icons.GalleryIcon />
                        <span>Media Library</span>
                        <Chip size="sm" variant="faded">{images?.length}</Chip>
                      </div>
                    }
                  />
                </Tabs>
              </ModalHeader>
              <ModalBody>
                {tabContents[selectedTab]}
              </ModalBody>
              <ModalFooter >
                {selectedTab === "library" &&
                  <Button color="primary" disabled={selectedFile.length === 0}
                    onClick={() => {
                      onOpenChange()
                      setSelectedFile(prev => prev)
                    }
                    }>Select</Button>
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal >
    </>
  );
};

