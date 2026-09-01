import { Filter, MoreVertical, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError } from "@/lib/api-client"
import {
  createBlog,
  deleteBlog,
  listBlogs,
  permanentlyDeleteBlog,
  type Blog,
} from "@/lib/blogs"
import { listCategories, type Category } from "@/lib/categories"

const statusLabels: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
}

const statusStyles: Record<string, string> = {
  Published: "bg-[#E3F5E9] text-[#16A34A]",
  Draft: "bg-[#F1F1F3] text-[#6B6B6B]",
  Scheduled: "bg-[#E5F0FC] text-[#2563EB]",
}

const swatchPalette = [
  "#E8C9B4",
  "#B9C6D6",
  "#2C3E50",
  "#D8B4A0",
  "#C9D6E3",
  "#A9C4B8",
  "#D6C2A9",
]

const filters = ["All", "Published", "Draft", "Scheduled"] as const

function swatchFor(id: string | undefined) {
  if (!id) {
    return swatchPalette[0]
  }
  const index = id.charCodeAt(id.length - 1) % swatchPalette.length
  return swatchPalette[index]
}

function initialsFor(name: string | undefined) {
  if (!name) {
    return "?"
  }
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
}

function formatDateTime(dateString?: string) {
  if (!dateString) {
    return "—"
  }
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString("en-CA")
  const timePart = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${datePart} • ${timePart}`
}

function PostsPage() {
  const navigate = useNavigate()

  const [posts, setPosts] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const PAGE_SIZE = 10
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilterIds, setCategoryFilterIds] = useState<string[]>([])
  const [postPendingDelete, setPostPendingDelete] = useState<Blog | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [postPendingPermanentDelete, setPostPendingPermanentDelete] =
    useState<Blog | null>(null)
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    listBlogs()
      .then((data) => {
        if (!cancelled) {
          setPosts(data)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load posts."
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => {
        // Category filter is a nice-to-have; fail silently if it can't load.
      })
  }, [])

  const toggleCategoryFilter = (categoryId: string) => {
    setCategoryFilterIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    )
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const label = statusLabels[post.status ?? ""] ?? "Draft"
      const matchesFilter = filter === "All" || label === filter
      const matchesSearch = (post.title ?? "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesCategory =
        categoryFilterIds.length === 0 ||
        (post.categories ?? []).some(
          (category) =>
            category._id && categoryFilterIds.includes(category._id)
        )
      return matchesFilter && matchesSearch && matchesCategory
    })
  }, [search, filter, categoryFilterIds, posts])

  // Reset to page 1 whenever the filter criteria change, following React's
  // "adjust state during render" pattern instead of an Effect (avoids an
  // extra render pass just to reset pagination).
  const filterKey = `${search}|${filter}|${categoryFilterIds.join(",")}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleDuplicate = async (post: Blog) => {
    try {
      const created = await createBlog({
        title: `${post.title ?? "Untitled"} (Copy)`,
        content: post.content ?? "",
        author: post.author ?? "",
        status: "draft",
        visibility: post.visibility ?? "public",
        tags: post.tags ?? [],
        categories: (post.categories ?? [])
          .map((category) => category._id)
          .filter((id): id is string => Boolean(id)),
      })
      setPosts((current) => [created, ...current])
      toast.success("Post duplicated")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to duplicate post."
      )
    }
  }

  const confirmDelete = async () => {
    if (!postPendingDelete?._id) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteBlog(postPendingDelete._id)
      setPosts((current) =>
        current.filter((item) => item._id !== postPendingDelete._id)
      )
      toast.success("Post deleted")
      setPostPendingDelete(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to delete post."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmPermanentDelete = async () => {
    if (!postPendingPermanentDelete?._id) {
      return
    }
    setIsPermanentlyDeleting(true)
    try {
      await permanentlyDeleteBlog(postPendingPermanentDelete._id)
      setPosts((current) =>
        current.filter((item) => item._id !== postPendingPermanentDelete._id)
      )
      toast.success("Post permanently deleted")
      setPostPendingPermanentDelete(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to permanently delete post."
      )
    } finally {
      setIsPermanentlyDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              All Posts
            </h1>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-4 w-24" />
            ) : (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {posts.length} total posts
              </p>
            )}
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 w-fit shrink-0 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A]"
          >
            <Link to="/posts/new">
              <Plus />
              New Post
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8C8C8C]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts..."
              className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#E8E8EC] bg-white p-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={
                  filter === item
                    ? "rounded-md bg-[#161616] px-3 py-1.5 text-sm font-medium text-white"
                    : "rounded-md px-3 py-1.5 text-sm font-medium text-[#6B6B6B] hover:bg-[#F1F1F3]"
                }
              >
                {item}
              </button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[#E8E8EC] bg-white px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
              >
                <Filter className="size-4" />
                Filter
                {categoryFilterIds.length > 0 && (
                  <Badge className="bg-[#FDECE3] text-[#E97451]">
                    {categoryFilterIds.length}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.length === 0 && (
                <p className="px-2 py-1.5 text-sm text-[#8C8C8C]">
                  No categories yet.
                </p>
              )}
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category._id}
                  checked={categoryFilterIds.includes(category._id ?? "")}
                  onCheckedChange={() =>
                    category._id && toggleCategoryFilter(category._id)
                  }
                  onSelect={(event) => event.preventDefault()}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
              {categoryFilterIds.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setCategoryFilterIds([])}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-[16px] border border-[#E8E8EC] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E8EC] bg-[#FAFAFB] hover:bg-[#FAFAFB]">
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Post
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Author
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Published
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Last Modified
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Views
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-[#E8E8EC]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="size-8 rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                pagedPosts.map((post) => {
                  const label = statusLabels[post.status ?? ""] ?? "Draft"
                  return (
                    <TableRow key={post._id} className="border-[#E8E8EC]">
                      <TableCell>
                        <div className="flex max-w-56 items-center gap-3">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt=""
                              className="size-10 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <span
                              className="size-10 shrink-0 rounded-lg"
                              style={{ backgroundColor: swatchFor(post._id) }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate text-sm font-semibold text-[#161616]">
                            {post.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#4A4A4A]">
                        {post.categories?.[0]?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback className="bg-[#FDECE3] text-xs font-medium text-[#E97451]">
                              {initialsFor(post.author)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#4A4A4A]">
                            {post.author ?? "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[label]}>{label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm whitespace-normal text-[#6B6B6B]">
                        {formatDateTime(post.publishedAt)}
                      </TableCell>
                      <TableCell className="text-sm whitespace-normal text-[#6B6B6B]">
                        {formatDateTime(post.updatedAt)}
                      </TableCell>
                      <TableCell className="text-sm text-[#6B6B6B]">
                        {post.viewCount?.toLocaleString() ?? "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label="Post actions"
                              className="flex size-8 items-center justify-center rounded-lg text-[#8C8C8C] hover:bg-[#F1F1F3] hover:text-[#4A4A4A]"
                            >
                              <MoreVertical className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onSelect={() =>
                                navigate("/posts/new", {
                                  state: { blogId: post._id },
                                })
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDuplicate(post)}
                            >
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setPostPendingDelete(post)}
                            >
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() =>
                                setPostPendingPermanentDelete(post)
                              }
                            >
                              Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}

              {!isLoading && filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-[#8C8C8C]"
                  >
                    No posts match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t border-[#E8E8EC] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#8C8C8C]">
              {filteredPosts.length === 0
                ? `Showing 0 of ${posts.length} posts`
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredPosts.length)} of ${filteredPosts.length} posts`}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E8E8EC] text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:text-[#C4C4C4] disabled:hover:bg-transparent"
              >
                ‹
              </button>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#E97451] text-sm font-semibold text-white">
                {currentPage}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="flex size-8 items-center justify-center rounded-lg border border-[#E8E8EC] text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:cursor-not-allowed disabled:text-[#C4C4C4] disabled:hover:bg-transparent"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={postPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPostPendingDelete(null)
          }
        }}
        title="Delete post?"
        description={`This will remove "${postPendingDelete?.title ?? ""}" from your posts. It won't be visible anywhere, but the record is kept — use "Delete Permanently" instead if you want it gone for good.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <DeleteConfirmDialog
        open={postPendingPermanentDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPostPendingPermanentDelete(null)
          }
        }}
        title="Delete post permanently?"
        description={`This will permanently delete "${postPendingPermanentDelete?.title ?? ""}" and cannot be undone.`}
        onConfirm={confirmPermanentDelete}
        isDeleting={isPermanentlyDeleting}
        confirmLabel="Delete Permanently"
        confirmingLabel="Deleting…"
      />
    </DashboardLayout>
  )
}

export default PostsPage
