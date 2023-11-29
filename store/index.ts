import { FileMetaDetails } from "@/types/fileUpload";
import { create } from "zustand";

// navbar state
type NavbarState = {
  isTabletMid: Boolean;
  open: Boolean;
  setOpen: (value: boolean) => void;
  setIsTabletMid: (value: boolean) => void;
};
const useNavbarStore = create<NavbarState>((set) => ({
  isTabletMid: false,
  open: true,
  setOpen: (value) => set({ open: value }),
  setIsTabletMid: (value) => set({ isTabletMid: value }),
}));

export default useNavbarStore;

type ProductImagesDropDown = {
  images: File[]
  setImages: (newImages: File | File[]) => void;
  removeImage: (file: File) => void;
  removeAll: () => void
};

export const useProductImages = create<ProductImagesDropDown>((set) => ({
  images: [],
  setImages: (newImages) => set((state) => {
    const updatedImages = Array.isArray(newImages) ? [...newImages, ...state.images] : [newImages, ...state.images];
    return { images: updatedImages };
  }),
  removeImage: (fileToRemove) =>
    set((state) => {
      const updatedImages = state.images.filter((file) => file !== fileToRemove);
      // Remove the corresponding file from useUploadedFileMeta
      useUploadedFileMeta.getState().removeFile(fileToRemove);
      return { images: updatedImages };
    }),
  removeAll: () => set(() => {
    useUploadedFileMeta.getState().removeAll()
    return ({ images: [] })
  })
}));


type UploadedFileStore = {
  files: FileMetaDetails[];
  addFile: (file: FileMetaDetails | FileMetaDetails[]) => void;
  removeFile: (file: File) => void;
  removeAll: () => void;
};

export const useUploadedFileMeta = create<UploadedFileStore>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({
    files: Array.isArray(file)
      ? [...file, ...state.files,]
      : [file, ...state.files],
  })),
  removeAll: () => set(() => ({ files: [] })),
  removeFile: (fileToRemove) => set((state) => {
    const updatedFiles = state.files.filter((file) =>
      file.originalFileName !== fileToRemove.name && file.fileType !== fileToRemove.type
      && file.fileSize !== fileToRemove.size
    );
    return {
      files: updatedFiles
    }
  })
}))