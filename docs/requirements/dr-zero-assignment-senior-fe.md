# Assignment: Senior Frontend Engineer -- Dr.Zero

**Role:** Senior Frontend Engineer  
**Platform:** Dr.Zero -- AI-Powered Decarbonization Platform  
**Time Budget:** 4-6 hours  
**Submission:** GitHub repository + live Vercel deployment URL  
**Mock Data:** See attached `dr-zero-fe-mock-data.csv`

---

## Background

Dr.Zero is an agentic AI platform for corporate decarbonization. Its UI is **task-driven**: instead of navigating through pages, users work through a queue of tasks. Each task triggers a **workflow** -- a sequence of steps. At each step, a **mini-app** renders in the canvas area to collect input, display data, or request approval.

### The Concept: Mini-Apps

A mini-app is a self-contained UI unit that:

- Receives **typed data** as input (what to display, what the AI agent has prepared)
- Renders an **interactive view** appropriate to the workflow step (a chart, a form, a review table, an email composer, etc.)
- Calls **onComplete** with the user's output when the step is done, advancing the workflow to the next step
- Is **composable** -- any mini-app can appear at any step of any workflow. The canvas doesn't know which mini-app it will render ahead of time; it resolves the component dynamically based on workflow state.

Think of mini-apps as the building blocks of an agentic interface -- not pages, not modals, but small functional units that an AI orchestrator can assemble into workflows on the fly.

### Reference Layout

