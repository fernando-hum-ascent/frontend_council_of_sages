### Add User Balance: fetch, refresh, and display in sidebar

- **Goal**: Show the authenticated user’s current balance in the lateral tab (sidebar). If balance is below 0, display a warning to top-up (no top-up flow yet).
- **Sources**:
  - GET `GET /users/me/balance` → `{ balance_tenths_of_cents: number, balance_usd: number, updated_at: string }`
  - Orchestrator response will include a field `balance` with the same format
- **Refresh triggers**:
  - On app init or after login
  - On tab visibility change (when becoming visible)
  - Light periodic polling while visible
  - After receiving an orchestrator answer (use the balance field from response)

---

### Data model and types

- **Add `Balance` type** in `src/types/api.ts` (keeps all API types together):
  - `export interface Balance { balance_tenths_of_cents: number; balance_usd: number; updated_at: string }`
- **Extend orchestrator response** to include balance:
  - `export interface OrchestratorResponse { ...; balance: Balance }`

---

### API service

- **New service**: `src/services/balanceService.ts`
  - `getMyBalance(): Promise<Balance>` → `ApiService.get('/users/me/balance')`

---

### State management

- **New store**: `src/store/balanceStore.ts`
  - State:
    - `balance: Balance | null`
    - `loading: boolean`
    - `error: string | null`
    - `lastFetchedAt: number | null`
  - Derived:
    - `needsTopUp: boolean` → `balance?.balance_tenths_of_cents < 0`
  - Actions:
    - `setBalance(balance: Balance)`
    - `fetchBalance(): Promise<void>`
    - `setError(error: string | null)`
    - `clear()` (on logout)
  - Simple throttle inside `fetchBalance` to avoid bursts (e.g., skip if `Date.now() - lastFetchedAt < 15_000`).

---

### Hooks

- **`useBalance()`** in `src/hooks/useBalance.ts`
  - Returns store state and actions for components.

- **`useBalanceBootstrap()`** in `src/hooks/useBalanceBootstrap.ts`
  - Responsibilities:
    - Watch auth status (`useAuth`) and call `fetchBalance()` when the user becomes authenticated (also once on app init if already authenticated).
    - Register `visibilitychange` listener: when `document.visibilityState === 'visible'`, call `fetchBalance()`.
    - Cleanup listeners and intervals on unmount.
  - Usage: call once near app root (`App.tsx` or `Layout.tsx`) next to `useFirebaseAuth()`.

---

### Orchestrator integration

- Update `src/types/api.ts` as above so `OrchestratorResponse.balance?: Balance`.
- In `src/services/orchestrator.ts`:
  - After receiving the backend response, if `response.balance` exists, update balance store directly:
    - `useBalanceStore.getState().setBalance(response.balance)`
  - Keep the existing `sendMessage(...) → ChatMessage` return signature unchanged to avoid ripple edits.

- In `src/store/conversationStore.ts`:
  - No changes required if side-effect is done inside orchestrator service. If not using side-effect, then after `assistantMessage` arrives, extract any `balance` field (if we pass raw response) and update the balance store.

---

### UI: Sidebar display

- File: `src/components/ui/Sidebar.tsx`
  - Add a small balance section in the user area (above the Logout button):
    - Loading: show `—` or a subtle skeleton.
    - Success: show `$<balance_usd.toFixed(2)>` and a tiny `Updated <relative time>` label.
    - Error: show `—` and a small “Retry” button or click area that triggers `fetchBalance()` (optional).
    - If `needsTopUp` (balance below 0): show a red-accented warning message (non-blocking) indicating the user needs to top-up.

- Minimal example of render logic (pseudo-JSX):

```tsx
const { balance, loading, error, fetchBalance, needsTopUp } = useBalance()

<div className="rounded-md bg-white/60 p-3 text-sm text-gray-800">
  <div className="flex items-baseline justify-between">
    <span className="font-medium">Balance</span>
    <span>{loading ? '—' : (balance ? `$${balance.balance_usd.toFixed(2)}` : '—')}</span>
  </div>
  {!!balance && (
    <div className="mt-1 text-xs text-gray-500">Updated {timeAgo(balance.updated_at)}</div>
  )}
  {needsTopUp && (
    <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">
      Your balance is below 0. Please top-up to continue.
    </div>
  )}
</div>
```

- Add a tiny util `timeAgo(isoString: string)` or use an existing date helper for relative time.

---

### App bootstrap wiring

- In `src/App.tsx` (or `src/components/common/Layout.tsx`):
  - Keep `useFirebaseAuth()` at root.
  - Add `useBalanceBootstrap()` so balance loads on init/login and sets up visibility + polling.

- In `src/services/authService.ts` sign-out flow:
  - After successful `signOut()`, call `useBalanceStore.getState().clear()`.

---

### Error handling and performance considerations

- Throttle `fetchBalance()` to avoid bursts (min 15s between calls) even if visibility events and orchestrator answers pile up.
- Debounce visibility-triggered fetch slightly (e.g., 250ms) to prevent redundant fetches when switching tabs rapidly.
- Swallow 401s: if unauthenticated, store should set `balance = null` and stop polling.
- Network failures: set `error` and keep last known balance; next trigger or polling will retry.

---

### File changes checklist

- `src/types/api.ts`
  - Add `Balance` interface
  - Add `balance?: Balance` to `OrchestratorResponse`
- `src/services/balanceService.ts` (new)
  - `getMyBalance()`
- `src/store/balanceStore.ts` (new)
  - State + actions described above
- `src/hooks/useBalance.ts` (new)
- `src/hooks/useBalanceBootstrap.ts` (new)
- `src/services/orchestrator.ts`
  - On successful response, if `response.balance`, update `useBalanceStore`
- `src/components/ui/Sidebar.tsx`
  - Display balance block and negative-balance warning
- `src/services/authService.ts`
  - On `signOut()`, clear `useBalanceStore`
- (Optional) `src/utils/time.ts` with `timeAgo()` helper

---

### Acceptance criteria

- Balance appears in the sidebar once the user is authenticated; displays `$X.YY` and last updated time.
- On app init or after login, balance is fetched.
- When switching back to the tab, balance refreshes.
- After sending a message and receiving the orchestrator answer, balance updates from the response.
- If balance is negative, a clear non-blocking warning is shown about topping up.
- On logout, balance is cleared and polling stops.
- Lint passes and type-safety maintained (no `any`).
