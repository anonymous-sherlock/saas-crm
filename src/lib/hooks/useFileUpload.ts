"use client"
import { toast } from '@/components/ui/use-toast';
import { FileUploadError, FilesUploadResponse, uploaderEndpoint } from '@/types/fileUpload';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';


interface UseFileUploadOptions {
  uplaodPath?: string
  endpoint?: uploaderEndpoint
}

interface UploadProps {
  files: File[];
  path?: string;
}
const useFileUpload = (uploadOtions?: UseFileUploadOptions) => {
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post("/api/upload", formData);
      return response;
    },
    mutationKey: ["fileupload"],
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && err.response?.data.status) {
          const fileUploadError = err.response.data as FileUploadError;
          return toast({
            title: capitalizeFirstLetter(fileUploadError.status),
            description: fileUploadError.message,
            variant: 'destructive',
          });
        }
        else {
          const status = err.response?.status || 500;
          const defaultMessage = "Something Went Wrong";
          const description = err.message || defaultMessage;
          toast({ title: err.name, description, variant: 'destructive' });
        }
      }
      else {
        return toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive"
        })
      }
    },
    retry: false,
  });

  const upload = async ({ files, path }: UploadProps): Promise<AxiosResponse<FilesUploadResponse> | undefined> => {
    const formData = new FormData();

    switch (uploadOtions?.endpoint) {
      case "crm": files.map((file) => formData.append('crm', file, file.name));
        break;
      case "aadharUploader": files.map((file) => formData.append("aadharUploader", file, file.name));
        break;
      case "documentsUploader": files.map((file) => formData.append("documentsUploader", file, file.name));
        break;
      case "files": files.map((file) => formData.append("files", file, file.name));
        break;
      default: files.map((file) => formData.append('crm', file, file.name));
        break;
    }

    // Use path from the function argument if provided, otherwise use the globalPath

    if (path) formData.append('path', path);
    else if (uploadOtions?.uplaodPath) formData.append('path', uploadOtions?.uplaodPath);
    try {
      return await mutation.mutateAsync(formData);
    } catch (error) {
      return undefined
    }
  };


  return {
    upload,
    ...mutation,
  };
};

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default useFileUpload;

