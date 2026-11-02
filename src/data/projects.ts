// ─────────────────────────────────────────────────────────────────────────────
// Selected Works. Each project gets a card on the home page and its own
// case-study page at /projects/<slug>. Order here = order on the site.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Backdrop behind each project preview. Use one of the built-in textured
 * gradients, or a path to your own photo in /public (e.g. "/backdrops/wall.jpg").
 */
export type Backdrop = "limestone" | "slate" | "terracotta" | "moss" | (string & {});

/** A headline number. The first one is also shown on the project's card. */
export type Metric = { value: string; label: string; note?: string };

export type Figure = { src: string; alt: string; caption: string; width: number; height: number };

export type ProjectLink = {
  /** Short label for the bracketed buttons, e.g. "GITHUB". */
  label: string;
  href: string;
  /** Longer name for the case study's Links list, e.g. "Source code on GitHub". */
  name?: string;
};

/** A titled paragraph, used for pipeline steps, product features and contributions. */
export type Item = { title: string; body: string };

export type Project = {
  /** URL of the case study: /projects/<slug>. */
  slug: string;
  name: string;
  /** Filter tab on the home page, e.g. "WORK". Tabs are generated from these. */
  category: string;
  type: string;
  event?: string;
  role?: string;
  year?: string;
  /** e.g. "In development". Shown as a badge; omit for finished work. */
  status?: string;
  /** Card paragraph on the home page. */
  description: string;
  /** One or two sentences that open the case study. */
  summary: string;
  stack: string[];
  /** Public links, e.g. live site, code, paper, model. Shown on the card and the case study. */
  links?: ProjectLink[];
  /** Screenshot in /public for the card, ideally 2:1. Without one a typographic panel is shown. */
  image?: string;
  backdrop?: Backdrop;
  caseStudy: {
    /** For live products: what it is and what it does, with a link to it. Shown first. */
    product?: { url: string; paragraphs: string[]; features: Item[] };
    problem: string[];
    /** Your own contributions, for team projects. */
    myWork?: Item[];
    /** Section title for `approach`; defaults to "How it works". */
    approachTitle?: string;
    approach: Item[];
    /** A short diff shown under the approach, e.g. the heart of a bug fix. Lines start with " ", "+" or "-". */
    code?: { file: string; diff: string };
    metrics: Metric[];
    highlights?: string[];
    figures?: Figure[];
    /** What's still to come; shown for in-progress work. */
    roadmap?: string[];
  };
};

