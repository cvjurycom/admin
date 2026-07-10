import {
  Award,
  CheckCircle2,
  FileText,
  ImagePlus,
  MapPin,
  Tag as TagIcon,
  User,
  X,
} from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api-client"
import { getStoredUser, setStoredUser } from "@/lib/auth"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import { getMyProfile, updateMyProfile } from "@/lib/profile"
import { listTags, type Tag } from "@/lib/tags"

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[16px] border border-[#E8E8EC] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[#E97451]" />
        <h2 className="text-base font-bold text-[#161616]">{title}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  )
}

function initialsFor(firstName: string, lastName: string) {
  return ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?"
}

function ProfilePage() {
  const storedUser = getStoredUser()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
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
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false

    getMyProfile()
      .then((profile) => {
        if (cancelled) {
          return
        }
        setEmail(profile.email ?? "")
        setFirstName(profile.firstName ?? "")
        setLastName(profile.lastName ?? "")
        setTitle(profile.title ?? "")
        setPhone(profile.phone ?? "")
        setLocation(profile.location ?? "")
        setExperience(profile.experience ?? "")
        setBio(profile.bio ?? "")
        setProfileImageUrl(profile.profileImage ?? "")
        setTags(profile.tags ?? [])
        setCertifications(profile.certifications ?? [])
        setPositionTitle(profile.position?.title ?? "")
        setPositionOrder(
          profile.position?.order !== undefined
            ? String(profile.position.order)
            : ""
        )
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load profile."
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
    listTags()
      .then(setAvailableTags)
      .catch(() => {
        // Tag picker is a nice-to-have; fail silently if it can't load.
      })
  }, [])

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
        `${firstName || "Profile"} photo`
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

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required.")
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

    setIsSaving(true)
    try {
      const updated = await updateMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
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

      if (storedUser) {
        setStoredUser({ ...storedUser, ...updated })
      }

      toast.success("Profile updated")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to update profile."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Manage your personal information.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="flex h-11 w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
          >
            <CheckCircle2 className="size-4" />
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <SectionCard icon={User} title="Profile Photo">
          <div className="flex items-center gap-3">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {isLoading ? (
              <Skeleton className="size-14 rounded-full" />
            ) : (
              <Avatar className="size-14">
                {profileImageUrl ? (
                  <AvatarImage src={profileImageUrl} alt="" />
                ) : null}
                <AvatarFallback className="bg-[#FDECE3] font-medium text-[#E97451]">
                  {initialsFor(firstName, lastName)}
                </AvatarFallback>
              </Avatar>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar || isLoading}
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
        </SectionCard>

        <SectionCard icon={User} title="Basic Info">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-first-name"
                className="text-sm font-medium text-[#161616]"
              >
                First Name
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-last-name"
                className="text-sm font-medium text-[#161616]"
              >
                Last Name
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="profile-email"
              className="text-sm font-medium text-[#161616]"
            >
              Email
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="profile-email"
                type="email"
                value={email}
                disabled
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F1F1F3] text-[#8C8C8C]"
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-title"
                className="text-sm font-medium text-[#161616]"
              >
                Title
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Career Coach"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-phone"
                className="text-sm font-medium text-[#161616]"
              >
                Phone
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 555 000 0000"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={MapPin} title="Location & Experience">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-location"
                className="text-sm font-medium text-[#161616]"
              >
                Location
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Lagos, Nigeria"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-experience"
                className="text-sm font-medium text-[#161616]"
              >
                Experience
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-experience"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  placeholder="5+ years"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={FileText} title="Bio">
          {isLoading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : (
            <Textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="A short bio about yourself..."
              className="min-h-20 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
            />
          )}
        </SectionCard>

        <SectionCard icon={TagIcon} title="Tags">
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
          {isLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
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
          )}
        </SectionCard>

        <SectionCard icon={Award} title="Certifications">
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
          {isLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
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
          )}
        </SectionCard>

        <SectionCard icon={MapPin} title="Position">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-position-title"
                className="text-sm font-medium text-[#161616]"
              >
                Position Title
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-position-title"
                  value={positionTitle}
                  onChange={(event) => setPositionTitle(event.target.value)}
                  placeholder="Lead Author"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="profile-position-order"
                className="text-sm font-medium text-[#161616]"
              >
                Display Order
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="profile-position-order"
                  type="number"
                  value={positionOrder}
                  onChange={(event) => setPositionOrder(event.target.value)}
                  placeholder="0"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
