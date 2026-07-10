import { CheckCircle2, Globe, Mail, Share2, Upload } from "lucide-react"
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
import logo from "@/assets/images/logo.png"
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
import { ApiError } from "@/lib/api-client"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings"

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)" },
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT)" },
]

type SocialPlatform = "x" | "linkedin" | "facebook" | "instagram"

const socialPlatforms: {
  key: SocialPlatform
  label: string
  glyph: string
  placeholder: string
}[] = [
  { key: "x", label: "X (Twitter)", glyph: "X", placeholder: "https://x.com/cvjury" },
  {
    key: "linkedin",
    label: "LinkedIn",
    glyph: "in",
    placeholder: "https://linkedin.com/company/cvjury",
  },
  {
    key: "facebook",
    label: "Facebook",
    glyph: "f",
    placeholder: "https://facebook.com/cvjury",
  },
  {
    key: "instagram",
    label: "Instagram",
    glyph: "IG",
    placeholder: "https://instagram.com/cvjury",
  },
]

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

function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [siteName, setSiteName] = useState("")
  const [siteLogoUrl, setSiteLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [contactEmail, setContactEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [timezone, setTimezone] = useState("")
  const [socialLinks, setSocialLinks] = useState<Record<SocialPlatform, string>>({
    x: "",
    linkedin: "",
    facebook: "",
    instagram: "",
  })

  useEffect(() => {
    let cancelled = false

    getSiteSettings()
      .then((settings) => {
        if (cancelled) {
          return
        }
        setSiteName(settings.siteName ?? "")
        setSiteLogoUrl(settings.siteLogo ?? "")
        setFaviconUrl(settings.favicon ?? "")
        setContactEmail(settings.contactEmail ?? "")
        setPhone(settings.phone ?? "")
        setAddress(settings.address ?? "")
        setTimezone(settings.timezone ?? "")
        setSocialLinks({
          x: settings.socialLinks?.x ?? "",
          linkedin: settings.socialLinks?.linkedin ?? "",
          facebook: settings.socialLinks?.facebook ?? "",
          instagram: settings.socialLinks?.instagram ?? "",
        })
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load settings."
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSiteSettings({
        siteName,
        siteLogo: siteLogoUrl,
        favicon: faviconUrl,
        contactEmail,
        phone,
        address,
        timezone,
        socialLinks,
      })
      toast.success("Settings saved")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to save settings."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploadingLogo(true)
    try {
      const url = await uploadAndRegisterImage(file, `${siteName || "Site"} logo`)
      setSiteLogoUrl(url)
      toast.success("Logo uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to upload logo.")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleFaviconFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploadingFavicon(true)
    try {
      const url = await uploadAndRegisterImage(
        file,
        `${siteName || "Site"} favicon`
      )
      setFaviconUrl(url)
      toast.success("Favicon uploaded")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload favicon."
      )
    } finally {
      setIsUploadingFavicon(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              General Settings
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Manage your site information and preferences.
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

        <SectionCard icon={Globe} title="Site Identity">
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-name" className="text-sm font-medium text-[#161616]">
              Site Name
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="site-name"
                value={siteName}
                onChange={(event) => setSiteName(event.target.value)}
                placeholder="CVJury"
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#161616]">Logo</Label>
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#FDECE3]">
                <img
                  src={siteLogoUrl || logo}
                  alt="Current logo"
                  className="h-8 w-auto"
                />
              </span>
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFileChange}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E8E8EC] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:opacity-50"
                >
                  <Upload className="size-4" />
                  {isUploadingLogo ? "Uploading…" : "Upload Logo"}
                </button>
                <p className="mt-1.5 text-xs text-[#8C8C8C]">
                  SVG, PNG or JPG. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#161616]">
              Favicon
            </Label>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FDECE3]">
                <img
                  src={faviconUrl || logo}
                  alt="Current favicon"
                  className="h-5 w-auto"
                />
              </span>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFaviconFileChange}
              />
              <button
                type="button"
                onClick={() => faviconInputRef.current?.click()}
                disabled={isUploadingFavicon}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E8E8EC] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:opacity-50"
              >
                <Upload className="size-4" />
                {isUploadingFavicon ? "Uploading…" : "Upload Favicon"}
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Mail} title="Contact Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email" className="text-sm font-medium text-[#161616]">
                Contact Email
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  placeholder="hello@cvjury.com"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-sm font-medium text-[#161616]">
                Phone
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+44 20 1234 5678"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address" className="text-sm font-medium text-[#161616]">
              Address
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="123 High Street, London, UK"
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#161616]">
              Timezone
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-10 w-full rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </SectionCard>

        <SectionCard icon={Share2} title="Social Links">
          {socialPlatforms.map((social) => (
            <div key={social.key} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E8E8EC] text-xs font-semibold text-[#4A4A4A]"
              >
                {social.glyph}
              </span>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  aria-label={social.label}
                  value={socialLinks[social.key]}
                  onChange={(event) =>
                    setSocialLinks((current) => ({
                      ...current,
                      [social.key]: event.target.value,
                    }))
                  }
                  placeholder={social.placeholder}
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              )}
            </div>
          ))}
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}

export default GeneralSettingsPage
