"use server"
import { db } from "@/db"
import { getActorUser, getCurrentUser } from "@/lib/auth"
import { MediaFormType } from "@/schema/media.schema"
import { utapi } from "@/server/uploadthing"

export const getMedia = async (companyId: string) => {
    if (!companyId) return null
    const mediafiles = await db.company.findUnique({
        where: { id: companyId, },
        include: { media: { orderBy: { createdAt: "desc" } } },

    })
    return mediafiles
}

export const getMediaByUserId = async (userId: string) => {
    if (!userId) return null
    const mediafiles = await db.company.findUnique({
        where: { id: userId, },
        include: { media: true },
    })
    return mediafiles
}


export const createMedia = async (mediaFile: MediaFormType) => {
    const user = await getCurrentUser()
    const actor = await getActorUser(user)
    const response = await db.media.create({
        data: {
            url: mediaFile.url,
            name: mediaFile.name,
            originalFileName: mediaFile.originalFileName,
            type: mediaFile.type,
            size: parseInt(mediaFile.size || "") ?? undefined,
            userId: actor ? actor.userId : user?.id,
            companyId: actor ? actor.company.id : user?.company.id
        },
    })

    return response
}

export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({
        where: { id: mediaId, },
    })
    return response
}


export async function deleteMediaFromUT(key: string) {
    const deletedFile = await utapi.deleteFiles(key)
    if (deletedFile.success) {
        return { success: "File Deleted Succefully" }
    }
    return { error: "Uh oh! Something went wrong." }
}