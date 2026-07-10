import { Check, Copy, Search, Trash2, Upload, X } from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import { cloudinaryThumbnail, uploadImageToCloudinary } from "@/lib/cloudinary"
import { createMedia, deleteMedia, listMedia, type Media } from "@/lib/media"

function formatSize(bytes?: number): string {
  if (!bytes) {
    return "—"
  }
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value?: string): string {
  if (!value) {
    return "—"
  }
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mediaPendingDelete, setMediaPendingDelete] = useState<Media | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [dimensionsById, setDimensionsById] = useState<Record<string, string>>(
    {}
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listMedia()
      .then(setMediaItems)
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load media."
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return mediaItems
    }
    return mediaItems.filter((item) =>
      (item.filename ?? "").toLowerCase().includes(query)
    )
  }, [mediaItems, search])

  const selectedAsset =
    mediaItems.find((item) => item._id === selectedId) ?? null

  useEffect(() => {
    if (!selectedAsset?._id || !selectedAsset.imageUrl) {
      return
    }
    if (dimensionsById[selectedAsset._id]) {
      return
    }

    const id = selectedAsset._id
    const probe = new Image()
    probe.onload = () => {
      setDimensionsById((current) => ({
        ...current,
        [id]: `${probe.naturalWidth}×${probe.naturalHeight}`,
      }))
    }
    probe.src = selectedAsset.imageUrl
  }, [selectedAsset, dimensionsById])

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    )
    if (list.length === 0) {
      return
    }

    setIsUploading(true)
    try {
      for (const file of list) {
        const uploaded = await uploadImageToCloudinary(file)
        const media = await createMedia({
          imageUrl: uploaded.url,
          filename: uploaded.filename,
          size: uploaded.size,
          mimeType: uploaded.mimeType,
        })
        setMediaItems((current) => [media, ...current])
      }
      toast.success(
        list.length > 1 ? `${list.length} files uploaded` : "File uploaded"
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDraggingOver(false)
    if (event.dataTransfer.files.length > 0) {
      uploadFiles(event.dataTransfer.files)
    }
  }

  const confirmDelete = async () => {
    if (!mediaPendingDelete?._id) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteMedia(mediaPendingDelete._id)
      setMediaItems((current) =>
        current.filter((item) => item._id !== mediaPendingDelete._id)
      )
      if (selectedId === mediaPendingDelete._id) {
        setSelectedId(null)
      }
      toast.success("File deleted")
      setMediaPendingDelete(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to delete file."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!selectedAsset?.imageUrl) {
      return
    }
    await navigator.clipboard.writeText(selectedAsset.imageUrl)
    toast.success("URL copied to clipboard")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              uploadFiles(event.target.files)
            }
            event.target.value = ""
          }}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              Media Library
            </h1>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-4 w-20" />
            ) : (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {mediaItems.length} assets
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex h-11 w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
          >
            <Upload className="size-4" />
            Upload Files
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDraggingOver(true)
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          disabled={isUploading}
          className={
            isDraggingOver
              ? "flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#E97451] bg-[#FDF3EC] py-12 text-center"
              : "flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#D8D8DC] bg-[#FAFAFA] py-12 text-center hover:bg-[#F1F1F3]"
          }
        >
          <Upload className="size-5 text-[#8C8C8C]" />
          <p className="text-sm font-semibold text-[#161616]">
            {isUploading ? "Uploading…" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-[#8C8C8C]">
            or click to browse &mdash; PNG, JPG, GIF, WebP up to 5MB
          </p>
        </button>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8C8C8C]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media..."
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
          />
        </div>

        <div
          className={
            selectedAsset
              ? "grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_280px]"
              : "grid grid-cols-1 items-start gap-6"
          }
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square w-full rounded-xl"
                />
              ))}

            {!isLoading &&
              filteredAssets.map((asset) => {
                const isSelected = asset._id === selectedId
                return (
                  <button
                    key={asset._id}
                    type="button"
                    onClick={() =>
                      setSelectedId((current) =>
                        current === asset._id ? null : (asset._id ?? null)
                      )
                    }
                    className={
                      isSelected
                        ? "relative aspect-square overflow-hidden rounded-xl ring-2 ring-[#E97451] ring-offset-2"
                        : "relative aspect-square overflow-hidden rounded-xl bg-[#F1F1F3]"
                    }
                  >
                    <img
                      src={
                        asset.imageUrl
                          ? cloudinaryThumbnail(asset.imageUrl, 300)
                          : undefined
                      }
                      alt={asset.altText || asset.filename || "Media asset"}
                      className="absolute inset-0 size-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-[#E97451] text-white">
                        <Check className="size-3.5" />
                      </span>
                    )}
                  </button>
                )
              })}

            {!isLoading && filteredAssets.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-[#8C8C8C]">
                {mediaItems.length === 0
                  ? "No media uploaded yet."
                  : "No media matches your search."}
              </p>
            )}
          </div>

          {selectedAsset && (
            <div className="rounded-[16px] border border-[#E8E8EC] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#161616]">Details</h2>
                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() => setSelectedId(null)}
                  className="flex size-7 items-center justify-center rounded-lg text-[#8C8C8C] hover:bg-[#F1F1F3] hover:text-[#4A4A4A]"
                >
                  <X className="size-4" />
                </button>
              </div>

              <img
                src={
                  selectedAsset.imageUrl
                    ? cloudinaryThumbnail(selectedAsset.imageUrl, 500)
                    : undefined
                }
                alt={selectedAsset.altText || selectedAsset.filename || ""}
                className="mt-4 aspect-square w-full rounded-lg object-cover"
              />

              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
                    Filename
                  </dt>
                  <dd className="mt-0.5 truncate text-[#161616]">
                    {selectedAsset.filename ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
                    Type
                  </dt>
                  <dd className="mt-0.5 text-[#161616]">
                    {selectedAsset.mimeType ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
                    Size
                  </dt>
                  <dd className="mt-0.5 text-[#161616]">
                    {formatSize(selectedAsset.size)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
                    Dimensions
                  </dt>
                  <dd className="mt-0.5 text-[#161616]">
                    {(selectedAsset._id && dimensionsById[selectedAsset._id]) ??
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
                    Uploaded
                  </dt>
                  <dd className="mt-0.5 text-[#161616]">
                    {formatDate(selectedAsset.createdAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#E8E8EC] text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
                >
                  <Copy className="size-4" />
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => setMediaPendingDelete(selectedAsset)}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#FDECEC] text-sm font-medium text-[#DC2626] hover:bg-[#FBD5D5]"
                >
                  <Trash2 className="size-4" />
                  Delete File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmDialog
        open={Boolean(mediaPendingDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setMediaPendingDelete(null)
          }
        }}
        title="Delete this file?"
        description={`"${mediaPendingDelete?.filename ?? "This file"}" will be permanently deleted. This action cannot be undone.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  )
}

export default MediaLibraryPage
