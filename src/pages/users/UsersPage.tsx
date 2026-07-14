import { ImagePlus, MoreVertical, Plus, Search, UserPlus, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { uploadAndRegisterImage } from "@/lib/image-upload"
import { listTags, type Tag } from "@/lib/tags"
import {
  createUser,
  deleteUser,
  listUsers,
  setUserActive,
  updateUser,
  type AuthorUser,
} from "@/lib/users"

type SelectableUserType = "author" | "reviewer"

function fullName(user: AuthorUser) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—"
}

function initialsFor(user: AuthorUser) {
  return (
    (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
  ).toUpperCase() || "?"
}

const USER_TYPE_BADGES: Record<string, { label: string; className: string }> =
  {
    admin: { label: "Admin", className: "bg-[#F3E8FF] text-[#7C3AED]" },
    author: { label: "Author", className: "bg-[#FDECE3] text-[#E97451]" },
    reviewer: { label: "Reviewer", className: "bg-[#EAF2FE] text-[#2563EB]" },
  }

function userTypeBadge(userType?: string) {
  return USER_TYPE_BADGES[userType ?? "author"] ?? USER_TYPE_BADGES.author
}

function formatDate(dateString?: string) {
  if (!dateString) {
    return "—"
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function UsersPage() {
  const [users, setUsers] = useState<AuthorUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AuthorUser | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userType, setUserType] = useState<SelectableUserType>("author")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [title, setTitle] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState("")
  const [bio, setBio] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [certificationInput, setCertificationInput] = useState("")
  const [positionTitle, setPositionTitle] = useState("")
  const [positionOrder, setPositionOrder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [userPendingDelete, setUserPendingDelete] = useState<AuthorUser | null>(
    null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const [userPendingToggle, setUserPendingToggle] = useState<AuthorUser | null>(
    null
  )
  const [isTogglingActive, setIsTogglingActive] = useState(false)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load authors."
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    listTags()
      .then(setAvailableTags)
      .catch(() => {
        // Tag picker is a nice-to-have; fail silently if it can't load.
      })
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return users
    }
    return users.filter(
      (user) =>
        fullName(user).toLowerCase().includes(query) ||
        (user.email ?? "").toLowerCase().includes(query)
    )
  }, [users, search])

  const resetForm = () => {
    setEditingUser(null)
    setFirstName("")
    setLastName("")
    setUserType("author")
    setEmail("")
    setPassword("")
    setTitle("")
    setPhone("")
    setLocation("")
    setExperience("")
    setBio("")
    setProfileImageUrl("")
    setTags([])
    setCertifications([])
    setCertificationInput("")
    setPositionTitle("")
    setPositionOrder("")
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (user: AuthorUser) => {
    setEditingUser(user)
    setFirstName(user.firstName ?? "")
    setLastName(user.lastName ?? "")
    setEmail(user.email ?? "")
    setPassword("")
    setTitle(user.title ?? "")
    setPhone(user.phone ?? "")
    setLocation(user.location ?? "")
    setExperience(user.experience ?? "")
    setBio(user.bio ?? "")
    setProfileImageUrl(user.profileImage ?? "")
    setTags(user.tags ?? [])
    setCertifications(user.certifications ?? [])
    setCertificationInput("")
    setPositionTitle(user.position?.title ?? "")
    setPositionOrder(
      user.position?.order !== undefined ? String(user.position.order) : ""
    )
    setDialogOpen(true)
  }

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploadingAvatar(true)
    try {
      const url = await uploadAndRegisterImage(
        file,
        `${firstName || "Author"} profile photo`
      )
      setProfileImageUrl(url)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload photo."
      )
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const toggleTag = (tagName: string) => {
    setTags((current) =>
      current.includes(tagName) ? current : [...current, tagName]
    )
  }

  const removeTag = (tagName: string) => {
    setTags((current) => current.filter((item) => item !== tagName))
  }

  const addCertification = () => {
    const value = certificationInput.trim()
    if (!value || certifications.includes(value)) {
      return
    }
    setCertifications((current) => [...current, value])
    setCertificationInput("")
  }

  const removeCertification = (value: string) => {
    setCertifications((current) => current.filter((item) => item !== value))
  }

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("First name, last name, and email are required.")
      return
    }
    if (!editingUser && !password.trim()) {
      toast.error("Password is required.")
      return
    }
    if (password.trim() && password.trim().length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    const position =
      positionTitle.trim() || positionOrder.trim()
        ? {
            title: positionTitle.trim() || undefined,
            order: positionOrder.trim() ? Number(positionOrder) : undefined,
          }
        : undefined

    const pendingCertification = certificationInput.trim()
    const finalCertifications =
      pendingCertification && !certifications.includes(pendingCertification)
        ? [...certifications, pendingCertification]
        : certifications

    setIsSubmitting(true)
    try {
      if (editingUser?._id) {
        const updated = await updateUser(editingUser._id, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          ...(password.trim() ? { password: password.trim() } : {}),
          title: title.trim() || undefined,
          phone: phone.trim() || undefined,
          location: location.trim() || undefined,
          experience: experience.trim() || undefined,
          bio: bio.trim() || undefined,
          profileImage: profileImageUrl || undefined,
          tags: tags.length > 0 ? tags : undefined,
          certifications:
            finalCertifications.length > 0 ? finalCertifications : undefined,
          position,
        })
        setUsers((current) =>
          current.map((item) => (item._id === updated._id ? updated : item))
        )
        toast.success("Author updated")
      } else {
        const created = await createUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
          title: title.trim() || undefined,
          phone: phone.trim() || undefined,
          location: location.trim() || undefined,
          experience: experience.trim() || undefined,
          bio: bio.trim() || undefined,
          profileImage: profileImageUrl || undefined,
          tags: tags.length > 0 ? tags : undefined,
          certifications:
            finalCertifications.length > 0 ? finalCertifications : undefined,
          position,
          isActive: true,
        })
        setUsers((current) => [created, ...current])
        toast.success("Author added")
      }
      resetForm()
      setDialogOpen(false)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to save author."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmToggleActive = async () => {
    if (!userPendingToggle?._id) {
      return
    }
    setIsTogglingActive(true)
    try {
      const updated = await setUserActive(
        userPendingToggle._id,
        !userPendingToggle.isActive
      )
      setUsers((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      )
      toast.success(updated.isActive ? "Author activated" : "Author deactivated")
      setUserPendingToggle(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to update author."
      )
    } finally {
      setIsTogglingActive(false)
    }
  }

  const confirmDelete = async () => {
    if (!userPendingDelete?._id) {
      return
    }
    setIsDeleting(true)
    try {
      await deleteUser(userPendingDelete._id)
      setUsers((current) =>
        current.filter((item) => item._id !== userPendingDelete._id)
      )
      toast.success("Author removed")
      setUserPendingDelete(null)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to remove author."
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
              Authors
            </h1>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-4 w-24" />
            ) : (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {users.length} authors
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
              Add Author
            </Button>
            <DialogContent
              className="max-h-[85vh] overflow-y-auto sm:max-w-md"
              showCloseButton
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#161616]">
                  {editingUser ? "Edit Author" : "Add New Author"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Avatar className="size-14">
                  {profileImageUrl ? (
                    <AvatarImage src={profileImageUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-[#FDECE3] font-medium text-[#E97451]">
                    {initialsFor({ firstName, lastName })}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E8E8EC] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:opacity-50"
                >
                  <ImagePlus className="size-4" />
                  {isUploadingAvatar
                    ? "Uploading…"
                    : profileImageUrl
                      ? "Replace photo"
                      : "Add photo"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-first-name"
                    className="text-sm font-medium text-[#161616]"
                  >
                    First Name
                  </Label>
                  <Input
                    id="user-first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Sarah"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-last-name"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="user-last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Mitchell"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#161616]">
                  User Type
                </Label>
                <Select
                  value={userType}
                  onValueChange={(value) =>
                    setUserType(value as SelectableUserType)
                  }
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="user-email"
                  className="text-sm font-medium text-[#161616]"
                >
                  Email
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="sarah@cvjury.dev"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="user-password"
                  className="text-sm font-medium text-[#161616]"
                >
                  Password{" "}
                  {editingUser && (
                    <span className="font-normal text-[#8C8C8C]">
                      (leave blank to keep current password)
                    </span>
                  )}
                </Label>
                <PasswordInput
                  id="user-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-title"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Title{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Career Coach"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-phone"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Phone{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+1 555 000 0000"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-location"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Location{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Lagos, Nigeria"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-experience"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Experience{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-experience"
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    placeholder="5+ years"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="user-bio"
                  className="text-sm font-medium text-[#161616]"
                >
                  Bio{" "}
                  <span className="font-normal text-[#8C8C8C]">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="user-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="A short author bio..."
                  className="min-h-20 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#161616]">
                  Tags{" "}
                  <span className="font-normal text-[#8C8C8C]">
                    (optional)
                  </span>
                </Label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tagName) => {
                      const tagColor =
                        availableTags.find((item) => item.name === tagName)
                          ?.color ?? "#E97451"
                      return (
                        <span
                          key={tagName}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${tagColor}1A`,
                            color: tagColor,
                          }}
                        >
                          {tagName}
                          <button
                            type="button"
                            aria-label={`Remove ${tagName}`}
                            onClick={() => removeTag(tagName)}
                            className="hover:opacity-70"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
                <Select
                  value=""
                  onValueChange={toggleTag}
                  disabled={availableTags.length === 0}
                >
                  <SelectTrigger className="h-10 w-full rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]">
                    <SelectValue
                      placeholder={
                        availableTags.length === 0
                          ? "No tags created yet"
                          : "Add tag..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags
                      .filter((item) => item.name && !tags.includes(item.name))
                      .map((item) => (
                        <SelectItem
                          key={item._id ?? item.name}
                          value={item.name ?? ""}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#161616]">
                  Certifications{" "}
                  <span className="font-normal text-[#8C8C8C]">
                    (optional)
                  </span>
                </Label>
                {certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((value) => (
                      <span
                        key={value}
                        className="flex items-center gap-1.5 rounded-full bg-[#F1F1F3] px-3 py-1 text-xs font-medium text-[#4A4A4A]"
                      >
                        {value}
                        <button
                          type="button"
                          aria-label={`Remove ${value}`}
                          onClick={() => removeCertification(value)}
                          className="hover:opacity-70"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={certificationInput}
                    onChange={(event) =>
                      setCertificationInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        addCertification()
                      }
                    }}
                    placeholder="e.g. AWS Certified Developer"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="h-10 shrink-0 rounded-lg border border-[#E8E8EC] px-4 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-position-title"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Position Title{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-position-title"
                    value={positionTitle}
                    onChange={(event) => setPositionTitle(event.target.value)}
                    placeholder="Lead Author"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="user-position-order"
                    className="text-sm font-medium text-[#161616]"
                  >
                    Display Order{" "}
                    <span className="font-normal text-[#8C8C8C]">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="user-position-order"
                    type="number"
                    value={positionOrder}
                    onChange={(event) => setPositionOrder(event.target.value)}
                    placeholder="0"
                    className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
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
                  className="flex h-10 items-center gap-1.5 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
                >
                  <UserPlus className="size-4" />
                  {isSubmitting
                    ? editingUser
                      ? "Saving…"
                      : "Adding…"
                    : editingUser
                      ? "Save Changes"
                      : "Add Author"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8C8C8C]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search authors..."
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
          />
        </div>

        <div className="rounded-[16px] border border-[#E8E8EC] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8E8EC] bg-[#FAFAFB] hover:bg-[#FAFAFB]">
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Author
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Type
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Last Login
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
                  Joined
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="border-[#E8E8EC]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
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
                      <Skeleton className="size-8 rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                filteredUsers.map((user) => (
                  <TableRow key={user._id} className="border-[#E8E8EC]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {user.profileImage ? (
                            <AvatarImage src={user.profileImage} alt="" />
                          ) : null}
                          <AvatarFallback className="bg-[#FDECE3] text-xs font-medium text-[#E97451]">
                            {initialsFor(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#161616]">
                            {fullName(user)}
                          </p>
                          <p className="truncate text-xs text-[#8C8C8C]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={userTypeBadge(user.__t).className}>
                        {userTypeBadge(user.__t).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.isActive
                            ? "bg-[#E3F5E9] text-[#16A34A]"
                            : "bg-[#F1F1F3] text-[#6B6B6B]"
                        }
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#6B6B6B]">
                      {formatDate(user.lastLoginAt)}
                    </TableCell>
                    <TableCell className="text-sm text-[#6B6B6B]">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label="Author actions"
                            className="flex size-8 items-center justify-center rounded-lg text-[#8C8C8C] hover:bg-[#F1F1F3] hover:text-[#4A4A4A]"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => openEditDialog(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setUserPendingToggle(user)}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setUserPendingDelete(user)}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-[#8C8C8C]"
                  >
                    No authors match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteConfirmDialog
        open={userPendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUserPendingDelete(null)
          }
        }}
        title="Remove this author?"
        description={`"${fullName(userPendingDelete ?? {})}" will lose access immediately. This can't be undone.`}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <ConfirmDialog
        open={userPendingToggle !== null}
        onOpenChange={(open) => {
          if (!open) {
            setUserPendingToggle(null)
          }
        }}
        title={
          userPendingToggle?.isActive
            ? "Deactivate this author?"
            : "Activate this author?"
        }
        description={
          userPendingToggle?.isActive
            ? `"${fullName(userPendingToggle ?? {})}" will immediately lose access until reactivated.`
            : `"${fullName(userPendingToggle ?? {})}" will regain access right away.`
        }
        confirmLabel={userPendingToggle?.isActive ? "Deactivate" : "Activate"}
        loadingLabel={userPendingToggle?.isActive ? "Deactivating…" : "Activating…"}
        onConfirm={confirmToggleActive}
        isLoading={isTogglingActive}
      />
    </DashboardLayout>
  )
}

export default UsersPage
