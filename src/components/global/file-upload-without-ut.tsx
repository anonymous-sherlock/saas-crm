import { cn, formatBytes } from "@/lib/utils";
import { Cloud, File, FileIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { FC, useState } from "react";
import { Accept, FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Progress } from "@nextui-org/react";

interface FileUploadWithoutUTProps {
  value?: string;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  accept?: Accept;
  selectedFile: FileWithPath | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPath | undefined>>;
  fakeSimulationTime?: number;
}

export const FileUploadWithoutUT: FC<FileUploadWithoutUTProps> = ({ value, maxSize = 1024 * 1024 * 4, maxFiles = 1, disabled = false, selectedFile, setSelectedFile, fakeSimulationTime = 500 }) => {
  const type = value?.split(".").pop();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      const startSimulatedProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prevProgress) => {
            if (prevProgress >= 95) {
              clearInterval(interval);
              return prevProgress;
            }
            return prevProgress + 5;
          });
        }, 500);
        return interval;
      };

      acceptedFiles.forEach(async (file) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        await new Promise((resolve) => setTimeout(resolve, fakeSimulationTime));
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);
        setSelectedFile(file);
      });
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(`File is too large. Max size is ${formatBytes(maxSize)}`);
            return;
          }
          errors[0]?.message && toast.error(errors[0].message);
        });
      }
    },
    [maxSize, setSelectedFile, fakeSimulationTime],
  );
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  });

  if (value) {
    return (
      <div className={cn("border h-64 border-dashed border-gray-300 rounded-lg bg-gray-50")}>
        <div className="flex flex-col justify-center items-center h-full">
          {type !== "pdf" ? (
            <div className="relative w-40 h-40">
              <Image src={value} alt="uploaded image" className="object-contain" fill sizes="400px" priority quality={80} />
            </div>
          ) : (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon />
              <a href={value} target="_blank" rel="noopener_noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                View PDF
              </a>
            </div>
          )}
          <Button variant="destructive" type="button">
            <X className="h-4 w-4" />
            Remove File
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div {...getRootProps()} className={cn("border h-64 border-dashed border-gray-300 rounded-lg", isDragActive && "border-muted-foreground/50 bg-fuchsia-100")}>
      <div className="flex items-center justify-center h-full w-full">
        <label htmlFor="" className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
            <p className="mb-2 text-sm text-zinc-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-500">Image (up to {formatBytes(maxSize)})</p>
            {(acceptedFiles && acceptedFiles[0]) || selectedFile ? (
              <div className="max-w-xs mt-4 bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="px-3 py-2 h-full grid place-items-center">
                  <File className="h-4 w-4 text-blue-500" />
                </div>
                <div className="px-3 py-2 h-full text-sm truncate">{selectedFile?.name || acceptedFiles[0]?.name}</div>
              </div>
            ) : null}
            {isUploading ? (
              <div className="w-full mt-4 max-w-xs mx-auto">
                <Progress size="sm" isIndeterminate={uploadProgress === 0} aria-label="Loading..." className="max-w-lg" value={uploadProgress} color={uploadProgress === 0 ? "primary" : "success"} />
                {uploadProgress === 100 ? (
                  <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
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
  );
};
