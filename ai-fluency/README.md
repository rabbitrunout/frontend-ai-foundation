# AI & Frontend Research Brief Workflow

A source-grounded AI workflow for turning a research question into a concise, reviewed industry brief.

This project was built as part of the FlyRank AI Fluency track. It combines NotebookLM for source-grounded research with ChatGPT for drafting, quality review, and revision, while keeping a human responsible for final verification.

## What It Does

The workflow takes a research topic and moves it through six stages:

```text
GATHER
   ↓
SYNTHESIZE
   ↓
DRAFT
   ↓
REVIEW
   ↓
REVISE & FORMAT
   ↓
HUMAN CHECK
```

The goal is not simply to generate a summary. The workflow separates research, writing, review, and final approval so that unsupported claims and lost context are easier to catch.

## Who It Is For

The workflow is designed for developers, students, and technical professionals who need a short research brief from multiple sources without manually reading and summarizing every source from scratch.

My primary use case is researching AI and frontend-development topics.

## Tools

- Google NotebookLM — source discovery and source-grounded synthesis
- ChatGPT — drafting, quality review, and final revision
- Human review — source selection, uncertainty checks, and final approval

No custom API or paid automation infrastructure is required.

## Architecture

### 1. GATHER

NotebookLM searches for sources related to the research question.

Before continuing, the human reviewer checks that:

- sources were imported successfully;
- the intended sources are selected;
- the source set is relevant to the research question.

### 2. SYNTHESIZE

NotebookLM analyzes only the selected sources.

The synthesis extracts:

- key findings;
- tools, technologies, and practices;
- benefits;
- risks and limitations;
- areas where multiple sources agree;
- uncertain or conflicting claims;
- areas requiring human review.

Important findings remain connected to citations.

### 3. DRAFT

The NotebookLM synthesis is passed to ChatGPT.

ChatGPT converts the research into a 350–500 word industry brief for junior frontend and AI developers.

The draft is instructed to use only information contained in the synthesis.

### 4. REVIEW

The draft and original synthesis are compared in a separate quality-review pass.

The review checks for:

- unsupported claims;
- misleading or decontextualized statistics;
- overconfident wording;
- missing findings;
- repetition;
- clarity.

The output separates findings into `PASS`, `REVISE`, and `FINAL RECOMMENDATIONS`.

### 5. REVISE & FORMAT

ChatGPT applies the supported review recommendations.

The revised brief must remain grounded in the original research synthesis and preserve uncertainty where the sources disagree.

### 6. HUMAN CHECK

The final output is not automatically approved.

A human performs the final check for:

- source quality;
- statistics and context;
- unsupported additions;
- uncertainty;
- important caveats;
- final readability.

Only after this step is the brief considered complete.

## Example Usage

Example research question:

```text
How AI tools are changing frontend development in 2026
```

The workflow gathers sources in NotebookLM, creates a structured synthesis, drafts an industry brief in ChatGPT, reviews the draft against the synthesis, revises it, and finishes with human approval.

## Example Run

For the 2026 frontend-development topic, NotebookLM gathered and imported 10 sources.

The synthesis identified both productivity benefits and important areas of disagreement.

The first ChatGPT draft was evaluated as:

```text
PASS WITH MINOR REVISIONS
```

The review identified several improvements, including:

- restoring context around code-quality statistics;
- including evidence for AI-assisted development speed;
- balancing risks with testing and debugging benefits;
- qualifying claims about the React + AI stack;
- preserving uncertainty around benchmark results;
- making human-review requirements more concrete.

The final revision incorporated those recommendations before human approval.

## V2 Evaluation

The workflow was evaluated across five different research runs.

All five completed successfully with:

```text
PASS WITH MINOR REVISIONS
```

This was intentional: the review stage was designed to find smaller grounding, context, or clarity issues before the final brief was approved.

### Evaluation Summary

| Metric | Result |
| --- | --- |
| Evaluation runs | 5 |
| Completed runs | 5/5 |
| Review outcome | PASS WITH MINOR REVISIONS |
| Average active time per run | 1.6 minutes |
| Estimated manual baseline | 30 minutes |
| Estimated active-time reduction | ~94% |

The time comparison measures active workflow time and should be treated as an estimate rather than a universal productivity claim.

## Failure Modes Found During Testing

Testing revealed several important failure modes.

### Failed source import

A source may fail to import or become unavailable.

**Mitigation:** verify the source list before synthesis.

### Wrong source set

Research quality can degrade when the selected sources do not match the intended question.

**Mitigation:** human review of the source set remains mandatory.

### Imported but unselected sources

A source can exist in NotebookLM without being included in the active synthesis.

**Mitigation:** confirm that intended sources are selected before running the synthesis prompt.

### Source disagreement

Different sources may reach conflicting conclusions.

**Mitigation:** the synthesis explicitly asks for disagreements and uncertainty rather than forcing consensus.

### Overconfident statistics

A draft can preserve a number while losing the context that makes the number meaningful.

**Mitigation:** the review compares statistics and claims against the original synthesis.

### Lost caveats during compression

Reducing a large research synthesis to a short brief can remove important qualifications.

**Mitigation:** the review stage specifically checks for lost context and overconfident wording.

## Design Decision

The most important design decision was separating drafting from review.

Instead of asking one model call to research, write, and approve its own output, the workflow creates an intermediate source-grounded synthesis and then performs a separate review against that synthesis.

This makes it easier to detect when a polished draft has dropped context or made a claim sound more certain than the research supports.

## Limitations

This workflow does not guarantee factual correctness.

Its quality still depends on:

- the quality of the sources;
- the sources selected by the user;
- NotebookLM's synthesis;
- the completeness of citations;
- the review prompt;
- human judgment.

The workflow also moves information manually between NotebookLM and ChatGPT, so it is not a fully autonomous agent.

This manual boundary is intentional in the current version because it keeps source selection and final approval visible to the human operator.

## How AI Was Used

AI was used at several distinct stages rather than as a single "write this for me" prompt.

NotebookLM was used for source discovery and grounded synthesis.

ChatGPT was used to:

- transform the synthesis into a structured brief;
- compare the draft against the original research;
- identify missing context and overconfident claims;
- revise the brief using the review findings.

AI assistance was also used while designing and refining the workflow prompts.

Human judgment remained responsible for choosing the research topic, checking the source set, evaluating uncertainty, reviewing important statistics, and approving the final result.

## What I Learned

The biggest lesson from this workflow was that fluent output is not the same as trustworthy output.

The draft stage can produce professional-looking writing very quickly, but the review stage repeatedly found missing context, overconfident wording, or useful evidence that had been compressed away.

Separating research, synthesis, drafting, review, revision, and human approval made the workflow more reliable and easier to explain.

## Demo

The final demo shows one complete run:

```text
Research question
      ↓
NotebookLM source gathering
      ↓
Source-grounded synthesis
      ↓
ChatGPT draft
      ↓
Quality review
      ↓
Final revision
      ↓
Human approval
```

The demo also explains one design decision and one known limitation of the workflow.

## Author

**Irina Safronova**

Frontend & AI Developer