export const projects: Project[] = [
  {
    slug: "coherentconnect",
    name: "CoherentConnect",
    category: "WORK",
    type: "AI Platform",
    event: "Coherent Market Insights",
    role: "AI Engineer",
    year: "2026",
    description:
      "AI B2B buyer discovery and outreach. News is embedded and organised into a four-level trend hierarchy (recursive K-Means, Kneedle, LDA, LLM-refined labels), and a LangGraph agent maps each trend to directly and indirectly affected industries, surfacing 800–1,000 potential buyers a day from 66,000+ daily signals.",
    summary:
      "A B2B sales-intelligence platform that turns live news into market trends, works out which industries and companies each trend affects, and writes grounded outreach to them. I designed its trend-discovery engine and its buyer-matching layer.",
    stack: ["LangGraph", "OpenAI Embeddings", "Scikit-Learn", "FastAPI", "PostgreSQL"],
    links: [{ label: "COHERENTCONNECT.AI", href: "https://coherentconnect.ai", name: "Live product" }],
    image: "/projects/coherentconnect/live.png",
    backdrop: "slate",
    caseStudy: {
      product: {
        url: "https://coherentconnect.ai",
        paragraphs: [
          "CoherentConnect is a 24×7 autonomous sales AI agent for B2B teams. It reads thousands of market signals every day (regulatory shifts, capital flows, M&A, funding, hiring and expansions) and surfaces the exact companies that need your solution right now, with verified contacts and personalised outreach ready to send.",
          "One click on Run Pipeline takes it from raw news to a ready-to-send campaign.",
        ],
        features: [
          {
            title: "Collect",
            body: "Live signal detection across 66,000+ sources and 1,000+ trigger signals such as funding rounds, hiring, investments and expansions.",
          },
          {
            title: "Discover",
            body: "AI company discovery that surfaces 800–1,000 companies a day, with contact verification built in, so no separate tool is needed.",
          },
          {
            title: "Generate",
            body: "Personalised emails, each written around the live signal that makes that company a buyer.",
          },
          {
            title: "Send",
            body: "Bulk sending from inside the platform, or export the campaign.",
          },
        ],
      },
      problem: [
        "Finding companies that need what you sell right now is slow, manual work: a rep reads the news, guesses who is affected, researches each company, finds the right people and writes cold emails.",
        "CoherentConnect automates that chain, so every lead is tied to a dated news event instead of a static list.",
      ],
      myWork: [
        {
          title: "Trend-discovery engine",
          body: "Designed the trend-discovery engine: embedded news articles with text-embedding-3-small and constructed a 4-level trend hierarchy via recursive K-Means (silhouette-based splits, Kneedle elbow detection) and LDA topic modeling, with TF-IDF keywords refined by an LLM into human-readable trend labels. This started as the first version of the system: article collection, OpenAI embeddings, hierarchical clustering and LLM-labelled trends.",
        },
        {
          title: "Buyer-matching layer",
          body: "Engineered the buyer-matching layer: a LangGraph agent maps each trend to directly and indirectly affected industries, and companies are ranked by cosine similarity with recency decay (similarity × e^(−age / 30 days)), surfacing 800–1,000 potential buyers/day from 66,000+ daily signals.",
        },
        {
          title: "Industry impact and company discovery",
          body: "Built the workflow that turns each trend into the industries it affects and then into real companies, discovered from news mentions rather than from a model's memory.",
        },
        {
          title: "Deep company research",
          body: "Research that pulls up to ten free public sources in parallel (Wikipedia, Wikidata, Google News, company filings and market data, the company's own website) and synthesises them in a single LLM call.",
        },
        {
          title: "Automation and outreach",
          body: "The chain that runs after each pipeline, taking every company through research, email drafting and the send queue, plus automated follow-ups that stop when a contact replies, Apollo contact discovery and billing.",
        },
      ],
      approach: [
        {
          title: "Collect and embed",
          body: "Articles from RSS feeds, Google News queries and news APIs across 58 country profiles are de-duplicated, scraped to full text and embedded with OpenAI's text-embedding-3-small (1,536 dimensions), with embeddings cached across runs.",
        },
        {
          title: "Topics",
          body: "TF-IDF over unigrams and bigrams, K-Means on normalised embeddings with the number of clusters chosen by Kneedle elbow detection, and LDA topic modelling for a soft topic mix per article.",
        },
        {
          title: "Trend hierarchy",
          body: "Recursive K-Means builds a four-level hierarchy (macro, micro, sub-micro, sub-sub), choosing every split by silhouette score and stopping when a cluster is small or already cohesive. Weak leaves are pooled and re-clustered, and TF-IDF keywords are refined by an LLM into human-readable trend labels.",
        },
        {
          title: "Impact mapping",
          body: "A LangGraph agent walks the trends ten at a time, mapping each to the industries it affects directly and to their first-order supply, procurement and regulatory dependents. The strongest trends get a sales pass: causal chain, pain points, target roles and buying signals.",
        },
        {
          title: "Buyer matching",
          body: "Companies are discovered from real news mentions, then ranked by cosine similarity between the company profile and the trend, weighted by a recency decay so fresh, relevant companies rise to the top.",
        },
        {
          title: "The rest of the platform",
          body: "Each matched company flows on through deep research across public sources, decision-maker discovery, per-stakeholder emails whose claims are checked against the source data, and human-paced sending with follow-ups, all streamed live to the browser as a pipeline graph.",
        },
      ],
      metrics: [
        { value: "800–1,000", label: "Potential buyers surfaced per day" },
        { value: "66,000+", label: "Market signals processed daily" },
        { value: "4", label: "Levels in the trend hierarchy", note: "Macro, micro, sub-micro, sub-sub" },
        { value: "58", label: "Country news profiles", note: "RSS, Google News and news APIs" },
      ],
      highlights: [
        "Every company comes from a real news mention, never from a model's memory, and every email claim is checked against the source data before it can be sent.",
        "Embeddings, clusters, trend trees and impact maps are cached by content hash, so repeat runs skip work that's already been done.",
        "Every LLM, embedding and crawl call is cost-metered per run and per company, with a hard cap on spend per run.",
        "A single routing layer sends each LLM call to OpenAI, Anthropic or DeepSeek by model name, so models can be swapped per task.",
      ],
    },
  },
  {
    slug: "tinysql",
    name: "TinySQL",
    category: "PERSONAL",
    type: "Language Model",
    event: "Research",
    role: "Sole Author",
    year: "2026",
    description:
      "A 125M-parameter Llama-style text-to-SQL model written from scratch in PyTorch, from the BPE tokenizer to the grammar-constrained decoder. Pretrained on 4.5B tokens on a single L4 GPU, it reaches 80.4% execution accuracy on WikiSQL with 100% valid SQL, 17 points above Pythia-160M on 67× less data.",
    summary:
      "A 125M-parameter Llama-style text-to-SQL model where every part of the model path (tokenizer, transformer, optimizer, training loop, data pipeline, constrained decoder and evaluation) is hand-written in PyTorch, then benchmarked against GPT-2, Pythia and SmolLM2 under identical recipes.",
    stack: ["PyTorch", "Python", "SQLite", "Hugging Face"],
    links: [
      { label: "GITHUB", href: "https://github.com/aditya0929/tinysql", name: "Source code on GitHub" },
      {
        label: "ZENODO PAPER",
        href: "https://zenodo.org/records/23396770",
        name: "Paper on Zenodo (DOI 10.5281/zenodo.23396770)",
      },
      {
        label: "HUGGING FACE",
        href: "https://huggingface.co/adiitya0929/TinySQL-125M-WikiSQL",
        name: "Fine-tuned model on Hugging Face",
      },
      {
        label: "COLAB",
        href: "https://colab.research.google.com/drive/1MQ70s8txcYtgMd99cH_WHvYwgcmJd117?usp=sharing",
        name: "Try it in Google Colab",
      },
      { label: "PDF", href: "/papers/tinysql-technical-report.pdf", name: "Technical report (PDF)" },
    ],
    backdrop: "limestone",
    caseStudy: {
      problem: [
        "How far can one person get on a standard text-to-SQL benchmark with a model whose every part they built themselves, on a pretraining budget of a few billion tokens and one rented GPU?",
        "Small models can run next to a database on a CPU and are cheap to fine-tune, but most are pretrained by large teams on trillions of tokens. To make the answer credible, every baseline gets the same recipe and its own learning-rate sweep, with seeds, a no-pretraining control, bootstrap confidence intervals and McNemar tests, and the test set is used exactly once.",
      ],
      approach: [
        {
          title: "Tokenizer",
          body: "Byte-level BPE with 32,768 tokens (256 bytes, 32,500 merges, 12 special tokens), GPT-4-style pre-tokenisation and NFC normalisation so SQL string literals survive intact. Trained on a SQL-weighted sample; SELECT, FROM and WHERE are single tokens, and crawled text can't inject control tokens.",
        },
        {
          title: "Corpus",
          body: "5.4B tokens from FineWeb-Edu, The Stack's SQL subset, Stack Exchange and synthetic text-to-SQL. Exact-hash and MinHash-LSH deduplication, then 13-gram decontamination against WikiSQL dev and test: zero leaks in 4.7M documents, verified with planted positive controls.",
        },
        {
          title: "Architecture",
          body: "30 layers, d_model 576, grouped-query attention with 9 query and 3 key/value heads, RoPE, SwiGLU, pre-norm RMSNorm and tied embeddings over a 2,048-token context: 125,077,824 parameters. Even Linear, softmax and cross-entropy are hand-written, and 169 tests include a check that logits match Hugging Face's Llama to 1e-4.",
        },
        {
          title: "Pretraining",
          body: "Hand-written AdamW and cosine schedule, 524K tokens per step, bf16 with torch.compile and bit-exact resume. 4.5B tokens in about 46 hours on one L4 at ~27K tokens/s, with the SQL share of the data mix raised from 15% to 36% for the final 15% of training.",
        },
        {
          title: "Fine-tuning",
          body: "Supervised fine-tuning on 56K WikiSQL examples in a schema / question / SQL prompt format, with loss on the SQL only. About 30 minutes on the same GPU, learning rate chosen by sweep.",
        },
        {
          title: "Constrained decoding",
          body: "95% of invalid outputs referenced a column that doesn't exist, and every gold value appears verbatim in the question. A byte-level grammar admits only real column names and values copied from the question, taking the best-scoring token that keeps the SQL a valid prefix.",
        },
        {
          title: "Evaluation",
          body: "Execution against sandboxed read-only SQLite, hand-written bootstrap and exact McNemar tests, a failure-category breakdown, and a cross-check with the official WikiSQL evaluator.",
        },
      ],
      metrics: [
        {
          value: "80.4%",
          label: "WikiSQL test execution accuracy",
          note: "Constrained decoding; 77.9% greedy (3-seed means)",
        },
        { value: "100%", label: "Valid SQL under constraints", note: "2.0% invalid with plain greedy decoding" },
        { value: "4.5B", label: "Pretraining tokens", note: "About 46 hours on one NVIDIA L4" },
        { value: "+17 pts", label: "Above Pythia-160M", note: "On 67× less pretraining data" },
      ],
      highlights: [
        "Benchmarked against GPT-2, Pythia-160M and SmolLM2 with identical recipes, 3 seeds and McNemar significance tests: within 1 point of GPT-2 and 17 points above Pythia-160M on 67× less data.",
        "Constrained decoding fixed 385 test answers and broke none for TinySQL. It broke some answers for every baseline.",
        "Ablations show RoPE (+8.5 pts) and tied embeddings (+5 pts) matter most.",
        "Pretraining is doing the work: the same architecture trained from random initialisation scores 37.4%.",
        "An audit of 50 aggregation-only errors found the WikiSQL label itself wrong in 62% of them.",
      ],
      figures: [
        {
          src: "/projects/tinysql/architecture.png",
          alt: "TinySQL-125M decoder architecture, grouped-query attention layout and parameter budget",
          caption: "The decoder, its grouped-query attention, and where the 125M parameters go.",
          width: 2300,
          height: 1198,
        },
        {
          src: "/projects/tinysql/accuracy-vs-data.png",
          alt: "WikiSQL test accuracy against pretraining tokens for TinySQL, GPT-2, Pythia-160M and SmolLM2-135M",
          caption: "Test accuracy before constrained decoding, against pretraining data on a log scale.",
          width: 1520,
          height: 920,
        },
      ],
    },
  },
  {
    slug: "newsletter-llm",
    name: "Self-Hosted Newsletter LLM",
    category: "WORK",
    type: "Fine-tuned LLM",
    event: "Coherent Market Insights",
    role: "AI Engineer",
    year: "2026",
    description:
      "Replaced the paid API behind a newsletter engine personalised for 500,000+ recipients a month with Qwen2.5-7B-Instruct, fine-tuned with QLoRA on 559 production prompt–output pairs distilled from DeepSeek. Eval loss fell from 3.10 to 0.36 and it beat the teacher on 15/20 held-out prompts with 100% valid JSON, for under $5 on a single L4 GPU.",
    summary:
      "A Qwen2.5-7B fine-tuned with QLoRA on the newsletter engine's own logged API calls, replacing a metered third-party API with a self-hosted vLLM endpoint that costs a fraction of a rupee per brief.",
    stack: ["Qwen2.5-7B", "QLoRA", "vLLM", "Axolotl", "FastAPI"],
    backdrop: "terracotta",
    caseStudy: {
      problem: [
        "The engine writes a personalised market brief for each recipient, more than 500,000 a month: news signals about their market, likely customers and competitors, written in a house analyst voice. Each brief takes about 11 JSON-mode LLM calls.",
        "Every one of those calls went to a metered third-party API, so cost grew with every brief and a billing failure mid-batch could ship half-written briefs. The goal was the same voice, structure and grounding on a GPU we control, behind an OpenAI-compatible endpoint so the pipeline didn't have to change.",
      ],
      approach: [
        {
          title: "Distillation from production",
          body: "A logger in the LLM client captured every successful teacher call, with its system prompt, user prompt and output. A dry-run generator ran the full pipeline on real leads without sending anything, collecting about 1,400 calls across seven call types, from customer and competition cards to editorial ledes and industry classification.",
        },
        {
          title: "Dataset",
          body: "Dropped malformed and invalid-JSON outputs, capped each prompt family at 40 examples so the most frequent calls don't dominate, and templated everything into Qwen's ChatML format: 559 training and 62 validation examples.",
        },
        {
          title: "QLoRA fine-tune",
          body: "Qwen2.5-7B-Instruct in 4-bit with rank-32 LoRA adapters (alpha 64) on every attention and MLP projection, a 2,560-token context, paged 8-bit AdamW and a cosine schedule from 2e-4 over 3 epochs. 207 steps in 1 h 50 min on one L4 GPU, roughly ₹360 (about $4).",
        },
        {
          title: "Evaluation",
          body: "Held-out prompts were regenerated by the fine-tune and scored against the teacher's original outputs with the production voice detector (em-dashes, three-item lists, passive voice, jargon), plus JSON validity and a check for numbers that don't appear in the prompt.",
        },
        {
          title: "Serving",
          body: "The adapter is merged into fp16 weights and served by vLLM with prefix caching, since every call in a brief shares a style prefix, and chunked prefill. The fine-tune gets a 96-token style reminder instead of the 687-token rule block it was trained on, cutting input tokens by a third.",
        },
        {
          title: "Newsletter pipeline",
          body: "Leads, then company enrichment, Google News collection, relevance-and-freshness scoring, section composition, validation (keyword rules plus the fine-tune as an LLM judge) and email-safe HTML. Sending always needs an explicit confirmation flag.",
        },
      ],
      metrics: [
        { value: "3.10 → 0.36", label: "Validation loss", note: "Best checkpoint at step 200 of 207" },
        { value: "15 / 20", label: "Held-out prompts where it beat the teacher", note: "With 100% valid JSON" },
        { value: "500,000+", label: "Recipients personalised for each month" },
        { value: "< $5", label: "Training cost", note: "1 h 50 min on a single L4 GPU" },
        { value: "₹0.07–0.10", label: "Inference cost per brief", note: "About 11 calls and 19K tokens with vLLM" },
      ],
      highlights: [
        "A voice-filtered retrain lowered the eval loss but wrote worse briefs (27.3 vs 21.7 voice violations per 1,000 words). Models are now judged on the briefs they generate, not on loss.",
        "With vLLM batching, 40 briefs finish in under 6 minutes, 17× cheaper per brief than the first sequential self-hosted setup.",
        "bf16 weights ran out of memory on long prompts at 22.5 GB, so the fallback server loads the base model in 4-bit NF4 (about 6 GB) with the adapter applied at runtime.",
        "The GPU is a spot instance spun up per batch and destroyed afterwards, so idle time costs nothing.",
      ],
    },
  },
  {
    slug: "sales-brain",
    name: "Sales Brain",
    category: "WORK",
    type: "CRM Intelligence",
    event: "Coherent Market Insights",
    role: "AI Engineer",
    year: "2026",
    description:
      "A fully local CRM intelligence engine over 97K leads: 110K vectors of enquiries and rep notes, hybrid search fused with RRF, a 13 × 60 loss-reason taxonomy, and a lead scorer whose top 20% held 41.8% of wins. A Qwen2.5-7B router answers reps' questions in plain English from SQL-backed skills.",
    summary:
      "A fully local engine that turns seven years of messy CRM history into a shared memory, then puts a lead scorer, a loss-reason analyst, a deal coach and a plain-English question router on top. Every number comes from SQL; the LLM only writes the words.",
    stack: ["Qwen2.5-7B", "nomic-embed", "SQLite FTS5", "Scikit-Learn"],
    backdrop: "moss",
    caseStudy: {
      problem: [
        "About 97,600 inbound leads, a low single-digit conversion rate, and no stage history, email log or call log. The only record of what happened is terse rep notes on 41% of leads, so reps had no way to rank leads as they arrived or to see why deals died.",
        "Customer data couldn't leave the machine, so everything (embeddings, language models and storage) runs locally.",
      ],
      approach: [
        {
          title: "Ingestion",
          body: "A custom parser reads compressed MySQL dumps straight into SQLite, keeping an untouched raw layer and a clean layer, reconciled row for row across all 19 tables. Credential columns are dropped at read time and contact details live in a separate table, so analysis runs de-identified.",
        },
        {
          title: "Cohorts and entities",
          body: "Named views keep each analysis on the right population, such as only the fields known when a lead arrives. An entity graph resolves 86K people and 64K companies from email domains and names, with lead and win counts precomputed per node.",
        },
        {
          title: "Semantic memory",
          body: "nomic-embed-text-v1.5 embeds 86K enquiries and 24K distinct rep notes (deduplicated from 40K) into 110K vectors, searched by exact dot product. Hybrid search pre-filters in SQL, ranks with both vectors and SQLite FTS5 BM25, and fuses the two with reciprocal rank fusion (k = 60).",
        },
        {
          title: "Loss-reason taxonomy",
          body: "Short notes don't separate cleanly in embedding space, so 12 ordered rules assign 13 macro reasons, then K-Means sub-clusters the leftovers inside the largest ones: 60 micro reasons that cover 99.5% of notes.",
        },
        {
          title: "Lead scorer",
          body: "Logistic regression on arrival-time fields plus the enquiry embedding, trained on 2019–23 and tested on 2024–25. It outputs a band, a decile and the top feature contributions, never a probability.",
        },
        {
          title: "Ask-anything router",
          body: "Qwen2.5-7B maps a question to one of seven SQL-backed skills with whitelisted arguments, then writes a two-to-four sentence answer from only the facts returned. Forecasting and rep-ranking questions are refused in code.",
        },
        {
          title: "Deal coach and work queue",
          body: "For any lead: its band, its 12 nearest past enquiries and how they ended, and a short briefing. A local web queue lets reps act on leads and logs every recommendation for a learning loop.",
        },
      ],
      metrics: [
        { value: "0.674", label: "Lead-scorer AUC", note: "Time-split hold-out, 2024–25" },
        { value: "41.8%", label: "Of wins in the top 20% of scores", note: "2.7× lift in the top decile" },
        { value: "92.6%", label: "Qwen2.5-7B router accuracy" },
        { value: "110K", label: "Vectors in local memory", note: "86K enquiries and 24K rep notes" },
      ],
      highlights: [
        "A random split reported an AUC of about 0.85; splitting by time showed the honest 0.674. Logistic regression beat gradient boosting (0.632, badly overfit) and random forest (0.657).",
        "A 'has enquiry text' feature was dropped after a website change made it leak the calendar year.",
        "The first design had Qwen2.5-3B extract structured events from 13.7K notes over 15.5 hours. It invented most of the dates, so it was replaced by embeddings plus rules, about 70× faster.",
        "Router accuracy rose from 86.8% to 92.6% with no fine-tuning: clearer skill descriptions, whitelisted arguments, and refusals moved into code.",
      ],
    },
  },
  {
    slug: "voice-agent",
    name: "Voice Agent",
    category: "PERSONAL",
    type: "Speech AI",
    event: "Personal Project",
    role: "Sole Builder",
    year: "2026",
    status: "In development",
    description:
      "A phone agent that takes and makes real calls in my own voice: streaming speech recognition, an LLM brain and a TTS model fine-tuned on hours of my recordings, with natural turn-taking, interruptions, and live extraction of names, dates and commitments.",
    summary:
      "A phone agent that takes and makes real calls in my own voice, with natural turn-taking, interruptions and live capture of the details that matter, built mostly from open-source and self-trained models.",
    stack: ["Pipecat", "faster-whisper", "Silero VAD", "Orpheus TTS"],
    backdrop: "limestone",
    caseStudy: {
      problem: [
        "Most voice agents sound like voice agents: they wait out silences, talk over people and read in a stock voice. The goal is a call that feels like talking to a person, at a running cost of little more than GPU time and phone minutes.",
        "It should also do something useful on the call: capture names, intent, dates, numbers and commitments as the conversation happens.",
      ],
      approach: [
        {
          title: "Streaming core",
          body: "Silero VAD, faster-whisper, an LLM and a TTS model, orchestrated by Pipecat or LiveKit Agents so recognition, generation and synthesis stream in parallel, with barge-in so the agent stops the moment it's interrupted.",
        },
        {
          title: "My voice",
          body: "About 2.5 hours of recordings across 15 sessions: 12 scripted call scenarios, from clinic bookings to difficult moments, and 3 free-talk sessions for natural rhythm. Clips are cut to 5–15 seconds with Silero VAD and transcribed with Whisper, keeping the fillers, then used to fine-tune Orpheus TTS (or F5-TTS / XTTS).",
        },
        {
          title: "Feeling human",
          body: "A semantic end-of-turn model instead of silence thresholds, small backchannels like “mm-hmm” while the caller talks, fillers and varied pacing, and a target of under 600 ms from the end of the caller's speech to the first audio back.",
        },
        {
          title: "Live extraction",
          body: "A small model reads the running transcript and fills a structured form (name, intent, date, time, party size, phone number). The talking model sees which fields are still missing and asks for them naturally; a final pass writes a clean summary and JSON.",
        },
        {
          title: "Telephony",
          body: "A SIP trunk for inbound and outbound calls, with voicemail detection and a clean hang-up. Everything else is self-hosted, so the per-call cost is just phone minutes.",
        },
      ],
      metrics: [
        { value: "< 600 ms", label: "Target voice-to-voice latency" },
        { value: "~2.5 h", label: "Of my voice recorded for the fine-tune", note: "15 sessions of 10–11 minutes" },
        { value: "6", label: "Fields captured live during a call", note: "Name, intent, date, time, party size, phone" },
      ],
      highlights: [
        "Only my own voice is cloned. Test calls are with friends who have agreed to them, and AI disclosure comes before any real-world use.",
      ],
      roadmap: [
        "Each piece working alone: microphone to Whisper, text to LLM reply, reply to speech.",
        "One streaming loop in Pipecat with interruption handling and conversation memory.",
        "Voice dataset recorded and cleaned; TTS fine-tuned on it.",
        "Extraction model and a live form on a web demo page.",
        "End-of-turn model, backchannels and latency tuning toward 600 ms.",
        "Inbound and outbound phone calls through a SIP provider.",
        "A fine-tuned small language model trained on spoken-style dialogue as the brain.",
      ],
    },
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
