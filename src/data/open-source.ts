// ─────────────────────────────────────────────────────────────────────────────
// Open Source section on the home page, plus case studies for featured PRs
// (they open at /projects/<slug>, same design as Selected Works).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metric, Project } from "./projects";

export type Contribution = {
  repo: string;
  title: string;
  summary: string;
  /** Short facts under the title, e.g. "Merged Oct 2026 · +40 −1". */
  meta: string;
  href: string;
  /** Text for the link to `href`, e.g. "PR #16831". */
  linkLabel: string;
  /** Slug of a case study in `openSourceCaseStudies`. */
  caseStudy?: string;
};

export const openSource: {
  intro: string;
  stat: Metric;
  profileUrl: string;
  contributions: Contribution[];
} = {
  intro: "Bug reports, fixes and new models contributed upstream to the tools and libraries I use.",
  stat: { value: "41+", label: "Merged pull requests" },
  profileUrl: "https://github.com/aditya0929",
  contributions: [
    {
      repo: "conda/conda",
      title: "Don't write config file on conda config --get",
      summary:
        "Found, reported and fixed a bug where `conda config --get` with no key silently rewrote the user's .condarc: creating it, reformatting it, or copying the system config into it. A one-line root-cause fix with regression tests.",
      meta: "Merged Oct 2026 · Bug fix · +40 −1 across 3 files",
      href: "https://github.com/conda/conda/pull/16831",
      linkLabel: "PR #16831",
      caseStudy: "conda-config-get",
    },
    {
      repo: "traceloop/OpenLLMetry",
      title: "Traces go missing when a model reports 0 tokens",
      summary:
        "Found and reported a bug in OpenLLMetry, Traceloop's open-source OpenTelemetry observability for LLM apps: when a model returns `0` in its token usage, the LangChain span is never exported and later LLM calls stop being traced too. Local models and proxies often report 0 tokens, so it's easy to hit. The report includes a self-contained reproduction against a mock OpenAI server, no API key needed.",
      meta: "Bug report · Oct 2026 · LangChain instrumentation",
      href: "https://github.com/traceloop/openllmetry/issues/4588",
      linkLabel: "ISSUE #4588",
    },
    {
      repo: "abhisheks008/DL-Simplified",
      title: "8 deep-learning projects",
      summary:
        "Contributed during Social Summer of Code 2023, finishing as its second-highest contributor: maize leaf disease detection, artwork image recognition, grape plant disease recognition, weather image recognition, American Sign Language detection, dog breed classification, vegetable image classification and lemon quality segmentation.",
      meta: "8 merged PRs · Jun–Jul 2023",
      href: "https://github.com/abhisheks008/DL-Simplified/pulls?q=is%3Apr+author%3Aaditya0929+is%3Amerged",
      linkLabel: "VIEW PRS",
    },
  ],
};

export const openSourceCaseStudies: Project[] = [
  {
    slug: "conda-config-get",
    name: "conda #16831",
    category: "OPEN SOURCE",
    type: "Bug Fix",
    event: "conda/conda",
    role: "Contributor",
    year: "2026",
    description:
      "Found, reported and fixed a bug in conda where `conda config --get` with no key silently rewrote the user's .condarc.",
    summary:
      "Found, reported and fixed a bug in conda, the open-source package and environment manager: `conda config --get` with no key was silently rewriting the user's .condarc. A one-line root-cause fix with regression tests, merged into conda's main branch.",
    stack: ["Python", "pytest", "conda"],
    links: [
      { label: "PULL REQUEST", href: "https://github.com/conda/conda/pull/16831", name: "Pull request #16831" },
      { label: "ISSUE", href: "https://github.com/conda/conda/issues/16825", name: "Bug report #16825" },
    ],
    backdrop: "moss",
    caseStudy: {
      problem: [
        "`conda config --get <key>` only reads the config. Run `conda config --get` with no key, though, and conda wrote the user's .condarc, even though the command should never change anything.",
        "It showed up three ways: with no ~/.condarc, an empty one was created; a hand-written ~/.condarc was reformatted, losing its indentation and comment alignment; and with only a system .condarc present, its settings were copied into the user's file, so later changes to the system file stopped applying.",
      ],
      approachTitle: "The fix",
      approach: [
        {
          title: "Report",
          body: "Filed issue #16825 with reproduction steps for all three symptoms: no user config, a hand-written one, and a system-only setup.",
        },
        {
          title: "Root cause",
          body: "Near the end of execute_config, the file is written unless --get was used: `if not args.get: rc_config.write()`. A plain --get leaves args.get as an empty list, and `not []` is True, so the write ran anyway.",
        },
        {
          title: "Fix",
          body: "Changed the check to `if args.get is None:`, so the file is only written when --get wasn't passed at all. It now mirrors the read check a few lines above (`if args.get is not None:`).",
        },
        {
          title: "Tests",
          body: "test_config_get_missing now also asserts that no file is created, and a new parametrised test, test_config_get_does_not_modify_file, checks that a hand-written file is unchanged after --get, with and without a key. Both fail without the fix and pass with it, and the rest of the config tests still pass.",
        },
        {
          title: "Review and merge",
          body: "Added a release note for the next conda release; the PR was reviewed and merged into main by a conda maintainer.",
        },
      ],
      code: {
        file: "conda/cli/main_config.py",
        diff: "     # config.rc_keys\n-    if not args.get:\n+    if args.get is None:\n         rc_config.write()",
      },
      metrics: [
        { value: "1 line", label: "Root-cause fix", note: "+40 −1 across 3 files, mostly tests" },
        { value: "3", label: "User-facing symptoms resolved", note: "Created, reformatted or copied .condarc" },
        { value: "2", label: "Tests extended or added", note: "Both fail without the fix" },
        { value: "4 days", label: "From PR to merge", note: "Opened Oct 9, merged Oct 13, 2026" },
      ],
      highlights: [
        "A classic Python truthiness bug: an empty list and None are both falsy, but here they mean different things (--get with no key versus no --get at all).",
        "A conda maintainer thanked me for volunteering and offered to point me to more work on the project.",
      ],
    },
  },
];
