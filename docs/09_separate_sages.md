### Goal

Show separate assistant messages for each sage instead of a single consolidated orchestrator response. Use `agent_responses` to create one message per sage and render the avatar as initials: e.g., "marcus aurelius" → "MA", "Ghandi" → "G".

### Current state (as of this branch)

- `orchestratorService.sendMessage` maps the backend response into a single `ChatMessage` with:
  - `content`: `response.response` (consolidated text)
  - `metadata.agent_responses`: a `Record<string, string>` with per-sage text
  - `agent_queries`: a `Record<string, string>` with per-sage queries
- `useConversationStore.sendMessage` appends that single assistant message.
- `ChatMessage` component renders a single bubble and optionally toggles an "Agent Details" list that shows `agent_queries`.

### Target UX

- After a user sends a query, render one assistant bubble per responding sage.
- Each bubble shows:
  - The sage-specific response text.
  - An avatar with the sage initials.
  - Optionally, the originating query for that sage when expanding details.
- Keep ordering stable and predictable.

### Data model changes

1. Types in `src/types/api.ts`

- Extend `ChatMessage` to support per-sage attribution:
  - Add optional `agent_name?: string` (display name of the sage)
  - Optionally add `speaker_type?: 'user' | 'council' | 'sage'` (future-proofing)
  - Scope `agent_queries` to the message when it represents a single sage (i.e., set it to `{ [sage]: query }` for that message only)

Notes:

- `OrchestratorResponse` already contains `agent_responses` and `agent_queries`; no backend change required for MVP.

### Orchestrator mapping changes

In `src/services/orchestrator.ts`:

- Replace the single-message mapping with an expansion step:
  - If `agent_responses` exists and is non-empty, build an array of `ChatMessage` where each element corresponds to one sage.
  - For each `[sageName, sageText]`:
    - `content`: `sageText`
    - `role`: `'assistant'`
    - `agent_name`: `sageName`
    - `agent_queries`: if present, set to `{ [sageName]: response.agent_queries[sageName] }`
    - `conversation_id`: from the response
    - `metadata`: include any additional per-sage info if needed later
  - If for some reason `agent_responses` is empty, fall back to the consolidated `response.response` as a single assistant message (defensive default).

Ordering:

- Since object key order is not guaranteed, sort keys before mapping. Recommended strategies:
  - Preferred: define a `sageOrder` array in config and sort by that order when present.
  - Fallback: alphabetical sort of `Object.keys(agent_responses)`.

Return type:

- Change `sendMessage` to return `ChatMessage[]` (array). This makes state updates atomic and keeps UI consistent. The store will adapt accordingly.

### Conversation store changes

In `src/store/conversationStore.ts`:

- `sendMessage` currently expects a single `assistantMessage`. Update to handle an array:
  - Keep adding the `userMessage` immediately for responsiveness.
  - Await `orchestratorService.sendMessage(query, state.id)`, which now returns `ChatMessage[]`.
  - Append all assistant messages in one state update to avoid multiple re-renders and to preserve order:
    - `messages: [...get().messages, ...assistantMessages]`
  - Set `id` from the first assistant message's `conversation_id` if present.

### UI changes

1. `ChatMessage` component (`src/components/ui/ChatMessage.tsx`)

- Avatar:
  - If `message.role === 'assistant'` and `message.agent_name` is present, render a circular avatar with initials derived from `agent_name` instead of the shared `sage.png`.
  - Fallback to `sage.png` only when `agent_name` is not provided (e.g., legacy messages).
- Content:
  - Continue rendering `message.content`.
- Details toggle:
  - When expanded, and if `message.agent_queries` is present, show only that sage's query (there should be 0–1 entries after normalization).

Helper: initials generation

- Add a small pure util to derive initials from an arbitrary display name:

```ts
// utils/names.ts
export function getInitials(displayName: string): string {
  if (!displayName) return '?'
  const normalized = displayName.trim().replace(/\s+/g, ' ')
  const parts = normalized.split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  const first = parts[0].charAt(0).toUpperCase()
  const last = parts[parts.length - 1].charAt(0).toUpperCase()
  return `${first}${last}`
}
```

Usage in `ChatMessage`:

- `message.agent_name ? getInitials(message.agent_name) : <img src={sageImage} ... />`

2. `HomePage` remains unchanged

- It already maps over `messages` and renders `ChatMessage` for each item. After adopting the array return and store changes, multiple assistant messages will appear naturally.

### Edge cases and best practices

- Missing/empty responses: only render sages that have a non-empty response string.
- Key casing: treat agent names case-insensitively when matching `agent_queries` to `agent_responses`.
- Stable ordering: use a deterministic sort so the UI does not jump between renders.
- Single state update: when appending multiple assistant messages, set state once to minimize layout thrash and ensure smooth auto-scroll.
- Auto-scroll: `HomePage` already scrolls on `messages` change. Appending an array in one update will scroll correctly to the last sage message.
- Accessibility: provide `aria-label` on initials avatars (e.g., `aria-label="Marcus Aurelius"`).
- Persistence: the persisted store will now include multiple assistant entries per user query; this is expected and compatible.

### Optional enhancements

- Loading UI per sage: show a skeleton list of expected sages while waiting, then fill responses as they arrive. For now, keep the single loader for simplicity.
- Grouping: visually group the set of per-sage messages resulting from one user query with subtle spacing or a vertical rule for readability.
- Config-driven display names and order: maintain a `sages.ts` config with canonical names, display names, and desired order.

### Implementation checklist

- [ ] Update `ChatMessage` type with `agent_name?: string` (and optionally `speaker_type`) in `src/types/api.ts`.
- [ ] Change `orchestratorService.sendMessage` to return `ChatMessage[]`; expand `agent_responses` into individual messages; sort keys deterministically; populate `agent_name` and scoped `agent_queries`.
- [ ] Update `useConversationStore.sendMessage` to append an array of assistant messages and set `id`.
- [ ] Create `utils/names.ts` with `getInitials` and use it in `ChatMessage`.
- [ ] Adjust `ChatMessage` avatar rendering to use initials when `agent_name` is defined; show scoped agent query in details.

### Example data flow

Input to backend:

```json
{
  "query": "How to lead in crisis?",
  "conversation_id": "abc123"
}
```

Backend response (existing):

```json
{
  "response": "Consolidated…",
  "conversation_id": "abc123",
  "agent_queries": {
    "marcus aurelius": "…",
    "Ghandi": "…"
  },
  "agent_responses": {
    "marcus aurelius": "Focus on what you can control…",
    "Ghandi": "Lead by example…"
  }
}
```

Frontend expansion into messages:

```json
[
  {
    "role": "assistant",
    "agent_name": "marcus aurelius",
    "content": "Focus on what you can control…",
    "agent_queries": { "marcus aurelius": "…" }
  },
  {
    "role": "assistant",
    "agent_name": "Ghandi",
    "content": "Lead by example…",
    "agent_queries": { "Ghandi": "…" }
  }
]
```

Rendered avatars: "MA" and "G" respectively.
