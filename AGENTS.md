# AGENTS.md

Refactor plan for the lazer-player-server back-end.

## Context

Small NestJS 11 + TypeScript back-end (~10 KB of code) that reads a local osu!lazer
Realm DB (`client.realm`) and streams audio/image files to clients. Builds cleanly.
Zero tests, despite jest being fully configured.

## Decisions made

- Add `/api` global prefix in `main.ts` (README already documents `/api/*`; align code).
- Prioritize **stability → tests**.
- Include a test suite (unit + supertest).
- Realm model decoupling deferred to a later sprint.

## Refactor phases

### Phase 1 — Stability (correctness & robustness)

**1.1 Add `/api` global prefix** (`src/main.ts`)
- `app.setGlobalPrefix('api')` before `listen`.
- Verify routes resolve to `/api/songs`, `/api/audio/:hash`, `/api/image/:hash`.
- Flag to clients that endpoints now live under `/api` (existing clients hit root).

**1.2 Harden input validation**
- `SongsController`: replace ad-hoc `parseInt` fallbacks with input DTOs (`SongsQueryDto`
  using `@IsInt`, `@IsOptional`, `@Min(1)`) + `ClassValidator`.
- `ImageController`: validate `width`/`height` the same way; reject non-numeric.
- Normalize page/size defaults so negative/zero values return `400` instead of bad slices.

**1.3 Consolidate error handling**
- Extract the repeated `hash.length < 3` guard into a shared helper used by both audio
  and image services.

**1.4 Improve logging interceptor** (`src/common/interceptors/logging.interceptor.ts`)
- Log at request start with request id + method + url; log on completion with status code
  + duration.

### Phase 2 — Module hygiene (structure & separation)

**2.1 SongsService mapper extraction**
- Pull inline file-mapping + warning logic out of `getSongsList` into a pure
  `mapBeatmapSetToDto(set)` function in a separate file.
- Move case-insensitive `File` lookup into a pure helper.

**2.2 Byte-range parsing**
- Move `parseByteRange` from inside `audio.service.ts` into its own
  `src/common/.../byte-range.ts` module, exported and typed.

**2.3 Harmonize streaming responsibility**
- Standardize: services return a plain `Readable`; controllers wrap with `StreamableFile`
  + headers. Pick one direction and apply uniformly (audio currently does it in the
  service; move to controller for consistency).

**2.4 Data-layer note (deferred)**
- `database.model.ts` (4 KB) couples Realm schema classes to runtime. Decoupling is a
  larger effort — follow-up, not this round.

### Phase 3 — Tests

**3.1 Unit tests (jest, existing config)**
- `parseByteRange`: suffix form, open range, full range, out-of-bounds → `unsatisfiable`,
  malformed → `null`.
- `mapBeatmapSetToDto`: metadata mapping, missing audio file warning path, unicode fallbacks.

**3.2 Integration tests (supertest)**
- `GET /api/songs` with pagination + search.
- `GET /api/audio/:hash` returns `200`/`404`/`416` for missing/invalid hash and
  unsatisfiable range.
- `GET /api/image/:hash` returns `200`/`404`.

**3.3 Build + lint gate**
- `npm run build`, `npm run lint`, `npm test`, `npm run test -- --coverage`.

## Effort & risk

- Low risk: Phases 1–3 additive/non-breaking. Prefix is the one behavior change.
- Medium: full integration runs need a real Realm file; unit tests need no DB.

## Suggested commit sequence

1. `feat(api): add /api global prefix`
2. `fix(songs): validate query params via DTO`
3. `refactor(songs): extract beatmap set mapping`
4. `refactor(audio): extract parseByteRange`
5. `refactor(logging): request/response timing`
6. `test: add unit + supertest suite`
