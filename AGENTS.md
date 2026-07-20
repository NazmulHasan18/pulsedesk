# AGENTS.md

## Project Overview

This is a Next.js frontend application.

Tech Stack:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Zod

## General Rules

- Work only within this repository.
- Do not access or modify files outside this project.
- Keep changes focused on the requested task.
- Do not refactor unrelated code.
- Preserve the existing project structure.
- Ask before installing new dependencies.

## Code Style

- Use TypeScript only.
- Prefer functional React components.
- Reuse existing components whenever possible.
- Keep components small and reusable.
- Use async/await instead of promise chains.
- Avoid unnecessary comments.

## UI Guidelines

- Use shadcn/ui components whenever applicable.
- Style using Tailwind CSS.
- Keep spacing, typography, and colors consistent with the existing design.
- Ensure layouts are responsive.
- Maintain accessibility (ARIA labels, keyboard navigation, semantic HTML).

## State Management

- Use TanStack Query for server state.
- Use React state only for local UI state.
- Do not introduce another state management library unless requested.

## Forms

- Use React Hook Form.
- Validate with Zod.
- Display user-friendly validation messages.

## API Integration

- Use the existing API client and utilities.
- Do not hardcode API URLs.
- Handle loading, error, and empty states.
- Keep API logic separate from UI components.

## File Organization

- Place reusable UI in the existing components directory.
- Keep page-specific components near their pages.
- Follow the current folder structure.

## Performance

- Minimize unnecessary re-renders.
- Use dynamic imports only when beneficial.
- Optimize images using Next.js Image.
- Avoid unnecessary client components.

## Before Finishing

- Ensure TypeScript has no errors.
- Ensure ESLint passes.
- Ensure components are responsive.
- Ensure no unrelated files were modified.
