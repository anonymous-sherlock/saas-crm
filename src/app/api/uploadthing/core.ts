import { getCurrentUser } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'


const f = createUploadthing()

const authenticateUser = async () => {
  const user = await getCurrentUser()
  // If you throw, the user will not be able to upload
  if (!user) throw new Error('Unauthorized')
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { user: user }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImages: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => { }),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => { }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
