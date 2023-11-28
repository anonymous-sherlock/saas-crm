"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Upload } from "tus-js-client";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    // Initialize the Tus client
    const upload = new Upload(file, {
      endpoint: "http://localhost/cdn-crm/file.php", // Replace with your actual API endpoint
      retryDelays: [0, 1000, 3000, 5000], // Retry delays in milliseconds
      metadata: {
        filename: file.name,
        filetype: file.type,
      },

      onError: (error) => {
        console.error("Failed to upload", error);
        console.log("error name:", error.name);
        console.log("error status:", error.cause);
      },

      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(`Upload progress: ${percentage}%`);
      },
      onSuccess: () => {
        console.log("Upload complete");
      },
    });

    // Start the upload
    upload.start();

    // Save the upload URL for potential resuming
    setUploadUrl(upload.url);
  };

  const handleResumeUpload = async () => {
    if (!uploadUrl) {
      console.error("No upload URL available for resuming.");
      return;
    }
    if (file) {
      // Resume the upload using the saved URL
      const upload = new Upload(file, {
        uploadUrl,
        retryDelays: [0, 1000, 3000, 5000],
        onError: (error) => {
          console.error("Failed to resume upload", error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(`Resume progress: ${percentage}%`);
        },
        onSuccess: () => {
          console.log("Resume complete");
        },
      });

      // Start the resume
      upload.start();
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center m-auto mt-8">
      <Card className="w-1/2">
        <CardContent className="mt-4">
          <Input type="file" onChange={handleFileChange} />
        </CardContent>
        <CardFooter>
          <Button variant={"default"} onClick={handleUpload}>
            Upload
          </Button>
          <Button variant={"outline"} onClick={handleResumeUpload}>
            Resume Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPage;