```
┌─────────────────────────────────────────────────────────┐
│                     Agentic Layout                       │
│  ┌──────────┬──────────────────────────────────────┐    │
│  │          │                                      │    │
│  │  Task    │         Canvas                       │    │
│  │  List    │      (Active mini-app renders here)  │    │
│  │          │                                      │    │
│  │          ├──────────────────────────────────────┤    │
│  │          │         Chat / Narrative              │    │
│  │          │   (AI explains what's happening)      │    │
│  └──────────┴──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

This layout is a reference, not a constraint. Feel free to reinterpret it.

### Domain Context

Dr.Zero helps Japanese enterprises track and reduce carbon emissions. The data model involves:

- **Facilities** (factories, offices, warehouses) that produce emissions
- **Emission data** (electricity usage in kWh, gas in m3, fuel in liters) submitted monthly
- **Anomalies** detected by AI (outliers, missing values, duplicates, format errors)
- **Suppliers** from whom Scope 3 emission data must be collected
- **Workflows** for reviewing, approving, and correcting data with human-in-the-loop controls

UI labels should be in **Japanese** (English subtitle acceptable).

---

## The Assignment

We're giving you a domain problem and sample data. **How you solve it is up to you.**

Build a working prototype that handles the three task patterns described below. The mock data is in the attached CSV file (`dr-zero-fe-mock-data.csv`). Use it as-is, extend it, or reshape it to fit your architecture -- the data is a starting point, not a cage.

**What matters:** We want to see how you think about composable, agent-driven UI. The three patterns below are the scenarios -- but the architecture, interaction design, component model, and anything you add beyond the requirements are where you show us who you are as an engineer.

**Use AI freely.** You are explicitly encouraged to use AI coding assistants (Cursor, Copilot, Claude, etc.) as you would in daily work. We are evaluating your ability to direct and review AI-generated output, not your typing speed.

**Pick your own stack.** Framework, state management, styling, charting -- all your choice. Must be deployable to **Vercel**. TypeScript strongly preferred. No backend needed.

---

## Pattern A: Anomaly Detection Review

**Scenario:** AI detects anomalies in emission data. Tasks appear in a queue. The user clicks one and walks through a workflow to investigate and resolve it.

**Suggested workflow:** chart → review → approve (but you may restructure this)

**Data:** See `anomaly_tasks`, `anomaly_chart`, `anomaly_chart_insights`, and `anomaly_review_fields` sheets in the CSV.

**The essentials:**

- The user should see the anomaly visualized in context (chart, comparison, or whatever makes the anomaly obvious)
- The user should be able to review AI-extracted fields, with low-confidence fields (< 80%) visually flagged
- There should be a way to accept the AI's suggested fix, manually edit, or dismiss
- An approval/confirmation step before the change is committed

**Beyond the essentials -- show us what you'd do:**

- How would you handle different anomaly types (outlier vs. missing value vs. duplicate) -- same mini-app with different modes, or different mini-apps?
- What does the AI narrative look like in the chat panel when the user opens this task?
- How does the user's decision in one step carry forward to the next?

---

## Pattern B: New Data Input

**Scenario:** A sustainability manager uploads a utility bill (PDF). AI extracts structured fields. The user reviews, corrects, and approves the extracted data.

**Suggested workflow:** upload → AI extraction (simulated) → review → approve → save

**Data:** See `extraction_task` and `extraction_result` sheets in the CSV.

**The essentials:**

- A file upload interaction (drag-and-drop, click, or both)
- A simulated AI extraction delay (2-3 seconds) with loading state
- A review view where extracted fields are shown with confidence scores, and low-confidence fields are flagged
- A save confirmation showing what was persisted

**Beyond the essentials -- show us what you'd do:**

- What does the data contract look like between the AI extraction agent and the frontend? Define it in your code.
- What happens on partial extraction (some fields extracted, others failed)?
- How would you handle a field mapping step where the user confirms which extracted fields map to which database columns?

---

## Pattern C: Supplier Engagement

**Scenario:** The company needs Scope 3 emission data from 25 suppliers. 18 have responded, 7 haven't, 2 are overdue. The user reviews status and sends reminder emails to non-respondents.

**Suggested workflow:** status overview → email composition → confirmation → send

**Data:** See `vendor_task`, `vendor_list`, `vendor_chart`, `vendor_chart_insights`, and `email_template` sheets in the CSV.

**The essentials:**

- A status visualization showing the response breakdown
- An email composition view with the ability to select/deselect vendors
- Overdue vendors should be visually distinct and pre-selected
- A confirmation step before sending ("7件のメールを送信します" / Sending 7 emails)

**Beyond the essentials -- show us what you'd do:**

- Batch email with per-vendor personalization?
- A preview pane showing what the email looks like for a specific vendor?
- How would you surface partial send failures (3 of 7 emails fail) back to the user?

---

## Design Document

Include a `DESIGN.md` in your repo (max 800 words) covering:

1. **Your mini-app architecture**: How did you structure mini-apps? What makes them composable? How does the canvas decide which one to render?

2. **Agent-to-UI data flow**: If a real AI backend agent were processing data, how would results reach the frontend? Propose a generic event/message shape.

3. **State and transitions**: How does your app manage workflow state and pass data between steps?

4. **Error handling**: What happens when the AI extraction times out or emails partially fail?

This document is where you show us you can think beyond the frontend boundary.

---

## Evaluation

| Criteria | Weight | What We Look For |
|----------|--------|------------------|
| **Mini-app composition** | 30% | Are your mini-apps genuinely composable, or just three separate pages? Could a new workflow be assembled from existing mini-apps without restructuring the app? |
| **Full-function ownership** | 25% | Did you define data contracts, think about error states, design backend integration? Do you think like an owner of the feature, not just the UI? |
| **Code quality** | 20% | Clean structure, sensible component boundaries, typed data where it matters. Code a teammate would want to maintain. |
| **Design document** | 15% | Clear, practical thinking about architecture. Bonus if it contains an insight that would change how we build the real system. |
| **Japanese-first UX** | 10% | Japanese labels and copy. Layout handles Japanese text naturally. Enterprise-appropriate density. |

### What "Great" Looks Like

A great submission surprises us. Maybe you add a mini-app we didn't ask for. Maybe your workflow engine is so clean that defining a new workflow is just a JSON config. Maybe your design doc proposes an event model we hadn't considered. Maybe the UX polish goes beyond what we expected in 4-6 hours.

The three patterns are the floor. **The ceiling is wherever your skills take you.**

### What We Don't Expect

- Pixel-perfect design -- functional and clean is sufficient
- Comprehensive tests -- nice to have, not required
- Mobile responsiveness -- desktop-first is fine
- Strict adherence to our suggested workflows -- if you have a better idea, do it and explain why

---

## Submission

1. Push your code to a GitHub repository
2. Deploy to **Vercel** and include the live URL in the README
3. Include `DESIGN.md` with your design document
4. Include `README.md` with:
   - The live Vercel URL
   - How to run locally
   - Your tech stack choices and why
   - Any assumptions or deviations from the assignment
5. Send us the GitHub link and the Vercel URL

---

## Getting Started

1. Read through the CSV data to understand the three scenarios
2. Pick your stack and scaffold the project
3. Build the layout and mini-app renderer first -- the composition model is the backbone
4. Implement the three patterns, starting with whichever feels most natural
5. Write `DESIGN.md` last -- by then you'll have concrete opinions
6. Deploy to Vercel and verify the demo works

Good luck. We want to see how you think -- not just how you code.
