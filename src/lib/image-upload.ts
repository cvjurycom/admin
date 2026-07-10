import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { createMedia } from "@/lib/media"

/**
 * Uploads a file directly to Cloudinary (unsigned preset), then registers
 * the resulting hosted URL as a Media record via the admin API so it shows
 * up in the Media Library too.
 */
async function uploadAndRegisterImage(
  file: File,
  altText?: string
): Promise<string> {
  const uploaded = await uploadImageToCloudinary(file)
  const media = await createMedia({
    imageUrl: uploaded.url,
    filename: uploaded.filename,
    size: uploaded.size,
    mimeType: uploaded.mimeType,
    altText,
  })
  return media.imageUrl ?? uploaded.url
}

export { uploadAndRegisterImage }
