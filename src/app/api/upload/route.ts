import { FileUploadError } from '@/types/fileUpload';
import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import {env} from "@/lib/env.mjs"

// Export routes for Next App Router
const handler = async (req: Request) => {
  try {
    // Check if the CDN_UPLOAD_URL is defined
    if (!env.CDN_UPLOAD_URL) {
      return NextResponse.json({ error: 'CDN_UPLOAD_URL is not defined' }, { status: 500 });
    }

    const body = await req.formData();
    const apiKey = env.CDN_API_KEY as string;
    body.append('X_API_KEY', apiKey);
    const { data, status } = await axios.post(env.CDN_UPLOAD_URL, body, {
      headers: { 'X_API_KEY': apiKey },
    });
    // Check if the response status is not 200 or 201
    if (!data) {
      return NextResponse.json({ error: 'File upload failed', status }, { status });
    }
    return NextResponse.json(data, { status: status });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (!err.response) {
        return NextResponse.json({ success: false, status: "error", message: 'Network error - Unable to connect to the server' } satisfies FileUploadError, { status: 503 });
      } else if (err.response?.data && err.response?.data.success === false) {
        const uploadError = err.response.data as FileUploadError;
        return NextResponse.json({ success: false, status: uploadError.status, message: uploadError.message } satisfies FileUploadError, { status: err.response.status || 400 });
      }
    }
    else {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
};

export { handler as POST };
