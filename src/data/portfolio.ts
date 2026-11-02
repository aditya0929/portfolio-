// ─────────────────────────────────────────────────────────────────────────────
// Everything personal on the site lives in this file and in projects.ts
// (Selected Works and their case studies). Edit, save, done.
// ─────────────────────────────────────────────────────────────────────────────

export type Social = {
  /** Shown in the footer's Contact list. */
  label: string;
  /** Text on the right-hand side of the footer row. */
  handle: string;
  href: string;
  /** Also show this link (lowercased) in the hero header. */
  inHeader?: boolean;
  /** Also show this link, large, in the Contact section under email and phone. */
  inContact?: boolean;
};

export type Experience = {
  title: string;
  company: string;
  companyUrl?: string;
  period: string;
  /** Slugs from projects.ts, linked under this role. */
  projects?: string[];
  /** One extra line, e.g. a CGPA. */
  note?: string;
};

export type Award = {
  title: string;
  org: string;
  date: string;
  team?: string;
  /** One line of detail under the award. */
  note?: string;
};

export type SkillGroup = {
  category: string;
  technologies: string;
};

export type Site = {
  name: string;
  /** Used in the header logo and footer. */
  shortName: string;
  role: string;
  location: string;
  email: string;
  /** Shown under the email in the Contact section. Omit to hide. */
  phone?: string;
  /** Your deployed URL, used for SEO / social previews. */
  url?: string;
  /** File in /public. Omit to hide the "Open Curriculum Vitae" link. */
  resumeUrl?: string;
  /** Cal.com / Calendly / Google Calendar booking link. Adds "Book a Meeting" to the footer. */
  bookingUrl?: string;
  /** "Explore on GitHub" link under the project filters. */
  archiveUrl?: string;
  /** Download buttons under the hero headline. `fileName` is what the browser saves it as. */
  downloads: { label: string; shortLabel: string; href: string; fileName: string }[];
  meta: { description: string; keywords: string[] };
  hero: {
    /** The interactive ASCII visual: a neural network, or the original site's ghost mascot. */
    visual: "network" | "ghost";
    greeting: string;
    tagline: string;
    /** Three lines under the greeting: the first is bright, the other two dimmed. */
    lines: [string, string, string];
  };
  /** null hides the quote. */
  quote: { text: string; author: string } | null;
  status: {
    /** Shown next to the green dot under the hero. */
    label: string;
    /**
     * Optional Discord user ID for live presence via https://lanyard.rest
     * (join the Lanyard Discord server first). Shows "Coding: …", "Listening to: …",
     * etc., and changes how the hero visual moves.
     */
    discordId?: string;
  };
  socials: Social[];
  backgroundIntro: string;
  experience: Experience[];
  /** Listed after experience, same style. */
  education: Experience[];
  skills: SkillGroup[];
  /** The Awards block is hidden while this is empty. */
  awards: Award[];
  projectsIntro: string;
  contactIntro: string;
};

