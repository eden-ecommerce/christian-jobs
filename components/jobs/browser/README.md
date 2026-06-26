# Jobs Browser Components

Indeed-style split-pane jobseeker interface for `/christian-jobs`.

## Architecture

```
app/(site)/page.tsx          Server: initial Algolia search + facets + optional vjk detail
components/jobs/browser/     Client: split-pane UI, URL state, infinite scroll
app/api/jobs/                Client fetch endpoints for pagination and detail
lib/jobs/search-params.ts    URL ↔ filter state mapping
lib/algolia/jobs.ts          Server-side Algolia queries (unchanged backend)
```

## Key Components

| Component | Role |
|-----------|------|
| `JobsBrowser` | Root client shell. Owns URL state (`useSearchParams`), job list, selection (`vjk`), infinite scroll, and mobile overlay. |
| `JobsSearchBar` | Sticky keyword + location search. Submits update URL and refetch list. |
| `JobsFilterPills` | Horizontal filter pills with popover dropdowns. |
| `JobsListPane` | Left pane: result count, scrollable list, intersection-observer infinite scroll. |
| `JobListItem` | Compact selectable card row with bookmark, selected-state left border (`#2d6a4f`). |
| `JobDetailPanel` | Right pane: sticky action bar, metadata grid, description, org info, similar jobs. |
| `JobsMobileDetail` | Full-screen slide-in detail for viewports `< 768px`. |
| `JobsFeaturedCarousels` | Featured + charity job carousels below the split pane. |

## URL Parameters

| Param | Purpose |
|-------|---------|
| `q` | Keyword search |
| `location` / `place` | Location label |
| `lat`, `lng`, `radius` | Geo search |
| `contractType` | Contract type (repeatable) |
| `organisationType` | Org type (repeatable) |
| `workType` | `any`, `onsite`, `hybrid`, `remote` |
| `denomination` | Denomination (repeatable, when indexed) |
| `minSalary` | Minimum salary threshold |
| `datePosted` | `24h`, `week`, `month` |
| `sort` | `date_desc` (default) or `relevance` |
| `category` | Job category facet |
| `vjk` | Selected job ID (Indeed-style shareable selection) |
| `page` | Pagination (1-based in URL, 0-based internally) |

## State Management

- **Server initial render**: `page.tsx` calls `searchJobs()` and optionally `getJobById()` when `vjk` is present.
- **Client updates**: Filter/search changes call `router.replace()` (no full reload) then fetch `/api/jobs`.
- **Infinite scroll**: Appends pages via `/api/jobs?page=N`.
- **Job detail**: Fetched from `/api/jobs/:id`, cached in-memory module map for prefetch-on-hover.
- **Bookmarks**: Existing `useSavedJobs` localStorage hook via `SaveJobButton`.

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/jobs` | GET | Paginated search (Algolia wrapper) |
| `/api/jobs/:id` | GET | Job detail + organisation + similar jobs |
| `/api/jobs/featured` | GET | Featured + charity carousels |
| `/api/jobs/filters` | GET | Dynamic facet options |

## Accessibility

- Job cards are keyboard-activatable (`Enter` / `Space`).
- Focus moves to detail panel on selection (`tabIndex={-1}` + `focus()`).
- Filter popovers trap Tab focus and restore focus to trigger on close.
- Apply button includes job title in `aria-label`.

## Mobile

Below `768px` the split pane collapses to a list-only view. Selecting a job opens `JobsMobileDetail` with a back button that preserves scroll position.
