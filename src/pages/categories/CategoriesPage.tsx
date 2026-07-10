import { FileText, Filter, Folder, MoreVertical, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api-client"
import {
  createCategory,
  deleteCategory,
  getCategoryPostCounts,
  listCategories,
  updateCategory,
  type Category,
} from "@/lib/categories"

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
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

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [postCounts, setPostCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [postFilter, setPostFilter] = useState<"all" | "has-posts" | "no-posts">(
    "all"
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([listCategories(), getCategoryPostCounts()])
      .then(([categoryList, counts]) => {
        if (!cancelled) {
          setCategories(categoryList)
          setPostCounts(counts)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load categories."
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

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()
    return categories.filter((category) => {
      const matchesSearch =
        !query || (category.name ?? "").toLowerCase().includes(query)
      const count = category._id ? (postCounts[category._id] ?? 0) : 0
      const matchesPostFilter =
        postFilter === "all" ||
        (postFilter === "has-posts" && count > 0) ||
        (postFilter === "no-posts" && count === 0)
      return matchesSearch && matchesPostFilter
    })
  }, [categories, search, postFilter, postCounts])

  const resetForm = () => {
    setEditingCategory(null)
    setName("")
    setSlug("")
    setDescription("")
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setName(category.name ?? "")
    setSlug(category.slug ?? "")
    setDescription(category.description ?? "")
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      if (editingCategory?._id) {
        const updated = await updateCategory(editingCategory._id, {
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim(),
        })
        setCategories((current) =>
          current.map((item) => (item._id === updated._id ? updated : item))
        )
        toast.success("Category updated")
      } else {
        const created = await createCategory({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim(),
        })
        setCategories((current) => [...current, created])
        toast.success("Category created")
      }
      resetForm()
      setDialogOpen(false)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to save category."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!categoryPendingDelete?._id) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteCategory(categoryPendingDelete._id)
      setCategories((current) =>
        current.filter((item) => item._id !== categoryPendingDelete._id)
      )
      toast.success("Category deleted")
      setCategoryPendingDelete(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to delete category."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              All Categories
            </h1>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-4 w-28" />
            ) : (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {categories.length} Categories
              </p>
            )}
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) {
                resetForm()
              }
            }}
          >
            <Button
              size="lg"
              onClick={openCreateDialog}
              className="h-11 w-fit shrink-0 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A]"
            >
              <Plus />
              Add Category
            </Button>
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#161616]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category-name" className="text-sm font-medium text-[#161616]">
                    Name
                  </Label>
                  <Input
                    id="category-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Career Tips"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category-slug" className="text-sm font-medium text-[#161616]">
                    Slug
                  </Label>
                  <Input
                    id="category-slug"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder={name ? slugify(name) : "career-tips"}
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category-description" className="text-sm font-medium text-[#161616]">
                    Description
                  </Label>
                  <Textarea
                    id="category-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Brief description of this category..."
                    className="min-h-24 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <DialogFooter className="-mx-0 -mb-0 rounded-none border-t-0 bg-transparent p-0 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="h-10 rounded-full border border-[#E8E8EC] px-5 text-sm font-semibold text-[#4A4A4A] hover:bg-[#F7F8FA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-10 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving…"
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8C8C8C]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[#E8E8EC] bg-white px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
              >
                <Filter className="size-4" />
                Filter
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by posts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={postFilter}
                onValueChange={(value) =>
                  setPostFilter(value as typeof postFilter)
                }
              >
                <DropdownMenuRadioItem value="all">
                  All categories
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="has-posts">
                  Has posts
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="no-posts">
                  No posts
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-[16px] border border-[#E8E8EC] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E8EC] bg-[#FAFAFB] hover:bg-[#FAFAFB]">
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Slug
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Description
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Posts
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Created
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
                        <Skeleton className="size-9 rounded-lg" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="size-8 rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                filteredCategories.map((category) => (
                  <TableRow key={category._id} className="border-[#E8E8EC]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FDECE3] text-[#E97451]">
                          <Folder className="size-4" />
                        </span>
                        <span className="text-sm font-semibold text-[#161616]">
                          {category.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#8C8C8C]">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-64 truncate text-sm text-[#4A4A4A]">
                        {category.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#161616]">
                        <FileText className="size-3.5 text-[#8C8C8C]" />
                        {(category._id && postCounts[category._id]) ?? 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-normal text-[#6B6B6B]">
                      {formatDateTime(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label="Category actions"
                            className="flex size-8 items-center justify-center rounded-lg text-[#8C8C8C] hover:bg-[#F1F1F3] hover:text-[#4A4A4A]"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => openEditDialog(category)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setCategoryPendingDelete(category)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-[#8C8C8C]"
                  >
                    No categories match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteConfirmDialog
        open={categoryPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryPendingDelete(null)
          }
        }}
        title="Delete category?"
        description={`This will permanently delete "${categoryPendingDelete?.name ?? ""}". This can't be undone.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  )
}

export default CategoriesPage