export const site: Site = {
  name: "Aditya Narayan Jha",
  shortName: "Aditya",
  role: "AI Engineer",
  location: "Pune, India",
  email: "adityajha8906@gmail.com",
  phone: "+91 9153831641",
  resumeUrl: "/resume.pdf",
  archiveUrl: "https://github.com/aditya0929?tab=repositories",
  downloads: [
    {
      label: "Download Resume",
      shortLabel: "Resume",
      href: "/resume.pdf",
      fileName: "Aditya-Narayan-Jha-Resume.pdf",
    },
    {
      label: "Download Research Paper",
      shortLabel: "Research Paper",
      href: "/papers/tinysql-technical-report.pdf",
      fileName: "TinySQL-Technical-Report.pdf",
    },
  ],

  meta: {
    description:
      "Aditya Narayan Jha is an AI Engineer working on LLM fine-tuning, retrieval-augmented generation, multi-agent systems and production ML pipelines.",
    keywords: [
      "Aditya Narayan Jha",
      "AI Engineer",
      "LLM",
      "Fine-tuning",
      "RAG",
      "LangGraph",
      "PyTorch",
      "Text-to-SQL",
    ],
  },

  hero: {
    visual: "network",
    greeting: "I’m Aditya",
    tagline: "an AI Engineer",
    lines: ["training language models,", "building agents and RAG,", "from scratch to production."],
  },

  quote: null,

  status: {
    label: "Alive",
  },

  socials: [
    { label: "GitHub", handle: "@aditya0929", href: "https://github.com/aditya0929", inHeader: true },
    {
      label: "LinkedIn",
      handle: "/in/aditya-jha-36193a251",
      href: "https://linkedin.com/in/aditya-jha-36193a251",
      inHeader: true,
      inContact: true,
    },
    { label: "Hugging Face", handle: "@adiitya0929", href: "https://huggingface.co/adiitya0929" },
    { label: "Email", handle: "adityajha8906@gmail.com", href: "mailto:adityajha8906@gmail.com" },
    { label: "Phone", handle: "+91 9153831641", href: "tel:+919153831641" },
  ],

  backgroundIntro: "Where I’ve worked, learned, and built.",

  experience: [
    {
      title: "AI Engineer",
      company: "Coherent Market Insights",
      period: "Sep 2025 - Present",
      projects: ["coherentconnect", "newsletter-llm", "sales-brain"],
    },
    { title: "Data Science Intern", company: "SparkAI.tech", period: "Jun 2025 - Sep 2025" },
  ],

  education: [
    {
      title: "B.Tech in Computer Science and Engineering",
      company: "Vellore Institute of Technology",
      period: "2022 - 2026",
      note: "CGPA: 9.11 / 10",
    },
  ],

  skills: [
    { category: "Languages", technologies: "Python, SQL" },
    {
      category: "AI & Machine Learning",
      technologies:
        "LLMs, Fine-tuning, QLoRA, Pretraining, Text-to-SQL, RAG, LangChain, LangGraph, LlamaIndex, Multi-Agent Systems, MCP, Transformers, Hugging Face, PyTorch, TensorFlow, Scikit-Learn",
    },
    {
      category: "Data Engineering",
      technologies: "ETL Pipelines, Airflow, Vector Databases, Neo4j, PostgreSQL, MongoDB",
    },
    {
      category: "Backend & Cloud",
      technologies: "FastAPI, Node.js, REST APIs, GCP, GitHub Actions, Docker, Git",
    },
  ],

  awards: [
    { title: "Winner, HackPrompt Engineering", org: "TechGig", date: "2025" },
    {
      title: "Semi-finalist, KSP Datathon",
      org: "Karnataka State Police | Hack2skill",
      date: "2024",
      note: "Traffic flow & congestion management: camera-based queue-length estimation for adaptive signal timing, with alerts for bottlenecks near junctions",
    },
    {
      title: "2nd Place, Drug Hackathon",
      org: "Shaastra 2024 | IIT Madras",
      date: "2024",
      note: "Multi-instance lung-cancer classification with EfficientNet-B3 transfer learning, 98% accuracy, among 2,400 participants",
    },
    {
      title: "2nd Runner-up, Rajasthan Police Hackathon 1.0",
      org: "Rajasthan Police | Jaipur",
      date: "2024",
      team: "With Meghshyam Karpe and Tanmay Srivastav",
      note: "36-hour build: fraud-analysis software with unsupervised fraud detection and graph-database money-flow tracking",
    },
    {
      title: "2nd Highest Contributor, Social Summer of Code",
      org: "SSoC",
      date: "2023",
      note: "8 pull requests merged into DL Simplified, plus a React admin dashboard project with 36 GitHub stars",
    },
  ],

  projectsIntro:
    "Language models, agent systems and data pipelines, built from first principles and taken all the way to production. Open any project for the full case study.",

  contactIntro: "Have an idea, opportunity, or just want to chat? Say hello.",
};
