import { Bird, CheckCircle2, Eye, Globe, Layers, Share2, Upload } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api-client"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings"

const DEFAULT_META_TITLE =
  "CVJury — Professional CV Builder & Career Resources"
const DEFAULT_META_DESCRIPTION =
  "Build a professional CV in minutes with CVJury. Access expert career advice, templates, and tools to land your dream job. Trusted by 50,000+ professionals."

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

function SeoSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [robotsTxt, setRobotsTxt] = useState("")
  const [ogTitle, setOgTitle] = useState("")
  const [ogDescription, setOgDescription] = useState("")
  const [ogImageUrl, setOgImageUrl] = useState("")
  const [isUploadingOgImage, setIsUploadingOgImage] = useState(false)
  const ogImageInputRef = useRef<HTMLInputElement>(null)
  const [twitterCardType, setTwitterCardType] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")

  // Not present on the SiteSetting API schema — kept as local-only UI state.
  const [sitemapEnabled, setSitemapEnabled] = useState(true)
  const [schemaMarkupEnabled, setSchemaMarkupEnabled] = useState(true)
  const [canonicalUrlBase, setCanonicalUrlBase] = useState("")

  useEffect(() => {
    let cancelled = false

    getSiteSettings()
      .then((settings) => {
        if (cancelled) {
          return
        }
        setMetaTitle(settings.metaTitle ?? "")
        setMetaDescription(settings.metaDescription ?? "")
        setRobotsTxt(settings.robotsTxt ?? "")
        setOgTitle(settings.ogTitle ?? "")
        setOgDescription(settings.ogDescription ?? "")
        setOgImageUrl(settings.ogImage ?? "")
        setTwitterCardType(settings.twitterCardType ?? "")
        setTwitterHandle(settings.twitterHandle ?? "")
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
        metaTitle,
        metaDescription,
        robotsTxt,
        ogTitle,
        ogDescription,
        ogImage: ogImageUrl,
        twitterCardType: twitterCardType as
          | "summary"
          | "summary_large_image"
          | "app"
          | "player"
          | undefined,
        twitterHandle,
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

  const handleOgImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploadingOgImage(true)
    try {
      const url = await uploadAndRegisterImage(file, "Default OG image")
      setOgImageUrl(url)
      toast.success("OG image uploaded")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload OG image."
      )
    } finally {
      setIsUploadingOgImage(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              SEO Settings
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Configure global SEO defaults for your site.
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

        <SectionCard icon={Eye} title="Google Preview">
          <div className="rounded-lg bg-[#F7F8FA] p-4">
            <p className="text-sm text-[#4A4A4A]">cvjury.com</p>
            <p className="mt-1 text-lg text-[#1A0DAB] hover:underline">
              {metaTitle || DEFAULT_META_TITLE}
            </p>
            <p className="mt-1 text-sm text-[#4A4A4A]">
              {metaDescription || DEFAULT_META_DESCRIPTION}
            </p>
          </div>
        </SectionCard>

        <SectionCard icon={Globe} title="Global Meta Tags">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-title" className="text-sm font-medium text-[#161616]">
              Global Meta Title
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                placeholder="CVJury — Professional CV Builder & Career Resources"
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-description" className="text-sm font-medium text-[#161616]">
              Meta Description
            </Label>
            {isLoading ? (
              <Skeleton className="h-20 w-full rounded-lg" />
            ) : (
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                placeholder="Build a professional CV in minutes with CVJury. Access expert career advice, templates, and tools to land your dream job."
                className="min-h-20 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="robots-txt" className="text-sm font-medium text-[#161616]">
              Robots.txt
            </Label>
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <Textarea
                id="robots-txt"
                value={robotsTxt}
                onChange={(event) => setRobotsTxt(event.target.value)}
                placeholder={"User-agent: *\nAllow: /\nSitemap: https://cvjury.com/sitemap.xml"}
                className="min-h-24 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] font-mono text-xs"
              />
            )}
          </div>
        </SectionCard>

        <SectionCard icon={Share2} title="Open Graph Defaults">
          <div className="flex flex-col gap-2">
            <Label htmlFor="og-title" className="text-sm font-medium text-[#161616]">
              OG Title
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="og-title"
                value={ogTitle}
                onChange={(event) => setOgTitle(event.target.value)}
                placeholder="CVJury — Professional CV Builder"
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="og-description" className="text-sm font-medium text-[#161616]">
              OG Description
            </Label>
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-lg" />
            ) : (
              <Textarea
                id="og-description"
                value={ogDescription}
                onChange={(event) => setOgDescription(event.target.value)}
                placeholder="Build a professional CV in minutes..."
                className="min-h-16 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#161616]">
              Default OG Image
            </Label>
            <input
              ref={ogImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleOgImageFileChange}
            />
            <button
              type="button"
              onClick={() => ogImageInputRef.current?.click()}
              disabled={isUploadingOgImage}
              className="flex items-center gap-3 rounded-lg border border-dashed border-[#D8D8DC] bg-white px-4 py-4 text-left hover:bg-[#FAFAFA] disabled:opacity-50"
            >
              {ogImageUrl ? (
                <img
                  src={ogImageUrl}
                  alt="Default OG image preview"
                  className="h-12 w-20 shrink-0 rounded-md object-cover"
                />
              ) : (
                <Upload className="size-4 shrink-0 text-[#8C8C8C]" />
              )}
              <span>
                <span className="block text-sm font-medium text-[#161616]">
                  {isUploadingOgImage
                    ? "Uploading…"
                    : ogImageUrl
                      ? "Replace OG image"
                      : "Upload default OG image"}
                </span>
                <span className="block text-xs text-[#8C8C8C]">
                  Recommended: 1200&times;630px
                </span>
              </span>
            </button>
          </div>
        </SectionCard>

        <SectionCard icon={Bird} title="Twitter Cards">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#161616]">
              Card Type
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Select value={twitterCardType} onValueChange={setTwitterCardType}>
                <SelectTrigger className="h-10 w-full rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]">
                  <SelectValue placeholder="Select Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">
                    Summary with Large Image
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="twitter-handle" className="text-sm font-medium text-[#161616]">
              Twitter Handle
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                id="twitter-handle"
                value={twitterHandle}
                onChange={(event) => setTwitterHandle(event.target.value)}
                placeholder="@cvjury"
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            )}
          </div>
        </SectionCard>

        <SectionCard icon={Layers} title="Advanced">
          <div className="flex items-center justify-between gap-4 border-b border-[#E8E8EC] pb-5">
            <div>
              <p className="text-sm font-semibold text-[#161616]">Sitemap</p>
              <p className="text-xs text-[#8C8C8C]">
                Auto-generate and submit XML sitemap to search engines
              </p>
            </div>
            <Switch
              checked={sitemapEnabled}
              onCheckedChange={setSitemapEnabled}
              className="data-checked:!bg-[#E97451]"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-[#E8E8EC] pb-5">
            <div>
              <p className="text-sm font-semibold text-[#161616]">
                Schema Markup
              </p>
              <p className="text-xs text-[#8C8C8C]">
                Add structured data to improve rich search results
              </p>
            </div>
            <Switch
              checked={schemaMarkupEnabled}
              onCheckedChange={setSchemaMarkupEnabled}
              className="data-checked:!bg-[#E97451]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="canonical-url-base" className="text-sm font-medium text-[#161616]">
              Canonical URL Base
            </Label>
            <Input
              id="canonical-url-base"
              value={canonicalUrlBase}
              onChange={(event) => setCanonicalUrlBase(event.target.value)}
              placeholder="https://cvjury.com"
              className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
            />
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  )
}

export default SeoSettingsPage
