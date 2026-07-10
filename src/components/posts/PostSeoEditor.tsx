import { CheckCircle2, Upload, XCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const seoChecklist = [
  { label: "Title tag optimized", passed: true },
  { label: "Meta description present", passed: true },
  { label: "Target keyword in title", passed: true },
  { label: "OG image uploaded", passed: false },
  { label: "Post length > 300 words", passed: true },
]

const seoScore = 82

type PostSeoEditorProps = {
  seoTitle: string
  onSeoTitleChange: (value: string) => void
  metaDescription: string
  onMetaDescriptionChange: (value: string) => void
  canonicalUrl: string
  onCanonicalUrlChange: (value: string) => void
}

function PostSeoEditor({
  seoTitle,
  onSeoTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
}: PostSeoEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
        <h2 className="text-base font-bold text-[#161616]">
          Search Engine Optimization
        </h2>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="seo-title" className="text-sm font-medium text-[#161616]">
            SEO Title
          </Label>
          <Input
            id="seo-title"
            value={seoTitle}
            onChange={(event) => onSeoTitleChange(event.target.value)}
            placeholder="How to Write a Standout CV in 2024 | CVJury"
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="meta-description" className="text-sm font-medium text-[#161616]">
            Meta Description
          </Label>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(event) => onMetaDescriptionChange(event.target.value)}
            placeholder="Learn the essential elements of a compelling CV that gets noticed. Our expert guide covers everything from professional summaries to tailoring your CV for ATS..."
            className="min-h-24 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="canonical-url" className="text-sm font-medium text-[#161616]">
            Canonical URL
          </Label>
          <Input
            id="canonical-url"
            value={canonicalUrl}
            onChange={(event) => onCanonicalUrlChange(event.target.value)}
            placeholder="https://cvjury.com/blog/how-to-write-a-standout-cv"
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
        <h2 className="text-base font-bold text-[#161616]">Open Graph</h2>

        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#161616]">OG Title</Label>
          <Input
            placeholder="Same as SEO title"
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#161616]">
            OG Description
          </Label>
          <Textarea
            placeholder="Same as meta description"
            className="min-h-20 resize-none rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-sm font-medium text-[#161616]">OG Image</Label>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D8D8DC] bg-[#FAFAFA] py-10 text-sm text-[#8C8C8C] hover:bg-[#F1F1F3]"
          >
            <Upload className="size-5" />
            Upload OG image (1200&times;630px recommended)
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#161616]">SEO Score</h2>
          <p className="text-2xl font-bold text-[#16A34A]">
            {seoScore}
            <span className="text-sm font-normal text-[#8C8C8C]">/100</span>
          </p>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E8E8EC]">
          <div
            className="h-full rounded-full bg-[#16A34A]"
            style={{ width: `${seoScore}%` }}
          />
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {seoChecklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm"
            >
              {item.passed ? (
                <CheckCircle2 className="size-4 shrink-0 text-[#16A34A]" />
              ) : (
                <XCircle className="size-4 shrink-0 text-[#E11D48]" />
              )}
              <span className={item.passed ? "text-[#4A4A4A]" : "text-[#B0B0B0]"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { PostSeoEditor }
