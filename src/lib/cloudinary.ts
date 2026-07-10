const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

type CloudinaryUploadResult = {
  url: string
  filename: string
  size: number
  mimeType: string
}

async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.")
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Image uploads aren't configured yet.")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      body && typeof body === "object" && body.error?.message
        ? String(body.error.message)
        : "Image upload failed. Please try again."
    throw new Error(message)
  }

  return {
    url: String(body.secure_url),
    filename: String(body.original_filename ?? file.name),
    size: Number(body.bytes ?? file.size),
    mimeType: file.type,
  }
}

/**
 * Inserts a fill+auto-gravity transform into a Cloudinary delivery URL so
 * thumbnails crop toward the salient content instead of a blind center
 * crop — small/oddly-shaped assets like logos otherwise render as a mostly
 * empty square with the mark cut off or shrunk into a corner.
 */
function cloudinaryThumbnail(url: string, size = 400): string {
  const marker = "/upload/"
  const index = url.indexOf(marker)
  if (index === -1) {
    return url
  }
  const insertAt = index + marker.length
  return `${url.slice(0, insertAt)}c_fill,g_auto,w_${size},h_${size}/${url.slice(insertAt)}`
}

export { cloudinaryThumbnail, uploadImageToCloudinary }
export type { CloudinaryUploadResult }
