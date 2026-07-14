import type { Block } from "@/lib/blocks/types"

function id() {
  return crypto.randomUUID()
}

export const ATS_TEMPLATE_TITLE =
  "How to Beat the ATS: A Practical Guide to Getting Your Resume Seen in 2025"

export const ATS_TEMPLATE_EXCERPT =
  "Most resumes never reach a human reviewer — they're filtered out by Applicant Tracking Systems (ATS) before anyone sees them. Here's how ATS software works, why standard resume advice often fails, and the formatting and keyword strategies that consistently pass modern screening systems."

export function createAtsGuideTemplateBlocks(): Block[] {
  return [
    {
      id: id(),
      type: "summary",
      label: "Summary",
      text: "Most resumes never reach a human reviewer — they're filtered out by Applicant Tracking Systems (ATS) before anyone sees them. In this guide, you'll learn how ATS software works, why standard resume advice often fails, and the specific formatting and keyword strategies that consistently pass modern screening systems.",
    },
    { id: id(), type: "heading", level: 2, text: "What Is an ATS?" },
    {
      id: id(),
      type: "richtext",
      html: "<p>An Applicant Tracking System (ATS) is software used by employers to collect, sort, and filter job applications. When you submit your resume online, it's rarely read by a person first — it's processed by an ATS that scans for specific keywords, formats, and signals to determine whether your application should advance.</p><p>According to research by Jobscan, over 98% of Fortune 500 companies use ATS software, and adoption among mid-size companies has grown dramatically since 2020. If you're applying to any established organization, your resume is almost certainly being screened by an algorithm before a human sees it.</p>",
    },
    {
      id: id(),
      type: "statGrid",
      stats: [
        { value: "98%", label: "Fortune 500 companies use ATS", source: "Jobscan, 2024" },
        { value: "75%", label: "Resumes rejected before human review", source: "TopResume, 2024" },
        { value: "6 sec", label: "Average time recruiters spend on a resume", source: "Ladders Eye-tracking, 2018" },
      ],
    },
    {
      id: id(),
      type: "scanStrip",
      badgeText: "ILLUSTRATIVE EXAMPLE",
      title: "CVJury ATS Scan — 86/100 ATS Readiness",
      description: "Strong foundation. Sections recognized (Summary, Experience, Skills, Education), keyword coverage confirmed, and single-column formatting parsed clearly. Priority edit: add measurable results to two experience bullets.",
    },
    { id: id(), type: "heading", level: 2, text: "Why ATS Matters More Than Ever in 2025" },
    {
      id: id(),
      type: "richtext",
      html: "<p>The shift to remote work permanently expanded the geographic reach of job postings. A position that once received 50 local applicants might now receive 500 from across the country. This volume surge has made ATS not just useful — it's essential for employers.</p>",
    },
    {
      id: id(),
      type: "quote",
      text: "The average corporate job opening attracts 250 applicants. Only 4 to 6 of those will be called for an interview.",
      source: "Glassdoor HR Research",
    },
    { id: id(), type: "heading", level: 3, text: "The Human Handoff Still Decides the Outcome" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Passing an automated check is not the same as earning an interview. Once the document reaches a recruiter, it still needs to establish relevance, credibility, and evidence of performance in a short amount of time. ATS-friendly writing should never become mechanical writing — keywords need context, achievements need a clear result, and the strongest evidence should appear where the reader expects to find it.</p>",
    },
    {
      id: id(),
      type: "featureGrid",
      items: [
        { title: "Clear document structure", description: "Use a one-column layout, standard headings, visible contact details, and consistent dates so the parser can place your information in the right fields." },
        { title: "Role-matched language", description: "Mirror the job advert where it is truthful, especially tools, skills, certifications, and job titles." },
        { title: "Evidence behind the keywords", description: "Back important keywords with outcomes, scale, numbers, responsibilities, or examples from real work." },
        { title: "Human handoff", description: "The ATS may help sort the resume, but a recruiter still needs to see fit, credibility, and clear value fast." },
      ],
    },
    { id: id(), type: "heading", level: 2, text: "How to Decide Whether a Keyword Belongs" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Before adding a term from the advert, ask whether you could explain how and where you used it in an interview. If the answer is no, the term does not belong in the resume. If the answer is yes, connect it to the relevant role, project, tool, or outcome. Distribute important phrases naturally: the professional summary can establish the target role, the skills section can make core tools easy to find, and the experience section can prove those skills through specific work.</p>",
    },
    {
      id: id(),
      type: "table",
      headers: ["Job Advert Phrase", "Resume Phrase"],
      rows: [["Monthly financial reporting", "Prepared monthly financial reports..."]],
    },
    { id: id(), type: "heading", level: 2, text: "ATS Formatting Rules (That Most People Get Wrong)" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Beautiful resume designs built in Canva or with elaborate layouts often perform terribly in ATS. The reason: most ATS systems read resumes as plain text. Tables, columns, and graphic elements get garbled or dropped entirely.</p>",
    },
    {
      id: id(),
      type: "dosDonts",
      dos: [
        "Use a single-column layout throughout",
        "Use standard section headings like 'Work Experience' and 'Education'",
        "Stick to fonts like Arial, Calibri, Georgia, or Times New Roman",
        "Save as .docx unless the posting specifies PDF",
        "Place all contact info in the main document body",
        "Use consistent date formatting throughout",
      ],
      donts: [
        "Use tables, text boxes, or multi-column layouts",
        "Place contact info in the document header or footer",
        "Use creative section names like 'My Journey' or 'Where I've Been'",
        "Include graphics, photos, or charts — they're invisible to ATS",
        "Use unusual Unicode characters or symbols as bullets",
        "Rely on colour-coded sections or decorative dividers",
      ],
    },
    { id: id(), type: "heading", level: 2, text: "The Right Section Structure" },
    {
      id: id(),
      type: "richtext",
      html: "<p>ATS tools are trained to recognise common section headings. Creative headings can confuse the system and the recruiter. Your resume is not the place to rename Work Experience as My Journey — use clear headings that hiring teams expect.</p>",
    },
    {
      id: id(),
      type: "table",
      headers: ["ATS-Safe Heading", "Avoid"],
      rows: [
        ["Work Experience / Professional Experience", "Where I've Worked / Career Journey"],
        ["Education", "Academic Background / Learning"],
        ["Skills / Technical Skills", "My Toolkit / Things I Know"],
        ["Certifications", "Badges and Credentials"],
        ["Summary / Professional Summary", "About Me / Who I Am"],
      ],
    },
    { id: id(), type: "heading", level: 2, text: "How to Extract the Right Keywords" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Start by reading the job description carefully. Identify the hard skills, soft skills, tools, certifications, and industry-specific terminology — words that appear multiple times signal importance to the ATS.</p><p>Use exact phrases, not synonyms: if the job description says <em>project management</em>, don't write <em>project coordination</em>. ATS systems match strings, not meaning. Keyword stuffing — hiding white text on a white background, or listing dozens of keywords in tiny font — is detected by modern ATS systems and can disqualify the application.</p><p>Test your resume by pasting it into a plain text document. If the information is jumbled, missing, or out of order, an ATS will have the same problem parsing it.</p>",
    },
    { id: id(), type: "heading", level: 2, text: "What Are Resume Achievements?" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Resume achievements are work results written as resume bullet points. They show the reader what you did, what changed, and why it mattered. UC Davis Career Center describes accomplishment statements using the formula: action verb + context = results.</p>",
    },
    {
      id: id(),
      type: "table",
      headers: ["Weak Duty", "Strong Resume Achievement"],
      rows: [
        ["Responsible for customer calls.", "Resolved 60+ customer calls per shift and kept first-contact resolution above 85%."],
        ["Helped with reports.", "Built weekly sales reports used by 3 managers to spot missed follow-ups and improve pipeline reviews."],
      ],
    },
    { id: id(), type: "heading", level: 2, text: "ATS Resume Checklist" },
    {
      id: id(),
      type: "checklist",
      title: "Use this checklist before you submit your next application",
      items: [
        "Use a clear professional summary tailored to the target role.",
        "Use the employer's job title where it is truthful and relevant.",
        "Include hard skills and tools from the job description.",
        "Use standard headings and avoid decorative section names.",
        "Keep formatting simple and readable.",
        "Place contact details in the main body, not a header or footer.",
        "Spell out important acronyms the first time, such as Search Engine Optimization (SEO).",
        "Use consistent dates throughout.",
        "Submit the file type requested by the employer.",
        "Read the final resume like a human, not just like a machine.",
      ],
    },
    {
      id: id(),
      type: "stepFlow",
      title: "The 5-Step ATS Pass-Through Workflow",
      steps: [
        { title: "Read the job advert", description: "Highlight repeated skills, tools, certifications, and must-have terms." },
        { title: "Match your language", description: "Use exact phrases where they are honest and relevant." },
        { title: "Clean the layout", description: "Use one column, standard headings, and body text contact details." },
        { title: "Prove the skills", description: "Add outcomes, numbers, scale, tools, and examples in work bullets." },
        { title: "Test before upload", description: "Check file type, text order, links, dates, spelling, and final instructions." },
      ],
    },
    { id: id(), type: "heading", level: 2, text: "Use Evidence to Make Achievements Credible" },
    {
      id: id(),
      type: "richtext",
      html: "<p>Relevant keywords help an ATS recognize your experience, but evidence helps a recruiter believe it. Strengthen an achievement with proof such as time saved, workload handled, or quality improved — and use only figures and outcomes you can explain.</p>",
    },
    {
      id: id(),
      type: "statRow",
      stats: [
        { value: "90 min", label: "Cut weekly reporting time from four hours", color: "#E97451" },
        { value: "85+", label: "Invoices processed each week with fewer missing details", color: "#2563EB" },
        { value: "22%", label: "Reduction in data-entry errors after adding a second check", color: "#16A34A" },
      ],
    },
    { id: id(), type: "heading", level: 2, text: "The 7 Most Common ATS Mistakes" },
    {
      id: id(),
      type: "numberedList",
      items: [
        { title: "Using a PDF when the employer wants a Word document", description: "Always read the application instructions. Some ATS systems handle PDFs poorly — when in doubt, submit a .docx file." },
        { title: "Inconsistent date formats", description: "Pick one format (e.g., 'June 2022 – Present' or '06/2022 – Present') and use it throughout. Inconsistency confuses parsers." },
        { title: "Missing contact information in the body", description: "Your name, phone, email, and LinkedIn URL should be in the main body — not in a header or footer element." },
        { title: "No quantified achievements", description: "ATS systems give higher scores to resumes with numbers and data. 'Managed a team' scores lower than 'Led 8-person team to $2.4M project completion.'" },
        { title: "Generic objective statements", description: "Objective statements are outdated. Replace with a tailored professional summary that uses keywords from the job description." },
        { title: "Not tailoring for each application", description: "The same resume sent to 50 jobs will underperform compared to 10 tailored resumes. Spend 15 minutes adjusting keywords for each role." },
        { title: "Abbreviations and acronyms without spelling them out", description: "Write out the full term the first time: 'Search Engine Optimization (SEO)' — ATS systems may not recognize abbreviations alone." },
      ],
    },
    {
      id: id(),
      type: "callout",
      title: "Key Takeaways",
      items: [
        "75% of resumes are rejected by ATS before a hiring manager sees them — formatting and keywords are the two biggest factors.",
        "Mirror the exact language from the job description rather than using synonyms — ATS systems match strings, not meaning.",
        "Avoid tables, text boxes, headers/footers, and columns — these confuse most ATS parsers and cause information to get lost.",
        "A simple, single-column format with standard section headings consistently outperforms designed resume templates in ATS environments.",
        "Tailoring your resume for each application increases your ATS score by an average of 47% compared to generic submissions.",
      ],
    },
    {
      id: id(),
      type: "authorBio",
      name: "Ita John, PhD",
      title: "Founder, CVJury",
      avatarUrl: "",
      bio: "Dr. John is the founder of CVJury. He previously worked as an IT recruiter for the London market at Star Jobs Recruitment and NECareersConnect, and brings experience across recruitment, project management, business development, and AI. He earned a PhD in entrepreneurship, international business, and economics from Oxford Brookes University.",
      badges: ["CPRW Certified", "LinkedIn Top Voice", "Former IT Recruiter", "Certified AI Generalist"],
    },
  ]
}
