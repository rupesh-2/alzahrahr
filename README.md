# Al Zahra HR — Next.js

Website and admin panel for Al Zahra Human Resource Consultancy, built with Next.js (App Router).
It was ported from an earlier Laravel + Livewire + Filament app (see the git history before the
Next.js move). It has the public pages, the contact and apply forms, the company-profile PDF
download, and an admin panel at `/admin`.

## Run it

Requires Node.js 20 or newer.

```bash
cp .env.example .env.local   # then fill in SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev                  # http://localhost:3000
```

The database (`storage/app.sqlite`) and its tables are created on first request. The first admin
account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` when there are no users yet. Sign in at
`/admin/login`, then fill in **Company profile** first: the forms email that address and the
header and footer show its contact details.

Locally, with the Turso and Blob variables empty, data lives in `storage/` (a SQLite file plus
`storage/uploads/`).

## Deploy on Vercel

Vercel can't keep files written at runtime, so production uses a hosted database and file store:

1. **Database (Turso):** in the Vercel project, open *Storage* (or the Marketplace), add **Turso**,
   create a database and connect it to the project. That sets `TURSO_DATABASE_URL` and
   `TURSO_AUTH_TOKEN`. (If you create the database on turso.tech instead, add those two
   variables yourself.) Tables are created automatically on the first request.
2. **Files (Vercel Blob):** in *Storage*, create a **Blob** store with **public** access and connect
   it to the project. That sets `BLOB_READ_WRITE_TOKEN`.
3. **Settings → Environment Variables:** add `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   (and `ADMIN_NAME`), plus the `SMTP_*` and `MAIL_FROM_*` values for real email.
4. Redeploy. Sign in at `/admin/login` and fill in **Company profile**.

Vercel caps request bodies at 4.5 MB, so admin uploads go from the browser straight to Blob
(`app/api/blob-upload`), and only the file URL is sent to the server. The public apply form
(three files of up to 1 MB) still posts normally.

On any other host, `npm run build && npm start` works without Turso or Blob, provided `storage/`
is on a persistent disk. Serve over HTTPS, since the admin session cookie is `Secure` in production.

## Where things are (compared with the old Laravel app)

| Laravel                                   | Next.js                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `routes/web.php` + `app/Livewire/*`        | `app/(site)/**/page.tsx` (same URLs)           |
| `livewire/header`, `livewire/footer`       | `components/site-header.tsx`, `site-footer.tsx`|
| `Contacts::contactUs`, `ApplyNow::applyNow`| Server Actions in `app/(site)/actions.ts`      |
| `HomeController::downloadPdf`              | `app/download-pdf/route.ts`                    |
| Filament resources                         | `app/admin/(panel)/*`, actions in `app/admin/actions.ts` |
| Eloquent models + migrations               | `lib/db.ts` (libSQL schema), `lib/data.ts` (queries) |
| Spatie media library                       | `lib/storage.ts`: Vercel Blob, or `storage/uploads` locally (served by `app/media/[...path]`) |
| Mailables + email views                    | `lib/mail.ts`, message bodies in the actions   |

## Behaviour kept from the Laravel app

- Vacancies are deleted 8 days after they are posted, checked whenever the home or vacancies page loads.
- The apply form requires a CV, passport scan and photo of up to 1 MB each. They are sent as email attachments and not stored.
- Without `SMTP_HOST`, emails are only printed to the server log, like `MAIL_MAILER=log`.

## Deliberate differences

- Emails are sent **from** `MAIL_FROM_ADDRESS`, with the visitor's address in Reply-To. The
  Laravel app used the visitor's address as the sender, which mail providers reject under SPF/DMARC.
- One company profile record, edited on a single page, instead of a Filament list.
- Each event gallery photo and each client logo is its own record, and you can upload several at once.
- Not ported from Filament: password reset by email, email verification, bulk delete, and the
  roles/permissions tables (all admins have the `admin` role).
- Existing data in the Laravel MySQL/SQLite database is not migrated automatically.
