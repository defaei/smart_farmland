# Responsive Login Feature

## Goal

Provide a responsive login experience with feature-local components and Redux Toolkit-managed login UI state. Keep the route server-rendered and isolate interactive form behavior in client components. This branch does not connect to an API or authenticate users.

## Current State

- The `/login` route and responsive login UI are in place.
- Login components are organized under `src/features/login/`.
- The form currently reports that authentication is not connected.
- Redux Toolkit and React Redux are installed, with a shared store, typed hooks, and a provider wrapping the login form.
- The Redux store has no feature reducers yet; login form state remains local until the login UI slice is implemented.
- API calls, auth-service integration, and simulated login success are out of scope for this branch.

## Plan

1. **[x] Set up shared Redux state**
   - Add Redux Toolkit and React Redux to `apps/web`.
   - Configure the shared store and typed dispatch/state helpers under `src/shared/redux/`.
   - Add a client-side Redux provider and wrap `LoginForm`; keep the root layout as a server component.

2. **Add login UI state**
   - Define a login UI slice under `src/features/login/` and register it with the shared store.
   - Represent the submit result as idle or unavailable; do not add request or success states without an API.
   - Keep password visibility and other temporary presentation state local to the form; do not persist credentials in Redux state.
   - Keep feature-specific TypeScript declarations in `src/features/login/types.ts`.

3. **Connect the form to UI state only**
   - Keep `src/app/login/page.tsx` as a server component that composes feature components.
   - Keep only interactive form components in the client component boundary.
   - Dispatch the UI action on submit and render an accessible message that login is unavailable until authentication is implemented.
   - Do not make network requests, connect to the auth service, or show a successful login state in this branch.

4. **Verify the experience**
   - Check the form at mobile and desktop widths, including keyboard navigation and accessible feedback.
   - Run the web app lint and TypeScript checks.

## Acceptance Criteria

- The login route remains server-rendered, with client boundaries limited to interactive components and the Redux provider.
- The login layout is usable on mobile and desktop; decorative content does not displace the form on small screens.
- Login UI state is managed by Redux Toolkit, while passwords are not persisted or placed in global state.
- Submitting the form makes no API request and does not claim that authentication succeeded.
- Feature components, state, and types remain organized under `src/features/login/`.
