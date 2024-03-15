import React, { FC, useState } from 'react';
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Tab, Tabs } from '@nextui-org/tabs';
import { Icons } from '@/components/Icons';
import MediaUploaderTabContent from './media-uploader-tab-content';
import MediaLibraryTabContent from './media-library-tab-content';

type TabType = "uploader" | "library" | "videos";

export const MediaDialog: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement] = useState<"auto">("auto");
  const [selectedTab, setSelectedTab] = useState<TabType>("library");


  const renderTabContent = () => {
    switch (selectedTab) {
      case "uploader":
        return <MediaUploaderTabContent />;
      case "library":
        return <MediaLibraryTabContent />;
      case "videos":
        return <div>Videos Content</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="max-w-fit">Open Modal</Button>
      <Modal backdrop="opaque" size='5xl' isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange} className='min-h-[85vh]'
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
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
                        <Chip size="sm" variant="faded">9</Chip>
                      </div>
                    }
                  />
                </Tabs>
              </ModalHeader>
              <ModalBody>
                {renderTabContent()}
              </ModalBody>
              <ModalFooter >
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal >
    </>
  );
};

