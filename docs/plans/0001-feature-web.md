# Responsive Login Feature

## Goal

Provide a responsive login experience with feature-local components and Redux Toolkit-managed login UI state. Keep the route server-rendered and isolate interactive form behavior in client components. This branch does not connect to an API or authenticate users.

## Current State

- The `/login` route and responsive login UI are in place.
- Login components are organized under `src/features/login/`.
- The form currently reports that authentication is not connected.
- Redux Toolkit and React Redux are installed, with a shared store, typed hooks, and a provider wrapping the login form.
- The Redux store includes the login slice; visibility and input values are held in memory while the form is in use.
- API calls, auth-service integration, and simulated login success are out of scope for this branch.

## Plan

1. **[x] Set up shared Redux state**
   - Add Redux Toolkit and React Redux to `apps/web`.
   - Configure the shared store and typed dispatch/state helpers under `src/shared/redux/`.
   - Add a client-side Redux provider and wrap `LoginForm`; keep the root layout as a server component.

2. **[x] Add login UI state**
   - Define a login slice under `src/features/login/` and register it with the shared store.
   - Keep password visibility, username, and password in transient Redux memory; do not persist credentials.
   - Keep feature-specific TypeScript declarations in `src/features/login/types.ts`.

3. **Connect the form to UI state only**
   - Keep `src/app/login/page.tsx` as a server component that composes feature components.
   - Keep only interactive form components in the client component boundary.
   - Use Redux selectors and actions for visibility and username/password input state.
   - Leave the existing submit feedback unchanged; do not make network requests, connect to the auth service, or show a successful login state in this branch.

4. **Verify the experience**
   - Check the form at mobile and desktop widths, including keyboard navigation and accessible feedback.
   - Run the web app lint and TypeScript checks.

## Acceptance Criteria

- The login route remains server-rendered, with client boundaries limited to interactive components and the Redux provider.
- The login layout is usable on mobile and desktop; decorative content does not displace the form on small screens.
- Login UI state is managed by Redux Toolkit; password values are transient and are not persisted.
- Submitting the form makes no API request and does not claim that authentication succeeded.
- Feature components, state, and types remain organized under `src/features/login/`.
