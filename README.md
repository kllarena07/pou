# DependaPou

## Inspiration

Research shows that **42% of developers** spend most of their time dealing with **technical debt**. On average, developers dedicate **17.3 hours per week** to maintenance tasks such as debugging and refactoring. This ongoing struggle with complex, over-engineered, or low-quality code can be mentally exhausting, contributing to **developer burnout**.

Inspired by this challenge, and the power of **Large Language Models (LLMs) to automate workflows**, we built **DependaPou**, a developer tool designed to **offload much of the maintenance process to Generative AI**.

## What It Does

When you upload your GitHub repository to our dashboard, **DependaPou**:

1. **Scans your codebase** for outdated dependencies and vulnerabilities using the **Groq Inference API** running in a **Modal container**.
2. **Generates a list of files** that require refactoring.
3. **Parallel processes each file** using additional **Modal containers** with **Groq's LLM** to:
   - Refactor the code.
   - Provide clear, AI-generated comments.
4. **Bundles the changes** into a new **GitHub branch**, where they are:
   - **Staged, committed, and pushed**.
   - **Opened as a pull request (PR)** for review.
5. **Notifies users** via a **Next.js dashboard**, with updates stored in **Supabase**.

## How We Built It

- **[Modal](https://modal.com/):** Serverless containers for parallel file processing.
- **[Groq](https://groq.com/):** Inference API for AI-powered code refactoring.
- **[Next.js](https://nextjs.org/):** Live-updating dashboard frontend.
- **[Supabase](https://supabase.com/):** Notification storage.

## Challenges We Faced

- Debugging **Modal containers** to ensure smooth execution.

## Accomplishments We're Proud Of

- Successfully leveraging Modal for parallel processing.
- Automating GitHub pull request creation.
- Designing a scalable, high-throughput pipeline for AI-powered code maintenance.

## What We Learned

- Efficient parallel file processing with Modal.
- Best practices for automating GitHub workflows.

## What's Next for DependaPou

- Automated unit test generation for refactored code.
- Direct deployments from our platform.

We’re excited about the future of DependaPou and how it can revolutionize developer productivity 🚀.
