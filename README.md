# Lifewood Careers Portal

A modern job‑application website built with Next.js (App Router), Tailwind CSS, and Supabase. It includes a public application form and a secure admin dashboard for reviewing, approving, and exporting applications.


## Tech Stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Supabase (Database + Storage)
- Date‑Fns, Lucide Icons, XLSX

## Getting Started (Local)
1) Install dependencies
```bash
npm install
```

Optional: Install from requirements.txt (documentation list)
```bash
# Node projects normally use package.json; this mirrors the same deps
cat requirements.txt | xargs -n 1 npm install --save
```

2) Configure environment variables
Create a file named `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3) Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000

## Admin Login
- Default admin (for demo/testing):
  - Email: `admin@lifewood.com`
  - Password: `admin123`

## Supabase Setup
- Tables used:
  - `applications`: stores form submissions
  - `admin_users`: optional, for additional admin accounts
- Storage bucket:
  - `resumes`: stores uploaded PDF resumes (publicly accessible via generated URL)


## License
This project is provided as‑is for internal use. Add your preferred license here if needed.
