import { getStoredUser } from "@/lib/auth"
import { DEFAULT_COLOR } from "@/lib/colors"
import type { Block, BlockType } from "@/lib/blocks/types"

function newId() {
  return crypto.randomUUID()
}

function currentAuthorProfile() {
  const user = getStoredUser()
  return {
    name: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "",
    title: user?.title ?? "",
    avatarUrl: user?.profileImage ?? "",
    bio: user?.bio ?? "",
  }
}

export function createBlock(type: BlockType): Block {
  const id = newId()

  switch (type) {
    case "richtext":
      return { id, type, html: "" }
    case "heading":
      return { id, type, text: "", level: 2 }
    case "image":
      return { id, type, src: "", alt: "", caption: "" }
    case "quote":
      return { id, type, text: "", source: "" }
    case "callout":
      return { id, type, title: "Key Takeaways", items: [""] }
    case "summary":
      return { id, type, label: "Summary", text: "" }
    case "scanStrip":
      return { id, type, badgeText: "", title: "", description: "" }
    case "statRow":
      return {
        id,
        type,
        stats: [{ value: "", label: "", color: DEFAULT_COLOR }],
      }
    case "statGrid":
      return { id, type, stats: [{ value: "", label: "", variant: "green" }] }
    case "dosDonts":
      return { id, type, dos: [""], donts: [""] }
    case "table":
      return { id, type, headers: ["", ""], rows: [["", ""]] }
    case "featureGrid":
      return { id, type, items: [{ title: "", description: "" }] }
    case "checklist":
      return { id, type, title: "", items: [""] }
    case "stepFlow":
      return { id, type, title: "", steps: [{ title: "", description: "" }] }
    case "numberedList":
      return { id, type, items: [{ title: "", description: "" }] }
    case "authorBio":
      return {
        id,
        type,
        ...currentAuthorProfile(),
        bioLinkLabel: "",
        bioLinkUrl: "",
        badges: [],
      }
    case "shortAnswer":
      return {
        id,
        type,
        title: "",
        body: "",
        cards: [{ heading: "", body: "" }],
      }
    case "atsScoreCard":
      return {
        id,
        type,
        url: "",
        badge: "ILLUSTRATIVE EXAMPLE",
        imageSrc: "",
        imageAlt: "",
      }
    case "atsVisualFlow":
      return {
        id,
        type,
        score: 80,
        label: "ATS Scan",
        nextStep: "",
        tags: [],
        status: "",
      }
    case "compactScan":
      return { id, type, label: "ATS Scan", status: "", nextStep: "", description: "" }
    case "pullQuote":
      return { id, type, quote: "", attribution: "" }
    case "beforeAfter":
      return {
        id,
        type,
        title: "",
        subtitle: "",
        beforeText: "",
        beforeNote: "",
        afterText: "",
        afterTags: [],
      }
    case "editorialTip":
      return {
        id,
        type,
        heading: "",
        note: "",
        leftLabel: "Job Advert",
        rightLabel: "Resume Phrase",
        rows: [{ left: "", right: "" }],
      }
    case "atsMatchMap":
      return {
        id,
        type,
        title: "ATS MATCH MAP",
        subtitle: "What your resume must prove",
        description:
          "A strong ATS resume is not a keyword dump. These four signals need to work together.",
        signals: [
          {
            title: "Clear document structure",
            body: "Use a one-column layout, standard headings, visible contact details, and consistent dates so the parser can place your information in the right fields.",
            wide: true,
          },
          {
            title: "Role-matched language",
            body: "Mirror the job advert where it is truthful, especially tools, skills, certifications, and job titles.",
            wide: false,
          },
          {
            title: "Human handoff",
            body: "The ATS may help sort the resume, but a recruiter still needs to see fit, credibility, and clear value fast.",
            wide: false,
          },
          {
            title: "Evidence behind the keywords",
            body: "Back important keywords with outcomes, scale, numbers, responsibilities, or examples from real work.",
            wide: true,
          },
        ],
      }
    case "safeHeadings":
      return {
        id,
        type,
        safeLabel: "Safe Heading",
        avoidLabel: "Avoid",
        rows: [{ safe: "", avoid: "" }],
      }
    case "guidanceNote":
      return { id, type, tone: "tip", text: "" }
    case "cvTemplateShowcase":
      return {
        id,
        type,
        label: "CVJury Template (1 in 1)",
        name: "",
        images: [{ src: "", alt: "" }],
      }
    case "achievementCards":
      return {
        id,
        type,
        weakLabel: "Weak Duty",
        strongLabel: "Strong Resume Achievement",
        pairs: [{ weak: "", strong: "" }],
      }
    case "achievementLevels":
      return {
        id,
        type,
        items: [
          {
            label: "Weak",
            body: "Responsible for answering customer complaints.",
            tone: "weak",
          },
          {
            label: "Stronger",
            body: "Resolved customer complaints across phone and email, recorded agreed actions, and kept urgent cases moving to the right team.",
            tone: "strong",
          },
          {
            label: "Stronger with a verified result",
            body: "Resolved 25 to 35 weekly complaints across phone and email, cutting repeat contacts after introducing a shared follow-up log.",
            tone: "strong",
          },
        ],
      }
    case "infographicSteps":
      return {
        id,
        type,
        eyebrow: "INFOGRAPHIC",
        title: "The 5-Step ATS Pass-through workflow",
        steps: [
          {
            number: "STEP 1",
            title: "Read the job advert",
            body: "Highlight repeated skills tools, certifications, and must-have terms.",
          },
          {
            number: "STEP 2",
            title: "Match your language",
            body: "Use exact phrases where they are honest and relevant.",
          },
          {
            number: "STEP 3",
            title: "Clean the layout",
            body: "Use one column, standard headings, and body text contact details.",
          },
          {
            number: "STEP 4",
            title: "Prove the skills",
            body: "Add outcomes, numbers, scale, tools, and examples in work bullets.",
          },
          {
            number: "STEP 5",
            title: "Test before upload",
            body: "Check file type, text order, links, dates, spelling, and final instructions.",
          },
        ],
        result: "",
      }
    case "numberedItem":
      return { id, type, number: "01", title: "", body: "" }
    case "proofCards":
      return {
        id,
        type,
        cards: [
          {
            type: "TIME",
            value: "90 min",
            description: "Cut weekly reporting time from four hours to 90 minutes.",
          },
          {
            type: "SCALE",
            value: "85+",
            description: "Processed 85+ invoices each week with fewer missing details.",
          },
          {
            type: "QUALITY",
            value: "22%",
            description: "Reduced data-entry errors by 22% after adding a second check.",
          },
        ],
      }
    case "darkCta":
      return {
        id,
        type,
        badge: "",
        title: "",
        body: "",
        primaryCta: "",
        secondaryCta: "",
        bestNextStepLabel: "Best Next Step",
        bestNextStep: "",
        tagline: "",
      }
    case "faq":
      return {
        id,
        type,
        title: "Frequently Asked Questions",
        items: [{ question: "", answer: "" }],
      }
    case "citations":
      return {
        id,
        type,
        items: [{ org: "", title: "", usage: "", date: "", url: "" }],
      }
    case "updateLog":
      return { id, type, title: "Update Note", text: "" }
    case "insightsData":
      return {
        id,
        type,
        eyebrow: "INSIGHTS FROM THE DATA",
        description:
          "Research from Jobscan, Glassdoor, and the Harvard Business Review reveals just how significant the ATS problem is for job seekers in 2025.",
        stats: [
          { value: "98%", label: "Fortune 500 companies use ATS software", source: "Jobscan, 2024" },
          { value: "75%", label: "Resumes rejected before human review", source: "TopResume, 2024", highlighted: true },
          { value: "250", label: "Average applications per corporate role", source: "Glassdoor, 2024" },
          { value: "47%", label: "ATS score boost from tailored resume", source: "CVJury Research, 2025" },
          { value: "6 sec", label: "Average recruiter time spent per resume", source: "Ladders Eye-tracking, 2018" },
          { value: "2x", label: "More interviews from ATS-optimised resumes", source: "Jobscan, 2024" },
        ],
        quote:
          "A resume that isn't ATS-optimised isn't just less competitive — it may never be seen by a human at all.",
        quoteSource: "Harvard Business Review, 'Your Approach to Hiring Is All Wrong', 2019",
      }
  }
}
