# 🏦 BankLocator.sa

**محدد فروع البنوك السعودية | Saudi Bank & ATM Locator**

All Saudi banks in one map. Find nearest branches, ATMs, and working hours.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/BankLocator.git
cd BankLocator
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open SQL Editor and paste contents of `supabase_schema.sql`
3. Run the SQL to create tables and seed data
4. Go to Settings → API and copy:
   - Project URL
   - anon public key

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
BankLocator/
├── public/
│   └── assets/
│       ├── announcements/   # News/stories images
│       ├── banks/           # Bank logos
│       └── banklocator.mp4  # Animated logo
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── data/                # Static JSON data
│   │   └── announcements.json
│   ├── lib/                 # Supabase client
│   └── styles/              # CSS files
├── supabase_schema.sql      # Database schema
└── vercel.json              # Deployment config
```

---

## 📰 How to Update Announcements/Stories

1. Add image to `public/assets/announcements/`
2. Edit `src/data/announcements.json`:

```json
{
  "id": "ann-004",
  "image": "story-4.jpg",
  "headline_ar": "عنوان بالعربي",
  "headline_en": "English headline",
  "source": "Bank Name",
  "date": "2026-03-17",
  "link": "https://..."
}
```

3. Push to GitHub → auto-deploys to Vercel

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

---

## 🔧 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Maps:** Leaflet + React-Leaflet
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Icons:** Lucide React

---

## 📧 Contact

**Arwa Enterprises**  
Email: connect.arwaenterprises@gmail.com

---

## 📄 License

© 2026 BankLocator.sa — All rights reserved.
