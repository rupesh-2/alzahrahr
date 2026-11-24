# Al Zahra HR — Next.js

Next.js (App Router) version of the Laravel + Livewire + Filament site in the parent folder.
It has the same public pages, the contact and apply forms, the company-profile PDF download,
and an admin panel at `/admin` that replaces Filament.

## Run it

Requires Node.js 22.13 or newer (it uses the built-in `node:sqlite`).

```bash
cp .env.example .env.local   # then fill in SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev                  # http://localhost:3000
```

The database (`storage/app.sqlite`) and its tables are created on first request. The first admin
account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` when there are no users yet. Sign in at
`/admin/login`, then fill in **Company profile** first: the forms email that address and the
header and footer show its contact details.

Production: `npm run build && npm start`. Serve it over HTTPS, because the admin session cookie is
`Secure` in production. Keep `storage/` on a persistent disk and back it up, since it holds the
database and every uploaded file.

## Where things are

| Laravel                                   | Next.js                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `routes/web.php` + `app/Livewire/*`        | `app/(site)/**/page.tsx` (same URLs)           |
| `livewire/header`, `livewire/footer`       | `components/site-header.tsx`, `site-footer.tsx`|
| `Contacts::contactUs`, `ApplyNow::applyNow`| Server Actions in `app/(site)/actions.ts`      |
| `HomeController::downloadPdf`              | `app/download-pdf/route.ts`                    |
| Filament resources                         | `app/admin/(panel)/*`, actions in `app/admin/actions.ts` |
| Eloquent models + migrations               | `lib/db.ts` (schema), `lib/data.ts` (queries)  |
| Spatie media library                       | `lib/storage.ts`; files in `storage/uploads`, served by `app/media/[...path]` |
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
