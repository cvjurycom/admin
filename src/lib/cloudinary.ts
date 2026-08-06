const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

type CloudinaryUploadResult = {
  url: string
  filename: string
  size: number
  mimeType: string
}

/**
 * Rewrites a Cloudinary delivery URL to permanently serve WebP, so the URL
 * we register with our own backend (and store on blocks) is already
 * optimized — not just optimized at render time via `cloudinaryAuto`.
 */
function toWebpUrl(url: string): string {
  const marker = "/upload/"
  const index = url.indexOf(marker)
  if (index === -1) {
    return url
  }
  const insertAt = index + marker.length
  return `${url.slice(0, insertAt)}f_webp,q_auto/${url.slice(insertAt)}`
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
    url: toWebpUrl(String(body.secure_url)),
    filename: String(body.original_filename ?? file.name),
    size: Number(body.bytes ?? file.size),
    mimeType: "image/webp",
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
  return `${url.slice(0, insertAt)}c_fill,g_auto,w_${size},h_${size},f_auto,q_auto/${url.slice(insertAt)}`
}

/**
 * Serves the image in whatever format is smallest for the requesting
 * browser (AVIF, WebP, or the original as a fallback) instead of always
 * shipping the originally-uploaded format. Use this for any full-size
 * content image rendered from a Cloudinary URL.
 */
function cloudinaryAuto(url: string): string {
  const marker = "/upload/"
  const index = url.indexOf(marker)
  if (index === -1) {
    return url
  }
  const insertAt = index + marker.length
  return `${url.slice(0, insertAt)}f_auto,q_auto/${url.slice(insertAt)}`
}

/**
 * Strips the photo's background (AI background-removal add-on) and then
 * face-crops it, as two chained transform steps — combining them into a
 * single step silently skips the background removal. Author photos are
 * often shot against a busy or solid-color backdrop that clashes with the
 * avatar ring; this keeps only the person.
 */
function cloudinaryAvatar(url: string, size = 400): string {
  const marker = "/upload/"
  const index = url.indexOf(marker)
  if (index === -1) {
    return url
  }
  const insertAt = index + marker.length
  return `${url.slice(0, insertAt)}e_background_removal/c_fill,g_face,w_${size},h_${size},f_auto,q_auto/${url.slice(insertAt)}`
}

export {
  cloudinaryAuto,
  cloudinaryAvatar,
  cloudinaryThumbnail,
  uploadImageToCloudinary,
}
export type { CloudinaryUploadResult }
