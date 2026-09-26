# Frontend Improvements (React / TypeScript)

A plan for cleaning up the frontend: remove the retired project, replace the layered style system, extract reusable components, and fix the bugs found along the way.

Status key: `[ ]` open · `[x]` done

Backend issues are tracked separately in [BUGS.md](BUGS.md).

---

## Goals

- **Less code:** the admin panel goes from about 890 lines to about 250.
- **One place per style:** each visual element's classes live in its own component, not spread across `tokens.ts` → `badges.ts` → the component.
- **No dead code:** remove the retired project and unused types and styles.
- **The site looks the same:** apart from the badge-colour fix (#7) and the visitor-facing fixes (#4, #11, #12), there are no visual changes.

---

## P1 — Bugs

### [x] 1. ~~Admin login accepts any credentials~~ (not a bug; optional improvement)
**Where:** `pages/Admin.tsx`, `handleLogin`

**Checked on 2026-09-26:** wrong credentials are rejected with "Invalid username or password", and `admin/admin` logs in. See BUGS.md #1 for why.

**Done on 2026-09-26 as part of #3:** the login now uses `POST /api/auth/login`, and `GET /api/auth/me` restores it after a refresh.

---

### [x] 2. Admin actions fail silently
**Where:** all 6 files in `components/admin/*Tab.tsx`

**Fixed on 2026-09-26:**
- **`api/errors.ts`:** `toApiError()` turns any failed request into `{ status, message, fields }`:
  - network down → "Could not connect to the server"
  - 401 → "Your session has expired"
  - anything else → the backend's `error` message and `fields`
- **`hooks/useCrud.ts`:** loads, saves and deletes for a tab, and tracks `loadError`, `saveError`, `deleteError` and `busy`. A 401 calls `onUnauthorized`. It loads in a `.then` callback, which also **fixed all 5 lint errors**.
- **`components/admin/ErrorBox.tsx`:** shows the message, with field errors as readable labels (e.g. "Start date must not be blank").
- **All 6 tabs use `useCrud`:**
  - load errors appear under the header, save errors inside the modal (which stays open) and delete errors inside the confirm dialog
  - Save and Delete are disabled while a request is running
  - errors are cleared when a dialog opens
- **`Admin.tsx`:** passes `onUnauthorized={() => setAuth(null)}` to each tab, so a 401 logs you out. For a **429** the login form shows the server's message ("Too many failed login attempts…") instead of "Invalid username or password."

**Checked:** `tsc`, **`eslint` (0 problems; was 5)** and the build all pass. The real `SkillsTab` was also rendered in a simulated browser (happy-dom) against the running backend:
| Scenario | Result |
|---|---|
| Open tab | list loads (5 rows) |
| Save with category `"   "` | modal stays open, shows "Validation failed · Category must not be blank" |
| Save with wrong password | "Your session has expired…", `onUnauthorized` called |
| Valid save, then delete | modal closes, list refreshes (5 → 6 → 5) |

**Not done here:** per-field messages next to each input (they're listed at the top of the modal), and trimming input before sending (#13). Both fit naturally into `CrudTab` (#10).

**Problem:** `handleSubmit`, `handleDelete` and `load` don't catch errors. When a request fails (401, 400 or a network error), the result is an unhandled promise rejection, the modal stays open, and nothing is shown.

**Fix:** The `useCrud` hook (#9) catches errors, exposes an `error` state, and shows it inside the modal. After a `401`, log the user out and send them to the login form.

**Also:** the backend now returns `{"error": "...", "fields": {...}}` for errors (BUGS.md #4), so show `fields.<name>` next to the matching input. The login form in `Admin.tsx` shows "Invalid username or password." for every failed response. For a `429` (BUGS.md #9) it should show the response's `error` message ("Too many failed login attempts. Try again later.") instead.

---

### [x] 3. Admin password stored in `sessionStorage`
**Where:** `main.tsx`

**Fixed on 2026-09-26 with a session cookie** (chosen over memory-only or a bearer token):
- **Backend:**
  - New `AuthController` with `POST /api/auth/login` (Basic credentials, still covered by the brute-force filter) and `GET /api/auth/me` (200 with the username, or **204** when not logged in, so ordinary visitors don't get a console error). Spring Security handles `POST /api/auth/logout`, which returns 204; `GET` doesn't log out.
  - The session cookie is **HttpOnly, SameSite=Strict**, with a 2h idle timeout. Tomcat marks it Secure behind HTTPS.
  - Only the login endpoint creates sessions. Basic-auth requests and rejected requests don't, and the replay-after-login feature is disabled.
- **Frontend:**
  - New `api/auth.ts` with `login`, `getCurrentUser` and `logout`. `api/admin.ts` no longer builds Basic headers.
  - `useCrud` and the tabs no longer take `auth`.
  - `main.tsx` stores **only the username** in React state and restores the login with `/api/auth/me` on page load. Logging out also ends the server session. The login form clears the password after a successful login.
  - `Auth` is now `{ username }` and lives in `api/auth.ts`.

**Checked:**
- **Backend tests:** 137/137. `AuthSessionIntegrationTest` (8) covers login, `me`, writes using only the session, logout, and that `GET` doesn't log out. Real-server tests check the `Set-Cookie` flags and that public, Basic and rejected requests create no session.
- **Over HTTP through the Vite proxy (10/10):**
  - visitor `me` → 204
  - wrong password → 401
  - cookie is `HttpOnly; SameSite=Strict`
  - create and delete work with only the cookie
  - logout → `me` 204 and writes 401
  - Basic auth still works for curl
- **Simulated browser, full app:**
  - login form → wrong password message → login → Skills tab loads
  - `sessionStorage` and `localStorage` are **empty**, and `document.cookie` is **empty** (HttpOnly)
  - after a page refresh you're still logged in
  - logout ends the server session

**⚠️ Production:** nginx should send `X-Forwarded-Proto $scheme`, so Tomcat marks the cookie `Secure` over HTTPS.

**Problem:** `{ username, password }` is saved in plaintext, so any XSS on the site exposes the real password.

**Fix (short term):** store only the Base64 `Authorization` header value, and keep it in memory (React state) rather than `sessionStorage`, accepting that the user logs in again after a refresh.
**Fix (proper):** switch the backend to session cookies or a short-lived token (backend change).

---

### [x] 4. Project card links break when `url` or `githubUrl` is missing
**Where:** `components/portfolio/Projects.tsx`, `types/index.ts`

**Fixed on 2026-09-26:** each button only renders when its link is non-empty after trimming, and the row is hidden if neither is set. `url` and `githubUrl` are now `string | null`. That made TypeScript flag `ProjectsTab.openEdit`, which now converts `null` to `""` so the inputs stay controlled.

**Checked** by rendering the Projects section with 5 cases, on the old and new code:
| Case | Old code | New code |
|---|---|---|
| `null` url and github | **crash** (`reading 'startsWith'`) | renders, no buttons |
| empty strings | "View Project" links to the homepage | renders, no buttons |
| whitespace only | broken buttons | renders, no buttons |
| only github set | **crash** | GitHub only |
| both set | both buttons | both buttons |

**Problem** (corrected 2026-09-26):
- **Empty string**, which is what the admin form saves when the field is left blank: "View Project" becomes `window.location.origin + ""` and links back to the homepage, and "GitHub" gets `href=""` and just reloads the page.
- **`null`**, which the backend allows, e.g. a project created through the API without `url`: `project.url.startsWith('http')` throws, and because there's no error boundary, the **whole page goes blank**.
- TypeScript didn't catch this because `types/index.ts` declares both fields as `string`.

**Fix:** Show "View Project" only when `url` is non-empty, and "GitHub" only when `githubUrl` is non-empty. Declare both as `string | null`.

---

### [x] 5. Pages show "No … yet" instead of an error when the API fails
**Where:** `pages/App.tsx`, `pages/Changelog.tsx`

**Fixed on 2026-09-26:**
- New `components/portfolio/LoadErrorBanner.tsx`: a message with a **Try again** button.
- `App.tsx` uses `Promise.allSettled`, so each section loads independently and one failed request no longer empties the page. If any request fails, the banner appears above the About section, and Try again reloads.
- `Changelog.tsx` now has loading, error (banner with retry) and empty states. It also fixes an issue that wasn't in this item: it used to show **"No history entries yet" while still loading**, and permanently if the request failed.

**Checked:** `tsc`, `eslint` (0 problems) and the build pass. Both pages were rendered in a simulated browser against the running backend, with selected requests forced to fail:
| Scenario | Result |
|---|---|
| Main page, all OK | no banner, sections loaded |
| Skills API fails | banner shown; Experience etc. still loaded |
| Network back → Try again | banner gone, skills loaded |
| Whole API down | banner shown; the static About section is still there |
| Changelog while loading | "Loading..." (no longer "No history entries yet") |
| Changelog API fails | banner, not the empty-state text |
| Network back → Try again | banner gone, real content |

**Possible follow-up:** when only some sections fail, those sections still show their "No … yet" text under the banner. Per-section error text fits into the `Section` component (#8).

**Problem:** On error, `App.tsx` logs to the console and renders every section as "No … yet", so visitors see an empty portfolio rather than an error. It uses `Promise.all`, so one failing request empties every section. `Changelog.tsx` has no error handling at all (`getHistory().then(...)` with no `catch`).

**Fix:** Add an `error` state and show a clear message, for example "Couldn't load portfolio data. Please try again later."

---

### [x] 11. GitHub and LinkedIn buttons link to the generic sites
**Added on 2026-09-26. Fixed on 2026-09-26:**
- New `src/constants.ts` with `GITHUB_URL` (`https://github.com/v-galkin`) and `LINKEDIN_URL` (`https://www.linkedin.com/in/vitalii-galkin-b9920016b`). `https://` was added to the LinkedIn URL; without it the browser would treat the link as a path on this site.
- `About.tsx` and `Contact.tsx` both use the constants, so the links only need changing in one place.
- **Checked:** `tsc`, `eslint` and the build pass, and both URLs are in the production bundle. Rendering About and Contact shows all 4 buttons pointing to the real profiles with `target=_blank`, and no generic links left. The GitHub URL answers 200. LinkedIn returns 999 to automated requests (its bot block), so check that one in a browser.
- **Contact email:** now possible through **Admin → Profile** (#14). It's shown as an "Email" button when set.

**Where:** `components/portfolio/About.tsx`, `components/portfolio/Contact.tsx`

**Problem:** every "GitHub" and "LinkedIn" button points to `https://github.com` and `https://linkedin.com`, not to your profiles. The Contact section has no email address or other way to get in touch. On a portfolio, this is the first thing a recruiter clicks.

**Fix:** use the real profile URLs, defined once in `constants.ts` (see P5) and used by both sections. Add an email link (`mailto:`) or a contact method to Contact.

---

### [x] 12. Browser tab title is "frontend", and there's no description
**Added on 2026-09-26. Fixed on 2026-09-26:** `index.html` now has `<title>Vitalii Galkin — Portfolio</title>`, a `<meta name="description">`, and `og:type`, `og:title` and `og:description`. The wording is taken from the About section. The build passes and the dev server serves the new title.

**Still optional:** `og:url` and `og:image`. They need the production domain and a preview image (about 1200×630), which aren't in the repo. Without `og:image`, shared links show text only.

**Where:** `index.html`

**Problem:** `<title>frontend</title>` is left over from the Vite template, so that's what the browser tab, bookmarks and search results show. There's no `<meta name="description">` or Open Graph tags, so links shared on LinkedIn or Slack have no preview text.

**Fix:** set a real title (e.g. "Vitalii Galkin — Portfolio"), and add `<meta name="description">`, `og:title` and `og:description`.

---

### [x] 13. Whitespace-only input passes the form but fails on the server
**Added on 2026-09-26. Fixed on 2026-09-26:**
- #2 made the backend's error visible in the modal.
- `useCrud.save` now runs `trimStrings()` before every create and update. It trims text fields and the strings in list fields, and drops empty list entries. It's done once, in the shared hook, so all 6 tabs are covered.
- **Checked:**
  - `trimStrings({ name: "  Alpha ", url: "   ", techStack: [" Java ", "  ", "React"] })` gives `{ name: "Alpha", url: "", techStack: ["Java", "React"] }`.
  - In the real `SkillsTab` (simulated browser, session login), category `"   "` shows "Category must not be blank" with nothing saved.
  - `"   Trim test   "` with items `"  Go ,   , Rust  "` is saved as `{"category": "Trim test", "items": ["Go", "Rust"]}`.
  - The test record was deleted afterwards.

**Where:** all 6 admin tabs

**Problem:** the admin forms use HTML `required`, which accepts `"   "`. The backend's `@NotBlank` (BUGS.md #3) rejects it with a 400. Because of #2, the save then does nothing and shows no message.

**Fix:** trim values before submitting (this fits into `CrudTab`, #10), and show the backend's `fields` errors from #2.

---

### [x] 14. About, Contact and footer can't be edited from the admin panel
**Added and done on 2026-09-26.** The name, headline, bio and profile links were hard-coded in `About.tsx` and `constants.ts`.

**Backend:**
- Flyway `V3__profile.sql` creates `profiles`, a single row seeded with the previous text.
- Added `Profile`, `ProfileRepository`, `ProfileService`, `ProfileRequest`/`ProfileResponse` (with `@NotBlank` name and `@Email` email) and `ProfileController`.
- `GET /api/profile` is public; `PUT /api/profile` is admin only (covered by the existing `PUT /api/**` rule).

**Frontend:**
- `api/profile.ts` makes one shared request per page load, replaced after a save. `hooks/useProfile.ts` exposes it.
- `About`, `Contact` and `Footer` read the profile. Empty fields hide their element or button.
- The **optional contact email** (the #11 follow-up) adds an "Email" (`mailto:`) button to Contact when it's set.
- `GITHUB_URL` and `LINKEDIN_URL` are removed from `constants.ts`.
- New **Admin → Profile** tab, the first and default tab: a single form (name, headline, bio, GitHub, LinkedIn, email). It trims input, saves empty optional fields as `null`, shows backend validation errors and says "Profile saved.".

**Still in code:** the browser tab title and meta description in `index.html`. They're read before the app loads.

**Checked:**
- **Backend:** 145/145 tests. `ProfileServiceTest` (3) and `ProfileIntegrationTest` (5, real H2 + Flyway) cover the seeded values, public GET, 401 for anonymous PUT, admin PUT, and 400s for a blank name and an invalid email.
- **Local database:** V3 applied on top of the V2 baseline, and `/api/profile` returns the old text.
- **Snapshot:** with the seeded profile, **0 differences** in effective styles and in text and links against the original (53 views, navbar and admin tab bar excluded).
- **Real flow in a simulated browser:**
  - invalid email → "Email must be a well-formed email address"
  - blank name → "Name must not be blank"
  - saving `"  Software & Automation Engineer "` and `" test@example.com "`, with LinkedIn cleared, stored trimmed values and `linkedinUrl: null`
  - the public page then showed the new headline, hid both LinkedIn buttons, and Contact showed `Email → mailto:test@example.com`
  - the original profile was restored afterwards and verified identical

---

## P2 — Remove the retired project

### [x] 6. Delete Docker Sentinel
**Fixed on 2026-09-26:** deleted the 5 `retired/` folders (15 files and folders) and the now-empty `src/data/`. Removed the import and route from `Layout.tsx`, and the `ContainerInfo` and `ContainerStats` types. No project in the local database linked to the page. The build passes, the bundle is about 10 KB smaller (336 → 327 KB), and no references remain.

**Delete these files and folders:**
- `src/pages/retired/`
- `src/components/retired/`
- `src/data/retired/`
- `src/styles/retired/`
- `src/types/retired/`

**Edit:**
- `components/Layout.tsx`: remove the `DockerSentinel` import and the `/projects/docker-sentinel` route
- `types/index.ts`: remove the `ContainerInfo` and `ContainerStats` interfaces (only the retired project used them)

**Check:** if a project in the live database links to `/projects/docker-sentinel`, delete or update it in the admin panel.

---

## P3 — Replace the style system

### [x] 7. Remove the layered `styles/` folder
**Fixed on 2026-09-26** (together with #8): `src/styles/` (11 files, about 570 lines) is **deleted**. Every class now lives in the component that uses it, as plain Tailwind strings with no tokens or `.join(" ")`.
- **Shared looks** are in `components/ui/` (see #8).
- **Single-use classes** stay local: the navbar map is in `Navbar.tsx`, and the project filter toggles are in `Projects.tsx`.
- **The `sm` + `primary` conflict is resolved to what was actually rendered.** The built CSS showed that `px-4`, `py-2` and `text-xs` won, so small buttons are `px-4 py-2 text-xs`. The look is identical and there are no conflicting classes.
- The unused `linkAccent`, `filter`/`icon`/`select`, and the duplicate `badgeStyles.success` went with the folder. CSS shrank from 25.8 KB to 21.7 KB and JS from 327 KB to 318 KB.
- **Deliberately unchanged:** Changelog's category badge colours (`bg-*-900/40`, `rounded-md`) still differ slightly from the project badges. Unifying them would be a visible change; it's a one-line decision for later.

**How "looks the same" was verified.** Every view was rendered in a simulated browser with fixed test data (API stubbed), before and after: 53 views, 3,491 elements. That covered the home page and its filters, the changelog, the navbar (logged out, logged in, dropdown, mobile menu), the admin login and its error, and every admin tab's list, add/edit modal, save error, delete dialog, delete error and load error.
- **Styles:** each element's **effective** style was computed from that build's real CSS (which class wins per property and variant) and compared. **0 differences.** A self-test confirmed the comparer ignores overridden classes and catches real changes.
- **Content:** each element's own text and `href`/`target`/`rel` were compared (1,658 text elements, 122 links). **0 differences.**
- `tsc`, `eslint` (0 problems) and the build pass.
**Problem:**
- Styles are built in layers: `tokens.ts` → `badgeBase` → `badgeStyles.featured` → `.join(" ")`. To find out what one button looks like, you read three files.
- The approach isn't consistent. `badges`, `buttons`, `cards`, `layout` and `tables` use tokens, while `forms`, `modals`, `text` and `navbar` use plain strings.
- Some styles only work in combination. `buttonStyles.sm` has no colour, so it's always written as `` `${sm} ${primary}` ``, and because `primary` also sets `px-4 py-2 text-sm`, the conflict is decided by CSS order.
- There are duplicates: `badgeStyles.featured` and `badgeStyles.success` are identical, and `textStyles.h1–h4` repeat `typographyTokens`.
- Some colours bypass the system: `Changelog.tsx` hard-codes its own badge colours, and the admin tabs and login form use inline classes anyway.

**Fix:** Each reusable component owns its Tailwind classes, and variants are plain maps inside the component:

```tsx
// components/ui/Button.tsx
const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200";
const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
const variants = {
    primary:   "bg-slate-800 hover:bg-slate-600 text-white",
    secondary: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white",
    danger:    "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50",
    ghost:     "text-slate-400 hover:text-white",
};
```

Shared colours such as `bg-slate-900` stay as Tailwind classes. If a real brand colour is needed later, define it once in `index.css` with Tailwind 4 `@theme`, not in TypeScript.

When every component is migrated (#8 to #10), delete `src/styles/`.

---

## P4 — Reusable components

### [x] 8. Create `components/ui/`
**Done on 2026-09-26** (with #7). The new components are `Button`/`ButtonLink` (variant, size), `Card` (default/dark/featured), `Badge`, `Tag`, `Section` (id, title, alt), `Timeline`/`TimelineItem`, `Modal`/`ModalFooter`/`ConfirmDialog`, `Field`/`Input`/`Textarea`/`Select`, `Table`/`Tr`/`Td`, and `Footer`: 251 lines in total. All portfolio sections, both pages and all 6 admin tabs use them. `src/` went from 3,237 lines at the start to 2,291.
- **Skipped:** `EmptyState` (it's a one-line `<p>`) and `Checkbox` (used once). Changelog keeps its own category colours (see #7).
- **Bonus accessibility:** `Field` links each label to its input (`htmlFor`/`id` via `useId`), and the modal's × button has `aria-label="Close"`.


| Component | Replaces | Used in |
|---|---|---|
| `Button` (props: `variant`, `size`, `as="a"`) | `buttonStyles.*` and inline button classes | everywhere |
| `Badge` (prop: `color`: emerald, purple, yellow, red, blue, slate) | `badgeStyles.*` and `categoryColors` in Changelog | Projects, Changelog, admin |
| `Tag` | `textStyles.tag`, `badgeStyles.tech` | Projects, Skills |
| `Card` (prop: `variant`: default, featured) | `cardStyles.*` | all portfolio sections |
| `Section` (props: `id`, `title`, `alt`) | the repeated `<section><div container><h2 sectionTitle>` wrapper | 7 sections, Changelog |
| `EmptyState` | the repeated `<p className={textStyles.secondary}>No … yet</p>` | all sections |
| `Timeline`, `Timeline.Item` | the vertical line and dot markers | Experience, Changelog |
| `Modal` (props: `title`, `onClose`, `size`) | `modalStyles.*` overlay, header and body | 6 admin tabs |
| `ConfirmDialog` | the delete-confirm modal | 6 admin tabs |
| `Field`, `Input`, `Textarea`, `Select`, `Checkbox` | `formStyles.*` | admin tabs, login |
| `Footer` | the footer | App, Changelog |

Example of how a section reads afterwards:

```tsx
<Section id="certifications" title="Certifications" alt>
    {certifications.length === 0 ? <EmptyState>No certifications yet.</EmptyState> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certifications.map((c) => <CertificationCard key={c.id} cert={c} />)}
        </div>
    )}
</Section>
```

---

### [x] 9. Add a `useCrud` hook and a generic API client
**Done on 2026-09-26.** `hooks/useCrud.ts` came with #2. The generic client:
- **New `api/crud.ts`:** `crudApi<T>(path)` returns typed `list`, `create`, `update` and `remove` (the `CrudApi` shape `useCrud` expects).
- **New `api/resources.ts`:** `projectsApi`, `experiencesApi`, `educationsApi`, `skillsApi`, `certificationsApi` and `historyApi`, each defined once.
- **Deleted `api/admin.ts`** (18 functions). `api/client.ts` is now just the axios instance.
- The admin tabs pass the resource straight to `useCrud(projectsApi, …)`, so the module-level `api` objects are gone. The public pages (`App.tsx`, `Changelog.tsx`) use `xxxApi.list()`.
- **Bonus:** the public getters used to be untyped (`client.get` → `any`). Every call is now typed.
- **No auth interceptor needed:** since #3 the session cookie is sent automatically, so there's no header to add.

**Checked:**
- `tsc`, `eslint` (0 problems) and the build pass.
- **UI:** the 53-view snapshot gives **0 differences** in effective styles and content compared with after #7.
- **Real backend** (session login in a simulated browser): for **all 6 resources**, `list` matches the backend directly, then create → update → delete all succeed, and the list count is back to where it started.

**Problem:** Each of the 6 admin tabs writes the same load, create, update and delete code and the same modal state. `api/admin.ts` has 18 nearly identical functions, and each one builds a new axios instance.

**Fix:**

```ts
// api/crud.ts
export const crudApi = <T extends { id: number }>(path: string) => ({
    list:   ()                              => client.get<T[]>(path).then((r) => r.data),
    create: (data: Omit<T, "id">)           => client.post<T>(path, data),
    update: (id: number, data: Omit<T, "id">) => client.put<T>(`${path}/${id}`, data),
    remove: (id: number)                    => client.delete(`${path}/${id}`),
});
```

- Use one axios `client`, with an interceptor that adds the `Authorization` header when the user is logged in. `api/admin.ts` is then no longer needed.
- `hooks/useCrud.ts` returns `{ items, loading, error, create, update, remove, reload }` and handles errors in one place (#2).

---

### [x] 10. Replace the 6 admin tabs with one `CrudTab`
**Done on 2026-09-26.**
- **New `components/admin/CrudTab.tsx`:** one generic component that renders the header with "+ Add …", the load error, mobile cards, the desktop table, the add/edit `Modal` with the save error, and the `ConfirmDialog` with the delete error. It uses `useCrud` (#2/#9) and the `ui/` components (#8).
- **Field types:** `text`, `textarea`, `select`, `checkbox`, `list` (a `string[]` edited as comma-separated text, or one per line in a textarea) and `row` (two fields side by side).
- **Each tab is now just configuration,** 30–45 lines: `title`, `itemName`, `api`, `empty`, `columns`, `tableMinWidth`, `mobileCard` and `fields`. `Admin.tsx` is unchanged.
- **Generic fixes that came with it:**
  - Editing an item converts **any** `null` to `""`, not just the URLs in Projects.
  - Only the form's own fields are sent; the item's `id` isn't copied into the payload any more.
- **Size:** admin tabs are now 443 lines (`CrudTab` 206, plus 30–45 per tab), down from 789 (about 890 originally). `src/` is at 1,923 lines, down from 3,237. The JS bundle is 308 KB, down from 336 KB at the start.

**Checked:**
- `tsc`, `eslint` (0 problems) and the build pass.
- **All 53 views:** **0 differences** in effective styles compared with the original snapshot, and **0 differences** in text and links.
- **Real backend, simulated browser, session login:**
  - **Projects add:** tech stack `" Go ,  , Rust "`, category `ai-assisted` and featured all saved correctly, as `["Go","Rust"]`.
  - **Projects edit:** the form shows `"Go, Rust"`, the dropdown value and the ticked checkbox. Saving a rename keeps the other fields.
  - **A project with `null` URLs:** it opens with empty inputs and doesn't crash.
  - **Experiences:** a responsibilities textarea of `"First

  Second  
"` is saved as `["First","Second"]` and shown again as `"First
Second"`.
  - Deleting through the UI works. All test data was removed, and the counts are back to 0 projects and 2 experiences.
**Problem:** `ProjectsTab`, `ExperiencesTab`, `EducationTab`, `SkillsTab`, `CertificationsTab` and `HistoryTab` are about 90% the same, at 130–157 lines each.

**Fix:** Write one generic component and describe each tab as config:

```tsx
<CrudTab<Project>
    title="Projects"
    api={crudApi<Project>("/projects")}
    empty={{ name: "", description: "", techStack: [], url: "", githubUrl: "", featured: false, category: "self-built" }}
    columns={[
        { label: "Name", render: (p) => p.name },
        { label: "Category", render: (p) => p.category },
        { label: "Featured", render: (p) => (p.featured ? "Yes" : "No") },
    ]}
    fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "techStack", label: "Tech Stack (comma separated)", type: "list" },
        { name: "url", label: "URL", type: "text" },
        { name: "githubUrl", label: "GitHub URL", type: "text" },
        { name: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
        { name: "featured", label: "Featured", type: "checkbox" },
    ]}
/>
```

`CrudTab` renders the header with the "+ Add" button, the mobile cards, the desktop table, the `Modal` form and the `ConfirmDialog`. The `list` field type handles comma-separated arrays (`techStack`, `items`, `responsibilities`), which each tab currently parses by hand.

**Lint errors: already fixed by #2** (via `useCrud`). Before that, `npm run lint` failed with 5 errors (`react-hooks/set-state-in-effect`), one each in `CertificationsTab`, `EducationTab`, `ExperiencesTab`, `ProjectsTab` and `SkillsTab`, all from the same `useEffect(() => { load(); }, [])` pattern. Loading in `useCrud` fixes all five at once.

---

## P5 — Smaller cleanups

**Done on 2026-09-26** (except the two items that belong in FUTURE_IMPROVEMENTS.md).

- [x] **Navbar section links** (the chosen option: add them, rather than remove the code):
  - Experience · Education · Projects · Skills · Certifications · Contact now appear in the navbar (desktop) and the hamburger menu (mobile). The mobile menu used to open empty.
  - Links are `/#id`, so they work from any page. `App.tsx` scrolls to the hash once its data has loaded, because the sections don't exist yet when the page opens.
  - `index.css` adds `scroll-padding-top` so the sticky navbar doesn't cover section headings.
  - **The active-section highlight was rewritten.** The old `IntersectionObserver` only ran once when the navbar mounted, before the home page had rendered its sections, so it could never highlight anything. It's now a scroll listener using `findActiveSection()` in `activeSection.ts`, with a check that a short page has no "bottom".
- [x] **Navbar "History"** is now a `NavLink` styled like the other links and highlighted when active. On mobile it sits in the hamburger menu with the section links. "Main Page" stays the brand link.
- [x] **Shared constants:** `PROJECT_CATEGORIES` in `constants.ts` is used by `Projects.tsx` (filters and badge labels) and by `ProjectsTab`'s select options. `NAV_SECTIONS` holds the navbar links.
- [x] **`AuthContext`:** `context/AuthProvider.tsx` (session check on load, logout on `setAuth(null)`), `context/authContext.ts` and the `useAuth()` hook. `main.tsx` wraps the app in `<AuthProvider>`. `Layout`, `Navbar` and `Admin` read it with `useAuth()` instead of receiving `auth`/`setAuth` props. `Admin.tsx` no longer re-exports `Auth`, and the tabs are chosen from a map instead of 6 `&&` lines.
- [x] **Comments:** all `{/* X START */}` / `{/* X END */}` markers are gone (0 left, from about 150).
- [x] **Footer year:** done with #7, in `ui/Footer.tsx`.
- [x] **Unused assets:** done earlier.
- [x] **"Page not found" route:** `<Route path="*">` renders `pages/NotFound.tsx` with a "Back to the main page" button. The old `/projects/docker-sentinel` link lands there now.
- [x] **Accessibility:**
  - The admin login form uses `Field`/`Input` (labels linked to inputs, same look) plus `autoComplete`, and its error has `role="alert"`.
  - The hamburger has `aria-label` ("Open menu"/"Close menu") and `aria-expanded`, and its icon is `aria-hidden`.
  - The user dropdown button has `aria-haspopup` and `aria-expanded`.
- [ ] **Dockerfile** (`npm ci`, Node 22): **moved to FUTURE_IMPROVEMENTS.md #3**. It only matters if the frontend container is kept.
- [ ] **Frontend CI** (lint and build workflow): **moved to FUTURE_IMPROVEMENTS.md #1**, together with the CD pipeline, as planned there.

**Checked:**
- `tsc`, `eslint` (0 problems) and the build pass.
- **Snapshot (53 views):** everything outside the navbar has **0 differences** in effective styles compared with the original, and 0 in text and links (2,949 elements). That includes the admin login form now using `Field`/`Input`.
- **The navbar** shows the new links with the right hrefs. History is active on `/history`, the mobile menu lists all links, and the logged-in dropdown is unchanged.
- **Real app** (simulated browser, running backend):
  - Opening `/#skills` renders the page and then scrolls to `skills`.
  - Logged out, the navbar shows Login.
  - The highlight is `none` at the top, then `Experience`, then `Projects` as you scroll, then `Contact` at the bottom. A short page doesn't highlight Contact.
  - `/projects/docker-sentinel` shows "Page not found" with a link to `/`.

---

## Target structure

```
src/
  api/
    client.ts          one axios instance with an auth interceptor
    crud.ts            crudApi<T>(path)
  components/
    ui/                Button, Badge, Tag, Card, Section, EmptyState, Timeline,
                       Modal, ConfirmDialog, Field/Input/Textarea/Select/Checkbox, Footer
    admin/
      CrudTab.tsx
      tabs.tsx         the 6 tab configs
    portfolio/         About, Experience, Education, Projects, Skills, Certifications, Contact
    Navbar.tsx
    Layout.tsx
  context/
    AuthContext.tsx
  hooks/
    useCrud.ts
  pages/
    Home.tsx           (renamed from App.tsx)
    Admin.tsx
    Changelog.tsx
  types/
    index.ts
  constants.ts
  index.css
  main.tsx
```

---

## Suggested order

1. ✅ **Visitor-facing quick fixes:** #11, #12, #4 and the unused assets (done).
2. **#6: remove the retired project.** Quick and low risk, and it makes everything after it smaller.
3. ✅ **#9, #10, #2, #13: `useCrud`, `CrudTab`, error handling** (all done; lint is clean).
4. ✅ **#8, #7: `ui/` components, `styles/` deleted** (done, verified identical).
5. ✅ **#3: auth storage** (session cookie, done).
6. ✅ **P5: cleanups** (done; the Dockerfile and CI items moved to FUTURE_IMPROVEMENTS.md).

After each step, run `npm run lint` and `npm run build`, then click through `/`, `/history` and `/admin` to check nothing looks different.
