# Expert Seva Diwas

Expert Seva Diwas is a production-oriented alumni seva tracking portal for the Expert Group of Institutions Alumni Network, branded as EXPERT Alumni.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth credentials login
- React Hook Form + Zod
- Recharts
- TanStack Table
- Nodemailer
- WATI API wrapper
- Docker + Docker Compose
- Caddy reverse proxy

## Local setup

1. Copy `.env.example` to `.env`.
2. Update secrets and connection values.
3. Install packages with `npm install`.
4. Start Postgres and the app with `docker compose up --build`.
5. Run Prisma migrations with `docker compose run --rm app npm run prisma:migrate`.
6. Bootstrap baseline records with `docker compose run --rm app npm run prisma:seed`.

### Tooling note

- Regenerate `package-lock.json` with Node 20 and npm 10.8.2 to match the production Docker build.
- The repo includes `.nvmrc` and `package.json#packageManager` for that reason.
- Avoid running `npm install` directly on the production checkout. Let Docker consume the committed lockfile with `npm ci`.
7. Open [http://localhost](http://localhost).

## Initial admin login

- Email: value from `DEFAULT_ADMIN_EMAIL`
- Password: value from `DEFAULT_ADMIN_PASSWORD`

## Useful commands

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Production deployment on EC2

### Recommended sizing

- EC2 instance: `t3.large` for launch if you expect light-to-moderate usage and want app + PostgreSQL on the same host.
- EC2 upgrade path: move to `t3.xlarge` if reports, file uploads, or concurrent admin/public traffic grow noticeably.
- EBS volume: start with `gp3` at `80 GB`.
- EBS minimum for a very small pilot: `40 GB gp3`.
- Why this baseline: it leaves headroom for Ubuntu, Docker images, PostgreSQL data, uploads, backups, and snapshots.

### Production steps for `esd.expertedu.co.in`

1. Create an Ubuntu 24.04 LTS EC2 instance in your preferred AWS region.
2. Choose `t3.large`, attach an `80 GB gp3` root volume, and allow inbound `22`, `80`, and `443` in the security group.
3. Allocate an Elastic IP and attach it to the instance.
4. Create an `A` record for `esd.expertedu.co.in` pointing to that Elastic IP.
5. SSH into the server and install Docker Engine plus the Docker Compose plugin.
6. Clone this repository onto the instance, for example into `/opt/esd-portal`.
7. Copy `.env.example` to `.env`.
8. Set these production values in `.env`:
   - `APP_DOMAIN=esd.expertedu.co.in`
   - `NEXTAUTH_URL=https://esd.expertedu.co.in`
   - `APP_URL=https://esd.expertedu.co.in`
   - `NEXTAUTH_SECRET=` a long random secret
   - `DATABASE_URL=postgresql://postgres:<strong-password>@postgres:5432/expert_seva_diwas`
   - `DEFAULT_ADMIN_EMAIL=` your real admin email
   - `DEFAULT_ADMIN_PASSWORD=` a strong temporary password
   - SMTP and WATI values only when you are ready to enable those integrations
9. Run `chmod +x deploy.sh backup.sh restore.sh`.
10. Pull the latest code with `git pull origin main`.
11. For the first production deploy, run `./deploy.sh --bootstrap`.
12. Wait for Caddy to issue the TLS certificate for `esd.expertedu.co.in`.
13. Verify `https://esd.expertedu.co.in` and `https://esd.expertedu.co.in/api/health`.
14. Sign in with the initial admin credentials from `.env`, rotate that password, and add the real operating admins.
15. Keep PostgreSQL on the same host by continuing to use the `postgres` Docker service from `docker-compose.yml`.
16. Schedule backups:
   - database dumps with `./backup.sh`
   - EBS snapshots
   - backups of `storage/uploads` if uploaded files matter operationally

### Operational notes

- Use `./deploy.sh --bootstrap` only for the first deployment or when you intentionally want to refresh baseline records.
- Use `git pull origin main && ./deploy.sh` for routine code updates.
- The bootstrap seed no longer inserts demo alumni, demo cases, demo stories, badges, certificates, or fake impact metrics.
- Caddy now reads `APP_DOMAIN`, so the same config works for localhost and production.
- If usage grows beyond a light-to-moderate workload, move PostgreSQL off the app instance before scaling the web tier horizontally.

## Backups

- Create a backup: `./backup.sh`
- Restore a backup: `./restore.sh backups/db-YYYYMMDD-HHMMSS.sql`

## Privacy and security notes

- Beneficiary private data is stored separately from public-safe summaries.
- Public dashboards use approved cases only.
- Public stories are anonymized unless explicit consent is captured.
- SMTP and WATI credentials must be supplied only through environment variables.
